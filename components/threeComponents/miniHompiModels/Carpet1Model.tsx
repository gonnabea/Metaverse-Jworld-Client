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
      carpet1: [ 0, 0, 0 ],
      carpet2: [ 0, 0, 0 ], 
      carpet3: [ 0, 0, 0 ], 
      carpet4: [ 0, 0, 0 ],
      
    })

    const [modelsStatus, setModelsStatus] = useState({
    
      rotations: {
        carpet1: [ 0, rotateY, 0 ], 
        carpet2: [ 0, rotateY, 0 ], 
        carpet3: [ 0, rotateY, 0 ], 
        carpet4: [ 0, rotateY, 0 ],
      },
      scales: {
        carpet1: scale, 
        carpet2: scale, 
        carpet3: scale, 
        carpet4: scale,
      }
    })

        // 모든 모델들의 상태를 관리
        const manageStatus = () => {
          switch(focusedCarpet){
            case 1:
              
              setModelsStatus({
                
             
                rotations: {
                  // 카페트 1-2의 회전 상태 최신화
                  ...modelsStatus.rotations,
                  carpet1: [ 0, rotateY, 0 ],
                },
                scales: {
                  // 카페트 1-2의 크기 상태 최신화
                  ...modelsStatus.scales,
                  carpet1: scale,
                },
               
              }) 
              break;
            
            case 2:
              
              setModelsStatus({
                
              
                rotations: {
                  // 카페트 1-2의 회전 상태 최신화
                  ...modelsStatus.rotations,
                  carpet2: [ 0, rotateY, 0 ],
                },
                scales: {
                  // 카페트 1-2의 크기 상태 최신화
                  ...modelsStatus.scales,
                  carpet2: scale,
                },
               
              }) 
              break;
            case 3:
              setModelsStatus({
                
            
                rotations: {
                  // 카페트 1-3의 회전 상태 최신화
                  ...modelsStatus.rotations,
                  carpet3: [ 0, rotateY, 0 ],
                },
                scales: {
                  // 카페트 1-3의 크기 상태 최신화
                  ...modelsStatus.scales,
                  carpet3: scale,
                },
               
              }) 
              break;
            case 4:
              setModelsStatus({
                
             
                rotations: {
                  // 카페트 1-4의 회전 상태 최신화
                  ...modelsStatus.rotations,
                  carpet4: [ 0, rotateY, 0 ],
                },
                scales: {
                  // 카페트 1-4의 크기 상태 최신화
                  ...modelsStatus.scales,
                  carpet4: scale,
                },
               
              }) 
              break;
          }
        }
        

    // 서버에 모델 상태 저장을 위함
    const createModelStatus = async () => {
        const modelStatus = {
          name: "carpet1",
          position,
          installed,
          scale: {x: scale, y: scale, z: scale},
          rotateY
        }
        console.log(modelsStatus.rotations.carpet2[1])
        const model2Status = {
          name: "carpet1-2",
          position: {x:carpetsPosition.carpet2[0], y:carpetsPosition.carpet2[1], z: carpetsPosition.carpet2[2]},
          installed,
          scale: {x: modelsStatus.scales.carpet2, y: modelsStatus.scales.carpet2, z: modelsStatus.scales.carpet2},
          rotateY: modelsStatus.rotations.carpet2[1].toString()
        }

        const model3Status = {
          name: "carpet1-3",
          position: {x:carpetsPosition.carpet3[0], y:carpetsPosition.carpet3[1], z: carpetsPosition.carpet3[2]},
          installed,
          scale: {x: modelsStatus.scales.carpet3, y: modelsStatus.scales.carpet3, z: modelsStatus.scales.carpet3},
          rotateY: modelsStatus.rotations.carpet3[1].toString()
        }

        const model4Status = {
          name: "carpet1-4",
          position: {x:carpetsPosition.carpet4[0], y:carpetsPosition.carpet4[1], z: carpetsPosition.carpet4[2]},
          installed,
          scale: {x: modelsStatus.scales.carpet4, y: modelsStatus.scales.carpet4, z: modelsStatus.scales.carpet4},
          rotateY: modelsStatus.rotations.carpet4[1].toString()
        }
        addModel(modelStatus)
        addModel(model2Status)
        addModel(model3Status)
        addModel(model4Status)

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
            setCarpetsPosition({
              ...carpetsPosition,
              carpet1: [closedObjPosition.x, 0, closedObjPosition.z],
            }) 
            
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
      manageStatus()
      window.addEventListener("click", installModel);
      createModelStatus()
        return () => window.removeEventListener("click", installModel);
    }, [
        isFocused, 
        installed,
        scale,
        rotateY,
        position,
        
        
    ])

    if(installed === true){

        return (
            <>
            <primitive 
                onClick={() => {console.log("카페트1-1 클릭됨")
                isFocused = false;
                setFocusedCarpet(1)
              }} 
              position={carpetsPosition.carpet1} 
              scale={modelsStatus.scales.carpet1} 
              rotation={modelsStatus.rotations.carpet1}
                object={gltf.scene} 
            />
            { installNum >= 2  ? <primitive 
                onClick={() => {console.log("카페트1-2 클릭됨")
                setFocusedCarpet(2)
              }} 
                position={carpetsPosition.carpet2} 
                scale={modelsStatus.scales.carpet2} 
                rotation={modelsStatus.rotations.carpet2}
                object={cloned} 
            />: null }
             { installNum >= 3  ? <primitive 
                onClick={() => {console.log("카페트1-3 클릭됨")
                setFocusedCarpet(3)
              }} 
                position={carpetsPosition.carpet3} 
                scale={modelsStatus.scales.carpet3} 
                rotation={modelsStatus.rotations.carpet3}
                object={cloned2} 
            />: null }
             { installNum >= 4  ? <primitive 
                onClick={() => {console.log("카페트1-4 클릭됨")
                setFocusedCarpet(4)
              }} 
                position={carpetsPosition.carpet4} 
                scale={modelsStatus.scales.carpet4} 
                rotation={modelsStatus.rotations.carpet4}
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