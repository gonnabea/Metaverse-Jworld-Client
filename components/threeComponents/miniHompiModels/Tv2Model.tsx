import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useRef, useState } from 'react';
import { useAspect } from "@react-three/drei";
import { Vector3 } from 'three';
import { addModel, applyModels, setModels } from '../../../stores/ThreeModels';


interface TV2ModelOpts {
    installed: boolean; // 모델 설치 or 미설치
    scale: number;
    isFocused: boolean;
    rotateY: number;
    videoUrl?: string;
    saveModels: boolean;
    
}

const TV2Model = ({installed, scale, isFocused, rotateY, saveModels, videoUrl="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}:TV2ModelOpts) => {
    const [position, setPosition] = useState([0, 0, 0])

    const size = useAspect(18 * scale, 10 * scale);
    const [video, setVideo] = useState(() => {
      const vid = document.createElement("video");
      vid.src = videoUrl;
      vid.crossOrigin = "Anonymous";
      vid.loop = true;
      return vid;
    });


    const gltf = useLoader(GLTFLoader, modelList.tv_2);

    const raycaster = useThree((state) => state.raycaster);
    const scene = useThree((state) => state.scene)



    const installModel = (e) => {
        
            // 마우스 클릭한 지점 위치 얻기
            const closedObjPosition = raycaster.intersectObjects(scene.children)[0]?.point
            console.dir(e.target.tagName)
            // 모델 설치
            if(closedObjPosition && isFocused === true && e.target.tagName === "CANVAS"){
                  console.log("tv 포커싱 상태");
                setPosition(position => position = [closedObjPosition.x, 0.4, closedObjPosition.z]);
            }
        
  };

  
    useEffect(() => {
        window.addEventListener("click", installModel)
        video.pause()
        if(saveModels === true) {
            addModel({
                name: "book",
                installed,
                scale,
                rotateY,
                position
            })
        }
        return () => window.removeEventListener("click", installModel);
    }, [isFocused, video, video.paused, video.src])

    if(installed === true){
        video.play()
        return (
            <>
                <primitive 
                    onClick={() => {
                        video.paused ? video.play() : video.pause()
                    }} 
                    
                    position={position} scale={scale} 
                    object={gltf.scene} 
                    rotation={[0, rotateY, 0]}
                    onPointerOver={() => {
                        document.body.style.cursor = "pointer"
                    }}
                    onPointerOut={() => {
                        document.body.style.cursor = "default"
    
                    }}
                />
                    <mesh onClick={() => video.paused ? video.play() : video.pause()} scale={new Vector3(scale*1.8, scale, scale)} rotation={[0,rotateY,0]} position={new Vector3(position[0],0.65 * scale,position[2])}>
                        <planeBufferGeometry />
                        <meshBasicMaterial>
                            <videoTexture attach="map" args={[video]} />
                        </meshBasicMaterial>
                    </mesh>
            </>
        )
    }
    else{
        video.pause()
        return <></>
    }
  }

export default TV2Model;