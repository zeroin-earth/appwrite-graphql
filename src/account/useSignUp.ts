import { AppwriteException, ID } from '../types'

import { gql } from '../__generated__'
import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
  VerifyEmailMutation,
} from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

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

  const signUp = useMutation<
    CreateAccountMutation['accountCreate'],
    AppwriteException[],
    CreateAccountMutationVariables
  >({
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

      return data.accountCreate
    },
  })

  const verifyEmail = useMutation<
    VerifyEmailMutation['accountCreateVerification'],
    Error,
    VerifyProps
  >({
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

      return data.accountCreateVerification
    },
  })

  return { signUp, verifyEmail }
}
