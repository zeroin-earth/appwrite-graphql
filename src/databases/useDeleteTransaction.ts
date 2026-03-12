import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const deleteTransaction = gql(/* GraphQL */ `
  mutation DeleteTransaction($transactionId: String!) {
    databasesDeleteTransaction(transactionId: $transactionId) {
      status
    }
  }
`)

type Variables = VariablesOf<typeof deleteTransaction>
type Result = ResultOf<typeof deleteTransaction>['databasesDeleteTransaction']

export function useDeleteTransaction() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.databases().transactions().delete(),
    mutationFn: async ({ transactionId }) => {
      const { data, errors } = await graphql.mutation({
        query: deleteTransaction,
        variables: { transactionId },
      })

      if (errors) {
        throw errors
      }

      return data?.databasesDeleteTransaction ?? { status: '' }
    },
    onSuccess: (_, variables) => {
      queryClient.removeQueries({
        queryKey: Keys.databases().transaction(variables.transactionId).key(),
      })
      void queryClient.invalidateQueries({
        queryKey: Keys.databases().transactions().key(),
      })
    },
  })

  return { ...mutationResult }
}
