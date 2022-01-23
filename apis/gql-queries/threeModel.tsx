import { gql } from "apollo-boost";


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