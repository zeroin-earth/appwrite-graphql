import { renderHook } from '@testing-library/react'
import { describe, expect, test } from 'bun:test'

import {
  useAvatarBrowser,
  useAvatarCreditCard,
  useAvatarFavicon,
  useAvatarFlag,
  useAvatarImage,
  useAvatarInitials,
  useAvatarQR,
  useAvatarScreenshot,
} from '../../src'
import { Browser, CreditCard, Flag } from '../../src/types'
import { createWrapper } from '../setup/wrapper'

/*
 * Avatar hooks return URL strings (synchronous, no API call).
 * We just verify they produce well-formed URLs pointing to the Appwrite server.
 */

describe('Avatar hooks', () => {
  describe('useAvatarBrowser', () => {
    test('returns a URL for a browser avatar', () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useAvatarBrowser({ code: 'ff' as Browser }), { wrapper })

      expect(result.current).toBeDefined()
      expect(typeof result.current).toBe('string')
      expect(result.current).toContain('/avatars/browsers/ff')
    })

    test('includes dimension parameters in the URL', () => {
      const wrapper = createWrapper()
      const { result } = renderHook(
        () => useAvatarBrowser({ code: 'ch' as Browser, width: 100, height: 100 }),
        { wrapper },
      )

      expect(result.current).toContain('width=100')
      expect(result.current).toContain('height=100')
    })
  })

  describe('useAvatarCreditCard', () => {
    test('returns a URL for a credit card avatar', () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useAvatarCreditCard({ code: 'visa' as CreditCard }), {
        wrapper,
      })

      expect(result.current).toBeDefined()
      expect(typeof result.current).toBe('string')
      expect(result.current).toContain('/avatars/credit-cards/visa')
    })
  })

  describe('useAvatarFavicon', () => {
    test('returns a URL for a favicon', () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useAvatarFavicon({ url: 'https://example.com' }), {
        wrapper,
      })

      expect(result.current).toBeDefined()
      expect(typeof result.current).toBe('string')
      expect(result.current).toContain('/avatars/favicon')
      expect(result.current).toContain('url=')
    })
  })

  describe('useAvatarFlag', () => {
    test('returns a URL for a country flag', () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useAvatarFlag({ code: 'us' as Flag }), { wrapper })

      expect(result.current).toBeDefined()
      expect(typeof result.current).toBe('string')
      expect(result.current).toContain('/avatars/flags/us')
    })
  })

  describe('useAvatarImage', () => {
    test('returns a URL for a remote image', () => {
      const wrapper = createWrapper()
      const { result } = renderHook(
        () => useAvatarImage({ url: 'https://example.com/image.png' }),
        { wrapper },
      )

      expect(result.current).toBeDefined()
      expect(typeof result.current).toBe('string')
      expect(result.current).toContain('/avatars/image')
      expect(result.current).toContain('url=')
    })
  })

  describe('useAvatarInitials', () => {
    test('returns a URL for initials avatar', () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useAvatarInitials({ name: 'John Doe' }), { wrapper })

      expect(result.current).toBeDefined()
      expect(typeof result.current).toBe('string')
      expect(result.current).toContain('/avatars/initials')
    })

    test('works with no parameters (defaults)', () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useAvatarInitials(), { wrapper })

      expect(result.current).toBeDefined()
      expect(typeof result.current).toBe('string')
      expect(result.current).toContain('/avatars/initials')
    })
  })

  describe('useAvatarQR', () => {
    test('returns a URL for a QR code', () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useAvatarQR({ text: 'hello world' }), { wrapper })

      expect(result.current).toBeDefined()
      expect(typeof result.current).toBe('string')
      expect(result.current).toContain('/avatars/qr')
      expect(result.current).toContain('text=')
    })
  })

  describe('useAvatarScreenshot', () => {
    test('returns a URL for a website screenshot', () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useAvatarScreenshot({ url: 'https://example.com' }), {
        wrapper,
      })

      expect(result.current).toBeDefined()
      expect(typeof result.current).toBe('string')
      expect(result.current).toContain('/avatars/screenshot')
    })
  })
})
