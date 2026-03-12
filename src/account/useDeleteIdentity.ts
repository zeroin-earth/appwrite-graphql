import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountDeleteIdentity = gql(/* GraphQL */ `
  mutation DeleteIdentity($identityId: String!) {
    accountDeleteIdentity(identityId: $identityId) {
      status
    }
  }
`)

type Variables = VariablesOf<typeof accountDeleteIdentity>
type Result = ResultOf<typeof accountDeleteIdentity>['accountDeleteIdentity']

export function useDeleteIdentity() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().identity().delete(),
    mutationFn: async ({ identityId }) => {
      const { data, errors } = await graphql.mutation({
        query: accountDeleteIdentity,
        variables: {
          identityId,
        },
      })

      if (errors) {
        throw errors
      }

      return data?.accountDeleteIdentity ?? { status: '' }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
    },
  })

  return { ...queryResult }
}
