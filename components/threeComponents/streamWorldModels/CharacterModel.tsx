import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { useBox, useConvexPolyhedron, useCylinder, useHeightfield, useSphere } from '@react-three/cannon';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Vector3 } from 'three';
import OrbitCameraController from '../OrbitController';
import ThirdPersonCamera from '../thirdPersonCamera';
import usePersonControls from '../../../hooks/usePersonControl';

interface CharacterModelOpts {
    scale: number[]
    rotation: number[]
}

// let moveNum = 0
const CharacterModel = ({ scale, rotation }: CharacterModelOpts) => {


    const characterRef = useRef();

    const gltf = useLoader(GLTFLoader, modelList.character);
    const { nodes, materials, animations } = useGLTF(modelList.character) as GLTFResult;
    const group = useRef<THREE.Group>()

    const { actions } = useAnimations<GLTFActions>(animations, group)

    const [positionX, setPositionX] = useState(1);
    const [positionY, setPositionY] = useState(0);
    const [positionZ, setPositionZ] = useState(1);
    const [rotationZ, setRotationZ] = useState([0,0,0]);

    // const mixer = new THREE.AnimationMixer(gltf.scene);
    // const {clips} = useAnimations(gltf.animations, characterRef);
    // clips.forEach((clip) => {
    //     console.log(clip)
    //     const action = mixer.clipAction(clip)
    //     console.log(action)
    //     action.play();
    // })
    const raycaster = useThree((state) => state.raycaster);
    const scene = useThree((state) => state.scene)

    

    const { forward, backward, left, right, jump } = usePersonControls()

    actions.run?.play();

    const frontVector = new Vector3(0, 0, 0)
    const sideVector = new Vector3(0, 0, 0)
    const direction = new Vector3(0,0,0)

    // 캐릭터 충돌처리를 위한 안보이는 박스
    
    let MOVESPEED = 3
      const [mesh, api] = useSphere(() => ({ 
          mass:1, 
          type: "Dynamic",
          args: [0.2],
          
          
          onCollideBegin: (e) => { 
          
              
              if(e.body.name === "ground1") {
                  console.log("바닥과 충돌")
           
                  
              }
              else if(e.body.name === "stair") {
                  console.log("계단과 충돌")
                  console.log(Number(forward), Number(backward))
                  if(Number(forward) === 0 && Number(backward) === 0)
                    api.velocity.set(0,0,0)
              }
              else {
                  console.log("물체와 충돌")
                 
                
            

                 
              }
          }
          
         

          
          }))
          


          useFrame(() => {
            frontVector.set(0, 0, Number(forward) - Number(backward))
            sideVector.set(Number(right) - Number(left), 0, 0)


            direction
              .subVectors(frontVector, sideVector) // 상하좌우 키 속도 계산
              .normalize()
              .multiplyScalar(MOVESPEED) // 이동 속도
        
            api.velocity.set(direction.x, 0, direction.z)
            
            mesh.current.getWorldPosition(characterRef.current.position) // mesh와 캐릭터의 위치 동기화 - 캐릭터의 위치를 mesh의 위치로
   
            // characterRef.current.rotation.z = direction.x + direction.z
            characterRef.current.rotation.z < 1.7 ? characterRef.current.rotation.z += Number(right) / 5 : null;
            characterRef.current.rotation.z > -1.7 ? characterRef.current.rotation.z -= Number(left) / 5 : null;
            characterRef.current.rotation.z > -3.4 ? characterRef.current.rotation.z -= Number(backward) / 5 : null;
            characterRef.current.rotation.z < 0 ? characterRef.current.rotation.z += Number(forward) / 5 : null;

            setPositionX(characterRef.current.position.x)
            setPositionY(characterRef.current.position.y)
            setPositionZ(characterRef.current.position.z)



          })
      
      
    
    
    
    


   

  
  
    useEffect(() => {
        
        
        

       

        }, [])
                
        return (
            <>
                {/* <primitive 
                    ref={characterRef}
                    // onClick={(e) => {
                        //     findPosition(e)
                        // }} 
                        position={[positionX, positionY, positionZ]} 
                        scale={scale} 
                        rotation={rotation}
                        object={gltf.scene} 
                        onPointerOver={() => {
                            document.body.style.cursor = "pointer"
                        }}
                        onPointerOut={() => {
                            document.body.style.cursor = "default"
                        }}
                    /> */}

            <group ref={group}>
                <group  
                    
                    ref={characterRef}
                    
                    scale={scale} 
                    rotation={rotation}
                    onPointerOver={() => {
                        document.body.style.cursor = "pointer"
                    }}
                    onPointerOut={() => {
                        document.body.style.cursor = "default"
                    }}> 
                        <ThirdPersonCamera 
                            positionX={positionX} 
                            positionY={positionY} 
                            positionZ={positionZ} 
                            rotationZ={rotationZ}
                        />

                        <primitive 
                            object={nodes.mixamorigHips}

                        />
                        <skinnedMesh geometry={nodes.Ch46.geometry} material={materials.Ch46_body} skeleton={nodes.Ch46.skeleton} />
                </group>
            </group>

            <mesh ref={mesh}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="orange" />
          
        </mesh>
          </>
        )
        
    
    }
    
    export default CharacterModel;