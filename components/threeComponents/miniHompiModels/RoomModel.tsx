import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { addModel } from '../../../stores/ThreeModels';
import { useEffect } from 'react';

interface roomModelOpts {
    roomScale: number;

}

const RoomModel = ({ roomScale }:roomModelOpts) => {
    const gltf = useLoader(GLTFLoader, modelList.room_wall);

    const createModelStatus = async () => {
      const modelStatus = {
        name: "room",
        position: {x:0, y:0, z:0},
        installed: true,
        scale: {x: roomScale, y: roomScale, z: roomScale},
        rotateY: "0"
      }
      addModel(modelStatus)
    }
    
    useEffect(() => {
      createModelStatus()
    }, [roomScale])

    return (
      <>
        <primitive onClick={() => {console.log("룸모델 클릭됨"); }}  position={[0, 0, 0]} object={gltf.scene} scale={roomScale}  />
      </>
    )
  }

export default RoomModel;