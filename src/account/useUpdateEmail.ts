import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const accountUpdateEmail = gql(/* GraphQL */ `
  mutation UpdateEmail($email: String!, $password: String!) {
    accountUpdateEmail(email: $email, password: $password) {
      name
      email
    }
  }
`)

/** The variables accepted by the {@link useUpdateEmail} mutation. */
export type UpdateEmailVariables = Prettify<VariablesOf<typeof accountUpdateEmail>>
/** The result returned by the {@link useUpdateEmail} mutation. */
export type UpdateEmailResult = Prettify<ResultOf<typeof accountUpdateEmail>['accountUpdateEmail']>

/**
 * Mutation hook to update the current user's email address.
 *
 * Requires the new email and the current password for verification.
 * Invalidates account queries on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateEmail()
 *
 * mutate({
 *   email: 'new-email@example.com',
 *   password: 'current-password',
 * })
 * ```
 *
 * **Variables** ({@link UpdateEmailVariables}):
 * - `email` — The new email address
 * - `password` — The user's current password for verification
 *
 * @returns A `UseMutationResult` with the updated `name` and `email` fields.
 */
export function useUpdateEmail() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<UpdateEmailResult, AppwriteException[], UpdateEmailVariables>({
    mutationKey: Keys.account().email().update(),
    mutationFn: async ({ email, password }) => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdateEmail,
        variables: {
          email,
          password,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateEmail
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
    },
  })

  return queryResult
}
