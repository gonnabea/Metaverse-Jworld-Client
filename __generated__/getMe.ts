/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMe
// ====================================================

export interface getMe_getMe_user {
  __typename: "User";
  id: number;
  email: string;
  nickname: string;
  miniHompiId: number | null;
}

export interface getMe_getMe {
  __typename: "GetMeOutput";
  ok: boolean;
  error: string | null;
  user: getMe_getMe_user;
}

export interface getMe {
  getMe: getMe_getMe;
}
