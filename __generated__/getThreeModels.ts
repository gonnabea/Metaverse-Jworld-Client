/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getThreeModels
// ====================================================

export interface getThreeModels_getThreeModels_models {
  __typename: "ThreeModel";
  name: string;
  id: number;
  installed: boolean;
  scale: any;
  rotateY: string;
  position: any;
  index: number | null;
}

export interface getThreeModels_getThreeModels {
  __typename: "GetThreeModelsOutput";
  ok: boolean;
  error: string | null;
  models: getThreeModels_getThreeModels_models[] | null;
}

export interface getThreeModels {
  getThreeModels: getThreeModels_getThreeModels;
}

export interface getThreeModelsVariables {
  id: number;
}
