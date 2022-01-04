import { makeVar } from "@apollo/client";
import { ThreeModelInput } from "../__generated__/globalTypes";

export const applyModels = makeVar({ modelsStatus: [] });

export const currentModelsStatus = applyModels().modelsStatus

export const addModel = (model: ThreeModelInput) => {
    currentModelsStatus.push(model)
}

export const setModels = async(modelsStatus: ThreeModelInput[]) => {

  await applyModels({ modelsStatus })
}