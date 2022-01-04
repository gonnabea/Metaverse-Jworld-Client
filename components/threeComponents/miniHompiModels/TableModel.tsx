import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useRef, useState } from 'react';
import { addModel, applyModels, setModels } from '../../../stores/ThreeModels';


interface TableModelOpts {
    installed: boolean; // 모델 설치 or 미설치
    scale: number;
    isFocused: boolean;
    rotateY: number;
    saveModels: boolean;
}

const TableModel = ({installed, scale, isFocused, rotateY, saveModels}:TableModelOpts) => {
    const [position, setPosition] = useState([0, 0, 0]);
    
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
          setPosition(position => position = [closedObjPosition.x, 0, closedObjPosition.z]);
      }
  };



  
    useEffect(() => {
        window.addEventListener("click", installModel);
        if(saveModels === true) {
            addModel({
                name: "book",
                installed,
                scale,
                rotateY,
                position
            })
        }
        return () => window.removeEventListener("click", installModel);
    }, [isFocused])

    if(installed === true){

        return (
            <>
            <primitive 
                onClick={() => console.log("TableModel 클릭됨")} 
                position={position} scale={scale} 
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