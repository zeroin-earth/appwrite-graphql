import { useEffect } from 'react'
import { Channel } from 'appwrite'

import { getCollectionQuery } from './queryOptions'
import type { Collection, Document } from './types'
import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'
import { useQueryClient } from '../useQueryClient'
import { useSuspenseQuery } from '../useSuspenseQuery'

type DocumentOperation = 'create' | 'update' | 'delete'

type CollectionParams<TDocument = Record<string, string | number | boolean | null>> = Prettify<{
  databaseId: string
  collectionId: string
  queries?: string[]
  transactionId?: string
  subscribe?: boolean
  fields?: (keyof TDocument & string)[]
}>

function useCollectionQueryConfig<TDocument>({
  databaseId,
  collectionId,
  queries,
  transactionId,
  fields,
}: Omit<CollectionParams<TDocument>, 'subscribe'>) {
  const client = useAppwrite()

  return getCollectionQuery<TDocument>(client, {
    databaseId,
    collectionId,
    queries,
    transactionId,
    fields,
  })
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
      void subscriptionPromise?.then?.((sub) => sub.close())
    }
  }, [databaseId, collectionId, realtime, queryClient, queriesKey, subscribe])
}

/**
 * Fetches a collection of documents with optional real-time subscription (enabled by default).
 * Returns `documents` and `total` alongside the standard query result.
 *
 * @typeParam TDocument - The shape of each document's custom attributes.
 *
 * @example
 * ```tsx
 * const { documents, total, isLoading } = useCollection({
 *   databaseId: 'my-db',
 *   collectionId: 'my-collection',
 *   queries: [Query.equal('status', 'active')],
 * })
 * ```
 *
 * **Parameters** (`CollectionParams`):
 * - `databaseId` — The database ID
 * - `collectionId` — The collection ID
 * - `queries` — Optional query filters (defaults to `[]`)
 * - `transactionId` — Optional transaction ID for atomic reads
 * - `subscribe` — Whether to subscribe to real-time updates (defaults to `true`)
 * - `fields` — Optional array of document fields to select
 *
 * @returns A `UseQueryResult` with the collection data as `Collection<TDocument>`, plus
 *   convenience accessors `documents` and `total`.
 */
export function useCollection<TDocument>(
  {
    databaseId,
    collectionId,
    queries = [],
    transactionId,
    subscribe = true,
    fields,
  }: CollectionParams<TDocument>,
  opts: QueryOptions = {},
) {
  const config = useCollectionQueryConfig<TDocument>({
    databaseId,
    collectionId,
    queries,
    transactionId,
    fields,
  })

  const collection = useQuery<Collection<TDocument>, AppwriteException[], Collection<TDocument>>({
    ...config,
    ...opts,
  })

  useCollectionRealtime<TDocument>(databaseId, collectionId, queries, subscribe)

  return {
    ...collection,
    documents: collection.data?.documents,
    total: collection.data?.total,
  }
}

/**
 * Suspense variant of {@link useCollection}. Suspends the component while loading.
 *
 * @typeParam TDocument - The shape of each document's custom attributes.
 *
 * @example
 * ```tsx
 * const { documents, total } = useSuspenseCollection({
 *   databaseId: 'my-db',
 *   collectionId: 'my-collection',
 * })
 * ```
 *
 * **Parameters** (`CollectionParams`):
 * - `databaseId` — The database ID
 * - `collectionId` — The collection ID
 * - `queries` — Optional query filters
 * - `transactionId` — Optional transaction ID for atomic reads
 * - `subscribe` — Whether to subscribe to real-time updates (defaults to `true`)
 * - `fields` — Optional array of document fields to select
 *
 * @returns A `UseSuspenseQueryResult` with the collection data as `Collection<TDocument>`, plus
 *   convenience accessors `documents` and `total`.
 */
export function useSuspenseCollection<TDocument>(
  {
    databaseId,
    collectionId,
    queries,
    transactionId,
    subscribe = true,
    fields,
  }: CollectionParams<TDocument>,
  opts: QueryOptions = {},
) {
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
  >({
    ...config,
    ...opts,
  })

  useCollectionRealtime<TDocument>(databaseId, collectionId, queries, subscribe)

  return {
    ...collection,
    documents: collection.data?.documents,
    total: collection.data?.total,
  }
}
