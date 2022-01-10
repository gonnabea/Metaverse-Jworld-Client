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
    console.log(animations)
    const { actions } = useAnimations<GLTFActions>(animations, group)

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
          mass:10, 
          type: 'Dynamic',
          args: [0.5],
          
          onCollideBegin: (e) => { 
          
              
              if(e.body.name === "ground1") {
                  console.log("바닥과 충돌")
           
                  
              }
              else if(e.body.name === "stair") {
                  console.log("계단과 충돌")
                    
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

            mesh.current.getWorldPosition(characterRef.current.position)
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
                            positionX={0} 
                            positionY={0} 
                            positionZ={0} 
                            moveNumX={0} 
                            moveNumZ={0} 
                            prevPositionX={0}
                            prevPositionZ={0}
                        />

                        <primitive 
                            object={nodes.mixamorigHips}

                        />
                        <skinnedMesh geometry={nodes.Ch46.geometry} material={materials.Ch46_body} skeleton={nodes.Ch46.skeleton} />
                </group>
            </group>

            <mesh ref={mesh}>
          <sphereGeometry args={[0.2,0.1,0.2]} />
          <meshStandardMaterial color="orange" />
          
        </mesh>
          </>
        )
        
    
    }
    
    export default CharacterModel;