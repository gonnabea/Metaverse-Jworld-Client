import gql from "graphql-tag"

export const GET_ROOMSTATUS = gql`
query getMiniHompi($id: Float!){
  getMiniHompi(input: {
    id: $id
  }) {
    ok
    error
    miniHompi{
      ownerId
      id
      scale
    }
  }
}
`




export const GET_THREE_MODELS = gql`
query getThreeModels($id: Float!) {
  getThreeModels(input: {
    id: $id
  }) {
    ok
    error
    models{
      name
      id
      installed
      scale
      rotateY
      position
      index
      imageUrl
      videoUrl
      textContents
    }
  }
}
`

export const SAVE_MODELS = gql`

mutation saveThreeModels($saveThreeModelInput: SaveThreeModelInput!) {
  saveThreeModels(input:$saveThreeModelInput) {
    ok
  }
}
`

export const GETROOMS = gql`
  query getAllMiniHompis {
    getAllMiniHompis {
          ok
          error
          miniHompis {
              id
              createdAt
              ownerId
          }
          hompisWithOwners
      }
  }
`

export const CREATEHOMPI = gql`
mutation createMiniHompi($createMiniHompiInput: CreateMiniHompiInput!) {
    createMiniHompi(input: $createMiniHompiInput) {
      ok
      error
      
    }
  }
`