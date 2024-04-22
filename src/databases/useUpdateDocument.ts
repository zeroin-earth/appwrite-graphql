import { UseMutationOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import type { Document } from './types'
import { UpdateDocumentMutation, UpdateDocumentMutationVariables } from '../__generated__/graphql'

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

export function useUpdateDocument<TDocument>() {
  const { graphql } = useAppwrite()

  const mutationResult = useMutation<
    Document<TDocument>,
    AppwriteException,
    UpdateDocumentMutationVariables
  >({
    mutationFn: async ({ databaseId, collectionId, documentId, data, permissions }) => {
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
  })

  return { ...mutationResult }
}
