import { useEffect } from 'react'
import { Channel } from 'appwrite'

import type { Document } from './types'
import { gql } from '../__generated__'
import type { GetDocumentQueryVariables } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'
import { useQueryClient } from '../useQueryClient'
import { useSuspenseQuery } from '../useSuspenseQuery'

const getDocument = gql(/* GraphQL */ `
  query GetDocument(
    $databaseId: String!
    $collectionId: String!
    $documentId: String!
    $queries: [String!]
    $transactionId: String
  ) {
    databasesGetDocument(
      databaseId: $databaseId
      collectionId: $collectionId
      documentId: $documentId
      queries: $queries
      transactionId: $transactionId
    ) {
      _id
      data
    }
  }
`)

function useDocumentQueryConfig<TDocument>(variables: GetDocumentQueryVariables) {
  const { graphql } = useAppwrite()
  const { databaseId, collectionId, documentId, queries, transactionId } = variables

  return {
    queryKey: [
      'appwrite',
      'databases',
      databaseId,
      collectionId,
      'documents',
      documentId,
      { queries },
    ] as const,
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: getDocument,
        variables: {
          databaseId,
          collectionId,
          documentId,
          queries,
          transactionId,
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
  }
}

function useDocumentRealtime(
  databaseId: string,
  collectionId: string,
  documentId: string,
  queriesKey: string,
) {
  const { realtime } = useAppwrite()
  const queryClient = useQueryClient()

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
  }, [databaseId, collectionId, documentId, realtime, queryClient, queriesKey])
}

export function useDocument<TDocument>(variables: GetDocumentQueryVariables) {
  const config = useDocumentQueryConfig<TDocument>(variables)
  const queriesKey = JSON.stringify(variables.queries)

  const queryResult = useQuery<Document<TDocument>, AppwriteException[], Document<TDocument>>(
    config,
  )

  useDocumentRealtime(variables.databaseId, variables.collectionId, variables.documentId, queriesKey)

  return { ...queryResult }
}

export function useSuspenseDocument<TDocument>(variables: GetDocumentQueryVariables) {
  const config = useDocumentQueryConfig<TDocument>(variables)
  const queriesKey = JSON.stringify(variables.queries)

  const queryResult = useSuspenseQuery<
    Document<TDocument>,
    AppwriteException[],
    Document<TDocument>
  >(config)

  useDocumentRealtime(variables.databaseId, variables.collectionId, variables.documentId, queriesKey)

  return { ...queryResult }
}
