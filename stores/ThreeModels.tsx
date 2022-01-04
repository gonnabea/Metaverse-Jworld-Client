import { makeVar } from "@apollo/client";
import { ThreeModelInput } from "../__generated__/globalTypes";

export const applyModels = makeVar({ modelsStatus: [] });

export const addModel = (model: ThreeModelInput) => {
    const newModelsList = [...applyModels().modelsStatus, model];
    alert(JSON.stringify(newModelsList))
    applyModels({ modelsStatus: [...applyModels().modelsStatus, model]})
}

export const setModels = async(modelsStatus: ThreeModelInput[]) => {

  await applyModels({ modelsStatus })

  
}

export const getModels = () => {
  return applyModels().modelsStatus
}