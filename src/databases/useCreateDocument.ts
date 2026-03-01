import { gql } from '../__generated__'
import type {
  CreateDocumentMutation,
  CreateDocumentMutationVariables,
  InputMaybe,
  Scalars,
} from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const createDocument = gql(/* GraphQL */ `
  mutation CreateDocument(
    $databaseId: String!
    $collectionId: String!
    $documentId: String!
    $data: Json!
    $permissions: [String!]
    $transactionId: String
  ) {
    databasesCreateDocument(
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

export function useCreateDocument() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    CreateDocumentMutation['databasesCreateDocument'],
    AppwriteException[],
    Omit<CreateDocumentMutationVariables, 'permissions'> & {
      permissions?: InputMaybe<Array<Scalars['String']['input']>>
    }
  >({
    mutationFn: async ({ databaseId, collectionId, documentId, data, permissions, transactionId }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: createDocument,
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
      return mutationData.databasesCreateDocument
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['appwrite', 'databases', variables.databaseId, variables.collectionId],
      })
    },
  })

  return mutationResult
}
