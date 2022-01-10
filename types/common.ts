export interface XYZType {
    x: number;
    y: number;
    z: number;
}



export interface ThreeModelOpts {
    modelStatus: any;
    setModelStatus: Function;
    installNum?: number;
    setInstallNum?: Function;
}


export enum modelNameTypes {
    room = 'room',
    carpet1 = 'carpet1',    
    carpet2 = 'carpet2',
    tv = 'tv',
    standingLamp = 'standingLamp',
    vase = 'vase',
    book = 'book',
    chair = "chair",
    curtain = "curtain",
    frame1= "frame1",
    frame2 = "frame2",
    table1 = "table1",
    tableLamp = "tableLamp",
    sofa = "sofa",
    chair2 = "chair2",
    tv2 = "tv2",
  
  }

  export interface RerenderType {
      rerender: number;
      setRerender: Function;
  }