import { useState } from 'react'

import { Models } from 'appwrite'

import { gql } from '../__generated__'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQuery } from '../useQuery'
import { useSuspenseQuery } from '../useSuspenseQuery'

type Props = {
  functionId: string
  body?: Record<string, any>
  async?: boolean
  path?: string
  method?: string
  headers?: Record<string, any>
}

const createExecution = gql(/* GraphQL */ `
  mutation CreateExecution(
    $functionId: String!
    $body: String
    $async: Boolean
    $path: String
    $method: String
    $headers: JSON
  ) {
    functionsCreateExecution(
      functionId: $functionId
      body: $body
      async: $async
      path: $path
      method: $method
      headers: $headers
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
    }
  }
`)

export function useFunction() {
  const { graphql } = useAppwrite()
  const [currentExecution, setCurrentExecution] = useState<string | null>(null)
  const [currentFunction, setCurrentFunction] = useState<string | null>(null)

  const executeFunction = useMutation<Record<string, unknown>, Error, Props, unknown>({
    mutationFn: async ({ functionId, body = {}, async, path, method, headers }) => {
      setCurrentFunction(functionId)

      const { data } = await graphql.mutation({
        query: createExecution,
        variables: {
          functionId,
          body: JSON.stringify(body),
          async,
          path,
          method,
          headers,
        },
      })

      let unsubscribe: (() => void) | null = null

      const { _id, status, responseBody, errors } = data.functionsCreateExecution ?? {}

      if (status === 'completed') {
        return JSON.parse(responseBody ?? '{}')
      }

      if (status === 'failed' && errors) {
        throw new Error(errors)
      }

      setCurrentExecution(_id ?? null)

      const response = await new Promise((resolve, reject) => {
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
      })

      unsubscribe?.()

      return response
    },
  })

  const getExecution = useQuery({
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

  return {
    executeFunction,
    currentExecution: getExecution,
  }
}

export function useSuspenseFunction({
  functionId,
  body = {},
  async = false,
  path = '',
  method = 'POST',
  headers = {},
}: Props) {
  const { graphql } = useAppwrite()
  const [currentExecution, setCurrentExecution] = useState<string | null>(null)
  const [currentFunction, setCurrentFunction] = useState<string | null>(null)

  const executeFunction = useSuspenseQuery<Record<string, unknown>, Error, Record<string, unknown>>(
    {
      queryKey: ['appwrite', 'functions', functionId],
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
            headers,
          },
        })

        let unsubscribe: (() => void) | null = null

        const { _id, status, responseBody, errors } = data.functionsCreateExecution ?? {}

        if (status === 'completed') {
          return JSON.parse(responseBody ?? '{}')
        }

        if (status === 'failed' && errors) {
          throw new Error(errors)
        }

        setCurrentExecution(_id ?? null)

        const response = await new Promise((resolve, reject) => {
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
        })

        unsubscribe?.()

        return response
      },
    },
  )

  const getExecution = useQuery({
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

  return {
    executeFunction,
    currentExecution: getExecution,
  }
}
