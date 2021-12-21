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
                  <button className="text-lg" onClick={() => {setRoomScale(roomScale => roomScale += 0.05)}}>+</button>
                  <button className="text-lg" onClick={() => {setRoomScale(roomScale => roomScale -= 0.05)}}>-</button>
                  </div>
                }
                backgroundColor="green"
              />         
          
              
              
          </div>

            <Canvas className="w-screen h-screen" camera={{ position: [0, -40, 20] }} >
              <OrbitCameraController />
              <pointLight intensity={1} color={"skyblue"} />
              <ambientLight color={"white"} />
              <Suspense fallback={null}>
                  <RoomModel roomScale={roomScale} />
                  <Carpet1Model installed={installCarpet1} scale={carpet1Scale} isFocused={carpet1Focused} />
                  <Carpet2Model installed={installCarpet2} scale={carpet2Scale} isFocused={carpet2Focused} />
                  <TvModel installed={installTv} scale={tvScale} isFocused={tvFocused} />
                  <StandingLampModel installed={installStandingLamp} scale={standingLampScale} isFocused={standingLampFocused} />
              </Suspense>
          </Canvas>,

          <BottomUI 
            chatContents={["Asdasd"]}
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
                          
                        if(!installStandingLamp) {
                          setStandingLampFocused(true);
                        }
                        else {
                          setStandingLampFocused(false);
                        }
                        
                        // 모델 설치 시 포커싱 상태 적용
                        
                      

                      }}>ON / OFF</button>
                    </div>
                  }
                  sizeControlUI={
                    <div>
                      <button className="text-lg" onClick={() => {setStandingLampScale(standingLampScale => standingLampScale += 0.05)}}>+</button>
                      <button className="text-lg" onClick={() => {setStandingLampScale(standingLampScale => standingLampScale -= 0.05)}}>-</button>
                    </div>
                  }
                  backgroundColor="orange"

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

              backgroundColor="purple"

            />       
            }

            />
        </section>
    )

}

export default MiniHomepage;