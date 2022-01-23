import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

interface props {
    position: [x: number, y: number, z: number],
    visible: boolean;
}

const Indicator = ({position, visible}: props) => {

    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
      if(meshRef.current)
        meshRef.current.rotation.y += 0.01
    })

    function eulerToDegree(euler: number) {
        return ( (euler) / (2 * Math.PI) ) * 360
    }

    useEffect(() => {

    }, [position, visible])
    
    return (
      <mesh ref={meshRef} position={position} visible={visible} rotation={[3.14,0,0]} >
        <coneBufferGeometry args={[1, 2, 10]} />
        <meshStandardMaterial color={"blue"} />
      </mesh>
    );
  };

export default Indicator;