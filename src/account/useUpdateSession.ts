import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { UpdateSessionMutation, UpdateSessionMutationVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateSession = gql(/* GraphQL */ `
  mutation UpdateSession($sessionId: String!) {
    accountUpdateSession(sessionId: $sessionId) {
      userId
      expire
      current
    }
  }
`)

export function useUpdateSession() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    UpdateSessionMutation['accountUpdateSession'],
    AppwriteException[],
    UpdateSessionMutationVariables
  >({
    mutationFn: async ({ sessionId }) => {
      const { data, errors } = await graphql.mutation({
        query: updateSession,
        variables: {
          sessionId,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateSession
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'account', 'sessions'] })
    },
  })

  return { ...queryResult }
}
