import { gql } from '../__generated__'
import type {
  UpdateMagicUrlSessionMutation,
  UpdateMagicUrlSessionMutationVariables,
} from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateMagicURLSession = gql(/* GraphQL */ `
  mutation UpdateMagicURLSession($userId: String!, $secret: String!) {
    accountUpdateMagicURLSession(userId: $userId, secret: $secret) {
      userId
      expire
      current
    }
  }
`)

export function useUpdateMagicURLSession() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    UpdateMagicUrlSessionMutation['accountUpdateMagicURLSession'],
    AppwriteException[],
    UpdateMagicUrlSessionMutationVariables
  >({
    mutationFn: async ({ userId, secret }) => {
      const { data, errors } = await graphql.mutation({
        query: updateMagicURLSession,
        variables: {
          userId,
          secret,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateMagicURLSession
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
      void queryClient.invalidateQueries({ queryKey: ['appwrite', 'account', 'sessions'] })
    },
  })

  return { ...queryResult }
}
