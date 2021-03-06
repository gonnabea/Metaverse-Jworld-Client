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
import ThirdPersonCamera from '../ThirdPersonCamera';
import usePersonControls from '../../../hooks/usePersonControl';
import { applyConnectedUser, applyOthersStatus, setCharacterPosition } from '../../../stores/character';


interface CharacterModelOpts {
    scale: number[]
    rotation: number[]
    position?: number[]
}

// let moveNum = 0
const CharacterModel7 = ({ scale, rotation }: CharacterModelOpts) => {


    const characterRef = useRef();

    const { nodes, materials, animations } = useGLTF(modelList.character7) as GLTFResult;
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

    // ????????? ??????????????? ?????? ???????????? ??????
    
    let MOVESPEED = 3
      const [mesh, api] = useSphere(() => ({ 
          mass:1, 
          type: "Dynamic",
          args: [0.2],
          
          
          onCollideBegin: (e) => { 
          
              
              if(e.body.name === "ground1") {
                  console.log("????????? ??????")
           
                  
              }
              else if(e.body.name === "stair") {
                  console.log("????????? ??????")
                  
              }
              else {
                  console.log("????????? ??????")
                 
                
            

                 
              }
          }
          
         

          
          }))
          




   

  
  
    useEffect(() => {
        
        
        

       

        }, [])
                
        return applyConnectedUser().length > 6 ? (
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
                    position={[
                        applyOthersStatus()[5].position.x,
                        applyOthersStatus()[5].position.y,
                        applyOthersStatus()[5].position.z
                    ]}
                    scale={scale} 
                    rotation={[Math.PI / 2, 0, applyOthersStatus()[5].rotateZ]}
                   
                    onPointerOver={() => {
                        document.body.style.cursor = "pointer"
                    }}
                    onPointerOut={() => {
                        document.body.style.cursor = "default"
                    }}> 

                        <primitive 
                            object={nodes.mixamorigHips}

                        />
                        <skinnedMesh geometry={nodes.Ch46.geometry} material={materials.Ch46_body} skeleton={nodes.Ch46.skeleton} />
                </group>
            </group>

            {/* <mesh ref={mesh}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="orange" />
          
        </mesh> */}
          </>
        ) : null
        
    
    }
    
    export default CharacterModel7;