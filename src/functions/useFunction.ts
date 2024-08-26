import { useState } from 'react'

import { AppwriteException } from '../types'

import { gql } from '../__generated__'
import { GetFunctionExecutionQuery } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useLazyQuery } from '../useLazyQuery'
import { useMutation } from '../useMutation'
import { useQuery } from '../useQuery'

type Props = {
  functionId: string
  body?: Record<string, any>
  async?: boolean
  path?: string
  method?: string
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
      requestPath
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

        const { _id, status, responseBody, errors } = data.functionsCreateExecution ?? {}

        if (status === 'failed') {
          throw new Error(errors)
        }

        setCurrentExecution(_id ?? null)

        let parsedResponseBody = {}
        try {
          parsedResponseBody = JSON.parse(responseBody ?? '{}')
        } catch (error) {}

        return parsedResponseBody
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
}: // headers = {},
Props) {
  const { graphql } = useAppwrite()
  const [currentExecution, setCurrentExecution] = useState<string | null>(null)
  const [currentFunction, setCurrentFunction] = useState<string | null>(null)
  // const getExecution = useCurrentExecution({ currentExecution, currentFunction })

  const executeFunction = useQuery<
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

      const { _id, status, responseBody, errors } = data.functionsCreateExecution ?? {}

      if (status === 'failed') {
        throw new Error(errors)
      }

      setCurrentExecution(_id ?? null)

      let parsedResponseBody = {}
      try {
        parsedResponseBody = JSON.parse(responseBody ?? '{}')
      } catch (error) {}

      return parsedResponseBody
    },
  })

  return {
    executeFunction,
    // currentExecution: getExecution,
  }
}
