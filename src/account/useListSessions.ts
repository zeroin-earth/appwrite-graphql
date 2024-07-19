import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { ListSessionsQuery } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const accountListSessions = gql(/* GraphQL */ `
  query ListSessions {
    accountListSessions {
      sessions {
        _id
        _createdAt
        osName
        clientName
      }
    }
  }
`)

export function useListSessions() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    ListSessionsQuery['accountListSessions'],
    AppwriteException[],
    ListSessionsQuery['accountListSessions']
  >({
    queryKey: ['appwrite', 'account', 'sessions'],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: accountListSessions,
      })

      if (errors) {
        throw errors
      }

      return data.accountListSessions
    },
  })

  return { ...queryResult }
}
