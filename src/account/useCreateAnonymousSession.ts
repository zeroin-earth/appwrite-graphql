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

export function useCreateAnonymousSession() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    CreateAnonymousSessionMutation['accountCreateAnonymousSession'],
    AppwriteException[]
  >({
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: createAnonymousSession,
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateAnonymousSession
    },
  })

  return { ...queryResult }
}
