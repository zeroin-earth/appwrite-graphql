import { gql } from '../__generated__'
import type {
  CreateSessionMutation,
  CreateSessionMutationVariables,
} from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const createSession = gql(/* GraphQL */ `
  mutation CreateSession($userId: String!, $secret: String!) {
    accountCreateSession(userId: $userId, secret: $secret) {
      userId
      expire
      current
    }
  }
`)

export function useCreateSession() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    CreateSessionMutation['accountCreateSession'],
    AppwriteException[],
    CreateSessionMutationVariables
  >({
    mutationFn: async ({ userId, secret }) => {
      const { data, errors } = await graphql.mutation({
        query: createSession,
        variables: {
          userId,
          secret,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateSession
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
      void queryClient.invalidateQueries({ queryKey: ['appwrite', 'account', 'sessions'] })
    },
  })

  return { ...queryResult }
}
