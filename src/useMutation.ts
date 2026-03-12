import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation as useReactMutation } from '@tanstack/react-query'

import type { AppwriteException } from './types'
import { useQueryClient } from './useQueryClient'

export function useMutation<
  TData = unknown,
  TError extends AppwriteException[] = [],
  TVariables = void,
  TContext = unknown,
>(options: UseMutationOptions<TData, TError, TVariables, TContext>) {
  const queryClient = useQueryClient()
  return useReactMutation<TData, TError, TVariables, TContext>(options, queryClient)
}
