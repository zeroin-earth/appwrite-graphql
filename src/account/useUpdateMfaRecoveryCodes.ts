import { gql } from '../__generated__'
import type { UpdateMfaRecoveryCodesMutation } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountUpdateMfaRecoveryCodes = gql(/* GraphQL */ `
  mutation UpdateMfaRecoveryCodes {
    accountUpdateMfaRecoveryCodes {
      recoveryCodes
    }
  }
`)

export function useUpdateMfaRecoveryCodes() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    UpdateMfaRecoveryCodesMutation['accountUpdateMfaRecoveryCodes'],
    AppwriteException[]
  >({
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdateMfaRecoveryCodes,
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateMfaRecoveryCodes
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['appwrite', 'account', 'mfa', 'recovery-codes'],
      })
    },
  })

  return { ...queryResult }
}
