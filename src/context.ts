import * as React from 'react'

import type { AppwriteClient } from './client'
import type { KVStorage } from './types'

export type AppwriteContextValue = AppwriteClient & { kvStorage?: KVStorage }

export const AppwriteContext = React.createContext<AppwriteContextValue | null>(null)
