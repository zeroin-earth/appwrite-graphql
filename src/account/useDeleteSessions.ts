import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const deleteSessions = gql(/* GraphQL */ `
  mutation DeleteSessions {
    accountDeleteSessions {
      status
    }
  }
`)

type Result = ResultOf<typeof deleteSessions>['accountDeleteSessions']

export function useDeleteSessions() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], void>({
    mutationKey: Keys.account().session().delete(),
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: deleteSessions,
      })

      if (errors) {
        throw errors
      }

      return data?.accountDeleteSessions ?? { status: '' }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
      void queryClient.invalidateQueries({ queryKey: Keys.account().sessions() })
    },
  })

  return { ...queryResult }
}
