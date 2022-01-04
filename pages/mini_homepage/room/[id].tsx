import type { NextPage } from 'next'
import { Canvas } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import { Suspense } from "react";
import OrbitCameraController from '../../../components/threeComponents/OrbitController';
import RoomModel from '../../../components/threeComponents/miniHompiModels/RoomModel';
import Carpet1Model from '../../../components/threeComponents/miniHompiModels/Carpet1Model';
import TvModel from '../../../components/threeComponents/miniHompiModels/TvModel';
import Carpet2Model from '../../../components/threeComponents/miniHompiModels/Carpet2Model';
import StandingLampModel from '../../../components/threeComponents/miniHompiModels/StandingLampModel';
import BottomUI from '../../../components/common/BottomUI';
import ModelInstallPop from '../../../components/minihompi/ModelInstallPop';
import ModelSettingBox from '../../../components/minihompi/ModelSettingBox';
import VaseModel from '../../../components/threeComponents/miniHompiModels/VaseModel';
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import BookModel from '../../../components/threeComponents/miniHompiModels/BookModel';
import Book3D from '../../../components/Book3d';
import ChairModel from '../../../components/threeComponents/miniHompiModels/ChairModel';
import CurtainModel from '../../../components/threeComponents/miniHompiModels/CurtainModel';
import { Physics } from '@react-three/cannon';
import FrameModel from '../../../components/threeComponents/miniHompiModels/FrameModels';
import Frame2Model from '../../../components/threeComponents/miniHompiModels/Frame2Model';
import TableModel from '../../../components/threeComponents/miniHompiModels/TableModel';
import SofaModel from '../../../components/threeComponents/miniHompiModels/SofaModel';
import Chair2Model from '../../../components/threeComponents/miniHompiModels/Chair2Model';
import TableLampModel from '../../../components/threeComponents/miniHompiModels/TableLampModel';
import TV2Model from '../../../components/threeComponents/miniHompiModels/Tv2Model';
import SiteMark from '../../../components/SiteMark';
import { useMutation, useQuery, useReactiveVar, useLazyQuery } from '@apollo/client';
import { applyMe } from '../../../stores/loggedUser';
import { useRouter } from 'next/router';
import PageTitle from '../../../components/common/PageTItle';
import gql from 'graphql-tag';
import { ThreeModelInput } from '../../../__generated__/globalTypes';
import { addModel, getModels, setModels } from '../../../stores/ThreeModels';



// gql`
// query articlesByCategory($id: String!) {
//   postsByCategory(id: $id) {
//     id
//   }
// }
// `

const GET_ROOMSTATUS = gql`
query getMiniHompi($id: Float!){
  getMiniHompi(input: {
    id: $id
  }) {
    ok
    error
    miniHompi{
      ownerId
      id
      scale
    }
  }
}
`




const GET_THREE_MODELS = gql`
query getThreeModels($id: Float!) {
  getThreeModels(input: {
    id: $id
  }) {
    ok
    error
    models{
      name
      id
      installed
      scale
      rotateY
      position
    }
  }
}
`

const SAVE_MODELS = gql`

mutation saveThreeModels($saveThreeModelInput: SaveThreeModelInput!) {
  saveThreeModels(input:$saveThreeModelInput) {
    ok
  }
}
`

// const JOIN = gql`
// mutation join($email: String!, $nickname: String!, $password: String!, $password2: String!) {
//   join(input:{email: $email, nickname: $nickname, password: $password, password2: $password2}) {
//     ok,
//     error
//   }
// }
// `



const MiniHomepage:NextPage = () => {

    const {me} = useReactiveVar(applyMe);
    const router = useRouter();
    const { id: roomId } = router.query


    const parsedRoomId = parseFloat(roomId)

    const [reqRoomInfo, {data: roomInfo, error: getRoomInfoErr}] = useLazyQuery(GET_ROOMSTATUS, {
      variables: {
        id: parsedRoomId
      }
    })

    const [reqModels, {data: modelsInfo, error: getModelsErr}] = useLazyQuery(GET_THREE_MODELS, {
      variables: {
        id: parsedRoomId
      }
    })

    const [reqSaveModels, {data, loading, error}] = useMutation(SAVE_MODELS, {
      context: {
        headers: {
            "Authorization":  "Bearer " + localStorage.getItem("jwt_token")
        }
    }
    })

    const [getMiniHompi, setGetMiniHompi] = useState()
    const [getThreeModels, setGetThreeModels] = useState()


    const [editBook, setEditBook] = useState(false); // 책 내용 수정 모드 진입 on / off

    // 방 크기 조절 state
    const [roomScale, setRoomScale] = useState(0.3);

    // 카페트1 관련 state
    const [installCarpet1, setInstallCarpet1] = useState(false);
    const [carpet1Scale, setCarpet1Scale] = useState(0.3);
    const [carpet1Focused, setCarpet1Focused] = useState(false);
    const [carpet1RotateY, setCarpet1RotateY] = useState("0")
    const [carpet1Position, setCarpet1Position] = useState({ x: 0, y: 0, z:0 });
    

    // 카페트2 관련 state
    const [installCarpet2, setInstallCarpet2] = useState(false);
    const [carpet2Scale, setCarpet2Scale] = useState(0.3);
    const [carpet2Focused, setCarpet2Focused] = useState(false);
    const [carpet2RotateY, setCarpet2RotateY] = useState("0")
    const [carpet2Position, setCarpet2Position] = useState({ x: 0, y: 0, z:0 });
    // tv 관련 state
    const [installTv, setInstallTv] = useState(false);
    const [tvScale, setTvScale] = useState(0.3);
    const [tvFocused, setTvFocused] = useState(false);
    const [tvRotateY, setTvRotateY] = useState("0")
    const [tvPosition, setTvPosition] = useState({ x: 0, y: 0, z:0 });
    // 스탠딩 램프 관련 state
    const [installStandingLamp, setInstallStandingLamp] = useState(false);
    const [standingLampScale, setStandingLampScale] = useState(0.3);
    const [standingLampFocused, setStandingLampFocused] = useState(false);
    const [standingLampRotateY, setStandingLampRotateY] = useState("0")
    const [standingLampPosition, setStandingLampPosition] = useState({ x: 0, y: 0, z:0 });
    // Vase 관련 state
    const [installVase, setInstallVase] = useState(false);
    const [vaseScale, setVaseScale] = useState(0.1);
    const [vaseFocused, setVaseFocused] = useState(false);
    const [vaseRotateY, setVaseRotateY] = useState("0")
    const [vasePosition, setVasePosition] = useState({ x: 0, y: 0, z:0 });
    // book_ani 관련 state
    const [installBook, setInstallBook] = useState(false);
    const [bookScale, setBookScale] = useState(0.3);
    const [bookFocused, setBookFocused] = useState(false);
    const [bookRotateY, setBookRotateY] = useState("0")
    const [bookPosition, setBookPosition] = useState({ x: 0, y: 0, z:0 });

    // 의자1 관련 state
    const [installChair, setInstallChair] = useState(false);
    const [chairScale, setChairScale] = useState(0.1);
    const [chairRotateY, setChairRotateY] = useState("0")
    const [chairFocused, setChairFocused] = useState(false);
    const [chairPosition, setChairPosition] = useState({ x: 0, y: 0, z:0 });

    // 커튼 관련 state
    const [installCurtain, setInstallCurtain] = useState(false);
    const [curtainScale, setCurtainScale] = useState(0.5);
    const [curtainRotateY, setCurtainRotateY] = useState("1")
    const [curtainFocused, setCurtainFocused] = useState(false);
    const [curtainPosition, setCurtainPosition] = useState({ x: 0, y: 0, z:0 });

    // 액자1 관련 state
    const [installFrame1, setInstallFrame1] = useState(false);
    const [frame1Scale, setFrame1Scale] = useState(1);
    const [frame1RotateY, setFrame1RotateY] = useState("0")
    const [frame1Focused, setFrame1Focused] = useState(false);
    const [framePosition, setFramePosition] = useState({ x: 0, y: 0, z:0 });

    // 액자2 관련 state
    const [installFrame2, setInstallFrame2] = useState(false);
    const [frame2Scale, setFrame2Scale] = useState(0.1);
    const [frame2RotateY, setFrame2RotateY] = useState("0")
    const [frame2Focused, setFrame2Focused] = useState(false);
    const [frame2Position, setFrame2Position] = useState({ x: 0, y: 0, z:0 });

    // 액자3 관련 state
    const [installFrame3, setInstallFrame3] = useState(false);
    const [frame3Scale, setFrame3Scale] = useState(1);
    const [frame3RotateY, setFrame3RotateY] = useState("0")
    const [frame3Focused, setFrame3Focused] = useState(false);
    const [frame3Position, setFrame3Position] = useState({ x: 0, y: 0, z:0 });

    // 테이블1 관련 state

    const [installTable1, setInstallTable1] = useState(false);
    const [table1Scale, setTable1Scale] = useState(0.05);
    const [table1RotateY, setTable1RotateY] = useState("0")
    const [table1Focused, setTable1Focused] = useState(false);
    const [table1Position, setTable1Position] = useState({ x: 0, y: 0, z:0 });

    // 테이블2 관련 state

    const [installTable2, setInstallTable2] = useState(false);
    const [table2Scale, setTable2Scale] = useState(1);
    const [table2RotateY, setTable2RotateY] = useState("0")
    const [table2Focused, setTable2Focused] = useState(false);
    const [table2Position, setTable2Position] = useState({ x: 0, y: 0, z:0 });

    // 테이블램프 관련 state

    const [installTableLamp, setInstallTableLamp] = useState(false);
    const [tableLampScale, setTableLampScale] = useState(0.1);
    const [tableLampRotateY, setTableLampRotateY] = useState("0")
    const [tableLampFocused, setTableLampFocused] = useState(false);
    const [tableLampPosition, setTableLampPosition] = useState({ x: 0, y: 0, z:0 });

    // 소파1 관련 state

    const [installSofa1, setInstallSofa1] = useState(false);
    const [sofa1Scale, setSofa1Scale] = useState(1);
    const [sofa1RotateY, setSofa1RotateY] = useState("0")
    const [sofa1Focused, setSofa1Focused] = useState(false);
    const [sofa1Position, setSofa1Position] = useState({ x: 0, y: 0, z:0 });

    // 소파2 관련 state

    const [installSofa2, setInstallSofa2] = useState(false);
    const [sofa2Scale, setSofa2Scale] = useState(1);
    const [sofa2RotateY, setSofa2RotateY] = useState("0")
    const [sofa2Focused, setSofa2Focused] = useState(false);
    const [sofa2Position, setSofa2Position] = useState({ x: 0, y: 0, z:0 });

    // 의자2 관련 state

    const [installChair2, setInstallChair2] = useState(false);
    const [chair2Scale, setChair2Scale] = useState(0.1);
    const [chair2RotateY, setChair2RotateY] = useState("0")
    const [chair2Focused, setChair2Focused] = useState(false);
    const [chair2Position, setChair2Position] = useState({ x: 0, y: 0, z:0 });

    // TV 2 관련 state
    const [installTV2, setInstallTV2] = useState(false);
    const [TV2Scale, setTV2Scale] = useState(10);
    const [TV2RotateY, setTV2RotateY] = useState("0")
    const [TV2Focused, setTV2Focused] = useState(false);
    const [TV2Position, setTV2Position] = useState({ x: 0, y: 0, z:0 });

    const applyInstallBtn = useRef();
    const [css3dBookVisible, setCss3dBookVisible] = useState(false);

    const initFocused = () => {
      setCarpet1Focused(false)
      setCarpet2Focused(false)
      setTvFocused(false)
      setStandingLampFocused(false)
      setVaseFocused(false)
      setBookFocused(false)
      setChairFocused(false)
      setCurtainFocused(false)
      setFrame1Focused(false)
      setFrame2Focused(false)
      setTable1Focused(false)
      setTableLampFocused(false)
      setSofa1Focused(false)
      setChair2Focused(false)
      setTV2Focused(false)
    }


    const getInfos = async() => {
      

      const {data: { getMiniHompi } } = await reqRoomInfo();

      const {data: { getThreeModels } } = await reqModels();

      console.log(getMiniHompi)
      console.log(getThreeModels)

      setGetMiniHompi(getMiniHompi)
      setGetThreeModels(getThreeModels)

      


      // const {installed, id, name, rotateY, scale, position} = getThreeModels.models.find(model => model.name === "carpet1") 

      //   setInstallCarpet1(installed)
      //   setCarpet1Scale(scale.x)
      //   setCarpet1RotateY(rotateY)
      //   setCarpet1Position(position)

        
        getThreeModels.models.forEach(({installed, id, name, rotateY, scale, position}) => {
          switch(name) {
            case "carpet1":
              setInstallCarpet1(installed)
              setCarpet1Scale(scale.x)
              setCarpet1RotateY(rotateY)
              setCarpet1Position(position)
              break;
            case "carpet2":
              setInstallCarpet2(installed)
              setCarpet2Scale(scale.x)
              setCarpet2RotateY(rotateY)
              setCarpet2Position(position)
              break;
            case "sofa":
              setInstallSofa1(installed)
              setSofa1Scale(scale.x)
              setSofa1RotateY(rotateY)
              setSofa1Position(position)
              break;
            case "chair":                          
              setInstallChair(installed)
              setChairScale(scale.x)
              setChairRotateY(rotateY)
              setChairPosition(position)
              break;
            case "chair2":                          
              setInstallChair2(installed)
              setChair2Scale(scale.x)
              setChair2RotateY(rotateY)
              setChair2Position(position)
              break;
            case "standingLamp":                          
              setInstallStandingLamp(installed)
              setStandingLampScale(scale.x)
              setStandingLampRotateY(rotateY)
              setStandingLampPosition(position)
              break;
            case "curtain":                          
              setInstallCurtain(installed)
              setCurtainScale(scale.x)
              setCurtainRotateY(rotateY)
              setCurtainPosition(position)
              break;
            case "tv2":                          
              setInstallTV2(installed)
              setTV2Scale(scale.x)
              setTV2RotateY(rotateY)
              setTV2Position(position)
              break;
            case "table":                          
              setInstallTable1(installed)
              setTable1Scale(scale.x)
              setTable1RotateY(rotateY)
              setTable1Position(position)
              break;
            case "tv":                          
              setInstallTv(installed)
              setTvScale(scale.x)
              setTvRotateY(rotateY)
              setTvPosition(position)
              break;
            case "vase":                          
              setInstallVase(installed)
              setVaseScale(scale.x)
              setVaseRotateY(rotateY)
              setVasePosition(position)
              break;
            case "book":                          
              setInstallBook(installed)
              setBookScale(scale.x)
              setBookRotateY(rotateY)
              setBookPosition(position)
              break;
            case "tableLamp":
              setInstallTableLamp(installed)
              setTableLampScale(scale.x)
              setTableLampRotateY(rotateY)
              setTableLampPosition(position)
              break;
            case "frame":
              setInstallFrame1(installed)
              setFrame1Scale(scale.x)
              setFrame1RotateY(rotateY)
              setFramePosition(position)
              break;
            case "frame2":
              setInstallFrame2(installed)
              setFrame2Scale(scale.x)
              setFrame2RotateY(rotateY)
              setFrame2Position(position)
              break;
            case "room":
              setRoomScale(scale.x)
              break;
          }
        })

      
    }

    useEffect(() => {

      getInfos()
      console.log(me)
    }, [])

    const handleLeave = () => {
      router.push("/lobby")
    }

    return(
        <section className="w-screen h-screen overflow-hidden">
          <SiteMark title={`${me ? me.nickname : null}'s Room`} bgColor={"bg-green-400"} />
          
          <div className="z-10 absolute">

              <ModelSettingBox 
                modelName={"방"} 
                scaleState={roomScale}
                setScaleState={setRoomScale}
                
                backgroundColor="green"
              />         

              {/* CSS 3D 메모장*/}
              <Book3D 
              visible={css3dBookVisible} setVisible={setCss3dBookVisible} 
              front={
                <section className="w-full h-full bg-blue-300 text-black">
                  <button value="수정" onClick={() => setEditBook(!editBook)} >책 수정하기</button>
                  <form className="w-full h-full flex flex-col justify-around">
                    
                    <h2>책 제목</h2>
                    {editBook ? <input type="text" name="bookTitle" placeholder="책 제목 입력"  /> : null}
                    <cite>작가명</cite>
                    
                    <p>소개글</p>
                    {editBook ? <input type="text" name="bookIntro" placeholder="책 소개글 입력" /> : null}
                    {editBook ? <input 
                    onClick={(e) => {e.target.style.height="100%"; e.target.style.width="100%"; e.target.style.position="absolute"}} 
                    onMouseLeave={(e) => {e.target.style.height="10%"; e.target.style.width="100%"; e.target.style.position="block" }}
                    type="text" 
                    name="bookContent"
                     placeholder="책 내용 입력" /> : null}
                    {editBook ? <>
                    <label htmlFor={"bookImg"}>책 표지 등록</label>
                    <input type="file" name="bookImg" /> 
                    </> : null}
                    {editBook ? <input type="submit" value="등록" />  : null }
                  </form>
                </section>
              }
              
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
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={-50}
                shadow-camera-bottom={10}
            />
              <Suspense fallback={null}>
              <EffectComposer>
              <Physics gravity= {[0, -1000, 0]} >
                  <RoomModel roomScale={roomScale}  />
                  <Carpet1Model rotateY={carpet1RotateY} installed={installCarpet1} scale={carpet1Scale} isFocused={carpet1Focused} position={carpet1Position} setPosition={setCarpet1Position}  />
                  <Carpet2Model position={carpet2Position} setPosition={setCarpet2Position} rotateY={carpet2RotateY} installed={installCarpet2} scale={carpet2Scale} isFocused={carpet2Focused}  />
                  <TvModel position={tvPosition} setPosition={setTvPosition} installed={installTv} scale={tvScale} rotateY={tvRotateY} isFocused={tvFocused}  />
                  <StandingLampModel position={standingLampPosition} setPosition={setStandingLampPosition} installed={installStandingLamp} rotateY={standingLampRotateY} scale={standingLampScale}  isFocused={standingLampFocused} />
                  <VaseModel position={vasePosition} setPosition={setVasePosition} installed={installVase} scale={vaseScale} rotateY={vaseRotateY} isFocused={vaseFocused}  />
                  <ChairModel position={chairPosition} setPosition={setChairPosition} installed={installChair} scale={chairScale} rotateY={chairRotateY} isFocused={chairFocused}  />
                  <CurtainModel position={curtainPosition} setPosition={setCurtainPosition} installed={installCurtain} scale={curtainScale} rotateY={curtainRotateY} isFocused={curtainFocused}  />
                  <BookModel  setCss3dBookVisible={setCss3dBookVisible} rotateY={bookRotateY} installed={installBook} position={bookPosition} setPosition={setBookPosition} scale={bookScale}  isFocused={bookFocused} />
                  <FrameModel position={framePosition} setPosition={setFramePosition}  installed={installFrame1} scale={frame1Scale} rotateY={frame1RotateY} isFocused={frame1Focused}  
                  imageUrl={"https://media.istockphoto.com/photos/metaverse-concept-metaverse-text-sitting-over-blue-technological-picture-id1352111641?b=1&k=20&m=1352111641&s=170667a&w=0&h=OcbdDklzABPmIV5H8gNUnpiO7QI7dulB3VkvjR4f00g="} />
                  <Frame2Model position={frame2Position} setPosition={setFrame2Position} installed={installFrame2} scale={frame2Scale} rotateY={frame2RotateY} isFocused={frame2Focused}  
                  imageUrl={"https://media.istockphoto.com/photos/metaverse-concept-metaverse-text-sitting-over-blue-technological-picture-id1352111641?b=1&k=20&m=1352111641&s=170667a&w=0&h=OcbdDklzABPmIV5H8gNUnpiO7QI7dulB3VkvjR4f00g="} />
                  <TableModel position={table1Position} setPosition={setTable1Position} installed={installTable1} scale={table1Scale} rotateY={table1RotateY} isFocused={table1Focused}  />
                  <SofaModel position={sofa1Position} setPosition={setSofa1Position} installed={installSofa1} scale={sofa1Scale} rotateY={sofa1RotateY} isFocused={sofa1Focused}  />
                  <Chair2Model position={chair2Position} setPosition={setChair2Position} installed={installChair2} scale={chair2Scale} rotateY={chair2RotateY} isFocused={chair2Focused}  />
                  <TableLampModel position={tableLampPosition} setPosition={setTableLampPosition} installed={installTableLamp} scale={tableLampScale} rotateY={tableLampRotateY} isFocused={tableLampFocused}  />
                  <TV2Model position={TV2Position} setPosition={setTV2Position} installed={installTV2} scale={TV2Scale} rotateY={TV2RotateY} isFocused={TV2Focused}  />

              </Physics>
              </EffectComposer>
              </Suspense>

         
          </Canvas>,

          <BottomUI 
            chatContents={["Asdasd"]}
            
            />

          <button ref={applyInstallBtn} className="z-10 absolute bottom-2 right-2 text-lg bg-green-300" value="설치 적용" 
          onClick={async () => {
            
    
            
            initFocused()
            // applyInstallBtn.current.style.display = "none"
            
       
            console.log(getModels())
            await reqSaveModels({

              variables: {

              saveThreeModelInput: {

                models: getModels()

              } 
           
              
            },

            
            
          })
       
          
        
            console.log(data)
            console.log(error)
        

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
                initFocused={initFocused}
                modelImgUrl="/model_images/carpet1.png"
                maxScale={0.7}
                minScale={0.3}
                scaleStep={0.04}

                
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
                initFocused={initFocused}
                modelImgUrl="/model_images/carpet2.png"
                
                maxScale={0.2}
                minScale={0.14}
                scaleStep={0.005}
                
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
                  initFocused={initFocused}
                  backgroundColor="red"
                  modelImgUrl="/model_images/standing_lamp.png"
                  maxScale={0.4}
                  minScale={0.2}
                  scaleStep={0.05}

                />     
                                <ModelSettingBox 
                  modelName={"테이블 램프"} 
                  
                  
                  installState={installTableLamp}
                  setInstallState={setInstallTableLamp}
                  scaleState={tableLampScale}
                  setScaleState={setTableLampScale}
                  rotateYState={tableLampRotateY}
                  setRotateYState={setTableLampRotateY}
                  focusState={tableLampFocused}
                  setFocusState={setTableLampFocused}
                  initFocused={initFocused}
                  backgroundColor="red"
                  modelImgUrl="/model_images/standing_lamp.png"
                  maxScale={0.2}
                  minScale={0.1}
                  scaleStep={0.01}

                />        
              </>
            }

            electronics={
              <>
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
                initFocused={initFocused}
                modelImgUrl="/model_images/tv.png"


                backgroundColor="purple"

            />       
              <ModelSettingBox 
                modelName={"TV2"} 
                installState={installTV2}
                setInstallState={setInstallTV2}
                scaleState={TV2Scale}
                setScaleState={setTV2Scale}
                rotateYState={TV2RotateY}
                setRotateYState={setTV2RotateY}
                focusState={TV2Focused}
                setFocusState={setTV2Focused}
                initFocused={initFocused}
                modelImgUrl="/model_images/tv.png"
                minScale={5}
                maxScale={12}
                scaleStep={0.1}
                backgroundColor="purple"

            />  
            </>
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
                initFocused={initFocused}
                modelImgUrl="/model_images/vase.png"
                maxScale={0.2}
                minScale={0.05}
                scaleStep={0.01}

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
              initFocused={initFocused}
              modelImgUrl="/model_images/curtain.png"
              />
          
          </>
            }

            writes={
              <>
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
                initFocused={initFocused}

                backgroundColor="black"
                modelImgUrl="/model_images/book_ani.png"
                maxScale={0.5}
                minScale={0.1}
                scaleStep={0.05}

            />   

            <ModelSettingBox 
            modelName={"액자1"} 
            installState={installFrame1}
            setInstallState={setInstallFrame1}
            scaleState={frame1Scale}
            setScaleState={setFrame1Scale}
            rotateYState={frame1RotateY}
            setRotateYState={setFrame1RotateY}
            focusState={frame1Focused}
            setFocusState={setFrame1Focused}
            initFocused={initFocused}

            backgroundColor="black"
            modelImgUrl="/model_images/frame1.png"
            maxScale={2.5}
            minScale={0.8}
            scaleStep={0.1}

        />   

          <ModelSettingBox 
            modelName={"액자2"} 
            installState={installFrame2}
            setInstallState={setInstallFrame2}
            scaleState={frame2Scale}
            setScaleState={setFrame2Scale}
            rotateYState={frame2RotateY}
            setRotateYState={setFrame2RotateY}
            focusState={frame2Focused}
            setFocusState={setFrame2Focused}
            initFocused={initFocused}
            maxScale={0.2}
            minScale={0.05}
            scaleStep={0.01}
            backgroundColor="black"
            modelImgUrl="/model_images/frame1.png"


        />   
        </>
            }
            
            furnitures = {
              <>
              <ModelSettingBox 
              modelName={"의자1"} 
              installState={installChair}
              setInstallState={setInstallChair}
              scaleState={chairScale}
              setScaleState={setChairScale}
              rotateYState={chairRotateY}
              setRotateYState={setChairRotateY}
              focusState={chairFocused}
              setFocusState={setChairFocused}
              initFocused={initFocused}
              modelImgUrl="/model_images/chair1.png"
              backgroundColor="blue"
              maxScale={0.1}
              minScale={0.05}
              scaleStep={0.005}

          />   
            <ModelSettingBox 
              modelName={"의자2"} 
              installState={installChair2}
              setInstallState={setInstallChair2}
              scaleState={chair2Scale}
              setScaleState={setChair2Scale}
              rotateYState={chair2RotateY}
              setRotateYState={setChair2RotateY}
              focusState={chair2Focused}
              setFocusState={setChair2Focused}
              initFocused={initFocused}
              modelImgUrl="/model_images/chair1.png"
              backgroundColor="blue"
              maxScale={0.1}
              minScale={0.05}
              scaleStep={0.005}
          />   

            <ModelSettingBox 
              modelName={"소파1"} 
              installState={installSofa1}
              setInstallState={setInstallSofa1}
              scaleState={sofa1Scale}
              setScaleState={setSofa1Scale}
              rotateYState={sofa1RotateY}
              setRotateYState={setSofa1RotateY}
              focusState={sofa1Focused}
              setFocusState={setSofa1Focused}
              initFocused={initFocused}
              modelImgUrl="/model_images/chair1.png"
              backgroundColor="blue"
              maxScale={6}
              minScale={4}
              scaleStep={0.1}

          />   

            <ModelSettingBox 
              modelName={"테이블1"} 
              installState={installTable1}
              setInstallState={setInstallTable1}
              scaleState={table1Scale}
              setScaleState={setTable1Scale}
              rotateYState={table1RotateY}
              setRotateYState={setTable1RotateY}
              focusState={table1Focused}
              setFocusState={setTable1Focused}
              initFocused={initFocused}
              modelImgUrl="/model_images/chair1.png"
              backgroundColor="blue"
              maxScale={0.1}
              minScale={0.04}
              scaleStep={0.005}
          />   
          </>
            }

            />
        </section>
    )

}

export default MiniHomepage;