import type { NextPage } from 'next'
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import { Suspense } from "react";
import OrbitCameraController from '../../threeComponents/OrbitController';
import { modelList } from '../../data/modelList';

const SoccerWorld:NextPage = () => {

    const roomId = useRef<string | null>()
    const [roomScale, setRoomScale] = useState(0.5);

    const RoomModel = () => {
    const gltf = useLoader(GLTFLoader, modelList.room_wall);
    return (
        <>
        <primitive  position={[0, 0, 0]} object={gltf.scene} scale={roomScale} />
        </>
    )
    }

    useEffect(() => {

    }, [])

    return(
        <section className="w-screen h-screen overflow-hidden">
          <div className="z-10 absolute bg-red-200">
              <div className="border-dashed border-4 border-light-blue-500">
              <span className="">
                방 크기 조절
              </span>
              <button className="w-4 h-4 text-lg" onClick={() => {setRoomScale(roomScale => roomScale += 0.05)}}>+</button>
              <button className="w-4 h-4 text-lg" onClick={() => {setRoomScale(roomScale => roomScale -= 0.05)}}>-</button>
              </div>
          </div>
                    <Canvas className="w-screen h-screen" camera={{ position: [0, -40, 20] }} >
          <OrbitCameraController />
          <ambientLight />
          <Suspense fallback={null}>
              <RoomModel />
           </Suspense>
        </Canvas>,
        </section>
    )

}

export default SoccerWorld;