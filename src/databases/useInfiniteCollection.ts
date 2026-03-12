import { useCallback, useEffect, useState } from 'react'
import { Query } from 'appwrite'

import type { Document } from './types'
import { useCollection } from './useCollection'

export function useInfiniteCollection<TDocument>({
  databaseId,
  collectionId,
  queries,
  transactionId,
  limit = 25,
  subscribe = true,
  fields,
}: {
  databaseId: string
  collectionId: string
  queries: string[]
  transactionId?: string
  limit?: number
  subscribe?: boolean
  fields?: (keyof TDocument & string)[]
}) {
  const [page, setPage] = useState(1)
  const [accumulated, setAccumulated] = useState<Document<TDocument>[]>([])

  const offset = (page - 1) * limit
  const paginatedQueries = [...queries, Query.limit(limit), Query.offset(offset)]

  const collection = useCollection<TDocument>({
    databaseId,
    collectionId,
    queries: paginatedQueries,
    transactionId,
    subscribe,
    fields,
  })

  // Accumulate documents across pages
  useEffect(() => {
    if (collection.documents) {
      if (page === 1) {
        setAccumulated([...collection.documents])
      } else {
        setAccumulated((prev) => {
          // Only append if we don't already have documents for this page
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
