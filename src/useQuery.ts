import {
  DefinedInitialDataOptions,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  useQuery as useReactQuery,
} from '@tanstack/react-query'

import { useQueryClient } from './useQueryClient'

export function useQuery<TQueryFnData, TError, TData, TQueryKey extends QueryKey = QueryKey>(
  options:
    | UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
) {
  const queryClient = useQueryClient()
  return useReactQuery<TQueryFnData, TError, TData, TQueryKey>(options, queryClient)
}
