import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation as useReactMutation } from '@tanstack/react-query'

import type { AppwriteException } from './types'
import { useQueryClient } from './useQueryClient'

/**
 * Wrapper around TanStack Query's `useMutation` that automatically injects the Appwrite-managed `QueryClient`.
 * Use this instead of importing `useMutation` from `@tanstack/react-query` directly.
 */
export function useMutation<
  TData = unknown,
  TError extends AppwriteException[] = [],
  TVariables = void,
  TContext = unknown,
>(options: UseMutationOptions<TData, TError, TVariables, TContext>) {
  const queryClient = useQueryClient()
  return useReactMutation<TData, TError, TVariables, TContext>(options, queryClient)
}
