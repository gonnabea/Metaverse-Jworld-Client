import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useRef, useState } from 'react';
import { useAspect } from "@react-three/drei";
import { Vector3 } from 'three';
import { addModel, applyModels, setModels } from '../../../stores/ThreeModels';
import { RerenderType } from '../../../types/common';
import { ThreeModelOpts, modelNameTypes } from '../../../types/threeModelTypes';

import { applyThreeModels, setAllModelsStatus } from '../../../stores/setAllThreeModels';
import { useReactiveVar } from '@apollo/client';

interface TV2ModelOpts extends ThreeModelOpts {

    videoUrl?: string;

}

const TV2Model = ({rerender, setRerender,}: RerenderType) => {

    const allModelsStatus = useReactiveVar(applyThreeModels);

    const { installed, scale, rotateY, isFocused, position, videoUrl="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" } = allModelsStatus.tv2[0]


    const createModelStatus = async () => {
        const modelStatus = {
          name: "tv2",
          position,
          installed,
          scale: {x: scale, y: scale, z: scale},
          rotateY,
          videoUrl
        }
        addModel(modelStatus)
      }


    const size = useAspect(18 * scale, 10 * scale);
    const [video] = useState(() => {
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
                //   setModelStatus({
                //     ...modelStatus,
                //     position: {x: closedObjPosition.x, y: 0, z: closedObjPosition.z}
                // });


                setAllModelsStatus({
                    modelName: modelNameTypes.tv2,
                    index: 0,
                    status: {
                        ...allModelsStatus.tv2[0],
                        position: {x: closedObjPosition.x, y: 0, z: closedObjPosition.z},
                
                    }
                })
                setRerender(value => value + 1)
            }
        
  };

  
    useEffect(() => {
        window.addEventListener("click", installModel)
        void video.play()
        if(!installed) {
            video.pause()
        }
        createModelStatus()
        return () => {
            video.pause()
            window.removeEventListener("click", installModel)
        };
    }, [
        isFocused, 
        // video, 
        // video.paused, 
        // video.src,        
        allModelsStatus,
        installed
       
    ])

    if(installed === true){
        
        return (
            <>
                <primitive 
                    // onClick={() => {
                    //     video.paused ? video.play() : video.pause()
                    // }} 
                    
                    position={[position.x, 0.4, position.z]} scale={scale} 
                    object={gltf.scene} 
                    rotation={[0, rotateY, 0]}
                    onPointerOver={() => {
                        document.body.style.cursor = "pointer"
                    }}
                    onPointerOut={() => {
                        document.body.style.cursor = "default"
    
                    }}
                />
                    <mesh onClick={() => video.paused ? video.play() : video.pause()} scale={new Vector3(scale*1.8, scale, scale)} rotation={[0,rotateY,0]} position={new Vector3(position.x,0.65 * scale, position.z)}>
                        <planeBufferGeometry />
                        <meshBasicMaterial>
                            <videoTexture attach="map" args={[video]} />
                        </meshBasicMaterial>
                    </mesh>
            </>
        )
    }
    else{
        video?.pause()
        return <></>
    }
  }

export default TV2Model;