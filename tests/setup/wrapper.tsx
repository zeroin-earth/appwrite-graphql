import * as React from 'react'
import { QueryClient } from '@tanstack/react-query'
import { Provider } from 'jotai'

import { getTestConfig } from './helpers'
import { AppwriteProvider } from '../../src/AppwriteProvider'
const { Suspense } = React

export function createWrapper(opts?: { queryClient?: QueryClient; suspense?: boolean }) {
  const config = getTestConfig()
  const queryClient =
    opts?.queryClient ??
    new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    })

  // Clear Appwrite SDK session state to prevent leakage between tests
  if (typeof globalThis.localStorage !== 'undefined') {
    globalThis.localStorage.removeItem('cookieFallback')
  }

  return function TestWrapper({ children }: { children: React.ReactNode }) {
    const inner = (
      <Provider>
        <AppwriteProvider
          endpoint={config.endpoint}
          projectId={config.projectId}
          queryClient={queryClient}
        >
          {children}
        </AppwriteProvider>
      </Provider>
    )

    if (opts?.suspense) {
      return <Suspense fallback={<div>Loading...</div>}>{inner}</Suspense>
    }

    return inner
  }
}

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}
