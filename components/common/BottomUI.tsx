import { useReactiveVar } from "@apollo/client";
import { useEffect, useRef, useState } from "react"
import { JsxElement } from "typescript";
import fileApi from "../../apis/axios/fileUpload";
import { applyChatStatus, setChatStatus } from "../../stores/chatStatus";
import fs from "fs"

interface props {
    chatContents: Array<any>
    newMsgCount?: number;
    sendBroadChat: any;
    chatInput: any;
    createRoom?: any; // 웹소켓 룸 만들기 함수
    startBgm: any;
}

function checkFile(el, fileType){
    console.log(el.target)
	// files 로 해당 파일 정보 얻기.
	var file = el.target.files;

	// file[0].size 는 파일 용량 정보입니다.
    if(fileType === "image")
        if(file[0]?.size > 1024 * 1024 * 2){
            // 용량 초과시 경고후 해당 파일의 용량도 보여줌
            alert('2MB 이하 파일만 등록할 수 있습니다.\n\n' + '현재파일 용량 : ' + (Math.round(file[0].size / 1024 / 1024 * 100) / 100) + 'MB');
            
        }

    if(fileType === "video")
        if(file[0]?.size > 1024 * 1024 * 100){
            // 용량 초과시 경고후 해당 파일의 용량도 보여줌
            alert('100MB 이하 파일만 등록할 수 있습니다.\n\n' + '현재파일 용량 : ' + (Math.round(file[0].size / 1024 / 1024 * 100) / 100) + 'MB');
        }

	// 체크를 통과했다면 종료.
	else return;

	// 체크에 걸리면 선택된 내용 취소 처리를 해야함.
	// 파일선택 폼의 내용은 스크립트로 컨트롤 할 수 없습니다.
	// 그래서 그냥 새로 폼을 새로 써주는 방식으로 초기화 합니다.
	// 이렇게 하면 간단 !?
	el.target.outerHTML = el.target.outerHTML;
}



const BottomUI = ({ chatContents, newMsgCount, sendBroadChat, chatInput, createRoom, startBgm }:props) => {

    const applyStore = useReactiveVar(applyChatStatus);

    
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

        // 채팅 전역 상태관리
        setChatStatus({
            chatContents,
            newMsgCount,
            sendBroadChat,
            chatInput,
            startBgm
        })
        
    },[showChats, chatContents])

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

        {/* 방만들기 모달 */}
        {showRoomModal ? <div className="fixed border-2 w-screen h-screen left-0 top-0 flex justify-center items-center bg-blue-500 bg-opacity-25 flex-col">
        {/* <button className="absolute top-0 right-2 text-4xl">X</button> */}
        <form className="flex flex-col w-3/6 h-2/6 justify-around " onSubmit={(e) => createRoom(e)}>
            <input onClick={playBtnSoundEffect} className="text-center h-1/6 text-lg font-bold" type="text" maxLength={10} required={true} placeholder="채팅방 이름" />
            <input onClick={playBtnSoundEffect} className="text-center h-1/6 text-lg font-bold pl-4" type="number" maxLength={1} max="8" min="1" required={true} placeholder="최대인원 설정" />
            <input onMouseOver={playBtnSoundEffect} className="text-center h-1/6 bg-black rounded-lg text-white hover:bg-blue-500 border-double border-4 font-bold" type="submit" value="스트림 월드 생성" />
        </form>

        </div> : null }

        {/* 설정 버튼 */}
        <button onClick={() => { 
            setShowChats(false);
            setShowRoomModal(false); 
            setShowSettingModal(showSettingModal => !showSettingModal); 
        }} 
            onMouseOver={() => playBtnSoundEffect()} 
            className="bg-black rounded-lg text-white hover:bg-blue-500 w-32 h-10 border-double border-4 font-bold z-30" >설정</button>



        {/* 설정 모달 */}
        {showSettingModal ? <div className="fixed border-2 w-screen h-screen left-0 top-0 flex justify-center items-center bg-blue-500 bg-opacity-25 flex-col">
            <form 
                method="post" 
                onSubmit={(e) => {
                    e.preventDefault()
 
                    const file = e.target["imgFile"].files[0];
                    const imgForm = new FormData();
                    
                    imgForm.append("file", file)
                    imgForm.append("title", e.target["title"].value)
                    imgForm.append("description",e.target["description"].value)

                    fileApi.uploadImg({
                        fileForm: imgForm
                })}} 
                encType="multipart/form-data" 
                >
                <label htmlFor="imgFile" className="p-1">이미지 파일</label>
                <input type="text" required={true} name="title" placeholder="이미지 제목" />
                <input type="text" required={true} name="description" placeholder="이미지 설명 / 소개"/>
                <input type="file" name="imgFile" onChange={(e) => checkFile(e, "image")} />
                <input type="submit" value="업로드" />
            </form>

            <form method="post"
                onSubmit={(e) => {
                    e.preventDefault()
                    const videoForm = new FormData();

                    videoForm.append("file", e.target.files[0])
                    videoForm.append("title", e.target["title"].value)
                    videoForm.append("description",e.target["description"].value)

                    fileApi.uploadVideo({
                        fileForm: videoForm,
                })
                }
            }
                action="" encType="multipart/form-data" >
                <label htmlFor="videoFile" className="p-1">비디오 파일</label>
                <input type="text" required={true} name="title" placeholder="비디오 제목" />
                <input type="text" required={true} name="description" placeholder="비디오 설명 / 소개"/>
                <input type="file" name="videoFile" onChange={(e) => checkFile(e, "video")} />
                <input type="submit" value="업로드" />
            </form>
            
            {/* <form className="flex flex-col w-3/6 h-2/6 justify-around " onSubmit={(e) => createRoom(e)} action=""> */}
                <div className="flex justify-center items-center">
                    <label className="p-1" htmlFor="bgm">배경음 ON / OFF</label>
                    <input name="bgm" className="" type="checkbox" 
                    onClick={() => {playBtnSoundEffect(); startBgm();}}   />
                </div>
                
                <div className="flex justify-center items-center">
                    <label className="p-1" htmlFor="bgm">효과음 ON / OFF</label>
                    <input name="bgm" className="" type="checkbox" 
                    onClick={() => {playBtnSoundEffect();}}   />
                </div>
                {/* <input onMouseOver={playBtnSoundEffect} className="text-center h-1/6 bg-black rounded-lg text-white hover:bg-blue-500 border-double border-4 font-bold" type="submit" value="적용" /> */}
            {/* </form> */}
        </div> : null }
               
    </div>
}


export default BottomUI;