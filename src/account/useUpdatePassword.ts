import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
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

type Variables = VariablesOf<typeof updatePassword>
type Result = ResultOf<typeof updatePassword>['accountUpdatePassword']

export function useUpdatePassword() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().password().update(),
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
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
    },
  })

  return { ...queryResult }
}
