import { ID } from 'appwrite'

import { gql } from '../__generated__'
import { Token, User } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

type SignUpProps = {
  userId?: string
  name?: string
  email: string
  password: string
}

type VerifyProps = {
  verifyUrl: string
}

const createAccount = gql(/* GraphQL */ `
  mutation CreateAccount($userId: String!, $name: String, $email: String!, $password: String!) {
    accountCreate(userId: $userId, name: $name, email: $email, password: $password) {
      name
      email
    }
  }
`)

const verify = gql(/* GraphQL */ `
  mutation VerifyEmail($url: String!) {
    accountCreateVerification(url: $url) {
      expire
    }
  }
`)

export function useSignUp() {
  const { graphql } = useAppwrite()

  const signUp = useMutation<User, Error, SignUpProps, unknown>({
    mutationFn: async ({ userId, email, password, name }) => {
      const { data, errors } = await graphql.mutation({
        query: createAccount,
        variables: {
          userId: userId ?? ID.unique(),
          name,
          email,
          password,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreate ?? ({} as User)
    },
  })

  const verifyEmail = useMutation<Token, Error, VerifyProps, unknown>({
    mutationFn: async ({ verifyUrl }) => {
      const { data, errors } = await graphql.mutation({
        query: verify,
        variables: {
          url: verifyUrl,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateVerification ?? ({} as Token)
    },
  })

  return { signUp, verifyEmail }
}
