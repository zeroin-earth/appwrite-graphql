export {
  AppwriteException,
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

export type QueryOptions = {
  enabled?: boolean
  retry?: boolean | number | ((failureCount: number, error: unknown) => boolean)
  retryDelay?: number | ((attemptIndex: number) => number)
  staleTime?: number
}
