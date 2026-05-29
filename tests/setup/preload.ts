import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { configure } from '@testing-library/react'

GlobalRegistrator.register({ url: 'http://localhost' })
configure({ asyncUtilTimeout: 5000 })

// Prevent happy-dom's fetch cookie jar from leaking sessions between tests.
// The Appwrite SDK falls back to localStorage (X-Fallback-Cookies header) when
// browser cookies are unavailable, which we control via createWrapper().
// Suppress Appwrite's localStorage session warning in test output
const _warn = console.warn
const SUPPRESSED_WARNINGS = [
  'Appwrite is using localStorage',
  'The current SDK is built for Appwrite',
]

console.warn = (...args: string[]) => {
  if (typeof args[0] === 'string' && SUPPRESSED_WARNINGS.some((w) => args[0].includes(w))) return
  _warn(...args)
}

const _fetch = globalThis.fetch
const patchedFetch = (input: any, init?: any) =>
  _fetch(input, init ? { ...init, credentials: 'omit' as const } : init)
patchedFetch.preconnect = _fetch.preconnect
globalThis.fetch = patchedFetch as typeof fetch
