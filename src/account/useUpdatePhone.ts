import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const accountUpdatePhone = gql(/* GraphQL */ `
  mutation UpdatePhone($phone: String!, $password: String!) {
    accountUpdatePhone(phone: $phone, password: $password) {
      phone
    }
  }
`)

type Variables = VariablesOf<typeof accountUpdatePhone>
type Result = ResultOf<typeof accountUpdatePhone>['accountUpdatePhone']

export function useUpdatePhone() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().phone().update(),
    mutationFn: async ({ phone, password }) => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdatePhone,
        variables: {
          phone,
          password,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdatePhone
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
    },
  })

  return { ...queryResult }
}
