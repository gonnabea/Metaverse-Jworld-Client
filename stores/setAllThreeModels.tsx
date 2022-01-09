import { makeVar } from "@apollo/client";
import { AllModelsStatus } from "../data/modelList";
import { modelNameTypes } from "../types/common";



interface UpdateModelStatusInput {
  modelName: modelNameTypes;
  index?: number;
  status: {
    installed: boolean;
    scale: number;
    rotateY: string;
    isFocused: boolean;
    position: { x: number, y: number, z:number },
    videoUrl?: string;
    imageUrl?: string;
    textContents?: string;
  }
}

export const applyThreeModels = makeVar(AllModelsStatus);

export const setAllModelsStatus = async({modelName, index, status}: UpdateModelStatusInput) => {
  
  const originalModelsList = applyThreeModels();

  // 해당되는 상태 찾기
  originalModelsList[modelName][index] = status;
  
  applyThreeModels(originalModelsList)

 
}