import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const accountUpdateStatus = gql(/* GraphQL */ `
  mutation UpdateStatus {
    accountUpdateStatus {
      _id
      status
    }
  }
`)

/** The result returned by the {@link useUpdateStatus} mutation. */
export type UpdateStatusResult = Prettify<
  ResultOf<typeof accountUpdateStatus>['accountUpdateStatus']
>

/**
 * Mutation hook to update the current user's account status (e.g., disable account).
 *
 * Blocks the user account by setting the status to disabled. Invalidates
 * account queries on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateStatus()
 *
 * mutate()
 * ```
 *
 * This mutation takes no variables.
 *
 * @returns A `UseMutationResult` with the user's `_id` and updated `status`.
 */
export function useUpdateStatus() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<UpdateStatusResult, AppwriteException[], void>({
    mutationKey: Keys.account().status().update(),
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdateStatus,
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateStatus
    },
    onSuccess: async () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
    },
  })

  return queryResult
}
