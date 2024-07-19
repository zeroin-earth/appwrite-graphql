import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import {
  UpdatePhoneSessionMutation,
  UpdatePhoneSessionMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const updatePhoneSession = gql(/* GraphQL */ `
  mutation UpdatePhoneSession($userId: String!, $secret: String!) {
    accountUpdatePhoneSession(userId: $userId, secret: $secret) {
      userId
      expire
      current
    }
  }
`)

export function useUpdatePhoneSession() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    UpdatePhoneSessionMutation['accountUpdatePhoneSession'],
    AppwriteException[],
    UpdatePhoneSessionMutationVariables
  >({
    mutationFn: async ({ userId, secret }) => {
      const { data, errors } = await graphql.mutation({
        query: updatePhoneSession,
        variables: {
          userId,
          secret,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdatePhoneSession
    },
  })

  return { ...queryResult }
}
