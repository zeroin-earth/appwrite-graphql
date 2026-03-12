import { useRef, useState } from 'react'
import { Query } from 'appwrite'

import { useCollection, useSuspenseCollection } from './useCollection'
import type { QueryOptions } from '../types'

type PaginationParams<TDocument = Record<string, unknown>> = {
  databaseId: string
  collectionId: string
  queries: string[]
  transactionId?: string
  limit?: number
  fields?: (keyof TDocument & string)[]
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

export function useCollectionWithPagination<TDocument>(
  {
    databaseId,
    collectionId,
    queries,
    transactionId,
    limit = 25,
    fields,
  }: PaginationParams<TDocument>,
  opts: QueryOptions = {},
) {
  const { page, offset, totalRef, nextPage, previousPage, handlePageChange } =
    usePaginationState(limit)

  const collection = useCollection<TDocument>(
    {
      databaseId,
      collectionId,
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

export function useSuspenseCollectionWithPagination<TDocument>(
  {
    databaseId,
    collectionId,
    queries,
    transactionId,
    limit = 25,
    fields,
  }: PaginationParams<TDocument>,
  opts: QueryOptions = {},
) {
  const { page, offset, totalRef, nextPage, previousPage, handlePageChange } =
    usePaginationState(limit)

  const collection = useSuspenseCollection<TDocument>(
    {
      databaseId,
      collectionId,
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
