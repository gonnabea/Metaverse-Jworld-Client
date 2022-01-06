import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useGraph, useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useMemo, useRef, useState } from 'react';
import { addModel, applyModels, setModels } from '../../../stores/ThreeModels';
import { ThreeModelOpts } from '../../../types/common';
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils"
import * as THREE from "three"


const Chair2Model = ({modelStatus, setModelStatus,}:ThreeModelOpts) => {

  const { installed, scale, rotateY, isFocused, position, imageUrl} = modelStatus

    const createModelStatus = async () => {
        const modelStatus = {
          name: "chair2",
          position,
          installed,
          scale: {x: scale, y: scale, z: scale},
          rotateY
        }
        addModel(modelStatus)
      }
    
    const gltf = useLoader(GLTFLoader, modelList.chair_2);
    
    const raycaster = useThree((state) => state.raycaster);
    const scene = useThree((state) => state.scene)
    // const clone = useMemo(() => SkeletonUtils.clone(scene), [gltf.scene])
    // const { nodes } = useGraph(clone)
    
    const installModel = (e) => {

      // 마우스 클릭한 지점 위치 얻기
      const closedObjPosition = raycaster.intersectObjects(scene.children)[0]?.point

      // 모델 설치
      if(closedObjPosition && isFocused === true && e.target.tagName === "CANVAS"){
          console.log("의자 포커싱 상태");
          setModelStatus({
            ...modelStatus,
            position: {x: closedObjPosition.x, y: 0, z: closedObjPosition.z}
        });
      }
  };



  
    useEffect(() => {
        window.addEventListener("click", installModel);
        createModelStatus()
        return () => window.removeEventListener("click", installModel);
    }, [        
        installed,
        scale,
        isFocused,
        rotateY,
        position
    ])

    if(installed === true){

        return (
            <>
            <primitive 
                onClick={() => console.log("의자 클릭")} 
                position={[position.x, position.y, position.z]} scale={scale} rotation={[0, rotateY, 0]}
                object={gltf.scene} 
            />
            {/* <primitive 
                onClick={() => console.log("의자 클릭")} 
                position={[position.x+0.5, position.y, position.z+0.5]} scale={scale} rotation={[0, rotateY, 0]}
                object={nodes} 
            /> */}

          </>
        )
    }
    else{
        return <></>
    }
  }

export default Chair2Model;