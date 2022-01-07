import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

interface props {
    position: [x: number, y: number, z: number],
    visible: boolean;
}

const SphereIndicator = ({position, visible}: props) => {

    const meshRef = useRef();

    useFrame((state, delta) => (meshRef.current.rotation.y += 0.01))

    function eulerToDegree(euler) {
        return ( (euler) / (2 * Math.PI) ) * 360
    }
    
    return (
      <mesh ref={meshRef} position={position} visible={visible} rotation={[3.14,0,0]} >
        <coneBufferGeometry args={[1, 2, 10]} />
        <meshStandardMaterial color={"blue"} />
      </mesh>
    );
  };

export default SphereIndicator;