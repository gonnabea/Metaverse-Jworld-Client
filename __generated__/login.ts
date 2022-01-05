/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LoginInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: login
// ====================================================

export interface login_login {
  __typename: "LoginOutput";
  ok: boolean;
  token: string | null;
  error: string | null;
}

export interface login {
  login: login_login;
}

export interface loginVariables {
  loginInput: LoginInput;
}
