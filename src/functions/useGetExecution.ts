import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, QueryOptions } from '../types'
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

type Variables = VariablesOf<typeof getExecution>
type Result = ResultOf<typeof getExecution>['functionsGetExecution']

export function useGetExecution({ functionId, executionId }: Variables, opts: QueryOptions = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
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

  return { ...queryResult }
}
