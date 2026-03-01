import { useEffect } from 'react'
import { Channel } from 'appwrite'

import type { Document } from './types'
import { gql } from '../__generated__'
import type { GetDocumentQueryVariables } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'
import { useQueryClient } from '../useQueryClient'

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
  const { graphql, realtime } = useAppwrite()
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
    const subscriptionPromise = realtime.subscribe(
      Channel.tablesdb(databaseId).table(collectionId).row(documentId).update(),
      (response) => {
        queryClient.setQueryData(
          ['appwrite', 'databases', databaseId, collectionId, 'documents', documentId],
          response.payload,
        )
      },
    )

    return () => {
      void subscriptionPromise.then((sub) => sub.close())
    }
  }, [databaseId, collectionId, documentId, realtime, queryClient])

  return { ...queryResult }
}
