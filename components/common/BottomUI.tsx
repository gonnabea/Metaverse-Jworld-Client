import { useEffect, useRef, useState } from "react"
import { JsxElement } from "typescript";

interface props {
    chatContents: Array<any>
    newMsgCount?: number;
    sendBroadChat: any;
    chatInput: any;
    createRoom?: any; // 웹소켓 룸 만들기 함수
    startBgm: any;
}



const BottomUI = ({ chatContents, newMsgCount, sendBroadChat, chatInput, createRoom, startBgm }:props) => {
    
    const [showChats, setShowChats] = useState(false);
    const [showRoomModal, setShowRoomModal] = useState(false); // 방 만들기 모달 띄우기 상태
    const [showSettingModal, setShowSettingModal] = useState(false);
    const [btnSoundEffect, setBtnSoundEffect] = useState();
    const chattingPop = useRef();

   
    const playBtnSoundEffect = () => {
        btnSoundEffect.volume = 0.3
        btnSoundEffect.play()
    }

  
    useEffect(() => {
        setBtnSoundEffect(new Audio(`/sound_effects/btn_click.wav`));
        chattingPop.current.scrollTo(0, chattingPop.current.scrollHeight);
        
    },[showChats])

    return <div className="absolute bottom-0 left-4 w-72 h-12 flex justify-around">
        {/* 채팅 버튼 */}
        <button 
        onClick={() => { 
            setShowSettingModal(false)
            setShowRoomModal(false); 
            setShowChats(showChats => !showChats); 
        }} 
        onMouseOver={() => playBtnSoundEffect()} 
        className="bg-black text-white rounded-lg hover:bg-blue-500 w-32 h-10 border-double border-4 font-bold z-30" >채팅</button>
        
        {/* 채팅 팝업 */}
        {showChats ? <>
            <div ref={chattingPop} id="chatScreen" className="absolute bg-blue-200 text-black bottom-20 left-1 w-96 h-60 p-4 overflow-x-hidden overflow-auto">
                {chatContents.map((content, key) => <div key={key}>
                    <span className="font-bold">{content.client}: </span>
                    <span className="">{content.msg}</span>
                    </div>
                )}
               
            </div>
            <form className="absolute bottom-14 w-96 left-1 z-10" onSubmit={sendBroadChat}>
                <input id="chatInput" autoComplete="off" ref={chatInput} className="w-10/12 pl-2" type="text" min="1" placeholder="채팅 내용 입력" />
                <input className="w-2/12 bg-black text-white font-bold" type="submit" value="전송" />
            </form>
                
        </> : <div ref={chattingPop}></div>
        }
        {/* 방 만들기 버튼 */}
        {createRoom ? <button onClick={() => {
            setShowChats(false)
            setShowSettingModal(false)
            setShowRoomModal(showRoomModal => !showRoomModal); 
        }} 
            onMouseOver={() => playBtnSoundEffect()} 
            className="bg-black rounded-lg text-white hover:bg-blue-500 w-32 h-10 border-double border-4 font-bold z-30" >방 만들기</button>
            : null
        }

        {/* 설정 버튼 */}
        <button onClick={() => { 
            setShowChats(false);
            setShowRoomModal(false); 
            setShowSettingModal(showSettingModal => !showSettingModal); 
        }} 
            onMouseOver={() => playBtnSoundEffect()} 
            className="bg-black rounded-lg text-white hover:bg-blue-500 w-32 h-10 border-double border-4 font-bold z-30" >설정</button>

        {/* 방만들기 모달 */}
        {showRoomModal ? <div className="fixed border-2 w-screen h-screen left-0 top-0 flex justify-center items-center bg-blue-500 bg-opacity-25 flex-col">
            {/* <button className="absolute top-0 right-2 text-4xl">X</button> */}
            <form className="flex flex-col w-3/6 h-2/6 justify-around " onSubmit={(e) => createRoom(e)}>
                <input onClick={playBtnSoundEffect} className="text-center h-1/6 text-lg font-bold" type="text" maxLength={10} required={true} placeholder="채팅방 이름" />
                <input onClick={playBtnSoundEffect} className="text-center h-1/6 text-lg font-bold pl-4" type="number" maxLength={1} max="8" min="1" required={true} placeholder="최대인원 설정" />
                <input onMouseOver={playBtnSoundEffect} className="text-center h-1/6 bg-black rounded-lg text-white hover:bg-blue-500 border-double border-4 font-bold" type="submit" value="스트림 월드 생성" />
            </form>

        </div> : null }

        {/* 설정 모달 */}
        {showSettingModal ? <div className="fixed border-2 w-screen h-screen left-0 top-0 flex justify-center items-center bg-blue-500 bg-opacity-25 flex-col">
            <form className="flex flex-col w-3/6 h-2/6 justify-around " onSubmit={(e) => createRoom(e)} action="">
                <input onClick={() => {playBtnSoundEffect(); startBgm();}} className="text-center h-1/6 text-lg font-bold" type="checkbox" maxLength={10} placeholder="배경음 ON" />
                <input onClick={() => {playBtnSoundEffect()}} className="text-center h-1/6 text-lg font-bold pl-4" type="checkbox" maxLength={1} placeholder="효과음 ON" />
                <input onMouseOver={playBtnSoundEffect} className="text-center h-1/6 bg-black rounded-lg text-white hover:bg-blue-500 border-double border-4 font-bold" type="submit" value="적용" />
            </form>
        </div> : null }
               
    </div>
}


export default BottomUI;