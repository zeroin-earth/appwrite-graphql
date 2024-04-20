# Appwrite GraphQL

This is a GraphQL library for Appwrite, built with the power of [@tanstack/react-query](https://github.com/TanStack/query) and inspired by [react-appwrite](https://github.com/react-appwrite/react-appwrite).

## Installation

```bash
npm install --save @zeroin.earth/appwrite-graphql

yarn add @zeroin.earth/appwrite-graphql
```

## Usage

### Set up
You must provide the Appwrite URL and Project ID as environment variables. It does not matter how they are provided as long as they can be accessed from `process.env.`:

```js
/* Endpoint - Pick one */
APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_URL=

/* Project ID - Pick one */
APPWRITE_PROJECT_ID=
NEXT_PUBLIC_APPWRITE_PROJECT_ID
```

### Hooks

```jsx
import { useLogin } from "@zeroin.earth/appwrite-graphql";

export function LogIn() {
  const router = useRouter();
  const { login, oAuthLogin } = useLogin();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    login.mutate(data, {
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

## Work in progress

We are working on matching parity with the current Appwrite SDK. After we do so, version numbers will match the currently supported version of the SDK. Until then, please feel free to use what we have finished so far!

Still left to do:

### Account ✔️
<details>
  <summary>Done</summary>
  
- [x] Get account
- [x] Create account  
- [x] Update email
- [x] List Identities
- [x] Delete Identity
- [x] Create JWT
- [x] List logs
- [x] Update name
- [x] Update password
- [x] Update phone
- [x] Get account preferences
- [x] Update preferences
- [x] Create password recovery
- [x] Create password recovery (confirmation)
- [x] List sessions
- [x] Delete sessions
- [x] Create anonymous session
- [x] Create email session
- [x] Create magic URL session
- [x] Create magic URL session (confirmation)
- [x] Create phone session
- [x] Create phone session (confirmation)
- [x] Get session
- [x] Update OAuth session (refresh tokens)
- [x] Delete session
- [x] Create email verification
- [x] Create email verification (confirmation)
- [x] Create phone verification
- [x] Create phone verification (confirmation)
</details>

### Teams

- [ ] List teams
- [ ] Create team
- [ ] Get team
- [ ] Update name
- [ ] Delete team
- [ ] List team memberships
- [ ] Create team membership
- [ ] Get team membership
- [ ] Update membership
- [ ] Delete team membership
- [ ] Update team membership status
- [ ] Get team preferences
- [ ] Update preferences

### Databases ✔️

<details>
  <summary>Done</summary>
  
- [X] List documents
- [X] Create document
- [X] Get document
- [x] Update document
- [x] Delete document
</details>

### Storage

- [ ] List files
- [ ] Create file
- [ ] Get file
- [ ] Update file
- [ ] Delete File
- [ ] Get file for download
- [ ] Get file preview
- [ ] Get file for view

### Functions ✔️

<details>
  <summary>Done</summary>
  
- [X] Create execution
- [X] Get execution
</details>

### Locale

- [ ] Get user locale
- [ ] List Locale Codes
- [ ] List continents
- [ ] List countries
- [ ] List EU countries
- [ ] List countries phone codes
- [ ] List currencies
- [ ] List languages

### Avatars

- [ ] Get browser icon
- [ ] Get credit card icon
- [ ] Get favicon
- [ ] Get country flag
- [ ] Get image from URL
- [ ] Get user initials
- [ ] Get QR code
