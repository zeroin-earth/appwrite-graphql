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
    realtime: new Realtime(client),
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
