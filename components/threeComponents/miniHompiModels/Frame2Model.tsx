import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useRef, useState } from 'react';
import { TextureLoader, Vector3 } from 'three';

interface FrameModelOpts {
    installed: boolean; // 모델 설치 or 미설치
    scale: number;
    isFocused: boolean;
    rotateY: number;
    imageUrl: string;
}

const Frame2Model = ({installed, scale, rotateY, isFocused, imageUrl}:FrameModelOpts) => {
    const [position, setPosition] = useState([0, 0, 0]);
    
    const gltf = useLoader(GLTFLoader, modelList.frame_2);
    const texture = useLoader(TextureLoader, imageUrl); // 이미지 텍스쳐

    
    const raycaster = useThree((state) => state.raycaster);
    const scene = useThree((state) => state.scene)
    
    const installModel = (e) => {

      // 마우스 클릭한 지점 위치 얻기
      const closedObjPosition = raycaster.intersectObjects(scene.children)[0]?.point

      // 모델 설치
      if(closedObjPosition && isFocused === true && e.target.tagName === "CANVAS"){
          console.log("의자 포커싱 상태");
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
                onClick={() => console.log("액자1 클릭")} 
                position={position} scale={scale} rotation={[0, rotateY, 0]}
                onPointerOver={() => {
                    document.body.style.cursor = "pointer"
                }}
                onPointerOut={() => {
                    document.body.style.cursor = "default"

                }}
                object={gltf.scene} 
            />
            <mesh position={new Vector3(position[0], position[1], position[2] + 0.8)} scale={scale}
            rotation={[0, rotateY, 0]}>
                <planeBufferGeometry attach="geometry" args={[3, 3]} />
                <meshBasicMaterial attach="material" map={texture} />
            </mesh>

          </>
        )
    }
    else{
        return <></>
    }
  }

export default Frame2Model;