import { useRef, useState } from 'react'
import { Query } from 'appwrite'

import { useSuspenseTableRows, useTableRows } from './useTableRows'
import type { QueryOptions } from '../types'

type PaginationParams<TRow = Record<string, unknown>> = {
  databaseId: string
  tableId: string
  queries: string[]
  transactionId?: string
  limit?: number
  fields?: (keyof TRow & string)[]
}

function usePaginationState(limit: number) {
  const [page, setPage] = useState(1)
  const totalRef = useRef(0)
  const offset = (page - 1) * limit

  const nextPage = () => {
    setPage((prevPage) => {
      const currentOffset = (prevPage - 1) * limit
      if (totalRef.current > 0 && currentOffset + limit < totalRef.current) {
        return prevPage + 1
      }
      return prevPage
    })
  }

  const previousPage = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage))
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return
    if (totalRef.current > 0) {
      const maxPage = Math.ceil(totalRef.current / limit)
      if (newPage > maxPage) return
    }
    setPage(newPage)
  }

  return { page, offset, totalRef, nextPage, previousPage, handlePageChange }
}

/**
 * Fetches a paginated list of TablesDB rows. Returns pagination helpers
 * (`page`, `hasNextPage`, `hasPreviousPage`, `nextPage`, `previousPage`, `handlePageChange`).
 * Default page limit is 25.
 *
 * @typeParam TRow - The shape of each row's typed column data.
 *
 * @example
 * ```tsx
 * const { documents, page, nextPage, previousPage, hasNextPage } =
 *   useTableRowsWithPagination({
 *     databaseId: 'my-db',
 *     tableId: 'my-table',
 *     queries: [Query.equal('status', 'active')],
 *     limit: 10,
 *   })
 * ```
 *
 * **Parameters** (`PaginationParams`):
 * - `databaseId` — The database ID
 * - `tableId` — The table ID
 * - `queries` — Query filters applied to the table
 * - `transactionId` — Optional transaction ID for atomic reads
 * - `limit` — Number of rows per page (defaults to `25`)
 * - `fields` — Optional array of row fields to select
 *
 * @returns An object with `documents`, `total`, `page`, `hasNextPage`, `hasPreviousPage`,
 *   `nextPage()`, `previousPage()`, `handlePageChange(page)`, and standard query status flags.
 */
export function useTableRowsWithPagination<TRow>(
  { databaseId, tableId, queries, transactionId, limit = 25, fields }: PaginationParams<TRow>,
  opts: QueryOptions = {},
) {
  const { page, offset, totalRef, nextPage, previousPage, handlePageChange } =
    usePaginationState(limit)

  const collection = useTableRows<TRow>(
    {
      databaseId,
      tableId,
      queries: [...queries, Query.limit(limit), Query.offset(offset)],
      transactionId,
      fields,
    },
    opts,
  )

  const total = collection.data?.total ?? 0
  totalRef.current = total

  return {
    documents: collection.data?.documents ?? [],
    total,
    page,
    hasNextPage: total > 0 && offset + limit < total,
    hasPreviousPage: page > 1,
    handlePageChange,
    nextPage,
    previousPage,
    isLoading: collection.isLoading,
    isError: collection.isError,
    error: collection.error,
    isFetching: collection.isFetching,
  }
}

/**
 * Suspense variant of {@link useTableRowsWithPagination}. Suspends the component while loading.
 *
 * @typeParam TRow - The shape of each row's typed column data.
 *
 * @example
 * ```tsx
 * const { documents, page, nextPage, hasNextPage } =
 *   useSuspenseTableRowsWithPagination({
 *     databaseId: 'my-db',
 *     tableId: 'my-table',
 *     queries: [Query.equal('status', 'active')],
 *   })
 * ```
 *
 * **Parameters** (`PaginationParams`):
 * - `databaseId` — The database ID
 * - `tableId` — The table ID
 * - `queries` — Query filters applied to the table
 * - `transactionId` — Optional transaction ID for atomic reads
 * - `limit` — Number of rows per page (defaults to `25`)
 * - `fields` — Optional array of row fields to select
 *
 * @returns An object with `documents`, `total`, `page`, `hasNextPage`, `hasPreviousPage`,
 *   `nextPage()`, `previousPage()`, `handlePageChange(page)`, and standard query status flags.
 */
export function useSuspenseTableRowsWithPagination<TRow>(
  { databaseId, tableId, queries, transactionId, limit = 25, fields }: PaginationParams<TRow>,
  opts: QueryOptions = {},
) {
  const { page, offset, totalRef, nextPage, previousPage, handlePageChange } =
    usePaginationState(limit)

  const collection = useSuspenseTableRows<TRow>(
    {
      databaseId,
      tableId,
      queries: [...queries, Query.limit(limit), Query.offset(offset)],
      transactionId,
      fields,
    },
    opts,
  )

  const total = collection.total ?? 0
  totalRef.current = total

  return {
    documents: collection.documents ?? [],
    total,
    page,
    hasNextPage: total > 0 && offset + limit < total,
    hasPreviousPage: page > 1,
    handlePageChange,
    nextPage,
    previousPage,
    isLoading: collection.isLoading,
    isError: collection.isError,
    error: collection.error,
    isFetching: collection.isFetching,
  }
}
