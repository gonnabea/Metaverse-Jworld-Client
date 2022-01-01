import { useRouter } from "next/dist/client/router";

interface props {
    title?: string;
    bgColor?: string;
    
}

const SiteMark = ({title = "! Jetaverse !", bgColor="bg-blue-500"}: props) => {

    const router = useRouter()
    console.log(router)
    return (
        <>
        {router.pathname === "/stream_world/[id]" || router.pathname ==="/mini_homepage/lobby" ? 
        <button className="absolute left-2 text-white py-2 px-4 top-1 font-extrabold italic" 
        onClick={() => {router.push("/lobby");}}>EXIT</button> : null}

        {router.pathname ==="/lobby" || router.pathname === "/mini_homepage/[id]" ?  <button className="absolute left-2 text-white py-2 px-4 top-1 font-extrabold italic" 
        onClick={() => {router.push("/mini_homepage/lobby");}}>Rooms</button> : null}

        <h1 className={`py-2 px-4 rounded-lg shadow-md text-white ${bgColor} text-center font-extrabold italic text-2xl`}>{title}</h1>
        </>
    )
}

export default SiteMark;