import { useState } from 'react'
import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
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

type GetExecutionResult = ResultOf<typeof getFunctionExecution>['functionsGetExecution']

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

  const query = useQuery<GetExecutionResult | null, AppwriteException[], GetExecutionResult | null>(
    {
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
    },
  )

  return { ...query }
}

export function useFunction() {
  const { graphql } = useAppwrite()
  const [currentExecution, setCurrentExecution] = useState<string | null>(null)
  const [currentFunction, setCurrentFunction] = useState<string | null>(null)
  const getExecution = useCurrentExecution({ currentExecution, currentFunction })

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
