import { useEffect, useState } from 'react'
import type { ResultOf } from '@graphql-typed-document-node/core'
import { Channel } from 'appwrite'
import { castDraft, produce } from 'immer'

import type { getAccount } from './queryOptions'
import { getAccountQuery } from './queryOptions'
import { Keys } from '../query/Keys'
import type { AppwriteException, Models, QueryOptions, Realtime } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useLazyQuery } from '../useLazyQuery'
import { useQuery } from '../useQuery'
import { useQueryClient } from '../useQueryClient'

type Result = ResultOf<typeof getAccount>['accountGet']

export function useLazyAccount() {
  const client = useAppwrite()
  const queryClient = useQueryClient()
  const [isActive, setIsActive] = useState(false)

  const queryResult = useLazyQuery<Result, AppwriteException[], Result>(
    getAccountQueryOptions(client),
  )

  useEffect(() => {
    if (!isActive) return

    const subscriptionPromise = subscribe(client.realtime, queryClient)
    return () => {
      void subscriptionPromise.then((sub) => sub.close())
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

export function useAccount(opts: QueryOptions = {}) {
  const client = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
    ...getAccountQueryOptions(client),
    ...opts,
  })

  useEffect(() => {
    const subscriptionPromise = subscribe(client.realtime, queryClient)
    return () => {
      void subscriptionPromise.then((sub) => sub.close())
    }
  }, [client.realtime, queryClient])

  return queryResult
}

function getAccountQueryOptions(client: ReturnType<typeof useAppwrite>) {
  return getAccountQuery(client)
}

function subscribe<Preferences extends Models.Preferences>(
  realtime: Realtime,
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
