import { useCallback, useEffect, useState } from 'react'
import { Query } from 'appwrite'

import type { Row } from './types'
import { useTableRows } from './useTableRows'

/**
 * Fetches TablesDB rows with infinite scroll pagination, accumulating results across pages.
 * Returns `documents`, `total`, `hasNextPage`, `fetchNextPage`, `isFetchingNextPage`, and `reset`.
 * Default page limit is 25.
 *
 * @typeParam TRow - The shape of each row's typed column data.
 *
 * @example
 * ```tsx
 * const { documents, fetchNextPage, hasNextPage, isFetchingNextPage } =
 *   useInfiniteTableRows({
 *     databaseId: 'my-db',
 *     tableId: 'my-table',
 *     queries: [Query.orderDesc('$createdAt')],
 *     limit: 20,
 *   })
 * ```
 *
 * **Parameters:**
 * - `databaseId` — The database ID
 * - `tableId` — The table ID
 * - `queries` — Query filters applied to the table
 * - `transactionId` — Optional transaction ID for atomic reads
 * - `limit` — Number of rows per page (defaults to `25`)
 * - `subscribe` — Whether to subscribe to real-time updates (defaults to `true`)
 * - `fields` — Optional array of row fields to select
 *
 * @returns An object with accumulated `documents`, `total`, `hasNextPage`, `fetchNextPage()`,
 *   `isFetchingNextPage`, `reset()`, and standard query status flags.
 */
export function useInfiniteTableRows<TRow>({
  databaseId,
  tableId,
  queries,
  transactionId,
  limit = 25,
  subscribe = true,
  fields,
}: {
  databaseId: string
  tableId: string
  queries: string[]
  transactionId?: string
  limit?: number
  subscribe?: boolean
  fields?: (keyof TRow & string)[]
}) {
  const [page, setPage] = useState(1)
  const [accumulated, setAccumulated] = useState<Row<TRow>[]>([])

  const offset = (page - 1) * limit
  const paginatedQueries = [...queries, Query.limit(limit), Query.offset(offset)]

  const collection = useTableRows<TRow>({
    databaseId,
    tableId,
    queries: paginatedQueries,
    transactionId,
    subscribe,
    fields,
  })

  // Accumulate rows across pages
  useEffect(() => {
    if (collection.documents) {
      if (page === 1) {
        setAccumulated([...collection.documents])
      } else {
        setAccumulated((prev) => {
          // Only append if we don't already have rows for this page
          const expectedLength = (page - 1) * limit + collection.documents!.length
          if (prev.length < expectedLength) {
            return [...prev, ...collection.documents!]
          }
          return prev
        })
      }
    }
  }, [collection.documents, page, limit])

  const total = collection.total ?? 0
  const hasNextPage = total > 0 && offset + limit < total

  const fetchNextPage = useCallback(() => {
    if (hasNextPage && !collection.isFetching) {
      setPage((prev) => prev + 1)
    }
  }, [hasNextPage, collection.isFetching])

  const reset = useCallback(() => {
    setAccumulated([])
    setPage(1)
  }, [])

  return {
    documents: accumulated,
    total,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage: page > 1 && collection.isFetching,
    isLoading: collection.isLoading,
    isError: collection.isError,
    error: collection.error,
    isFetching: collection.isFetching,
    reset,
  }
}
