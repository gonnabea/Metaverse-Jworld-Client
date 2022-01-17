import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useRef, useState } from 'react';
import { addModel, applyModels, setModels } from '../../../stores/ThreeModels';
import { RerenderType } from '../../../types/common';
import { applyThreeModels, setAllModelsStatus } from '../../../stores/setAllThreeModels';
import { useReactiveVar } from '@apollo/client';
import { ThreeModelOpts, modelNameTypes } from '../../../types/threeModelTypes';



const Carpet2Model = ({rerender, setRerender,}: RerenderType) => {
  const allModelsStatus = useReactiveVar(applyThreeModels);

  const { installed, scale, rotateY, isFocused, position } = allModelsStatus.carpet2[0]

    const createModelStatus = async () => {
        const modelStatus = {
          name: "carpet2",
          position,
          installed,
          scale: {x: scale, y: scale, z: scale},
          rotateY
        }
        addModel(modelStatus)
      }
    
    
    const gltf = useLoader(GLTFLoader, modelList.carpet_2);
    
    const raycaster = useThree((state) => state.raycaster);
    const scene = useThree((state) => state.scene)
    
    const installModel = (e) => {

      // 마우스 클릭한 지점 위치 얻기
      const closedObjPosition = raycaster.intersectObjects(scene.children)[0]?.point

      // 모델 설치
      if(closedObjPosition && isFocused === true && e.target.tagName === "CANVAS"){
          console.log("카페트2 포커싱 상태");
          // setModelStatus({
          //     ...modelStatus,
          //     position: {x: closedObjPosition.x, y: -0.5, z: closedObjPosition.z}
          // });
          setAllModelsStatus({
            modelName: modelNameTypes.carpet2,
            index: 0,
            status: {
                installed,
                scale,
                rotateY,
                isFocused,
                position: {x: closedObjPosition.x, y: -0.5, z: closedObjPosition.z},
                
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
        installed,
        scale,
        isFocused,
        rotateY,
        position
    ])

    if(installed === true){

        return (
            <>
            <primitive 
                onClick={() => console.log("카페트2 클릭됨")} 
                position={[position.x, position.y, position.z]} 
                scale={scale} 
                rotation={[0, rotateY, 0]}
                object={gltf.scene} 
            />

          </>
        )
    }
    else{
        return <></>
    }
  }

export default Carpet2Model;