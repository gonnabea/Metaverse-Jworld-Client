import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { CREATEHOMPI } from "../../apis/gql-queries/miniHompi";

interface props {
    title?: string;
    bgColor?: string;
    handleLeave?: Function;
}




const SiteMark = ({title = "! Jetaverse !", bgColor="bg-blue-500", handleLeave}: props) => {

    const [jwtToken, setJwtToken] = useState()
    const [reqCreateHompi, {data, error, loading}] = useMutation(CREATEHOMPI, {
        variables: {
            createMiniHompiInput: {
                scale: {x:1, y:1, z:1}
            }},
        context: {
            headers: {
                "Authorization":  "Bearer " + jwtToken
            }
        }
    });

    const router = useRouter()

    useEffect(() => {
        setJwtToken(localStorage.getItem("jwt_token"))
    }, [])
   
    return (
        <>
        {/* 스트림월드일 경우 */}
        {router.pathname === "/stream_world/[id]" ? 
        <button className="absolute left-2 text-white py-2 px-4 top-1 font-extrabold italic z-10" 
        onClick={() => {handleLeave(); router.push("/lobby");}}>EXIT</button> : null}

        {/* 스트림월드 로비일 경우 */}
        {router.pathname ==="/lobby" || router.pathname === "/mini_homepage/room/[id]" ?  <button className="z-10 absolute left-2 text-white py-2 px-4 top-1 font-extrabold italic" 
        onClick={() => {router.push("/mini_homepage/lobby");}}>Rooms</button> : null}

        {/* 미니홈피 로비일 경우 */}
        {router.pathname === "/mini_homepage/lobby" ? 
        <>
        <button className="absolute left-2 text-white py-2 px-4 top-1 font-extrabold italic z-10" 
        onClick={() => {router.push("/lobby");}}>Worlds</button> 
        <button className="absolute right-2 text-white py-2 px-4 top-1 font-extrabold italic z-10" 
        onClick={async() => {
            const confirm = window.confirm("방을 생성하거나 초기화합니다. 계속하시겠습니까?")
            
            if(confirm) {
              await reqCreateHompi()
              window.location.replace("/mini_homepage/lobby")
            }

           


            // router.push(`/mini_homepage/room/${roomId}`);
            
            
            }}>MyRoom</button>
        </>
        : null}

        <h1 className={`py-2 px-4 rounded-lg shadow-md text-white ${bgColor} text-center font-extrabold italic text-2xl fixed w-full`}>{title}</h1>
        </>
    )
}

export default SiteMark;