import { useEffect, useState } from 'react'
import type { ResultOf } from '@graphql-typed-document-node/core'
import { Channel } from 'appwrite'
import { castDraft, produce } from 'immer'

import type { getAccount } from './queryOptions'
import { getAccountQuery } from './queryOptions'
import { Keys } from '../query/Keys'
import type { AppwriteException, Models, Prettify, QueryOptions, RealtimeLike } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useLazyQuery } from '../useLazyQuery'
import { useQuery } from '../useQuery'
import { useQueryClient } from '../useQueryClient'

/** The result returned by the {@link useAccount} query. */
export type AccountResult = Prettify<ResultOf<typeof getAccount>['accountGet']>

/**
 * Lazily fetches the current authenticated user's account. The query is
 * disabled until `run()` is called. Subscribes to real-time account updates
 * once activated.
 *
 * @example
 * ```tsx
 * const { data, run, isLoading } = useLazyAccount()
 *
 * // Call run() to trigger the query
 * run()
 * ```
 *
 * @returns A lazy query result with a `run()` function to trigger fetching ({@link AccountResult}).
 */
export function useLazyAccount() {
  const client = useAppwrite()
  const queryClient = useQueryClient()
  const [isActive, setIsActive] = useState(false)

  const queryResult = useLazyQuery<AccountResult, AppwriteException[], AccountResult>(
    getAccountQueryOptions(client),
  )

  useEffect(() => {
    if (!isActive) return

    const subscriptionPromise = subscribe(client.realtime, queryClient)
    return () => {
      void subscriptionPromise?.then?.((sub) => sub.close())
    }
  }, [isActive, client.realtime, queryClient])

  return {
    ...queryResult,
    run: () => {
      setIsActive(true)
      return queryResult.run()
    },
  }
}

/**
 * Fetches the current authenticated user's account and subscribes to
 * real-time updates.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useAccount()
 * ```
 *
 * @param opts - Optional query options to customize caching, refetching, etc.
 * @returns A `UseQueryResult` with the authenticated user's account ({@link AccountResult}).
 */
export function useAccount(opts: QueryOptions = {}) {
  const client = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useQuery<AccountResult, AppwriteException[], AccountResult>({
    ...getAccountQueryOptions(client),
    ...opts,
  })

  useEffect(() => {
    const subscriptionPromise = subscribe(client.realtime, queryClient)
    return () => {
      void subscriptionPromise?.then?.((sub) => sub.close())
    }
  }, [client.realtime, queryClient])

  return queryResult
}

function getAccountQueryOptions(client: ReturnType<typeof useAppwrite>) {
  return getAccountQuery(client)
}

function subscribe<Preferences extends Models.Preferences>(
  realtime: RealtimeLike,
  queryClient: ReturnType<typeof useQueryClient>,
) {
  return realtime.subscribe<Models.User<Preferences>>(Channel.account(), (response) => {
    const isUpdatingPreferences = response.events.some((event) => event.endsWith('prefs'))

    if (isUpdatingPreferences) {
      queryClient.setQueryData<Models.User<Preferences>>(Keys.account().key(), (account) =>
        produce(account, (draft) => {
          if (draft) {
            draft.prefs = castDraft(response.payload.prefs) as typeof draft.prefs
          }
        }),
      )

      return
    }

    queryClient.setQueryData<Models.User<Preferences>>(Keys.account().key(), response.payload)
  })
}
