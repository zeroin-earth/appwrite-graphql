import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountUpdatePushTarget = gql(/* GraphQL */ `
  mutation UpdatePushTarget($targetId: String!, $identifier: String!) {
    accountUpdatePushTarget(targetId: $targetId, identifier: $identifier) {
      _id
      userId
      providerType
      identifier
    }
  }
`)

type Variables = VariablesOf<typeof accountUpdatePushTarget>
type Result = ResultOf<typeof accountUpdatePushTarget>['accountUpdatePushTarget']

export function useUpdatePushTarget() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().pushTarget().update(),
    mutationFn: async ({ targetId, identifier }) => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdatePushTarget,
        variables: {
          targetId,
          identifier,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdatePushTarget
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
    },
  })

  return { ...queryResult }
}
