import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { GetExecutionQuery, GetExecutionQueryVariables } from '../__generated__/graphql'
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

export function useGetExecution({ functionId, executionId }: GetExecutionQueryVariables) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    GetExecutionQuery['functionsGetExecution'],
    AppwriteException[],
    GetExecutionQuery['functionsGetExecution']
  >({
    queryKey: ['appwrite', 'functions', functionId, 'executions', executionId],
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
  })

  return { ...queryResult }
}
