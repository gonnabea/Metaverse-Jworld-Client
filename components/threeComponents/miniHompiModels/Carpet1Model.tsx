import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useGraph, useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useMemo, useRef, useState } from 'react';
import { addModel } from '../../../stores/ThreeModels';
import { ThreeModelOpts, XYZType } from '../../../types/common';


import {clone} from "../../../config/skeletonUtils";
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/router';

interface CarpetModelOpts extends ThreeModelOpts {
  threeModels: any;
}



const Carpet1Model = ({modelStatus, setModelStatus, installNum, setInstallNum, threeModels}:CarpetModelOpts) => {

  const { installed, scale, rotateY, isFocused, position, imageUrl} = modelStatus
    
  const [focusedCarpet, setFocusedCarpet] = useState(1);
  const [focusedPostion, setFocusedPosition] = useState<[x:0,y:0,z:0]>([0,0,0]);
    
   console.log(threeModels)

   const carpet1_2 = threeModels?.models.find(model => model.name === "carpet1-2")
   const carpet1_3 = threeModels?.models.find(model => model.name === "carpet1-3")
   const carpet1_4 = threeModels?.models.find(model => model.name === "carpet1-4")

   


  // 카페트들의 위치 초기값
    const [carpetsPosition, setCarpetsPosition] = useState({
      carpet1: [ position.x, position.y, position.z ],
      carpet2: [ carpet1_2?.position.x, carpet1_2?.position.y, carpet1_2?.position.z ], 
      carpet3: [ carpet1_3?.position.x, carpet1_3?.position.y, carpet1_3?.position.z ], 
      carpet4: [ carpet1_4?.position.x, carpet1_4?.position.y, carpet1_4?.position.z ],
      
    })

    // 카페트들의 로테이션, 스케일 초기값
    const [modelsStatus, setModelsStatus] = useState({
    
      rotations: {
        carpet1: [ 0, rotateY, 0 ], 
        carpet2: [ 0, parseInt(carpet1_2?.rotateY), 0 ], 
        carpet3: [ 0, parseInt(carpet1_3?.rotateY), 0 ], 
        carpet4: [ 0, parseInt(carpet1_4?.rotateY), 0 ],
      },
      scales: {
        carpet1: scale, 
        carpet2: carpet1_2?.scale.x, 
        carpet3: carpet1_3?.scale.x, 
        carpet4: carpet1_4?.scale.x,
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
      console.log(raycaster.intersectObjects(scene.children)[0].object.name)
      const modelName = raycaster.intersectObjects(scene.children)[0].object.name

      if(closedObjPosition && isFocused === true && e.target.tagName === "CANVAS")
        setFocusedPosition([closedObjPosition.x, 2, closedObjPosition.z])
      
      // 모델 설치
      // 포커싱 상태, 캔버스 클릭, 같은 모델과 겹침 설치 못하도록.
      if(closedObjPosition && isFocused === true && e.target.tagName === "CANVAS" && modelName !== "tapi_tapi001_0"){
        
        console.log("카페트 포커싱 상태");
        switch(focusedCarpet){
          
          case 1:
            setCarpetsPosition({
              ...carpetsPosition,
              carpet1: [closedObjPosition.x, 0, closedObjPosition.z],
            }) 
            setModelStatus({
              ...modelStatus,
              position: {x: closedObjPosition.x, y: 0, z: closedObjPosition.z}
          });
          
            
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

    const initFocusedCarpet = () => {
      if(!isFocused)
      setFocusedCarpet(0)
    }

    
    
    
    useEffect(() => {
      initFocusedCarpet()
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
        focusedCarpet,
        focusedPostion
    ])

    if(installed === true){

        return (
            <>
            <primitive 
                
                
                onClick={() => {
                  console.log("카페트1-1 클릭됨")
                  setFocusedCarpet(1)
                setModelStatus({
                  ...modelStatus,
                  isFocused: true
                })
              }} 
              position={carpetsPosition.carpet1} 
              scale={modelsStatus.scales.carpet1} 
              rotation={modelsStatus.rotations.carpet1}
                object={gltf.scene} 
            />
            { installNum >= 2  ? <primitive 
                onClick={() => {
                  console.log("카페트1-2 클릭됨")
                  setFocusedCarpet(2)
                  setModelStatus({
                    ...modelStatus,
                    isFocused: true
                  })
              }} 
                position={carpetsPosition.carpet2} 
                scale={modelsStatus.scales.carpet2} 
                rotation={modelsStatus.rotations.carpet2}
                object={cloned} 
            />: null }
             { installNum >= 3  ? <primitive 
                onClick={() => {
                  console.log("카페트1-3 클릭됨")
                  setFocusedCarpet(3)
                  setModelStatus({
                    ...modelStatus,
                    isFocused: true
                  })
              }} 
                position={carpetsPosition.carpet3} 
                scale={modelsStatus.scales.carpet3} 
                rotation={modelsStatus.rotations.carpet3}
                object={cloned2} 
            />: null }
             { installNum >= 4  ? <primitive 
                onClick={() => {
                  console.log("카페트1-4 클릭됨")
                  setFocusedCarpet(4)
                  setModelStatus({
                    ...modelStatus,
                    isFocused: true
                  })
              }} 
                position={carpetsPosition.carpet4} 
                scale={modelsStatus.scales.carpet4} 
                rotation={modelsStatus.rotations.carpet4}
                object={cloned3} 
            />: null }
            
            <Indicator position={focusedPostion} visible={isFocused} />
          </>
        )
    }
    else{
        return <></>
    }
  }

export default Carpet1Model;