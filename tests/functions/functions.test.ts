import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, spyOn, test } from 'bun:test'

import { useGetExecution, useListExecutions } from '../../src'
import { useFunction, useSuspenseFunction } from '../../src/functions/useFunction'
import { createTestUser, deleteTestUser, loginUser } from '../setup/helpers'
import { createWrapper } from '../setup/wrapper'

describe('Function hooks', () => {
  let userId: string
  let userEmail: string
  let userPassword: string

  beforeAll(async () => {
    const user = await createTestUser({ name: 'Func User' })
    userId = user.userId
    userEmail = user.email
    userPassword = user.password
  })

  afterAll(async () => {
    await deleteTestUser(userId)
  })

  describe('useFunction', () => {
    test(
      'executes a long-running function at /long',
      async () => {
        const wrapper = createWrapper()
        await loginUser(userEmail, userPassword, wrapper)

        const { result } = renderHook(() => useFunction(), { wrapper })

        const start = Date.now()
        await act(async () => {
          const response = await result.current.executeFunction.mutateAsync({
            functionId: 'test-function',
            path: '/long',
          })
          expect(response).toBe('This response was delayed by 5 seconds')
        })
        const elapsed = Date.now() - start
        expect(elapsed).toBeGreaterThanOrEqual(5000)
      },
      { timeout: 30_000 },
    )

    test(
      'handles a 500 error response at /error',
      async () => {
        const wrapper = createWrapper()
        await loginUser(userEmail, userPassword, wrapper)

        const { result } = renderHook(() => useFunction(), { wrapper })

        let didThrow = false
        await act(async () => {
          try {
            await result.current.executeFunction.mutateAsync({
              functionId: 'test-function',
              path: '/error',
            })
          } catch {
            didThrow = true
          }
        })

        expect(didThrow).toBe(true)
        await waitFor(() => expect(result.current.executeFunction.isError).toBe(true))
      },
      { timeout: 15_000 },
    )

    test(
      'returns parsed JSON from /json',
      async () => {
        const wrapper = createWrapper()
        await loginUser(userEmail, userPassword, wrapper)

        const { result } = renderHook(() => useFunction(), { wrapper })

        await act(async () => {
          const response = await result.current.executeFunction.mutateAsync({
            functionId: 'test-function',
            path: '/json',
          })
          expect(response).toEqual({ message: 'This is a JSON response' })
        })

        await waitFor(
          () => {
            expect(result.current.currentExecution.isSuccess).toBe(true)
          },
          { timeout: 10_000 },
        )
        const executionData = result.current.currentExecution.data
        expect(executionData).toHaveProperty('status', 'completed')
        expect(executionData).toHaveProperty('requestPath', '/json')
      },
      { timeout: 15_000 },
    )

    test(
      'returns a text string for an invalid path',
      async () => {
        const wrapper = createWrapper()
        await loginUser(userEmail, userPassword, wrapper)

        const { result } = renderHook(() => useFunction(), { wrapper })

        await act(async () => {
          const response = await result.current.executeFunction.mutateAsync({
            functionId: 'test-function',
            path: '/noop',
          })
          expect(response).toBe('Invalid path')
        })
      },
      { timeout: 15_000 },
    )

    describe('useSuspenseFunction', () => {
      test(
        'executes a function and returns the response',
        async () => {
          const wrapper = createWrapper({ suspense: true })
          await loginUser(userEmail, userPassword, wrapper)

          const { result } = renderHook(
            () =>
              useSuspenseFunction({
                functionId: 'test-function',
                path: '/long',
              }),
            { wrapper },
          )

          await waitFor(() => expect(result.current.executeFunction.isSuccess).toBe(true), {
            timeout: 10_000,
          })

          const response = result.current.executeFunction.data
          expect(response).toBe('This response was delayed by 5 seconds')
        },
        { timeout: 15_000 },
      )

      test(
        'handles errors and catches them',
        async () => {
          const spy = spyOn(console, 'error').mockImplementation(() => {})

          let caughtError: Error | null = null
          const wrapper = createWrapper({
            suspense: true,
            onError: (error) => {
              caughtError = error
            },
          })
          await loginUser(userEmail, userPassword, wrapper)

          renderHook(
            () =>
              useSuspenseFunction({
                functionId: 'test-function',
                path: '/error',
              }),
            { wrapper },
          )

          await waitFor(() => expect(caughtError).not.toBeNull(), { timeout: 10_000 })

          spy.mockRestore()
        },
        { timeout: 15_000 },
      )

      test(
        'returns parsed JSON from a function response',
        async () => {
          const wrapper = createWrapper({ suspense: true })
          await loginUser(userEmail, userPassword, wrapper)

          const { result } = renderHook(
            () =>
              useSuspenseFunction({
                functionId: 'test-function',
                path: '/json',
              }),
            { wrapper },
          )

          await waitFor(() => expect(result.current.executeFunction.isSuccess).toBe(true), {
            timeout: 10_000,
          })

          const response = result.current.executeFunction.data
          expect(response).toEqual({ message: 'This is a JSON response' })
        },
        { timeout: 15_000 },
      )
    })
  })

  describe('useListExecutions & useGetExecution', () => {
    test('lists executions for a function', async () => {
      const wrapper = createWrapper()
      await loginUser(userEmail, userPassword, wrapper)

      const { result } = renderHook(() => useListExecutions({ functionId: 'test-function' }), {
        wrapper,
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const data = result.current.data
      expect(data).toHaveProperty('total')
      expect(data).toHaveProperty('executions')
      expect(Array.isArray(data?.executions)).toBe(true)

      const { result: getExecutionResult } = renderHook(
        () =>
          useGetExecution({
            functionId: 'test-function',
            executionId: data?.executions[0]._id ?? '',
          }),
        {
          wrapper,
        },
      )

      await waitFor(() => expect(getExecutionResult.current.isSuccess).toBe(true))

      const executionData = getExecutionResult.current.data
      expect(executionData).toHaveProperty('_id')
      expect(executionData).toHaveProperty('functionId', 'test-function')
    })
  })
})
