import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const deleteDocument = gql(/* GraphQL */ `
  mutation DeleteDocument(
    $databaseId: String!
    $collectionId: String!
    $documentId: String!
    $transactionId: String
  ) {
    databasesDeleteDocument(
      databaseId: $databaseId
      collectionId: $collectionId
      documentId: $documentId
      transactionId: $transactionId
    ) {
      status
    }
  }
`)

/** The variables accepted by the {@link useDeleteDocument} mutation. */
export type DeleteDocumentVariables = Prettify<VariablesOf<typeof deleteDocument>>

/** The result returned by the {@link useDeleteDocument} mutation. */
export type DeleteDocumentResult = Prettify<
  ResultOf<typeof deleteDocument>['databasesDeleteDocument']
>

/**
 * Mutation hook to delete a document with optimistic removal.
 *
 * Removes the document from cache immediately and rolls back on error.
 * On settlement, the document queries are removed and the parent collection
 * queries are invalidated.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteDocument()
 *
 * mutate({
 *   databaseId: 'my-db',
 *   collectionId: 'my-collection',
 *   documentId: 'doc-123',
 * })
 * ```
 *
 * **Variables** ({@link DeleteDocumentVariables}):
 * - `databaseId` — The target database ID
 * - `collectionId` — The target collection ID
 * - `documentId` — The ID of the document to delete
 * - `transactionId` — Optional transaction ID for atomic operations
 *
 * @returns A `UseMutationResult` with a `status` string indicating the deletion result.
 */
export function useDeleteDocument() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    DeleteDocumentResult,
    AppwriteException[],
    DeleteDocumentVariables,
    {
      previousEntries: [queryKey: readonly unknown[], data: unknown][]
      documentKeyPrefix: readonly unknown[]
    }
  >({
    mutationKey: Keys.databases().collections().documents().delete(),
    mutationFn: async ({ databaseId, collectionId, documentId, transactionId }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: deleteDocument,
        variables: {
          databaseId,
          collectionId,
          documentId,
          transactionId,
        },
      })

      if (errors) {
        throw errors
      }

      return mutationData?.databasesDeleteDocument ?? { status: '' }
    },
    onMutate: async (variables) => {
      const documentKeyPrefix = Keys.database(variables.databaseId)
        .collection(variables.collectionId)
        .document(variables.documentId)
        .key()

      await queryClient.cancelQueries({ queryKey: documentKeyPrefix })

      const previousEntries = queryClient.getQueriesData({
        queryKey: documentKeyPrefix,
      })

      queryClient.removeQueries({ queryKey: documentKeyPrefix })

      return { previousEntries, documentKeyPrefix }
    },
    onError: (_, __, context) => {
      if (context?.previousEntries) {
        for (const [key, data] of context.previousEntries) {
          queryClient.setQueryData(key, data)
        }
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.removeQueries({
        queryKey: Keys.database(variables.databaseId)
          .collection(variables.collectionId)
          .document(variables.documentId)
          .key(),
      })
      void queryClient.invalidateQueries({
        queryKey: Keys.database(variables.databaseId).collection(variables.collectionId).key(),
      })
    },
  })

  return mutationResult
}
