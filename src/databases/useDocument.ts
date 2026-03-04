import { useEffect } from 'react'
import { Channel } from 'appwrite'
import type { VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import type { Document } from './types'
import { mergeFieldsQuery } from './types'
import { Keys } from '../query/Keys'
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

type Variables = VariablesOf<typeof getDocument>

type DocumentParams<TDocument = Record<string, unknown>> = Variables & {
  fields?: (keyof TDocument & string)[]
}

function useDocumentQueryConfig<TDocument>({
  databaseId,
  collectionId,
  documentId,
  queries,
  transactionId,
  fields,
}: DocumentParams<TDocument>) {
  const { graphql } = useAppwrite()
  const rawQueries = Array.isArray(queries) ? queries : queries ? [queries] : []
  const mergedQueries = mergeFieldsQuery(rawQueries, fields)

  return {
    queryKey: [
      ...Keys.database(databaseId).collection(collectionId).document(documentId).key(),
      ...mergedQueries,
    ] as const,
    queryFn: async () => {
      const { data, errors } = await graphql.query({
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
          Keys.database(databaseId).collection(collectionId).document(documentId).key(),
          response.payload,
        )
      },
    )

    return () => {
      void subscriptionPromise.then((sub) => sub.close())
    }
  }, [databaseId, collectionId, documentId, realtime, queryClient, queriesKey])
}

export function useDocument<TDocument>({
  databaseId,
  collectionId,
  documentId,
  queries,
  transactionId,
  fields,
}: DocumentParams<TDocument>) {
  const config = useDocumentQueryConfig<TDocument>({
    databaseId,
    collectionId,
    documentId,
    queries,
    transactionId,
    fields,
  })
  const queriesKey = JSON.stringify(queries)

  const queryResult = useQuery<Document<TDocument>, AppwriteException[], Document<TDocument>>(
    config,
  )

  useDocumentRealtime(databaseId, collectionId, documentId, queriesKey)

  return { ...queryResult }
}

export function useSuspenseDocument<TDocument>({
  databaseId,
  collectionId,
  documentId,
  queries,
  transactionId,
  fields,
}: DocumentParams<TDocument>) {
  const config = useDocumentQueryConfig<TDocument>({
    databaseId,
    collectionId,
    documentId,
    queries,
    transactionId,
    fields,
  })
  const queriesKey = JSON.stringify(queries)

  const queryResult = useSuspenseQuery<
    Document<TDocument>,
    AppwriteException[],
    Document<TDocument>
  >(config)

  useDocumentRealtime(databaseId, collectionId, documentId, queriesKey)

  return { ...queryResult }
}
