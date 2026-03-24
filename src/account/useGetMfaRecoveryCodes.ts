import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const getMFARecoveryCodes = gql(/* GraphQL */ `
  query GetMfaRecoveryCodes {
    accountGetMfaRecoveryCodes {
      recoveryCodes
    }
  }
`)

/** The result returned by the {@link useGetMfaRecoveryCodes} query. */
export type GetMfaRecoveryCodesResult = Prettify<
  ResultOf<typeof getMFARecoveryCodes>['accountGetMfaRecoveryCodes']
>

/**
 * Fetches the current user's MFA recovery codes.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useGetMfaRecoveryCodes()
 * ```
 *
 * @returns A `UseQueryResult` with the user's MFA recovery codes ({@link GetMfaRecoveryCodesResult}).
 */
export function useGetMfaRecoveryCodes(opts: QueryOptions = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    GetMfaRecoveryCodesResult,
    AppwriteException[],
    GetMfaRecoveryCodesResult
  >({
    queryKey: Keys.account().mfaCodes().key(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: getMFARecoveryCodes,
      })

      if (errors) {
        throw errors
      }

      return data.accountGetMfaRecoveryCodes
    },
    ...opts,
  })

  return queryResult
}
