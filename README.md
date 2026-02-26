# Appwrite GraphQL

This is a GraphQL library for Appwrite, built with the power of [@tanstack/react-query](https://github.com/TanStack/query) and inspired by [react-appwrite](https://github.com/react-appwrite/react-appwrite).

## Installation

```bash
npm install --save @zeroin.earth/appwrite-graphql

bun add @zeroin.earth/appwrite-graphql
```

## Usage

### Set up
You must provide the Appwrite URL and Project ID as environment variables. It does not matter how they are provided as long as they can be accessed from `process.env.`:

```js
/* Endpoint - Pick one */
APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_URL=
EXPO_PUBLIC_APPWRITE_URL=

/* Project ID - Pick one */
APPWRITE_PROJECT_ID=
NEXT_PUBLIC_APPWRITE_PROJECT_ID
EXPO_PUBLIC_APPWRITE_PROJECT_ID
```

### Provider
If you need to provide a custom endpoint and project ID, and can't use one of the above environment variables, you may override the default variables using the `<AppwriteProvider>`:

```jsx
<AppwriteProvider endpoint="https://api.example.com/v1" projectId="jhkeri4889dfg7fg78f7g">
  <App />
</AppwriteProvider>
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

### Using Fragments

```jsx
import {
  fragments,
  getFragmentData,
  useAccount,
} from "@zeroin.earth/appwrite-graphql";

export function Profile() {
  const { data, isLoading } = useAccount({});
  const account = getFragmentData(fragments.Account_UserFragment, data);

  return (
    <div>
      {data && (
        <h2>{`Welcome, ${account?.name ?? "Visitor"}!`}</h2>
      )}
    </div>
  );
}
```
