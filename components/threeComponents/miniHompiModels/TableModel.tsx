import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useRef, useState } from 'react';
import { addModel, applyModels, setModels } from '../../../stores/ThreeModels';
import { modelNameTypes, RerenderType, ThreeModelOpts } from '../../../types/common';
import { applyThreeModels, setAllModelsStatus } from '../../../stores/setAllThreeModels';
import { useReactiveVar } from '@apollo/client';



const TableModel = ({rerender, setRerender,}: RerenderType) => {

  const allModelsStatus = useReactiveVar(applyThreeModels);

  const { installed, scale, rotateY, isFocused, position } = allModelsStatus.table1[0]


    const createModelStatus = async () => {
        const modelStatus = {
          name: "table1",
          position,
          installed,
          scale: {x: scale, y: scale, z: scale},
          rotateY
        }
        addModel(modelStatus)
      }

    
    const gltf = useLoader(GLTFLoader, modelList.table_1);
    // gltf.scene.castShadow = true;
    const raycaster = useThree((state) => state.raycaster);
    const scene = useThree((state) => state.scene)
    
    const installModel = (e) => {

      // 마우스 클릭한 지점 위치 얻기
      const closedObjPosition = raycaster.intersectObjects(scene.children)[0]?.point

      // 모델 설치
      if(closedObjPosition && isFocused === true && e.target.tagName === "CANVAS"){
          console.log("TableModel 포커싱 상태");
        //   setModelStatus({
        //     ...modelStatus,
        //     position: {x: closedObjPosition.x, y: 0, z: closedObjPosition.z}
        // });
        setAllModelsStatus({
          modelName: modelNameTypes.table1,
          index: 0,
          status: {
              installed,
              scale,
              rotateY,
              isFocused,
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
        position
    ])

    if(installed === true){

        return (
            <>
            <primitive 
                onClick={() => console.log("TableModel 클릭됨")} 
                position={[position.x, position.y, position.z]} scale={scale} 
                object={gltf.scene} 
                rotation={[0, rotateY, 0]}
            />

          </>
        )
    }
    else{
        return <></>
    }
  }

export default TableModel;