import { useContext } from 'react'
import { QueryClientContext } from '@tanstack/react-query'

export function useQueryClient() {
  const ctx = useContext(QueryClientContext)
  if (!ctx) throw new Error('Wrap your app in <QueryClientProvider>')
  return ctx
}
