import { gql } from '../__generated__'
import type { CreateAnonymousSessionMutation } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

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
  const queryClient = useQueryClient()

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
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
      void queryClient.invalidateQueries({ queryKey: ['appwrite', 'account', 'sessions'] })
    },
  })

  return { ...queryResult }
}
