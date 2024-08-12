import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { GetSessionQuery, GetSessionQueryVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const getSession = gql(/* GraphQL */ `
  query GetSession($sessionId: String!) {
    accountGetSession(sessionId: $sessionId) {
      userId
      expire
      current
    }
  }
`)

export function useGetSession({ sessionId }: GetSessionQueryVariables) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    GetSessionQuery['accountGetSession'],
    AppwriteException[],
    GetSessionQueryVariables
  >({
    queryKey: ['appwrite', 'account', 'session', sessionId],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: getSession,
        variables: { sessionId },
      })

      if (errors) {
        throw errors
      }

      return data.accountGetSession
    },
  })

  return queryResult
}
