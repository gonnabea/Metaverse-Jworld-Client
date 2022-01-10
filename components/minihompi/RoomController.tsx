import { useEffect } from "react";

interface props {

    roomScale: number;
    setRoomScale: Function;
    backgroundColor?: string;
    initFocused?: any;
    maxScale?: number;
    minScale?: number;
    scaleStep?: number;
    setInstallNum?: Function;
    rerender?: any, 
    setRerender?: any
}



const RoomController = ({roomScale, setRoomScale}: props) => {



    return (
        <div>
            <input type="range" min={0.3} max={1} value={roomScale} step={0.1} onChange={(e) => {
                    
                    console.log(e)
                    setRoomScale(e.target.value)
                }}
               
            />
        </div>
    )
}

export default RoomController;