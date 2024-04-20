import { UseMutationOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import type { Document } from './types'

const updateDocument = gql(/* GraphQL */ `
  mutation UpdateDocument(
    $databaseId: String!
    $collectionId: String!
    $documentId: String!
    $data: JSON!
    $permissions: [String!]
  ) {
    databasesUpdateDocument(
      databaseId: $databaseId
      collectionId: $collectionId
      documentId: $documentId
      data: $data
      permissions: $permissions
    ) {
      _id
      _collectionId
      _databaseId
      _createdAt
      _updatedAt
      _permissions
      data
    }
  }
`)

export function useUpdateDocument<TDocument>(
  databaseId: string,
  collectionId: string,
  documentId: string,
  data: TDocument,
  permissions?: string[],
  options?: UseMutationOptions<
    Document<TDocument>,
    AppwriteException,
    Document<TDocument>,
    string[]
  >,
) {
  const { graphql } = useAppwrite()

  const mutationResult = useMutation({
    mutationKey: ['appwrite', 'databases', databaseId, collectionId, 'documents', documentId],
    mutationFn: async () => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: updateDocument,
        variables: {
          databaseId,
          collectionId,
          documentId,
          data,
          permissions,
        },
      })

      if (errors) {
        throw errors
      }

      const document = {
        ...mutationData.databasesUpdateDocument,
        ...(mutationData.databasesUpdateDocument
          ? (JSON.parse(mutationData.databasesUpdateDocument.data) as TDocument)
          : {}),
      } as Document<TDocument>

      return document
    },
    ...options,
  })

  return { ...mutationResult }
}
