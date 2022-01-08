import gql from 'graphql-tag';
import { useState, useCallback, useEffect } from 'react';
import { AllModelsStatus } from '../data/modelList';
import { modelNameTypes } from '../types/common';

const SAVETHREEMODEL = gql`

`

interface UseModelProps {
    name: modelNameTypes;
    index: number;
}

function useModelStatus({name, index=0}: UseModelProps) {
    

    const [modelStatus, setModelStatus] = useState(AllModelsStatus[name][index])

    useEffect(() => {
       
    }, [])

    


    return [modelStatus, setModelStatus]

    
}

export default useModelStatus;