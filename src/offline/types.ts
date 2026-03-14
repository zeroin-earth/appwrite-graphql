import type { QueryClient } from '@tanstack/react-query'

import type { AppwriteClient } from '../client'

export type NetworkAdapter = {
  listen: (callback: (isOnline: boolean) => void) => () => void
}

export type Vars = Record<string, unknown>
export type MutationFn = (
  client: AppwriteClient,
  variables: Vars,
  queryClient: QueryClient,
) => Promise<unknown>
