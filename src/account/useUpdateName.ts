import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
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

/** The variables accepted by the {@link useUpdateName} mutation. */
export type UpdateNameVariables = Prettify<VariablesOf<typeof accountUpdateName>>
/** The result returned by the {@link useUpdateName} mutation. */
export type UpdateNameResult = Prettify<ResultOf<typeof accountUpdateName>['accountUpdateName']>

/**
 * Mutation hook to update the current user's display name.
 *
 * Invalidates account queries on success so that components reading
 * the account will reflect the new name.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateName()
 *
 * mutate({ name: 'Jane Doe' })
 * ```
 *
 * **Variables** ({@link UpdateNameVariables}):
 * - `name` — The new display name for the user
 *
 * @returns A `UseMutationResult` with the updated `name` field.
 */
export function useUpdateName() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<UpdateNameResult, AppwriteException[], UpdateNameVariables>({
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

  return queryResult
}
