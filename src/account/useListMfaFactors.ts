import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { ListMfaFactorsQuery } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const listMFAFactors = gql(/* GraphQL */ `
  query ListMfaFactors {
    accountListMfaFactors {
      totp
      phone
      email
    }
  }
`)

export function useListMfaFactors() {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    ListMfaFactorsQuery['accountListMfaFactors'],
    AppwriteException[],
    ListMfaFactorsQuery['accountListMfaFactors']
  >({
    queryKey: ['appwrite', 'account', 'mfa', 'factors'],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listMFAFactors,
      })

      if (errors) {
        throw errors
      }

      return data.accountListMfaFactors
    },
  })

  return { ...queryResult }
}
