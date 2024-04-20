import { UseMutationOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import {
  CreateEmailTokenMutation,
  CreateEmailTokenMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createEmailToken = gql(/* GraphQL */ `
  mutation CreateEmailToken($userId: String!, $email: String!, $phrase: Boolean) {
    accountCreateEmailToken(userId: $userId, email: $email, phrase: $phrase) {
      expire
    }
  }
`)

export function useCreateEmailToken({
  options,
}: {
  options?: UseMutationOptions<
    CreateEmailTokenMutation['accountCreateEmailToken'],
    AppwriteException,
    CreateEmailTokenMutationVariables,
    string[]
  >
}) {
  const { graphql } = useAppwrite()

  const queryResult = useMutation({
    mutationFn: async ({ userId, email, phrase }) => {
      const { data, errors } = await graphql.mutation({
        query: createEmailToken,
        variables: {
          userId,
          email,
          phrase,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateEmailToken
    },
    ...options,
  })

  return { ...queryResult }
}
