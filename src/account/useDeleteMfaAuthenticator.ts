import { gql } from '../__generated__'
import type {
  DeleteMfaAuthenticatorMutation,
  DeleteMfaAuthenticatorMutationVariables,
} from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const deleteMFAAuthenticator = gql(/* GraphQL */ `
  mutation DeleteMfaAuthenticator($type: String!) {
    accountDeleteMfaAuthenticator(type: $type) {
      status
    }
  }
`)

export function useDeleteMfaAuthenticator() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    DeleteMfaAuthenticatorMutation['accountDeleteMfaAuthenticator'],
    AppwriteException[],
    DeleteMfaAuthenticatorMutationVariables
  >({
    mutationFn: async ({ type = 'totp' }) => {
      const { data, errors } = await graphql.mutation({
        query: deleteMFAAuthenticator,
        variables: {
          type,
        },
      })

      if (errors) {
        throw errors
      }

      return data?.accountDeleteMfaAuthenticator ?? { status: '' }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
      void queryClient.invalidateQueries({
        queryKey: ['appwrite', 'account', 'mfa', 'factors'],
      })
    },
  })

  return { ...queryResult }
}
