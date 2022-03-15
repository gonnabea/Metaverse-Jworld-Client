import { useState } from "react";

interface props {
    imgSrc: string;
    title: string;
    description: string;
    setOpen: Function;
}


const ImageInfoPop = ({ imgSrc, title, description, setOpen }: props) => {



    return (
        <div className="w-10/12 h-10/12 bg-black flex flex-col justify-center items-center cursor-pointer p-10">
            <span className="text-white text-lg" onClick={() => setOpen((open:boolean) => !open)}>X</span>
            <img className="w-full h-full" src={imgSrc} alt="이미지" />
            {/* <cite className="text-white text-lg p-4">{title}</cite>
            <p className="text-white">{description}</p> */}
        </div> 
    )
}

export default ImageInfoPop;