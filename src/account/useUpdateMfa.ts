import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { UpdateMfaMutation, UpdateMfaMutationVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountUpdateMFA = gql(/* GraphQL */ `
  mutation UpdateMFA($mfa: Boolean!) {
    accountUpdateMFA(mfa: $mfa) {
      mfa
    }
  }
`)

export function useUpdateMfa() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    UpdateMfaMutation['accountUpdateMFA'],
    AppwriteException[],
    UpdateMfaMutationVariables
  >({
    mutationFn: async ({ mfa }) => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdateMFA,
        variables: {
          mfa,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateMFA
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'account', 'mfa'] })
    },
  })

  return { ...queryResult }
}
