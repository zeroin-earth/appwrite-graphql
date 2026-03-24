import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const listExecutions = gql(/* GraphQL */ `
  query ListExecutions($functionId: String!, $queries: [String!]) {
    functionsListExecutions(functionId: $functionId, queries: $queries) {
      total
      executions {
        _id
        _createdAt
        _updatedAt
        functionId
        trigger
        status
        requestMethod
        requestPath
        responseStatusCode
        responseBody
        errors
        duration
      }
    }
  }
`)

/** The result returned by the {@link useListExecutions} hook. */
export type ListExecutionsResult = Prettify<
  ResultOf<typeof listExecutions>['functionsListExecutions']
>

/**
 * Fetches the list of executions for a function with optional query filters.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useListExecutions({
 *   functionId: 'send-email',
 *   queries: ['limit(10)'],
 * })
 *
 * // data.total, data.executions
 * ```
 *
 * **Parameters:**
 * - `functionId` — The unique function identifier.
 * - `queries` *(optional)* — Appwrite query strings for filtering and pagination.
 *
 * @returns A `UseQueryResult` with the paginated execution list ({@link ListExecutionsResult}).
 */
export function useListExecutions(
  {
    functionId,
    queries,
  }: {
    functionId: string
    queries?: string[]
  },
  opts: QueryOptions = {},
) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<ListExecutionsResult, AppwriteException[], ListExecutionsResult>({
    queryKey: [...Keys.function(functionId).executions().key(), ...(queries ?? [])],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listExecutions,
        variables: {
          functionId,
          queries,
        },
      })

      if (errors) {
        throw errors
      }

      return data.functionsListExecutions
    },
    ...opts,
  })

  return queryResult
}
