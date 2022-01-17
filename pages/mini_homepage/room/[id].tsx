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
import { applyMe } from '../../../stores/loggedUser';
import { useRouter } from 'next/router';

import { addModel, getModels, setModels } from '../../../stores/ThreeModels';
import { applyThreeModels, setAllModelsStatus } from '../../../stores/setAllThreeModels';
import { ThreeModelOpts, modelNameTypes } from '../../../types/threeModelTypes';

import { AllModelsStatus as defaultModelList } from "../../../data/modelList";
import { GET_ROOMSTATUS, GET_THREE_MODELS, SAVE_MODELS } from '../../../apis/gql-queries/miniHompi';
import EnrollFileToModelScreen from '../../../components/EnrollFileToModelScreen';






const MiniHomepage:NextPage = (props) => {
    
    const {me} = useReactiveVar(applyMe);
    
    // carpet1, carpet2, tv, tv2, standingLamp, tableLamp, vase, book, frame1, frame2, chair, chair2, table1, sofa
    const allModelsStatus = useReactiveVar(applyThreeModels);
    const [rerender, setRerender] = useState(0)

    const router = useRouter();
    const { id: roomId, owner } = router.query
    const [isMyRoom, setIsMyRoom] = useState(false);
    const [showUpdateUrlUI, setShowUpdateUrlUI] = useState(false);
    const [getMiniHompi, setGetMiniHompi] = useState()
    const [getThreeModels, setGetThreeModels] = useState()


    const [editBook, setEditBook] = useState(false); // 책 내용 수정 모드 진입 on / off

    // 방 크기 조절 state
    const [roomScale, setRoomScale] = useState(0.4);

    // 카페트1 관련 state
    const [carpet1Num, setCarpet1Num] = useState(1);
    

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
            status: {...status, isFocused: false}
          })
        })

      })


     
    }


    // 서버에 요청 후 데이터 불러오기 & 배치
    const getInfos = async() => {
      

      const {data: { getMiniHompi } } = await reqRoomInfo();

      const {data: { getThreeModels } } = await reqModels();
      
      console.log(getMiniHompi)
      
      
      console.log(me)
      
      if(me.id === getMiniHompi.miniHompi.ownerId) {
        setIsMyRoom(true)
      }
      else {
        setIsMyRoom(false)
      }
      
      setGetMiniHompi(getMiniHompi)
      setGetThreeModels(getThreeModels)
      
      if(getThreeModels.models.length === 0) {
        alert("Dasf")
        applyThreeModels(defaultModelList)
      }
      
      // 방 입장 시 저장된 3D 모델 로드 & 배치하기
      getThreeModels.models.forEach(({installed, name: modelName, rotateY, scale, position, index, imageUrl, videoUrl, textContents}: {
          name: modelNameTypes;
          installed: boolean;
          scale: { x: string, y: string, z:string };
          rotateY: string;
          isFocused: boolean;
          position: { x: number, y: number, z:number },
          videoUrl?: string;
          imageUrl?: string;
          textContents?: string;
          index?: number;
        }) => {
          
          // 저장된 방 크기 불러오기
          if(modelName === modelNameTypes.room) {
            setRoomScale(0.4)
          }
          

          
          // 디폴트 상태의 모델 상태 가져오기
          const modelsStatus = allModelsStatus[modelName];
          
          
          if(modelsStatus)
          modelsStatus.forEach(status => {
            setAllModelsStatus({
              modelName,
            index: index ? index : 0,
            status: {installed, scale: parseFloat(scale.x), rotateY, position, isFocused: false, imageUrl, videoUrl}
          })
        })
        
        
      })
    
        setRerender(value => value +1)
      
    }

    function ObstacleBox(props) {
      const [ref, api] = useBox(() => ({ rotation: [0, 0, 0], ...props, onCollide: () => {
        
      }  }))
      
      if(props.isGround === true){
        return (
            <mesh ref={ref} name={"ground1"} visible={true} >
              <boxGeometry args={props.args}  />
              <meshStandardMaterial color="orange"  />
            </mesh>

        )
      }
      else if(props.isStair === true) {
        return (
          <mesh ref={ref} name={"stair"} visible={true}   >
            <boxGeometry args={props.args}  />
            <meshStandardMaterial color="orange"  />
          </mesh>

      )
      }
      else {
        return (
        <mesh ref={ref} visible={true}   >
        <boxGeometry args={props.args}  />
        <meshStandardMaterial color="orange"  />
      </mesh>
        )
      }
    }

    useEffect(() => {
      
      getInfos()
      setIsMyRoom(isMyRoom)
      
    }, [applyThreeModels()])

    const handleLeave = () => {
      router.push("/lobby")
    }

    return(
        <section className="w-screen h-screen overflow-hidden">
          <SiteMark title={`${owner ? owner + "'s Room" : "Room"}`} bgColor={"bg-green-400"} />
          
          <div className="z-10 absolute">

              {/* {isMyRoom ? <RoomController 
                roomScale={roomScale}
                setRoomScale={setRoomScale}
                
                
              /> : null} */}

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
          
          {/* 액자, tv 등의 모델에 이미지, 영상등을 등록하기 위한 UI */}
          <EnrollFileToModelScreen show={showUpdateUrlUI} setRerender={setRerender} rerender={rerender} />
              
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
              
              <Physics gravity= {[0, -10, 0]} >
              {/* <ObstacleBox position={[0,-0.3,0]} args= {[100, 0.1, 100]} isGround={true} /> */}
              {/* <CharacterModel 
              rotation={[Math.PI / 2,0,0]} 
              scale={[0.1,0.1,0.1]} 
              position={[0,10,0]}
              />   */}
                  <RoomModel roomScale={roomScale}  />
                  <FrameModel isMyRoom={isMyRoom} rerender={rerender} setRerender={setRerender} initFocused={initFocused} showUpdateUrlUI={showUpdateUrlUI} setShowUpdateUrlUI={setShowUpdateUrlUI} />
                  {/* <Carpet1Model modelStatus={allModelsStatus.carpet1} threeModels={getThreeModels} installNum={carpet1Num} setInstallNum={setCarpet1Num}   /> */}
                  <Carpet2Model rerender={rerender} setRerender={setRerender} />
                  <TvModel rerender={rerender} setRerender={setRerender} />
                  <StandingLampModel rerender={rerender} setRerender={setRerender} />
                  <VaseModel rerender={rerender} setRerender={setRerender} />
                  <ChairModel rerender={rerender} setRerender={setRerender} />
                  <CurtainModel rerender={rerender} setRerender={setRerender} />
                  <BookModel rerender={rerender} setRerender={setRerender} setCss3dBookVisible={setCss3dBookVisible} />
                  <Frame2Model rerender={rerender} setRerender={setRerender}/>
                  <TableModel rerender={rerender} setRerender={setRerender}/>
                  <SofaModel rerender={rerender} setRerender={setRerender}/>
                  <Chair2Model rerender={rerender} setRerender={setRerender} />
                  <TableLampModel rerender={rerender} setRerender={setRerender}  />

                  <TV2Model rerender={rerender} setRerender={setRerender} initFocused={initFocused} isMyRoom={isMyRoom}  />

              </Physics>
              </EffectComposer>
              </Suspense>

         
          </Canvas>,

          <BottomUI 
            chatContents={["Asdasd"]}
            
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
          </button> : null }

         { isMyRoom ? <ModelInstallPop 
        
        carpets={
          <>
          <ModelSettingBox 
            modelName={modelNameTypes.carpet1} 
            rerender={rerender}
            setRerender={setRerender}
            initFocused={initFocused}
            modelImgUrl="/model_images/carpet1.png"
            maxScale={0.7}
            minScale={0.3}
            scaleStep={0.04}
            installNum={carpet1Num}
            setInstallNum={setCarpet1Num}
            backgroundColor="emerald"
          />


          <ModelSettingBox 
            modelName={modelNameTypes.carpet2} 
            rerender={rerender}
            setRerender={setRerender}
            initFocused={initFocused}
            modelImgUrl="/model_images/carpet2.png"
            
            
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
                modelName={modelNameTypes.tableLamp} 
                rerender={rerender}
                setRerender={setRerender}
    
                initFocused={initFocused}
                backgroundColor="yellow"
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
            modelName={modelNameTypes.tv} 
            rerender={rerender}
            setRerender={setRerender}
            initFocused={initFocused}
            modelImgUrl="/model_images/tv.png"


            backgroundColor="purple"

        />       
          <ModelSettingBox 
            modelName={modelNameTypes.tv2} 
            rerender={rerender}
            setRerender={setRerender}
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
            modelName={modelNameTypes.vase} 
            rerender={rerender}
            setRerender={setRerender}
            initFocused={initFocused}
            modelImgUrl="/model_images/vase.png"
            maxScale={0.2}
            minScale={0.05}
            scaleStep={0.01}

            backgroundColor="green"

        />   

        <ModelSettingBox
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
        maxScale={2.5}
        minScale={0.8}
        scaleStep={0.1}
        initFocused={initFocused}

    />   

      <ModelSettingBox 
        modelName={modelNameTypes.frame2} 
        rerender={rerender}
        setRerender={setRerender}
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
          modelName={modelNameTypes.chair} 
          rerender={rerender}
          setRerender={setRerender}
          initFocused={initFocused}
          modelImgUrl="/model_images/chair1.png"
          backgroundColor="blue"
          maxScale={0.1}
          minScale={0.05}
          scaleStep={0.005}

      />   
        <ModelSettingBox 
          modelName={modelNameTypes.chair2} 
          rerender={rerender}
          setRerender={setRerender}
          initFocused={initFocused}
          modelImgUrl="/model_images/chair1.png"
          backgroundColor="blue"
          maxScale={0.1}
          minScale={0.05}
          scaleStep={0.005}
      />   

        <ModelSettingBox 
          modelName={modelNameTypes.sofa} 
          rerender={rerender}
          setRerender={setRerender}
          initFocused={initFocused}
          modelImgUrl="/model_images/chair1.png"
          backgroundColor="blue"
          maxScale={6}
          minScale={4}
          scaleStep={0.1}

      />   

        <ModelSettingBox 
          modelName={modelNameTypes.table1} 
          rerender={rerender}
          setRerender={setRerender}
          initFocused={initFocused}
          modelImgUrl="/model_images/chair1.png"
          backgroundColor="blue"
          maxScale={0.1}
          minScale={0.04}
          scaleStep={0.005}
      />   
      </>
        }

        /> : null} 
        </section>
    )

}

export default MiniHomepage;