import { useRouter } from "next/dist/client/router";

interface props {
    title?: string;
    bgColor?: string;
    handleLeave?: Function;
}

const SiteMark = ({title = "! Jetaverse !", bgColor="bg-blue-500", handleLeave}: props) => {

    const router = useRouter()

    return (
        <>
        {handleLeave ? <button className="absolute left-2 text-white py-2 px-4 top-1" onClick={() => {handleLeave(); router.push("/lobby");}}>EXIT</button> : null}
        <h1 className={`py-2 px-4 rounded-lg shadow-md text-white ${bgColor} text-center font-extrabold italic text-2xl`}>{title}</h1>
        </>
    )
}

export default SiteMark;