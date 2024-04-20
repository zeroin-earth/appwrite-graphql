import { UseMutationOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { CreateAnonymousSessionMutation } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createAnonymousSession = gql(/* GraphQL */ `
  mutation CreateAnonymousSession {
    accountCreateAnonymousSession {
      _id
      expire
      current
    }
  }
`)

export function useCreateAnonymousSession({
  options,
}: {
  options?: UseMutationOptions<
    CreateAnonymousSessionMutation['accountCreateAnonymousSession'],
    AppwriteException,
    void,
    string[]
  >
}) {
  const { graphql } = useAppwrite()

  const queryResult = useMutation({
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: createAnonymousSession,
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateAnonymousSession
    },
    ...options,
  })

  return { ...queryResult }
}
