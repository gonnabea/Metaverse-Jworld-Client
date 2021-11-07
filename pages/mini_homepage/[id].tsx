import type { NextPage } from 'next'
import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { Suspense } from "react";
import OrbitCameraController from '../../threeComponents/OrbitController';
import RoomModel from '../../threeComponents/models/RoomModel';
import CarpetModel from '../../threeComponents/models/Carpet1Model';
import TvModel from '../../threeComponents/models/tvModel';

const MiniHomepage:NextPage = () => {

    const [roomScale, setRoomScale] = useState(0.3);

    const [installCarpet1, setInstallCarpet1] = useState(false);
    const [carpet1Scale, setCarpet1Scale] = useState(0.3);
    const [carpet1Focused, setCarpet1Focused] = useState(false);

    const [installTv, setInstallTv] = useState(false);
    const [tvScale, setTvScale] = useState(1);
    const [tvFocused, settvFocused] = useState(false);

    

    useEffect(() => {

    }, [])

    return(
        <section className="w-screen h-screen overflow-hidden">

          <div className="z-10 absolute bg-red-200">

              <div className="border-dashed border-4 border-light-blue-500">
              <span className="">
                방 크기 조절
              </span>
              <button className="text-lg" onClick={() => {setRoomScale(roomScale => roomScale += 0.05)}}>+</button>
              <button className="text-lg" onClick={() => {setRoomScale(roomScale => roomScale -= 0.05)}}>-</button>
              </div>

              <div className="border-dashed border-4 border-light-blue-500">
              <span className="">
                카페트1 설치
              </span>
              <button className="text-lg" onClick={() => {setInstallCarpet1(installCarpet1 => installCarpet1 = !installCarpet1)}}>ON / OFF</button>
              </div>

              <div className="border-dashed border-4 border-light-blue-500">
              <span className="">
                카페트1 크기 조절
              </span>
              <button className="text-lg" onClick={() => {setCarpet1Scale(carpet1Scale => carpet1Scale += 0.05)}}>+</button>
              <button className="text-lg" onClick={() => {setCarpet1Scale(carpet1Scale => carpet1Scale -= 0.05)}}>-</button>
              </div>

              <div className="border-dashed border-4 border-light-blue-500">
              <span className="">
                카페트1 포커싱
              </span>
              <button className="text-lg" onClick={() => {setCarpet1Focused(carpet1Focused => carpet1Focused = !carpet1Focused)}}>ON / OFF</button>
              </div>

              <div className="border-dashed border-4 border-light-blue-500">
              <span className="">
                TV 설치
              </span>
              <button className="text-lg" onClick={() => {setInstallTv(installTv => installTv = !installTv)}}>ON / OFF</button>
              </div>

              <div className="border-dashed border-4 border-light-blue-500">
              <span className="">
                TV 크기 조절
              </span>
              <button className="text-lg" onClick={() => {setTvScale(tvScale => tvScale += 0.05)}}>+</button>
              <button className="text-lg" onClick={() => {setTvScale(tvScale => tvScale -= 0.05)}}>-</button>
              </div>

              <div className="border-dashed border-4 border-light-blue-500">
              <span className="">
                tv 포커싱
              </span>
              <button className="text-lg" onClick={() => {settvFocused(tvFocused => tvFocused = !tvFocused)}}>ON / OFF</button>
              </div>
          </div>

            <Canvas className="w-screen h-screen" camera={{ position: [0, -40, 20] }} >
              <OrbitCameraController />
              <ambientLight />
              <Suspense fallback={null}>
                  <RoomModel roomScale={roomScale} />
                  <CarpetModel installed={installCarpet1} scale={carpet1Scale} isFocused={carpet1Focused} />
                  <TvModel installed={installTv} scale={tvScale} isFocused={tvFocused} />
              </Suspense>
          </Canvas>,
        </section>
    )

}

export default MiniHomepage;