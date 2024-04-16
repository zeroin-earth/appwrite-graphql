import { useMemo } from 'react'

import { ResultOf, TypedDocumentNode } from '@graphql-typed-document-node/core'
import { Account, Client, Databases, Functions, Graphql } from 'appwrite'
import { print } from 'graphql'
import { atom, useAtom } from 'jotai'

const client = new Client()

const endpoint =
  process.env.APPWRITE_ENDPOINT ?? process.env.NEXT_PUBLIC_APPWRITE_URL ?? 'http://localhost/v1'
const projectId =
  process.env.APPWRITE_PROJECT_ID ?? process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? '[PROJECT_ID]'

client.setEndpoint(endpoint).setProject(projectId)

const account = new Account(client)
const databases = new Databases(client)
const functions = new Functions(client)
const graphql = new Graphql(client)

const AccountAtom = atom<Account>(account)
const DatabasesAtom = atom<Databases>(databases)
const FunctionsAtom = atom<Functions>(functions)
const GraphqlAtom = atom<Graphql>(graphql)

type Variables = Record<string, unknown>

export function useAppwrite() {
  const [account] = useAtom(AccountAtom)
  const [databases] = useAtom(DatabasesAtom)
  const [functions] = useAtom(FunctionsAtom)
  const [graphqlAppwrite] = useAtom(GraphqlAtom)

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
