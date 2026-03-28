import * as React from 'react'

import type { AppwriteClient } from './client'

export const AppwriteContext = React.createContext<AppwriteClient | null>(null)
