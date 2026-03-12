import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const createTransaction = gql(/* GraphQL */ `
  mutation CreateTransaction($ttl: Int) {
    databasesCreateTransaction(ttl: $ttl) {
      _id
      status
      operations
      expiresAt
    }
  }
`)

type Variables = VariablesOf<typeof createTransaction>
type Result = ResultOf<typeof createTransaction>['databasesCreateTransaction']

export function useCreateTransaction() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.databases().transactions().create(),
    mutationFn: async ({ ttl } = {}) => {
      const { data, errors } = await graphql.mutation({
        query: createTransaction,
        variables: { ttl },
      })

      if (errors) {
        throw errors
      }

      return data.databasesCreateTransaction
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: Keys.databases().transactions().key(),
      })
    },
  })

  return { ...mutationResult }
}
