import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useRef, useState } from 'react';
import { ThreeModelInput } from '../../../__generated__/globalTypes';
import { addModel, applyModels, setModels } from '../../../stores/ThreeModels';
import { modelNameTypes, RerenderType, ThreeModelOpts, XYZType } from '../../../types/common';
import { applyThreeModels, setAllModelsStatus } from '../../../stores/setAllThreeModels';
import { useReactiveVar } from '@apollo/react-hooks';


interface BookModelOpts extends RerenderType {
    setCss3dBookVisible: any
    rerender: number;
    setRerender: Function;
}

const BookModel = ({ rerender, setRerender, setCss3dBookVisible }:BookModelOpts) => {
    const allModelsStatus = useReactiveVar(applyThreeModels);
    const { installed, scale, rotateY, isFocused, position, imageUrl} = allModelsStatus.book[0]
    
    
    const createModelStatus = async () => {
        const modelStatus = {
          name: "book",
          position,
          installed,
          scale: {x: scale, y: scale, z: scale},
          rotateY
        }
        addModel(modelStatus)
      }
    

    
    
    const gltf = useLoader(GLTFLoader, modelList.book_ani);
    
    const raycaster = useThree((state) => state.raycaster);
    const scene = useThree((state) => state.scene)
    
    const installModel = (e) => {

      // 마우스 클릭한 지점 위치 얻기
      const closedObjPosition = raycaster.intersectObjects(scene.children)[0]?.point

      // 모델 설치
      if(closedObjPosition && isFocused === true && e.target.tagName === "CANVAS"){
          console.log("Book 포커싱 상태");
        //   setModelStatus({
        //       ...modelStatus,
        //       position: {x: closedObjPosition.x, y: closedObjPosition.y, z: closedObjPosition.z}
        //   });

          setAllModelsStatus({
            modelName: modelNameTypes.book,
            index: 0,
            status: {
                installed,
                scale,
                rotateY,
                isFocused,
                position: {x: closedObjPosition.x, y: closedObjPosition.y, z: closedObjPosition.z},
                imageUrl
            }
        })
        setRerender(value => value + 1)
      }

    };
    
    
    useFrame(({ clock }) => {
        const a = clock.getElapsedTime()
        // console.log("Hey, I'm executing every frame!");
        // console.log(a)
    })
    
    useEffect(() => {
        window.addEventListener("click", installModel);
        createModelStatus()
        
        return () => window.removeEventListener("click", installModel);
    }, [
        allModelsStatus
    ])

    if(installed === true){

        return (
            <>
            <primitive 
                
                onClick={() => {
                    setCss3dBookVisible(visible => !visible);
                }} 
                position={[position.x, position.y, position.z]} scale={scale} 
                object={gltf.scene} 
                onPointerOver={() => {
                    document.body.style.cursor = "pointer"
                }}
                onPointerOut={() => {
                    document.body.style.cursor = "default"

                }}
                rotation={[0, rotateY, 0]}
            />
            
          </>
        )
    }
    else{
        return <></>
    }
  }

export default BookModel;