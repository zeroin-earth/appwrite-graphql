export {
  AppwriteException,
  AuthenticationFactor,
  AuthenticatorType,
  Client,
  Account,
  Avatars,
  Databases,
  Functions,
  Graphql,
  Locale,
  Messaging,
  Storage,
  TablesDB,
  Teams,
  Realtime,
  OAuthProvider,
  ID,
} from 'appwrite'

export type { Models, Browser, CreditCard, Flag, ImageGravity, ImageFormat } from 'appwrite'

import type { Realtime as _Realtime } from 'appwrite'
/** Minimal realtime interface — works with both the standalone Realtime class (web) and Client-integrated realtime (React Native). */
export type RealtimeLike = Pick<_Realtime, 'subscribe'>

/**
 * Resolves intersection and mapped types into a flat object for cleaner IntelliSense.
 * @internal
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {}

export type QueryOptions = {
  enabled?: boolean
  retry?: boolean | number | ((failureCount: number, error: unknown) => boolean)
  retryDelay?: number | ((attemptIndex: number) => number)
  staleTime?: number
}
