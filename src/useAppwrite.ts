import { useContext } from 'react'

import { AppwriteContext } from './AppwriteProvider'

export function useAppwrite() {
  const ctx = useContext(AppwriteContext)
  if (!ctx) throw new Error('Wrap your app in <AppwriteProvider>')
  return ctx
}
