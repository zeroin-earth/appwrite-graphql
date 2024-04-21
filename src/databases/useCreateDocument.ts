import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { CreateDocumentMutation, CreateDocumentMutationVariables } from '../__generated__/graphql'

const createDocument = gql(/* GraphQL */ `
  mutation CreateDocument(
    $databaseId: String!
    $collectionId: String!
    $documentId: String!
    $data: JSON!
    $permissions: [String!]
  ) {
    databasesCreateDocument(
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

export function useCreateDocument() {
  const { graphql } = useAppwrite()

  const mutationResult = useMutation<
    CreateDocumentMutation['databasesCreateDocument'],
    AppwriteException,
    CreateDocumentMutationVariables
  >({
    mutationFn: async ({ databaseId, collectionId, documentId, data, permissions }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: createDocument,
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

      return mutationData.databasesCreateDocument
    },
  })

  return mutationResult
}
