import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const createOperations = gql(/* GraphQL */ `
  mutation CreateOperations($transactionId: String!, $operations: [String!]) {
    databasesCreateOperations(transactionId: $transactionId, operations: $operations) {
      _id
      status
      operations
      expiresAt
    }
  }
`)

type Variables = VariablesOf<typeof createOperations>
type Result = ResultOf<typeof createOperations>['databasesCreateOperations']

export function useCreateOperations() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.database().transactions().operations().create(),
    mutationFn: async ({ transactionId, operations }) => {
      const { data, errors } = await graphql.mutation({
        query: createOperations,
        variables: { transactionId, operations },
      })

      if (errors) {
        throw errors
      }

      return data.databasesCreateOperations
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: Keys.database().transaction(variables.transactionId).key(),
      })
    },
  })

  return { ...mutationResult }
}
