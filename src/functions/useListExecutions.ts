import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, QueryOptions } from '../types'
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

type Result = ResultOf<typeof listExecutions>['functionsListExecutions']

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

  const queryResult = useQuery<Result, AppwriteException[], Result>({
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

  return { ...queryResult }
}
