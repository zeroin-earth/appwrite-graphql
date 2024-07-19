// FIXME: This is a temporary solution to create a document.
import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import {
  CreateDocumentMutation,
  CreateDocumentMutationVariables,
  InputMaybe,
  Scalars,
} from '../__generated__/graphql'

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
  // const { graphql } = useAppwrite()
  const { databases } = useAppwrite()

  const mutationResult = useMutation<
    CreateDocumentMutation['databasesCreateDocument'],
    AppwriteException[],
    Omit<CreateDocumentMutationVariables, 'permissions'> & {
      permissions?: InputMaybe<Array<Scalars['String']['input']>>
    }
  >({
    mutationFn: async ({ databaseId, collectionId, documentId, data, permissions }) => {
      const { data: mutationData, errors } = await databases.createDocument(
        databaseId,
        collectionId,
        documentId,
        data,
        permissions,
      )
      // Doesn't work for some reason
      // const { data: mutationData, errors } = await graphql.mutation({
      //   query: createDocument,
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

      return mutationData
      // return mutationData.databasesCreateDocument
    },
  })

  return mutationResult
}
