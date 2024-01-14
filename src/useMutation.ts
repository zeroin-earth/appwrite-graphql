import {
  DefaultError,
  UseMutationOptions,
  useMutation as useReactMutation,
} from '@tanstack/react-query'

import { useQueryClient } from './useQueryClient'

export function useMutation<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
>(options: UseMutationOptions<TData, TError, TVariables, TContext>) {
  const queryClient = useQueryClient()
  return useReactMutation<TData, TError, TVariables, TContext>(options, queryClient)
}
