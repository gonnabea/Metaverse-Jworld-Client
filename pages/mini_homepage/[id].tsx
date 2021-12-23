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
import BookModel from '../../components/threeComponents/models/BookModel';
import Book3D from '../../components/Book3d';
import ChairModel from '../../components/threeComponents/models/ChairModel';
import CurtainModel from '../../components/threeComponents/models/CurtainModel';


const MiniHomepage:NextPage = () => {

    // 방 크기 조절 state
    const [roomScale, setRoomScale] = useState(0.3);

    // 카페트1 관련 state
    const [installCarpet1, setInstallCarpet1] = useState(false);
    const [carpet1Scale, setCarpet1Scale] = useState(0.3);
    const [carpet1Focused, setCarpet1Focused] = useState(false);
    const [carpet1RotateY, setCarpet1RotateY] = useState(0)

    // 카페트2 관련 state
    const [installCarpet2, setInstallCarpet2] = useState(false);
    const [carpet2Scale, setCarpet2Scale] = useState(0.3);
    const [carpet2Focused, setCarpet2Focused] = useState(false);
    const [carpet2RotateY, setCarpet2RotateY] = useState(0)

    // tv 관련 state
    const [installTv, setInstallTv] = useState(false);
    const [tvScale, setTvScale] = useState(0.3);
    const [tvFocused, setTvFocused] = useState(false);
    const [tvRotateY, setTvRotateY] = useState(0)

    // 스탠딩 램프 관련 state
    const [installStandingLamp, setInstallStandingLamp] = useState(false);
    const [standingLampScale, setStandingLampScale] = useState(0.3);
    const [standingLampFocused, setStandingLampFocused] = useState(false);
    const [standingLampRotateY, setStandingLampRotateY] = useState(0)

    // Vase 관련 state
    const [installVase, setInstallVase] = useState(false);
    const [vaseScale, setVaseScale] = useState(0.1);
    const [vaseFocused, setVaseFocused] = useState(false);
    const [vaseRotateY, setVaseRotateY] = useState(0)

    // book_ani 관련 state
    const [installBook, setInstallBook] = useState(false);
    const [bookScale, setBookScale] = useState(0.1);
    const [bookFocused, setBookFocused] = useState(false);
    const [bookRotateY, setBookRotateY] = useState(0)

    // 의자 관련 state
    const [installChair, setInstallChair] = useState(false);
    const [chairScale, setChairScale] = useState(0.1);
    const [chairRotateY, setChairRotateY] = useState(0)
    const [chairFocused, setChairFocused] = useState(false);
    

    // 커튼 관련 state
    const [installCurtain, setInstallCurtain] = useState(false);
    const [curtainScale, setCurtainScale] = useState(0.1);
    const [curtainRotateY, setCurtainRotateY] = useState(0)
    const [curtainFocused, setCurtainFocused] = useState(false);


    const applyInstallBtn = useRef();
    const [css3dBookVisible, setCss3dBookVisible] = useState(false);

    const initEditMode = () => {
      setCarpet1Focused(false)
      setCarpet2Focused(false)
      setTvFocused(false)
      setStandingLampFocused(false)
      setVaseFocused(false)
      setBookFocused(false)
    }

    useEffect(() => {

    }, [])

    return(
        <section className="w-screen h-screen overflow-hidden">

          <div className="z-10 absolute">

              <ModelSettingBox 
                modelName={"방"} 
                scaleState={roomScale}
                setScaleState={setRoomScale}
                
                backgroundColor="green"
              />         

              {/* CSS 3D 메모장*/}
              <Book3D visible={css3dBookVisible} setVisible={setCss3dBookVisible} />
          
              
              
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
                  <Carpet1Model rotateY={carpet1RotateY} installed={installCarpet1} scale={carpet1Scale} isFocused={carpet1Focused} />
                  <Carpet2Model rotateY={carpet2RotateY} installed={installCarpet2} scale={carpet2Scale} isFocused={carpet2Focused} />
                  <TvModel installed={installTv} scale={tvScale} rotateY={tvRotateY} isFocused={tvFocused} />
                  <StandingLampModel installed={installStandingLamp} rotateY={standingLampRotateY} scale={standingLampScale} isFocused={standingLampFocused} />
                  <VaseModel installed={installVase} scale={vaseScale} rotateY={vaseRotateY} isFocused={vaseFocused} />
                  <ChairModel installed={installChair} scale={chairScale} rotateY={chairRotateY} isFocused={chairFocused} />
                  <CurtainModel installed={installCurtain} scale={curtainScale} rotateY={curtainRotateY} isFocused={curtainFocused} />
                  <BookModel setCss3dBookVisible={setCss3dBookVisible} rotateY={bookRotateY} installed={installBook} scale={bookScale} isFocused={bookFocused} />

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
                installState={installCarpet1}
                setInstallState={setInstallCarpet1}
                scaleState={carpet1Scale}
                setScaleState={setCarpet1Scale}
                rotateYState={carpet1RotateY}
                setRotateYState={setCarpet1RotateY}
                focusState={carpet1Focused}
                setFocusState={setCarpet1Focused}
                initEditMode={initEditMode}
                modelImgUrl="/model_images/carpet1.png"
                

                
                backgroundColor="blue"
              />


              <ModelSettingBox 
                modelName={"카페트2"} 
                installState={installCarpet2}
                setInstallState={setInstallCarpet2}
                scaleState={carpet2Scale}
                setScaleState={setCarpet2Scale}
                rotateYState={carpet2RotateY}
                setRotateYState={setCarpet2RotateY}
                focusState={carpet2Focused}
                setFocusState={setCarpet2Focused}
                initEditMode={initEditMode}
                modelImgUrl="/model_images/carpet2.png"
                
                
                
                backgroundColor="yellow"
              />
            </>
            }

            lights={
              <>
                <ModelSettingBox 
                  modelName={"스탠딩 램프"} 
                  
                  
                  installState={installStandingLamp}
                  setInstallState={setInstallStandingLamp}
                  scaleState={standingLampScale}
                  setScaleState={setStandingLampScale}
                  rotateYState={standingLampRotateY}
                  setRotateYState={setStandingLampRotateY}
                  focusState={standingLampFocused}
                  setFocusState={setStandingLampFocused}
                  initEditMode={initEditMode}
                  backgroundColor="red"
                  modelImgUrl="/model_images/standing_lamp.png"

                />        
              </>
            }

            electronics={
              <ModelSettingBox 
                modelName={"TV"} 
                installState={installTv}
                setInstallState={setInstallTv}
                scaleState={tvScale}
                setScaleState={setTvScale}
                rotateYState={tvRotateY}
                setRotateYState={setTvRotateY}
                focusState={tvFocused}
                setFocusState={setTvFocused}
                initEditMode={initEditMode}
                modelImgUrl="/model_images/tv.png"


                backgroundColor="purple"

            />       
            }

            beauties={
              <>
              <ModelSettingBox 
                modelName={"꽃병"} 
                installState={installVase}
                setInstallState={setInstallVase}
                scaleState={vaseScale}
                setScaleState={setVaseScale}
                rotateYState={vaseRotateY}
                setRotateYState={setVaseRotateY}
                focusState={vaseFocused}
                setFocusState={setVaseFocused}
                initEditMode={initEditMode}
                modelImgUrl="/model_images/vase.png"


                backgroundColor="green"

            />   

            <ModelSettingBox
              modelName={"커튼"} 
              installState={installCurtain}
              setInstallState={setInstallCurtain}
              scaleState={curtainScale}
              setScaleState={setCurtainScale}
              rotateYState={curtainRotateY}
              setRotateYState={setCurtainRotateY}
              focusState={curtainFocused}
              setFocusState={setCurtainFocused}
              initEditMode={initEditMode}

              />
          
          </>
            }

            writes={
              <ModelSettingBox 
                modelName={"메모장"} 
                installState={installBook}
                setInstallState={setInstallBook}
                scaleState={bookScale}
                setScaleState={setBookScale}
                rotateYState={bookRotateY}
                setRotateYState={setBookRotateY}
                focusState={bookFocused}
                setFocusState={setBookFocused}
                initEditMode={initEditMode}

                backgroundColor="black"
                modelImgUrl="/model_images/book_ani.png"


            />   
            }
            
            furnitures = {
              <ModelSettingBox 
              modelName={"의자"} 
              installState={installChair}
              setInstallState={setInstallChair}
              scaleState={chairScale}
              setScaleState={setChairScale}
              rotateYState={chairRotateY}
              setRotateYState={setChairRotateY}
              focusState={chairFocused}
              setFocusState={setChairFocused}
              initEditMode={initEditMode}
              modelImgUrl="/model_images/book_ani.png"
              backgroundColor="blue"

          />   
            }

            />
        </section>
    )

}

export default MiniHomepage;