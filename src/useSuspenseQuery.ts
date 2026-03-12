import type { QueryKey, UseSuspenseQueryOptions } from '@tanstack/react-query'
import { useSuspenseQuery as useSuspenseReactQuery } from '@tanstack/react-query'

import type { AppwriteException } from './types'
import { useQueryClient } from './useQueryClient'

export function useSuspenseQuery<
  TQueryFnData,
  TError extends AppwriteException[],
  TData,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  const queryClient = useQueryClient()
  return useSuspenseReactQuery<TQueryFnData, TError, TData, TQueryKey>(options, queryClient)
}
