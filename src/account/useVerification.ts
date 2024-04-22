import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import {
  Token,
  UpdateVerificationMutation,
  UpdateVerificationMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateVerification = gql(/* GraphQL */ `
  mutation UpdateVerification($userId: String!, $secret: String!) {
    accountUpdateVerification(userId: $userId, secret: $secret) {
      expire
    }
  }
`)

export function useVerification() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    UpdateVerificationMutation['accountUpdateVerification'],
    AppwriteException,
    UpdateVerificationMutationVariables
  >({
    mutationFn: async ({ userId, secret }) => {
      if (!userId || !secret) {
        throw new Error('Missing userId or secret')
      }

      const { data, errors } = await graphql.mutation({
        query: updateVerification,
        variables: {
          userId,
          secret,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateVerification ?? ({} as Token)
    },
    onSuccess: async () => {
      queryClient.setQueryData(['appwrite', 'account'], null)
    },
  })

  return { ...queryResult }
}
