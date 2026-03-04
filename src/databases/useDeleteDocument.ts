import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const deleteDocument = gql(/* GraphQL */ `
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

type Variables = VariablesOf<typeof deleteDocument>
type Result = ResultOf<typeof deleteDocument>['databasesDeleteDocument']

export function useDeleteDocument() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    Result,
    AppwriteException[],
    Variables,
    {
      previousEntries: [queryKey: readonly unknown[], data: unknown][]
      documentKeyPrefix: readonly unknown[]
    }
  >({
    mutationKey: Keys.database().collections().documents().delete(),
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

      const previousEntries = queryClient.getQueriesData({ queryKey: documentKeyPrefix })

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

  return { ...mutationResult }
}
