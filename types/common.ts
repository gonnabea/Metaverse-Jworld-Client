export interface XYZType {
    x: number;
    y: number;
    z: number;
}

export interface ThreeModelOpts {
    installed: boolean; // 모델 설치 or 미설치
    scale: number;
    isFocused: boolean;
    rotateY: number;
    saveModels: boolean;
    position: XYZType;
    setPosition: Function;
}
