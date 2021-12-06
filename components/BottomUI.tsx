import { useState } from "react"

interface props {
    chatContents: string
}

const BottomUI = ({ chatContents }:props) => {

    const [showChats, setShowChats] = useState(false);
    const [showRoomModal, setShowRoomModal] = useState(false); // 방 만들기 모달 띄우기 상태

    const ChatBtn = () => {
        return <button onClick={() => setShowChats(showChats => !showChats)} className="bg-black text-white hover:bg-blue-500 w-32 h-10 border-double border-4 font-bold" >채팅</button>
    }

    const CreateRoomBtn = () => {
        return <button onClick={() => setShowRoomModal(showRoomModal => !showRoomModal)} className="bg-black text-white hover:bg-blue-500 w-32 h-10 border-double border-4 font-bold" >방 만들기</button>
    }

    const ChatScreen = ({ showChats, chatContents }) => {
        if(showChats === true)
        return (
            <div className="absolute bg-black text-white bottom-14 left-4 w-60 h-30">
                {chatContents}
            </div>
        )
        else
        return (
            <div className="hidden">
            {chatContents}
            </div>
        )
    }

    const CreateRoomModal = () => {
        
    }

    return <div className="absolute bottom-0 left-0 w-60 h-12 flex justify-around">
        <ChatBtn />
        <ChatScreen showChats={showChats} chatContents={chatContents} />
        <CreateRoomBtn />
    </div>
}


export default BottomUI;