import { useEffect } from 'react'

import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'
import { useQueryClient } from '../useQueryClient'
import type { Document } from './types'
import { GetDocumentQueryVariables } from '../__generated__/graphql'

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

export function useDocument<TDocument>({
  databaseId,
  collectionId,
  documentId,
}: GetDocumentQueryVariables) {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useQuery<Document<TDocument>, AppwriteException[], Document<TDocument>>({
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

  return { ...queryResult }
}
