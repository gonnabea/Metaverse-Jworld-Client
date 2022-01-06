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



const MiniHomepage:NextPage = (props) => {
    
    const {me} = useReactiveVar(applyMe);
    const router = useRouter();
    const { id: roomId, owner } = router.query
    const [isMyRoom, setIsMyRoom] = useState(false);
    

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
    const [carpet1Num, setCarpet1Num] = useState(1);

    const [carpet1Status, setCarpet1Status] = useState({
      installed: false,
      scale: 0.3,
      rotateY: "0",
      isFocused: false,
      position: { x: 0, y: 0, z:0 },
    })

    

    // 카페트2 관련 state

    const [carpet2Status, setCarpet2Status] = useState({
      installed: false,
      scale: 0.3,
      rotateY: "0",
      isFocused: false,
      position: { x: 0, y: 0, z:0 },
    })

    // tv 관련 state

    const [TVStatus, setTVStatus] = useState({
      installed: false,
      scale: 0.3,
      rotateY: "0",
      isFocused: false,
      position: { x: 0, y: 0, z:0 },
    })


    // 스탠딩 램프 관련 state

    const [standingLampStatus, setStandingLampStatus] = useState({
      installed: false,
      scale: 0.3,
      rotateY: "0",
      isFocused: false,
      position: { x: 0, y: 0, z:0 },
    })

    // Vase 관련 state

    const [vaseStatus, setVaseStatus] = useState({
      installed: false,
      scale: 0.1,
      rotateY: "0",
      isFocused: false,
      position: { x: 0, y: 0, z:0 },
    })

    // book_ani 관련 state

    const [bookStatus, setBookStatus] = useState({
      installed: false,
      scale: 0.3,
      rotateY: "0",
      isFocused: false,
      position: { x: 0, y: 0, z:0 },
    })

    // 의자1 관련 state

    const [chairStatus, setChairStatus] = useState({
      installed: false,
      scale: 0.1,
      rotateY: "0",
      isFocused: false,
      position: { x: 0, y: 0, z:0 },
    })

    // 커튼 관련 state

    const [curtainStatus, setCurtainStatus] = useState({
      installed: false,
      scale: 0.5,
      rotateY: "1",
      isFocused: false,
      position: { x: 0, y: 0, z:0 },
    })

    // 액자1 관련 state

    const [frame1Status, setFrame1Status] = useState({
      installed: false,
      scale: 1,
      rotateY: "0",
      isFocused: false,
      position: { x: 0, y: 0, z:0 },
      imageUrl: "https://media.istockphoto.com/photos/metaverse-concept-metaverse-text-sitting-over-blue-technological-picture-id1352111641?b=1&k=20&m=1352111641&s=170667a&w=0&h=OcbdDklzABPmIV5H8gNUnpiO7QI7dulB3VkvjR4f00g="
    })

    // 액자2 관련 state

    const [frame2Status, setFrame2Status] = useState({
      installed: false,
      scale: 0.1,
      rotateY: "0",
      isFocused: false,
      position: { x: 0, y: 0, z:0 },
      imageUrl: "https://media.istockphoto.com/photos/metaverse-concept-metaverse-text-sitting-over-blue-technological-picture-id1352111641?b=1&k=20&m=1352111641&s=170667a&w=0&h=OcbdDklzABPmIV5H8gNUnpiO7QI7dulB3VkvjR4f00g="
    })

    // 액자3 관련 state
    const [installFrame3, setInstallFrame3] = useState(false);
    const [frame3Scale, setFrame3Scale] = useState(1);
    const [frame3RotateY, setFrame3RotateY] = useState("0")
    const [frame3Focused, setFrame3Focused] = useState(false);
    const [frame3Position, setFrame3Position] = useState({ x: 0, y: 0, z:0 });

    // 테이블1 관련 state

    const [table1Status, setTable1Status] = useState({
      installed: false,
      scale: 0.05,
      rotateY: "0",
      isFocused: false,
      position: { x: 0, y: 0, z:0 },
      
    })

    // 테이블2 관련 state

    const [installTable2, setInstallTable2] = useState(false);
    const [table2Scale, setTable2Scale] = useState(1);
    const [table2RotateY, setTable2RotateY] = useState("0")
    const [table2Focused, setTable2Focused] = useState(false);
    const [table2Position, setTable2Position] = useState({ x: 0, y: 0, z:0 });

    // 테이블램프 관련 state

    const [tableLampStatus, setTableLampStatus] = useState({
      installed: false,
      scale: 0.1,
      rotateY: "0",
      isFocused: false,
      position: { x: 0, y: 0, z:0 },
      
    })

    // 소파1 관련 state

    const [sofa1Status, setSofa1Status] = useState({
      installed: false,
      scale: 1,
      rotateY: "0",
      isFocused: false,
      position: { x: 0, y: 0, z:0 },
      
    })

    // 소파2 관련 state

    const [installSofa2, setInstallSofa2] = useState(false);
    const [sofa2Scale, setSofa2Scale] = useState(1);
    const [sofa2RotateY, setSofa2RotateY] = useState("0")
    const [sofa2Focused, setSofa2Focused] = useState(false);
    const [sofa2Position, setSofa2Position] = useState({ x: 0, y: 0, z:0 });

    // 의자2 관련 state

    const [chair2Status, setChair2Status] = useState({
      installed: false,
      scale: 0.1,
      rotateY: "0",
      isFocused: false,
      position: { x: 0, y: 0, z:0 },
      
    })

    // TV 2 관련 state

    const [TV2Status, setTV2Status] = useState({
      installed: false,
      scale: 10,
      rotateY: "0",
      isFocused: false,
      position: { x: 0, y: 0, z:0 },
      
    })

    const applyInstallBtn = useRef();
    const [css3dBookVisible, setCss3dBookVisible] = useState(false);

    // 현재 모델 포커싱 초기화
    const initFocused = () => {
      setCarpet1Status({
        ...carpet1Status,
        isFocused: false
      })
      setCarpet2Status({
        ...carpet2Status,
        isFocused: false
      })
      setTVStatus({
        ...TVStatus,
        isFocused: false
      })
      setStandingLampStatus({
        ...standingLampStatus,
        isFocused: false
      })
  
      setVaseStatus({
        ...vaseStatus,
        isFocused: false
      })
      setBookStatus({
        ...bookStatus,
        isFocused: false
      })
      setChairStatus({
        ...chairStatus,
        isFocused: false
      })
      setCurtainStatus({
        ...curtainStatus,
        isFocused: false
      })
      setFrame1Status({
        ...frame1Status,
        isFocused: false
      })
  
      setFrame2Status({
        ...frame2Status,
        isFocused: false
      })

      setTable1Status({
        ...table1Status,
        isFocused: false
      })

      setTableLampStatus({
        ...tableLampStatus,
        isFocused: false
      })

      setSofa1Status({
        ...sofa1Status,
        isFocused: false
      })
     
      setChair2Status({
        ...chair2Status,
        isFocused: false
      })
    
      setTV2Status({
        ...TV2Status,
        isFocused: false
      })
    }


    const getInfos = async() => {
      

      const {data: { getMiniHompi } } = await reqRoomInfo();

      const {data: { getThreeModels } } = await reqModels();

      console.log(getMiniHompi)
      console.log(getThreeModels)

      console.log(me)

      if(me.id === getMiniHompi.miniHompi.ownerId) {
        setIsMyRoom(true)
      }
      else {
        setIsMyRoom(false)
      }

      setGetMiniHompi(getMiniHompi)
      setGetThreeModels(getThreeModels)


        // 방 입장 시 저장된 3D 모델 로드 & 배치하기
        getThreeModels.models.forEach(({installed, id, name, rotateY, scale, position}) => {
          switch(name) {
            case "carpet1":
              setCarpet1Status({
                ...carpet1Status,
                installed,
                scale: scale.x,
                rotateY,
                position
              })
              break;
            case "carpet2":
              setCarpet2Status({
                ...carpet1Status,
                installed,
                scale: scale.x,
                rotateY,
                position
              })
              break;
            case "sofa":
              setSofa1Status({
                ...sofa1Status,
                installed,
                scale: scale.x,
                rotateY,
                position
              })
              break;
            case "chair":                          
              setChairStatus({
                ...chairStatus,
                installed,
                scale: scale.x,
                rotateY,
                position
              })
              break;
            case "chair2":                          
              setChair2Status({
                ...chair2Status,
                installed,
                scale: scale.x,
                rotateY,
                position
              })
              break;
            case "standingLamp":                          
              setStandingLampStatus({
                ...standingLampStatus,
                installed,
                scale: scale.x,
                rotateY,
                position
              })
              break;
            case "curtain":                          
              setCurtainStatus({
                ...curtainStatus,
                installed,
                scale: scale.x,
                rotateY,
                position
              })
              break;
            case "tv2":                          
              setTV2Status({
                ...TV2Status,
                installed,
                scale: scale.x,
                rotateY,
                position
              })
              break;
            case "table":                          
              setTable1Status({
                ...table1Status,
                installed,
                scale: scale.x,
                rotateY,
                position
              })
              break;
            case "tv":                          
              setTVStatus({
                ...TVStatus,
                installed,
                scale: scale.x,
                rotateY,
                position
              })
              break;
            case "vase":                          
              setVaseStatus({
                ...vaseStatus,
                installed,
                scale: scale.x,
                rotateY,
                position
              })
              break;
            case "book":                          
              setBookStatus({
                ...bookStatus,
                installed,
                scale: scale.x,
                rotateY,
                position
              })
              break;
            case "tableLamp":
              setTableLampStatus({
                ...tableLampStatus,
                installed,
                scale: scale.x,
                rotateY,
                position
              })
              break;
            case "frame":
              setFrame1Status({
                ...frame1Status,
                installed,
                scale: scale.x,
                rotateY,
                position
              })
              break;
            case "frame2":
              setFrame2Status({
                ...frame1Status,
                installed,
                scale: scale.x,
                rotateY,
                position
              })
              break;
            case "room":
              setRoomScale(scale.x)
              break;
          }
        })

      
    }

    useEffect(() => {

      getInfos()
      
    }, [])

    const handleLeave = () => {
      router.push("/lobby")
    }

    return(
        <section className="w-screen h-screen overflow-hidden">
          <SiteMark title={`${owner ? owner + "'s Room" : "Room"}`} bgColor={"bg-green-400"} />
          
          <div className="z-10 absolute">

              {/* {isMyRoom ? <ModelSettingBox 
                modelName={"방"} 
                scaleState={roomScale}
                setScaleState={setRoomScale}
                
                backgroundColor="green"
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
                  <FrameModel modelStatus={frame1Status} setModelStatus={setFrame1Status} />
                  <Carpet1Model modelStatus={carpet1Status} setModelStatus={setCarpet1Status} threeModels={getThreeModels} installNum={carpet1Num} setInstallNum={setCarpet1Num}   />
                  <Carpet2Model modelStatus={carpet2Status} setModelStatus={setCarpet2Status} />
                  <TvModel modelStatus={TVStatus} setModelStatus={setTVStatus}  />
                  <StandingLampModel modelStatus={standingLampStatus} setModelStatus={setStandingLampStatus} />
                  <VaseModel modelStatus={vaseStatus} setModelStatus={setVaseStatus} />
                  <ChairModel modelStatus={chairStatus} setModelStatus={setChairStatus}  />
                  <CurtainModel modelStatus={curtainStatus} setModelStatus={setCurtainStatus}  />
                  <BookModel modelStatus={bookStatus} setModelStatus={setBookStatus} setCss3dBookVisible={setCss3dBookVisible} />
                  <Frame2Model modelStatus={frame2Status} setModelStatus={setFrame2Status}  
                  imageUrl={"https://media.istockphoto.com/photos/metaverse-concept-metaverse-text-sitting-over-blue-technological-picture-id1352111641?b=1&k=20&m=1352111641&s=170667a&w=0&h=OcbdDklzABPmIV5H8gNUnpiO7QI7dulB3VkvjR4f00g="} />
                  <TableModel modelStatus={table1Status} setModelStatus={setTable1Status}  />
                  <SofaModel modelStatus={sofa1Status} setModelStatus={setSofa1Status} />
                  <Chair2Model modelStatus={chair2Status} setModelStatus={setChair2Status} />
                  <TableLampModel modelStatus={tableLampStatus} setModelStatus={setTableLampStatus} />
                  <TV2Model modelStatus={TV2Status} setModelStatus={setTV2Status} />

              </Physics>
              </EffectComposer>
              </Suspense>

         
          </Canvas>,

          <BottomUI 
            chatContents={["Asdasd"]}
            
            />

          {isMyRoom ? <button ref={applyInstallBtn} 
          className="
          bg-black rounded-lg text-white hover:bg-blue-500 w-20 h-10 border-double border-4 font-bold z-30 absolute right-0 top-1" 
          value="설치 적용" 
          onClick={async () => {
            initFocused()
            await reqSaveModels({
              variables: {
              saveThreeModelInput: {
                models: getModels()
              } 
            },
          })
            alert("방 상태가 저장되었습니다.")
          }
        }>
          저장
          </button> : null }

         { isMyRoom ? <ModelInstallPop 
        
        carpets={
          <>
          <ModelSettingBox 
            modelName={"카페트1"} 
            modelStatus={carpet1Status}
            setModelStatus={setCarpet1Status}
            initFocused={initFocused}
            modelImgUrl="/model_images/carpet1.png"
            maxScale={0.7}
            minScale={0.3}
            scaleStep={0.04}
            installNum={carpet1Num}
            setInstallNum={setCarpet1Num}
            backgroundColor="blue"
          />


          <ModelSettingBox 
            modelName={"카페트2"} 
            modelStatus={carpet2Status}
            setModelStatus={setCarpet2Status}
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
              modelName={"스탠딩 램프"} 
              
              
              modelStatus={standingLampStatus}
              setModelStatus={setStandingLampStatus}
              initFocused={initFocused}
              backgroundColor="red"
              modelImgUrl="/model_images/standing_lamp.png"
              maxScale={0.4}
              minScale={0.2}
              scaleStep={0.05}

            />     
                            <ModelSettingBox 
              modelName={"테이블 램프"} 
              
              
              modelStatus={tableLampStatus}
              setModelStatus={setTableLampStatus}
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
            modelStatus={TVStatus}
            setModelStatus={setTVStatus}
            initFocused={initFocused}
            modelImgUrl="/model_images/tv.png"


            backgroundColor="purple"

        />       
          <ModelSettingBox 
            modelName={"TV2"} 
            modelStatus={TV2Status}
            setModelStatus={setTV2Status}
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
            modelStatus={vaseStatus}
            setModelStatus={setVaseStatus}
            initFocused={initFocused}
            modelImgUrl="/model_images/vase.png"
            maxScale={0.2}
            minScale={0.05}
            scaleStep={0.01}

            backgroundColor="green"

        />   

        <ModelSettingBox
          modelName={"커튼"} 
          modelStatus={curtainStatus}
          setModelStatus={setCurtainStatus}
          initFocused={initFocused}
          modelImgUrl="/model_images/curtain.png"
          />
      
      </>
        }

        writes={
          <>
          <ModelSettingBox 
            modelName={"메모장"} 
            modelStatus={bookStatus}
            setModelStatus={setBookStatus}
            initFocused={initFocused}

            backgroundColor="black"
            modelImgUrl="/model_images/book_ani.png"
            maxScale={0.5}
            minScale={0.1}
            scaleStep={0.05}

        />   

        <ModelSettingBox 
        modelName={"액자1"} 
        
        modelStatus={frame1Status}
        setModelStatus={setFrame1Status}

        backgroundColor="black"
        modelImgUrl="/model_images/frame1.png"
        maxScale={2.5}
        minScale={0.8}
        scaleStep={0.1}

    />   

      <ModelSettingBox 
        modelName={"액자2"} 
        modelStatus={frame2Status}
        setModelStatus={setFrame2Status}
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
          modelStatus={chairStatus}
          setModelStatus={setChairStatus}
          initFocused={initFocused}
          modelImgUrl="/model_images/chair1.png"
          backgroundColor="blue"
          maxScale={0.1}
          minScale={0.05}
          scaleStep={0.005}

      />   
        <ModelSettingBox 
          modelName={"의자2"} 
          modelStatus={chair2Status}
          setModelStatus={setChair2Status}
          initFocused={initFocused}
          modelImgUrl="/model_images/chair1.png"
          backgroundColor="blue"
          maxScale={0.1}
          minScale={0.05}
          scaleStep={0.005}
      />   

        <ModelSettingBox 
          modelName={"소파1"} 
          modelStatus={sofa1Status}
          setModelStatus={setSofa1Status}
          initFocused={initFocused}
          modelImgUrl="/model_images/chair1.png"
          backgroundColor="blue"
          maxScale={6}
          minScale={4}
          scaleStep={0.1}

      />   

        <ModelSettingBox 
          modelName={"테이블1"} 
          modelStatus={table1Status}
          setModelStatus={setTable1Status}
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