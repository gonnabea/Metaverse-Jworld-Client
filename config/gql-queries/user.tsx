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

export const JOIN = gql`
mutation join($email: String!, $nickname: String!, $password: String!, $password2: String!) {
  join(input:{email: $email, nickname: $nickname, password: $password, password2: $password2}) {
    ok,
    error
  }
}
`