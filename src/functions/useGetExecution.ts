import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const getExecution = gql(/* GraphQL */ `
  query GetExecution($functionId: String!, $executionId: String!) {
    functionsGetExecution(functionId: $functionId, executionId: $executionId) {
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
`)

/** The variables accepted by the {@link useGetExecution} hook. */
export type GetExecutionVariables = Prettify<VariablesOf<typeof getExecution>>

/** The result returned by the {@link useGetExecution} hook. */
export type GetExecutionResult = Prettify<ResultOf<typeof getExecution>['functionsGetExecution']>

/**
 * Fetches the details of a specific function execution.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useGetExecution({
 *   functionId: 'send-email',
 *   executionId: '9b2c…',
 * })
 *
 * // data.status, data.responseBody, data.duration
 * ```
 *
 * **Parameters** ({@link GetExecutionVariables}):
 * - `functionId` — The unique function identifier.
 * - `executionId` — The unique execution identifier.
 *
 * @returns A `UseQueryResult` with the execution details ({@link GetExecutionResult}).
 */
export function useGetExecution(
  { functionId, executionId }: GetExecutionVariables,
  opts: QueryOptions = {},
) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<GetExecutionResult, AppwriteException[], GetExecutionResult>({
    queryKey: Keys.function(functionId).execution(executionId).key(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: getExecution,
        variables: { functionId, executionId },
      })

      if (errors) {
        throw errors
      }

      return data.functionsGetExecution
    },
    ...opts,
  })

  return queryResult
}
