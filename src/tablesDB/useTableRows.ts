import { useEffect } from 'react'
import { Channel } from 'appwrite'

import { getTableRowsQuery } from './queryOptions'
import type { Row, RowCollection } from './types'
import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'
import { useQueryClient } from '../useQueryClient'
import { useSuspenseQuery } from '../useSuspenseQuery'

type RowOperation = 'create' | 'update' | 'delete'

type TableRowsParams<TRow = Record<string, string | number | boolean | null>> = Prettify<{
  databaseId: string
  tableId: string
  queries?: string[]
  transactionId?: string
  subscribe?: boolean
  fields?: (keyof TRow & string)[]
}>

function useTableRowsQueryConfig<TRow>({
  databaseId,
  tableId,
  queries,
  transactionId,
  fields,
}: Omit<TableRowsParams<TRow>, 'subscribe'>) {
  const client = useAppwrite()

  return getTableRowsQuery<TRow>(client, {
    databaseId,
    tableId,
    queries,
    transactionId,
    fields,
  })
}

function useTableRowsRealtime<TRow>(
  databaseId: string,
  tableId: string,
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
      Channel.tablesdb(databaseId).table(tableId).row(),
      (response) => {
        const [, operation] = response.events[0].match(/\.(\w+)$/) as RegExpMatchArray
        const row = response.payload as Row<TRow>

        switch (operation as RowOperation) {
          case 'create':
          case 'update':
          case 'delete':
            queryClient.setQueryData(
              Keys.tablesDB(databaseId).table(tableId).row(row.$id).key(),
              row,
            )

            void queryClient.invalidateQueries({
              queryKey: Keys.tablesDB(databaseId).table(tableId).rows().key(),
            })

            break
        }
      },
    )

    return () => {
      void subscriptionPromise?.then?.((sub) => sub.close())
    }
  }, [databaseId, tableId, realtime, queryClient, queriesKey, subscribe])
}

/**
 * Fetches all rows in a TablesDB table with optional real-time subscription (enabled by default).
 * Returns `documents` and `total` alongside the standard query result.
 *
 * @typeParam TRow - The shape of each row's typed column data.
 *
 * @example
 * ```tsx
 * const { documents, total, isLoading } = useTableRows({
 *   databaseId: 'my-db',
 *   tableId: 'my-table',
 *   queries: [Query.equal('status', 'active')],
 * })
 * ```
 *
 * **Parameters** (`TableRowsParams`):
 * - `databaseId` — The database ID
 * - `tableId` — The table ID
 * - `queries` — Optional query filters (defaults to `[]`)
 * - `transactionId` — Optional transaction ID for atomic reads
 * - `subscribe` — Whether to subscribe to real-time updates (defaults to `true`)
 * - `fields` — Optional array of row fields to select
 *
 * @returns A `UseQueryResult` with the row collection as `RowCollection<TRow>`, plus
 *   convenience accessors `documents` and `total`.
 */
export function useTableRows<TRow>(
  {
    databaseId,
    tableId,
    queries = [],
    transactionId,
    subscribe = true,
    fields,
  }: TableRowsParams<TRow>,
  opts: QueryOptions = {},
) {
  const config = useTableRowsQueryConfig<TRow>({
    databaseId,
    tableId,
    queries,
    transactionId,
    fields,
  })

  const collection = useQuery<RowCollection<TRow>, AppwriteException[], RowCollection<TRow>>({
    ...config,
    ...opts,
  })

  useTableRowsRealtime<TRow>(databaseId, tableId, queries, subscribe)

  return {
    ...collection,
    documents: collection.data?.documents,
    total: collection.data?.total,
  }
}

/**
 * Suspense variant of {@link useTableRows}. Suspends the component while loading.
 *
 * @typeParam TRow - The shape of each row's typed column data.
 *
 * @example
 * ```tsx
 * const { documents, total } = useSuspenseTableRows({
 *   databaseId: 'my-db',
 *   tableId: 'my-table',
 * })
 * ```
 *
 * **Parameters** (`TableRowsParams`):
 * - `databaseId` — The database ID
 * - `tableId` — The table ID
 * - `queries` — Optional query filters
 * - `transactionId` — Optional transaction ID for atomic reads
 * - `subscribe` — Whether to subscribe to real-time updates (defaults to `true`)
 * - `fields` — Optional array of row fields to select
 *
 * @returns A `UseSuspenseQueryResult` with the row collection as `RowCollection<TRow>`, plus
 *   convenience accessors `documents` and `total`.
 */
export function useSuspenseTableRows<TRow>(
  { databaseId, tableId, queries, transactionId, subscribe = true, fields }: TableRowsParams<TRow>,
  opts: QueryOptions = {},
) {
  const config = useTableRowsQueryConfig<TRow>({
    databaseId,
    tableId,
    queries,
    transactionId,
    fields,
  })

  const collection = useSuspenseQuery<
    RowCollection<TRow>,
    AppwriteException[],
    RowCollection<TRow>
  >({
    ...config,
    ...opts,
  })

  useTableRowsRealtime<TRow>(databaseId, tableId, queries ?? [], subscribe)

  return {
    ...collection,
    documents: collection.data?.documents,
    total: collection.data?.total,
  }
}
