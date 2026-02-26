import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { UpdatePasswordMutation, UpdatePasswordMutationVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updatePassword = gql(/* GraphQL */ `
  mutation UpdatePassword($password: String!, $oldPassword: String!) {
    accountUpdatePassword(password: $password, oldPassword: $oldPassword) {
      status
    }
  }
`)

export function useUpdatePassword() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    UpdatePasswordMutation['accountUpdatePassword'],
    AppwriteException[],
    UpdatePasswordMutationVariables
  >({
    mutationFn: async ({ password, oldPassword }) => {
      const { data, errors } = await graphql.mutation({
        query: updatePassword,
        variables: {
          password,
          oldPassword,
        },
      })

      if (errors) {
        throw errors
      }

      return data?.accountUpdatePassword
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
    },
  })

  return { ...queryResult }
}
