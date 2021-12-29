interface props {
    title?: string;
    bgColor?: string;
}

const SiteMark = ({title = "! Jetaverse !", bgColor="bg-blue-500"}: props) => {

    return (
        <h1 className={`py-2 px-4 rounded-lg shadow-md text-white ${bgColor} text-center font-extrabold italic text-2xl`}>{title}</h1>
    )
}

export default SiteMark;