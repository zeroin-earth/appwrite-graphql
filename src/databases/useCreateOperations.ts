import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import {
  CreateOperationsMutation,
  CreateOperationsMutationVariables,
} from '../__generated__/graphql'
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

export function useCreateOperations() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    CreateOperationsMutation['databasesCreateOperations'],
    AppwriteException[],
    CreateOperationsMutationVariables
  >({
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
      queryClient.invalidateQueries({
        queryKey: ['appwrite', 'databases', 'transactions', variables.transactionId],
      })
    },
  })

  return { ...mutationResult }
}
