import { UseMutationOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import {
  CreateMagicUrlTokenMutation,
  CreateMagicUrlTokenMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createMagicURLToken = gql(/* GraphQL */ `
  mutation CreateMagicURLToken($userId: String!, $email: String!, $url: String, $phrase: Boolean) {
    accountCreateMagicURLToken(userId: $userId, email: $email, url: $url, phrase: $phrase) {
      expire
    }
  }
`)

export function useCreateMagicURLToken({
  options,
}: {
  options?: UseMutationOptions<
    CreateMagicUrlTokenMutation['accountCreateMagicURLToken'],
    AppwriteException,
    CreateMagicUrlTokenMutationVariables,
    string[]
  >
}) {
  const { graphql } = useAppwrite()

  const queryResult = useMutation({
    mutationFn: async ({ userId, email, url, phrase }) => {
      const { data, errors } = await graphql.mutation({
        query: createMagicURLToken,
        variables: {
          userId,
          email,
          url,
          phrase,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateMagicURLToken
    },
    ...options,
  })

  return { ...queryResult }
}
