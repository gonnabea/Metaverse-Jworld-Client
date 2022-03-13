
interface props {
    loading: boolean,
}

const Loader = ({loading}: props) => {

    return loading ? (
        <div className="w-screen h-screen bg-black absolute">
        <h1 className="py-16 px-10 text-white font-semibold text-6xl w-screen text-center">Loading...</h1>
        </div>
    ) : null
}

export default Loader;