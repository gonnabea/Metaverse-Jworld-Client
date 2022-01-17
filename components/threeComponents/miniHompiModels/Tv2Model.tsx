import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAspect } from "@react-three/drei";
import { Vector3 } from 'three';
import { addModel, applyModels, setModels } from '../../../stores/ThreeModels';
import { RerenderType } from '../../../types/common';
import { ThreeModelOpts, modelNameTypes } from '../../../types/threeModelTypes';

import { applyThreeModels, setAllModelsStatus } from '../../../stores/setAllThreeModels';
import { useReactiveVar } from '@apollo/client';
import Indicator from '../../common/Indicator';
import { clone } from '../../../config/skeletonUtils';

interface TV2ModelOpts extends ThreeModelOpts {

    videoUrl?: string;

}

const TV2Model = ({rerender, setRerender, initFocused, isMyRoom}) => {

    const allModelsStatus = useReactiveVar(applyThreeModels);

    const { installed, scale, rotateY, isFocused, position, videoUrl } = allModelsStatus.tv2[0]

    const defaultVideoUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

    const createModelStatus = async () => {
        const modelStatus = {
          name: "tv2",
          position,
          installed,
          scale: {x: scale, y: scale, z: scale},
          rotateY,
          videoUrl,
          index:0
        }
        addModel(modelStatus)
      }

      // tv가 포커싱 되었는 지 확인해주는 함수
      const checkFocused = () => {
        const findFocused = allModelsStatus.tv2.find(model => model.isFocused === true);
        console.log(findFocused)
        if(findFocused !== undefined)
            return true
        else
            return false
    }


    const size = useAspect(18 * scale, 10 * scale);
    const [video, setVideo] = useState(() => {
      const vid = document.createElement("video");
      vid.src = videoUrl ? videoUrl : defaultVideoUrl;
      vid.crossOrigin = "Anonymous";
      vid.loop = true;
      return vid;
    });


    const gltf = useLoader(GLTFLoader, modelList.tv_2);

    const raycaster = useThree((state) => state.raycaster);
    const scene = useThree((state) => state.scene)

    const cloned = useMemo(() => clone(gltf.scene), [scene])
    const cloned2 = useMemo(() => clone(gltf.scene), [scene])
    const cloned3 = useMemo(() => clone(gltf.scene), [scene])
    const cloned4 = useMemo(() => clone(gltf.scene), [scene])
    const cloned5 = useMemo(() => clone(gltf.scene), [scene])
    const cloned6 = useMemo(() => clone(gltf.scene), [scene])
    const cloned7 = useMemo(() => clone(gltf.scene), [scene])



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
     
        // 비디오 변경 시 실시간 반영 위함
        video.src= allModelsStatus.tv2[0].videoUrl
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
         
        installed,
        video,
        videoUrl,
    ])

    if(installed === true){
        
        return (
            <>

                <primitive 
                onClick={(e) => {
                    console.log("tv2 클릭")
                    if(isMyRoom) {
               
                            initFocused()
        
                            setAllModelsStatus({
                                modelName: modelNameTypes.tv2,
                                index: 0,
                                status: {
                                  ...allModelsStatus.tv2[0],
                                  isFocused: true
                                }
                            })

                    
                            createModelStatus()
                            setRerender(value => value + 1)
                        
                    }
            }} 
                position={[position.x, 0.4, position.z]} scale={scale} rotation={[0, parseFloat(rotateY), 0]}
                onPointerOver={() => {
                    document.body.style.cursor = "pointer"
                }}
                onPointerOut={() => {
                    document.body.style.cursor = "default"

                }}
                object={gltf.scene} 
            />

                
                <mesh onClick={() => video.paused ? video.play() : video.pause()} 
                    scale={new Vector3(scale*1.8, scale, scale)} rotation={[0,rotateY,0]} 
                    position={new Vector3(position.x,0.65 * scale, position.z)}>
                    <planeBufferGeometry />
                    <meshBasicMaterial>
                        <videoTexture attach="map" args={[video]} />
                    </meshBasicMaterial>
                </mesh>

                <Indicator 
                position={[
                    allModelsStatus.tv2[0].position.x, 
                    allModelsStatus.tv2[0].position.y +4 * allModelsStatus.tv2[0].scale / 2.5,
                    allModelsStatus.tv2[0].position.z
                ]} 
                visible={checkFocused()} 
            />

            </>
        )
    }
    else{
        video?.pause()
        return <></>
    }
  }

export default TV2Model;