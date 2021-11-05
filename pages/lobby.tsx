import type { NextPage } from 'next'
import { FormEvent, useEffect, useRef, useState } from 'react';
import { w3cwebsocket } from 'websocket';
import PageTitle from '../components/PageTItle';
import SiteMark from '../components/SiteMark';
import { wsRoom } from '../types/wsRoom';



export const w3cWs = new w3cwebsocket('ws://localhost:4001')

const Lobby:NextPage = () => {
    const clientId = useRef<string | null>()
    const {current: wsConnection} = useRef<w3cwebsocket>(w3cWs)
    const [activeRooms, setActiveRooms] = useState<Array<wsRoom> | null>()


    // 웹소켓 리스너
    wsConnection.onmessage = ({data}) => {
        if(typeof(data) === 'string'){
          const parsedData = JSON.parse(data);
          console.log(parsedData)
          switch(parsedData.event){
            case "enter-lobby":
              clientId.current = parsedData.clientId;
              setActiveRooms(parsedData.activeRooms)
              break;
            case "broadcast":
              console.log(parsedData)
              break;
            case "create-room":
              console.log(parsedData)
              // https://stackoverflow.com/questions/503093/how-do-i-redirect-to-another-webpage
              window.location.replace(`world/${parsedData.roomId}`)
              break;  
          }
        }
      }

    const sendBroadChat = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        wsConnection.send(JSON.stringify({
            event: "broadcast",
            data: e.target[0].value
        }))
        e.target[0].value = ""
    }

    const createRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // wsConnection.send(JSON.stringify({
        //     event: "enter-lobby",
        //     data: `클라이언트 접속: ${Math.random()}`
        // }))

        wsConnection.send(JSON.stringify({
            event: "create-room",
            data: {
                roomName: e.target[0].value,
                creatorId: clientId.current
            }
        }))

    
    }

    const leaveLobby = () => {
           

            wsConnection.send(JSON.stringify({
                event: "leave-lobby",
                data: null
            }))
        
    }

    const joinRoom = async(roomId) => {
        console.log(roomId)
        console.log("Dsfasfadsfadsf")
        wsConnection.send(JSON.stringify({
            event: "join-room",
            data: {roomId}
        }))

        // https://stackoverflow.com/questions/503093/how-do-i-redirect-to-another-webpage
        window.location.replace(`world/${roomId}`)
    }
    
    useEffect(() => {
        
        // window.addEventListener('beforeunload', leaveLobby)
        console.log("컴포넌트 마운트");
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
            <form onSubmit={sendBroadChat} action="">
            <input type="text" placeholder="채팅 내용 입력" />
            <input type="submit" value="전송" />
            </form>

            <form onSubmit={createRoom} action="">
            <input type="text" maxLength={10} placeholder="채팅방 이름" />
            <input type="submit" value="채팅방 생성" />
            </form>

        </section>
    )
}
// createdAt: "2021-10-09T21:10:47.885Z"
// creatorId: "5713908d-cdd5-4aae-926c-93191dce7dd5"
// id: "41a18566-3caa-48b3-bdc6-b57a7b41db95"
// roomName: "테스트"

export default Lobby;