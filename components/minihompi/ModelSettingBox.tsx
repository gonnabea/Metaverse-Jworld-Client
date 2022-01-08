import { useReactiveVar } from "@apollo/client";
import { ReactElement, useEffect, useState } from "react";
import { applyThreeModels, setAllModelsStatus } from "../../stores/setAllThreeModels";
import { modelNameTypes } from "../../types/common";



interface props {
    modelName: modelNameTypes;
    modelImgUrl?: string;
    backgroundColor?: string;
    initFocused?: any;
    maxScale?: number;
    minScale?: number;
    scaleStep?: number;
    installNum?: number;
    setInstallNum?: Function;
    rerender?: any, 
    setRerender?: any
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
    rerender, 
    setInstallNum,
    setRerender
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

    const allModelsStatus = useReactiveVar(applyThreeModels);
    const [checkStatusChanged, setCheckStatusChanged] = useState(0)
    
    const {installed, scale, rotateY, isFocused, position } = allModelsStatus[modelName][0];

    useEffect(() => {

    }, [checkStatusChanged])

   return <div className={`bg-${backgroundColor}-200 border-4 border-light-blue-500 flex items-center justify-between`}>

                 
           <div className="w-3/12 flex flex-col items-center justify-center">
            <span className="">
                {""}
            </span>
                <div>
                    <button className="text-lg text-bold text-black" 
                      onClick={() => {
                        console.log("installed: " + installed)
                        // 중복 포커싱 방지
                        if(isFocused === false) initFocused ? initFocused() : null; 

                  
                        if(!installed){
                            // setModelStatus({
                            //     ...modelStatus,
                            //     installed: true,
                            //     isFocused: true
                            // });

                            setAllModelsStatus({
                                modelName,
                                index: 0,
                                status: {
                                    installed: true,
                                    scale,
                                    rotateY,
                                    isFocused: true,
                                    position,
                                    
                                }
                            })
                            
                            setRerender(value => value +1)
                        }
                        else{
                            // setModelStatus({
                            //     ...modelStatus,
                            //     installed: false,
                            //     isFocused: false
                            // });
                            setAllModelsStatus({
                                modelName,
                                index: 0,
                                status: {
                                    installed: false,
                                    scale,
                                    rotateY,
                                    isFocused: false,
                                    position,
                                    
                                }
                            })
                           
                            setRerender(value => value +1)
                        }

                        
                      
                    }}>{installed ? "ON" : "OFF"}</button>
                  </div>
            </div>

        <div className="flex flex-col">
        { scale ? <div className="">
        <span className="">
            {"크기"}
        </span>
             <div>
            
             <input type="range" value={scale} max={maxScale} min={minScale}  step={scaleStep} onChange={(e) =>{
                //  setModelStatus({
                //     ...modelStatus,
                //     scale: e.target.value
                //  });

                 setAllModelsStatus({
                    modelName,
                    index: 0,
                    status: {
                        installed,
                        scale: parseFloat(e.target.value),
                        rotateY,
                        isFocused,
                        position,
                        
                    }
                })
               
                setRerender(value => value +1)

                }}
                  
                  />
 
                  </div>
        </div> : null }

        { installNum !== undefined ? <div className="">
        <span className="">
            {"개수"}
        </span>
             <div>
            
             <input type="range" value={installNum} max={4} min={1}  step={1} onChange={(e) =>{{setInstallNum(e.target.value)}; console.log(e.target.value)}} />
 
                  </div>
        </div> : null }

        { rotateY !== undefined ? <div>
            <span>
                {"회전"}
            </span>
             <div>
                <input type="range" value={rotateY} max="7" min="0"  step="0.1" 
                onChange={(e) =>{
                    // setModelStatus({
                    //     ...modelStatus,
                    //     rotateY: e.target.value
                    // })

                    setAllModelsStatus({
                        modelName,
                        index: 0,
                        status: {
                            installed,
                            scale,
                            rotateY: e.target.value,
                            isFocused,
                            position,
                            
                        }
                    })

                setRerender(value => value +1)
                    console.log(e.target.value)
                }} />
              </div>
        </div> : null
        }
        </div>
         {
         modelImgUrl ?
         isFocused ? <img 
                            src={modelImgUrl}
                            onClick={() => {
                                // setModelStatus({
                                //     ...modelStatus,
                                //     isFocused: false
                                // })
                                setAllModelsStatus({
                                    modelName,
                                    index: 0,
                                    status: {
                                        installed,
                                        scale,
                                        rotateY,
                                        isFocused: false,
                                        position,
                                        
                                    }
                                })
                                setRerender(value => value +1)

                            }} 
                            className="text-lg border-solid border-4 r-0 border-green-400 w-20 h-20" />
            : <img 
                src={modelImgUrl} 
                onClick={() => { initFocused(); 
                //     setModelStatus({
                //     ...modelStatus,
                //     isFocused: true
                // }) 
                setAllModelsStatus({
                    modelName,
                    index: 0,
                    status: {
                        installed,
                        scale,
                        rotateY,
                        isFocused: true,
                        position,
                        
                    }
                })
                setRerender(value => value +1)

            
            }}  
                className="text-lg w-24 r-0 h-24" 
            />
        : null
        }




    </div>
}



export default ModelSettingBox;
