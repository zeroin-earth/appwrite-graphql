import * as React from 'react'
import { type ReactNode } from 'react'
import type { Persister } from '@tanstack/query-persist-client-core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

import type { AppwriteClient } from './client'
import { AppwriteContext } from './context'
import type { KVStorage } from './types'

const defaultQueryClient = new QueryClient()

/**
 * React context provider that supplies the Appwrite client and QueryClient to all child hooks.
 * Must wrap any component using Appwrite hooks.
 *
 * @param client - The Appwrite client created by {@link createAppwriteClient}.
 * @param queryClient - Optional custom `QueryClient` instance.
 * @param kvStorage - Optional key-value storage adapter (e.g. `AsyncStorage` on React Native).
 *   Used by hooks like {@link usePasswordRecovery} to persist data across screens.
 *   On web, `localStorage` is used automatically when this is omitted.
 * @param persister - Optional TanStack `Persister` for offline cache persistence.
 * @param onCacheRestored - Callback invoked after the persisted cache is restored.
 *
 * @example
 * ```tsx
 * import AsyncStorage from '@react-native-async-storage/async-storage'
 *
 * <AppwriteProvider client={client} kvStorage={AsyncStorage}>
 *   <App />
 * </AppwriteProvider>
 * ```
 */
export function AppwriteProvider({
  client,
  queryClient,
  kvStorage,
  persister,
  onCacheRestored,
  children,
}: {
  client: AppwriteClient
  queryClient?: QueryClient
  kvStorage?: KVStorage
  persister?: Persister
  onCacheRestored?: () => void
  children: ReactNode
}) {
  const qc = queryClient ?? defaultQueryClient
  const contextValue = React.useMemo(() => ({ ...client, kvStorage }), [client, kvStorage])

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
        <AppwriteContext.Provider value={contextValue}>{children}</AppwriteContext.Provider>
      </PersistQueryClientProvider>
    )
  }

  return (
    <QueryClientProvider client={qc}>
      <AppwriteContext.Provider value={contextValue}>{children}</AppwriteContext.Provider>
    </QueryClientProvider>
  )
}
