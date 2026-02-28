import { gql } from '../__generated__'
import type {
  UpdateTransactionMutation,
  UpdateTransactionMutationVariables,
} from '../__generated__/graphql'
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

export function useUpdateTransaction() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    UpdateTransactionMutation['databasesUpdateTransaction'],
    AppwriteException[],
    UpdateTransactionMutationVariables
  >({
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
        queryKey: ['appwrite', 'databases', 'transactions', variables.transactionId],
      })
      void queryClient.invalidateQueries({
        queryKey: ['appwrite', 'databases', 'transactions'],
      })
    },
  })

  return { ...mutationResult }
}
