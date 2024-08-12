// FIXME: This is a temporary solution to update a document.
import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { InputMaybe, Scalars, UpdateDocumentMutationVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import type { Document } from './types'

const updateDocument = gql(/* GraphQL */ `
  mutation UpdateDocument(
    $databaseId: String!
    $collectionId: String!
    $documentId: String!
    $data: JSON
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
    }
  }
`)

export function useUpdateDocument<TDocument>() {
  // const { graphql } = useAppwrite()
  const { databases } = useAppwrite()

  const mutationResult = useMutation<
    Document<TDocument>,
    AppwriteException[],
    Omit<UpdateDocumentMutationVariables, 'permissions'> & {
      permissions?: InputMaybe<Array<Scalars['String']['input']>>
    }
  >({
    mutationFn: async ({ databaseId, collectionId, documentId, data, permissions }) => {
      const { data: mutationData, errors } = await databases.updateDocument(
        databaseId,
        collectionId,
        documentId,
        data,
        permissions,
      )
      // Doesn't work for some reason
      // const { data: mutationData, errors } = await graphql.mutation({
      //   query: updateDocument,
      //   variables: {
      //     databaseId,
      //     collectionId,
      //     documentId,
      //     data: JSON.stringify(data),
      //     permissions,
      //   },
      // })

      if (errors) {
        throw errors
      }

      // const document = mutationData.databasesUpdateDocument
      const document = mutationData

      return document
    },
  })

  return { ...mutationResult }
}
