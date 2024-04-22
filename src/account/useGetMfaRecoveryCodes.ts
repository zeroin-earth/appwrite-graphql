import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { GetMfaRecoveryCodesQuery } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const getMFARecoveryCodes = gql(/* GraphQL */ `
  query GetMfaRecoveryCodes {
    accountGetMfaRecoveryCodes {
      recoveryCodes
    }
  }
`)

export function useGetMfaRecoveryCodes() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    GetMfaRecoveryCodesQuery['accountGetMfaRecoveryCodes'],
    AppwriteException,
    void
  >({
    queryKey: ['appwrite', 'account', 'mfa', 'recovery-codes'],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: getMFARecoveryCodes,
      })

      if (errors) {
        throw errors
      }

      return data.accountGetMfaRecoveryCodes
    },
  })

  return { ...queryResult }
}
