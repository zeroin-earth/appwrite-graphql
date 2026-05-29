import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'
import { useSuspenseQuery } from '../useSuspenseQuery'

//The documentation says there should be a duration parameter, but including one causes a server error.
const accountCreateJWT = gql(/* GraphQL */ `
  mutation CreateJWT {
    accountCreateJWT {
      jwt
    }
  }
`)

/** The result returned by the {@link useCreateJWT} mutation. */
export type CreateJWTResult = Prettify<ResultOf<typeof accountCreateJWT>['accountCreateJWT']>

/**
 * Mutation to create a JSON Web Token for the current session.
 *
 * On success, the JWT is automatically set on the GraphQL client via
 * `graphql.client.setJWT()` and cached in the query store. The token
 * is garbage-collected after `gcTime` milliseconds (default: 10 minutes).
 *
 * @example
 * ```tsx
 * const { mutate, data, isPending } = useCreateJWT()
 *
 * // Create a JWT with default 10-minute gc time
 * mutate()
 *
 * // Access the token
 * console.log(data?.jwt)
 * ```
 *
 * @example
 * ```tsx
 * // Custom gc time (30 minutes)
 * const { mutate } = useCreateJWT({ gcTime: 1800000 })
 * ```
 *
 * This mutation takes no variables.
 *
 * @param opts - Optional config. `gcTime` controls garbage collection time (default: 10 minutes).
 * @returns A `UseMutationResult` with the created `jwt` string.
 */
export function useCreateJWT({ gcTime = 600000 }: { gcTime?: number } = {}) {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<CreateJWTResult, AppwriteException[], void>({
    gcTime,
    mutationKey: Keys.account().jwt().create(),
    mutationFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: accountCreateJWT,
      })

      if (errors) {
        throw errors
      }

      return data!.accountCreateJWT
    },
    onSuccess: (data) => {
      graphql.client.setJWT(data?.jwt ?? '')
      queryClient.setQueryData(Keys.account().jwt().create(), data?.jwt ?? '', {
        updatedAt: Date.now(),
      })
    },
  })

  return queryResult
}

/**
 * Suspense variant of {@link useCreateJWT}.
 *
 * Suspends the component while creating the JWT. Sets the JWT on the
 * GraphQL client automatically on success. Ideal for use with React
 * `<Suspense>` boundaries.
 *
 * @example
 * ```tsx
 * // Wrap in a <Suspense> boundary
 * const { data } = useSuspenseCreateJWT()
 *
 * // JWT is guaranteed to be available after suspension resolves
 * console.log(data.jwt)
 * ```
 *
 * This query takes no variables.
 *
 * @param opts - Optional config. `gcTime` controls garbage collection time (default: 10 minutes).
 * @returns A `UseSuspenseQueryResult` with the created `jwt` string.
 */
export function useSuspenseCreateJWT({ gcTime = 600000 }: { gcTime?: number } = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useSuspenseQuery<CreateJWTResult, AppwriteException[], CreateJWTResult>({
    gcTime,
    queryKey: Keys.account().jwt().create(),
    queryFn: async () => {
      const { data, errors } = await graphql.mutation({
        query: accountCreateJWT,
      })

      if (errors) {
        throw errors
      }

      graphql.client.setJWT(data!.accountCreateJWT?.jwt ?? '')
      return data!.accountCreateJWT
    },
  })

  return queryResult
}
