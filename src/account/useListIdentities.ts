import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const accountListIdentities = gql(/* GraphQL */ `
  query ListIdentities {
    accountListIdentities {
      total
      identities {
        _id
        userId
        provider
      }
    }
  }
`)

/** The result returned by the {@link useListIdentities} query. */
export type ListIdentitiesResult = Prettify<
  ResultOf<typeof accountListIdentities>['accountListIdentities']
>

/**
 * Fetches the list of identities associated with the current user's account.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useListIdentities()
 * ```
 *
 * @returns A `UseQueryResult` with the user's identities ({@link ListIdentitiesResult}).
 */
export function useListIdentities(opts: QueryOptions = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<ListIdentitiesResult, AppwriteException[], ListIdentitiesResult>({
    queryKey: Keys.account().identities(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: accountListIdentities,
      })

      if (errors) {
        throw errors
      }

      return data.accountListIdentities
    },
    ...opts,
  })

  return queryResult
}
