import { onlineManager } from '@tanstack/react-query'
import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import type { ConflictStrategy } from '../offline/conflictResolution/types'
import { conflictAwareUpdate } from '../offline/mutations/conflictAwareUpdate'
import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const updateDocument = gql(/* GraphQL */ `
  mutation UpdateDocument(
    $databaseId: String!
    $collectionId: String!
    $documentId: String!
    $data: Json
    $permissions: [String!]
    $transactionId: String
  ) {
    databasesUpdateDocument(
      databaseId: $databaseId
      collectionId: $collectionId
      documentId: $documentId
      data: $data
      permissions: $permissions
      transactionId: $transactionId
    ) {
      _id
    }
  }
`)

type Variables = VariablesOf<typeof updateDocument>
/** The result returned by the {@link useUpdateDocument} mutation. */
export type UpdateDocumentResult = Prettify<
  ResultOf<typeof updateDocument>['databasesUpdateDocument']
>

/** The variables accepted by the {@link useUpdateDocument} mutation. */
export type UpdateDocumentVariables = Prettify<
  Omit<Variables, 'permissions'> & {
    permissions?: string[] | null
  }
>

/** The optimistic-update context used by the {@link useUpdateDocument} mutation. */
export type UpdateDocumentMutationContext = {
  previousEntries: [queryKey: readonly unknown[], data: unknown][]
  documentKeyPrefix: readonly unknown[]
  baseSnapshot: Record<string, unknown> | undefined
  willPerformOfflineMutation: boolean
}

/**
 * Mutation hook to update an existing document with optimistic updates.
 *
 * Supports offline conflict resolution and rolls back optimistic updates on error.
 * When the device is offline, mutations are queued and replayed when connectivity
 * returns. A `conflictStrategy` (configured via the offline client) controls how
 * conflicts between the optimistic base snapshot and the server state are resolved.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateDocument()
 *
 * mutate({
 *   databaseId: 'my-db',
 *   collectionId: 'my-collection',
 *   documentId: 'doc-123',
 *   data: { name: 'Jane', age: 31 },
 *   permissions: ['read("any")', 'write("user:alice")'],
 * })
 * ```
 *
 * **Variables** ({@link UpdateDocumentVariables}):
 * - `databaseId` — The target database ID
 * - `collectionId` — The target collection ID
 * - `documentId` — The ID of the document to update
 * - `data` — Optional partial document data to merge into the existing document
 * - `permissions` — Optional array of permission strings, or `null`
 * - `transactionId` — Optional transaction ID for atomic operations
 *
 * An optional `conflictStrategy` can be configured through the offline client to
 * control conflict resolution (e.g. `'last-write-wins'`, `'server-wins'`, or a
 * custom three-way merge function).
 *
 * @returns A `UseMutationResult` with the updated document's `_id`.
 */
export function useUpdateDocument() {
  const appwrite = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    UpdateDocumentResult,
    AppwriteException[],
    UpdateDocumentVariables,
    UpdateDocumentMutationContext
  >({
    mutationKey: Keys.databases().collections().documents().update(),
    mutationFn: async (
      { databaseId, collectionId, documentId, data, permissions, transactionId },
      ctx,
    ) => {
      const wasOffline = (ctx.meta?.willPerformOfflineMutation as boolean | undefined) ?? false

      if (ctx.meta?.willPerformOfflineMutation != null) {
        delete ctx.meta.willPerformOfflineMutation
      }

      if (wasOffline) {
        try {
          const updateData = (await conflictAwareUpdate(
            ctx.meta?.conflictStrategy as ConflictStrategy,
          )(
            appwrite,
            {
              databaseId,
              collectionId,
              documentId,
              data,
              permissions,
              transactionId,
            },
            queryClient,
          )) as UpdateDocumentResult

          return updateData
        } catch (error) {
          console.error('Conflict-aware update failed:', error)
          throw error
        }
      }

      const { data: mutationData, errors } = await appwrite.graphql.mutation({
        query: updateDocument,
        variables: {
          databaseId,
          collectionId,
          documentId,
          data: JSON.stringify(data),
          permissions,
          transactionId,
        },
      })

      if (errors) {
        throw errors
      }

      return mutationData.databasesUpdateDocument
    },
    onMutate: async (variables, ctx) => {
      const documentKeyPrefix = Keys.database(variables.databaseId)
        .collection(variables.collectionId)
        .document(variables.documentId)
        .key()

      await queryClient.cancelQueries({ queryKey: documentKeyPrefix })

      const previousEntries = queryClient.getQueriesData({
        queryKey: documentKeyPrefix,
      })

      // Capture a deep copy of the document before optimistic update.
      // This snapshot is persisted in MutationState.context through
      // dehydration and serves as the "base" for three-way conflict
      // resolution when a paused mutation is replayed.
      const baseSnapshot = previousEntries.find(([, data]) => data != null)?.[1] as
        | Record<string, unknown>
        | undefined
      const baseSnapshotCopy = baseSnapshot
        ? (JSON.parse(JSON.stringify(baseSnapshot)) as Record<string, unknown>)
        : undefined

      queryClient.setQueryData<UpdateDocumentVariables>(documentKeyPrefix, (old) =>
        old ? { ...old, ...(variables.data as Record<string, unknown>) } : old,
      )

      const willPerformOfflineMutation = onlineManager.isOnline() === false
      ctx.meta = { ...ctx.meta, willPerformOfflineMutation }

      return {
        previousEntries,
        documentKeyPrefix,
        baseSnapshot: baseSnapshotCopy,
        willPerformOfflineMutation,
      }
    },
    onError: (_, __, context) => {
      if (context?.previousEntries) {
        for (const [key, data] of context.previousEntries) {
          queryClient.setQueryData(key, data)
        }
      }
    },
    onSettled: (_, __, variables) => {
      void queryClient.invalidateQueries({
        queryKey: Keys.database(variables.databaseId).collection(variables.collectionId).key(),
      })
    },
  })

  return mutationResult
}
