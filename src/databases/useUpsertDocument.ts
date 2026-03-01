import { gql } from '../__generated__'
import type {
  InputMaybe,
  Scalars,
  UpsertDocumentMutation,
  UpsertDocumentMutationVariables,
} from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const upsertDocument = gql(/* GraphQL */ `
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

type UpsertDocumentVariables = Omit<UpsertDocumentMutationVariables, 'permissions'> & {
  permissions?: InputMaybe<Array<Scalars['String']['input']>>
}

export function useUpsertDocument() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    UpsertDocumentMutation['databasesUpsertDocument'],
    AppwriteException[],
    UpsertDocumentVariables,
    { previousEntries: [queryKey: readonly unknown[], data: unknown][]; documentKeyPrefix: readonly unknown[] }
  >({
    mutationFn: async ({ databaseId, collectionId, documentId, data, permissions, transactionId }) => {
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
      const documentKeyPrefix = [
        'appwrite',
        'databases',
        variables.databaseId,
        variables.collectionId,
        'documents',
        variables.documentId,
      ]

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
        queryKey: ['appwrite', 'databases', variables.databaseId, variables.collectionId],
      })
    },
  })

  return { ...mutationResult }
}
