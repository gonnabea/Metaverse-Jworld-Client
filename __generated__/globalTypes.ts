/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface LoginInput {
  email: string;
  password: string;
}

export interface SaveThreeModelInput {
  models: ThreeModelInput[];
}

export interface ThreeModelInput {
  name: string;
  position: any;
  scale: any;
  rotateX: number;
  installed: boolean;
  price?: number | null;
  videoUrl?: string | null;
  imageUrl?: string | null;
  textContents?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
