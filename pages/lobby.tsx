import type { NextPage } from 'next'
import { FormEvent, useEffect, useRef, useState } from 'react';
import PageTitle from '../components/PageTItle';
import SiteMark from '../components/SiteMark';
import { wsRoom } from '../types/wsRoom';
import io, { Socket } from "socket.io-client";
import socketIoClient from '../multiplay/wsConnection';
import BottomUI from '../components/BottomUI';
import { Chat } from '../types/wsPayloads';





const Lobby:NextPage = () => {
    const clientId = useRef<string | null>()
    const [activeRooms, setActiveRooms] = useState<Array<wsRoom> | null>()
    const [chatContents, setChatContents] = useState<Array<any>>([]);

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

        socketIoClient.on("chat", (data) => {
            console.log(data)
            setChatContents(chatContents => [...chatContents, data]);
            playChatSoundEffect()
        })

        socketIoClient.on("create-room", (data) => {
            
            // https://stackoverflow.com/questions/503093/how-do-i-redirect-to-another-webpage
            window.location.replace(`world/${data.roomId}`) // 방 생성 후 리다이렉트 해주기
        })
        
    }


    // 로비 채팅 전송
    const sendBroadChat = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const chatContent = e.target[0].value;
        if(chatContent.length > 0){
            socketIoClient.emit("chat", chatContent);
            e.target[0].value = ""
            setChatContents(chatContents => [...chatContents, {client: clientId.current, msg: chatContent}])
        }
        }

    
    const createRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        socketIoClient.emit(
            "create-room", {
                roomName: e.target[0].value
            }
        )
    
    }

    const leaveLobby = async() => {
     
        console.log("로비 나가기");
        socketIoClient.emit("leave-lobby");
        
    }

    const joinRoom = async(roomId) => {
        
        console.log("Dsfasfadsfadsf")
        socketIoClient.emit("join-room", {roomId} )

        // https://stackoverflow.com/questions/503093/how-do-i-redirect-to-another-webpage
        window.location.replace(`world/${roomId}`)
    }

    const createConnection = () => {
        socketIoClient.emit("enter-lobby")
        
    }

    // 배경음 시작
    const startBgm = () => {
        const bgm = new Audio(`/bgms/Funny Dream - Royalty-free Music - Background Music.mp3`)
    
        bgm.loop = true;
        bgm.play();
    }
    
    useEffect(() => {
        
        createConnection();
        
        handleSocketListeners();
        
        startBgm();

    }, [])
    
    return(
        <section className="w-screen h-screen overflow-x-hidden">
            <SiteMark/>
            <PageTitle title="LOBBY"/>
            

            <div className="grid lg:grid-cols-3 gap-4 md:grid-cols-2 pl-4">
                {activeRooms ? activeRooms.map(
                    (room, key) => {
                        return(
                            <a key={key} onClick={() => joinRoom(room.id)} className="bg-white p-6 w-10/12 text-black flex justify-around align-middle rounded-xl border-2 border-black hover:bg-black hover:text-white" >
                                {console.log(room)}
                            <div className="flex flex-col">
                            <cite className="text-6xl w-full">{room.roomName}</cite>
                            <span className="text-2xl"><span className="text-blue-500">{room.userList.length}</span> / 20 명</span>
                            <span className="text-2xl">생성자: {room.creatorId}</span>
                            <span className="text-2xl">생성일시: {room.createdAt}</span>
                            </div>
                            {/* <span className="text-6xl">{`ㅇ`}</span> */}
                            </a>
                        )
                    }
                ): null}
            </div>

            



            <BottomUI chatContents={chatContents} 
            ChatForm={() =>
                <form className="absolute bottom-14 w-96 left-4 z-10" onSubmit={(e) => sendBroadChat(e)} action="">
                <input className="w-11/12" type="text" min="1" placeholder="채팅 내용 입력" />
                <input className="" type="submit" value="전송" />
                </form>
            } 
            CreateRoomForm={() => 
                <div className="fixed border-2 w-screen h-screen left-0 top-0 flex justify-center items-center bg-blue-500 bg-opacity-25 flex-col">
                    {/* <button className="absolute top-0 right-2 text-4xl">X</button> */}
                    <form className="flex flex-col w-3/6 h-2/6 justify-around " onSubmit={(e) => createRoom(e)} action="">
                        <input onClick={playBtnSoundEffect} className="text-center h-1/6 text-lg font-bold" type="text" maxLength={10} required={true} placeholder="채팅방 이름" />
                        <input onClick={playBtnSoundEffect} className="text-center h-1/6 text-lg font-bold pl-4" type="number" maxLength={1} max="8" min="1" required={true} placeholder="최대인원 설정" />
                        <input onMouseOver={playBtnSoundEffect} className="text-center h-1/6 bg-black rounded-lg text-white hover:bg-blue-500 border-double border-4 font-bold" type="submit" value="채팅방 생성" />
                    </form>

                </div>
            }
            SettingForm={() =>
                
                <div className="fixed border-2 w-screen h-screen left-0 top-0 flex justify-center items-center bg-blue-500 bg-opacity-25 flex-col">
                    <form className="flex flex-col w-3/6 h-2/6 justify-around " onSubmit={(e) => createRoom(e)} action="">
                        <input onClick={playBtnSoundEffect} className="text-center h-1/6 text-lg font-bold" type="checkbox" maxLength={10} placeholder="배경음 ON" />
                        <input onClick={playBtnSoundEffect} className="text-center h-1/6 text-lg font-bold pl-4" type="checkbox" maxLength={1} placeholder="효과음 ON" />
                        <input onMouseOver={playBtnSoundEffect} className="text-center h-1/6 bg-black rounded-lg text-white hover:bg-blue-500 border-double border-4 font-bold" type="submit" value="적용" />
                    </form>
                </div>
            }
            />
            

        </section>
    )
}
// createdAt: "2021-10-09T21:10:47.885Z"
// creatorId: "5713908d-cdd5-4aae-926c-93191dce7dd5"
// id: "41a18566-3caa-48b3-bdc6-b57a7b41db95"
// roomName: "테스트"

export default Lobby;