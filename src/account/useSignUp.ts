import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { ID } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

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

type CreateVariables = VariablesOf<typeof createAccount>
type CreateResult = ResultOf<typeof createAccount>['accountCreate']

type VerifyProps = {
  verifyUrl: string
}
type VerifyResult = ResultOf<typeof verify>['accountCreateVerification']

export function useSignUp() {
  const { graphql } = useAppwrite()

  const signUp = useMutation<CreateResult, AppwriteException[], CreateVariables>({
    mutationKey: Keys.account().signUp().create(),
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

  const verifyEmail = useMutation<VerifyResult, AppwriteException[], VerifyProps>({
    mutationKey: Keys.account().emailVerification().create(),
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
