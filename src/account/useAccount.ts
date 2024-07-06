import { useEffect } from 'react'

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
      ...Account_User
    }
  }
`)

export function useAccount<Preferences extends Models.Preferences>() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useQuery<
    AccountGetQuery['accountGet'],
    AppwriteException,
    AccountGetQuery['accountGet']
  >({
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

  return queryResult
}
