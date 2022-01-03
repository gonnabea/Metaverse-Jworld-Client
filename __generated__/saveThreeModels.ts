/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SaveThreeModelInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: saveThreeModels
// ====================================================

export interface saveThreeModels_saveThreeModels {
  __typename: "SaveThreeModelOutput";
  ok: boolean;
}

export interface saveThreeModels {
  saveThreeModels: saveThreeModels_saveThreeModels;
}

export interface saveThreeModelsVariables {
  models: SaveThreeModelInput;
}
