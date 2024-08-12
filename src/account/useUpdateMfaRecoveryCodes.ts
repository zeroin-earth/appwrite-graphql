import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { UpdateMfaRecoveryCodesMutation } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const accountUpdateMfaRecoveryCodes = gql(/* GraphQL */ `
  mutation UpdateMfaRecoveryCodes {
    accountUpdateMfaRecoveryCodes {
      recoveryCodes
    }
  }
`)

export function useUpdateMfaRecoveryCodes() {
  const { graphql } = useAppwrite()

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
  })

  return { ...queryResult }
}
