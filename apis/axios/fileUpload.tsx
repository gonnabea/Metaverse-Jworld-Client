import axios from 'axios';
import serverUrl from '../../config/urls';

export interface PostFileInput {

    fileForm: FormData;
  }
  
export interface PostFileOutput {
    ok: boolean;
    error?: string;
    status: number;
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
        })
}

export default fileApi;





// export const api = axios.create({
//     baseURL: "https://api.themoviedb.org/3/",
//     params: {
//       api_key: "6363d423c535019ac0a49bfc571cc2df",
//       language: "en-US",
//     },
//   })
  
//   export const moviesApi = {
//     nowPlaying: () =>
//       api.get("movie/now_playing", {
//         params: {
//           page: 1,
//         },
//       }),
//     upComing: () => api.get("movie/upcoming"),
//     popular: () => api.get("movie/popular"),
//     movieDetail: (id) =>
//       api.get(`movie/${id}`, {
//         params: {
//           append_to_response: "videos",
//         },
//       }),
//     search: (searchingBy) =>
//       api.get("search/movie", {
//         params: {
//           query: searchingBy,
//         },
//       }),
//     company: (id) => api.get(`company/${id}`),
//     credits: (id) => api.get(`/movie/${id}/credits`),
//     recommendations: (id) => api.get(`movie/${id}/recommendations`),
//     topRated: (page) =>
//       api.get("movie/top_rated", {
//         params: {
//           page: page,
//         },
//       }),
//   }
  
//   export const tvApi = {
//     topRated: () => api.get("tv/top_rated"),
//     popular: () => api.get("tv/popular"),
//     airingToday: () => api.get("tv/airing_today"),
//     showDetail: (id) =>
//       api.get(`tv/${id}`, {
//         params: {
//           append_to_response: "videos",
//         },
//       }),
//     search: (searchingBy) =>
//       api.get("search/tv", {
//         params: {
//           query: searchingBy,
//         },
//       }),
//     company: (id) => api.get(`company/${id}`),
//     credits: (id) => api.get(`tv/${id}/credits`),
//     recommendations: (id) => api.get(`tv/${id}/recommendations`),
//     onTheAir: (page) =>
//       api.get("tv/on_the_air", {
//         params: {
//           page: page,
//         },
//       }),
//   }
  
//   export const personApi = {
//     person: (id) => api.get(`person/${id}`),
//     search: (query) =>
//       api.get("search/person", {
//         params: {
//           query: query,
//         },
//       }),
//     movieAndTV: (id) => api.get(`person/${id}/combined_credits`),
//   }