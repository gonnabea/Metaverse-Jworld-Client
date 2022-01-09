/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateMiniHompiInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createMiniHompi
// ====================================================

export interface createMiniHompi_createMiniHompi {
  __typename: "CreateMiniHompiOutput";
  ok: boolean;
  error: string | null;
}

export interface createMiniHompi {
  createMiniHompi: createMiniHompi_createMiniHompi;
}

export interface createMiniHompiVariables {
  createMiniHompiInput: CreateMiniHompiInput;
}
