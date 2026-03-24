import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

export const accountUpdatePhone = gql(/* GraphQL */ `
  mutation UpdatePhone($phone: String!, $password: String!) {
    accountUpdatePhone(phone: $phone, password: $password) {
      phone
    }
  }
`)

/** The variables accepted by the {@link useUpdatePhone} mutation. */
export type UpdatePhoneVariables = Prettify<VariablesOf<typeof accountUpdatePhone>>
/** The result returned by the {@link useUpdatePhone} mutation. */
export type UpdatePhoneResult = Prettify<ResultOf<typeof accountUpdatePhone>['accountUpdatePhone']>

/**
 * Mutation hook to update the current user's phone number.
 *
 * Requires the new phone number and the current password for verification.
 * Invalidates account queries on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdatePhone()
 *
 * mutate({
 *   phone: '+14155551234',
 *   password: 'current-password',
 * })
 * ```
 *
 * **Variables** ({@link UpdatePhoneVariables}):
 * - `phone` — The new phone number in E.164 format (e.g., `"+14155551234"`)
 * - `password` — The user's current password for verification
 *
 * @returns A `UseMutationResult` with the updated `phone` field.
 */
export function useUpdatePhone() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<UpdatePhoneResult, AppwriteException[], UpdatePhoneVariables>({
    mutationKey: Keys.account().phone().update(),
    mutationFn: async ({ phone, password }) => {
      const { data, errors } = await graphql.mutation({
        query: accountUpdatePhone,
        variables: {
          phone,
          password,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdatePhone
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
    },
  })

  return queryResult
}
