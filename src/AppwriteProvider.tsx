import { useHydrateAtoms } from 'jotai/utils'

import { appwriteAtom } from './states/appwrite'

export function AppwriteProvider({
  endpoint,
  projectId,
  children,
}: {
  endpoint: string
  projectId: string
  children: React.ReactNode
}) {
  useHydrateAtoms([[appwriteAtom, { endpoint, projectId }]])
  return children
}
