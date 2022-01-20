import type { NextPage } from 'next'
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import StreamWorldModel from '../../components/threeComponents/streamWorldModels/StreamWorldModel';
import OrbitCameraController from '../../components/threeComponents/OrbitController';
import ScreenModel from '../../components/threeComponents/streamWorldModels/ScreenModel';
import CharacterModel from '../../components/threeComponents/streamWorldModels/CharacterModel';
import { Physics, useBox, useCompoundBody, useConvexPolyhedron, useCylinder, useHeightfield, usePlane, useSphere } from '@react-three/cannon';
import Amy from '../../components/threeComponents/streamWorldModels/Amy';
import ThirdPersonCamera from '../../components/threeComponents/thirdPersonCamera';
import PageTitle from '../../components/common/PageTItle';
import SiteMark from '../../components/common/SiteMark';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { applyMe, setMe } from '../../stores/loggedUser';
import gql from 'graphql-tag';
import { useRouter } from 'next/router'
import { GETME } from '../../apis/gql-queries/user';
import BottomUI from '../../components/common/BottomUI';
import useWebsocket from '../../hooks/useWebsocket';
import { applyCharacterStatus, setOthersPosition, setOthersRotateZ } from '../../stores/character';
import CharacterModel2 from '../../components/threeComponents/streamWorldModels/CharacterModel2';
import CharacterModel7 from '../../components/threeComponents/streamWorldModels/CharacterModel7';
import CharacterModel8 from '../../components/threeComponents/streamWorldModels/CharacterModel8';
import CharacterModel6 from '../../components/threeComponents/streamWorldModels/CharacterModel6';
import CharacterModel5 from '../../components/threeComponents/streamWorldModels/CharacterModel5';
import CharacterModel4 from '../../components/threeComponents/streamWorldModels/CharacterModel4';
import CharacterModel3 from '../../components/threeComponents/streamWorldModels/CharacterModel3';


const World:NextPage = () => {
    const applyStore = useReactiveVar(applyMe);

    const roomId = useRef<string | null>();
    const [characterPosition, setCharacterPosition] = useState([0,0,0]);
    const cubeRef = useRef();
    const [jwtToken, setJwtToken] = useState();
    const [nickname, setNickname] = useState("손님");
    const [userId, setUserId] = useState(JSON.stringify(Math.random()))
    const router = useRouter()
    const [socketIoClient] = useWebsocket();
    const [_, forceRerender] = useState(0)


    // 로비 입장 시 로그인 된 유저 정보 가져오기
    const [reqGetMe, {loading, error}] = useLazyQuery(GETME, {
      context: {
          headers: {
              "Authorization":  "Bearer " + jwtToken
          }
      }
      
  })
      
  const getMe = async() => {
  
    // 회원일 시
    const data = await reqGetMe();
    if(data.data){
        const user = data.data.getMe.user;
        setNickname(user.nickname);
        setUserId(user.id);
        setMe({id: user.id, nickname: user.nickname})
        
    }
    // 비회원일 시
    else {
        const customerId = Math.random();
        setNickname("손님 - " + customerId);
        setUserId(customerId)
        setMe({id: customerId, nickname: "손님 - " + customerId})
    }
    
}


    

    // url로 부터 roomId 얻기
    const getRoomId = () => {
      const url = window.location.href;
      roomId.current = url.split("world/")[1];
      
    }



    socketIoClient.on("broadcast", (data) => {
      console.log(data)
    })

    socketIoClient.on("disconnect", (data) => {
      leaveLobby()
    })

   
    

    
    
    socketIoClient.on("avatar-move", ({roomId, userId, position, rotateZ}) => {
      if(roomId === roomId) {
        console.log(userId)
        console.log(position)
        setOthersPosition({position, index: 0})
        setOthersRotateZ({rotateZ, index: 0})
        // setOthersRotateZ()
      }
    })


    const leaveRoom = () => {
      
      socketIoClient.emit("leave-room", { roomId: roomId.current, userId });
    }

    const leaveLobby = () => {
           
     
      socketIoClient.emit("leave-lobby", { roomId: roomId.current, userId });
      
    }
    

    function Box(props) {
        // This reference will give us direct access to the THREE.Mesh object
        const ref = useRef()
        
        // Set up state for the hovered and active state
        const [hovered, setHover] = useState(false)
        const [active, setActive] = useState(false)
        // Subscribe this component to the render-loop, rotate the mesh every frame
        useFrame((state, delta) => (ref.current.rotation.x += 0.01))
        // Return the view, these are regular Threejs elements expressed in JSX
        return (

          <mesh
            {...props}
            ref={ref}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onDoubleClick={() => leaveLobby()}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
          </mesh>
        )
      }

      function Ground1(props) {
        const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))

        return (
          <mesh ref={ref} name="ground1">
            <planeGeometry args={[20, 15]}  />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
        )
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

      function ObstaclePlane(props) {
        const [ref] = usePlane(() => ({ rotation: [0, 0, 0], ...props }))
        
        return (
          <mesh castShadow ref={ref} >
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="orange"  />
          </mesh>
        )
      }


      
      
      useEffect(() => {
        
    
        
        getRoomId()
        getMe()

       
      // 서버에 캐릭터 위치 실시간 전송
        const sendCharacterPosition = setInterval(() => {
          socketIoClient.emit("avatar-move", {roomId: roomId.current, userId, position: applyCharacterStatus().position, rotateZ: applyCharacterStatus().rotateZ})
        }, 0)
        
        return () => {
          
          clearInterval(sendCharacterPosition)
        }
      }, [_])

    return(
        <section className="w-screen h-screen overflow-hidden">
          <SiteMark title={"Stream World"} bgColor={"bg-black"} handleLeave={leaveRoom} />
          <BottomUI socketIoClient={socketIoClient} nickname={nickname} />
          <Canvas className="w-screen h-screen">
          
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {/* <directionalLight
                
                intensity={1}
                position={[0, 2, 2]}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                castShadow
              /> */}

          {/* <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} /> */}

          <Physics gravity= {[0, -100, 0]} >
            <Suspense fallback={null}>
              <StreamWorldModel />
              
              <CharacterModel 
              rotation={[Math.PI / 2,0,0]} 
              scale={[0.01,0.01,0.01]} 
              />

              {/* 타인 캐릭터 */}
              <CharacterModel2
              rotation={[Math.PI / 2,0,0]} 
              scale={[0.01,0.01,0.01]} 
              />
              {/* <CharacterModel3
              rotation={[Math.PI / 2,0,0]} 
              scale={[0.01,0.01,0.01]} 
              />            
              <CharacterModel4
              rotation={[Math.PI / 2,0,0]} 
              scale={[0.01,0.01,0.01]} 
              />            
              <CharacterModel5
              rotation={[Math.PI / 2,0,0]} 
              scale={[0.01,0.01,0.01]} 
              />            
              <CharacterModel6
              rotation={[Math.PI / 2,0,0]} 
              scale={[0.01,0.01,0.01]} 
              />            
              <CharacterModel7
              rotation={[Math.PI / 2,0,0]} 
              scale={[0.01,0.01,0.01]} 
              />            
              <CharacterModel8
              rotation={[Math.PI / 2,0,0]} 
              scale={[0.01,0.01,0.01]} 
              />
               */}
              
              <ScreenModel position={[-0.4,0,0]} scale={[5.5,4.5,5]} rotation={[0, 1.57, 0]} />
              {/* <ScreenModel2 position={[-2,0,0]} scale={[5.5,4.5,5]} rotation={[0, 1.57, 0]} /> */}
              
              {/* <ObstaclePlane position={[2,0,-7.5]} size={100} /> */}
              {/* <ObstaclePlane position={[2,0, 7.5]} /> */}
              <ObstacleBox position={[-0.5,0,0]} args= {[0.5, 6, 6]} />
              <ObstacleBox position={[-8,1,0]} args= {[3.5, 6, 0.5]} />


              <ObstacleBox position={[-10,2,0]} args= {[0.1, 4, 15]} />
              <ObstacleBox position={[8.6,2,3.5]} args= {[3.5, 4, 0.1]} />
              <ObstacleBox position={[8.6,2,-3.5]} args= {[3.5, 4, 0.1]} />
              <ObstacleBox position={[0,2,7.5]} args= {[21, 4, 0.1]} />
              <ObstacleBox position={[0,2,-7.5]} args= {[21, 4, 0.1]} />

              {/* 계단 위 바닥 */}
              <ObstacleBox position={[0,-0.3,0]} args= {[20, 0.1, 15]} isGround={true} />

              {/* 계단 아래 바닥 */}
              <ObstacleBox position={[15,-2.2,0]} args= {[10, 0.1, 15]} isGround={true} />

              {/* 계단 */}
              <ObstacleBox position={[12,-1.3,5.5]} args= {[4, 0.1, 4]} rotation={[0,0,-0.5]} isStair={true} />
              <ObstacleBox position={[12,-1.3,-5.5]} args= {[4, 0.1, 4]} rotation={[0,0,-0.5]} isStair={true} />

              <ObstacleBox position={[15.5,1,7.5]} args= {[10, 7, 0.1]} />
              <ObstacleBox position={[15.5,1,-7.5]} args= {[10, 7, 0.1]} />

              <ObstacleBox position={[20,1,0]} args= {[0.1, 7, 15]} />



              {/* <Amy /> */}
             
            </Suspense>
            </Physics>
        </Canvas>,
        </section>
    )

}

export default World;
