import type { NextPage } from 'next'
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import socketIoClient from '../../multiplay/wsConnection';
import { Socket } from 'socket.io-client';

const World:NextPage = () => {

    const roomId = useRef<string | null>();
    

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

      useEffect(() => {
        
        
        getRoomId()


      }, [])

    return(
        <section className="w-screen h-screen overflow-hidden">
                    <Canvas className="w-screen h-screen">
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
        </Canvas>,
        </section>
    )

}

export default World;