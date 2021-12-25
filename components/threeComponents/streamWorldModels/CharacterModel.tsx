
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useRef, useState } from 'react';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { useBox, useCylinder, useHeightfield, useSphere } from '@react-three/cannon';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Vector3 } from 'three';

interface CharacterModelOpts {
    scale: number[]
    rotation: number[]
}

let moveNum = 0
const CharacterModel = ({ scale, rotation }: CharacterModelOpts) => {
    const [prevPositionX, setPrevPositionX] = useState(1);
    const [prevPositionZ, setPrevPositionZ] = useState(0);
    const [prevPositionY, setPrevPositionY] = useState(0.1);
    const [positionX, setPositionX] = useState(0);
    const [positionZ, setPositionZ] = useState(0);
    const [positionY, setPositionY] = useState(0.1);

    const [onStair, setOnstair] = useState(false)

    const characterRef = useRef();
    const cubeRef = useRef()

    const [xMove, setXmove] = useState("");


    
    
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
    
    const findPosition = (e) => {

        // 마우스 클릭한 지점 위치 얻기
        const clickedPosition = raycaster.intersectObjects(scene.children)[0]?.point
        
        console.log(clickedPosition)
    };
    
    const smoothMove = (vector) => {
        switch (vector) {
            case "+x":
                characterRef.current.position.x += 0.03
                break;
            case "-x":
                characterRef.current.position.x -= 0.03
                break;
            default:
                break;
        }
    }
    
    useFrame(({ clock }) => {
        const a = clock.getElapsedTime()
        // console.log("Hey, I'm executing every frame!");
        switch (xMove) {
            case "+x":
                moveNum += 0.03
            if(moveNum < 0.3) {
                smoothMove("+x")
            }
            case "-x":
                moveNum += 0.03
            if(moveNum < 0.3) {
                smoothMove("-x")
            }
                break;
        
            default:
                break;
        }

    
        
    })

    const controlCharacter = (e) => {
    
        
            switch (e.key) {
                case "w":
                        setPrevPositionZ(positionZ)
                        setPositionZ(positionZ - 1)
                    
                    break;
                case "a":
                        setPrevPositionX(positionX)
                        setPositionX(positionX - 0.1)
                        setXmove("-x")
                        if(onStair) {
                            setPositionY(positionY + 0.05)
                        }
                        
                    break;
                    
                case "d":
                    setPrevPositionX(positionX)
                    setPositionX(positionX + 0.1)
                    setXmove("+x")
                    
                    if(onStair) {
                        setPositionY(positionY - 0.05)
                    }
                    break;

                case "s":
                    setPrevPositionZ(positionZ)
                    setPositionZ(positionZ + 0.4)
                    actions.run.play();
                    
                    break;
                
                default:
                    break;
                }

        
                     
    }

    function Cube(props) {
        const [ref, api] = useBox(() => ({ 
            mass:1000000, 
            ...props, 
            onCollideBegin: (e) => { 
                

                if(e.body.name === "ground1") {
                    console.log("바닥과 충돌")
                    console.log(e)
                    
                    // 큐브의 y 위치가 변했을 때 (떨어질 때) 캐릭터의 위치로 반영
                    // if(e.body.position.y !== positionY) {
                    //     setPositionY(e.body.position.y)
                        
                    // }
                    setOnstair(false);
                    
                    
                }
                else if(e.body.name === "stair") {
                    console.log("계단과 충돌")
                    setOnstair(true);
                    
                    // setPositionY(e.body.position.y)

                }
                else {
                    console.log("물체와 충돌")
                    setPositionX(prevPositionX); 
                    setPositionZ(prevPositionZ);
                   
                }
            },

            
            }))
        
        return (
          <mesh castShadow ref={ref} >
            <boxGeometry args={[0.1,0.1,0.1]} />
            <meshStandardMaterial color="orange" />
            
          </mesh>
        )
      }
  
    useEffect(() => {
        // window.addEventListener("click", installModel);
        // return () => window.removeEventListener("click", installModel);
        
        
        window.addEventListener("keydown", (e) => controlCharacter(e))

        return () => window.removeEventListener("keydown", controlCharacter)

        }, [positionX, positionZ])
                
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

            <group ref={group} dispose={null}>
                <group  
                    ref={characterRef}
                    position={[positionX, positionY, positionZ]} 
                    scale={scale} 
                    rotation={rotation}
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

                <Cube position={[positionX, positionY, positionZ]} />
          </>
        )
        
    
    }
    
    export default CharacterModel;