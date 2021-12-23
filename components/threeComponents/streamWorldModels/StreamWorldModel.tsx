import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useRef, useState } from 'react';

interface LobbyModelOpts {

}

const LobbyModel = () => {
    const [position, setPosition] = useState([0, 0, 0]);

    
    
    const gltf = useLoader(GLTFLoader, modelList.lobby);
    
    const raycaster = useThree((state) => state.raycaster);
    const scene = useThree((state) => state.scene)
    
    const findPosition = (e) => {

      // 마우스 클릭한 지점 위치 얻기
      const clickedPosition = raycaster.intersectObjects(scene.children)[0]?.point

      console.log(clickedPosition)
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
                position={[0,0,0]} scale={[1,1,1]} 
                object={gltf.scene} 
                onPointerOver={() => {
                    document.body.style.cursor = "pointer"
                }}
                onPointerOut={() => {
                    document.body.style.cursor = "default"

                }}
                rotation={[0, 0, 0]}
            />
            
          </>
        )
    
    
  }

export default LobbyModel;