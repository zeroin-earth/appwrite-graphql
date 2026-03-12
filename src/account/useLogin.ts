import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, OAuthProvider } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

type OAuthLoginProps = {
  provider: OAuthProvider
  success?: string
  failure?: string
}

const accountCreateEmailPasswordSession = gql(/* GraphQL */ `
  mutation CreateEmailPasswordSession($email: String!, $password: String!) {
    accountCreateEmailPasswordSession(email: $email, password: $password) {
      userId
      expire
      current
    }
  }
`)

type Variables = VariablesOf<typeof accountCreateEmailPasswordSession>
type Result = ResultOf<
  typeof accountCreateEmailPasswordSession
>['accountCreateEmailPasswordSession']

export function useLogin() {
  const { account, graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const login = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().login().create(),
    mutationFn: async ({ email, password }) => {
      const { data, errors } = await graphql.mutation({
        query: accountCreateEmailPasswordSession,
        variables: {
          email,
          password,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateEmailPasswordSession
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
      void queryClient.invalidateQueries({ queryKey: Keys.account().sessions() })
    },
  })

  const oAuthLogin = useMutation<void | string, AppwriteException[], OAuthLoginProps>({
    mutationFn: async ({ provider, success, failure }) => {
      return account.createOAuth2Session({ provider, success, failure })
    },
  })

  return {
    login,
    oAuthLogin,
  }
}
