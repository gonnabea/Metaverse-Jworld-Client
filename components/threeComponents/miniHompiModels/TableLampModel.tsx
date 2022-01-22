

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useMemo, useRef, useState } from 'react';
import { addModel, applyModels, setModels } from '../../../stores/ThreeModels';
import { RerenderType } from '../../../types/common';
import { ThreeModelOpts, modelNameTypes } from '../../../types/threeModelTypes';
import { applyThreeModels, setAllModelsStatus } from '../../../stores/setAllThreeModels';
import { useReactiveVar } from '@apollo/client';
import { clone } from '../../../config/skeletonUtils';
import Indicator from '../../common/Indicator';
import { Vector3 } from 'three';


const TableLampModel = ({rerender, setRerender ,isMyRoom, initFocused}) => {
  const allModelsStatus = useReactiveVar(applyThreeModels);
  const { installed, scale, rotateY, isFocused, position } = allModelsStatus.tableLamp[0]

  const pointLightRef = useRef();
  const pointLightRef2 = useRef();
  const pointLightRef3 = useRef();
  const pointLightRef4 = useRef();
  const pointLightRef5 = useRef();
  const pointLightRef6 = useRef();
  const pointLightRef7 = useRef();
  const pointLightRef8 = useRef();
  
  const pointLightRefArr = [
    pointLightRef2,
    pointLightRef3,
    pointLightRef4,
    pointLightRef5,
    pointLightRef6,
    pointLightRef7,
    pointLightRef8
  ]


  const createModelStatus = async () => {
    allModelsStatus.tableLamp.map(({ position, installed, scale, rotateY }, index) => {
        
        const modelStatus = {
          name: "tableLamp",
          position,
          installed,
          scale: {x: scale, y: scale, z: scale},
          rotateY,
          index,
        }
        addModel(modelStatus)

    }) 
    
  }
    
    const gltf = useLoader(GLTFLoader, modelList.tablelamp);
    // gltf.scene.castShadow = true;
    const raycaster = useThree((state) => state.raycaster);
    const scene = useThree((state) => state.scene)

    const cloned = useMemo(() => clone(gltf.scene), [scene])
    const cloned2 = useMemo(() => clone(gltf.scene), [scene])
    const cloned3 = useMemo(() => clone(gltf.scene), [scene])
    const cloned4 = useMemo(() => clone(gltf.scene), [scene])
    const cloned5 = useMemo(() => clone(gltf.scene), [scene])
    const cloned6 = useMemo(() => clone(gltf.scene), [scene])
    const cloned7 = useMemo(() => clone(gltf.scene), [scene])

    const checkFocused = () => {
      const findFocused = allModelsStatus.tableLamp.find(model => model.isFocused === true);
      if(findFocused !== undefined)
          return true
      else
          return false
  }

      // 현재 포커싱된 소파 찾기
      const findFocusedIndex = () => {
        const findFocusedIndex = allModelsStatus.tableLamp.findIndex(model => model.isFocused === true);
        
        if(findFocusedIndex === -1)
            return 0

        return findFocusedIndex
    }

    const clonedArr = [
      cloned,
      cloned2,
      cloned3,
      cloned4,
      cloned5,
      cloned6,
      cloned7,
  ]
    
    const installModel = (e) => {

      // 마우스 클릭한 지점 위치 얻기
      const closedObjPosition = raycaster.intersectObjects(scene.children)[0]?.point

      // 모델 설치
      if(closedObjPosition && checkFocused() === true && e.target.tagName === "CANVAS"){
          console.log("tableLampModel 포커싱 상태");

          setAllModelsStatus({
            modelName: modelNameTypes.tableLamp,
            index: findFocusedIndex(),
            status: {
                ...allModelsStatus.tableLamp[findFocusedIndex()],
                position: {x: closedObjPosition.x, y: closedObjPosition.y, z: closedObjPosition.z},
        
            }
      })
        setRerender(value => value + 1)
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
    ])

    if(installed === true){

        return (
            <>
            <primitive 
                  onPointerOver={() => {
                    document.body.style.cursor = "pointer"
                }}
                onPointerOut={() => {
                    document.body.style.cursor = "default"

                }}
                 onClick={(e) => {
                  if(isMyRoom && checkFocused()) {
             
                          initFocused()
                          setAllModelsStatus({
                              modelName: modelNameTypes.tableLamp,
                              index: 0,
                              status: {
                                ...allModelsStatus.tableLamp[0],
                                isFocused: true
                              }
                          })
                          
                          createModelStatus()
                          setRerender(value => value + 1)
                          
                        }
                        pointLightRef.current.visible = !pointLightRef.current.visible;
                      }}
                position={[position.x, position.y, position.z]} scale={scale} 
                object={gltf.scene} 
                rotation={[0, rotateY, 0]}

                

                />

          <pointLight 
                
                ref={pointLightRef} 
                color="orange" 
                intensity={1} 
                position={new Vector3(position.x + 0.2, position.y + 25 * scale, position.z)} 
                
                distance={20}
            />

                {allModelsStatus.tableLamp.map((model, index) => {
                
                  if(index > 0 && model.installed === true) {
                      return (
                          <>
                          <primitive 
                              
                              onClick={async(e) => {
                                  
            
                                  if(isMyRoom && checkFocused()){
                                      
                                      initFocused()
                                      console.log(model.position,model.isFocused)
                                      await setAllModelsStatus({
                                          modelName: modelNameTypes.tableLamp,
                                          index,
                                          status: {
                                          ...allModelsStatus.tableLamp[index],
                                          isFocused: true
                                          }
                                      })
                                      createModelStatus()
                                      setRerender(value => value + 1)
                                  }
                                pointLightRefArr[index].current.visible = !pointLightRefArr[index].current.visible;
                                  
                                  
                              }} 
                              position={[
                                  allModelsStatus.tableLamp[index].position.x, 
                                  allModelsStatus.tableLamp[index].position.y, 
                                  allModelsStatus.tableLamp[index].position.z
                              ]} 
                              scale={allModelsStatus.tableLamp[index].scale} 
                              rotation={[0, parseFloat(allModelsStatus.tableLamp[index].rotateY), 0]}
                              onPointerOver={() => {
                                  document.body.style.cursor = "pointer"
                              }}
                              onPointerOut={() => {
                                  document.body.style.cursor = "default"
  
                              }}
                              object={clonedArr[index-1]} 
                          />

                      <pointLight 
                          
                          ref={pointLightRefArr[index]} 
                          color="orange" 
                          intensity={1} 
                          position={
                            new Vector3(
                              allModelsStatus.tableLamp[index].position.x + 0.2, 
                              allModelsStatus.tableLamp[index].position.y + 25 * scale, 
                              allModelsStatus.tableLamp[index].position.z
                            )} 
                          
                          distance={20}
                      />
                         
                          </>
                      )
                  }
              })}
           
           <Indicator 
                position={[
                    allModelsStatus.tableLamp[findFocusedIndex()].position.x, 
                    allModelsStatus.tableLamp[findFocusedIndex()].position.y + 60 * allModelsStatus.tableLamp[findFocusedIndex()].scale ,
                    allModelsStatus.tableLamp[findFocusedIndex()].position.z
                ]} 
                visible={checkFocused()} 
            />
          </>
        )
    }
    else{
        return <></>
    }
  }

export default TableLampModel;