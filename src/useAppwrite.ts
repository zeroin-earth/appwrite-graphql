import { useContext } from 'react'

import { AppwriteContext } from './AppwriteProvider'

/**
 * Returns the Appwrite client instance from context.
 * Must be used within an {@link AppwriteProvider}. Throws if called outside the provider.
 */
export function useAppwrite() {
  const ctx = useContext(AppwriteContext)
  if (!ctx) throw new Error('Wrap your app in <AppwriteProvider>')
  return ctx
}
