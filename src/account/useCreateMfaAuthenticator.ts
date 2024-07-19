import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import {
  CreateMfaAuthenticatorMutation,
  CreateMfaAuthenticatorMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const accountCreateMfaAuthenticator = gql(/* GraphQL */ `
  mutation CreateMfaAuthenticator($type: String!) {
    accountCreateMfaAuthenticator(type: $type) {
      secret
      uri
    }
  }
`)

export function useCreateMfaAuthenticator() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    CreateMfaAuthenticatorMutation['accountCreateMfaAuthenticator'],
    AppwriteException[],
    CreateMfaAuthenticatorMutationVariables
  >({
    mutationFn: async ({ type = 'totp' }) => {
      const { data, errors } = await graphql.mutation({
        query: accountCreateMfaAuthenticator,
        variables: {
          type,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateMfaAuthenticator
    },
  })

  return { ...queryResult }
}
