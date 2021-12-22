import type { NextPage } from 'next'
import { Canvas } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import { Suspense } from "react";
import OrbitCameraController from '../../components/threeComponents/OrbitController';
import RoomModel from '../../components/threeComponents/models/RoomModel';
import Carpet1Model from '../../components/threeComponents/models/Carpet1Model';
import TvModel from '../../components/threeComponents/models/TvModel';
import Carpet2Model from '../../components/threeComponents/models/Carpet2Model';
import StandingLampModel from '../../components/threeComponents/models/StandingLampModel';
import BottomUI from '../../components/BottomUI';
import ModelInstallPop from '../../components/minihompi/ModelInstallPop';
import ModelSettingBox from '../../components/minihompi/ModelSettingBox';
import VaseModel from '../../components/threeComponents/models/VaseModel';
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from '@react-three/postprocessing'


const MiniHomepage:NextPage = () => {

    // 방 크기 조절 state
    const [roomScale, setRoomScale] = useState(0.3);

    // 카페트1 관련 state
    const [installCarpet1, setInstallCarpet1] = useState(false);
    const [carpet1Scale, setCarpet1Scale] = useState(0.3);
    const [carpet1Focused, setCarpet1Focused] = useState(false);

    // 카페트2 관련 state
    const [installCarpet2, setInstallCarpet2] = useState(false);
    const [carpet2Scale, setCarpet2Scale] = useState(0.3);
    const [carpet2Focused, setCarpet2Focused] = useState(false);

    // tv 관련 state
    const [installTv, setInstallTv] = useState(false);
    const [tvScale, setTvScale] = useState(0.3);
    const [tvFocused, setTvFocused] = useState(false);

    // 스탠딩 램프 관련 state
    const [installStandingLamp, setInstallStandingLamp] = useState(false);
    const [standingLampScale, setStandingLampScale] = useState(0.3);
    const [standingLampFocused, setStandingLampFocused] = useState(false);

    // Vase 관련 state
    const [installVase, setInstallVase] = useState(false);
    const [vaseScale, setVaseScale] = useState(0.1);
    const [vaseFocused, setVaseFocused] = useState(false);


    const applyInstallBtn = useRef();

    const initEditMode = () => {
      setCarpet1Focused(false)
      setCarpet2Focused(false)
      setTvFocused(false)
      setStandingLampFocused(false)
    }

    useEffect(() => {

    }, [])

    return(
        <section className="w-screen h-screen overflow-hidden">

          <div className="z-10 absolute">

              <ModelSettingBox 
                modelName={"방"} 
                sizeControlUI={
                  <div>
                  <button className="text-lg" 
                    onClick={() => {
                      if(roomScale < 0.6)
                      setRoomScale(roomScale => roomScale += 0.05)
                    }}>+</button>
                  <button className="text-lg" 
                    onClick={() => {
                      if(roomScale > 0.1)
                      setRoomScale(roomScale => roomScale -= 0.05)
                      }}>-</button>
                  </div>
                }
                backgroundColor="green"
              />         
          
              
              
          </div>

            <Canvas className="w-screen h-screen" camera={{ position: [0, -40, 20] }} >
              <OrbitCameraController />
              <pointLight intensity={1} color={"skyblue"} />
              
              <directionalLight
                
                intensity={0.6}
                position={[0, 2, 2]}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                castShadow
            />
              <Suspense fallback={null}>
              <EffectComposer>
                  <RoomModel roomScale={roomScale} />
                  <Carpet1Model installed={installCarpet1} scale={carpet1Scale} isFocused={carpet1Focused} />
                  <Carpet2Model installed={installCarpet2} scale={carpet2Scale} isFocused={carpet2Focused} />
                  <TvModel installed={installTv} scale={tvScale} isFocused={tvFocused} />
                  <StandingLampModel installed={installStandingLamp} scale={standingLampScale} isFocused={standingLampFocused} />
                  <VaseModel installed={installVase} scale={vaseScale} isFocused={vaseFocused} />
              </EffectComposer>
              </Suspense>
          </Canvas>,

          <BottomUI 
            chatContents={["Asdasd"]}
            ChatForm={
              () => <form className="absolute bottom-14 w-96 left-4 z-10" >
              <input id="chatInput" className="w-11/12" type="text" min="1" placeholder="채팅 내용 입력" />
              <input className="" type="submit" value="전송" />
              </form>
            }
            SettingForm={() =>

              <div className="fixed border-2 w-screen h-screen left-0 top-0 flex justify-center items-center bg-blue-500 bg-opacity-25 flex-col z-20">
                  <form className="flex flex-col w-3/6 h-2/6 justify-around " action="">
                      <input className="text-center h-1/6 text-lg font-bold" type="checkbox" maxLength={10} placeholder="배경음 ON" />
                      <input className="text-center h-1/6 text-lg font-bold pl-4" type="checkbox" maxLength={1} placeholder="효과음 ON" />
                      <input className="text-center h-1/6 bg-black rounded-lg text-white hover:bg-blue-500 border-double border-4 font-bold" type="submit" value="적용" />
                  </form>
              </div>
          }
            />

          <button ref={applyInstallBtn} className="z-10 absolute bottom-0 right-2 text-lg" value="설치 적용" 
          onClick={() => {
            
            initEditMode()
            // applyInstallBtn.current.style.display = "none"
          }
        }>
          설치 적용
          </button>
          <ModelInstallPop 
        
            carpets={
              <>
              <ModelSettingBox 
                modelName={"카페트1"} 
                installUI={
                  <div>
                    <button className="text-lg" 
                    onClick={() => {

                      // 중복 포커싱 방지
                      if(carpet1Focused === false) initEditMode();

                      setInstallCarpet1(!installCarpet1);

                      if(!installCarpet1) {
                        setCarpet1Focused(true);
                      }
                      else {
                        setCarpet1Focused(false);
                      }
                      
                      }}>ON / OFF</button>
                  </div>
                }
                sizeControlUI={
                  <div>
                  <button className="text-lg" onClick={() => {setCarpet1Scale(carpet1Scale => carpet1Scale += 0.05)}}>+</button>
                  <button className="text-lg" onClick={() => {setCarpet1Scale(carpet1Scale => carpet1Scale -= 0.05)}}>-</button>
                </div>
                }

                modelImgUI={
                  carpet1Focused ? <img 

                    src="/model_images/carpet1.png" 
                    onClick={() => setCarpet1Focused(false)} 
                    className="text-lg border-solid border-4 border-green-400 w-4/12 h-4/12" />
                  
                 : <img src="/model_images/carpet1.png" onClick={() => setCarpet1Focused(true)}  className="text-lg w-4/12 h-4/12" />
              }
                backgroundColor="blue"
              />


              <ModelSettingBox 
                modelName={"카페트2"} 
                installUI={
                  <div>
                    <button className="text-lg" 
                    onClick={() => {

                      // 중복 포커싱 방지
                      if(carpet2Focused === false) initEditMode(); 

                      setInstallCarpet2(!installCarpet2);

                      if(!installCarpet2)
                        setCarpet2Focused(true);
                      else {
                        setCarpet2Focused(false);
                      }
                      
                      }}>ON / OFF</button>
                  </div>
                }
                sizeControlUI={
                  <div>
                    <button className="text-lg" onClick={() => {setCarpet2Scale(carpet2Scale => carpet2Scale += 0.05)}}>+</button>
                    <button className="text-lg" onClick={() => {setCarpet2Scale(carpet2Scale => carpet2Scale -= 0.05)}}>-</button>
                  </div>
                }

                modelImgUI={
                  carpet2Focused ? <img 

                    src="/model_images/carpet2.png" 
                    onClick={() => setCarpet2Focused(false)} 
                    className="text-lg border-solid border-4 border-green-400 w-4/12 h-4/12" />
                  
                 : <img src="/model_images/carpet2.png" onClick={() => setCarpet2Focused(true)}  className="text-lg w-4/12 h-4/12" />
              }
                
                backgroundColor="yellow"
              />
            </>
            }

            lights={
              <>
                <ModelSettingBox 
                  modelName={"스탠딩 램프"} 
                  installUI={
                    <div>
                      <button className="text-lg" 
                      onClick={() => {
                        
                        // 중복 포커싱 방지
                        if(standingLampFocused === false)
                          initEditMode();
                          
                        setInstallStandingLamp(!installStandingLamp);
                          
                        // 모델 설치 시 포커싱 상태 적용
                        if(!installStandingLamp) {
                          setStandingLampFocused(true);
                        }
                        else {
                          setStandingLampFocused(false);
                        }
                        
                        
                        
                      

                      }}>ON / OFF</button>
                    </div>
                  }
                  sizeControlUI={
                    <div>
                      <button className="text-lg" onClick={() => {setStandingLampScale(standingLampScale => standingLampScale += 0.05)}}>+</button>
                      <button className="text-lg" onClick={() => {setStandingLampScale(standingLampScale => standingLampScale -= 0.05)}}>-</button>
                    </div>
                  }
                  modelImgUI={
                      standingLampFocused ? <img 

                        src="/model_images/standing_lamp.png" 
                        onClick={() => setStandingLampFocused(false)} 
                        className="text-lg border-solid border-4 border-green-400 w-4/12 h-4/12" />
                      
                     : <img src="/model_images/standing_lamp.png" onClick={() => setStandingLampFocused(true)}  className="text-lg w-4/12 h-4/12" />
                  }
                  backgroundColor="red"

                />        
              </>
            }

            electronics={
              <ModelSettingBox 
              modelName={"TV"} 
              installUI={
                <div>
                  <button className="text-lg" 
                    onClick={() => {

                      // 중복 포커싱 방지
                      if(tvFocused === false) initEditMode(); 

                      setInstallTv(installTv => installTv = !installTv);

                      if(!installTv)
                        setTvFocused(true);
                      else{
                        setTvFocused(false);
                      }

                      
                    
                  }}>ON / OFF</button>
                </div>
              }
              sizeControlUI={
                <div>
                  <button className="text-lg" onClick={() => {setTvScale(tvScale => tvScale += 0.05)}}>+</button>
                  <button className="text-lg" onClick={() => {setTvScale(tvScale => tvScale -= 0.05)}}>-</button>
                </div>
              }

              modelImgUI={
                tvFocused ? <img 

                  src="/model_images/tv.png" 
                  onClick={() => setTvFocused(false)} 
                  className="text-lg border-solid border-4 border-green-400 w-4/12 h-full" />
                
               : <img src="/model_images/tv.png" onClick={() => setTvFocused(true)}  className="text-lg w-4/12 h-4/12 r-0 h-full" />
            }

              backgroundColor="purple"

            />       
            }

            beauties={
              <ModelSettingBox 
              modelName={"꽃병"} 
              installUI={
                <div>
                  <button className="text-lg" 
                    onClick={() => {

                      // 중복 포커싱 방지
                      if(vaseFocused === false) initEditMode(); 

                      setInstallVase(installVase => installVase = !installVase);

                      if(!installVase)
                        setVaseFocused(true);
                      else{
                        setVaseFocused(false);
                      }

                      
                    
                  }}>ON / OFF</button>
                </div>
              }
              sizeControlUI={
                <div>
                  <button className="text-lg" onClick={() => {setVaseScale(vaseScale => vaseScale += 0.05)}}>+</button>
                  <button className="text-lg" onClick={() => {setVaseScale(vaseScale => vaseScale -= 0.05)}}>-</button>
                </div>
              }

              modelImgUI={
                vaseFocused ? <img 

                  src="/model_images/vase.png" 
                  onClick={() => setVaseFocused(false)} 
                  className="text-lg border-solid border-4 border-green-400 w-4/12 h-full" />
                
               : <img src="/model_images/vase.png" onClick={() => setVaseFocused(true)}  className="text-lg w-4/12 h-4/12 r-0 h-full" />
            }

              backgroundColor="green"

            />   
            }

            />
        </section>
    )

}

export default MiniHomepage;