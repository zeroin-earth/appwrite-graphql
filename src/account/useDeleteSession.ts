import { UseMutationOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { DeleteSessionMutation, DeleteSessionMutationVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const deleteSession = gql(/* GraphQL */ `
  mutation DeleteSession($sessionId: String!) {
    accountDeleteSession(sessionId: $sessionId) {
      status
    }
  }
`)

export function useDeleteSession({
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

  const queryResult = useMutation({
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

      return data.accountDeleteSession
    },
    ...options,
  })

  return { ...queryResult }
}
