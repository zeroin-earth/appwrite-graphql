import { UseMutationOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

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

export function useUpdateMfaAuthenticator({
  options,
}: {
  options?: UseMutationOptions<
    UpdateMfaAuthenticatorMutation['accountUpdateMfaAuthenticator'],
    AppwriteException,
    UpdateMfaAuthenticatorMutationVariables,
    string[]
  >
}) {
  const { graphql } = useAppwrite()

  const queryResult = useMutation({
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
    ...options,
  })

  return { ...queryResult }
}
