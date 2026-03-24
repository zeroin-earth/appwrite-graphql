import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const accountListLogs = gql(/* GraphQL */ `
  query ListLogs($queries: [String!]) {
    accountListLogs(queries: $queries) {
      total
      logs {
        event
        userId
        userEmail
        userName
        mode
        ip
        time
        osCode
        osName
        osVersion
        clientType
        clientCode
        clientName
        clientVersion
        clientEngine
        clientEngineVersion
        deviceName
        deviceBrand
        deviceModel
        countryCode
        countryName
      }
    }
  }
`)

/** The variables accepted by the {@link useLogs} query. */
export type LogsVariables = Prettify<VariablesOf<typeof accountListLogs>>
/** The result returned by the {@link useLogs} query. */
export type LogsResult = Prettify<ResultOf<typeof accountListLogs>['accountListLogs']>

/**
 * Fetches the account activity logs for the current user. Accepts optional
 * query filters to narrow down results.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useLogs({ queries: ['limit(10)'] })
 * ```
 *
 * **Parameters** ({@link LogsVariables}):
 * - `queries` — Optional array of query strings to filter or paginate log entries.
 *
 * @returns A `UseQueryResult` with the user's activity logs ({@link LogsResult}).
 */
export function useLogs({ queries }: LogsVariables, opts: QueryOptions = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<LogsResult, AppwriteException[], LogsResult>({
    queryKey: [...Keys.account().logs().key(), ...(queries ?? [])],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: accountListLogs,
        variables: {
          queries,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountListLogs
    },
    ...opts,
  })

  return queryResult
}
