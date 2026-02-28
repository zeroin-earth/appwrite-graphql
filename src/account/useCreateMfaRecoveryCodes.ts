import { gql } from '../__generated__'
import type { CreateMfaRecoveryCodesMutation } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountCreateMfaRecoveryCodes = gql(/* GraphQL */ `
  mutation CreateMfaRecoveryCodes {
    accountCreateMfaRecoveryCodes {
      recoveryCodes
    }
  }
`)

export function useCreateMfaRecoveryCodes() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    CreateMfaRecoveryCodesMutation['accountCreateMfaRecoveryCodes'],
    AppwriteException[]
  >({
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: accountCreateMfaRecoveryCodes,
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateMfaRecoveryCodes
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['appwrite', 'account', 'mfa', 'recovery-codes'],
      })
    },
  })

  return { ...queryResult }
}
