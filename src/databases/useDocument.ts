import { useEffect } from 'react'

import { UseQueryOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'
import { useQueryClient } from '../useQueryClient'
import type { Document } from './types'

const getDocument = gql(/* GraphQL */ `
  query GetDocument($databaseId: String!, $collectionId: String!, $documentId: String!) {
    databasesGetDocument(
      databaseId: $databaseId
      collectionId: $collectionId
      documentId: $documentId
    ) {
      _id
      data
    }
  }
`)

export function useDocument<TDocument>(
  databaseId: string,
  collectionId: string,
  documentId: string,
  options?: UseQueryOptions<Document<TDocument>, AppwriteException, Document<TDocument>, string[]>,
) {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useQuery({
    queryKey: ['appwrite', 'databases', databaseId, collectionId, 'documents', documentId],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: getDocument,
        variables: {
          databaseId,
          collectionId,
          documentId,
        },
      })

      if (errors) {
        throw errors
      }

      const document = {
        ...data.databasesGetDocument,
        ...(data.databasesGetDocument
          ? (JSON.parse(data.databasesGetDocument.data) as TDocument)
          : {}),
      } as Document<TDocument>

      return document
    },

    ...options,
  })

  useEffect(() => {
    const unsubscribe = graphql.client.subscribe(
      `databases.${databaseId}.collections.${collectionId}.documents.${documentId}`,
      (response) => {
        queryClient.setQueryData(
          ['appwrite', 'databases', databaseId, collectionId, 'documents', documentId],
          response.payload,
        )
      },
    )

    return unsubscribe
  }, [databaseId, collectionId, documentId, graphql.client, queryClient])

  return queryResult
}
