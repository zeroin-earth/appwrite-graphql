# Appwrite GraphQL

This is a fully featured GraphQL library built with [@tanstack/react-query](https://github.com/TanStack/query) on top of the Appwrite web SDK.

What this project handles for you:

- Dual build for both React and React Native
- Full Appwrite SDK v22 parity via React hooks
- Optimistic Mutations
  - Documents
- Query Caching
- Offline-first support
  - Built-in offline persisters (localStorage, AsyncStorage)
  - Custom offline persister support
- SSR Support
- Field selection
  - Prevent over-fetching
- Suspense queries
  - Documents
  - Collections
- Pagination hooks
  - Standard Pagination
  - Infinite Scroll
- Appwrite QueryBuilder
- Query key builder
- React Query Devtools support

## Installation

```bash
npm install --save @zeroin.earth/appwrite-graphql

bun add @zeroin.earth/appwrite-graphql
```

### Peer Dependencies

  - `react` - `19.0.1`
  - `appwrite` - `22.4.1`
  - `@tanstack/react-query` - `^5.70.0`

React Native:

  - `@react-native-async-storage/async-storage`
  - `@react-native-community/netinfo`
  - `react-native-appwrite`

## Usage

### Provider

The library is designed to use a single wrapper, `<AppwriteProvider>`. There sre multiple ways you can configure the wrapper based upon your app's needs:

1. Basic (no offline) — React

```tsx
import { AppwriteProvider, createAppwriteClient } from '@zeroin.earth/appwrite-graphql'

const client = createAppwriteClient({
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: 'my-project',
})

function App() {
  return (
    <AppwriteProvider client={client}>
	    {/* your app */}
    </AppwriteProvider>
  )
}
```

2. Offline-first — React

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

3. Offline-first — React Native

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  AppwriteProvider,
  createOfflineClient,
} from '@zeroin.earth/appwrite-graphql'
import { reactNativeNetworkAdapter } from '@zeroin.earth/appwrite-graphql/react-native'

const { appwrite, queryClient, persister } = createOfflineClient({
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: 'my-project',
  storage: AsyncStorage,
  networkAdapter: reactNativeNetworkAdapter(),
})

function App() {
  return (
    <AppwriteProvider
	    client={appwrite}
	    queryClient={queryClient}
	    persister={persister}
    >
	    {/* your app */}
    </AppwriteProvider>
  )
}
```

4. Offline-first — React with custom persister

```tsx
import {
  AppwriteProvider,
  createOfflineClient,
  webNetworkAdapter,
  type Persister,
} from '@zeroin.earth/appwrite-graphql'

const myPersister: Persister = {
  persistClient: async (client) => { /* write to your storage */ },
  restoreClient: async () => { /* read from your storage */ },
  removeClient: async () => { /* clear your storage */ },
}

const { appwrite, queryClient, persister } = createOfflineClient({
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: 'my-project',
  persister: myPersister,
  networkAdapter: webNetworkAdapter(),
})

function App() {
  return (
    <AppwriteProvider
	    client={appwrite}
	    queryClient={queryClient}
	    persister={persister}
    >
	    {/* your app */}
    </AppwriteProvider>
  )
}
```

5. Offline — Imperative / non-React

```tsx
import {
  createOfflineClient,
  webNetworkAdapter,
} from '@zeroin.earth/appwrite-graphql'

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

### Hooks

```jsx
import { useLogin } from "@zeroin.earth/appwrite-graphql";

export function LogIn() {
  const router = useRouter();
  const { login, oAuthLogin } = useLogin();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await login.mutateAsync(data, {
      onSuccess: () => {
        router.push("/profile");
      },
    });
  };

  const loginWithGoogle = () => {
    oAuthLogin.mutate({
      provider: "google",
      success: 'successUrl',
      failure: 'failureUrl',
    });
  };
}
```

```jsx
import { useFunction } from "@zeroin.earth/appwrite-graphql";

export function Form() {
  const { executeFunction } = useFunction();

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
          setJustSignedUp(true);
        },
      },
    );
  };
}
```
