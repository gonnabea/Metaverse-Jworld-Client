import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useRef, useState } from 'react';
import { addModel, currentModelsStatus } from '../../../stores/ThreeModels';


interface carpet1ModelOpts {
    installed: boolean; // 모델 설치 or 미설치
    scale: number;
    isFocused: boolean;
    rotateY: number;
    saveModels: boolean;
}

const Carpet1Model = ({installed, scale, isFocused, rotateY, saveModels}:carpet1ModelOpts) => {
    const [position, setPosition] = useState([0, 0, 0]);
    
    const gltf = useLoader(GLTFLoader, modelList.carpet_1);
    
    const raycaster = useThree((state) => state.raycaster);
    const scene = useThree((state) => state.scene)
    
    const installModel = (e) => {

      // 마우스 클릭한 지점 위치 얻기
      const closedObjPosition = raycaster.intersectObjects(scene.children)[0]?.point

      // 모델 설치
      if(closedObjPosition && isFocused === true && e.target.tagName === "CANVAS"){
          console.log("카페트 포커싱 상태");
          setPosition(position => position = [closedObjPosition.x, 0, closedObjPosition.z]);
      }
  };



  
    useEffect(() => {
        window.addEventListener("click", installModel);
        if(saveModels === true) {
            alert("carpet1 save: true")
            addModel({
                name: "carpet1",
                installed,
                scale: {x: scale, y: scale, z:scale},
                rotateY,
                position: {x: position[0], y: position[1], z: position[2]}
            })
            alert(JSON.stringify(currentModelsStatus))
        }
        return () => window.removeEventListener("click", installModel);
    }, [isFocused, saveModels])

    if(installed === true){

        return (
            <>
            <primitive 
                onClick={() => console.log("카페트1 클릭됨")} 
                position={position} 
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

export default Carpet1Model;