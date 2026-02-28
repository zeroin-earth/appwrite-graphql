import { gql } from '../__generated__'
import type { UpdatePhoneMutation, UpdatePhoneMutationVariables } from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountUpdatePhone = gql(/* GraphQL */ `
  mutation UpdatePhone($phone: String!, $password: String!) {
    accountUpdatePhone(phone: $phone, password: $password) {
      phone
    }
  }
`)

export function useUpdatePhone() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    UpdatePhoneMutation['accountUpdatePhone'],
    AppwriteException[],
    UpdatePhoneMutationVariables
  >({
    mutationFn: async ({ phone, password }) => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdatePhone,
        variables: {
          phone,
          password,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdatePhone
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
    },
  })

  return { ...queryResult }
}
