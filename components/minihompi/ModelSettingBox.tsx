import { useReactiveVar } from "@apollo/client";
import { ReactElement, useEffect, useState } from "react";
import { applyThreeModels, setAllModelsStatus } from "../../stores/setAllThreeModels";
import { addModel } from "../../stores/ThreeModels";
import { modelNameTypes } from "../../types/threeModelTypes";





interface props {
    modelName: modelNameTypes;
    modelImgUrl?: string;
    backgroundColor?: string;
    initFocused?: any;
    maxScale?: number;
    minScale?: number;
    scaleStep?: number;
    setInstallNum?: Function;
    rerender?: any;
    setRerender?: any;
    setShowUpdateUrlUI: Function;
}


const ModelSettingBox = ({
    modelName, 
    backgroundColor, 
    initFocused,
    modelImgUrl,
    maxScale = 5,
    minScale = 0.1,
    scaleStep = 0.1,
    rerender, 
    setInstallNum,
    setRerender,
    setShowUpdateUrlUI
}:props
) => {

   

    const allModelsStatus = useReactiveVar(applyThreeModels);
   
    
    const {installed, scale, rotateY, isFocused, position } = allModelsStatus[modelName][0];

    const maxInstallNum = allModelsStatus[modelName].length
    let installedNum = allModelsStatus[modelName].filter(model => model.installed === true).length

    const checkFocused = () => {
        const findFocused = allModelsStatus[modelName].find(model => model.isFocused === true);
        if(findFocused !== undefined)
            return true
    }

    const findFocusedIndex = () => {
        const findFocusedIndex = allModelsStatus[modelName].findIndex(model => model.isFocused === true);

        let testIndex = 0
        allModelsStatus[modelName].forEach(model => {
            if(model.isFocused){
                console.log(testIndex)
            }
            testIndex +=1;
        })
        if(findFocusedIndex === -1)
            return 0

        return findFocusedIndex
    }

    const createModelStatus = async () => {
    
        allModelsStatus[modelName].map(({ position, installed, scale, rotateY, imageUrl, videoUrl, textContents }, index) => {
            
            const modelStatus = {
              name: modelName,
              position,
              installed,
              scale: {x: scale, y: scale, z: scale},
              rotateY,
              index,
              imageUrl,
              videoUrl,
              textContents
            }
            addModel(modelStatus)

        }) 
        
      }

    

    useEffect(() => {

    }, [])

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
                            
                            setRerender((value: number) => value +1)
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
                           
                            setRerender((value: number) => value +1)
                        }

                    createModelStatus()
                        
                      
                    }}>{installed ? <span className="text-bold text-green-500">ON</span> : "OFF"}</button>
                  </div>
            </div>

        <div className="flex flex-col">
        { scale ? <div className="">
        <span className="">
            {"크기"}
        </span>
             <div>
            
             <input type="range" value={allModelsStatus[modelName][findFocusedIndex()].scale} max={maxScale} min={minScale}  step={scaleStep} 
             onChange={(e) =>{
                //  setModelStatus({
                //     ...modelStatus,
                //     scale: e.target.value
                //  });
                console.log(findFocusedIndex())
                 setAllModelsStatus({
                    modelName,
                    index: findFocusedIndex(),
                    status: {
                        ...allModelsStatus[modelName][findFocusedIndex()],
                        scale: parseFloat(e.target.value),
                      
                        
                    }
                })
                createModelStatus()
                setRerender((value: number) => value +1)

                }}
                  
                  />
 
                  </div>
        </div> : null }

        { maxInstallNum > 1 ? <div className="">
        <span className="">
            {"개수"}
        </span>
             <div>
            
             <input type="range" value={installedNum} max={maxInstallNum} min={1} step={1} onChange={(e) =>{
                 const value = parseInt(e.target.value)
                 for(let i = 0 ; i <= maxInstallNum-1; i++) {
                     if(i < value){
                         setAllModelsStatus({
                             modelName,
                             index: i,
                             status: {
                                ...allModelsStatus[modelName][i],
                                installed: true
                             }
                         })
                     }
                     else {
                        setAllModelsStatus({
                            modelName,
                            index: i,
                            status: {
                               ...allModelsStatus[modelName][i],
                               installed: false
                            }
                        })
                     }

                 }

                 createModelStatus()
               
                setRerender((value: number) => value +1)
                 
             }} />
 
                  </div>
        </div> : null }

        { rotateY !== undefined ? <div>
            <span>
                {"회전"}
            </span>
             <div>
                <input type="range" value={allModelsStatus[modelName][findFocusedIndex()].rotateY} max="6.28" min="0"  step="0.02" 
                onChange={(e) =>{
                    // setModelStatus({
                    //     ...modelStatus,
                    //     rotateY: e.target.value
                    // })

                    setAllModelsStatus({
                        modelName,
                        index: findFocusedIndex(),
                        status: {
                            ...allModelsStatus[modelName][findFocusedIndex()],
                            rotateY: e.target.value,
                            
                            
                        }
                    })
                    createModelStatus()
                setRerender((value: number) => value +1)
                    console.log(e.target.value)
                }} />
              </div>
        </div> : null
        }
        </div>
         { // 포커싱 ON인 경우
         modelImgUrl ?
         checkFocused() ? <img 
                            src={modelImgUrl}
                            onClick={() => {

                                // 액자나 tv 모델 선택 해제할 경우
                                if(modelName === modelNameTypes.tv2 || modelName === modelNameTypes.frame1) {
                                   setShowUpdateUrlUI(false)
                                }
                                
                                // 포커싱 OFF 설정
                                allModelsStatus[modelName].map((model, index) => {
                                    setAllModelsStatus({
                                        modelName,
                                        index,
                                        status: {
                                            ...model,
                                            isFocused: false,
                                            
                                            
                                        }
                                    })

                                })
                                setRerender((value: number) => value +1)

                            }} 
                            className="text-lg border-solid border-4 r-0 border-green-400 w-20 h-20" />
            // 포커싱 OFF인 경우
            : <img 
                src={modelImgUrl} 
                onClick={() => { 
                    initFocused(); 
           
                    // 액자나 tv 모델을 선택할 경우 파일 업로드 UI 띄우기
                    if(modelName === modelNameTypes.tv2 || modelName === modelNameTypes.frame1) {
                       setShowUpdateUrlUI(true)
                    }
                    else {
                       setShowUpdateUrlUI(false)
                    }
                    // 포커싱 ON 설정
                    allModelsStatus[modelName].map((model, index) => {
                        setAllModelsStatus({
                            modelName,
                            index,
                            status: {
                                ...model,
                                isFocused: true,
                                
                                
                            }
                        })

                    })
                setRerender((value: number) => value +1)

            
            }}  
                className="text-lg w-24 r-0 h-24" 
            />
        : null
        }




    </div>
}



export default ModelSettingBox;
