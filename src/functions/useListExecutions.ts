import { gql } from '../__generated__'
import type { ListExecutionsQuery } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
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

export function useListExecutions({
  functionId,
  queries,
}: {
  functionId: string
  queries?: string[]
}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    ListExecutionsQuery['functionsListExecutions'],
    AppwriteException[],
    ListExecutionsQuery['functionsListExecutions']
  >({
    queryKey: ['appwrite', 'functions', functionId, 'executions', { queries }],
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
  })

  return { ...queryResult }
}
