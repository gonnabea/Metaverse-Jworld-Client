import { ReactElement } from "react";



interface props {
    modelName: string;
    sizeControlUI: any;
    installUI?: ReactElement;
    modelImg?: string;
    backgroundColor?: string;
    modelImgUI?: ReactElement
}


const ModelSettingBox = ({modelName, sizeControlUI, installUI, modelImgUI, backgroundColor}:props) => 
    <div className={`bg-${backgroundColor}-200 border-4 border-light-blue-500 flex h-1/6 justify-between`}>

        {installUI ?         
            <div className="">
            <span className="">
                {modelName + " 설치"}
            </span>
                {installUI}
            </div> 
        : null}

            
        <div className="">
        <span className="">
            {modelName + " 크기 조절"}
        </span>
            {sizeControlUI}
        </div> 
        
        {modelImgUI}


    </div>



export default ModelSettingBox;
