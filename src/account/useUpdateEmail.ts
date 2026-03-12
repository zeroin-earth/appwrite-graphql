import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const accountUpdateEmail = gql(/* GraphQL */ `
  mutation UpdateEmail($email: String!, $password: String!) {
    accountUpdateEmail(email: $email, password: $password) {
      name
      email
    }
  }
`)

type Variables = VariablesOf<typeof accountUpdateEmail>
type Result = ResultOf<typeof accountUpdateEmail>['accountUpdateEmail']

export function useUpdateEmail() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().email().update(),
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
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
    },
  })

  return { ...queryResult }
}
