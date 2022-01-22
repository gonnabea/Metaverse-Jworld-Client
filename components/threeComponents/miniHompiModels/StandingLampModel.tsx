

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


const StandingLampModel = ({rerender, setRerender ,isMyRoom, initFocused}) => {
  const allModelsStatus = useReactiveVar(applyThreeModels);
  const { installed, scale, rotateY, isFocused, position } = allModelsStatus.standingLamp[0]

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
    allModelsStatus.standingLamp.map(({ position, installed, scale, rotateY }, index) => {
        
        const modelStatus = {
          name: "standingLamp",
          position,
          installed,
          scale: {x: scale, y: scale, z: scale},
          rotateY,
          index,
        }
        addModel(modelStatus)

    }) 
    
  }
    
    const gltf = useLoader(GLTFLoader, modelList.standing_lamp);
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
      const findFocused = allModelsStatus.standingLamp.find(model => model.isFocused === true);
      if(findFocused !== undefined)
          return true
      else
          return false
  }

      // 현재 포커싱된 소파 찾기
      const findFocusedIndex = () => {
        const findFocusedIndex = allModelsStatus.standingLamp.findIndex(model => model.isFocused === true);
        
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
          console.log("standingLampModel 포커싱 상태");

          setAllModelsStatus({
            modelName: modelNameTypes.standingLamp,
            index: findFocusedIndex(),
            status: {
                ...allModelsStatus.standingLamp[findFocusedIndex()],
                position: {x: closedObjPosition.x, y: 0.5, z: closedObjPosition.z},
        
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
                              modelName: modelNameTypes.standingLamp,
                              index: 0,
                              status: {
                                ...allModelsStatus.standingLamp[0],
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

                {allModelsStatus.standingLamp.map((model, index) => {
                
                  if(index > 0 && model.installed === true) {
                      return (
                          <>
                          <primitive 
                              
                              onClick={async(e) => {
                                  
                                  console.log(`의자_${index} 클릭`)
                                  if(isMyRoom && checkFocused()){
                                      
                                      initFocused()
                                      console.log(model.position,model.isFocused)
                                      await setAllModelsStatus({
                                          modelName: modelNameTypes.standingLamp,
                                          index,
                                          status: {
                                          ...allModelsStatus.standingLamp[index],
                                          isFocused: true
                                          }
                                      })
                                      createModelStatus()
                                      setRerender(value => value + 1)
                                  }
                              pointLightRefArr[index].current.visible = !pointLightRefArr[index].current.visible;
                                  
                                  
                              }} 
                              position={[
                                  allModelsStatus.standingLamp[index].position.x, 
                                  allModelsStatus.standingLamp[index].position.y, 
                                  allModelsStatus.standingLamp[index].position.z
                              ]} 
                              scale={allModelsStatus.standingLamp[index].scale} 
                              rotation={[0, parseFloat(allModelsStatus.standingLamp[index].rotateY), 0]}
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
                              allModelsStatus.standingLamp[index].position.x + 0.2, 
                              allModelsStatus.standingLamp[index].position.y + 25 * scale, 
                              allModelsStatus.standingLamp[index].position.z
                            )} 
                          
                          distance={20}
                      />
                         
                          </>
                      )
                  }
              })}
           
           <Indicator 
                position={[
                    allModelsStatus.standingLamp[findFocusedIndex()].position.x, 
                    allModelsStatus.standingLamp[findFocusedIndex()].position.y +50 * allModelsStatus.standingLamp[findFocusedIndex()].scale ,
                    allModelsStatus.standingLamp[findFocusedIndex()].position.z
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

export default StandingLampModel;