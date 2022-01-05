export interface XYZType {
    x: number;
    y: number;
    z: number;
}



export interface ThreeModelOpts {
    installed: boolean;
    scale: XYZType;
    isFocused:  boolean;
    rotateY: string;
    position: XYZType;
    setPosition: Function;
    installNum?: number;
    setInstallNum?: Function;
}
