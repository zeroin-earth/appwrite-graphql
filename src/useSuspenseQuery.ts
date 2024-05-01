import {
  DefinedInitialDataOptions,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  useSuspenseQuery as useSuspenseReactQuery,
} from '@tanstack/react-query'

import { useQueryClient } from './useQueryClient'

export function useSuspenseQuery<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options:
    | UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
) {
  const queryClient = useQueryClient()
  return useSuspenseReactQuery<TQueryFnData, TError, TData, TQueryKey>(options, queryClient)
}
