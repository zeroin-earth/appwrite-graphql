import { UseMutationOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

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

export function useUpdateMfaRecoveryCodes({
  options,
}: {
  options?: UseMutationOptions<
    UpdateMfaRecoveryCodesMutation['accountUpdateMfaRecoveryCodes'],
    AppwriteException,
    void,
    string[]
  >
}) {
  const { graphql } = useAppwrite()

  const queryResult = useMutation({
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdateMfaRecoveryCodes,
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateMfaRecoveryCodes
    },
    ...options,
  })

  return { ...queryResult }
}