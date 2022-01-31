import axios from 'axios';
import { serverUrl } from '../../config/urls';

export interface PostFileInput {

    fileForm: FormData;
  }
  
export interface PostFileOutput {
    ok: boolean;
    error?: string;
    status: number;
}  

export interface GetFileInput {
    ownerId: number;
}

export interface GetFileOutput {
    ok: boolean;
    error?: string;
    status: number;
    data: any;
}

const api = axios.create({
    baseURL: serverUrl,
    
})

const fileApi = {
    uploadImg: async ({ fileForm }:PostFileInput) => {
        await api.post("file/image_upload", fileForm, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
            }
        })

    }

    ,
    uploadVideo: async ({ fileForm }:PostFileInput) =>
        await api.post("file/video_upload", fileForm, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
            }
        }),

    getImages: async ({ ownerId }:GetFileInput) => {
        console.log(ownerId)
        const {data} =  await api.get(`file/image_get`, {
            params: {
                ownerId
            }
        })
        return data
    },

    getVideos: async ({ ownerId }:GetFileInput) => {
        const {data} = await api.get("file/video_get", {
            params: {
                ownerId
            }
        })
        return data
    }
}

export default fileApi;


