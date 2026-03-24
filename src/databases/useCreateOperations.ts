import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
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

/** The variables accepted by the {@link useCreateOperations} mutation. */
export type CreateOperationsVariables = Prettify<VariablesOf<typeof createOperations>>

/** The result returned by the {@link useCreateOperations} mutation. */
export type CreateOperationsResult = Prettify<
  ResultOf<typeof createOperations>['databasesCreateOperations']
>

/**
 * Mutation hook to add operations to an existing transaction.
 *
 * Invalidates the parent transaction query on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateOperations()
 *
 * mutate({
 *   transactionId: 'txn-abc',
 *   operations: [
 *     JSON.stringify({ action: 'create', databaseId: 'my-db', collectionId: 'my-col', documentId: 'doc-1', data: '{}' }),
 *   ],
 * })
 * ```
 *
 * **Variables** ({@link CreateOperationsVariables}):
 * - `transactionId` — The ID of the transaction to append operations to
 * - `operations` — Optional array of JSON-encoded operation strings
 *
 * @returns A `UseMutationResult` with the transaction's `_id`, `status`, `operations` list, and `expiresAt` timestamp.
 */
export function useCreateOperations() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    CreateOperationsResult,
    AppwriteException[],
    CreateOperationsVariables
  >({
    mutationKey: Keys.databases().transactions().operations().create(),
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
        queryKey: Keys.databases().transaction(variables.transactionId).key(),
      })
    },
  })

  return mutationResult
}
