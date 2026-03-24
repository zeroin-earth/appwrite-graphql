import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const createEmailVerification = gql(/* GraphQL */ `
  mutation CreateEmailVerification($url: String!) {
    accountCreateEmailVerification(url: $url) {
      _id
      userId
      secret
      expire
    }
  }
`)

/** The variables accepted by the {@link useCreateEmailVerification} mutation. */
export type CreateEmailVerificationVariables = Prettify<VariablesOf<typeof createEmailVerification>>
/** The result returned by the {@link useCreateEmailVerification} mutation. */
export type CreateEmailVerificationResult = Prettify<
  ResultOf<typeof createEmailVerification>['accountCreateEmailVerification']
>

/**
 * Mutation to send an email verification link to the current user.
 *
 * The verification link redirects the user to the provided URL with `userId`
 * and `secret` query parameters that can be used with {@link useUpdateEmailVerification}
 * to complete the verification.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateEmailVerification()
 *
 * mutate({
 *   url: 'https://example.com/verify-email',
 * })
 * ```
 *
 * **Variables** ({@link CreateEmailVerificationVariables}):
 * - `url` — The URL to redirect the user to after clicking the verification link
 *
 * @returns A `UseMutationResult` with the verification token's `_id`, `userId`, `secret`, and `expire` fields.
 */
export function useCreateEmailVerification() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    CreateEmailVerificationResult,
    AppwriteException[],
    CreateEmailVerificationVariables
  >({
    mutationKey: Keys.account().emailVerification().create(),
    mutationFn: async ({ url }) => {
      const { data, errors } = await graphql.mutation({
        query: createEmailVerification,
        variables: { url },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateEmailVerification
    },
  })

  return queryResult
}
