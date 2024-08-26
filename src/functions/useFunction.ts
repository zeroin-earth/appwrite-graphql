import { useState } from 'react'

import { AppwriteException, Models } from '../types'

import { gql } from '../__generated__'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useSuspenseQuery } from '../useSuspenseQuery'
import { useLazyQuery } from '../useLazyQuery'
import { GetFunctionExecutionQuery } from '../__generated__/graphql'

type Props = {
  functionId: string
  body?: Record<string, any>
  async?: boolean
  path?: string
  method?: string
  waitForCompletion?: boolean
  // headers?: Record<string, any>
}

const createExecution = gql(/* GraphQL */ `
  mutation CreateExecution(
    $functionId: String!
    $body: String
    $async: Boolean
    $path: String
    $method: String # $headers: JSON
  ) {
    functionsCreateExecution(
      functionId: $functionId
      body: $body
      async: $async
      path: $path
      method: $method # headers: $headers
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
    }
  }
`)

function useCurrentExecution({
  currentExecution,
  currentFunction,
}: {
  currentExecution: string | null
  currentFunction: string | null
}) {
  const { graphql } = useAppwrite()

  const getExecution = useLazyQuery<
    GetFunctionExecutionQuery['functionsGetExecution'],
    AppwriteException[],
    GetFunctionExecutionQuery['functionsGetExecution']
  >({
    queryKey: ['appwrite', 'functions', currentFunction, currentExecution],
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

      return data.functionsGetExecution ?? {}
    },
  })

  return getExecution
}

export function useFunction() {
  const { graphql } = useAppwrite()
  const [currentExecution, setCurrentExecution] = useState<string | null>(null)
  const [currentFunction, setCurrentFunction] = useState<string | null>(null)
  const getExecution = useCurrentExecution({ currentExecution, currentFunction })

  const executeFunction = useMutation<Record<string, unknown>, AppwriteException[], Props, unknown>(
    {
      mutationFn: async ({
        functionId,
        body = {},
        async = false,
        path = '/',
        method = 'POST',
        waitForCompletion = false,
        // headers = {},
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
            // headers: JSON.stringify(headers),
          },
        })

        let unsubscribe: (() => void) | null = null

        const { _id, status, responseBody, errors } = data.functionsCreateExecution ?? {}

        if (status === 'failed') {
          throw new Error(errors)
        }

        if (!waitForCompletion) {
          return JSON.parse(responseBody ?? '{}')
        }

        setCurrentExecution(_id ?? null)

        const response = await new Promise<Record<string, unknown>>(async (resolve, reject) => {
          unsubscribe = graphql.client.subscribe<Models.Execution>(`executions.${_id}`, (event) => {
            switch (event.payload.status) {
              case 'completed':
                setCurrentExecution(null)
                resolve(JSON.parse(event.payload.responseBody ?? '{}'))
                break
              case 'failed':
                setCurrentExecution(null)
                reject(event.payload.errors ?? 'Unknown error')
                break
            }
            return 1
          })

          // Check if the execution is already completed and we missed the event
          const execution = await getExecution.run()
          if (execution.status === 'success') {
            resolve(execution.data)
          } else if (execution.status === 'error') {
            reject(execution.error)
          }
        })

        unsubscribe?.()

        return response
      },
    },
  )

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
  waitForCompletion = false,
}: // headers = {},
Props) {
  const { graphql } = useAppwrite()
  const [currentExecution, setCurrentExecution] = useState<string | null>(null)
  const [currentFunction, setCurrentFunction] = useState<string | null>(null)
  const getExecution = useCurrentExecution({ currentExecution, currentFunction })

  const executeFunction = useSuspenseQuery<
    Record<string, unknown>,
    AppwriteException[],
    Record<string, unknown>
  >({
    queryKey: ['appwrite', 'functions', functionId, path],
    queryFn: async () => {
      setCurrentFunction(functionId)

      const { data } = await graphql.mutation({
        query: createExecution,
        variables: {
          functionId,
          body: JSON.stringify(body),
          async,
          path,
          method,
          // headers,
        },
      })

      let unsubscribe: (() => void) | null = null

      const { _id, status, responseBody, errors } = data.functionsCreateExecution ?? {}

      if (status === 'failed') {
        throw new Error(errors)
      }

      if (!waitForCompletion) {
        return JSON.parse(responseBody ?? '{}')
      }

      setCurrentExecution(_id ?? null)

      const response = await new Promise(async (resolve, reject) => {
        unsubscribe = graphql.client.subscribe<Models.Execution>(`executions.${_id}`, (event) => {
          switch (event.payload.status) {
            case 'completed':
              setCurrentExecution(null)
              resolve(JSON.parse(event.payload.responseBody))
              break
            case 'failed':
              setCurrentExecution(null)
              reject(event.payload.errors)
              break
          }
          return 1
        })

        // Check if the execution is already completed and we missed the event
        const execution = await getExecution.run()
        if (execution.status === 'success') {
          resolve(execution.data)
        } else if (execution.status === 'error') {
          reject(execution.error)
        }
      })

      unsubscribe?.()

      return response
    },
  })

  return {
    executeFunction,
    currentExecution: getExecution,
  }
}
