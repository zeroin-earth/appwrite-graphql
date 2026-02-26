// @ts-ignore - happy-dom may not ship type declarations
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { configure } from '@testing-library/react'

GlobalRegistrator.register({ url: 'http://localhost' })
configure({ asyncUtilTimeout: 5000 })

// Prevent happy-dom's fetch cookie jar from leaking sessions between tests.
// The Appwrite SDK falls back to localStorage (X-Fallback-Cookies header) when
// browser cookies are unavailable, which we control via createWrapper().
const _fetch = globalThis.fetch
const patchedFetch = (input: any, init?: any) =>
  _fetch(input, init ? { ...init, credentials: 'omit' as const } : init)
patchedFetch.preconnect = _fetch.preconnect
globalThis.fetch = patchedFetch as typeof fetch
