import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useRef, useState } from 'react';
import { TextureLoader, Vector3 } from 'three';
import { addModel, applyModels, setModels } from '../../../stores/ThreeModels';
import { RerenderType } from '../../../types/common';
import { ThreeModelOpts, modelNameTypes } from '../../../types/threeModelTypes';
import { applyThreeModels, setAllModelsStatus } from '../../../stores/setAllThreeModels';
import { useReactiveVar } from '@apollo/client';

interface FrameModelOpts extends ThreeModelOpts {
    imageUrl: string;
}

const Frame2Model = ({rerender, setRerender,}: RerenderType) => {

  const allModelsStatus = useReactiveVar(applyThreeModels);

  const { installed, scale, rotateY, isFocused, position, imageUrl } = allModelsStatus.frame2[0]

    const defaultImgUrl = "https://media.istockphoto.com/photos/metaverse-concept-metaverse-text-sitting-over-blue-technological-picture-id1352111641?b=1&k=20&m=1352111641&s=170667a&w=0&h=OcbdDklzABPmIV5H8gNUnpiO7QI7dulB3VkvjR4f00g="

    const createModelStatus = async () => {
        const modelStatus = {
          name: "frame2",
          position,
          installed,
          scale: {x: scale, y: scale, z: scale},
          rotateY
        }
        addModel(modelStatus)
      }
    
    const gltf = useLoader(GLTFLoader, modelList.frame_2);
    
    const texture = useLoader(TextureLoader, imageUrl && imageUrl !=="false" ? imageUrl : defaultImgUrl); // 이미지 텍스쳐

    
    const raycaster = useThree((state) => state.raycaster);
    const scene = useThree((state) => state.scene)
    
    const installModel = (e) => {

      // 마우스 클릭한 지점 위치 얻기
      const closedObjPosition = raycaster.intersectObjects(scene.children)[0]?.point

      // 모델 설치
      if(closedObjPosition && isFocused === true && e.target.tagName === "CANVAS"){
          console.log("의자 포커싱 상태");
        //   setModelStatus({
        //     ...modelStatus,
        //     position: {x: closedObjPosition.x, y: 0, z: closedObjPosition.z}
        // });

        setAllModelsStatus({
            modelName: modelNameTypes.frame2,
            index: 0,
            status: {
                installed,
                scale,
                rotateY,
                isFocused,
                position: {x: closedObjPosition.x, y: closedObjPosition.y, z: closedObjPosition.z},
                
            }
        })
        setRerender(value => value + 1)
      }
  };



  
    useEffect(() => {
        window.addEventListener("click", installModel);
        createModelStatus()
        return () => window.removeEventListener("click", installModel);
    }, [        
        installed,
        scale,
        isFocused,
        rotateY,
        position
    ])

    if(installed === true){

        return (
            <>
            <primitive 
                onClick={() => console.log("액자1 클릭")} 
                position={[position.x, position.y, position.z]} scale={scale} rotation={[0, rotateY, 0]}
                onPointerOver={() => {
                    document.body.style.cursor = "pointer"
                }}
                onPointerOut={() => {
                    document.body.style.cursor = "default"

                }}
                object={gltf.scene} 
            />
            <mesh position={[position.x, position.y, position.z + 0.8]} scale={scale}
            rotation={[0, rotateY, 0]}>
                <planeBufferGeometry attach="geometry" args={[3, 3]} />
                <meshBasicMaterial attach="material" map={texture} />
            </mesh>

          </>
        )
    }
    else{
        return <></>
    }
  }

export default Frame2Model;