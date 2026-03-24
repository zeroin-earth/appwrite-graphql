import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const updatePassword = gql(/* GraphQL */ `
  mutation UpdatePassword($password: String!, $oldPassword: String!) {
    accountUpdatePassword(password: $password, oldPassword: $oldPassword) {
      status
    }
  }
`)

/** The variables accepted by the {@link useUpdatePassword} mutation. */
export type UpdatePasswordVariables = Prettify<VariablesOf<typeof updatePassword>>
/** The result returned by the {@link useUpdatePassword} mutation. */
export type UpdatePasswordResult = Prettify<
  ResultOf<typeof updatePassword>['accountUpdatePassword']
>

/**
 * Mutation hook to update the current user's password.
 *
 * Requires the new password and the current (old) password for verification.
 * Invalidates account queries on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdatePassword()
 *
 * mutate({
 *   password: 'new-secure-password',
 *   oldPassword: 'current-password',
 * })
 * ```
 *
 * **Variables** ({@link UpdatePasswordVariables}):
 * - `password` — The new password
 * - `oldPassword` — The current password for verification
 *
 * @returns A `UseMutationResult` with a `status` string indicating the operation result.
 */
export function useUpdatePassword() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<
    UpdatePasswordResult,
    AppwriteException[],
    UpdatePasswordVariables
  >({
    mutationKey: Keys.account().password().update(),
    mutationFn: async ({ password, oldPassword }) => {
      const { data, errors } = await graphql.mutation({
        query: updatePassword,
        variables: {
          password,
          oldPassword,
        },
      })

      if (errors) {
        throw errors
      }

      return data?.accountUpdatePassword
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
    },
  })

  return queryResult
}
