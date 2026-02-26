import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import {
  UpdateEmailVerificationMutation,
  UpdateEmailVerificationMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateEmailVerification = gql(/* GraphQL */ `
  mutation UpdateEmailVerification($userId: String!, $secret: String!) {
    accountUpdateEmailVerification(userId: $userId, secret: $secret) {
      _id
      userId
      secret
      expire
    }
  }
`)

export function useUpdateEmailVerification() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    UpdateEmailVerificationMutation['accountUpdateEmailVerification'],
    AppwriteException[],
    UpdateEmailVerificationMutationVariables
  >({
    mutationFn: async ({ userId, secret }) => {
      const { data, errors } = await graphql.mutation({
        query: updateEmailVerification,
        variables: { userId, secret },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateEmailVerification
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
    },
  })

  return { ...queryResult }
}
