
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useRef, useState } from 'react';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { useBox } from '@react-three/cannon';

interface CharacterModelOpts {
    scale: number[]
    rotation: number[]
}

const CharacterModel = ({ scale, rotation }: CharacterModelOpts) => {
    const [prevPositionX, setPrevPositionX] = useState(0);
    const [prevPositionZ, setPrevPositionZ] = useState(0);
    const [positionX, setPositionX] = useState(0);
    const [positionZ, setPositionZ] = useState(0);
    const characterRef = useRef();


    
    
    const fbx = useLoader(FBXLoader, modelList.character);
    
    const raycaster = useThree((state) => state.raycaster);
    const scene = useThree((state) => state.scene)
    
    const findPosition = (e) => {

        // 마우스 클릭한 지점 위치 얻기
        const clickedPosition = raycaster.intersectObjects(scene.children)[0]?.point
        
        console.log(clickedPosition)
    };
    
    
    useFrame(({ clock }) => {
        const a = clock.getElapsedTime()
        // console.log("Hey, I'm executing every frame!");
        // console.log(a)
    })

    const controlCharacter = (e) => {
    
        
            switch (e.key) {
                case "w":
                    setPrevPositionZ(positionZ)
                    setPositionZ(positionZ - 0.2)
                    break;
                case "a":
                    setPrevPositionX(positionX)
                    setPositionX(positionX - 0.2)
                    break;
                    
                case "d":
                    setPrevPositionX(positionX)
                    setPositionX(positionX + 0.2)
                    break;

                case "s":
                    setPrevPositionZ(positionZ)
                    setPositionZ(positionZ + 0.2)
                    break;
                
                default:
                    break;
                }

        
                     
    }

    function Cube(props) {
        const [ref, api] = useBox(() => ({ 
            mass: 1, 
            ...props, 
            onCollideBegin: (e) => { 
                

                if(e.body.name === "ground1") {
                    console.log("바닥과 충돌")
                }
                else {
                    setPositionX(prevPositionX); 
                    setPositionZ(prevPositionZ);
                }
                
                
            },
            onCollideEnd: (e) => { 
                

                if(e.body.name === "ground1") {
                    console.log("바닥과 충돌")
                }
                else {
                    setPositionX(prevPositionX); 
                    setPositionZ(prevPositionZ);
                }
                
                
            },
            onCollide: (e) => { 
                

                if(e.body.name === "ground1") {
                    console.log("바닥과 충돌")
                }
                else {
                    setPositionX(prevPositionX); 
                    setPositionZ(prevPositionZ);
                }
                
                
            }
            }))
        
        return (
          <mesh castShadow ref={ref}>
            <boxGeometry />
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
                <primitive 
                    ref={characterRef}
                    // onClick={(e) => {
                        //     findPosition(e)
                        // }} 
                        position={[positionX, 0, positionZ]} 
                        scale={scale} 
                        rotation={rotation}
                        object={fbx} 
                        onPointerOver={() => {
                            document.body.style.cursor = "pointer"
                        }}
                        onPointerOut={() => {
                            document.body.style.cursor = "default"
                        }}
                    />

                <Cube position={[positionX, 0.5, positionZ]} />
          </>
        )
        
    
    }
    
    export default CharacterModel;