import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import {
  UpdateMfaAuthenticatorMutation,
  UpdateMfaAuthenticatorMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const updateMFAAuthenticator = gql(/* GraphQL */ `
  mutation UpdateMfaAuthenticator($type: String!, $otp: String!) {
    accountUpdateMfaAuthenticator(type: $type, otp: $otp) {
      mfa
    }
  }
`)

export function useUpdateMfaAuthenticator() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    UpdateMfaAuthenticatorMutation['accountUpdateMfaAuthenticator'],
    AppwriteException[],
    UpdateMfaAuthenticatorMutationVariables
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

      return data.accountUpdateMfaAuthenticator
    },
  })

  return { ...queryResult }
}
