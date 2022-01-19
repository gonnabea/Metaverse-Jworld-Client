import type { NextPage } from 'next'
import { FormEvent, useEffect, useRef, useState } from 'react';
import io, { Socket } from "socket.io-client";
import gql from 'graphql-tag';
import { Cache, useQuery, Resolver, makeVar, useReactiveVar, useLazyQuery } from '@apollo/client';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useRouter } from 'next/router';
import SiteMark from '../../components/common/SiteMark';
import { applyMe } from '../../stores/loggedUser';
import PageTitle from '../../components/common/PageTItle';
import { GETME } from '../../apis/gql-queries/user';
import BottomUI from '../../components/common/BottomUI';
import { applyChatStatus, setChatStatus } from '../../stores/chatStatus';
import { GETROOMS } from '../../apis/gql-queries/miniHompi';
import useGetMe from '../../hooks/useGetMe';
import useWebsocket from '../../hooks/useWebsocket';








const MiniHompiLobby:NextPage = () => {
    const { chatInput, startBgm } = useReactiveVar(applyChatStatus);
    const {me} = useReactiveVar(applyMe);
    const [userId, setUserId] = useState();
    const [localChats, setLocalChats] = useState([]);
    const [socketIoClient, chatContents, setChatContents, newMsgCount, setNewMsgCount] = useWebsocket();

    const router = useRouter()

    
 
    // const [reqGetMe, {loading, error}] = useLazyQuery(GETME, {
    //     context: {
    //         headers: {
    //             "Authorization":  "Bearer " + jwtToken
    //         }
    //     }
        
    // })

    const {data, loading, error} = useQuery(GETROOMS)
    const [reqGetMe, getMeLoading] = useGetMe()
    
    // 로비 입장 시 로그인 된 유저 정보 가져오기
    
    const getUserFromToken = async() => {      
        
        const { data: {getMe: {user}} } = await reqGetMe()
        console.log(user)
        setUserId(user.id)
    }

    


        // 로비 채팅 전송
        const sendBroadChat = (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            
            
            if(e.target[0].value.length > 0){
                socketIoClient.emit("chat", {
                    nickname: me.nickname,
                    text: e.target[0].value
                });
                
              
               
                setChatStatus({
                    chatContents: [...chatContents, {client: me.nickname, msg: e.target[0].value}],
                    newMsgCount,
                    sendBroadChat,
                    chatInput,
                    startBgm
                })
                
                // 채팅 전송 후 다시 포커스 해주기 위함.
                setTimeout(() => {
                    chatInput.current?.focus();
                    chatInput.current.value = ""
                    const chatScreen = document.getElementById("chatScreen");
                    chatScreen?.scrollTo({
                        top: chatScreen.scrollHeight,
                        left: 0,
                        
                      })
                }, 0)
            }
        }
    
    
    useEffect(() => {
        
        console.log(me)
        if(!me) {
            getUserFromToken()
        }
        else {
            setUserId(me.id)
        }
        console.log(chatContents)
            console.log(newMsgCount)
            console.log(sendBroadChat)
            console.log(chatInput)
            console.log(startBgm)
            
        
    }, [])
    
    return(
        <section className="w-screen h-screen overflow-x-hidden">
            <SiteMark bgColor={"bg-green-500"}/>
            <PageTitle title="Rooms" />

            <div className="grid justify-items-center lg:grid-cols-3 gap-4 md:grid-cols-2 pl-4 content-center">
                {data ? JSON.parse(data.getAllMiniHompis.hompisWithOwners).map(
                    ({miniHompi, owner}, key) => {
                        console.log(JSON.parse(data.getAllMiniHompis.hompisWithOwners))
                        return(
                            <a key={key} onClick={() => router.push({
                                pathname: `/mini_homepage/room/${miniHompi.id}`, 
                                query: {owner: owner?.nickname}})}  
                                className={`${miniHompi.ownerId === userId ? " text-black" : "bg-white text-black"} p-6 w-10/12 flex justify-left align-middle text-left rounded-xl border-2 border-black hover:bg-black hover:text-white cursor-pointer`} >
                            {console.log(data)}
                            <div className="flex flex-col">

                            <cite className="text-2xl">{owner?.nickname}'s Room</cite>
                            <span className="text-2xl">{miniHompi.createdAt}</span>
                            </div>
                            {miniHompi.ownerId === userId ? <span className="text-white text-bold bg-green-500 rounded text-center w-4/12 h-6 relative right-0">★ MyRoom</span> : null}
                            
                            </a>
                        )
                    }
                ): null}
                </div>
            {
                console.log(chatContents)}
                {console.log(newMsgCount)}
                {console.log(sendBroadChat)}
                {console.log(chatInput)}
                {console.log(startBgm)}
            
                <BottomUI 
            chatContents={chatContents} 
            newMsgCount={newMsgCount}
            sendBroadChat={sendBroadChat}
            chatInput={chatInput}
            startBgm={startBgm}
         
            />
            
        </section>
    )
}
// createdAt: "2021-10-09T21:10:47.885Z"
// creatorId: "5713908d-cdd5-4aae-926c-93191dce7dd5"
// id: "41a18566-3caa-48b3-bdc6-b57a7b41db95"
// roomName: "테스트"

export default MiniHompiLobby;

