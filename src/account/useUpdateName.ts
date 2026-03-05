import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const accountUpdateName = gql(/* GraphQL */ `
  mutation UpdateName($name: String!) {
    accountUpdateName(name: $name) {
      name
    }
  }
`)

type Variables = VariablesOf<typeof accountUpdateName>
type Result = ResultOf<typeof accountUpdateName>['accountUpdateName']

export function useUpdateName() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().name().update(),
    mutationFn: async ({ name }) => {
      const { data: mutationData, errors } = await graphql.mutation({
        query: accountUpdateName,
        variables: {
          name,
        },
      })

      if (errors) {
        throw errors
      }

      return mutationData.accountUpdateName
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
    },
  })

  return { ...queryResult }
}
