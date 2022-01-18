// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { useLoader, useThree } from '@react-three/fiber';
// import { modelList } from '../../../data/modelList';
// import { useEffect, useRef, useState } from 'react';
// import { addModel, applyModels, setModels } from '../../../stores/ThreeModels';
// import { applyThreeModels, setAllModelsStatus } from '../../../stores/setAllThreeModels';
// import { useReactiveVar } from '@apollo/react-hooks';
// import { modelNameTypes } from '../../../types/threeModelTypes';



// const ChairModel = ({rerender, setRerender}) => {
//   const allModelsStatus = useReactiveVar(applyThreeModels);
  
//   const { installed, scale, rotateY, isFocused, position } = allModelsStatus.chair[0]

//     const createModelStatus = async () => {
//         const modelStatus = {
//           name: "chair",
//           position,
//           installed,
//           scale: {x: scale, y: scale, z: scale},
//           rotateY
//         }
//         addModel(modelStatus)
//       }
    
//     const gltf = useLoader(GLTFLoader, modelList.chair);
    
//     const raycaster = useThree((state) => state.raycaster);
//     const scene = useThree((state) => state.scene)
    
//     const installModel = (e) => {

//       // 마우스 클릭한 지점 위치 얻기
//       const closedObjPosition = raycaster.intersectObjects(scene.children)[0]?.point

//       // 모델 설치
//       if(closedObjPosition && isFocused === true && e.target.tagName === "CANVAS"){
//           console.log("의자 포커싱 상태");
//         //   setModelStatus({
//         //     ...modelStatus,
//         //     position: {x: closedObjPosition.x, y: 0, z: closedObjPosition.z}
//         // });

//           setAllModelsStatus({
//             modelName: modelNameTypes.chair,
//             index: 0,
//             status: {
//                 installed,
//                 scale,
//                 rotateY,
//                 isFocused,
//                 position: {x: closedObjPosition.x, y: 0, z: closedObjPosition.z},
                
//             }
//         })
//         setRerender(value => value + 1)
//       }
//   };



  
//     useEffect(() => {
//         window.addEventListener("click", installModel);
//         createModelStatus()
//         return () => window.removeEventListener("click", installModel);
//     }, [
//         installed,
//         scale,
//         isFocused,
//         rotateY,
//         position
//     ])

//     if(installed === true){

//         return (
//             <>
//             <primitive 
//                 onClick={() => console.log("의자 클릭")} 
//                 position={[position.x, position.y, position.z]} scale={scale} rotation={[0, rotateY, 0]}
//                 object={gltf.scene} 
//             />

//           </>
//         )
//     }
//     else{
//         return <></>
//     }
//   }

// export default ChairModel;




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


const ChairModel = ({rerender, setRerender ,isMyRoom, initFocused}) => {
  const allModelsStatus = useReactiveVar(applyThreeModels);
  const { installed, scale, rotateY, isFocused, position } = allModelsStatus.chair[0]


  const createModelStatus = async () => {
    allModelsStatus.chair.map(({ position, installed, scale, rotateY }, index) => {
        
        const modelStatus = {
          name: "chair",
          position,
          installed,
          scale: {x: scale, y: scale, z: scale},
          rotateY,
          index,
        }
        addModel(modelStatus)

    }) 
    
  }
    
    const gltf = useLoader(GLTFLoader, modelList.chair);
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
      const findFocused = allModelsStatus.chair.find(model => model.isFocused === true);
      if(findFocused !== undefined)
          return true
      else
          return false
  }

      // 현재 포커싱된 소파 찾기
      const findFocusedIndex = () => {
        const findFocusedIndex = allModelsStatus.chair.findIndex(model => model.isFocused === true);
        
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
          console.log("ChairModel 포커싱 상태");

          setAllModelsStatus({
            modelName: modelNameTypes.chair,
            index: findFocusedIndex(),
            status: {
                ...allModelsStatus.chair[findFocusedIndex()],
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
                  if(isMyRoom) {
                      console.log("의자 클릭")
             
                          initFocused()
                          setAllModelsStatus({
                              modelName: modelNameTypes.chair,
                              index: 0,
                              status: {
                                ...allModelsStatus.chair[0],
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

                {allModelsStatus.chair.map((model, index) => {
                
                  if(index > 0 && model.installed === true) {
                      return (
                          <>
                          <primitive 
                              
                              onClick={async(e) => {
                                  
                                  console.log(`의자_${index} 클릭`)
                                  if(isMyRoom){
                                      
                                      initFocused()
                                      console.log(model.position,model.isFocused)
                                      await setAllModelsStatus({
                                          modelName: modelNameTypes.chair,
                                          index,
                                          status: {
                                          ...allModelsStatus.chair[index],
                                          isFocused: true
                                          }
                                      })
                                      createModelStatus()
                                      setRerender(value => value + 1)
                                  }
                                  
                                  
                              }} 
                              position={[
                                  allModelsStatus.chair[index].position.x, 
                                  allModelsStatus.chair[index].position.y, 
                                  allModelsStatus.chair[index].position.z
                              ]} 
                              scale={allModelsStatus.chair[index].scale} 
                              rotation={[0, parseFloat(allModelsStatus.chair[index].rotateY), 0]}
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
                    allModelsStatus.chair[findFocusedIndex()].position.x, 
                    allModelsStatus.chair[findFocusedIndex()].position.y +4 * allModelsStatus.chair[findFocusedIndex()].scale * 30,
                    allModelsStatus.chair[findFocusedIndex()].position.z
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

export default ChairModel;