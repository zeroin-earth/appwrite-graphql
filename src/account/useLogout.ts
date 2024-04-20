import { UseMutationOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

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

export function useLogout({
  options,
}: {
  options?: UseMutationOptions<
    DeleteSessionMutation['accountDeleteSession'],
    AppwriteException,
    DeleteSessionMutationVariables,
    string[]
  >
}) {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation({
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: deleteSession,
        variables: {
          sessionId: 'current',
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountDeleteSession
    },
    ...options,
    onSuccess: async (status, variables, context) => {
      queryClient.setQueryData(['appwrite', 'account'], null)
      queryClient.removeQueries({ queryKey: ['appwrite', 'account'] })
      options?.onSuccess?.(status, variables, context)
    },
  })

  return { ...queryResult }
}
