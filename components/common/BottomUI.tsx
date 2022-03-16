import { useReactiveVar } from "@apollo/client";
import React, { ChangeEvent, FormEvent, InputHTMLAttributes, useEffect, useRef, useState } from "react"
import { JsxElement } from "typescript";
import fileApi from "../../apis/axios/fileUpload";
import { addChat, addNewMsgCount, applyChatStatus } from "../../stores/chatStatus";
import { applyMe } from "../../stores/loggedUser";
import useGetMe from "../../hooks/useGetMe"
import ImageList from "../ImageList";
import VideoList from "../videoList";
import { Chat } from "../threeComponents/streamWorldModels/wsPayloads";



interface props {
    createRoom?: any; // 웹소켓 룸 만들기 함수
    nickname?: string;
    wsClient: any;
}

function checkFile(el: ChangeEvent<HTMLInputElement>, fileType: string){
	// files 로 해당 파일 정보 얻기.
	const file = el.target.files;

	// file[0].size 는 파일 용량 정보입니다.
   
    if(fileType === "image" && file && file[0]?.size > 1024 * 1024 * 2){
        // 용량 초과시 경고후 해당 파일의 용량도 보여줌
        alert('2MB 이하 파일만 등록할 수 있습니다.\n\n' + '현재파일 용량 : ' + (Math.round(file[0].size / 1024 / 1024 * 100) / 100) + 'MB');
        return;
    }

    
    if(fileType === "video" && file && file[0]?.size > 1024 * 1024 * 100){
        // 용량 초과시 경고후 해당 파일의 용량도 보여줌
        alert('100MB 이하 파일만 등록할 수 있습니다.\n\n' + '현재파일 용량 : ' + (Math.round(file[0].size / 1024 / 1024 * 100) / 100) + 'MB');
        return;
    }

	// 체크를 통과했다면 종료.
	else return;

	// 체크에 걸리면 선택된 내용 취소 처리를 해야함.
	// 파일선택 폼의 내용은 스크립트로 컨트롤 할 수 없습니다.
	// 그래서 그냥 새로 폼을 새로 써주는 방식으로 초기화 합니다.
	// 이렇게 하면 간단 !?
	el.target.outerHTML = el.target.outerHTML;
}


interface image {
    title: string;
    description: string;
    imageUrl: string;
}

interface video {
    title: string;
    description: string;
    videoUrl: string;
}



const BottomUI = ({ createRoom, nickname, wsClient }:props) => {

    const [reqGetMe] = useGetMe();
    const [images, setImages] = useState<[] | image[]>([]);
    const [videos, setVideos] = useState<[] | video[]>([]);
    const [_, forceRerender] = useState(0) // 컴포넌트 강제 리렌더링을 위함 - 채팅 상태 업데이트 시 리렌더링이 안됨.
    const [loggedIn, setLoggedIn] = useState(false);
    
    
    
    
    const [showChats, setShowChats] = useState(false);
    const [showRoomModal, setShowRoomModal] = useState(false); // 방 만들기 모달 띄우기 상태
    const [showSettingModal, setShowSettingModal] = useState(false);
    const [newMsgLight, setNewMsgLight] = useState(false);
    const [btnSoundEffect, setBtnSoundEffect] = useState();
    const chattingPop = useRef<HTMLInputElement>(null);
    const chatInput = useRef<HTMLInputElement>(null);


    const getMe = async() => {
        const data = await reqGetMe()
        // 회원일 시
        if(data.data) {
            const user = data.data.getMe.user;
            console.log(user.id)
            setLoggedIn(true)
            const imageData = await getImages(user.id);
            const videoData = await getVideos(user.id);
            setImages(imageData)
            setVideos(videoData)
        }
        // 비회원일 시
        else {
            setLoggedIn(false)
        }
    }

    const getImages = async(userId: number) => {
        if(userId) {
            const images = await fileApi.getImages({ ownerId: userId });
            console.log(images)
            return images.data
        }
    }

    const getVideos = async(userId: number) => {
        if(userId) {
            const videos = await fileApi.getVideos({ ownerId: userId });
            console.log(videos)
            return videos.data
        }
    }

    const sendBroadChat = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if(e.target[0].value.length > 0) {
            wsClient.emit("chat", {
                nickname,
                text: e.target[0].value
            });
            
            
            const newChat:Chat = {client: nickname, msg: e.target[0].value}
            addChat(newChat)
            
            // playChatSoundEffect()
            // 채팅 전송 후 다시 포커스 해주기 위함.
            setTimeout(() => {
                chatInput.current?.focus();
                if(chatInput.current)
                    chatInput.current.value = ""
                const chatScreen = document.getElementById("chatScreen");
                chatScreen?.scrollTo({
                    top: chatScreen.scrollHeight,
                    left: 0,
                    
                  })
            }, 0)
            forceRerender(num => num +1)
        }

    }

    

  
    useEffect(() => {

        if(chattingPop.current !== null)
            chattingPop.current.scrollTo(0, chattingPop.current.scrollHeight);
        getMe()

        // 전체 채팅 받았을 때
        wsClient.on("chat", (data: Chat) => {
            addChat(data);
            addNewMsgCount()
            forceRerender(num => num +1)
            if(!showChats) {
                // setShowChats(showChats => !showChats); 
                // setTimeout(() => setShowChats(showChats => !showChats), 5000)
                setNewMsgLight(true)
            }
        })
        
        return () => { wsClient.off('chat'); }

        
    }, [showChats, applyChatStatus()])

    return <div className="absolute bottom-0 left-4 w-72 h-12 flex justify-around">
        {/* 채팅 버튼 */}
        <button 
        onClick={() => { 
            setShowSettingModal(false)
            setShowRoomModal(false); 
            setShowChats(showChats => !showChats); 
            setNewMsgLight(false)
        }} 
        className="bg-black text-white rounded-lg hover:bg-blue-500 w-32 h-10 border-double border-4 font-bold z-30" >채팅</button>
        {/* 채팅 알림 */}
        {newMsgLight ? <span className="bg-blue-300 w-3 h-3 relative right-4 text-white z-50 rounded-full "></span> : null}
        {/* 채팅 팝업 */}
        {showChats ? <>
            <div ref={chattingPop} id="chatScreen" 
            className="absolute bg-black bg-opacity-40 text-black bottom-20 left-1 w-96 h-60 p-4 overflow-x-hidden overflow-auto z-30">
                {applyChatStatus().chatContents.map((content, key) => <div key={key}>
                    <span className="font-bold text-white">{content.client}: </span>
                    <span className="text-white">{content.msg}</span>
                    </div>
                )}
               
            </div>
            <form className="absolute bottom-14 w-96 left-1 z-10" onSubmit={(e) => sendBroadChat(e)}>
                <input id="chatInput" autoComplete="off" ref={chatInput} className="w-10/12 pl-2" type="text" min="1" placeholder="채팅 내용 입력" />
                <input className="w-2/12 bg-black text-white font-bold" type="submit" value="전송" />
            </form>
                
        </> : <div ref={chattingPop}></div>
        }
        {/* 방 만들기 버튼 */}
        {createRoom && loggedIn ? <button onClick={() => {
            setShowChats(false)
            setShowSettingModal(false)
            setShowRoomModal(showRoomModal => !showRoomModal); 
        }} 
            className="bg-black rounded-lg text-white hover:bg-blue-500 w-32 h-10 border-double border-4 font-bold z-30" >방 만들기</button>
            : null
        }

        {/* 방만들기 모달 */}
        {showRoomModal ? <div className="fixed border-2 w-screen h-screen left-0 top-0 flex justify-center items-center bg-black bg-opacity-10 flex-col">
        {/* <button className="absolute top-0 right-2 text-4xl">X</button> */}
        <form className="flex flex-col w-3/6 h-2/6 justify-around " onSubmit={(e) => createRoom(e)}>
            <input className="text-center h-1/6 text-lg font-bold" type="text" maxLength={10} required={true} placeholder="채팅방 이름" />
            <input className="text-center h-1/6 text-lg font-bold pl-4" type="number" maxLength={1} max="8" min="1" required={true} placeholder="최대인원 설정" />
            <input className="text-center h-1/6 bg-black rounded-lg text-white hover:bg-blue-500 border-double border-4 font-bold cursor-pointer" type="submit" value="스트림 월드 생성" />
        </form>

        </div> : null }

        {/* 설정 버튼 */}{
            loggedIn ? <button onClick={() => { 
                setShowChats(false);
                setShowRoomModal(false); 
                setShowSettingModal(showSettingModal => !showSettingModal); 
            }} 
                
                className="bg-black rounded-lg text-white hover:bg-blue-500 w-32 h-10 border-double border-4 font-bold z-30" >설정</button> : null
        }




            
        {/* 설정 모달 */}
        {showSettingModal ? <div className="fixed border-2 w-screen h-screen left-0 top-0 flex justify-center items-center bg-black bg-opacity-50 flex-col z-20 pt-20 overflow-y-auto overflow-x-hidden">
         
            {/* 이미지 모델 리스트 */}
            <ImageList images={images} />

            {/* 비디오 모델 리스트 */}
            <VideoList videos={videos} />
            
            <form 
                method="post" 
                className="w-full flex h-20 items-center justify-center relative bottom-10"
                onSubmit={async(e) => {
                    e.preventDefault()
 
                    const file = e.target["imgFile"].files[0];
                    const imgForm = new FormData();
                    
                    imgForm.append("file", file)
                    imgForm.append("title", e.target["title"].value)
                    imgForm.append("description",e.target["description"].value)

                    await fileApi.uploadImg({
                        fileForm: imgForm
                        })
                        
                    window.location.replace("/lobby")
            }} 
                encType="multipart/form-data" 
                >
                <input className="bg-gray-400 placeholder-white border-solid p-2 border-2 border-white rounded m-2" type="text" required={true} name="title" placeholder="이미지 제목" />
                <input className="bg-gray-400 placeholder-white border-solid p-2 border-2 border-white rounded m-2" type="text" required={true} name="description" autoComplete="off" placeholder="이미지 설명 / 소개"/>

                
                <div className="overflow-hidden relative w-64 mt-2 mb-2 p-3">
                    <span className="bg-blue-500 text-white font-bold h-10 px-4 w-full inline-flex items-center relative top-3.5 rounded">
                        <svg fill="#FFF" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0h24v24H0z" fill="none"/>
                            <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                        </svg>
                        <span className="ml-2">이미지 파일 선택하기</span>
                    </span>
                    <input className="cursor-pointer pin-r pin-t block relative bottom-5 opacity-0" type="file" name="imgFile" onChange={(e) => checkFile(e, "image")} multiple />
                </div>
                <input className="bg-black rounded text-white hover:bg-blue-500 w-32 h-11 border-double border-4 font-bold z-30 m-2" type="submit" value="이미지 업로드" />
            </form>

            <form method="post"
                className="w-full flex h-20 items-center justify-center relative bottom-10"
                onSubmit={async(e) => {
                    e.preventDefault()
                    const videoForm = new FormData();
                    
                    videoForm.append("file", e.target["videoFile"].files[0])
                    videoForm.append("title", e.target["title"].value)
                    videoForm.append("description",e.target["description"].value)

                    await fileApi.uploadVideo({
                        fileForm: videoForm,
                    })
                
                    window.location.replace("/lobby")
                }
            }
                action="" encType="multipart/form-data" >
                <input className="bg-gray-400 placeholder-white border-solid p-2 border-2 border-white rounded m-2" type="text" required={true} name="title" placeholder="비디오 제목" />
                <input className="bg-gray-400 placeholder-white border-solid p-2 border-2 border-white rounded m-2 active:w-full" type="text" required={true} name="description" autoComplete="off" placeholder="비디오 설명 / 소개"/>

                <div className="overflow-hidden relative w-64 mt-2 mb-2 p-3">
                    <span className="bg-blue-500 text-white font-bold h-10 px-4 w-full inline-flex items-center relative top-3.5 rounded">
                        <svg fill="#FFF" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0h24v24H0z" fill="none"/>
                            <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                        </svg>
                        <span className="ml-2">비디오 파일 선택하기</span>
                    </span>
                    <input className="cursor-pointer pin-r pin-t block relative bottom-5 opacity-0" type="file" name="videoFile" onChange={(e) => checkFile(e, "video")} multiple />
                </div>
                <input className="bg-black rounded text-white hover:bg-blue-500 w-32 h-11 border-double border-4 font-bold z-30 m-2" type="submit" value="비디오 업로드" />
            </form>

        </div> : null }
               
    </div>
}


export default BottomUI;