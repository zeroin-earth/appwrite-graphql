import { useEffect, useState } from 'react'
import { Channel } from 'appwrite'
import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'
import { castDraft, produce } from 'immer'

import { Account_User } from './fragments'
import { Keys } from '../query/Keys'
import type { AppwriteException, Models, Realtime } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useLazyQuery } from '../useLazyQuery'
import { useQuery } from '../useQuery'
import { useQueryClient } from '../useQueryClient'

const getAccount = gql(
  /* GraphQL */ `
    query AccountGet {
      accountGet {
        ...Account_User
      }
    }
  `,
  [Account_User],
)

type Result = ResultOf<typeof getAccount>['accountGet']

export function useLazyAccount() {
  const { graphql, realtime } = useAppwrite()
  const queryClient = useQueryClient()
  const [isActive, setIsActive] = useState(false)

  const queryResult = useLazyQuery<Result, AppwriteException[], Result>(
    getAccountQueryOptions(graphql),
  )

  useEffect(() => {
    if (!isActive) return

    const subscriptionPromise = subscribe(realtime, queryClient)
    return () => {
      void subscriptionPromise.then((sub) => sub.close())
    }
  }, [isActive, realtime, queryClient])

  return {
    ...queryResult,
    run: () => {
      setIsActive(true)
      return queryResult.run()
    },
  }
}

export function useAccount() {
  const { graphql, realtime } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useQuery<Result, AppwriteException[], Result>(
    getAccountQueryOptions(graphql),
  )

  useEffect(() => {
    const subscriptionPromise = subscribe(realtime, queryClient)
    return () => {
      void subscriptionPromise.then((sub) => sub.close())
    }
  }, [realtime, queryClient])

  return queryResult
}

function getAccountQueryOptions(graphql: ReturnType<typeof useAppwrite>['graphql']) {
  return {
    queryKey: Keys.account().key(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: getAccount,
      })

      if (errors) {
        throw errors
      }

      return data.accountGet
    },
    retry: false,
  }
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
