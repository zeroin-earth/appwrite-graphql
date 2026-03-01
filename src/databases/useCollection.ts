import { useEffect } from 'react'
import { Channel } from 'appwrite'

import type { Collection, Document } from './types'
import { gql } from '../__generated__'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'
import { useQueryClient } from '../useQueryClient'
import { useSuspenseQuery } from '../useSuspenseQuery'

type DocumentOperation = 'create' | 'update' | 'delete'

type CollectionParams = {
  databaseId: string
  collectionId: string
  queries: string[]
  transactionId?: string
  subscribe?: boolean
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
}: Omit<CollectionParams, 'subscribe'>) {
  const { graphql } = useAppwrite()

  return {
    queryKey: ['appwrite', 'databases', databaseId, collectionId, { queries }] as const,
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: listDocuments,
        variables: {
          databaseId,
          collectionId,
          queries,
          transactionId,
        },
      })

      if (errors) {
        throw errors
      }

      const documents =
        data.databasesListDocuments?.documents?.map((document) => ({
          ...document,
          ...(document ? (JSON.parse(document.data) as TDocument) : {}),
        })) ?? []

      return {
        total: data.databasesListDocuments?.total ?? 0,
        documents,
      } as Collection<TDocument>
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
              ['appwrite', 'databases', databaseId, collectionId, 'documents', document.$id],
              document,
            )

            void queryClient.invalidateQueries({
              queryKey: ['appwrite', 'databases', databaseId, collectionId, { queries }],
              exact: true,
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
}: CollectionParams) {
  const config = useCollectionQueryConfig<TDocument>({
    databaseId,
    collectionId,
    queries,
    transactionId,
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
}: CollectionParams) {
  const config = useCollectionQueryConfig<TDocument>({
    databaseId,
    collectionId,
    queries,
    transactionId,
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
