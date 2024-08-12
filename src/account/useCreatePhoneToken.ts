import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import {
  CreatePhoneTokenMutation,
  CreatePhoneTokenMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createPhoneToken = gql(/* GraphQL */ `
  mutation CreatePhoneToken($userId: String!, $phone: String!) {
    accountCreatePhoneToken(userId: $userId, phone: $phone) {
      expire
    }
  }
`)

export function useCreatePhoneToken() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    CreatePhoneTokenMutation['accountCreatePhoneToken'],
    AppwriteException[],
    CreatePhoneTokenMutationVariables
  >({
    mutationFn: async ({ userId, phone }) => {
      const { data, errors } = await graphql.mutation({
        query: createPhoneToken,
        variables: {
          userId,
          phone,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreatePhoneToken
    },
  })

  return { ...queryResult }
}
