
interface props {
    loading: boolean,
}

const ThreeLoader = ({loading}: props) => {

    return loading ? (
        <div className="w-screen bg-black">
        <h1 className="py-16 px-10 text-white font-semibold text-6xl w-screen text-center">로딩중입니다...</h1>
        </div>
    ) : null
}

export default ThreeLoader;