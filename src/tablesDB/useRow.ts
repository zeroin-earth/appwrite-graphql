import { useEffect } from 'react'
import { Channel } from 'appwrite'
import type { VariablesOf } from 'gql.tada'

import type { getRow } from './queryOptions'
import { getRowQuery } from './queryOptions'
import type { Row } from './types'
import { Keys } from '../query/Keys'
import type { AppwriteException, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'
import { useQueryClient } from '../useQueryClient'
import { useSuspenseQuery } from '../useSuspenseQuery'

type Variables = VariablesOf<typeof getRow>

/** The parameters accepted by the {@link useRow} hook. */
export type RowParams<TRow = Record<string, unknown>> = Variables & {
  fields?: (keyof TRow & string)[]
}

function useRowQueryConfig<TRow>({
  databaseId,
  tableId,
  rowId,
  queries,
  transactionId,
  fields,
}: RowParams<TRow>) {
  const client = useAppwrite()

  return getRowQuery<TRow>(client, {
    databaseId,
    tableId,
    rowId,
    queries,
    transactionId,
    fields,
  })
}

function useRowRealtime(databaseId: string, tableId: string, rowId: string, queriesKey: string) {
  const { realtime } = useAppwrite()
  const queryClient = useQueryClient()

  useEffect(() => {
    const subscriptionPromise = realtime.subscribe(
      Channel.tablesdb(databaseId).table(tableId).row(rowId).update(),
      (response) => {
        queryClient.setQueryData(
          Keys.tablesDB(databaseId).table(tableId).row(rowId).key(),
          response.payload,
        )
      },
    )

    return () => {
      void subscriptionPromise?.then?.((sub) => sub.close())
    }
  }, [databaseId, tableId, rowId, realtime, queryClient, queriesKey])
}

/**
 * Fetches a single TablesDB row by ID and subscribes to real-time updates.
 *
 * @typeParam TRow - The shape of the row's typed column data.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useRow({
 *   databaseId: 'my-db',
 *   tableId: 'my-table',
 *   rowId: 'row-123',
 * })
 * ```
 *
 * **Parameters** ({@link RowParams}):
 * - `databaseId` — The database ID
 * - `tableId` — The table ID
 * - `rowId` — The row ID to fetch
 * - `queries` — Optional query filters
 * - `transactionId` — Optional transaction ID for atomic reads
 * - `fields` — Optional array of fields to select
 *
 * @returns A `UseQueryResult` with the row data as `Row<TRow>`.
 */
export function useRow<TRow>(
  { databaseId, tableId, rowId, queries, transactionId, fields }: RowParams<TRow>,
  opts: QueryOptions = {},
) {
  const config = useRowQueryConfig<TRow>({
    databaseId,
    tableId,
    rowId,
    queries,
    transactionId,
    fields,
  })
  const queriesKey = JSON.stringify(queries)

  const queryResult = useQuery<Row<TRow>, AppwriteException[], Row<TRow>>({
    ...config,
    ...opts,
  })

  useRowRealtime(databaseId, tableId, rowId, queriesKey)

  return queryResult
}

/**
 * Suspense variant of {@link useRow}. Suspends the component while loading.
 *
 * @typeParam TRow - The shape of the row's typed column data.
 *
 * @example
 * ```tsx
 * const { data } = useSuspenseRow({
 *   databaseId: 'my-db',
 *   tableId: 'my-table',
 *   rowId: 'row-123',
 * })
 * ```
 *
 * **Parameters** ({@link RowParams}):
 * - `databaseId` — The database ID
 * - `tableId` — The table ID
 * - `rowId` — The row ID to fetch
 * - `queries` — Optional query filters
 * - `transactionId` — Optional transaction ID for atomic reads
 * - `fields` — Optional array of fields to select
 *
 * @returns A `UseSuspenseQueryResult` with the row data as `Row<TRow>`.
 */
export function useSuspenseRow<TRow>(
  { databaseId, tableId, rowId, queries, transactionId, fields }: RowParams<TRow>,
  opts: QueryOptions = {},
) {
  const config = useRowQueryConfig<TRow>({
    databaseId,
    tableId,
    rowId,
    queries,
    transactionId,
    fields,
  })
  const queriesKey = JSON.stringify(queries)

  const queryResult = useSuspenseQuery<Row<TRow>, AppwriteException[], Row<TRow>>({
    ...config,
    ...opts,
  })

  useRowRealtime(databaseId, tableId, rowId, queriesKey)

  return queryResult
}
