import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import fileApi from "../apis/axios/fileUpload";
import { UPDATE_FILE_URL } from "../apis/gql-queries/threeModel";
import { AllModelsStatus } from "../data/modelList";
import useGetMe from "../hooks/useGetMe";
import useUpdateFileUrl from "../hooks/useUpdateFileUrl";
import { applyThreeModels, setAllModelsStatus } from "../stores/setAllThreeModels";
import { applyModels } from "../stores/ThreeModels";
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
const EnrollFileToModelScreen = ({show, setRerender, rerender}) => {

    const [images, setImages] = useState<[] | image[]>([]);
    const [videos, setVideos] = useState<[] | video[]>([]);
    const [reqGetMe, loading] = useGetMe();
    
    const [user, setUser] = useState();
    const [focusedFrame, setFocusedFrame] = useState<focusedModelType | null>();
    const [focusedTV, setFocusedTV] = useState<focusedModelType | null>();

    const [newImgUrl, setNewImgUrl] = useState<string>("");
    const [newVideoUrl, setNewVideoUrl] = useState<string | null>();

  

  
    
    const setMyInfo = async() => {
        const {data: {getMe: {user}} } = await reqGetMe();
        setUser(user);
        const images = await fileApi.getImages({ownerId: user.id});
        const videos = await fileApi.getVideos({ownerId: user.id});

        setImages(images.data);
        setVideos(videos.data);


        applyThreeModels().frame1.map((frame, index: number) => {
            if(frame.isFocused === true) {
                setFocusedFrame({
                    index,
                    name: modelNameTypes.frame1,
                    ...frame
                })
                return null
            }
        })
        applyThreeModels().frame2.map((frame, index: number) => {
            if(frame.isFocused === true) {
                setFocusedFrame({
                    index,
                    name: modelNameTypes.frame2,
                    ...frame
                })
                return null

            }
        })
        applyThreeModels().tv2.map((tv, index: number) => {
            if(tv.isFocused === true) {
                setFocusedTV({
                    index,
                    name: modelNameTypes.tv2,
                    ...tv
                })
                return null

            }
        })
        

        
    }
    
    // 모델에 이미지 붙이기
    const updateImageUrl = async(imageUrl: string) => {
 
        setNewImgUrl(imageUrl)

    
        
    }
    
    
    
    useEffect(() => {
        setMyInfo()

    }, [show])

// 유저가 업로드한 이미지, 동영상 파일 리스트 UI
    return (
        show ? 
        <div className="w-screen h-1/6 bg-gray-300 z-20 fixed bottom-0 flex">
            {console.log(images)}
        {images.map(image => {
           return <div onClick={async() => {
               
                   
                // 포커싱된 액자 찾고 업로드한 이미지 클릭 시 fileUrl 등록해주기 
                applyThreeModels().frame1.map((frame, index: number) => {
                    if(frame.isFocused === true) {
                        setAllModelsStatus({
                            modelName: modelNameTypes.frame1,
                            index,
                            status:{
                                ...frame,
                                imageUrl: image.imageUrl
                            }
                       })
                        return null
                    }
                })
                
                   
        setRerender((rerender:number) => rerender + 1)
                   
               
            }}>
            <img className="w-12 h-12" src={image.imageUrl} />
            <span>{image.title}</span>
            <p>{image.description}</p>
            </div>
        })}
        {/* <ImageList images={images} /> */}
        </div> : null
    )
}


export default EnrollFileToModelScreen;