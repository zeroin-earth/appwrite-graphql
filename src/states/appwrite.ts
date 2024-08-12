import { ResultOf, TypedDocumentNode } from '@graphql-typed-document-node/core'
import { print } from 'graphql'
import { atom } from 'jotai'

import { Account, Client, Databases, Graphql } from '../types'

type Variables = Record<string, unknown>

type AtomProps = {
  account: Account | null
  databases: Databases | null
  graphql: {
    client: Graphql['client']
    query: <T, V extends Variables = Variables>({
      query,
      variables,
    }: {
      query: TypedDocumentNode<T, V>
      variables?: V
    }) => Promise<{ data: ResultOf<typeof query>; errors: unknown[] }>
    mutation: <T, V extends Variables = Variables>({
      query,
      variables,
    }: {
      query: TypedDocumentNode<T, V>
      variables?: V
    }) => Promise<{ data: ResultOf<typeof query>; errors: unknown[] }>
  }
}

const endpoint =
  process.env.APPWRITE_ENDPOINT ??
  process.env.EXPO_PUBLIC_APPWRITE_URL ??
  process.env.NEXT_PUBLIC_APPWRITE_URL ??
  'http://localhost/v1'

const projectId =
  process.env.APPWRITE_PROJECT_ID ??
  process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ??
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ??
  '[PROJECT_ID]'

const defaultAppwriteClient = new Client()
defaultAppwriteClient.setEndpoint(endpoint).setProject(projectId)

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
      query: print(query),
      variables,
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
      query: print(query),
      variables,
    })) as { data: ResultOf<typeof query>; errors: unknown[] }
    return { data, errors }
  },
})

const appwriteModelsAtom = atom<AtomProps>({
  account: new Account(defaultAppwriteClient),
  databases: new Databases(defaultAppwriteClient),
  graphql: graphqlObject(new Graphql(defaultAppwriteClient)),
})

export const appwriteAtom = atom(
  (get) => get(appwriteModelsAtom),
  (_, set, { endpoint, projectId }: { endpoint: string; projectId: string }) => {
    const client = new Client()
    client.setEndpoint(endpoint).setProject(projectId)

    const account = new Account(client)
    const databases = new Databases(client)
    const graphqlAppwrite = new Graphql(client)

    set(appwriteModelsAtom, {
      account,
      databases,
      graphql: graphqlObject(graphqlAppwrite),
    })
  },
)
