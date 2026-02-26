import { QueryClient } from '@tanstack/react-query'
import { useHydrateAtoms } from 'jotai/utils'

import { appwriteAtom } from './states/appwrite'
import { QueryAtom } from './states/query'

export function AppwriteProvider({
  endpoint,
  projectId,
  queryClient,
  children,
}: {
  endpoint: string
  projectId: string
  queryClient?: QueryClient
  children: React.ReactNode
}) {
  const atoms: [any, any][] = [[appwriteAtom, { endpoint, projectId }]]

  if (queryClient) {
    atoms.push([QueryAtom, queryClient])
  }

  useHydrateAtoms(atoms)
  return children
}
