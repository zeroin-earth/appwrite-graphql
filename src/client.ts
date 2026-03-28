import type { ResultOf, TypedDocumentNode } from '@graphql-typed-document-node/core'
import { print } from 'graphql'

import {
  Account,
  Avatars,
  Client,
  Databases,
  Functions,
  Graphql,
  Locale,
  Messaging,
  Realtime,
  type RealtimeLike,
  Storage,
  TablesDB,
  Teams,
} from './types'

type Variables = Record<string, unknown>

const graphqlObject = (graphqlAppwrite: Graphql) => ({
  client: graphqlAppwrite.client,
  query: async <T, V extends Variables = Variables>({
    query,
    variables,
  }: {
    query: TypedDocumentNode<T, V>
    variables?: V
  }) => {
    const { data, errors } = (await graphqlAppwrite.query({
      query: { query: print(query), variables },
    })) as { data: ResultOf<typeof query>; errors: unknown[] }
    return { data, errors }
  },
  mutation: async <T, V extends Variables = Variables>({
    query,
    variables,
  }: {
    query: TypedDocumentNode<T, V>
    variables?: V
  }) => {
    const { data, errors } = (await graphqlAppwrite.mutation({
      query: { query: print(query), variables },
    })) as { data: ResultOf<typeof query>; errors: unknown[] }
    return { data, errors }
  },
})

/**
 * Creates and configures an Appwrite client with all service instances.
 *
 * @param config - The Appwrite connection config with `endpoint` and `projectId`.
 * @returns An object containing `client`, `account`, `avatars`, `realtime`, `storage`, `graphql`, `databases`, `functions`, `locale`, `messaging`, `tablesDB`, and `teams`.
 *
 * @example
 * ```ts
 * const client = createAppwriteClient({
 *   endpoint: 'https://cloud.appwrite.io/v1',
 *   projectId: 'my-project',
 * })
 * ```
 */
export function createAppwriteClient({
  endpoint,
  projectId,
}: {
  endpoint: string
  projectId: string
}) {
  const client = new Client()
  client.setEndpoint(endpoint).setProject(projectId)

  return {
    client,
    account: new Account(client),
    avatars: new Avatars(client),
    realtime: (typeof Realtime === 'function' ? new Realtime(client) : client) as RealtimeLike,
    storage: new Storage(client),
    graphql: graphqlObject(new Graphql(client)),
    databases: new Databases(client),
    functions: new Functions(client),
    locale: new Locale(client),
    messaging: new Messaging(client),
    tablesDB: new TablesDB(client),
    teams: new Teams(client),
  }
}

export type AppwriteClient = ReturnType<typeof createAppwriteClient>
