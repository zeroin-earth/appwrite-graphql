import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateTransaction = gql(/* GraphQL */ `
  mutation UpdateTransaction($transactionId: String!, $commit: Boolean, $rollback: Boolean) {
    databasesUpdateTransaction(
      transactionId: $transactionId
      commit: $commit
      rollback: $rollback
    ) {
      _id
      status
      operations
    }
  }
`)

type Variables = VariablesOf<typeof updateTransaction>
type Result = ResultOf<typeof updateTransaction>['databasesUpdateTransaction']

export function useUpdateTransaction() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.databases().transactions().update(),
    mutationFn: async ({ transactionId, commit, rollback }) => {
      const { data, errors } = await graphql.mutation({
        query: updateTransaction,
        variables: { transactionId, commit, rollback },
      })

      if (errors) {
        throw errors
      }

      return data.databasesUpdateTransaction
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: Keys.databases().transaction(variables.transactionId).key(),
      })
      void queryClient.invalidateQueries({
        queryKey: Keys.databases().transactions().key(),
      })
    },
  })

  return { ...mutationResult }
}
