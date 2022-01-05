import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useRef, useState } from 'react';

interface ScreenModelOpts {
    position: number[]
    scale: number[]
    rotation: number[]
}

const ScreenModel = ({ position, scale, rotation }: ScreenModelOpts) => {
    // const [position, setPosition] = useState([0, 0, 0]);

    
    
    const gltf = useLoader(GLTFLoader, modelList.screen);
    
    const raycaster = useThree((state) => state.raycaster);
    const scene = useThree((state) => state.scene)
    
    const findPosition = (e) => {

      // 마우스 클릭한 지점 위치 얻기
      const clickedPosition = raycaster.intersectObjects(scene.children)[0]?.point

    //   console.log(clickedPosition)
  };


    useFrame(({ clock}) => {
        const a = clock.getElapsedTime()
        // console.log("Hey, I'm executing every frame!");
        // console.log(a)
    })
  
    useEffect(() => {
        // window.addEventListener("click", installModel);
        // return () => window.removeEventListener("click", installModel);
    }, [])

        return (
            <>
            <primitive 
                
                onClick={(e) => {
                    findPosition(e)
                }} 
                position={position} 
                scale={scale} 
                rotation={rotation}
                object={gltf.scene} 
                onPointerOver={() => {
                    document.body.style.cursor = "pointer"
                }}
                onPointerOut={() => {
                    document.body.style.cursor = "default"

                }}
            />
            
          </>
        )
    
    
  }

export default ScreenModel;