import { ReactElement } from "react";



interface props {
    modelName: string;

    // sizeControlUI?: ReactElement;
    // rotationControlUI?: ReactElement
    // installUI?: ReactElement;
    // modelImgUI?: ReactElement;

    modelImgUrl?: string;
    






    backgroundColor?: string;
    
    initFocused?: any;
    maxScale?: number;
    minScale?: number;
    scaleStep?: number;
    installNum?: number;
    setInstallNum?: Function;
    modelStatus: any;
    setModelStatus: Function;
}


const ModelSettingBox = ({
    modelName, 
    backgroundColor, 


    initFocused,
    modelImgUrl,
    maxScale = 5,
    minScale = 0.1,
    scaleStep = 0.1,
    installNum,
    setInstallNum,
    modelStatus,
    setModelStatus,
}:props
) => {

    // modelName={"액자1"} 
    // installState={frame1Status.installed}
    // setInstallState={setInstallFrame1}
    // scaleState={frame1Status.scale}
    // setScaleState={setFrame1Scale}
    // rotateYState={frame1Status.rotateY}
    // setRotateYState={setFrame1RotateY}
    // focusState={frame1Status.isFocused}
    // setFocusState={setFrame1Focused}
    // initFocused={initFocused}
    // frame1Status={frame1Status}
    // setFrame1Status={setFrame1Status}

    // backgroundColor="black"
    // modelImgUrl="/model_images/frame1.png"
    // maxScale={2.5}
    // minScale={0.8}
    // scaleStep={0.1}
    
    const {installed, scale, rotateY, isFocused, position, imageUrl} = modelStatus;

   return <div className={`bg-${backgroundColor}-200 border-4 border-light-blue-500 flex h-1/6 justify-between`}>

                 
           <div className="">
            <span className="">
                {modelName + " 설치"}
            </span>
                <div>
                    <button className="text-lg text-bold text-green-500" 
                      onClick={() => {
                        console.log("installed: " + installed)
                        // 중복 포커싱 방지
                        if(isFocused === false) initFocused ? initFocused() : null; 

                  
                        if(!installed){
                            setModelStatus({
                                ...modelStatus,
                                installed: true,
                                isFocused: true
                            });
                            
                        }
                        else{
                            setModelStatus({
                                ...modelStatus,
                                installed: false,
                                isFocused: false
                            });
                        }

                        
                      
                    }}>{installed ? "ON" : "OFF"}</button>
                  </div>
            </div>

            
        { scale ? <div className="">
        <span className="">
            {modelName + " 크기 조절"}
        </span>
             <div>
            
             <input type="range" value={scale} max={maxScale} min={minScale}  step={scaleStep} onChange={(e) =>{
                 setModelStatus({
                    ...modelStatus,
                    scale: e.target.value
                 });
                 
                }}
                  
                  />
 
                  </div>
        </div> : null }

        { installNum !== undefined ? <div className="">
        <span className="">
            {modelName + " 개수 조절"}
        </span>
             <div>
            
             <input type="range" value={installNum} max={4} min={1}  step={1} onChange={(e) =>{{setInstallNum(e.target.value)}; console.log(e.target.value)}} />
 
                  </div>
        </div> : null }

        { rotateY !== undefined ? <div>
            <span>
                {modelName + " 회전"}
            </span>
             <div>
                <input type="range" value={rotateY} max="7" min="0"  step="0.1" 
                onChange={(e) =>{
                    setModelStatus({
                        ...modelStatus,
                        rotateY: e.target.value
                    })
                }} />
              </div>
        </div> : null
        }
        
         {
         modelImgUrl ?
         isFocused ? <img 
                            src={modelImgUrl}
                            onClick={() => {
                                setModelStatus({
                                    ...modelStatus,
                                    isFocused: false
                                })
                            }} 
                            className="text-lg border-solid border-4 border-green-400 w-4/12 h-full" />
            : <img 
                src={modelImgUrl} 
                onClick={() => { initFocused(); setModelStatus({
                    ...modelStatus,
                    isFocused: true
                }) }}  
                className="text-lg w-4/12 h-4/12 r-0 h-full" 
            />
        : null
        }




    </div>
}



export default ModelSettingBox;
