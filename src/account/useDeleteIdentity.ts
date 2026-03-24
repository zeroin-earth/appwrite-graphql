import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
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

/** The variables accepted by the {@link useDeleteIdentity} mutation. */
export type DeleteIdentityVariables = Prettify<VariablesOf<typeof accountDeleteIdentity>>
/** The result returned by the {@link useDeleteIdentity} mutation. */
export type DeleteIdentityResult = Prettify<
  ResultOf<typeof accountDeleteIdentity>['accountDeleteIdentity']
>

/**
 * Mutation hook to delete an identity by its ID.
 *
 * Removes an OAuth2 or other external identity linked to the current user's
 * account. Invalidates account queries on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteIdentity()
 *
 * mutate({ identityId: 'identity-123' })
 * ```
 *
 * **Variables** ({@link DeleteIdentityVariables}):
 * - `identityId` — The ID of the identity to delete
 *
 * @returns A `UseMutationResult` with a `status` string indicating the operation result.
 */
export function useDeleteIdentity() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    DeleteIdentityResult,
    AppwriteException[],
    DeleteIdentityVariables
  >({
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

  return queryResult
}
