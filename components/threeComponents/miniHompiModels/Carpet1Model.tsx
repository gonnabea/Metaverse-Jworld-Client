import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useGraph, useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useMemo, useRef, useState } from 'react';
import { addModel } from '../../../stores/ThreeModels';
import { ThreeModelOpts, XYZType } from '../../../types/common';


import {clone} from "../../../config/skeletonUtils";




const Carpet1Model = ({installed, scale, isFocused, rotateY, position, setPosition, installNum, setInstallNum}:ThreeModelOpts) => {

    
    const [focusedCarpet, setFocusedCarpet] = useState(1);

   

    const [carpetsPosition, setCarpetsPosition] = useState({
      carpet2: [ 0, 0, 0 ], 
      carpet3: [ 0, 0, 0 ], 
      carpet4: [ 0, 0, 0 ],
      
    })

    
    const createModelStatus = async () => {
        const modelStatus = {
          name: "carpet1",
          position,
          installed,
          scale: {x: scale, y: scale, z: scale},
          rotateY
        }
        addModel(modelStatus)
      }
    
      console.log(clone)
      const raycaster = useThree((state) => state.raycaster);
      const scene = useThree((state) => state.scene)
      const gltf = useLoader(GLTFLoader, modelList.carpet_1);
      const cloned = useMemo(() => clone(gltf.scene), [scene])
      const cloned2 = useMemo(() => clone(gltf.scene), [scene])
      const cloned3 = useMemo(() => clone(gltf.scene), [scene])

      console.log(cloned)
      const graph = useGraph(cloned)
      const installModel = (e) => {
        
        // 마우스 클릭한 지점 위치 얻기
      const closedObjPosition = raycaster.intersectObjects(scene.children)[0]?.point
      
      // 모델 설치
      if(closedObjPosition && isFocused === true && e.target.tagName === "CANVAS"){
        console.log("카페트 포커싱 상태");

        switch(focusedCarpet){
          case 1:
            setPosition(position => position = {x: closedObjPosition.x, y: 0, z: closedObjPosition.z});
            
            break;
          case 2:
            setCarpetsPosition({
              ...carpetsPosition,
              carpet2: [closedObjPosition.x, 0, closedObjPosition.z],

              
            }) 
            break;
          case 3:
            setCarpetsPosition({
              
              ...carpetsPosition,
              carpet3: [closedObjPosition.x, 0, closedObjPosition.z], 

              
            }) 
            break;
          case 4:
            setCarpetsPosition({
              
              ...carpetsPosition,
              carpet4: [closedObjPosition.x, 0, closedObjPosition.z]
              
            }) 
            break;
        }

      }
    };
    
    
    
    
    useEffect(() => {
    
      window.addEventListener("click", installModel);
      createModelStatus()
        return () => window.removeEventListener("click", installModel);
    }, [
        isFocused, 
        installed,
        scale,
        rotateY,
        position,
        carpetsPosition
    ])

    if(installed === true){

        return (
            <>
            <primitive 
                onClick={() => {console.log("카페트1-1 클릭됨")
                isFocused = false;
                setFocusedCarpet(1)
              }} 
                position={[position.x-0.5, position.y, position.z-0.5]} 
                scale={scale} 
                rotation={[0, rotateY, 0]}
                object={gltf.scene} 
            />
            { installNum >= 2  ? <primitive 
                onClick={() => {console.log("카페트1-2 클릭됨")
                setFocusedCarpet(2)
              }} 
                position={carpetsPosition.carpet2} 
                scale={scale} 
                rotation={[0, rotateY, 0]}
                object={cloned} 
            />: null }
             { installNum >= 3  ? <primitive 
                onClick={() => {console.log("카페트1-3 클릭됨")
                setFocusedCarpet(3)
              }} 
                position={carpetsPosition.carpet3} 
                scale={scale} 
                rotation={[0, rotateY, 0]}
                object={cloned2} 
            />: null }
             { installNum >= 4  ? <primitive 
                onClick={() => {console.log("카페트1-4 클릭됨")
                setFocusedCarpet(4)
              }} 
                position={carpetsPosition.carpet4} 
                scale={scale} 
                rotation={[0, rotateY, 0]}
                object={cloned3} 
            />: null }
            

          </>
        )
    }
    else{
        return <></>
    }
  }

export default Carpet1Model;