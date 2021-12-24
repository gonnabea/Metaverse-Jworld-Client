import type { NextPage } from 'next'
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import socketIoClient from '../../multiplay/wsConnection';
import { Socket } from 'socket.io-client';
import StreamWorldModel from '../../components/threeComponents/streamWorldModels/StreamWorldModel';
import OrbitCameraController from '../../components/threeComponents/OrbitController';
import ScreenModel from '../../components/threeComponents/streamWorldModels/ScreenModel';
import CharacterModel from '../../components/threeComponents/streamWorldModels/CharacterModel';
import { Physics, useBox, useCompoundBody, useConvexPolyhedron, useCylinder, useHeightfield, usePlane, useSphere } from '@react-three/cannon';

const World:NextPage = () => {

    const roomId = useRef<string | null>();
    const [characterPosition, setCharacterPosition] = useState([0,0,0]);
    const cubeRef = useRef()
    

    // url로 부터 roomId 얻기
    const getRoomId = () => {
      const url = window.location.href;
      roomId.current = url.split("world/")[1];
      alert(roomId.current)
    }



    socketIoClient.on("broadcast", (data) => {
      console.log(data)
    })


    const leaveRoom = () => {
      socketIoClient.send(JSON.stringify({
          event: "leave-room",
          data: null
      }))
    }

    const leaveLobby = () => {
           
      alert(roomId.current)
      socketIoClient.emit("leave-lobby", { roomId: roomId.current });

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
            onDoubleClick={() => leaveLobby()}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
          </mesh>
        )
      }

      function Ground1(props) {
        const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))

        return (
          <mesh ref={ref} name="ground1" visible={true}>
            <planeGeometry args={[20, 15]}  />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
        )
      }

      function HeightField(props) {
        const [ref] = useBox(() => ({ rotation: [0, 0, 0], ...props, onCollide: () => {
          console.log("벽과 충돌")
        }  }))
        
        return (
          <mesh castShadow ref={ref} >
            <boxGeometry args={props.args}  />
            <meshStandardMaterial color="orange"  />
          </mesh>
        )
      }

      function ObstaclePlane(props) {
        const [ref] = usePlane(() => ({ rotation: [0, 0, 0], ...props }))
        
        return (
          <mesh castShadow ref={ref} >
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="orange"  />
          </mesh>
        )
      }


      useEffect(() => {
        
        
        getRoomId()


      }, [])

    return(
        <section className="w-screen h-screen overflow-hidden">
                    <Canvas className="w-screen h-screen">
          <OrbitCameraController />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {/* <directionalLight
                
                intensity={1}
                position={[0, 2, 2]}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                castShadow
              /> */}

          {/* <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} /> */}
          <Physics >
            <Suspense fallback={null}>
              <StreamWorldModel />
              <ScreenModel position={[-0.4,0,0]} scale={[5.5,4.5,5]} rotation={[0, 1.57, 0]} />
              {/* <ScreenModel2 position={[-2,0,0]} scale={[5.5,4.5,5]} rotation={[0, 1.57, 0]} /> */}
              <CharacterModel rotation={[0,0,0]} scale={[0.015,0.015,0.015]} />
              <Ground1 />
              <ObstaclePlane position={[2,0,-7.5]} size={100} />
              {/* <ObstaclePlane position={[2,0, 7.5]} /> */}
              <HeightField position={[-0.5,0,0]} args= {[0.5, 6, 6]} />
            </Suspense>
            </Physics>
        </Canvas>,
        </section>
    )

}

export default World;
