import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { DeleteSessionsMutation } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const deleteSessions = gql(/* GraphQL */ `
  mutation DeleteSessions {
    accountDeleteSessions {
      status
    }
  }
`)

export function useDeleteSessions() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    DeleteSessionsMutation['accountDeleteSessions'],
    AppwriteException,
    void
  >({
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: deleteSessions,
      })

      if (errors) {
        throw errors
      }

      return data?.accountDeleteSessions ?? { status: false }
    },
  })

  return { ...queryResult }
}
