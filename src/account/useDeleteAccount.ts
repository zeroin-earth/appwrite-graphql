import { gql } from '../__generated__'
import type { DeleteAccountMutation } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountDelete = gql(/* GraphQL */ `
  mutation DeleteAccount {
    accountDelete {
      status
    }
  }
`)

export function useDeleteAccount() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    DeleteAccountMutation['accountDelete'],
    AppwriteException[],
    void
  >({
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: accountDelete,
      })

      if (errors) {
        throw errors
      }

      return data?.accountDelete ?? { status: '' }
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })

  return { ...queryResult }
}
