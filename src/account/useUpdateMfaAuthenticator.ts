import { gql } from '../__generated__'
import type {
  UpdateMfaAuthenticatorMutation,
  UpdateMfaAuthenticatorMutationVariables,
} from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateMFAAuthenticator = gql(/* GraphQL */ `
  mutation UpdateMfaAuthenticator($type: String!, $otp: String!) {
    accountUpdateMfaAuthenticator(type: $type, otp: $otp) {
      mfa
    }
  }
`)

export function useUpdateMfaAuthenticator() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

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
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
      void queryClient.invalidateQueries({ queryKey: ['appwrite', 'account', 'mfa', 'factors'] })
    },
  })

  return { ...queryResult }
}
