import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';

interface roomModelOpts {
    roomScale: number;
}

const RoomModel = ({roomScale}:roomModelOpts) => {
    const gltf = useLoader(GLTFLoader, modelList.room_wall);
    // gltf.scene.receiveShadow = true
    return (
      <>
        <primitive onClick={() => {console.log("룸모델 클릭됨"); }}  position={[0, 0, 0]} object={gltf.scene} scale={roomScale}  />
      </>
    )
  }

export default RoomModel;