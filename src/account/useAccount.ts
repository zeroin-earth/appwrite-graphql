import { useEffect } from 'react'

import { type UseQueryOptions } from '@tanstack/react-query'
import type { AppwriteException, Models } from 'appwrite'
import { castDraft, produce } from 'immer'

import { gql } from '../__generated__/gql'
import { AccountGetQuery } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'
import { useQueryClient } from '../useQueryClient'

export const getAccount = gql(/* GraphQL */ `
  query AccountGet {
    accountGet {
      ...Account_UserFragment
    }
  }
`)

export function useAccount<Preferences extends Models.Preferences>({
  options,
}: {
  options?: UseQueryOptions<
    AccountGetQuery['accountGet'],
    AppwriteException,
    AccountGetQuery['accountGet'],
    string[]
  >
}) {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useQuery({
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
    ...options,
  })

  useEffect(() => {
    const unsubscribe = graphql.client.subscribe<Models.User<Preferences>>(
      'account',
      (response) => {
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

        queryClient.setQueryData<Models.User<Preferences>>(
          ['appwrite', 'account'],
          response.payload,
        )
      },
    )

    return unsubscribe
  }, [graphql.client, queryClient])

  return {
    data: queryResult.data,
    dataUpdatedAt: queryResult.dataUpdatedAt,
    error: queryResult.error,
    errorUpdateCount: queryResult.errorUpdateCount,
    errorUpdatedAt: queryResult.errorUpdatedAt,
    failureCount: queryResult.failureCount,
    failureReason: queryResult.failureReason,
    fetchStatus: queryResult.fetchStatus,
    isError: queryResult.isError,
    isFetched: queryResult.isFetched,
    isFetchedAfterMount: queryResult.isFetchedAfterMount,
    isFetching: queryResult.isFetching,
    isLoading: queryResult.isLoading,
    isLoadingError: queryResult.isLoadingError,
    isPaused: queryResult.isPaused,
    isPending: queryResult.isPending,
    isPlaceholderData: queryResult.isPlaceholderData,
    isRefetchError: queryResult.isRefetchError,
    isRefetching: queryResult.isRefetching,
    isStale: queryResult.isStale,
    isSuccess: queryResult.isSuccess,
    refetch: queryResult.refetch,
    status: queryResult.status,
  }
}
