import gql from 'graphql-tag'
import { client } from 'src/utils/apolloClient'

const FETCH_USER = gql`
  query($userId: String!) {
    getUser(userId: $userId) {
      catchmentArea {
        id
        name
        status
      }
      primaryOffice {
        id
        name
        status
      }
    }
  }
`
async function fetchUserDetails(userId: string) {
  return client.query({
    query: FETCH_USER,
    variables: { userId }
  })
}

export const queries = {
  fetchUserDetails
}