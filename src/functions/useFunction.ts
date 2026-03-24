import { useState } from 'react'
import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQuery } from '../useQuery'
import { useSuspenseQuery } from '../useSuspenseQuery'

type Props = {
  functionId: string
  body?: Record<string, string | number | boolean | null>
  async?: boolean
  path?: string
  method?: string
  headers?: Record<string, string | number | boolean | null>
  scheduledAt?: string
}

const createExecution = gql(/* GraphQL */ `
  mutation CreateExecution(
    $functionId: String!
    $body: String
    $async: Boolean
    $path: String
    $method: String
    $headers: String
    $scheduledAt: String
  ) {
    functionsCreateExecution(
      functionId: $functionId
      body: $body
      async: $async
      path: $path
      method: $method
      headers: $headers
      scheduledAt: $scheduledAt
    ) {
      _id
      status
      responseStatusCode
      responseBody
      errors
      duration
    }
  }
`)

const getFunctionExecution = gql(/* GraphQL */ `
  query GetFunctionExecution($functionId: String!, $executionId: String!) {
    functionsGetExecution(functionId: $functionId, executionId: $executionId) {
      status
      errors
      duration
      responseBody
      requestPath
    }
  }
`)

/** The result of polling the current execution in the {@link useFunction} hook. */
export type FunctionResult = Prettify<
  ResultOf<typeof getFunctionExecution>['functionsGetExecution']
>

type ResponseBody = string | null | undefined | Record<string, string | number | boolean | null>

function useCurrentExecution({
  currentExecution,
  currentFunction,
}: {
  currentExecution: string | null
  currentFunction: string | null
}) {
  const { graphql } = useAppwrite()
  const enabled = !!currentFunction && !!currentExecution

  const query = useQuery<FunctionResult | null, AppwriteException[], FunctionResult | null>({
    queryKey: enabled
      ? Keys.function(currentFunction).execution(currentExecution).key()
      : Keys.functions().key(),
    queryFn: async () => {
      if (!currentExecution || !currentFunction) {
        return null
      }
      const { data } = await graphql.query({
        query: getFunctionExecution,
        variables: {
          functionId: currentFunction,
          executionId: currentExecution,
        },
      })

      if (!data?.functionsGetExecution) {
        throw new Error('Execution not found')
      }

      return data.functionsGetExecution ?? null
    },
    enabled,
  })

  return { ...query }
}

/**
 * Returns `{ executeFunction, currentExecution }` for triggering Appwrite function executions.
 *
 * **`executeFunction`** is a mutation that sends the `CreateExecution` GraphQL mutation.
 * It serialises `body` and `headers` to JSON strings before sending, and automatically
 * parses JSON response bodies back into objects. If the execution status is `"failed"`,
 * the mutation throws with the error details.
 *
 * **`currentExecution`** is a query that polls the latest execution's status via the
 * `GetFunctionExecution` GraphQL query. It is enabled automatically once an execution
 * has been triggered and exposes standard `useQuery` fields (`data`, `isLoading`, etc.).
 *
 * @example
 * ```tsx
 * const { executeFunction, currentExecution } = useFunction()
 *
 * // Trigger a function execution
 * executeFunction.mutate({
 *   functionId: 'send-welcome-email',
 *   body: { userId: 'user_123' },
 *   method: 'POST',
 *   path: '/send',
 * })
 *
 * // Poll the result
 * if (currentExecution.data) {
 *   console.log(currentExecution.data.status)
 *   console.log(currentExecution.data.responseBody)
 * }
 * ```
 *
 * **Variables** (`Props`):
 * - `functionId` — The ID of the Appwrite function to execute
 * - `body` — Optional. A key-value object sent as the request body (serialised to JSON)
 * - `async` — Optional. When `true`, the function runs asynchronously (defaults to `false`)
 * - `path` — Optional. The execution path (defaults to `'/'`)
 * - `method` — Optional. The HTTP method (defaults to `'POST'`)
 * - `headers` — Optional. A key-value object of custom headers (serialised to JSON)
 * - `scheduledAt` — Optional. An ISO 8601 date string to schedule the execution
 *
 * @returns An object with `executeFunction` (a `UseMutationResult` whose `data` is the
 * parsed response body or raw string) and `currentExecution` (a `UseQueryResult` whose
 * `data` is the {@link FunctionResult} with `status`, `errors`, `duration`, `responseBody`,
 * and `requestPath`).
 */
export function useFunction() {
  const { graphql } = useAppwrite()
  const [currentExecution, setCurrentExecution] = useState<string | null>(null)
  const [currentFunction, setCurrentFunction] = useState<string | null>(null)
  const getExecution = useCurrentExecution({
    currentExecution,
    currentFunction,
  })

  const executeFunction = useMutation<ResponseBody, AppwriteException[], Props>({
    mutationKey: Keys.functions().executions().create(),
    mutationFn: async ({
      functionId,
      body = {},
      async = false,
      path = '/',
      method = 'POST',
      headers = {},
      scheduledAt,
    }) => {
      setCurrentFunction(functionId)

      const { data } = await graphql.mutation({
        query: createExecution,
        variables: {
          functionId,
          body: JSON.stringify(body),
          async,
          path,
          method,
          headers: JSON.stringify(headers),
          scheduledAt,
        },
      })

      const { _id, status, errors, responseBody } = data.functionsCreateExecution ?? {}

      if (status === 'failed') {
        throw new Error(errors)
      }

      setCurrentExecution(_id ?? null)

      if (typeof responseBody === 'string') {
        if (responseBody.trim().startsWith('{') && responseBody.trim().endsWith('}')) {
          try {
            return JSON.parse(responseBody)
          } catch (error) {
            console.error('Failed to parse response body:', error)
            return responseBody
          }
        }
        return responseBody
      }
    },
  })

  return {
    executeFunction,
    currentExecution: getExecution,
  }
}

/**
 * Suspense variant that executes an Appwrite function and suspends until the result is available.
 *
 * Uses `useSuspenseQuery` under the hood so the component tree suspends while the function
 * executes. The query is cached with `staleTime: Infinity` so re-renders do not re-trigger
 * the execution. JSON response bodies are automatically parsed into objects.
 *
 * @example
 * ```tsx
 * function WelcomeMessage() {
 *   const { executeFunction } = useSuspenseFunction({
 *     functionId: 'get-greeting',
 *     body: { locale: 'en' },
 *     path: '/greet',
 *     method: 'GET',
 *   })
 *
 *   return <p>{executeFunction.data}</p>
 * }
 * ```
 *
 * **Variables** (`Props`):
 * - `functionId` — The ID of the Appwrite function to execute
 * - `body` — Optional. A key-value object sent as the request body (serialised to JSON)
 * - `async` — Optional. When `true`, the function runs asynchronously (defaults to `false`)
 * - `path` — Optional. The execution path (defaults to `'/'`)
 * - `method` — Optional. The HTTP method (defaults to `'POST'`)
 * - `headers` — Optional. A key-value object of custom headers (serialised to JSON)
 * - `scheduledAt` — Optional. An ISO 8601 date string to schedule the execution
 *
 * @returns An object with `executeFunction` (a `UseSuspenseQueryResult` whose `data` is
 * the parsed response body or raw string).
 */
export function useSuspenseFunction({
  functionId,
  body = {},
  async = false,
  path = '/',
  method = 'POST',
  headers = {},
  scheduledAt,
}: Props) {
  const { graphql } = useAppwrite()

  const executeFunction = useSuspenseQuery<ResponseBody, AppwriteException[], ResponseBody>({
    queryKey: [...Keys.function(functionId).key(), 'execute', { path, method, body }],
    queryFn: async () => {
      const { data } = await graphql.mutation({
        query: createExecution,
        variables: {
          functionId,
          body: JSON.stringify(body),
          async,
          path,
          method,
          headers: JSON.stringify(headers),
          scheduledAt,
        },
      })

      if (data?.functionsCreateExecution?.status === 'failed') {
        throw new Error(data.functionsCreateExecution.errors)
      }

      const { responseBody } = data.functionsCreateExecution ?? {}

      if (typeof responseBody === 'string') {
        if (responseBody.trim().startsWith('{') && responseBody.trim().endsWith('}')) {
          try {
            return JSON.parse(responseBody)
          } catch (error) {
            console.error('Failed to parse response body:', error)
            return responseBody
          }
        }
      }
      return responseBody
    },
    staleTime: Infinity,
  })

  return {
    executeFunction,
  }
}
