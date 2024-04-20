import { UseQueryOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

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

export function useGetSession({
  sessionId,
  options,
}: {
  sessionId: string
  options?: UseQueryOptions<
    GetSessionQuery['accountGetSession'],
    AppwriteException,
    GetSessionQueryVariables,
    string[]
  >
}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery({
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
    ...options,
  })

  return { ...queryResult }
}
