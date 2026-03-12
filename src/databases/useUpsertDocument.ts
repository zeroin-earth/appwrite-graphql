import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

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

export function useUpsertDocument() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    Result,
    AppwriteException[],
    UpsertDocumentVariables,
    {
      previousEntries: [queryKey: readonly unknown[], data: unknown][]
      documentKeyPrefix: readonly unknown[]
    }
  >({
    mutationKey: Keys.databases().collections().documents().upsert(),
    mutationFn: async ({
      databaseId,
      collectionId,
      documentId,
      data,
      permissions,
      transactionId,
    }) => {
      const { data: mutationData, errors } = await graphql.mutation({
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
    onMutate: async (variables) => {
      const documentKeyPrefix = Keys.database(variables.databaseId)
        .collection(variables.collectionId)
        .document(variables.documentId)
        .key()

      await queryClient.cancelQueries({ queryKey: documentKeyPrefix })

      const previousEntries = queryClient.getQueriesData({ queryKey: documentKeyPrefix })

      queryClient.setQueriesData(
        { queryKey: documentKeyPrefix },
        (old: Record<string, unknown> | undefined) =>
          old ? { ...old, ...(variables.data as Record<string, unknown>) } : old,
      )

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
      void queryClient.invalidateQueries({
        queryKey: Keys.database(variables.databaseId).collection(variables.collectionId).key(),
      })
    },
  })

  return { ...mutationResult }
}
