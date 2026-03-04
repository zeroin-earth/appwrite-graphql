import { useEffect } from 'react'
import { Channel } from 'appwrite'
import { graphql as gql } from 'gql.tada'

import type { Collection, Document } from './types'
import { mergeFieldsQuery } from './types'
import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'
import { useQueryClient } from '../useQueryClient'
import { useSuspenseQuery } from '../useSuspenseQuery'

type DocumentOperation = 'create' | 'update' | 'delete'

type CollectionParams<TDocument = Record<string, string | number | boolean | null>> = {
  databaseId: string
  collectionId: string
  queries: string[]
  transactionId?: string
  subscribe?: boolean
  fields?: (keyof TDocument & string)[]
}

const listDocuments = gql(/* GraphQL */ `
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

function useCollectionQueryConfig<TDocument>({
  databaseId,
  collectionId,
  queries,
  transactionId,
  fields,
}: Omit<CollectionParams<TDocument>, 'subscribe'>) {
  const { graphql } = useAppwrite()
  const mergedQueries = mergeFieldsQuery(queries, fields)

  return {
    queryKey: [
      ...Keys.database(databaseId).collection(collectionId).key(),
      ...mergedQueries,
    ] as const,
    queryFn: async () => {
      const { data, errors } = await graphql.query({
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

function useCollectionRealtime<TDocument>(
  databaseId: string,
  collectionId: string,
  queries: string[],
  subscribe: boolean,
) {
  const { realtime } = useAppwrite()
  const queryClient = useQueryClient()
  const queriesKey = JSON.stringify(queries)

  useEffect(() => {
    if (!subscribe) {
      return
    }

    const subscriptionPromise = realtime.subscribe(
      Channel.tablesdb(databaseId).table(collectionId).row(),
      (response) => {
        const [, operation] = response.events[0].match(/\.(\w+)$/) as RegExpMatchArray
        const document = response.payload as Document<TDocument>

        switch (operation as DocumentOperation) {
          case 'create':
          case 'update':
          case 'delete':
            queryClient.setQueryData(
              Keys.database(databaseId).collection(collectionId).document(document.$id).key(),
              document,
            )

            void queryClient.invalidateQueries({
              queryKey: Keys.database(databaseId).collection(collectionId).key(),
            })

            break
        }
      },
    )

    return () => {
      void subscriptionPromise.then((sub) => sub.close())
    }
  }, [databaseId, collectionId, realtime, queryClient, queriesKey, subscribe])
}

export function useCollection<TDocument>({
  databaseId,
  collectionId,
  queries,
  transactionId,
  subscribe = true,
  fields,
}: CollectionParams<TDocument>) {
  const config = useCollectionQueryConfig<TDocument>({
    databaseId,
    collectionId,
    queries,
    transactionId,
    fields,
  })

  const collection = useQuery<Collection<TDocument>, AppwriteException[], Collection<TDocument>>(
    config,
  )

  useCollectionRealtime<TDocument>(databaseId, collectionId, queries, subscribe)

  return {
    ...collection,
    documents: collection.data?.documents,
    total: collection.data?.total,
  }
}

export function useSuspenseCollection<TDocument>({
  databaseId,
  collectionId,
  queries,
  transactionId,
  subscribe = true,
  fields,
}: CollectionParams<TDocument>) {
  const config = useCollectionQueryConfig<TDocument>({
    databaseId,
    collectionId,
    queries,
    transactionId,
    fields,
  })

  const collection = useSuspenseQuery<
    Collection<TDocument>,
    AppwriteException[],
    Collection<TDocument>
  >(config)

  useCollectionRealtime<TDocument>(databaseId, collectionId, queries, subscribe)

  return {
    ...collection,
    documents: collection.data?.documents,
    total: collection.data?.total,
  }
}
