import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { UpdateEmailMutation, UpdateEmailMutationVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountUpdateEmail = gql(/* GraphQL */ `
  mutation UpdateEmail($email: String!, $password: String!) {
    accountUpdateEmail(email: $email, password: $password) {
      name
      email
    }
  }
`)

export function useUpdateEmail() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    UpdateEmailMutation['accountUpdateEmail'],
    AppwriteException[],
    UpdateEmailMutationVariables
  >({
    mutationFn: async ({ email, password }) => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdateEmail,
        variables: {
          email,
          password,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateEmail
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
    },
  })

  return { ...queryResult }
}
