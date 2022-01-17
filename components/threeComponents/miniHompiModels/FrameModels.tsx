import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TextureLoader, Vector3 } from 'three';
import { addModel, applyModels, setModels } from '../../../stores/ThreeModels';
import { RerenderType } from '../../../types/common';
import { ThreeModelOpts, modelNameTypes } from '../../../types/threeModelTypes';
import { applyThreeModels, setAllModelsStatus } from '../../../stores/setAllThreeModels';
import { useReactiveVar } from '@apollo/client';
import { clone } from "../../../config/skeletonUtils";
import Indicator from '../../common/Indicator';
import { applyIsMyRoom } from '../../../stores/loggedUser';

const FrameModel = ({rerender, setRerender, initFocused, showUpdateUrlUI, setShowUpdateUrlUI}) => {
    const allModelsStatus = useReactiveVar(applyThreeModels);
    console.log(allModelsStatus.frame1)
    const isMyRoom = useReactiveVar(applyIsMyRoom)
    const { installed, scale, rotateY, isFocused, position, imageUrl} = allModelsStatus.frame1[0]
    
    
    const defaultImgUrl = "https://media.istockphoto.com/photos/metaverse-concept-metaverse-text-sitting-over-blue-technological-picture-id1352111641?b=1&k=20&m=1352111641&s=170667a&w=0&h=OcbdDklzABPmIV5H8gNUnpiO7QI7dulB3VkvjR4f00g="
    

    
    // 모델 상태 저장을 위한 함수
    const createModelStatus = async () => {
        console.log(allModelsStatus.frame1)
        allModelsStatus.frame1.map(({ position, installed, scale, rotateY, imageUrl }, index) => {
            
            const modelStatus = {
              name: "frame1",
              position,
              installed,
              scale: {x: scale, y: scale, z: scale},
              rotateY,
              index,
              imageUrl
            }
            addModel(modelStatus)

        }) 
        
      }

    const gltf = useLoader(GLTFLoader, modelList.frame1);
    const texture = useLoader(TextureLoader, imageUrl && imageUrl !=="false" ? imageUrl : defaultImgUrl); // 이미지 텍스쳐
    const texture2 = useLoader(TextureLoader, allModelsStatus.frame1[3].imageUrl && allModelsStatus.frame1[3].imageUrl !=="false" ? allModelsStatus.frame1[3].imageUrl : defaultImgUrl); // 이미지 텍스쳐

    const imgTextures = [];

    allModelsStatus.frame1.map(frame => {
        imgTextures.push(useLoader(TextureLoader, frame.imageUrl && frame.imageUrl !=="false" ? frame.imageUrl : defaultImgUrl)) // 이미지 텍스쳐

    })
    
    const raycaster = useThree((state) => state.raycaster);
    const scene = useThree((state) => state.scene)

    const cloned = useMemo(() => clone(gltf.scene), [scene])
    const cloned2 = useMemo(() => clone(gltf.scene), [scene])
    const cloned3 = useMemo(() => clone(gltf.scene), [scene])
    const cloned4 = useMemo(() => clone(gltf.scene), [scene])
    const cloned5 = useMemo(() => clone(gltf.scene), [scene])
    const cloned6 = useMemo(() => clone(gltf.scene), [scene])
    const cloned7 = useMemo(() => clone(gltf.scene), [scene])

    

    const clonedArr = [
        cloned,
        cloned2,
        cloned3,
        cloned4,
        cloned5,
        cloned6,
        cloned7,
    ]


    const checkFocused = () => {
        const findFocused = allModelsStatus.frame1.find(model => model.isFocused === true);
        if(findFocused !== undefined)
            return true
        else
            return false
    }

    
    const installModel = (e) => {
        
      // 마우스 클릭한 지점 위치 얻기
      const closedObjPosition = raycaster.intersectObjects(scene.children)[0]?.point
      let checkIsWall;
      if(
        raycaster.intersectObjects(scene.children)[0] !== undefined &&
        raycaster.intersectObjects(scene.children)[0].object.name === "living_room_Material015_0"
      )
        checkIsWall = true
      else
        checkIsWall = false

    console.log(raycaster.intersectObjects(scene.children)[0]?.object.name)
      // 모델 설치
      if(closedObjPosition && checkFocused() === true && e.target.tagName === "CANVAS" && checkIsWall){
          console.log("액자 포커싱 상태");

          setAllModelsStatus({
              modelName: modelNameTypes.frame1,
              index: findFocusedIndex(),
              status: {
                ...allModelsStatus.frame1[findFocusedIndex()],
                position: {x: closedObjPosition.x, y: closedObjPosition.y, z: closedObjPosition.z},
              }
          })
          setRerender(value => value + 1)
          
          
      }
  };


    const findFocusedIndex = () => {
        const findFocusedIndex = allModelsStatus.frame1.findIndex(model => model.isFocused === true);
        
        if(findFocusedIndex === -1)
            return 0

        return findFocusedIndex
    }



  
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
        findFocusedIndex()
    ])
// 첫번쨰 모델은 무조건 installed === true인 상태에만 복제 모델도 생성되는 구조
    if(installed === true){

        return (
            <>
            
            {/* 첫번째 액자 모델 */}
            <primitive 
                onClick={(e) => {
                    console.log("액자1 클릭")
                    console.log(e)
                        initFocused()
    
                        setAllModelsStatus({
                            modelName: modelNameTypes.frame1,
                            index: 0,
                            status: {
                              ...allModelsStatus.frame1[0],
                              isFocused: true
                            }
                        })
                        
                       
                        setRerender(value => value + 1)
                    
            }} 
                position={[position.x, position.y, position.z]} scale={scale} rotation={[0, parseFloat(rotateY), 0]}
                onPointerOver={() => {
                    document.body.style.cursor = "pointer"
                }}
                onPointerOut={() => {
                    document.body.style.cursor = "default"

                }}
                object={gltf.scene} 
            />

            {/* 이미지 텍스쳐 */}
            <mesh position={[position.x, position.y, position.z + 0.8]} scale={scale}
            rotation={[0, parseFloat(rotateY), 0]}>
                <planeBufferGeometry attach="geometry" args={[3, 3]} />
                <meshBasicMaterial attach="material" map={texture} />
            </mesh>
          
          {/* 복제 모델 (같은 모델 다수 생성용) */}
            {allModelsStatus.frame1.map((model, index) => {
                
                if(index > 0 && model.installed === true) {
                    return (
                        <>
                        <primitive 
                            
                            onClick={(e) => {
                                console.log(e)
                                console.log(`액자1_${index} 클릭`)
                                    setShowUpdateUrlUI(true)
                                    initFocused()
                                    console.log(model.position,model.isFocused)
                                    setAllModelsStatus({
                                        modelName: modelNameTypes.frame1,
                                        index,
                                        status: {
                                        ...allModelsStatus.frame1[index],
                                        isFocused: true
                                        }
                                    })
                                
                                    setRerender(value => value + 1)
                                
                                
                            }} 
                            position={[
                                allModelsStatus.frame1[index].position.x, 
                                allModelsStatus.frame1[index].position.y, 
                                allModelsStatus.frame1[index].position.z
                            ]} 
                            scale={allModelsStatus.frame1[index].scale} 
                            rotation={[0, parseFloat(allModelsStatus.frame1[index].rotateY), 0]}
                            onPointerOver={() => {
                                document.body.style.cursor = "pointer"
                            }}
                            onPointerOut={() => {
                                document.body.style.cursor = "default"

                            }}
                            object={clonedArr[index-1]} 
                        />
                        {/* 이미지 텍스쳐 */}
                        <mesh position={[
                                allModelsStatus.frame1[index].position.x, 
                                allModelsStatus.frame1[index].position.y, 
                                allModelsStatus.frame1[index].position.z+1
                            ]}
                            scale={allModelsStatus.frame1[index].scale}
                            rotation={[0, parseFloat(allModelsStatus.frame1[index].rotateY), 0]}>
                                <planeBufferGeometry attach="geometry" args={[3, 3]} />
                                <meshBasicMaterial attach="material" map={imgTextures[index]} />
                        </mesh>
                        </>
                    )
                }
            })}




            <Indicator 
                position={[
                    allModelsStatus.frame1[findFocusedIndex()].position.x, 
                    allModelsStatus.frame1[findFocusedIndex()].position.y +4 * allModelsStatus.frame1[findFocusedIndex()].scale,
                    allModelsStatus.frame1[findFocusedIndex()].position.z
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

export default FrameModel;