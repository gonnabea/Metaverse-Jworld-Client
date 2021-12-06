import { useState } from "react"
import { JsxElement } from "typescript";

interface props {
    chatContents: Array<any>
    ChatForm: Element
}

const BottomUI = ({ chatContents, ChatForm }:props) => {

    const [showChats, setShowChats] = useState(false);
    const [showRoomModal, setShowRoomModal] = useState(false); // 방 만들기 모달 띄우기 상태

    const ChatBtn = () => {
        return <button onClick={() => {setShowChats(showChats => !showChats); console.log(chatContents)}} className="bg-black text-white rounded-lg hover:bg-blue-500 w-32 h-10 border-double border-4 font-bold" >채팅</button>
    }

    const CreateRoomBtn = () => {
        return <button onClick={() => setShowRoomModal(showRoomModal => !showRoomModal)} className="bg-black rounded-lg text-white hover:bg-blue-500 w-32 h-10 border-double border-4 font-bold" >방 만들기</button>
    }

    const ChatScreen = ({ showChats, chatContents }) => {
        if(showChats === true)
        return (
            <>
            <div className="absolute bg-blue-200 text-black bottom-20 left-4 w-96 h-60 p-4 overflow-x-hidden overflow-y-auto">
                {chatContents.map((content, key) => <div key={key}>
                    <span className="font-bold">{content.client}: </span>
                    <span className="">{content.msg}</span>
                    </div>
                )}
      
            </div>
                <ChatForm/>
                </>
        )
        else
        return (
            <div className="hidden">
            
            </div>
        )
    }

    const CreateRoomModal = () => {

    }

    return <div className="absolute bottom-0 left-4 w-60 h-12 flex justify-around">
        <ChatBtn />
        <ChatScreen showChats={showChats} chatContents={chatContents} />
        <CreateRoomBtn />
    </div>
}


export default BottomUI;