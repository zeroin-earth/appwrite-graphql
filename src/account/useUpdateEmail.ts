import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { UpdateEmailMutation, UpdateEmailMutationVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

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
  })

  return { ...queryResult }
}
