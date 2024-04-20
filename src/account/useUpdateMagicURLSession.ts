import { UseMutationOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import {
  UpdateMagicUrlSessionMutation,
  UpdateMagicUrlSessionMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const updateMagicURLSession = gql(/* GraphQL */ `
  mutation UpdateMagicURLSession($userId: String!, $secret: String!) {
    accountUpdateMagicURLSession(userId: $userId, secret: $secret) {
      userId
      expire
      current
    }
  }
`)

export function useUpdateMagicURLSession({
  options,
}: {
  options?: UseMutationOptions<
    UpdateMagicUrlSessionMutation['accountUpdateMagicURLSession'],
    AppwriteException,
    UpdateMagicUrlSessionMutationVariables,
    string[]
  >
}) {
  const { graphql } = useAppwrite()

  const queryResult = useMutation({
    mutationFn: async ({ userId, secret }) => {
      const { data, errors } = await graphql.mutation({
        query: updateMagicURLSession,
        variables: {
          userId,
          secret,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateMagicURLSession
    },
    ...options,
  })

  return { ...queryResult }
}
