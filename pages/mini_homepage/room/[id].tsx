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
import { Physics, useBox, usePlane } from '@react-three/cannon';
import FrameModel from '../../../components/threeComponents/miniHompiModels/FrameModels';
import Frame2Model from '../../../components/threeComponents/miniHompiModels/Frame2Model';
import TableModel from '../../../components/threeComponents/miniHompiModels/TableModel';
import SofaModel from '../../../components/threeComponents/miniHompiModels/SofaModel';
import Chair2Model from '../../../components/threeComponents/miniHompiModels/Chair2Model';
import TableLampModel from '../../../components/threeComponents/miniHompiModels/TableLampModel';
import TV2Model from '../../../components/threeComponents/miniHompiModels/Tv2Model';
import SiteMark from '../../../components/common/SiteMark';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { useReactiveVar } from '@apollo/react-hooks';
import { applyMe, setMe } from '../../../stores/loggedUser';
import { useRouter } from 'next/router';

import { addModel, getModels, setModels } from '../../../stores/ThreeModels';
import { applyThreeModels, setAllModelsStatus } from '../../../stores/setAllThreeModels';
import { ThreeModelOpts, modelNameTypes } from '../../../types/threeModelTypes';

import { AllModelsStatus, AllModelsStatus as defaultModelList } from "../../../data/modelList";
import { GET_ROOMSTATUS, GET_THREE_MODELS, SAVE_MODELS } from '../../../apis/gql-queries/miniHompi';
import EnrollFileToModelScreen from '../../../components/EnrollFileToModelScreen';
import Chair3Model from '../../../components/threeComponents/miniHompiModels/Chair3Model';
import Table2Model from '../../../components/threeComponents/miniHompiModels/Table2Model';
import Table3Model from '../../../components/threeComponents/miniHompiModels/Table3Model';
import Bed1Model from '../../../components/threeComponents/miniHompiModels/Bed1Model';
import Bed2Model from '../../../components/threeComponents/miniHompiModels/Bed2Model';
import Bed3Model from '../../../components/threeComponents/miniHompiModels/Bed3Model';
import Carpet3Model from '../../../components/threeComponents/miniHompiModels/Carpet3Model';
import Clock1Model from '../../../components/threeComponents/miniHompiModels/Clock1Model';
import Clock2Model from '../../../components/threeComponents/miniHompiModels/Clock2Model';
import Refrigerator1Model from '../../../components/threeComponents/miniHompiModels/Refrigerator1Model';
import Refrigerator2Model from '../../../components/threeComponents/miniHompiModels/Refrigerator2Model';
import Closet1Model from '../../../components/threeComponents/miniHompiModels/Closet1Model';
import TextBoardModel from '../../../components/threeComponents/miniHompiModels/TextBoardModel';
import Vase2Model from '../../../components/threeComponents/miniHompiModels/Vase2Model';
import useWebsocket from '../../../hooks/useWebsocket';
import useGetMe from '../../../hooks/useGetMe';
import ThreeLoader from '../../../components/common/threeLoader';
import { Loader } from '@react-three/drei';






const MiniHomepage: NextPage = (props) => {


  // carpet1, carpet2, tv, tv2, standingLamp, tableLamp, vase, book, frame1, frame2, chair, chair2, table1, sofa
  const allModelsStatus = useReactiveVar(applyThreeModels);
  const [rerender, setRerender] = useState(0)

  const router = useRouter();
  const { id: roomId } = router.query
  const [isMyRoom, setIsMyRoom] = useState(false);
  const [showUpdateUrlUI, setShowUpdateUrlUI] = useState(false);
  const [getMiniHompi, setGetMiniHompi] = useState()
  const [getThreeModels, setGetThreeModels] = useState()
  const [jwtToken, setJwtToken] = useState()
  const [reqGetMe, getMeLoading] = useGetMe()
  const [nickname, setNickname] = useState<string>();
  const [userId, setUserId] = useState<number | string | null>();
  const [socketIoClient] = useWebsocket();



  const [editBook, setEditBook] = useState(false); // 책 내용 수정 모드 진입 on / off

  // 방 크기 조절 state
  const [roomScale, setRoomScale] = useState(0.7);

  // 카페트1 관련 state
  const [carpet1Num, setCarpet1Num] = useState(1);


  const parsedRoomId = parseFloat(roomId)

  const [reqRoomInfo, { data: roomInfo, error: getRoomInfoErr }] = useLazyQuery(GET_ROOMSTATUS, {
    variables: {
      id: parsedRoomId
    }
  })

  const [reqModels, { data: modelsInfo, error: getModelsErr }] = useLazyQuery(GET_THREE_MODELS, {
    variables: {
      id: parsedRoomId
    }
  })

  const [reqSaveModels, { data, saveLoading, error }] = useMutation(SAVE_MODELS, {
    context: {
      headers: {
        "Authorization": "Bearer " + jwtToken
      }
    }
  })

  const applyInstallBtn = useRef();
  const [css3dBookVisible, setCss3dBookVisible] = useState(false);

  // 현재 모델 포커싱 초기화
  const initFocused = () => {

    // 모든 3d 모델 불러오기
    Object.values(modelNameTypes).forEach(modelName => {

      const modelsStatus = allModelsStatus[modelName];


      // 같은 모델 클론 포커싱 상태도 지워주기
      modelsStatus.map((status, index) => {
        setAllModelsStatus({
          modelName,
          index,
          status: { ...status, isFocused: false }
        })
      })

    })



  }



  // 서버에 요청 후 데이터 불러오기 & 배치
  const getInfos = async () => {

    const { data: { getMiniHompi } } = await reqRoomInfo();

    const { data: { getThreeModels } } = await reqModels();

    // 회원일 시
    const data = await reqGetMe();
    if (data.data) {
      const user = data.data.getMe.user;
      setNickname(user.nickname);
      setUserId(user.id);
      setMe({ id: user.id, nickname: user.nickname })

      if (user.id === getMiniHompi.miniHompi.ownerId) {
        setIsMyRoom(true)
      }
      else {
        setIsMyRoom(false)
      }

    }
    // 비회원일 시
    else {
      const customerId = Math.random();
      setNickname("손님 - " + customerId);
      setUserId(customerId)
      setMe({ id: customerId, nickname: "손님 - " + customerId })
    }




    console.log(getMiniHompi)
    setGetMiniHompi(getMiniHompi)
    setGetThreeModels(getThreeModels)

    if (getThreeModels.models.length === 0) {

      applyThreeModels(defaultModelList)
    }

    // 방 입장 시 저장된 3D 모델 로드 & 배치하기
    getThreeModels.models.forEach(({ installed, name: modelName, rotateY, scale, position, index, imageUrl, videoUrl, textContents }: {
      name: modelNameTypes;
      installed: boolean;
      scale: { x: string, y: string, z: string };
      rotateY: string;
      isFocused: boolean;
      position: { x: number, y: number, z: number },
      videoUrl?: string;
      imageUrl?: string;
      textContents?: string;
      index?: number;
    }) => {

      // 저장된 방 크기 불러오기
      if (modelName === modelNameTypes.room) {
        setRoomScale(0.7)
      }



      // 디폴트 상태의 모델 상태 가져오기
      const modelsStatus = allModelsStatus[modelName];


      if (modelsStatus)
        modelsStatus.forEach(status => {
          setAllModelsStatus({
            modelName,
            index: index ? index : 0,
            status: { installed, scale: parseFloat(scale.x), rotateY, position, isFocused: false, imageUrl, videoUrl }
          })
        })


    })

    setRerender(value => value + 1)

  }


  useEffect(() => {
    setJwtToken(localStorage.getItem("jwt_token"))
    getInfos()
    setIsMyRoom(isMyRoom)

  }, [])

  const handleLeave = () => {
    router.push("/lobby")
  }

  return (
    <section className="w-screen h-screen overflow-hidden">
      <SiteMark title={`${router.query.ownerName ? router.query.ownerName + "'s Room" : "Room"}`} bgColor={"bg-green-400"} />
      <div className="z-10 absolute">

        {/* {isMyRoom ? <RoomController 
                roomScale={roomScale}
                setRoomScale={setRoomScale}
                
                
              /> : null} */}

        {/* CSS 3D 메모장*/}
        <Book3D
          visible={css3dBookVisible} setVisible={setCss3dBookVisible}
          front={
            <section className="w-full h-full bg-green-300 text-black text-xl">

            </section>
          }

        />

        {/* 액자, tv 등의 모델에 이미지, 영상등을 등록하기 위한 UI */}
        <EnrollFileToModelScreen show={showUpdateUrlUI} setRerender={setRerender} rerender={rerender} initFocused={initFocused} />

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

            <Physics gravity={[0, -10, 0]} >
              {/* <ObstacleBox position={[0,-0.3,0]} args= {[100, 0.1, 100]} isGround={true} /> */}
              {/* <CharacterModel 
              rotation={[Math.PI / 2,0,0]} 
              scale={[0.1,0.1,0.1]} 
              position={[0,10,0]}
              />   */}
              <RoomModel roomScale={roomScale} />
              <FrameModel isMyRoom={isMyRoom} rerender={rerender} setRerender={setRerender} initFocused={initFocused} />
              <Carpet1Model rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <Carpet2Model rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <Carpet3Model rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <TvModel rerender={rerender} setRerender={setRerender} />
              <StandingLampModel rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <VaseModel rerender={rerender} setRerender={setRerender} />
              <ChairModel rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <CurtainModel rerender={rerender} setRerender={setRerender} />
              <BookModel rerender={rerender} setRerender={setRerender} setCss3dBookVisible={setCss3dBookVisible} />
              <Frame2Model rerender={rerender} setRerender={setRerender} />
              <TableModel rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <Table2Model rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <Table3Model rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <SofaModel rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <Chair2Model rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <Chair3Model rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <Bed1Model rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <Bed2Model rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <Bed3Model rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <Clock1Model rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <Clock2Model rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <Closet1Model rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <Refrigerator1Model rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <Refrigerator2Model rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <TextBoardModel rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />
              <Vase2Model rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />


              <TableLampModel rerender={rerender} setRerender={setRerender} isMyRoom={isMyRoom} initFocused={initFocused} />

              <TV2Model rerender={rerender} setRerender={setRerender} initFocused={initFocused} isMyRoom={isMyRoom} />

            </Physics>
          </EffectComposer>
        </Suspense>

      </Canvas>,
        <Loader />
      
      <BottomUI
        nickname={nickname}
        wsClient={socketIoClient}
      />

      {isMyRoom ? <button ref={applyInstallBtn}
        className="
          bg-black rounded-lg text-white hover:bg-blue-500 w-20 h-10 border-double border-4 font-bold z-30 absolute right-1 top-1"
        value="저장"
        onClick={async () => {
          initFocused()
          console.log(getModels())

          const result = await reqSaveModels({
            variables: {
              saveThreeModelInput: {
                models: getModels()
              }
            },
          })
          console.log(data)
          console.log(error)
          console.log(result)
          alert("방 상태가 저장되었습니다.")
        }
        }>
        저장
      </button> : null}

      {isMyRoom ? <ModelInstallPop

        carpets={
          <>
            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.carpet1}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/carpet_1.png"
              maxScale={0.2}
              minScale={0.05}
              scaleStep={0.01}
              setInstallNum={setCarpet1Num}
              backgroundColor="emerald"
            />


            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.carpet2}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/carpet_2.png"


              maxScale={0.2}
              minScale={0.1}
              scaleStep={0.005}

              backgroundColor="yellow"
            />

            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.carpet3}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/carpet_3.png"


              maxScale={0.2}
              minScale={0.1}
              scaleStep={0.005}

              backgroundColor="yellow"
            />
          </>
        }

        lights={
          <>
            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.standingLamp}
              rerender={rerender}
              setRerender={setRerender}


              initFocused={initFocused}
              backgroundColor="yellow"
              modelImgUrl="/model_images/standing_lamp.png"
              maxScale={0.4}
              minScale={0.2}
              scaleStep={0.05}

            />
            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.tableLamp}
              rerender={rerender}
              setRerender={setRerender}

              initFocused={initFocused}
              backgroundColor="yellow"
              modelImgUrl="/model_images/standing_lamp_2.png"
              maxScale={0.2}
              minScale={0.1}
              scaleStep={0.01}

            />
          </>
        }

        electronics={
          <>

            <ModelSettingBox

              modelName={modelNameTypes.tv2}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/tv_2.png"
              minScale={5}
              maxScale={15}
              scaleStep={0.2}
              backgroundColor="purple"
              setShowUpdateUrlUI={setShowUpdateUrlUI}

            />

            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.refrigerator_1}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/refrigerator_1.png"
              minScale={1}
              maxScale={2}
              scaleStep={0.2}
              backgroundColor="purple"

            />

            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.refrigerator_2}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/refrigerator_2.png"
              minScale={2}
              maxScale={4}
              scaleStep={0.2}
              backgroundColor="purple"

            />
          </>
        }

        beauties={
          <>
            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.vase}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/vase_1.png"
              maxScale={0.2}
              minScale={0.1}
              scaleStep={0.01}

              backgroundColor="green"

            />

            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.vase_2}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/vase_2.png"
              maxScale={2}
              minScale={1}
              scaleStep={0.05}

              backgroundColor="green"

            />

            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.clock_1}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/clock_1.png"
              maxScale={1}
              minScale={0.3}
              scaleStep={0.05}

              backgroundColor="green"

            />

            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.clock_2}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/clock_2.png"
              maxScale={2.5}
              minScale={1}
              scaleStep={0.1}

              backgroundColor="green"

            />

            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.curtain}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/curtain.png"
            />

          </>
        }

        writes={
          <>
            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.book}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}

              backgroundColor="black"
              modelImgUrl="/model_images/book_ani.png"
              maxScale={0.5}
              minScale={0.1}
              scaleStep={0.05}

            />

            <ModelSettingBox

              modelName={modelNameTypes.frame1}
              rerender={rerender}
              setRerender={setRerender}
              backgroundColor="black"
              modelImgUrl="/model_images/frame1.png"
              maxScale={4}
              minScale={2}
              scaleStep={0.1}
              initFocused={initFocused}
              setShowUpdateUrlUI={setShowUpdateUrlUI}

            />

            {/* <ModelSettingBox
          setShowUpdateUrlUI={setShowUpdateUrlUI}
         
        modelName={modelNameTypes.frame2} 
        rerender={rerender}
        setRerender={setRerender}
        initFocused={initFocused}
        maxScale={0.2}
        minScale={0.05}
        scaleStep={0.01}
        backgroundColor="black"
        modelImgUrl="/model_images/frame1.png"


    />    */}

            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.text_board}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              maxScale={1}
              minScale={0.5}
              scaleStep={0.05}
              backgroundColor="black"
              modelImgUrl="/model_images/text_board.png"


            />
          </>
        }

        furnitures={
          <>
            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.chair}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/chair_1.png"
              backgroundColor="blue"
              maxScale={0.1}
              minScale={0.05}
              scaleStep={0.005}

            />
            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.chair2}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/chair_2.png"
              backgroundColor="blue"
              maxScale={6}
              minScale={4}
              scaleStep={0.1}
            />
            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.chair3}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/chair_3.png"
              backgroundColor="blue"
              maxScale={7}
              minScale={4}
              scaleStep={0.1}
            />

            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.sofa}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/sofa_1.png"
              backgroundColor="blue"
              maxScale={6}
              minScale={4}
              scaleStep={0.1}

            />

            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.table1}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/table_1.png"
              backgroundColor="blue"
              maxScale={0.1}
              minScale={0.04}
              scaleStep={0.005}
            />

            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.table2}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/table_2.png"
              backgroundColor="blue"
              maxScale={0.2}
              minScale={0.05}
              scaleStep={0.005}
            />
            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.table3}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/table_3.png"
              backgroundColor="blue"
              maxScale={1}
              minScale={0.5}
              scaleStep={0.1}
            />
            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.bed_1}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/bed_1.png"
              backgroundColor="blue"
              maxScale={0.1}
              minScale={0.05}
              scaleStep={0.01}
            />
            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.bed_2}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/bed_2.png"
              backgroundColor="blue"
              maxScale={0.1}
              minScale={0.05}
              scaleStep={0.01}
            />
            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.bed_3}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/bed_3.png"
              backgroundColor="blue"
              maxScale={0.1}
              minScale={0.05}
              scaleStep={0.01}
            />

            <ModelSettingBox
              setShowUpdateUrlUI={setShowUpdateUrlUI}

              modelName={modelNameTypes.closet_1}
              rerender={rerender}
              setRerender={setRerender}
              initFocused={initFocused}
              modelImgUrl="/model_images/closet_1.png"
              backgroundColor="blue"
              maxScale={0.5}
              minScale={0.2}
              scaleStep={0.05}
            />
          </>
        }

      /> : null}
    </section>
  )

}

export default MiniHomepage;