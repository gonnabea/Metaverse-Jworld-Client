import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import fileApi from "../apis/axios/fileUpload";
import { UPDATE_FILE_URL } from "../apis/gql-queries/threeModel";
import { AllModelsStatus } from "../data/modelList";
import useGetMe from "../hooks/useGetMe";
import useUpdateFileUrl from "../hooks/useUpdateFileUrl";
import { applyThreeModels, setAllModelsStatus } from "../stores/setAllThreeModels";
import { addModel, applyModels } from "../stores/ThreeModels";
import { modelNameTypes } from "../types/threeModelTypes";
import ImageList from "./ImageList";

interface video {
    title: string;
    description: string;
    videoUrl: string;
}

interface image {
    title: string;
    description: string;
    imageUrl: string;
}

interface focusedModelType {
    name: modelNameTypes,
    index: number,
    installed: boolean,
    scale: number,
    rotateY: string,
    isFocused: boolean
    position: {x: number, y: number, z: number},
    imageUrl?: string;
    videoUrl?: string;
}

// 액자, tv 등에 파일 등록을 위한 UI
const EnrollFileToModelScreen = ({show, setRerender, rerender, initFocused}) => {

    const [images, setImages] = useState<[] | image[]>([]);
    const [videos, setVideos] = useState<[] | video[]>([]);
    const [reqGetMe, loading] = useGetMe();
    
    const [focusedFrame, setFocusedFrame] = useState<focusedModelType | null>();
    const [focusedTV, setFocusedTV] = useState<focusedModelType | null>();

  

  
    
    const setMyInfo = async() => {
        const {data: {getMe: {user}} } = await reqGetMe();
   
        const images = await fileApi.getImages({ownerId: user.id});
        const videos = await fileApi.getVideos({ownerId: user.id});

        setImages(images.data);
        setVideos(videos.data);


        // 액자 or tv 포커싱 시 각각 이미지, 비디오 리스트 보여주기 위함
        applyThreeModels().frame1.map((frame, index: number) => {
            if(frame.isFocused === true) {
                setFocusedFrame({
                    index,
                    name: modelNameTypes.frame1,
                    ...frame
                })
                return true
            }
            else {
                return false
            }
        })
        applyThreeModels().frame2.map((frame, index: number) => {
            if(frame.isFocused === true) {
                setFocusedFrame({
                    index,
                    name: modelNameTypes.frame2,
                    ...frame
                })
                return true

            }
            else {
                return false
            }
        })
        applyThreeModels().tv2.map((tv, index: number) => {
            if(tv.isFocused === true) {
                setFocusedTV({
                    index,
                    name: modelNameTypes.tv2,
                    ...tv
                })
                return true

            }
            else {
                return false
            }
        })
        

        
    }
    

    
    
    
    useEffect(() => {
        setMyInfo()

    }, [show, rerender])

// 유저가 업로드한 이미지, 동영상 파일 리스트 UI
    return (
        show ? 
        <div className="w-screen h-1/6 bg-gray-300 z-20 fixed bottom-0 flex">
           
        {focusedFrame ? images.map(image => {
           return <div onClick={async() => {
               
                   
                // 포커싱된 액자 찾고 업로드한 이미지 클릭 시 fileUrl 등록해주기 
                applyThreeModels().frame1.map((frame, index: number) => {
                    if(frame.isFocused === true) {
                        // 실시간 화면 표시를 위한 상태관리
                        setAllModelsStatus({
                            modelName: modelNameTypes.frame1,
                            index,
                            status:{
                                ...frame,
                                imageUrl: image.imageUrl
                            }
                       })
                       // 저장을 위한 상태관리
                       const modelStatus = {
                           name: modelNameTypes.frame1,
                           position: frame.position,
                           installed: frame.installed,
                           scale: {x: frame.scale, y: frame.scale, z: frame.scale},
                           rotateY: frame.rotateY,
                           index,
                           imageUrl: image.imageUrl,
                
                         }
                         addModel(modelStatus)
                        return null
                    }
                })
                
        setRerender((rerender:number) => rerender + 1)
                   
               
            }}>
            <img className="w-12 h-12" src={image.imageUrl} />
            <span>{image.title}</span>
            <p>{image.description}</p>
            </div>
        }) : null}


          {focusedTV ? videos.map(video => {
           return <div onClick={async() => {
               
                   
                // 포커싱된 tv 찾고 업로드한 동영상 클릭 시 fileUrl 등록해주기 
                applyThreeModels().tv2.map((tv, index: number) => {
               
                    if(tv.isFocused === true) {
                        // 실시간 화면 표시를 위한 상태관리
                        setAllModelsStatus({
                            modelName: modelNameTypes.tv2,
                            index: 0,
                            status:{
                                ...tv,
                                videoUrl: video.videoUrl
                            }
                       })
                       // 저장을 위한 상태관리
                       const modelStatus = {
                           name: modelNameTypes.tv2,
                           position: tv.position,
                           installed: tv.installed,
                           scale: {x: tv.scale, y: tv.scale, z: tv.scale},
                           rotateY: tv.rotateY,
                           index,
                           videoUrl: video.videoUrl,
                
                         }
                         addModel(modelStatus)
                        return null
                    }
                })
                initFocused()
                setRerender((rerender:number) => rerender + 1)
                   
               
            }}>
            <video className="w-30 h-20" src={video.videoUrl} controls={true} />
            <span>{video.title}</span>
            <p>{video.description}</p>
            </div>
        }) : null}
        </div> : null
    )
}


export default EnrollFileToModelScreen;