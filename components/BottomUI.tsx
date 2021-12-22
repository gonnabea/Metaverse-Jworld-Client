import { useEffect, useRef, useState } from "react"
import { JsxElement } from "typescript";

interface props {
    chatContents: Array<any>
    ChatForm?: Function;
    CreateRoomForm?: Function;
    SettingForm?: Function;
    newMsgCount?: number;
}



const BottomUI = ({ chatContents, ChatForm, CreateRoomForm, SettingForm, newMsgCount }:props) => {
    
    const [showChats, setShowChats] = useState(false);
    const [showRoomModal, setShowRoomModal] = useState(false); // 방 만들기 모달 띄우기 상태
    const [showSettingModal, setShowSettingModal] = useState(false);

    const playBtnSoundEffect = () => {
        const btnSoundEffect = new Audio(`/sound_effects/btn_click.wav`)
        
        btnSoundEffect.play()
    }

    const ChatBtn = () => {
        if(ChatForm)
        return <button 
        onClick={() => { 
            setShowSettingModal(false)
            setShowRoomModal(false); 
            setShowChats(showChats => !showChats); }} 
        onMouseOver={() => playBtnSoundEffect()} 
        className="bg-black text-white rounded-lg hover:bg-blue-500 w-32 h-10 border-double border-4 font-bold z-30" >채팅</button>

        return <></>
    }

    const CreateRoomBtn = () => {
        if(CreateRoomForm)
        return <button onClick={() => {
            setShowChats(false)
            setShowSettingModal(false)
            setShowRoomModal(showRoomModal => !showRoomModal); }} 
            onMouseOver={() => playBtnSoundEffect()} 
            className="bg-black rounded-lg text-white hover:bg-blue-500 w-32 h-10 border-double border-4 font-bold z-30" >방 만들기</button>
        
        return <></>

    }

    const SettingBtn = () => {
        if(SettingForm)
        return <button onClick={() => { 
            setShowChats(false);
            setShowRoomModal(false); 
            setShowSettingModal(showSettingModal => !showSettingModal); }} 
            onMouseOver={() => playBtnSoundEffect()} 
            className="bg-black rounded-lg text-white hover:bg-blue-500 w-32 h-10 border-double border-4 font-bold z-30" >설정</button>

        return <></>
        
    }

    const ChatScreen = ({ showChats, chatContents }) => {
        if(showChats === true)
        return (
            <>
            <div id="chatScreen" className="absolute bg-blue-200 text-black bottom-20 left-4 w-96 h-60 p-4 overflow-x-hidden overflow-auto">
                {chatContents.map((content, key) => <div key={key}>
                    <span className="font-bold">{content.client}: </span>
                    <span className="">{content.msg}</span>
                    </div>
                )}
               
            </div>

                <ChatForm/>
                </>
        )
        return (
            <div className="hidden">
            
            </div>
        )
    }

    const CreateRoomModal = ({ showRoomModal }) => {
        
        if(showRoomModal === true) {
            return <CreateRoomForm/>
        }

        return <></>
        
    }

    const SettingModal = ({ showSettingModal }) => {
        
        if(showSettingModal === true) {
            return <SettingForm/>
        }
        
        return <></>
        
    }

    useEffect(() => {

    },[])

    return <div className="absolute bottom-0 left-4 w-72 h-12 flex justify-around">
        <ChatBtn />
        <ChatScreen showChats={showChats} chatContents={chatContents} />
        <CreateRoomBtn />
        <SettingBtn />
        <CreateRoomModal showRoomModal={showRoomModal} />
        <SettingModal showSettingModal={showSettingModal}  />
               
    </div>
}


export default BottomUI;