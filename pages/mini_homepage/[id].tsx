import type { NextPage } from 'next'
import { Canvas } from '@react-three/fiber';
import React, { useEffect, useState } from 'react';
import { Suspense } from "react";
import OrbitCameraController from '../../components/threeComponents/OrbitController';
import RoomModel from '../../components/threeComponents/models/RoomModel';
import Carpet1Model from '../../components/threeComponents/models/Carpet1Model';
import TvModel from '../../components/threeComponents/models/TvModel';
import Carpet2Model from '../../components/threeComponents/models/Carpet2Model';
import MiniHompiCustomUI from '../../components/MiniHompiCustomUI';
import StandingLampModel from '../../components/threeComponents/models/StandingLampModel';


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

              <MiniHompiCustomUI 
                modelName={"방"} 
                sizeControlUI={
                  <div>
                  <button className="text-lg" onClick={() => {setRoomScale(roomScale => roomScale += 0.05)}}>+</button>
                  <button className="text-lg" onClick={() => {setRoomScale(roomScale => roomScale -= 0.05)}}>-</button>
                  </div>
                }
                backgroundColor="green"
              />

              <MiniHompiCustomUI 
                modelName={"카페트1"} 
                installUI={
                  <div>
                    <button className="text-lg" onClick={() => {setInstallCarpet1(installCarpet1 => installCarpet1 = !installCarpet1)}}>ON / OFF</button>
                  </div>
                }
                sizeControlUI={
                  <div>
                  <button className="text-lg" onClick={() => {setCarpet1Scale(carpet1Scale => carpet1Scale += 0.05)}}>+</button>
                  <button className="text-lg" onClick={() => {setCarpet1Scale(carpet1Scale => carpet1Scale -= 0.05)}}>-</button>
                </div>
                }
                focusingUI={
                  <div>
                  <button className="text-lg" 
                  onClick={() => {if(carpet1Focused === false){initEditMode()};setCarpet1Focused(carpet1Focused => carpet1Focused = !carpet1Focused)}}>ON / OFF</button>
                </div>
                }
                backgroundColor="blue"
              />


              <MiniHompiCustomUI 
                modelName={"카페트2"} 
                installUI={
                  <div>
                    <button className="text-lg" onClick={() => {setInstallCarpet2(installCarpet2 => installCarpet2 = !installCarpet2)}}>ON / OFF</button>
                  </div>
                }
                sizeControlUI={
                  <div>
                    <button className="text-lg" onClick={() => {setCarpet2Scale(carpet2Scale => carpet2Scale += 0.05)}}>+</button>
                    <button className="text-lg" onClick={() => {setCarpet2Scale(carpet2Scale => carpet2Scale -= 0.05)}}>-</button>
                  </div>
                }
                focusingUI={
                  <div>
                    <button className="text-lg" 
                    onClick={() => {if(carpet2Focused === false){initEditMode()}; setCarpet2Focused(carpet2Focused => carpet2Focused = !carpet2Focused)}}>ON / OFF</button>
                  </div>
                }
                backgroundColor="yellow"
              />         

              <MiniHompiCustomUI 
                modelName={"TV"} 
                installUI={
                  <div>
                    <button className="text-lg" onClick={() => {setInstallTv(installTv => installTv = !installTv)}}>ON / OFF</button>
                  </div>
                }
                sizeControlUI={
                  <div>
                    <button className="text-lg" onClick={() => {setTvScale(tvScale => tvScale += 0.05)}}>+</button>
                    <button className="text-lg" onClick={() => {setTvScale(tvScale => tvScale -= 0.05)}}>-</button>
                  </div>
                }
                focusingUI={
                  <div>
                    <button className="text-lg" 
                    onClick={() => {if(tvFocused === false){initEditMode()}; setTvFocused(tvFocused => tvFocused = !tvFocused)}}>ON / OFF</button>
                  </div>
                }
                backgroundColor="purple"

              /> 

              <MiniHompiCustomUI 
                modelName={"스탠딩 램프"} 
                installUI={
                  <div>
                    <button className="text-lg" onClick={() => {setInstallStandingLamp(installStandingLamp => installStandingLamp = !installStandingLamp)}}>ON / OFF</button>
                  </div>
                }
                sizeControlUI={
                  <div>
                    <button className="text-lg" onClick={() => {setStandingLampScale(standingLampScale => standingLampScale += 0.05)}}>+</button>
                    <button className="text-lg" onClick={() => {setStandingLampScale(standingLampScale => standingLampScale -= 0.05)}}>-</button>
                  </div>
                }
                focusingUI={
                  <div>
                    <button 
                    className="text-lg" 
                    onClick={() => {
                      if(standingLampFocused === false){initEditMode()}; 
                      setStandingLampFocused(standingLampFocused => standingLampFocused = !standingLampFocused)
                      }}>ON / OFF</button>
                  </div>
                }
                backgroundColor="orange"

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
        </section>
    )

}

export default MiniHomepage;