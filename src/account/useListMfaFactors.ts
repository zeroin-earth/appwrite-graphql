import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
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

/** The result returned by the {@link useListMfaFactors} query. */
export type ListMfaFactorsResult = Prettify<
  ResultOf<typeof listMFAFactors>['accountListMfaFactors']
>

/**
 * Fetches the available MFA factors (TOTP, phone, email) for the current user.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useListMfaFactors()
 * ```
 *
 * @returns A `UseQueryResult` with the user's MFA factors ({@link ListMfaFactorsResult}).
 */
export function useListMfaFactors(opts: QueryOptions = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<ListMfaFactorsResult, AppwriteException[], ListMfaFactorsResult>({
    queryKey: Keys.account().mfaFactors(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listMFAFactors,
      })

      if (errors) {
        throw errors
      }

      return data.accountListMfaFactors
    },
    ...opts,
  })

  return queryResult
}
