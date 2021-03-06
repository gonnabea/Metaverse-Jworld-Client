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
import ThirdPersonCamera from '../../components/threeComponents/ThirdPersonCamera';
import PageTitle from '../../components/common/PageTItle';
import SiteMark from '../../components/common/SiteMark';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { applyMe, setMe } from '../../stores/loggedUser';
import gql from 'graphql-tag';
import { useRouter } from 'next/router'
import { GETME } from '../../apis/gql-queries/user';
import BottomUI from '../../components/common/BottomUI';
import useWebsocket from '../../hooks/useWebsocket';
import { applyCharacterStatus, applyConnectedUser, removeConnectedUser, setOthersPosition, setOthersRotateZ } from '../../stores/character';
import CharacterModel2 from '../../components/threeComponents/streamWorldModels/CharacterModel2';
import CharacterModel7 from '../../components/threeComponents/streamWorldModels/CharacterModel7';
import CharacterModel8 from '../../components/threeComponents/streamWorldModels/CharacterModel8';
import CharacterModel6 from '../../components/threeComponents/streamWorldModels/CharacterModel6';
import CharacterModel5 from '../../components/threeComponents/streamWorldModels/CharacterModel5';
import CharacterModel4 from '../../components/threeComponents/streamWorldModels/CharacterModel4';
import CharacterModel3 from '../../components/threeComponents/streamWorldModels/CharacterModel3';
import { addConnectedUser } from '../../stores/character';
import { Loader } from '@react-three/drei';

const World:NextPage = () => {
    const applyStore = useReactiveVar(applyMe);

    const roomId = useRef<string | null>();
    const [characterPosition, setCharacterPosition] = useState([0,0,0]);
    const cubeRef = useRef();
    const [jwtToken, setJwtToken] = useState();
    const [nickname, setNickname] = useState("??????");
    const [userId, setUserId] = useState<number>()
    const router = useRouter()
    const [socketIoClient] = useWebsocket();
    const [_, forceRerender] = useState(0);
    const [userIndex , setUserIndex] = useState(0); // ?????? ????????? ?????? ??????????????? ??????


    // ?????? ?????? ??? ????????? ??? ?????? ?????? ????????????
    const [reqGetMe, {loading, error}] = useLazyQuery(GETME, {
      context: {
          headers: {
              "Authorization":  "Bearer " + jwtToken
          }
      }
      
  })
      
  const getMe = async() => {
  
    // ????????? ???
    const data = await reqGetMe();
    if(data.data){
        const user = data.data.getMe.user;
        setNickname(user.nickname);
        setUserId(user.id);
        setMe({id: user.id, nickname: user.nickname})
        const url = window.location.href;

    }
    // ???????????? ???
    else {
        const customerId = Math.random();
        setNickname("?????? - " + customerId);
        setUserId(customerId)
        setMe({id: customerId, nickname: "?????? - " + customerId})
        const url = window.location.href;

    }
    
}


    

    // url??? ?????? roomId ??????
    const getRoomId = () => {
      const url = window.location.href;
      roomId.current = url.split("world/")[1];

      socketIoClient.emit("get-user-list", { roomId: url.split("world/")[1] })
      
    }



    socketIoClient.on("broadcast", (data) => {
      // console.log(data)
    })

    socketIoClient.on("disconnect", (data) => {
      leaveLobby()
      removeConnectedUser(userId)

    })

   
    

    
    



    const leaveRoom = () => {
      
      socketIoClient.emit("leave-room", { roomId: roomId.current, userId });
      

    }

    const leaveLobby = () => {
           
      socketIoClient.emit("leave-lobby", { roomId: roomId.current, userId });
      
    }
      function ObstacleBox(props) {
        const [ref, api] = useBox(() => ({ rotation: [0, 0, 0], ...props, onCollide: () => {
          
        }  }))
        
        if(props.isGround === true){
          return (
              <mesh ref={ref} name={"ground1"} visible={false} >
                <boxGeometry args={props.args}  />
                <meshStandardMaterial color="orange"  />
              </mesh>

          )
        }
        else if(props.isStair === true) {
          return (
            <mesh ref={ref} name={"stair"} visible={false}   >
              <boxGeometry args={props.args}  />
              <meshStandardMaterial color="orange"  />
            </mesh>

        )
        }
        else {
          return (
          <mesh ref={ref} visible={false}   >
          <boxGeometry args={props.args}  />
          <meshStandardMaterial color="orange"  />
        </mesh>
          )
        }
      }

      const handleSocketListeners = () => {

        // ??? ?????? ????????? ?????? ????????? ??????
        socketIoClient.on("avatar-move", ({roomId: senderRoomId, userId, position, rotateZ}) => {
          console.log(userId)
          if(senderRoomId === roomId.current) {
            setOthersPosition({position, index: userId})
            setOthersRotateZ({rotateZ, index: userId})
            
          }
        })

     

        // ?????? ?????? ?????? ??? ?????? ??????????????? ??????
        socketIoClient.on('get-user-list', (data) => {
          console.log(data)
          data.userList?.map((user, index) => {
            addConnectedUser({ id: user.id, connectedRoomId: user.connectedRoomId })
          })
          setUserIndex(data.userList.length - 1)
        })


        // ??? ?????? ????????? ?????? ???
        socketIoClient.on("leave-room", ({userId}) => {
          removeConnectedUser(userId)
          

        })

        // ??? ?????? ?????? ?????? ???
        socketIoClient.on("join-room", ({roomId, userId, userList}) => {
          console.log(userList)
          if(roomId === roomId)
            addConnectedUser({id: userId , connectedRoomId: roomId })
            setUserIndex(userList.length - 1)
          
        })
      }


      


      
      
      useEffect(() => {
        
        getRoomId()
        getMe()
        handleSocketListeners()
        
      // ????????? ????????? ?????? ????????? ??????
      const sendCharacterPosition = setInterval(() => {
        socketIoClient.emit("avatar-move", {roomId: roomId.current, userId: userIndex, position: applyCharacterStatus().position, rotateZ: applyCharacterStatus().rotateZ})
      }, 30)
        
        return () => {
          
          clearInterval(sendCharacterPosition)
          socketIoClient.off("avatar-move")
          socketIoClient.off("join-room")
          socketIoClient.off("leave-room")
          socketIoClient.off("get-user-list")


          // clearInterval(sendCharacterPosition)
        }
        
      }, [])

    return(
        <section className="w-screen h-screen overflow-hidden">
          <SiteMark title={"Stream World"} bgColor={"bg-black"} handleLeave={leaveRoom} />
          <BottomUI wsClient={socketIoClient} nickname={nickname} />
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

              {/* ?????? ????????? */}
              <CharacterModel2
           
              rotation={[Math.PI / 2,0,0]} 
              scale={[0.01,0.01,0.01]} 
              />
               <CharacterModel3
           
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

              {/* ?????? ??? ?????? */}
              <ObstacleBox position={[0,-0.3,0]} args= {[20, 0.1, 15]} isGround={true} />

              {/* ?????? ?????? ?????? */}
              <ObstacleBox position={[15,-2.2,0]} args= {[10, 0.1, 15]} isGround={true} />

              {/* ?????? */}
              <ObstacleBox position={[12,-1.3,5.5]} args= {[4, 0.1, 4]} rotation={[0,0,-0.5]} isStair={true} />
              <ObstacleBox position={[12,-1.3,-5.5]} args= {[4, 0.1, 4]} rotation={[0,0,-0.5]} isStair={true} />

              <ObstacleBox position={[15.5,1,7.5]} args= {[10, 7, 0.1]} />
              <ObstacleBox position={[15.5,1,-7.5]} args= {[10, 7, 0.1]} />

              <ObstacleBox position={[20,1,0]} args= {[0.1, 7, 15]} />



              {/* <Amy /> */}
             
            </Suspense>
            </Physics>
        </Canvas>,
        
          <Loader/>
        
        </section>
    )

}

export default World;
