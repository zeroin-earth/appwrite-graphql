import { graphql as gql } from 'gql.tada'

import type { Collection, Document } from './types'
import { mergeFieldsQuery } from './utils'
import type { AppwriteClient } from '../client'
import { Keys } from '../query/Keys'

type DocumentParams<TDocument = Record<string, unknown>> = {
  databaseId: string
  collectionId: string
  documentId: string
  queries?: string[]
  transactionId?: string
  fields?: (keyof TDocument & string)[]
}

export const getDocument = gql(/* GraphQL */ `
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

export function getDocumentQuery<TDocument>(
  client: AppwriteClient,
  {
    databaseId,
    collectionId,
    documentId,
    queries,
    transactionId,
    fields,
  }: DocumentParams<TDocument>,
) {
  const rawQueries = Array.isArray(queries) ? queries : queries ? [queries] : []
  const mergedQueries = mergeFieldsQuery(rawQueries, fields)

  return {
    queryKey: [
      ...Keys.database(databaseId).collection(collectionId).document(documentId).key(),
      ...mergedQueries,
    ] as const,
    queryFn: async () => {
      const { data, errors } = await client.graphql.query({
        query: getDocument,
        variables: {
          databaseId,
          collectionId,
          documentId,
          queries: mergedQueries.length > 0 ? mergedQueries : undefined,
          transactionId,
        },
      })

      if (errors) {
        throw errors
      }

      const document = {
        ...data.databasesGetDocument,
        ...(data.databasesGetDocument
          ? (JSON.parse(data.databasesGetDocument.data as string) as TDocument)
          : {}),
      } as unknown as Document<TDocument>

      return document
    },
  }
}

export const listDocuments = gql(/* GraphQL */ `
  query ListDocuments(
    $databaseId: String!
    $collectionId: String!
    $queries: [String!]
    $transactionId: String
  ) {
    databasesListDocuments(
      databaseId: $databaseId
      collectionId: $collectionId
      queries: $queries
      transactionId: $transactionId
    ) {
      total
      documents {
        _id
        data
      }
    }
  }
`)

export function getCollectionQuery<TDocument>(
  client: AppwriteClient,
  {
    databaseId,
    collectionId,
    queries,
    transactionId,
    fields,
  }: Omit<DocumentParams<TDocument>, 'documentId'>,
) {
  const mergedQueries = mergeFieldsQuery(queries ?? [], fields)

  return {
    queryKey: [
      ...Keys.database(databaseId).collection(collectionId).key(),
      ...mergedQueries,
    ] as const,
    queryFn: async () => {
      const { data, errors } = await client.graphql.query({
        query: listDocuments,
        variables: {
          databaseId,
          collectionId,
          queries: mergedQueries,
          transactionId,
        },
      })

      if (errors) {
        throw errors
      }

      const documents =
        data.databasesListDocuments?.documents?.map((document) => ({
          ...document,
          ...(document ? (JSON.parse(document.data as string) as TDocument) : {}),
        })) ?? []

      return {
        total: data.databasesListDocuments?.total ?? 0,
        documents,
      } as unknown as Collection<TDocument>
    },
  }
}
