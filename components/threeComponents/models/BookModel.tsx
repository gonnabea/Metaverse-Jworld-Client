import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useRef, useState } from 'react';

interface BookModelOpts {
    installed: boolean; // 모델 설치 or 미설치
    scale: number;
    isFocused: boolean;
    setCss3dBookVisible: any
    rotateY: number;
}

const BookModel = ({installed, scale, isFocused, setCss3dBookVisible, rotateY}:BookModelOpts) => {
    const [position, setPosition] = useState([0, 0, 0]);

    
    
    const gltf = useLoader(GLTFLoader, modelList.book_ani);
    
    const raycaster = useThree((state) => state.raycaster);
    const scene = useThree((state) => state.scene)
    
    const installModel = (e) => {

      // 마우스 클릭한 지점 위치 얻기
      const closedObjPosition = raycaster.intersectObjects(scene.children)[0]?.point

      // 모델 설치
      if(closedObjPosition && isFocused === true && e.target.tagName === "CANVAS"){
          console.log("카페트 포커싱 상태");
          setPosition(position => position = [closedObjPosition.x, closedObjPosition.y, closedObjPosition.z]);
      }
  };


    useFrame(({ clock}) => {
        const a = clock.getElapsedTime()
        // console.log("Hey, I'm executing every frame!");
        // console.log(a)
    })
  
    useEffect(() => {
        window.addEventListener("click", installModel);
        return () => window.removeEventListener("click", installModel);
    }, [isFocused])

    if(installed === true){

        return (
            <>
            <primitive 
                
                onClick={() => {
                    setCss3dBookVisible(visible => !visible);
                }} 
                position={position} scale={scale} 
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