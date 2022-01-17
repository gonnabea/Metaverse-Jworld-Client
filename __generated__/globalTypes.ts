/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface CreateMiniHompiInput {
  scale: any;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SaveThreeModelInput {
  models: ThreeModelInput[];
}

export interface ThreeModelInput {
  name: string;
  index?: number | null;
  position: any;
  scale: any;
  rotateY: string;
  installed: boolean;
  price?: number | null;
  videoUrl?: string | null;
  imageUrl?: string | null;
  textContents?: string | null;
}

export interface UpdateUrlsInput {
  name: string;
  index?: number | null;
  videoUrl?: string | null;
  imageUrl?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
