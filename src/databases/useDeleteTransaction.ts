import { gql } from '../__generated__'
import type {
  DeleteTransactionMutation,
  DeleteTransactionMutationVariables,
} from '../__generated__/graphql'
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

export function useDeleteTransaction() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    DeleteTransactionMutation['databasesDeleteTransaction'],
    AppwriteException[],
    DeleteTransactionMutationVariables
  >({
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
        queryKey: ['appwrite', 'databases', 'transactions', variables.transactionId],
      })
      void queryClient.invalidateQueries({
        queryKey: ['appwrite', 'databases', 'transactions'],
      })
    },
  })

  return { ...mutationResult }
}
