import * as React from 'react'
import { QueryClient } from '@tanstack/react-query'

import ErrorBoundary from './ErrorBoundry'
import { getTestConfig } from './helpers'
import type { Persister } from '../../src'
import { createAppwriteClient } from '../../src'
import { AppwriteProvider } from '../../src/AppwriteProvider'
import type { AppwriteClient } from '../../src/client'
const { Suspense } = React

export function createWrapper(opts?: {
  queryClient?: QueryClient
  suspense?: boolean
  client?: AppwriteClient
  persister?: Persister
}) {
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

  const appwriteClient =
    opts?.client ??
    createAppwriteClient({
      endpoint: config.endpoint,
      projectId: config.projectId,
    })

  return function TestWrapper({ children }: { children: React.ReactNode }) {
    const inner = (
      <AppwriteProvider
        client={appwriteClient}
        persister={opts?.persister}
        queryClient={queryClient}
      >
        {children}
      </AppwriteProvider>
    )

    if (opts?.suspense) {
      return (
        <ErrorBoundary fallback={<div>Error occurred</div>}>
          <Suspense fallback={<div>Loading...</div>}>{inner}</Suspense>
        </ErrorBoundary>
      )
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
