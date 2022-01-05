import { makeVar } from "@apollo/client";
import { ThreeModelInput } from "../__generated__/globalTypes";

export const applyModels = makeVar({ modelsStatus: [] });

export const addModel = (newModel: ThreeModelInput) => {
    const originalModelsList:ThreeModelInput[] | [] = applyModels().modelsStatus;
  

    if(originalModelsList.length > 0) {
      const removeDuplicated = originalModelsList.filter(model => model.name !== newModel.name)
      applyModels({ modelsStatus: [...removeDuplicated, newModel]})
      
      return null
    }

    applyModels({ modelsStatus: [...originalModelsList, newModel]})
}

export const setModels = async(modelsStatus: ThreeModelInput[]) => {

  await applyModels({ modelsStatus })


}

export const getModels = () => {
  return applyModels().modelsStatus
}