import gql from 'graphql-tag';
import { useState, useCallback } from 'react';

const SAVETHREEMODEL = gql`

`

interface SaveModelProps {
    name: string;
    installed: boolean;
    scale: {x: number, y: number, z:number};
    rotateY: number;
    price?: number;
}

function useModelStatus({installed, scale, rotateY, name, price}: SaveModelProps) {
    // const [installed, setInstalled] = useState()
    // const [scale, setScale] = useState()
    // const [rotateY, setRotateY] = useState()

    const modelStatus = {
        installed,
        scale,
        rotateY,
        name,
        
    }

    


    

    
}

export default useModelStatus;