import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountUpdateStatus = gql(/* GraphQL */ `
  mutation UpdateStatus {
    accountUpdateStatus {
      _id
      status
    }
  }
`)

type Result = ResultOf<typeof accountUpdateStatus>['accountUpdateStatus']

export function useUpdateStatus() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], void>({
    mutationKey: Keys.account().status().update(),
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdateStatus,
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateStatus
    },
    onSuccess: async () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
    },
  })

  return { ...queryResult }
}
