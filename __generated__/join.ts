/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: join
// ====================================================

export interface join_join {
  __typename: "JoinOutput";
  ok: boolean;
  error: string | null;
}

export interface join {
  join: join_join;
}

export interface joinVariables {
  email: string;
  nickname: string;
  password: string;
  password2: string;
}
