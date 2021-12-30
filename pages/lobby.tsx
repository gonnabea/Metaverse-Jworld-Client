import type { NextPage } from 'next'
import { FormEvent, useEffect, useRef, useState } from 'react';
import PageTitle from '../components/common/PageTItle';
import SiteMark from '../components/SiteMark';
import { wsRoom } from '../types/wsRoom';
import io, { Socket } from "socket.io-client";
import socketIoClient from '../multiplay/wsConnection';
import BottomUI from '../components/common/BottomUI';
import { Chat } from '../types/wsPayloads';
import gql from 'graphql-tag';
import { Cache, useQuery, Resolver, makeVar, useReactiveVar, useLazyQuery } from '@apollo/client';
import { applyMe, setMe } from '../stores/loggedUser';

import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';




const GETME = gql`
query getMe {
    getMe {
      ok
      error
      user {
          id
          email
          nickname
      }
    }
  }
`




const Lobby:NextPage = () => {
    const applyStore = useReactiveVar(applyMe);
    
    
    const clientId = useRef<string | null>()
    const [activeRooms, setActiveRooms] = useState<Array<wsRoom> | null>()
    const [chatContents, setChatContents] = useState<any>([]);
    const [newMsgCount, setNewMsgCount] = useState<number>(0);
    const [jwtToken, setJwtToken] = useState()
    const [nickname, setNickname] = useState();
    const [userId, setUserId] = useState();
    const chatInput = useRef<HTMLInputElement>();
    const [bgm, setBgm] = useState();

  
    // 로비 입장 시 로그인 된 유저 정보 가져오기
    const [reqGetMe, {loading, error}] = useLazyQuery(GETME, {
        context: {
            headers: {
                "Authorization":  "Bearer " + jwtToken
            }
        }
        
    })
    
    const getMe = async() => {
        setJwtToken(localStorage.getItem("jwt_token"));
       
        const {data: {getMe: {user}} } = await reqGetMe()
        console.log(user)
        setNickname(user.nickname);
        setUserId(user.id);
    }
      
    




    
    const playBtnSoundEffect = () => {
        const btnSoundEffect = new Audio(`/sound_effects/btn_click.wav`);
        
        btnSoundEffect.play()
    }
    
    const playChatSoundEffect = () => {
        const chatSoundEffect = new Audio(`/sound_effects/chat.wav`);

        chatSoundEffect.play();
    }

    // 웹소켓 리스너
    const handleSocketListeners = () => {
        socketIoClient.on("enter-lobby", (data) => {
            
            clientId.current = data.clientId;
            setActiveRooms(data.activeRooms) // 로비 방 목록 생성해주기
        })

        // 채팅 받았을 때
        socketIoClient.on("chat", (data) => {
            console.log(data)
            setChatContents(chatContents => [...chatContents, data]);
            setNewMsgCount(newMsgCount => newMsgCount + 1);
            playChatSoundEffect()
        })

        socketIoClient.on("create-room", (data) => {
            
            // https://stackoverflow.com/questions/503093/how-do-i-redirect-to-another-webpage
            window.location.replace(`/stream_world/${data.roomId}`) // 방 생성 후 리다이렉트 해주기
        })
        
    }


    // 로비 채팅 전송
    const sendBroadChat = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        
        if(e.target[0].value.length > 0){
            socketIoClient.emit("chat", {
                nickname,
                text: e.target[0].value
            });
            
            setChatContents((chatContents:Chat[]) => [...chatContents, {client: nickname, msg: e.target[0].value}]);
            playChatSoundEffect()
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

    
    const createRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const roomName = e.target[0].value;
        const maxPeopleNum = e.target[1].value;
        socketIoClient.emit(
            "create-room", {
                nickname,
                roomName,
                maxPeopleNum,
                userId
            }
        )
    
    }

    const leaveLobby = async() => {
     
        console.log("로비 나가기");
        socketIoClient.emit("leave-lobby");
        
    }

    const joinRoom = async(roomId) => {
        
        console.log("Dsfasfadsfadsf")
        socketIoClient.emit("join-room", {roomId, userId} )

        // https://stackoverflow.com/questions/503093/how-do-i-redirect-to-another-webpage
        window.location.replace(`/stream_world/${roomId}`)
    }

    const createConnection = () => {
        socketIoClient.emit("enter-lobby", {nickname, userId})
        
    }

    
    // 배경음 시작
    const startBgm = () => {
        
        setBgm(new Audio(`/bgms/Funny Dream - Royalty-free Music - Background Music.mp3`));

        if(bgm){
            if(bgm.paused === false) {
                bgm.pause();
            }
            bgm.play();
            bgm.loop = true;
        }
    }



      
    
    useEffect(() => {
        
        createConnection();
        
        handleSocketListeners();
        
        console.log(applyStore);
        
        startBgm()

        getMe()
        
    }, [])
    
    return(
        <section className="w-screen h-screen overflow-x-hidden">
            <SiteMark/>
            <PageTitle title="LOBBY"/>
            
            {/* 방 UI */}
            <div className="grid lg:grid-cols-3 gap-4 md:grid-cols-2 pl-4">
                {activeRooms ? activeRooms.map(
                    (room, key) => {
                        return(
                            <a key={key} onClick={() => joinRoom(room.id)} className="bg-white p-6 w-10/12 text-black flex justify-around align-middle rounded-xl border-2 border-black hover:bg-black hover:text-white" >
                                {console.log(room)}
                            <div className="flex flex-col">
                            <cite className="text-6xl w-full">{room.roomName}</cite>
                            <span className="text-2xl"><span className="text-blue-500">{room.userList.length}</span> / {room.maxPeopleNum} 명</span>
                            <span className="text-2xl">생성자: {room.creator}</span>
                            <span className="text-2xl">생성일시: {room.createdAt}</span>
                            </div>
                            {/* <span className="text-6xl">{`ㅇ`}</span> */}
                            </a>
                        )
                    }
                ): null}
            </div>

            <BottomUI 
            chatContents={chatContents} 
            newMsgCount={newMsgCount}
            sendBroadChat={sendBroadChat}
            chatInput={chatInput}
            createRoom={createRoom}
            startBgm={startBgm}
         
            />
            
            
        </section>
    )
}
// createdAt: "2021-10-09T21:10:47.885Z"
// creatorId: "5713908d-cdd5-4aae-926c-93191dce7dd5"
// id: "41a18566-3caa-48b3-bdc6-b57a7b41db95"
// roomName: "테스트"

export default Lobby;