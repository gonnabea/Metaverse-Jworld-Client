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


const Table3Model = ({rerender, setRerender ,isMyRoom, initFocused}) => {
  const allModelsStatus = useReactiveVar(applyThreeModels);
  const { installed, scale, rotateY, isFocused, position } = allModelsStatus.table3[0]


  const createModelStatus = async () => {
    allModelsStatus.table3.map(({ position, installed, scale, rotateY }, index) => {
        
        const modelStatus = {
          name: modelNameTypes.table3,
          position,
          installed,
          scale: {x: scale, y: scale, z: scale},
          rotateY,
          index,
        }
        addModel(modelStatus)

    }) 
    
  }
    
    const gltf = useLoader(GLTFLoader, modelList.table_3);
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
      const findFocused = allModelsStatus.table3.find(model => model.isFocused === true);
      if(findFocused !== undefined)
          return true
      else
          return false
  }

      // ?????? ???????????? ?????? ??????
      const findFocusedIndex = () => {
        const findFocusedIndex = allModelsStatus.table3.findIndex(model => model.isFocused === true);
        
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

      // ????????? ????????? ?????? ?????? ??????
      const closedObjPosition = raycaster.intersectObjects(scene.children)[0]?.point

      // ?????? ??????
      if(closedObjPosition && checkFocused() === true && e.target.tagName === "CANVAS"){
          console.log("table3Model ????????? ??????");

          setAllModelsStatus({
            modelName: modelNameTypes.table3,
            index: findFocusedIndex(),
            status: {
                ...allModelsStatus.table3[findFocusedIndex()],
                position: {x: closedObjPosition.x, y: 0, z: closedObjPosition.z},
        
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
                   // ?????? ?????????, ?????????1??? ????????? ?????? ?????? (?????? ????????? ?????? ???????????? ??? ??????)
                  if(isMyRoom && installed === true && checkFocused()) {
                      console.log("????????? ??????")
             
                          initFocused()
                          setAllModelsStatus({
                              modelName: modelNameTypes.table3,
                              index: 0,
                              status: {
                                ...allModelsStatus.table3[0],
                                isFocused: true
                              }
                          })
                          
                          createModelStatus()
                          setRerender(value => value + 1)
                      
                  }
          }}
                position={[position.x, position.y, position.z]} scale={scale} 
                object={gltf.scene} 
                rotation={[0, rotateY, 0]}

                />

                {allModelsStatus.table3.map((model, index) => {
                
                  if(index > 0 && model.installed === true) {
                      return (
                          <>
                          <primitive 
                              
                              onClick={async(e) => {
                                 
                                  console.log(`?????????1_${index} ??????`)
                                  // ?????? ?????????, ?????????1??? ????????? ?????? ?????? (?????? ????????? ?????? ???????????? ??? ??????)
                                  if(isMyRoom && model.installed && checkFocused()){
                                      
                                      initFocused()
                                      console.log(model.position,model.isFocused)
                                      await setAllModelsStatus({
                                          modelName: modelNameTypes.table3,
                                          index,
                                          status: {
                                          ...allModelsStatus.table3[index],
                                          isFocused: true
                                          }
                                      })
                                      createModelStatus()
                                      setRerender(value => value + 1)
                                  }
                                  
                                  
                              }} 
                              position={[
                                  allModelsStatus.table3[index].position.x, 
                                  allModelsStatus.table3[index].position.y, 
                                  allModelsStatus.table3[index].position.z
                              ]} 
                              scale={allModelsStatus.table3[index].scale} 
                              rotation={[0, parseFloat(allModelsStatus.table3[index].rotateY), 0]}
                              onPointerOver={() => {
                                  document.body.style.cursor = "pointer"
                              }}
                              onPointerOut={() => {
                                  document.body.style.cursor = "default"
  
                              }}
                              object={clonedArr[index-1]} 
                          />
                         
                          </>
                      )
                  }
              })}
           
           <Indicator 
                position={[
                    allModelsStatus.table3[findFocusedIndex()].position.x, 
                    allModelsStatus.table3[findFocusedIndex()].position.y + 4 * allModelsStatus.table3[findFocusedIndex()].scale * 4 ,
                    allModelsStatus.table3[findFocusedIndex()].position.z
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

export default Table3Model;