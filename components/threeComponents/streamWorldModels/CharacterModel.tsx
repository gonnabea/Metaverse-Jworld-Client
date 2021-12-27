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

interface CharacterModelOpts {
    scale: number[]
    rotation: number[]
}

// let moveNum = 0
const CharacterModel = ({ scale, rotation }: CharacterModelOpts) => {
    const [prevPositionX, setPrevPositionX] = useState(1);
    const [prevPositionZ, setPrevPositionZ] = useState(0);
    const [prevPositionY, setPrevPositionY] = useState(0.1);
    const [positionX, setPositionX] = useState(0);
    const [positionZ, setPositionZ] = useState(0);
    const [positionY, setPositionY] = useState(0.1);

    const [onStair, setOnstair] = useState(false)
    const [onCollide, setOnCollide] = useState(false);

    const characterRef = useRef();
    const cubeRef = useRef()

    const [move, setMove] = useState("");
    const [moveNum, setMoveNum] = useState(0)
    const [moveNumX, setMoveNumX] = useState(0)
    const [moveNumZ, setMoveNumZ] = useState(0)

    
    
    
    
    
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
    

    const handleMove = () => {
        
        if(!onCollide) {
            switch (move) {
                case "d":
                    actions.run?.play();
                    setMoveNumX(0)
                    setMoveNumZ(0)
                    console.log(moveNum)
                    
                    setMoveNumX(moveNumX + 0.04)
                    characterRef.current.position.x = positionX + moveNumX
                    setPrevPositionX(characterRef.current.position.x)
                    if(characterRef.current.position.x >= positionX + 0.4) {
                        setMoveNumX(0)
                        setMove("")
                        setPositionX(characterRef.current.position.x)
                        setPositionZ(characterRef.current.position.z)
                        // actions.run?.stop();
                    }

                    // if(onCollide) {
                    // characterRef.current.position.x = prevPositionX - 0.2
                    // setPositionX(prevPositionX - 0.2)
                    //     setOnCollide(false)
                    // }
                    
                    break;
                case "a":
                    actions.run?.play();
                    setMoveNumX(0)
                    setMoveNumZ(0)
                    setMoveNumX(moveNumX - 0.04)
                    characterRef.current.position.x = positionX + moveNumX
                    setPrevPositionX(characterRef.current.position.x)
                    if(characterRef.current.position.x <= positionX - 0.4) {
                        setMoveNumX(0)
                        setMove("")
                        setPositionX(characterRef.current.position.x)
                        setPositionZ(characterRef.current.position.z)
                        // actions.run?.stop();
                    }

                    // if(onCollide) {
                    //     characterRef.current.position.x = prevPositionX + 0.2
                    //     setPositionX(prevPositionX + 0.2)
                    //         setOnCollide(false)
                    //     }
                    break;
                case "s":
                    actions.run?.play();
                    setMoveNumX(0)
                    setMoveNumZ(0)
                    setMoveNumZ(moveNumZ + 0.04)
                    characterRef.current.position.z = positionZ + moveNumZ
                    setPrevPositionZ(characterRef.current.position.z)
                    if(characterRef.current.position.z >= positionZ + 0.4) {
                        setMoveNumZ(0)
                        setMove("")
                        setPositionX(characterRef.current.position.x)
                        setPositionZ(characterRef.current.position.z)
                        // actions.run?.stop();
                    }

                    // if(onCollide) {
                    //     characterRef.current.position.z = prevPositionZ - 0.2
                    //     setPositionZ(prevPositionZ - 0.2)
                    //         setOnCollide(false)
                    //     }
                    break;
                case "w":
                    actions.run?.play();
                    setMoveNumX(0)
                    setMoveNumZ(0)
                    setMoveNumZ(moveNumZ - 0.04)
                    characterRef.current.position.z = positionZ + moveNumZ
                    setPrevPositionZ(characterRef.current.position.z)
                    if(characterRef.current.position.z <= positionZ - 0.4) {
                        setMoveNumZ(0)
                        setMove("")
                        setPositionX(characterRef.current.position.x)
                        setPositionZ(characterRef.current.position.z)
                        // actions.run?.stop();

    
                    }

                    // if(onCollide) {
                    //     characterRef.current.position.z = prevPositionZ + 0.2
                    //     setPositionZ(prevPositionZ + 0.2)
                    //         setOnCollide(false)
                    //     }
                    break;
            
                default:
                    break;
            }
        }
        else {

            // 장애물에 부딪혔을 경우 처리
                switch(move) {
                    case "d":
                        
                        setPositionX(positionX -0.1)
                        setPrevPositionX(positionX -0.1)
                        setMoveNumX(0)
                        break;
                    case "a":
                       
                        setPositionX(positionX +0.1)
                        setPrevPositionX(positionX +0.1)
                        setMoveNumX(0)
                        break;
                    case "s":
                     
                        setPositionZ(positionZ -0.1)
                        setPrevPositionZ(positionZ -0.1)
                        setMoveNumZ(0)
                        break;
                    case "w":
                       
                        setPositionZ(positionZ +0.1)
                        setPrevPositionZ(positionZ +0.1)
                        setMoveNumZ(0)
                        break;
                    default:
                        setPrevPositionX(positionX)
                        setPrevPositionZ(positionZ)
                        setMoveNumX(0)
                        setMoveNumZ(0)
                        break;
                }
          
                setTimeout(() => {
                    setOnCollide(false)
                },300)
            
        
            
        }
        
    }
    
    useFrame(({ clock }) => {
        const a = clock.getElapsedTime()
        // console.log("Hey, I'm executing every frame!");
        
            handleMove()
        
            // if(onCollide) {
            //     switch(move) {
            //         case "d":
            //             setPositionX(positionX -1)
            //             setPrevPositionX(positionX)
            //             setMoveNumX(0)
            //             break;
            //         case "a":
            //             setPositionX(positionX +1)
            //             setPrevPositionX(positionX)
            //             setMoveNumX(0)
            //             break;
            //         case "s":
            //             setPositionZ(positionZ -1)
            //             setPrevPositionZ(positionZ)
            //             setMoveNumZ(0)
            //             break;
            //         case "w":
            //             setPositionZ(positionZ +1)
            //             setPrevPositionZ(positionZ)
            //             setMoveNumZ(0)
            //             setMoveNumX(0)
            //             break;
            //             default:
            //                 // setPrevPositionX(positionX)
            //                 // setPrevPositionZ(positionZ)
            //                 // setMoveNumX(0)
            //                 // setMoveNumZ(0)
            //                 break;
            //     }
          
                
            //     setOnCollide(false)
            // }
        
        
      

    
        
    })

    const controlCharacter = (e) => {
    
            console.log(e.key)
            switch (e.key) {
                case "w":
                        setMove("w")
                    
                    break;
                case "a":
                      
                        setMove("a")
                        if(onStair) {
                            setPositionY(positionY + 0.05)
                        }
                        
                    break;
                    
                case "d":
                   
                    setMove("d")
                    
                    if(onStair) {
                        setPositionY(positionY - 0.05)
                    }
                    break;

                case "s":
                    
                    setMove("s")

                    
                    
                    break;
                
                default:
                    break;
                }

        
                     
    }

    function Cube(props) {
        const [ref, api] = useBox(() => ({ 
            mass:1, 
            ...props, 
            
            args:[1,1,1],
            
            onCollideBegin: (e) => { 
            
                
                if(e.body.name === "ground1") {
                    console.log("바닥과 충돌")
                    console.log(e)
                    
                    // 큐브의 y 위치가 변했을 때 (떨어질 때) 캐릭터의 위치로 반영
                    // if(e.body.position.y !== positionY) {
                    //     setPositionY(e.body.position.y)
                        
                    // }
                    ref.current.position.y = 1;
                    setOnstair(false);
                    
                    
                }
                else if(e.body.name === "stair") {
                    console.log("계단과 충돌")
                    setOnstair(true);
                    
                    
                    // setPositionY(e.body.position.y)

                }
                else {
                    console.log("물체와 충돌")
                    setOnCollide(true)
                    setPrevPositionX(positionX -0.1)
                    setPrevPositionZ(positionZ -0.1)
                    setMoveNumX(0)
                    setMoveNumZ(0)
                    switch(move) {
                        case "d":
                            
                            setPositionX(positionX -0.1)
                            setPrevPositionX(positionX -0.1)
                            setMoveNumX(0)
                            break;
                        case "a":
                           
                            setPositionX(positionX +0.1)
                            setPrevPositionX(positionX +0.1)
                            setMoveNumX(0)
                            break;
                        case "s":
                         
                            setPositionZ(positionZ -0.1)
                            setPrevPositionZ(positionZ -0.1)
                            setMoveNumZ(0)
                            break;
                        case "w":
                           
                            setPositionZ(positionZ +0.1)
                            setPrevPositionZ(positionZ +0.1)
                            setMoveNumZ(0)
                            break;
                        default:
                            setPrevPositionX(positionX)
                            setPrevPositionZ(positionZ)
                            setMoveNumX(0)
                            setMoveNumZ(0)
                            break;
                    }
              
                    setTimeout(() => {
                        setOnCollide(false)
                    },300)
                   
                   
                }
            }
            
           

            
            }))
        
        return (
          <mesh ref={ref}>
            <boxGeometry args={[1,0.1,1]}/>
            <meshStandardMaterial color="orange" />
            
          </mesh>
        )
      }
  
    useEffect(() => {
        
        
        window.addEventListener("keypress", (e) => controlCharacter(e))

        return () => window.removeEventListener("keypress", controlCharacter)

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

            <group ref={group} dispose={null}>
                <group  
                    
                    ref={characterRef}
                    position={[prevPositionX, positionY, prevPositionZ]} 
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
                            moveNumX={moveNumX} 
                            moveNumZ={moveNumZ} 
                            prevPositionX={prevPositionX}
                            prevPositionZ={prevPositionZ}
                        />

                        <primitive 
                            object={nodes.mixamorigHips}

                        />
                        <skinnedMesh geometry={nodes.Ch46.geometry} material={materials.Ch46_body} skeleton={nodes.Ch46.skeleton} />
                </group>
            </group>

            <Cube position={[prevPositionX, 1, prevPositionZ]} />
          </>
        )
        
    
    }
    
    export default CharacterModel;