import type { NextPage } from 'next'
import { FormEvent, useEffect, useRef, useState } from 'react';
import io, { Socket } from "socket.io-client";
import gql from 'graphql-tag';
import { Cache, useQuery, Resolver, makeVar, useReactiveVar, useLazyQuery } from '@apollo/client';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useRouter } from 'next/router';
import SiteMark from '../../components/common/SiteMark';
import { applyMe, setMe } from '../../stores/loggedUser';
import PageTitle from '../../components/common/PageTItle';
import { GETME } from '../../apis/gql-queries/user';
import BottomUI from '../../components/common/BottomUI';
import { applyChatStatus } from '../../stores/chatStatus';
import { GETROOMS } from '../../apis/gql-queries/miniHompi';
import useGetMe from '../../hooks/useGetMe';
import useWebsocket from '../../hooks/useWebsocket';
import Loader from '../../components/common/Loader';








const MiniHompiLobby:NextPage = () => {
    const {me} = useReactiveVar(applyMe);
    const [nickname, setNickname] = useState<string>();
    const [userId, setUserId] = useState<number | string | null>(); 
    const [localChats, setLocalChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socketIoClient] = useWebsocket();


    const router = useRouter()

    const {data, loading: roomLoading, error} = useQuery(GETROOMS)
    const [reqGetMe, getMeLoading] = useGetMe()

    const getMe = async() => {
  
        // 회원일 시
        const data = await reqGetMe();
        if(data.data){
            const user = data.data.getMe.user;
            setNickname(user.nickname);
            setUserId(user.id);
            setMe({id: user.id, nickname: user.nickname})
            
        }
        // 비회원일 시
        else {
            const customerId = Math.random();
            setNickname("손님 - " + customerId);
            setUserId(customerId)
            setMe({id: customerId, nickname: "손님 - " + customerId})
        }


        
    }

    
    useEffect(() => {
    
        getMe()
        setLoading(false)
    }, [])
    
    return(
        <section className="w-screen h-screen overflow-x-hidden">
            <SiteMark bgColor={"bg-green-500"}/>
            <PageTitle title="Rooms" />
            <Loader loading={loading} />

            <div className="grid justify-items-center lg:grid-cols-3 gap-4 md:grid-cols-2 pl-4 content-center">
                {data ? JSON.parse(data.getAllMiniHompis.hompisWithOwners).map(
                    ({miniHompi, owner}, key) => {
                        console.log(JSON.parse(data.getAllMiniHompis.hompisWithOwners))
                        return(
                            <a key={key} onClick={() => {
                                window.location.replace(`/mini_homepage/room/${miniHompi.id}?ownerName=${owner?.nickname}`)
                            }}
                                // router.push({
                                // pathname: `/mini_homepage/room/${miniHompi.id}`, 
                                // query: {owner: owner?.nickname}})}  
                                className={`${miniHompi.ownerId === userId ? " text-black" : "bg-white text-black"} p-6 w-10/12 flex justify-between align-middle text-left rounded-xl border-2 border-black hover:bg-black hover:text-white cursor-pointer`
                                
                            } >
                         
                            <div className="flex flex-col">

                            <cite className="text-2xl">{owner?.nickname} Room</cite>
                            <span className="text-2xl">{miniHompi.createdAt.split("T")[0]}</span>
                            </div>
                            {miniHompi.ownerId === userId ? <span className="text-white text-bold bg-green-500 rounded text-center w-4/12 h-6 relative right-0">★ MyRoom</span> : null}
                            
                            </a>
                        )
                    }
                ): null}
                </div>

            
                <BottomUI 
                    nickname={nickname}
                    wsClient={socketIoClient} 
                />
            
        </section>
    )
}
// createdAt: "2021-10-09T21:10:47.885Z"
// creatorId: "5713908d-cdd5-4aae-926c-93191dce7dd5"
// id: "41a18566-3caa-48b3-bdc6-b57a7b41db95"
// roomName: "테스트"

export default MiniHompiLobby;

