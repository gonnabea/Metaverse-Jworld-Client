import type { NextPage } from 'next'
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import wsConnection from '../../multiplay/wsConnection';
import { useLoader } from '@react-three/fiber';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import { Suspense } from "react";
import OrbitCameraController from '../../threeComponents/OrbitController';

const ThreeTest:NextPage = () => {

    const roomId = useRef<string | null>()
    const [roomScale, setRoomScale] = useState(0.5);

    const getRoomId = () => {
      const url = window.location.href;
      roomId.current = url.split("world/")[1];
    }


      // 웹소켓 리스너
      wsConnection.onmessage = ({data}) => {
        if(typeof(data) === 'string'){
          const parsedData = JSON.parse(data);
          console.log(parsedData)
          switch(parsedData.event){
            case "broadcast":
              console.log(parsedData)
              break;
          }
        }
      }


    const leaveRoom = () => {
      wsConnection.send(JSON.stringify({
          event: "leave-room",
          data: null
      }))
    }

    const leaveLobby = () => {
           
      alert(roomId.current)
      wsConnection.send(JSON.stringify({
          event: "leave-lobby",
          data: {
            roomId: roomId.current,
          }
        }))
    }
    

    function Box(props) {
        // This reference will give us direct access to the THREE.Mesh object
        const ref = useRef()
        // Set up state for the hovered and active state
        const [hovered, setHover] = useState(false)
        const [active, setActive] = useState(false)
        // Subscribe this component to the render-loop, rotate the mesh every frame
        useFrame((state, delta) => (ref.current.rotation.x += 0.01))
        // Return the view, these are regular Threejs elements expressed in JSX
        return (
          <mesh
            {...props}
            ref={ref}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
          </mesh>
        )
      }

      // const gltf = useLoader(GLTFLoader, 'public/3d_models/living_room_isometric_lowpoly/scene.gltf')

      const RoomModel = () => {
        const gltf = useLoader(GLTFLoader, '/3d_models/living_room_isometric_lowpoly/items/room_wall.glb');
        return (
          <>
          <primitive  position={[0, 0, 0]} object={gltf.scene} scale={roomScale} />
      </>
        )
      }

      useEffect(() => {
        
        window.addEventListener("beforeunload", leaveLobby);
        getRoomId();

      }, [])

    return(
        <section className="w-screen h-screen overflow-hidden">
          <div className="z-10 absolute">
              <button className="w-4 h-4 text-lg" onClick={() => {setRoomScale(roomScale => roomScale += 0.05)}}>+</button>
              <button className="w-4 h-4 text-lg" onClick={() => {setRoomScale(roomScale => roomScale -= 0.05)}}>-</button>
          </div>
                    <Canvas className="w-screen h-screen" camera={{ position: [0, -40, 20] }} >
          <OrbitCameraController />
          <ambientLight />
          {/* <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} /> */}
          <Suspense fallback={null}>
              <RoomModel />
           </Suspense>
        </Canvas>,
        </section>
    )

}

export default ThreeTest;