import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountCreatePushTarget = gql(/* GraphQL */ `
  mutation CreatePushTarget($targetId: String!, $identifier: String!, $providerId: String) {
    accountCreatePushTarget(targetId: $targetId, identifier: $identifier, providerId: $providerId) {
      _id
      userId
      providerType
      identifier
    }
  }
`)

type Variables = VariablesOf<typeof accountCreatePushTarget>
type Result = ResultOf<typeof accountCreatePushTarget>['accountCreatePushTarget']

export function useCreatePushTarget() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().pushTarget().create(),
    mutationFn: async ({ targetId, identifier, providerId }) => {
      const { data, errors } = await graphql.mutation({
        query: accountCreatePushTarget,
        variables: {
          targetId,
          identifier,
          providerId,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreatePushTarget
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
    },
  })

  return { ...queryResult }
}
