import { onlineManager } from '@tanstack/react-query'
import { describe, expect, mock, test } from 'bun:test'

import { createOfflineClient } from '../../src'

describe('Offline Client', () => {
  test('client throws if storage and persister are both provided', () => {
    expect(() =>
      createOfflineClient({
        endpoint: 'https://example.com',
        projectId: 'projectId',
        networkAdapter: { listen: mock() },
        storage: localStorage,
        persister: {
          persistClient: mock(),
          restoreClient: mock(),
          removeClient: mock(),
        },
      }),
    ).toThrow('Provide either `storage` or `persister`, not both.')
  })

  test('client runs startPersistence normally', () => {
    const client = createOfflineClient({
      endpoint: 'https://example.com',
      projectId: 'projectId',
      networkAdapter: { listen: mock() },
      storage: localStorage,
    })

    const { unsubscribe, restored } = client.startPersistence()

    expect(typeof unsubscribe).toBe('function')
    expect(restored).toBeInstanceOf(Promise)
  })

  test('client throws if startPersistence is called without a persister', () => {
    const client = createOfflineClient({
      endpoint: 'https://example.com',
      projectId: 'projectId',
      networkAdapter: { listen: mock() },
    })

    expect(() => client.startPersistence()).toThrow(
      'No persister configured. Provide `storage` or `persister` to createOfflineClient.',
    )
  })

  test('client sets online status based on network adapter', () => {
    let onlineCallback: ((isOnline: boolean) => void) | null = null

    createOfflineClient({
      endpoint: 'https://example.com',
      projectId: 'projectId',
      networkAdapter: {
        listen: (callback) => {
          onlineCallback = callback
          return () => {}
        },
      },
    })

    expect(onlineManager.isOnline()).toBe(true)

    // Simulate going offline
    onlineCallback?.(false)
    expect(onlineManager.isOnline()).toBe(false)

    // Simulate going back online
    onlineCallback?.(true)
    expect(onlineManager.isOnline()).toBe(true)
  })
})
