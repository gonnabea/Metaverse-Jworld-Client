import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useRef, useState } from 'react';
import { addModel, applyModels, setModels } from '../../../stores/ThreeModels';
import { ThreeModelOpts } from '../../../types/common';




const VaseModel = ({installed, scale, isFocused, rotateY, saveModels, position, setPosition}:ThreeModelOpts) => {

    
    const gltf = useLoader(GLTFLoader, modelList.vase);
    // gltf.scene.castShadow = true;
    const raycaster = useThree((state) => state.raycaster);
    const scene = useThree((state) => state.scene)
    
    const installModel = (e) => {

      // 마우스 클릭한 지점 위치 얻기
      const closedObjPosition = raycaster.intersectObjects(scene.children)[0]?.point

      // 모델 설치
      if(closedObjPosition && isFocused === true && e.target.tagName === "CANVAS"){
          console.log("VaseModel 포커싱 상태");
          setPosition(position => position = {x: closedObjPosition.x, y: 0, z: closedObjPosition.z});
      }
  };



  
    useEffect(() => {
        window.addEventListener("click", installModel);
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
    }, [isFocused])

    if(installed === true){

        return (
            <>
            <primitive 
                onClick={() => console.log("VaseModel 클릭됨")} 
                position={[position.x, position.y, position.z]} scale={scale} 
                object={gltf.scene} 
                rotation={[0, rotateY, 0]}
            />

          </>
        )
    }
    else{
        return <></>
    }
  }

export default VaseModel;