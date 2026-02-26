import { gql } from '../__generated__'
import {
  CreateMfaAuthenticatorMutation,
  CreateMfaAuthenticatorMutationVariables,
} from '../__generated__/graphql'
import { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

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
  const queryClient = useQueryClient()

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'account', 'mfa', 'factors'] })
    },
  })

  return { ...queryResult }
}
