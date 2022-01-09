/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMiniHompi
// ====================================================

export interface getMiniHompi_getMiniHompi_miniHompi {
  __typename: "MiniHompi";
  ownerId: number | null;
  id: number;
  scale: any;
}

export interface getMiniHompi_getMiniHompi {
  __typename: "GetMiniHompiOutput";
  ok: boolean;
  error: string | null;
  miniHompi: getMiniHompi_getMiniHompi_miniHompi | null;
}

export interface getMiniHompi {
  getMiniHompi: getMiniHompi_getMiniHompi;
}

export interface getMiniHompiVariables {
  id: number;
}
