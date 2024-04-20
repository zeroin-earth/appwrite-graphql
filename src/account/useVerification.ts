import { UseMutationOptions } from '@tanstack/react-query'
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

export function useVerification({
  options,
}: {
  options?: UseMutationOptions<
    UpdateVerificationMutation['accountUpdateVerification'],
    AppwriteException,
    UpdateVerificationMutationVariables,
    string[]
  >
}) {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation({
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
    ...options,
    onSuccess: async (token, variables, context) => {
      queryClient.setQueryData(['appwrite', 'account'], null)
      options?.onSuccess?.(token, variables, context)
    },
  })

  return { ...queryResult }
}
