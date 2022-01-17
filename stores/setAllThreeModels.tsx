import { makeVar } from "@apollo/client";
import { AllModelsStatus } from "../data/modelList";
import { UpdateModelStatusInput } from "../types/threeModelTypes";


export const applyThreeModels = makeVar(AllModelsStatus);

export const setAllModelsStatus = async({modelName, index, status}: UpdateModelStatusInput) => {
  
  const originalModelsList = applyThreeModels();

  // 해당되는 상태 찾기
  originalModelsList[modelName][index] = status;
  
  applyThreeModels(originalModelsList)

 
}