import { useEffect } from 'react'

import { castDraft, produce } from 'immer'

import { gql } from '../__generated__/gql'
import { AccountGetQuery } from '../__generated__/graphql'
import type { AppwriteException, Models } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useLazyQuery } from '../useLazyQuery'
import { useQuery } from '../useQuery'
import { useQueryClient } from '../useQueryClient'

export const getAccount = gql(/* GraphQL */ `
  query AccountGet {
    accountGet {
      ...Account_User
    }
  }
`)

export function useLazyAccount() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useLazyQuery<
    AccountGetQuery['accountGet'],
    AppwriteException[],
    AccountGetQuery['accountGet']
  >(getAccountQueryOptions(graphql))

  useEffect(() => {
    const unsubscribe = subscription(graphql, queryClient)
    return unsubscribe
  }, [graphql.client, queryClient])

  return queryResult
}

export function useAccount() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useQuery<
    AccountGetQuery['accountGet'],
    AppwriteException[],
    AccountGetQuery['accountGet']
  >(getAccountQueryOptions(graphql))

  useEffect(() => {
    const unsubscribe = subscription(graphql, queryClient)
    return unsubscribe
  }, [graphql.client, queryClient])

  return queryResult
}

function getAccountQueryOptions(graphql: ReturnType<typeof useAppwrite>['graphql']) {
  return {
    queryKey: ['appwrite', 'account'],
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

function subscription<Preferences extends Models.Preferences>(
  graphql: ReturnType<typeof useAppwrite>['graphql'],
  queryClient: ReturnType<typeof useQueryClient>,
) {
  return graphql.client.subscribe<Models.User<Preferences>>('account', (response) => {
    const isUpdatingPreferences = response.events.some((event) => event.endsWith('prefs'))

    if (isUpdatingPreferences) {
      queryClient.setQueryData<Models.User<Preferences>>(['appwrite', 'account'], (account) =>
        produce(account, (draft) => {
          if (draft) {
            draft.prefs = castDraft(response.payload.prefs)
          }
        }),
      )

      return
    }

    queryClient.setQueryData<Models.User<Preferences>>(['appwrite', 'account'], response.payload)
  })
}
