import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import {
  CreateDocumentMutation,
  InputMaybe,
  Scalars,
  UpdateDocumentMutationVariables,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateDocument = gql(/* GraphQL */ `
  mutation UpdateDocument(
    $databaseId: String!
    $collectionId: String!
    $documentId: String!
    $data: Json
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
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    CreateDocumentMutation['databasesCreateDocument'],
    AppwriteException[],
    Omit<UpdateDocumentMutationVariables, 'permissions'> & {
      permissions?: InputMaybe<Array<Scalars['String']['input']>>
    }
  >({
    mutationFn: async ({ databaseId, collectionId, documentId, data, permissions }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: updateDocument,
        variables: {
          databaseId,
          collectionId,
          documentId,
          data: JSON.stringify(data),
          permissions,
        },
      })

      if (errors) {
        throw errors
      }
      return mutationData.databasesUpdateDocument
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['appwrite', 'databases', variables.databaseId, variables.collectionId],
      })
    },
  })

  return { ...mutationResult }
}
