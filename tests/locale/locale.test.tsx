import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, test } from 'bun:test'

import {
  useLocale,
  useLocaleCodes,
  useLocaleContinents,
  useLocaleCountries,
  useLocaleCountriesEU,
  useLocaleCountriesPhones,
  useLocaleCurrencies,
  useLocaleLanguages,
} from '../../src'
import { createWrapper } from '../setup/wrapper'

/*
 * Locale hooks are read-only and don't require authentication.
 * They query static reference data from the Appwrite server.
 */

describe('Locale hooks', () => {
  describe('useLocale', () => {
    test('returns locale information for the current request', async () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useLocale(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      // At minimum, ip and countryCode should be present
      expect(result.current.data).toHaveProperty('ip')
      expect(result.current.data).toHaveProperty('countryCode')
    })
  })

  describe('useLocaleCodes', () => {
    test('returns a list of locale codes', async () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useLocaleCodes(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.total).toBeGreaterThan(0)
      expect(result.current.data?.localeCodes).toBeInstanceOf(Array)
      expect(result.current.data?.localeCodes?.[0]).toHaveProperty('code')
      expect(result.current.data?.localeCodes?.[0]).toHaveProperty('name')
    })
  })

  describe('useLocaleContinents', () => {
    test('returns a list of continents', async () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useLocaleContinents(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.total).toBeGreaterThan(0)
      expect(result.current.data?.continents).toBeInstanceOf(Array)
      expect(result.current.data?.continents?.[0]).toHaveProperty('name')
      expect(result.current.data?.continents?.[0]).toHaveProperty('code')
    })
  })

  describe('useLocaleCountries', () => {
    test('returns a list of countries', async () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useLocaleCountries(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.total).toBeGreaterThan(0)
      expect(result.current.data?.countries).toBeInstanceOf(Array)
      expect(result.current.data?.countries?.[0]).toHaveProperty('name')
      expect(result.current.data?.countries?.[0]).toHaveProperty('code')
    })
  })

  describe('useLocaleCountriesEU', () => {
    test('returns a list of EU countries', async () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useLocaleCountriesEU(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.total).toBeGreaterThan(0)
      expect(result.current.data?.countries).toBeInstanceOf(Array)
    })
  })

  describe('useLocaleCountriesPhones', () => {
    test('returns a list of countries with phone codes', async () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useLocaleCountriesPhones(), {
        wrapper,
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.total).toBeGreaterThan(0)
      expect(result.current.data?.phones).toBeInstanceOf(Array)
      expect(result.current.data?.phones?.[0]).toHaveProperty('code')
      expect(result.current.data?.phones?.[0]).toHaveProperty('countryCode')
      expect(result.current.data?.phones?.[0]).toHaveProperty('countryName')
    })
  })

  describe('useLocaleCurrencies', () => {
    test('returns a list of currencies', async () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useLocaleCurrencies(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.total).toBeGreaterThan(0)
      expect(result.current.data?.currencies).toBeInstanceOf(Array)
      expect(result.current.data?.currencies?.[0]).toHaveProperty('symbol')
      expect(result.current.data?.currencies?.[0]).toHaveProperty('name')
      expect(result.current.data?.currencies?.[0]).toHaveProperty('code')
    })
  })

  describe('useLocaleLanguages', () => {
    test('returns a list of languages', async () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useLocaleLanguages(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.total).toBeGreaterThan(0)
      expect(result.current.data?.languages).toBeInstanceOf(Array)
      expect(result.current.data?.languages?.[0]).toHaveProperty('name')
      expect(result.current.data?.languages?.[0]).toHaveProperty('code')
      expect(result.current.data?.languages?.[0]).toHaveProperty('nativeName')
    })
  })
})
