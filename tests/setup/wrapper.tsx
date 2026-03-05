import * as React from 'react'
import { QueryClient } from '@tanstack/react-query'

import { getTestConfig } from './helpers'
import { createAppwriteClient } from '../../src'
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

  const client = createAppwriteClient({
    endpoint: config.endpoint,
    projectId: config.projectId,
  })

  return function TestWrapper({ children }: { children: React.ReactNode }) {
    const inner = (
      <AppwriteProvider client={client} queryClient={queryClient}>
        {children}
      </AppwriteProvider>
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
