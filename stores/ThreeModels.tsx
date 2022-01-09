import { makeVar } from "@apollo/client";
import { ThreeModelInput } from "../__generated__/globalTypes";

export const applyModels = makeVar({ modelsStatus: [] });

export const addModel = (newModel: ThreeModelInput) => {
    const originalModelsList:ThreeModelInput[] | [] = applyModels().modelsStatus;
  

    if(originalModelsList.length > 0) {
      // const removeDuplicated = originalModelsList.filter(model => model.name !== newModel.name)

      const removeDuplicated:ThreeModelInput[] | [] = []
      originalModelsList.forEach(model => {
        // 새로운 모델과 중복되는 모델은 비우기
        if(model.name !== newModel.name || model.index !== newModel.index) {
          removeDuplicated.push(model)
        }
        
      })

      // 중복되는 모델 비운 리스트와 새로운 모델 합치고 저장하기
      applyModels({ modelsStatus: [...removeDuplicated, newModel]})
      
      return null
    }
    // 첫 모델 적용
    applyModels({ modelsStatus: [newModel]})
}

export const setModels = (modelsStatus: ThreeModelInput[]) => {

  applyModels({ modelsStatus })


}

export const getModels = () => {
  return applyModels().modelsStatus
}