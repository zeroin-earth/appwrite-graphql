import { QueryClient } from '@tanstack/react-query'
import { atom } from 'jotai'

const queryClient = new QueryClient()

export const QueryAtom = atom(queryClient)
