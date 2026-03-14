import { onlineManager } from '@tanstack/react-query'
import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import type { ConflictStrategy } from '../offline'
import { conflictAwareUpdate } from '../offline/mutations/conflictAwareUpdate'
import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const upsertDocument = gql(/* GraphQL */ `
  mutation UpsertDocument(
    $databaseId: String!
    $collectionId: String!
    $documentId: String!
    $data: Json!
    $permissions: [String!]
    $transactionId: String
  ) {
    databasesUpsertDocument(
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

type Variables = VariablesOf<typeof upsertDocument>
type Result = ResultOf<typeof upsertDocument>['databasesUpsertDocument']

type UpsertDocumentVariables = Omit<Variables, 'permissions'> & {
  permissions?: string[] | null
}

type MutationContext = {
  previousEntries: [queryKey: readonly unknown[], data: unknown][]
  documentKeyPrefix: readonly unknown[]
  baseSnapshot: Record<string, unknown> | undefined
  willPerformOfflineMutation: boolean
}

export function useUpsertDocument() {
  const appwrite = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    Result,
    AppwriteException[],
    UpsertDocumentVariables,
    MutationContext
  >({
    mutationKey: Keys.databases().collections().documents().upsert(),
    mutationFn: async (
      { databaseId, collectionId, documentId, data, permissions, transactionId },
      ctx,
    ) => {
      const wasOffline = ctx.meta.willPerformOfflineMutation ?? false

      if (ctx.meta.willPerformOfflineMutation != null) {
        delete ctx.meta.willPerformOfflineMutation
      }

      if (wasOffline) {
        try {
          const updateData = (await conflictAwareUpdate(
            ctx.meta.conflictStrategy as ConflictStrategy,
          )(
            appwrite,
            { databaseId, collectionId, documentId, data, permissions, transactionId },
            queryClient,
          )) as Result

          return updateData
        } catch (error) {
          console.error('Conflict-aware update failed:', error)
          throw error
        }
      }

      const { data: mutationData, errors } = await appwrite.graphql.mutation({
        query: upsertDocument,
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

      return mutationData.databasesUpsertDocument
    },
    onMutate: async (variables, ctx) => {
      const documentKeyPrefix = Keys.database(variables.databaseId)
        .collection(variables.collectionId)
        .document(variables.documentId)
        .key()

      await queryClient.cancelQueries({ queryKey: documentKeyPrefix })

      const previousEntries = queryClient.getQueriesData({ queryKey: documentKeyPrefix })

      const baseSnapshot = previousEntries.find(([, data]) => data != null)?.[1] as
        | Record<string, unknown>
        | undefined
      const baseSnapshotCopy = baseSnapshot
        ? (JSON.parse(JSON.stringify(baseSnapshot)) as Record<string, unknown>)
        : undefined

      queryClient.setQueryData<UpsertDocumentVariables>(documentKeyPrefix, (old) =>
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

  return { ...mutationResult }
}
