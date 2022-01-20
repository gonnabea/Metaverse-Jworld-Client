import type { NextPage } from 'next'
import { FormEvent, useEffect, useRef, useState } from 'react';
import PageTitle from '../components/common/PageTItle';
import SiteMark from '../components/common/SiteMark';
import { wsRoom } from '../types/wsRoom';
import io, { Socket } from "socket.io-client";
import socketIoClient from '../multiplay/wsConnection';
import BottomUI from '../components/common/BottomUI';
import { Chat } from '../components/threeComponents/streamWorldModels/wsPayloads';
import gql from 'graphql-tag';
import { Cache, useQuery, Resolver, makeVar, useReactiveVar, useLazyQuery } from '@apollo/client';
import { applyMe, setMe } from '../stores/loggedUser';

import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useRouter } from 'next/router';
import { GETME } from '../apis/gql-queries/user';
import { addChat, applyChatStatus, setChatStatus } from '../stores/chatStatus';
import useGetMe from '../hooks/useGetMe';
import useWebsocket from '../hooks/useWebsocket';



// 스트림월드 로비
const Lobby:NextPage = () => {
    const applyStore = useReactiveVar(applyMe);
    const chatStatus = useReactiveVar(applyChatStatus);
  
    
    
    const clientId = useRef<string | null>()
    const [activeRooms, setActiveRooms] = useState<Array<wsRoom> | null>()
    const [nickname, setNickname] = useState<string>();
    const [userId, setUserId] = useState<number | string | null>(); 
    const [bgm, setBgm] = useState();
    const router = useRouter()

    const [socketIoClient] = useWebsocket();

  
    // 로비 입장 시 로그인 된 유저 정보 가져오기
    const [reqGetMe, getMeLoading] = useGetMe()

    
    
    const getMe = async() => {
  
        // 회원일 시
        const data = await reqGetMe();
        if(data.data){
            const user = data.data.getMe.user;
            setNickname(user.nickname);
            setUserId(user.id);
            setMe({id: user.id, nickname: user.nickname})
            socketIoClient.emit("enter-lobby", {nickname: user.nickname, userId: user.id})
        }
        // 비회원일 시
        else {
            const customerId = Math.random();
            setNickname("손님 - " + customerId);
            setUserId(customerId)
            setMe({id: customerId, nickname: "손님 - " + customerId})
            socketIoClient.emit("enter-lobby", {nickname: "손님 - " + customerId, customerId})

        }

     
    }
      
    

    // JSON.stringify(Math.random() * 10)


    
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

        socketIoClient.on("create-room", (data) => {
            
            
            // 방 생성 후 리다이렉트 해주기
            router.push(`/stream_world/${data.roomId}`)
        })

        socketIoClient.on("reloadLobby", ({activeRooms}) => {
            setActiveRooms(activeRooms)
        })
        
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
        // window.location.replace(`/stream_world/${roomId}`)
        router.push(`/stream_world/${roomId}`)
        
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
        
        handleSocketListeners();

        getMe()

    }, [])
    
    return(
        <section className="w-screen h-screen overflow-x-hidden">
            <SiteMark/>
            <PageTitle title="Stream Worlds"/>
            
            {/* 스트림 월드 방 UI */}
            <div className="grid lg:grid-cols-3 gap-4 md:grid-cols-2 pl-4">
                {activeRooms ? activeRooms.map(
                    (room, key) => {
                        return(
                            <a key={key} onClick={() => joinRoom(room.id)} className="bg-white p-6 w-10/12 text-black flex justify-left align-middle rounded-xl border-2 border-black hover:bg-black hover:text-white cursor-pointer" >
                                {console.log(room)}
                            <div className="flex flex-col ">
                            <cite className="text-6xl w-full">{room.roomName}</cite>
                            <span className="text-2xl"><span className="text-blue-500">{room.userList.length}</span> / {room.maxPeopleNum} 명</span>
                            <span className="text-2xl">{room.creator}</span>
                            <span className="text-2xl">{room.createdAt}</span>
                            </div>
                            {/* <span className="text-6xl">{`ㅇ`}</span> */}
                            </a>
                        )
                    }
                ): null}
            </div>
           
            <BottomUI
                nickname={nickname}
                createRoom={createRoom}
                socketIoClient={socketIoClient}
            />
            
            
        </section>
    )
}
// createdAt: "2021-10-09T21:10:47.885Z"
// creatorId: "5713908d-cdd5-4aae-926c-93191dce7dd5"
// id: "41a18566-3caa-48b3-bdc6-b57a7b41db95"
// roomName: "테스트"

export default Lobby;