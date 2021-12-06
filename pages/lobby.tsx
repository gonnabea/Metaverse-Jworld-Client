import type { NextPage } from 'next'
import { FormEvent, useEffect, useRef, useState } from 'react';
import PageTitle from '../components/PageTItle';
import SiteMark from '../components/SiteMark';
import { wsRoom } from '../types/wsRoom';
import io, { Socket } from "socket.io-client";
import socketIoClient from '../multiplay/wsConnection';
import BottomUI from '../components/BottomUI';





const Lobby:NextPage = () => {
    const clientId = useRef<string | null>()
    const [activeRooms, setActiveRooms] = useState<Array<wsRoom> | null>()
    const [chatContents, setChatContents] = useState("");

    // 웹소켓 리스너
    const handleSocketListeners = () => {
        socketIoClient.on("enter-lobby", (data) => {

            clientId.current = data.clientId;
            setActiveRooms(data.activeRooms) // 로비 방 목록 생성해주기
        })

        socketIoClient.on("chat", (data) => {
            console.log(data)
            setChatContents(chatContents => chatContents = chatContents + data.client + ": " + data.msg)
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
        socketIoClient.emit("chat", chatContent);
        e.target[0].value = ""
        setChatContents(chatContents => chatContents = chatContents + clientId.current + ": " + chatContent)
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
    
    useEffect(() => {

        createConnection();

        handleSocketListeners();

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

            
            <form onSubmit={(e) => sendBroadChat(e)} action="">
            <input type="text" placeholder="채팅 내용 입력" />
            <input type="submit" value="전송" />
            </form>

            
            <form onSubmit={(e) => createRoom(e)} action="">
            <input type="text" maxLength={10} placeholder="채팅방 이름" />
            <input type="submit" value="채팅방 생성" />
            </form>

            
            <BottomUI chatContents={chatContents} />
            

        </section>
    )
}
// createdAt: "2021-10-09T21:10:47.885Z"
// creatorId: "5713908d-cdd5-4aae-926c-93191dce7dd5"
// id: "41a18566-3caa-48b3-bdc6-b57a7b41db95"
// roomName: "테스트"

export default Lobby;