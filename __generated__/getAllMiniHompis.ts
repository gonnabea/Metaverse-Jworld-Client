/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllMiniHompis
// ====================================================

export interface getAllMiniHompis_getAllMiniHompis_miniHompis {
  __typename: "MiniHompi";
  id: number;
  createdAt: any;
  ownerId: number | null;
}

export interface getAllMiniHompis_getAllMiniHompis {
  __typename: "GetAllMiniHompiOutput";
  ok: boolean;
  error: string | null;
  miniHompis: getAllMiniHompis_getAllMiniHompis_miniHompis[] | null;
  hompisWithOwners: string | null;
}

export interface getAllMiniHompis {
  getAllMiniHompis: getAllMiniHompis_getAllMiniHompis;
}
