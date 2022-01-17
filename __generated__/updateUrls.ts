/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateUrlsInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: updateUrls
// ====================================================

export interface updateUrls_updateUrls {
  __typename: "UpdateUrlsOutput";
  ok: boolean;
  error: string | null;
}

export interface updateUrls {
  updateUrls: updateUrls_updateUrls;
}

export interface updateUrlsVariables {
  updateUrlsInput: UpdateUrlsInput;
}
