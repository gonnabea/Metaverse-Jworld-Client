import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useRef, useState } from 'react';
import { Bloom, GodRays, SelectiveBloom, Sepia, SSAO, ToneMapping  } from '@react-three/postprocessing'
// @ts-ignore
import { BlurPass, Resizer, KernelSize, BlendFunction  } from 'postprocessing' 
import { BufferGeometry, Material, Mesh, Vector3 } from 'three';
import RoomModel from './RoomModel';
import { addModel, applyModels, setModels } from '../../../stores/ThreeModels';
import { modelNameTypes, RerenderType, ThreeModelOpts } from '../../../types/common';
import { applyThreeModels, setAllModelsStatus } from '../../../stores/setAllThreeModels';
import { useReactiveVar } from '@apollo/client';


const StandingLampModel = ({rerender, setRerender,}: RerenderType) => {
    const allModelsStatus = useReactiveVar(applyThreeModels);

  const { installed, scale, rotateY, isFocused, position } = allModelsStatus.standingLamp[0]


    const createModelStatus = async () => {
        const modelStatus = {
          name: "standingLamp",
          position,
          installed,
          scale: {x: scale, y: scale, z: scale},
          rotateY
        }
        addModel(modelStatus)
      }
    

    const sefiaEffectRef = useRef()
    const stadingLampRef = useRef()
    const pointLightRef = useRef();
    const [toggleLamp, setToggleLamp] = useState(false)
    
    
    
    const gltf = useLoader(GLTFLoader, modelList.standing_lamp);
    
    
    const raycaster = useThree((state) => state.raycaster);
    const scene = useThree((state) => state.scene)
    
    const installModel = (e) => {
      
      // 마우스 클릭한 지점 위치 얻기
      const closedObjPosition = raycaster.intersectObjects(scene.children)[0]?.point

      // 모델 설치
      if(closedObjPosition && isFocused === true && e.target.tagName === "CANVAS"){
          console.log("스탠딩램프 포커싱 상태");
        //   setModelStatus({
        //     ...modelStatus,
        //     position: {x: closedObjPosition.x, y: 0, z: closedObjPosition.z}
        // });

        setAllModelsStatus({
            modelName: modelNameTypes.standingLamp,
            index: 0,
            status: {
                installed,
                scale,
                rotateY,
                isFocused,
                position: {x: closedObjPosition.x, y: 0, z: closedObjPosition.z},
        
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
        isFocused, 
        installed,
        scale,
        rotateY,
        position
    ])

    if(installed === true){

        return (
            <>
            <primitive 
                ref={stadingLampRef}
                onClick={() => {
                    console.log(pointLightRef.current)
                    // // sefia 효과 토글
                    // sefiaEffectRef.current.blendMode.opacity.value = !sefiaEffectRef.current.blendMode.opacity.value;
                    // 조명 on / off
                    pointLightRef.current.visible = !pointLightRef.current.visible;
                }} 
                onPointerOver={() => {
                    document.body.style.cursor = "pointer"
                }}
                onPointerOut={() => {
                    document.body.style.cursor = "default"

                }}
                position={[position.x, position.y, position.z]} 
                scale={scale} 
                rotation={[0, rotateY, 0]}
                object={gltf.scene} 
            />

            {/* <Sepia ref={sefiaEffectRef} intensity={0.4} /> */}

            {/* {sphereLightRef.current ? 
                <GodRays
                    sun={sphereLightRef.current}
                    blendFunction={BlendFunction.Screen} // The blend function of this effect.
                    samples={60} // The number of samples per pixel.
                    density={0.96} // The density of the light rays.
                    decay={0.9} // An illumination decay factor.
                    weight={0.4} // A light ray weight factor.
                    exposure={1} // A constant attenuation coefficient.
                    clampMax={1} // An upper bound for the saturation of the overall effect.
                    width={Resizer.AUTO_SIZE} // Render width.
                    height={Resizer.AUTO_SIZE} // Render height.
                    kernelSize={KernelSize.SMALL} // The blur kernel size. Has no effect if blur is disabled.
                    blur={0} // Whether the god rays should be blurred to reduce artifacts.
                    
            /> : null}
             */}
            {/* <mesh ref={sphereLightRef} visible userData={{ test: "hello" }} 

                position={new Vector3(position.x + 0.2, position.y + 4.1, position.z)} 
                scale={new Vector3(0.6, 0.6, 0.6)}
                castShadow>
                    <sphereGeometry attach="geometry" args={[1, 16, 16]} />
                    <meshStandardMaterial
                        
                        attach="material"
                        color="yellow"
                        
                        roughness={0.1}
                        metalness={0.1}
                    />
            </mesh> */}
            
            <pointLight 
                
                ref={pointLightRef} 
                color="orange" 
                intensity={1} 
                position={new Vector3(position.x + 0.2, position.y + 25 * scale, position.z)} 
                
                distance={20}
            />
            {/* <ToneMapping
                blendFunction={BlendFunction.NORMAL} // blend mode
                adaptive={true} // toggle adaptive luminance map usage
                resolution={256} // texture resolution of the luminance map
                middleGrey={0.6} // middle grey factor
                maxLuminance={16.0} // maximum luminance
                averageLuminance={1.0} // average luminance
                adaptationRate={1.0} // luminance adaptation rate
            /> */}

          </>
        )
    }
    else{
        return <></>
    }
  }

export default StandingLampModel;