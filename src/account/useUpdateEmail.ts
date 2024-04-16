import { gql } from '../__generated__'
import { User } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

type UpdateEmailProps = {
  email: string
  password: string
}

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

  const updateEmail = useMutation<User, Error, UpdateEmailProps, unknown>({
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

      return data.accountUpdateEmail ?? ({} as User)
    },
  })

  return { updateEmail }
}
