import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import {
  DeleteMfaAuthenticatorMutation,
  DeleteMfaAuthenticatorMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const updateMFAAuthenticator = gql(/* GraphQL */ `
  mutation DeleteMfaAuthenticator($type: String!, $otp: String!) {
    accountDeleteMfaAuthenticator(type: $type, otp: $otp) {
      mfa
    }
  }
`)

export function useDeleteMfaAuthenticator() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    DeleteMfaAuthenticatorMutation['accountDeleteMfaAuthenticator'],
    AppwriteException[],
    DeleteMfaAuthenticatorMutationVariables
  >({
    mutationFn: async ({ type = 'totp', otp }) => {
      const { data, errors } = await graphql.mutation({
        query: updateMFAAuthenticator,
        variables: {
          type,
          otp,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountDeleteMfaAuthenticator
    },
  })

  return { ...queryResult }
}
