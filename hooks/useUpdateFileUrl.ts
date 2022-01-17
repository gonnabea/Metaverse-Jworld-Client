import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useState, useCallback, useEffect } from 'react';
import { UPDATE_FILE_URL } from '../apis/gql-queries/threeModel';
import { AllModelsStatus } from '../data/modelList';
import { modelNameTypes } from '../types/common';

interface useUpdateFileUrlProps {
    imageUrl?: string;
    videoUrl?: string;
    name: string;
    id: number
}

function useUpdateFileUrl({imageUrl, videoUrl, name, id}: useUpdateFileUrlProps) {
    const [jwtToken, setToken] = useState<string | null>()

    const [reqUpdateUrl, {loading, error}] = useLazyQuery(UPDATE_FILE_URL, {
        context: {
            headers: {
                "Authorization":  "Bearer " + jwtToken
            },
            
        },
        variables: {
            imageUrl: imageUrl ? imageUrl : null,
            videoUrl: videoUrl ? videoUrl : null,
            name,
            id
        }
        
        
        
    })
    
    

    useEffect(() => {
        setToken(localStorage.getItem("jwt_token"))
    }, [])

    


    return [reqUpdateUrl, loading]

    
}

export default useUpdateFileUrl;