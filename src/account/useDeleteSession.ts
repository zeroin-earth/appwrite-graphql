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

export function useDeleteSession() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    DeleteSessionMutation['accountDeleteSession'],
    AppwriteException,
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

      return data.accountDeleteSession
    },
  })

  return { ...queryResult }
}
