import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { DeleteSessionMutation, DeleteSessionMutationVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const deleteSession = gql(/* GraphQL */ `
  mutation DeleteSession($sessionId: String!) {
    accountDeleteSession(sessionId: $sessionId) {
      status
    }
  }
`)

export function useDeleteSession() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    DeleteSessionMutation['accountDeleteSession'],
    AppwriteException[],
    DeleteSessionMutationVariables
  >({
    mutationFn: async ({ sessionId }) => {
      const { data, errors } = await graphql.mutation({
        query: deleteSession,
        variables: {
          sessionId,
        },
      })

      if (errors) {
        throw errors
      }

      return data?.accountDeleteSession ?? { status: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'account', 'sessions'] })
    },
  })

  return { ...queryResult }
}
