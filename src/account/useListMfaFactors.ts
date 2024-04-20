import { UseQueryOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

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

export function useListMfaFactors({
  options,
}: {
  options?: UseQueryOptions<
    ListMfaFactorsQuery['accountListMfaFactors'],
    AppwriteException,
    void,
    string[]
  >
}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery({
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
    ...options,
  })

  return { ...queryResult }
}
