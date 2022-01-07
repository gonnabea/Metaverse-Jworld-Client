import gql from "graphql-tag";

export const GETME = gql`
query getMe {
    getMe {
      ok
      error
      user {
          id
          email
          nickname
          miniHompiId
      }
    }
  }
`