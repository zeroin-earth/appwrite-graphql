import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { CreateMfaRecoveryCodesMutation } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const accountCreateMfaRecoveryCodes = gql(/* GraphQL */ `
  mutation CreateMfaRecoveryCodes {
    accountCreateMfaRecoveryCodes {
      recoveryCodes
    }
  }
`)

export function useCreateMfaRecoveryCodes() {
  const { graphql } = useAppwrite()

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
  })

  return { ...queryResult }
}
