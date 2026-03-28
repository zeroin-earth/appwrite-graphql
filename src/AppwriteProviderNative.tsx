import * as React from 'react'
import { type ReactNode } from 'react'
import type { Persister } from '@tanstack/query-persist-client-core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

import type { AppwriteClient } from './client'

export const AppwriteContext = React.createContext<AppwriteClient | null>(null)

const defaultQueryClient = new QueryClient()

/**
 * React context provider that supplies the Appwrite client and QueryClient to all child hooks.
 * Supports optional `persister` for offline cache persistence and `onCacheRestored` callback.
 * Must wrap any component using Appwrite hooks.
 *
 * @example
 * ```tsx
 * <AppwriteProvider client={client}>
 *   <App />
 * </AppwriteProvider>
 * ```
 */
export function AppwriteProvider({
  client,
  queryClient,
  persister,
  onCacheRestored,
  children,
}: {
  client: AppwriteClient
  queryClient?: QueryClient
  persister?: Persister
  onCacheRestored?: () => void
  children: ReactNode
}) {
  const qc = queryClient ?? defaultQueryClient

  if (persister) {
    return (
      <PersistQueryClientProvider
        client={qc}
        persistOptions={{
          persister,
          dehydrateOptions: {
            shouldDehydrateMutation: (mutation) => mutation.state.isPaused,
            shouldDehydrateQuery: (query) => query.state.status === 'success',
          },
        }}
        onSuccess={() => {
          void qc.resumePausedMutations()
          onCacheRestored?.()
        }}
      >
        <AppwriteContext.Provider value={client}>{children}</AppwriteContext.Provider>
      </PersistQueryClientProvider>
    )
  }

  return (
    <QueryClientProvider client={qc}>
      <AppwriteContext.Provider value={client}>{children}</AppwriteContext.Provider>
    </QueryClientProvider>
  )
}
