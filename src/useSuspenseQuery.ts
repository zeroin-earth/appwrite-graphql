import {
  QueryKey,
  UseSuspenseQueryOptions,
  useSuspenseQuery as useSuspenseReactQuery,
} from '@tanstack/react-query'

import { useQueryClient } from './useQueryClient'

export function useSuspenseQuery<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  const queryClient = useQueryClient()
  return useSuspenseReactQuery<TQueryFnData, TError, TData, TQueryKey>(options, queryClient)
}
