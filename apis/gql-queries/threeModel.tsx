import { gql } from "apollo-boost";


interface UpdateUrlsInput {
    imageUrl?: string;
    videoUrl?: string;
    name: string;
    id: number;
}


export const UPDATE_FILE_URL = gql`
mutation updateUrls($updateUrlsInput: UpdateUrlsInput!){
    updateUrls(input: $updateUrlsInput) {
    ok
    error
  }
}
`

// export const SAVE_MODELS = gql`

// mutation saveThreeModels($saveThreeModelInput: SaveThreeModelInput!) {
//   saveThreeModels(input:$saveThreeModelInput) {
//     ok
//   }
// }
// `