import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../data/modelList';
import { useEffect, useRef, useState } from 'react';

interface props {
    installed: boolean; // 모델 설치 or 미설치
    scale: number;
    isFocused: boolean;
}

const StandingLampModel = ({installed, scale, isFocused}:props) => {
    const [position, setPosition] = useState([0, 0, 0]);
    
    const gltf = useLoader(GLTFLoader, modelList.standing_lamp);
    
    const raycaster = useThree((state) => state.raycaster);
    const scene = useThree((state) => state.scene)
    
    const installModel = () => {

      // 마우스 클릭한 지점 위치 얻기
      const closedObjPosition = raycaster.intersectObjects(scene.children)[0]?.point

      // 모델 설치
      if(closedObjPosition && isFocused === true){
          console.log("스탠딩램프 포커싱 상태");
          setPosition(position => position = [closedObjPosition.x, closedObjPosition.y, closedObjPosition.z]);
      }
  };



  
    useEffect(() => {
        window.addEventListener("click", installModel);
        return () => window.removeEventListener("click", installModel);
    }, [isFocused])

    if(installed === true){

        return (
            <>
            <primitive 
                onClick={() => console.log("스탠딩램프 클릭됨")} 
                position={position} scale={scale} 
                object={gltf.scene} 
            />

          </>
        )
    }
    else{
        return <></>
    }
  }

export default StandingLampModel;