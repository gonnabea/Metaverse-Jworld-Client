interface props {
    title: string
}

const PageTitle = ({title}:props) => {
    return (
        <header className="w-screen">
        <h2 className="py-10 px-10 text-black font-semibold text-6xl w-screen text-center">{title}</h2>
        </header>
    )
}

export default PageTitle;