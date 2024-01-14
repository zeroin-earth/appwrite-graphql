import { UseMutationOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import type { Document } from './types'

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

export function useCreateDocument<TDocument>(
  databaseId: string,
  collectionId: string,
  documentId: string,
  data: TDocument,
  permissions?: string[],
  options?: UseMutationOptions<
    string | undefined | null,
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

      return mutationData.databasesCreateDocument?._id
    },
    ...options,
  })

  return mutationResult
}
