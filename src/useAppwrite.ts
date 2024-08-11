import { useMemo } from 'react'

import { ResultOf, TypedDocumentNode } from '@graphql-typed-document-node/core'
import { Account, Client, Databases, Functions, Graphql } from 'appwrite'
import { print } from 'graphql'

const client = new Client()

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

client.setEndpoint(endpoint).setProject(projectId)

const account = new Account(client)
const databases = new Databases(client)
const functions = new Functions(client)
const graphqlAppwrite = new Graphql(client)

type Variables = Record<string, unknown>

export function useAppwrite() {
  const graphql = useMemo(
    () => ({
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
    }),
    [graphqlAppwrite],
  )

  return {
    account,
    databases,
    functions,
    graphql,
  }
}
