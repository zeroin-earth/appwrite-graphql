import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { CreateSessionMutation, CreateSessionMutationVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

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
  })

  return { ...queryResult }
}
