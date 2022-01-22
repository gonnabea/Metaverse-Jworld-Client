import type { NextPage } from 'next'
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import wsConnection from '../../multiplay/wsConnection';

const ThreeTest:NextPage = () => {

    const roomId = useRef<string | null>()

    const getRoomId = () => {
      const url = window.location.href;
      roomId.current = url.split("world/")[1];
    }


      // 웹소켓 리스너
      wsConnection.onmessage = ({data}) => {
        if(typeof(data) === 'string'){
          const parsedData = JSON.parse(data);
          switch(parsedData.event){
            case "broadcast":
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

      useEffect(() => {
        console.log("리렌더링")
        window.addEventListener("beforeunload", leaveLobby);
        getRoomId();

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

export default ThreeTest;