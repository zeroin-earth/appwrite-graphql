import { gql } from '../__generated__'
import type {
  CreateTransactionMutation,
  CreateTransactionMutationVariables,
} from '../__generated__/graphql'
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

export function useCreateTransaction() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const mutationResult = useMutation<
    CreateTransactionMutation['databasesCreateTransaction'],
    AppwriteException[],
    CreateTransactionMutationVariables
  >({
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
        queryKey: ['appwrite', 'databases', 'transactions'],
      })
    },
  })

  return { ...mutationResult }
}
