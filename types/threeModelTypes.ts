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
    table2 = "table2",
    table3 = "table3",
    tableLamp = "tableLamp",
    sofa = "sofa",
    chair2 = "chair2",
    chair3 = "chair3",
    tv2 = "tv2",
    carpet3 = "carpet3",
    bed_1 = "bed1",
    bed_2 = "bed2",
    bed_3 = "bed3",
    vase_2 = "vase2",
    closet_1 = "closet1",
    clock_1 = "clock1",
    clock_2 = "clock2",
    text_board = "text_board",
    refrigerator_1 = "refrigerator1",
    refrigerator_2 = "refrigerator2",
  
  }

export interface UpdateModelStatusInput {
    modelName: modelNameTypes;
    index?: number;
    status: {
      installed: boolean;
      scale: number;
      rotateY: string;
      isFocused: boolean;
      position: { x: number, y: number, z:number },
      videoUrl?: string;
      imageUrl?: string;
      textContents?: string;
    }
  }

  

export interface ThreeModelOpts {
    modelStatus: any;
    setModelStatus: Function;
    installNum?: number;
    setInstallNum?: Function;
}

