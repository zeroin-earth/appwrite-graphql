import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountDeletePushTarget = gql(/* GraphQL */ `
  mutation DeletePushTarget($targetId: String!) {
    accountDeletePushTarget(targetId: $targetId) {
      status
    }
  }
`)

type Variables = VariablesOf<typeof accountDeletePushTarget>
type Result = ResultOf<typeof accountDeletePushTarget>['accountDeletePushTarget']

export function useDeletePushTarget() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().pushTarget().delete(),
    mutationFn: async ({ targetId }) => {
      const { data, errors } = await graphql.mutation({
        query: accountDeletePushTarget,
        variables: {
          targetId,
        },
      })

      if (errors) {
        throw errors
      }

      return data?.accountDeletePushTarget ?? { status: '' }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
    },
  })

  return { ...queryResult }
}
