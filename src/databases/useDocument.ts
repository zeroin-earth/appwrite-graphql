import { useEffect } from 'react'
import { Channel } from 'appwrite'
import type { VariablesOf } from 'gql.tada'

import type { getDocument } from './queryOptions'
import { getDocumentQuery } from './queryOptions'
import type { Document } from './types'
import { Keys } from '../query/Keys'
import type { AppwriteException, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'
import { useQueryClient } from '../useQueryClient'
import { useSuspenseQuery } from '../useSuspenseQuery'

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
  const client = useAppwrite()

  return getDocumentQuery<TDocument>(client, {
    databaseId,
    collectionId,
    documentId,
    queries,
    transactionId,
    fields,
  })
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

export function useDocument<TDocument>(
  {
    databaseId,
    collectionId,
    documentId,
    queries,
    transactionId,
    fields,
  }: DocumentParams<TDocument>,
  opts: QueryOptions = {},
) {
  const config = useDocumentQueryConfig<TDocument>({
    databaseId,
    collectionId,
    documentId,
    queries,
    transactionId,
    fields,
  })
  const queriesKey = JSON.stringify(queries)

  const queryResult = useQuery<Document<TDocument>, AppwriteException[], Document<TDocument>>({
    ...config,
    ...opts,
  })

  useDocumentRealtime(databaseId, collectionId, documentId, queriesKey)

  return { ...queryResult }
}

export function useSuspenseDocument<TDocument>(
  {
    databaseId,
    collectionId,
    documentId,
    queries,
    transactionId,
    fields,
  }: DocumentParams<TDocument>,
  opts: QueryOptions = {},
) {
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
  >({ ...config, ...opts })

  useDocumentRealtime(databaseId, collectionId, documentId, queriesKey)

  return { ...queryResult }
}
