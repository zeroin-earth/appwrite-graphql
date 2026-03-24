import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const createAnonymousSession = gql(/* GraphQL */ `
  mutation CreateAnonymousSession {
    accountCreateAnonymousSession {
      _id
      expire
      current
    }
  }
`)

/** The result returned by the {@link useCreateAnonymousSession} mutation. */
export type CreateAnonymousSessionResult = Prettify<
  ResultOf<typeof createAnonymousSession>['accountCreateAnonymousSession']
>

/**
 * Mutation to create an anonymous session.
 *
 * Invalidates account queries and the anonymous session cache key on success.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateAnonymousSession()
 *
 * mutate()
 * ```
 *
 * This mutation takes no variables.
 *
 * @returns A `UseMutationResult` with the created session's `_id`, `expire`, and `current` fields.
 */
export function useCreateAnonymousSession() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<CreateAnonymousSessionResult, AppwriteException[], void>({
    mutationKey: Keys.account().anonymous().create(),
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: createAnonymousSession,
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateAnonymousSession
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
      void queryClient.invalidateQueries({
        queryKey: Keys.account().anonymous().create(),
      })
    },
  })

  return queryResult
}
