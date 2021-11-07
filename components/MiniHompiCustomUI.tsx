


interface props {
    modelName: string;
    sizeControlUI: any;
    installUI?: any;
    focusingUI?: any;
    modelImg?: string;
    backgroundColor?: string;
}


const MiniHompiCustomUI = ({modelName, sizeControlUI, installUI, focusingUI, backgroundColor}:props) => 
    <div className={`bg-${backgroundColor}-200`}>

        {installUI ?         
            <div className="border-dashed border-4 border-light-blue-500">
            <span className="">
                {modelName + " 설치"}
            </span>
                {installUI}
            </div> 
        : null}

            
        <div className="border-dashed border-4 border-light-blue-500">
        <span className="">
            {modelName + " 크기 조절"}
        </span>
            {sizeControlUI}
        </div> 
        

        {focusingUI ? 
            <div className="border-dashed border-4 border-light-blue-500">
            <span className="">
                {modelName + " 위치 지정 활성화"}
            </span>
                {focusingUI}
            </div>
        : null}
    </div>



export default MiniHompiCustomUI;
