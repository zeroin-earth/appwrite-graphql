import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { DeleteSessionsMutation } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const deleteSessions = gql(/* GraphQL */ `
  mutation DeleteSessions {
    accountDeleteSessions {
      status
    }
  }
`)

export function useDeleteSessions() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    DeleteSessionsMutation['accountDeleteSessions'],
    AppwriteException[]
  >({
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: deleteSessions,
      })

      if (errors) {
        throw errors
      }

      return data?.accountDeleteSessions ?? { status: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'account', 'sessions'] })
    },
  })

  return { ...queryResult }
}
