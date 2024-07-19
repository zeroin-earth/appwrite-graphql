import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import {
  UpdatePhoneVerificationMutation,
  UpdatePhoneVerificationMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const updatePhoneVerification = gql(/* GraphQL */ `
  mutation UpdatePhoneVerification($userId: String!, $secret: String!) {
    accountUpdatePhoneVerification(userId: $userId, secret: $secret) {
      expire
    }
  }
`)

export function useUpdatePhoneVerification() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    UpdatePhoneVerificationMutation['accountUpdatePhoneVerification'],
    AppwriteException[],
    UpdatePhoneVerificationMutationVariables
  >({
    mutationFn: async ({ userId, secret }) => {
      const { data, errors } = await graphql.mutation({
        query: updatePhoneVerification,
        variables: {
          userId,
          secret,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdatePhoneVerification
    },
  })

  return { ...queryResult }
}
