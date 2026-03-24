# Appwrite GraphQL

![Static Badge](https://img.shields.io/badge/coverage-95%25-brightgreen) ![NPM Version](https://img.shields.io/npm/v/%40zeroin.earth%2Fappwrite-graphql) ![Static Badge](https://img.shields.io/badge/appwrite-v1.8.1-%23FD366E)

Appwrite is an open source, BaaS in the same vein as Supabase and Firebase, but geared more toward self-hosting.

This is a fully featured GraphQL library built with [@tanstack/react-query](https://github.com/TanStack/query) on top of the Appwrite web SDK and is fully typed. Think of this library as the abstract wrapper you would have made yourself, but we already did it for you.

## Features

- Dual build for both React and React Native
- Full Appwrite SDK v23 parity using React hooks
- [Optimistic Mutations](#optimistic-mutations)
  - Documents only
- [Query Caching](#query-caching)
  - [QueryKey Builder](#querykey-builder)
- [Offline-first Support](#offline-first-support)
  - [Built-in Offline Persisters](#built-in-offline-persisters) (localStorage, AsyncStorage)
  - [Custom Offline Persister Support](#custom-offline-persister-support)
  - [Conflict Resolution](#conflict-resolution)
- [SSR Support](#ssr-support)
- [Field Selection](#field-selection)
- [Suspense Queries](#suspense-queries)
  - Documents
  - Collections
- [Pagination Hooks](#pagination-hooks)
  - Standard Pagination
  - Infinite Scroll
- [Appwrite QueryBuilder](#appwrite-querybuilder)
- [React Query Devtools Support](#react-query-devtools-support)

## Installation

```bash
npm install --save @zeroin.earth/appwrite-graphql

bun add @zeroin.earth/appwrite-graphql
```

### Peer Dependencies

- `react` - `^19.1.0`
- `appwrite` - `^23.0.0`
- `@tanstack/react-query` - `^5.70.0`

**React Native:**

- `react-native-appwrite` - `^0.25.0`
- `@react-native-async-storage/async-storage` - `^3.0.1`
- `@react-native-community/netinfo` - `^12.0.1`

## Usage

### Provider

The library is designed to use a single wrapper, `<AppwriteProvider>`. There are multiple ways you can configure the wrapper based on your app's needs:

1. Basic (no offline-first support) - React

```tsx
import { AppwriteProvider, createAppwriteClient } from '@zeroin.earth/appwrite-graphql'

const client = createAppwriteClient({
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: 'my-project',
})

function App() {
  return <AppwriteProvider client={client}>{/* your app */}</AppwriteProvider>
}
```

2. Offline-first - React

```tsx
import {
  AppwriteProvider,
  createOfflineClient,
  webNetworkAdapter,
} from '@zeroin.earth/appwrite-graphql'

const { appwrite, queryClient, persister } = createOfflineClient({
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: 'my-project',
  storage: localStorage, // or any AsyncStorage-compatible interface
  networkAdapter: webNetworkAdapter(),
})

function App() {
  return (
    <AppwriteProvider
      client={appwrite}
      queryClient={queryClient}
      persister={persister}
      onCacheRestored={() => console.log('Cache restored mutations replayed')}
    >
      {/* your app */}
    </AppwriteProvider>
  )
}
```

3. Offline-first - React Native

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppwriteProvider, createOfflineClient } from '@zeroin.earth/appwrite-graphql'

import { reactNativeNetworkAdapter } from '@zeroin.earth/appwrite-graphql/react-native'

const { appwrite, queryClient, persister } = createOfflineClient({
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: 'my-project',
  storage: AsyncStorage,
  networkAdapter: reactNativeNetworkAdapter(),
})

function App() {
  return (
    <AppwriteProvider client={appwrite} queryClient={queryClient} persister={persister}>
      {/* your app */}
    </AppwriteProvider>
  )
}
```

4. Offline-first - React with custom persister

```tsx
import {
  AppwriteProvider,
  createOfflineClient,
  webNetworkAdapter,
  type Persister,
} from '@zeroin.earth/appwrite-graphql'

const myPersister: Persister = {
  persistClient: async (client) => {
    /* write to your storage */
  },
  restoreClient: async () => {
    /* read from your storage */
  },
  removeClient: async () => {
    /* clear your storage */
  },
}

const { appwrite, queryClient, persister } = createOfflineClient({
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: 'my-project',
  persister: myPersister,
  networkAdapter: webNetworkAdapter(),
})

function App() {
  return (
    <AppwriteProvider client={appwrite} queryClient={queryClient} persister={persister}>
      {/* your app */}
    </AppwriteProvider>
  )
}
```

5. Offline - Imperative / non-React

```tsx
import { createOfflineClient, webNetworkAdapter } from '@zeroin.earth/appwrite-graphql'

const client = createOfflineClient({
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: 'my-project',
  storage: localStorage,
  networkAdapter: webNetworkAdapter(),
})

// Start persistence — restores cache from storage, subscribes to
// future changes, and replays paused mutations once restored.
const { unsubscribe, restored } = client.startPersistence()

await restored
console.log('Cache restored, paused mutations replayed')

// Use client.queryClient and client.appwrite directly
// ...
// Cleanup when done

unsubscribe()
```

## Optimistic Mutations

For this first iteration, the project provides optimistic mutations for document-related mutation hooks: `useUpdateDocument`, `useUpsertDocument`, `useIncrementAttribute`, `useDecrementAttribute`, and `useDeleteDocument`. Optimistic Mutations can easily be added to other hooks. We wanted to make sure the most important ones were covered first.

Optimistic mutations allow us to update the query cache while the mutation is in-flight, giving us the illusion of immediate updates without waiting for a server response. If the server update fails for any reason, the optimistic update is reverted to prevent incorrect data from being displayed.

## Query Caching

All queries are assigned a unique queryKey and provide the developer with access to the underlying `staleTime` property.

```tsx
type Person = {
  name: string
  age: number
}

const person = useDocument<Person>(
  {
    databaseId: 'db1',
    collectionId: 'col1',
    documentId: 'doc1',
    fields: ['name', 'age'],
  },
  {
    staleTime: 1000 * 60, // 1 minute
  },
)
```

### QueryKey Builder

During development, we started getting annoyed with keeping our query keys straight, so we built a factory you can use to perform manual cache eviction. We tried to keep the pattern as close to Appwrite's `Channels` as possible.

```tsx
import { Keys } from '@zeroin.earth/appwrite-graphql'

const queryKey = Keys.database(databaseId).collection(collectionId).document(documentId).key()
```

## Offline-first Support

We wanted to give developers the freedom to build projects that didn't require continual internet connectivity. Using React Query's `offlineFirst` network modes, we built in a way for mutations to queue up and replay in order once the device reconnects to the internet. We then built an offline client to wrap it all together.

### Built-in Offline Persisters

With mutations queuing up, we needed to persist them in the event of an online connection being days away, rather than just a temporary outage. Enter the persisters. The library comes with two out-of-the-box options: localStorage and AsyncStorage, depending on what you're building.

```tsx
const { appwrite, queryClient, persister } = createOfflineClient({
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: 'my-project',
  storage: localStorage, // or any AsyncStorage-compatible interface
  networkAdapter: webNetworkAdapter(),
})
```

The above example will serialize the mutations to localStorage after a set `throttleTime` elapses (defaults to 1000ms). Once the `networkAdapter` detects the device is online, the serialized mutations will instantly start replaying in order.

### Custom Offline Persister Support

Sometimes you want to bring your own persister, or just don't want to use localStorage or AsyncStorage. For this, you can build your own. See [Provider example #4](#provider) above for a full example using a custom `Persister`.

### Conflict Resolution

While in offline-first mode, there will be times when an update can happen on the server without your device knowing about it, and the device will push its own mutation once it comes back online. To handle this, we have built in 3 conflict resolution paths and allowed the developer to bring their own if needed.

```tsx
createOfflineClient({
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: 'my-project',
  storage: localStorage,
  networkAdapter: webNetworkAdapter(),
  conflictStrategy: 'last-write-wins',
})
```

**last-write-wins**: This is the default behavior, where whatever is in the most recent mutation is what is applied to the database, regardless of when and where it came from. This is also the default behavior of Appwrite.

**server-wins**: If the record was changed on the server and differs from the version cached locally on the device, the replayed mutation is dropped, preserving the server's version.

**merge-shallow**: A remote copy is pulled from the server, changes between the remote and local copies are identified, and the changes are merged into a final copy, giving precedence to fields that were updated on the server if both copies changed the same field.

**custom**: A custom resolver function can be supplied with the following type:

```tsx
conflictStrategy: (context: ConflictContext) =>
  Record<string, string | number | boolean | null> | 'abort'
```

- `abort` signals to drop the replaying mutation and change nothing.

## SSR Support

We have exposed 3 of the most used queries Appwrite surfaces to be used in SSR preFetchQuery calls. This allows you to prefetch a page's content server-side:

- `getAccountQuery`
- `getDocumentQuery`
- `getCollectionQuery`

```tsx
import * as React from 'react'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

import {
  createAppwriteClient,
  useCollection,
  getCollectionQuery,
} from '@zeroin.earth/appwrite-graphql'

type PostType = {
  title: string
  image: string
  description: string
}

// This could also be getServerSideProps
export async function getStaticProps() {
  const appwriteClient = createAppwriteClient({
    endpoint: 'https://example.com/v1',
    projectId: 'project-id',
  })

  const queryClient = new QueryClient()

  // Perform the prefetching of the collection query on the server.
  await queryClient.prefetchQuery(
    getCollectionQuery<PostType>(appwriteClient, {
      databaseId: 'db1',
      collectionId: 'col1',
      fields: ['title', 'image', 'description'],
    }),
  )

  // Dehydrate the query client state and pass it as a
  // prop to the page component.
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

function Posts() {
  // Since we prefetched the data on the server, this will use the
  // cached data and not trigger a network request. If the cache is empty,
  // it will fetch the data from the Appwrite server normally.
  const { data } = useCollection<PostType>({
    databaseId: 'db1',
    collectionId: 'col1',
    fields: ['title', 'image', 'description'],
  })

  return (
    <div>
      {data?.documents?.map((post) => (
        <div key={post.$id}>
          <h2>{post.title}</h2>
          <img src={post.image} alt={post.title} />
          <p>{post.description}</p>
        </div>
      ))}
    </div>
  )
}

// The dehydrated state from the server is passed to the HydrationBoundary,
// which allows the client-side React Query to rehydrate and use the prefetched
// data without making an additional network request.
export default function PostsRoute({ dehydratedState }) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <Posts />
    </HydrationBoundary>
  )
}
```

## Field Selection

The most used query hooks allow you to specify the fields returned by Appwrite to prevent over-fetching. These fields select out of the `data` property that is returned:

- `useDocument`
- `useCollection`
- `useCollectionWithPagination`
- `useInfiniteCollection`

```tsx
type Person = {
  name: string
  age: number
}

const person = useDocument<Person>({
  databaseId: 'db1',
  collectionId: 'col1',
  documentId: 'doc1',
  fields: ['name', 'age'],
})
```

## Suspense Queries

When using a `<Suspense>` boundary within React, you are able to utilize our selection of Suspense hooks. They are using `useSuspenseQuery` on the backside and will work out of the box with React Suspense.

- `useSuspenseCreateJWT`
- `useSuspenseCollection`
- `useSuspenseCollectionWithPagination`
- `useSuspenseDocument`
- `useSuspenseFunction`

## Pagination Hooks

We have included two pagination hooks out of the box

**With Pagination:**

```tsx
import * as React from 'react'
import { q, useCollectionWithPagination } from '@zeroin.earth/appwrite-graphql'

type Item = {
  _id: string
  name: string
}

export default function Test() {
  const { documents, page, total, nextPage, previousPage, hasNextPage, hasPreviousPage } =
    useCollectionWithPagination<Item>({
      databaseId: 'your-database-id',
      collectionId: 'your-collection-id',
      queries: q<Item>()
        .equal('name', ['John', 'Jane'])
        .createdBefore(new Date('2024-01-01').toDateString())
        .orderAsc('name')
        .build(),
      limit: 10,
      fields: ['name', '_id'],
    })

  return (
    <div>
      <ul>
        {documents.map((item) => (
          <li key={item._id}>{item.name}</li>
        ))}
      </ul>

      <button onClick={previousPage} disabled={!hasPreviousPage}>
        Previous
      </button>

      <button onClick={nextPage} disabled={!hasNextPage}>
        Next
      </button>

      <p>Page: {page}</p>
      <p>Total: {total}</p>
    </div>
  )
}
```

**Infinite Scroll**:

```tsx
import * as React from 'react'
import { q, useInfiniteCollection } from '@zeroin.earth/appwrite-graphql'

type Item = {
  _id: string
  name: string
}

export default function Test() {
  const { documents, fetchNextPage, hasNextPage } = useInfiniteCollection<Item>({
    databaseId: 'your-database-id',
    collectionId: 'your-collection-id',
    queries: q<Item>()
      .equal('name', ['John', 'Jane'])
      .createdBefore(new Date('2024-01-01').toDateString())
      .orderAsc('name')
      .build(),
    limit: 25,
    fields: ['name', '_id'],
  })

  return (
    <div>
      <ul>
        {documents.map((item) => (
          <li key={item._id}>{item.name}</li>
        ))}
      </ul>

      <button onClick={fetchNextPage} disabled={!hasNextPage}>
        Load More...
      </button>
    </div>
  )
}
```

## Appwrite QueryBuilder

Appwrite SDK includes a built-in Query factory, but we wanted to make something a little easier for ourselves while developing this library, so we are including what we put together. All `queries` props in all the hooks can take either the built-in Query factory, ours, or both, so you can do what makes the most sense for you.

Our QueryBuilder is type safe and exposes all underlying functions from the built-in version 1 for 1.

```tsx
import { q, useCollection } from '@zeroin.earth/appwrite-graphql'

type YourType = {
  name: string
  favNumber: number
  favColor: string
  favFood: string
}

export function Profiles() {
  const { documents, error, isLoading } = useCollection<YourType>({
    databaseId: 'your-database-id',
    collectionId: 'your-collection-id',
    queries: q<YourType>()
      .or(
        (q) => q.equal('favColor', 'blue').greaterThan('favNumber', 18),
        (q) => q.equal('favFood', 'pizza').lessThan('favNumber', 10),
        (q) =>
          q.and(
            (q) => q.between('favNumber', 5, 15),
            (q) => q.startsWith('name', 'A'),
          ),
      )

      .build(),
  })

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error?.length > 0 && <p>Error: {error[0].message}</p>}
      {documents && (
        <ul>
          {documents.map((doc) => (
            <li key={doc.$id}>
              Name: {doc.name}, Fav Number: {doc.favNumber}, Fav Color: {doc.favColor}, Fav Food:{' '}
              {doc.favFood}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

## React Query Devtools Support

React Query Devtools are bundled and ready to go. For any additional questions and information, please consult [Tanstack Query's](https://tanstack.com/query/latest/docs/framework/react/devtools#install-and-import-the-devtools) website.

## Examples

### Login with email or OAuth

```ts
import { useLogin } from '@zeroin.earth/appwrite-graphql'

export function LogIn() {
  const router = useRouter()

  const { login, oAuthLogin } = useLogin()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await login.mutateAsync(data, {
      onSuccess: () => {
        router.push('/profile')
      },
    })
  }

  const loginWithGoogle = () => {
    oAuthLogin.mutate({
      provider: 'google',
      success: 'successUrl',
      failure: 'failureUrl',
    })
  }
}
```

---

### Execute a server function

```ts
import { useFunction } from '@zeroin.earth/appwrite-graphql'

export function Form() {
  const { executeFunction } = useFunction()

  const onSubmit: SubmitHandler<Input> = async (data) => {
    executeFunction.mutate(
      {
        functionId: '6gibhbyy6tggdf',
        body: {
          message: {
            ...data,
          },
        },
      },
      {
        onSettled: () => {
          setJustSignedUp(true)
        },
      },
    )
  }
}
```

## License

MIT
