import { ReactElement } from "react";



interface props {
    modelName: string;

    // sizeControlUI?: ReactElement;
    // rotationControlUI?: ReactElement
    // installUI?: ReactElement;
    // modelImgUI?: ReactElement;

    modelImgUrl?: string;
    
    installState?: any
    setInstallState?: any
    scaleState?: any
    setScaleState?: any
    rotateYState?: any
    setRotateYState?: any
    focusState?: any
    setFocusState?: any

    backgroundColor?: string;
    
    initEditMode?: any
}


const ModelSettingBox = ({
    modelName, 
    backgroundColor, 
    installState,
    setInstallState,
    scaleState,
    setScaleState,
    rotateYState,
    setRotateYState,
    focusState,
    setFocusState,
    initEditMode,
    modelImgUrl
}:props
) => 
    <div className={`bg-${backgroundColor}-200 border-4 border-light-blue-500 flex h-1/6 justify-between`}>

                 
           { installState !== undefined ? <div className="">
            <span className="">
                {modelName + " 설치"}
            </span>
                <div>
                    <button className="text-lg" 
                      onClick={() => {
                        console.log(installState)
                        // 중복 포커싱 방지
                        if(focusState === false) initEditMode ? initEditMode() : null; 

                        setInstallState(installState => !installState);

                        if(!installState)
                          setFocusState(true);
                        else{
                            setFocusState(false);
                        }

                        
                      
                    }}>ON / OFF</button>
                  </div>
            </div>  : null
        }

            
        { scaleState ? <div className="">
        <span className="">
            {modelName + " 크기 조절"}
        </span>
             <div>
                    <button className="text-lg" onClick={() => {setScaleState(scaleState => scaleState += 0.05)}}>+</button>
                    <button className="text-lg" onClick={() => {setScaleState(scaleState => scaleState -= 0.05)}}>-</button>
                  </div>
        </div> : null }

        { rotateYState !== undefined ? <div>
            <span>
                {modelName + " 회전"}
            </span>
             <div>
                <input type="range" max="7" min="0"  step="0.1" onChange={(e) =>{setRotateYState(e.target.value)}} />
              </div>
        </div> : null
        }
        
         {
         modelImgUrl ?
         focusState ? <img 
                            src={modelImgUrl}
                            onClick={() => setFocusState(false)} 
                            className="text-lg border-solid border-4 border-green-400 w-4/12 h-full" />
            : <img 
                src={modelImgUrl} 
                onClick={() => { initEditMode(); setFocusState(true) }}  
                className="text-lg w-4/12 h-4/12 r-0 h-full" 
            />
        : null
        }




    </div>



export default ModelSettingBox;
