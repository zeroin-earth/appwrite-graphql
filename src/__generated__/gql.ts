/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  fragment Account_UserFragment on User {\n    name\n    email\n    prefs {\n      data\n    }\n  }\n": types.Account_UserFragmentFragmentDoc,
    "\n  query AccountGet {\n    accountGet {\n      ...Account_UserFragment\n    }\n  }\n": types.AccountGetDocument,
    "\n  query ListIdentities($queries: [String!]) {\n    accountListIdentities(queries: $queries) {\n      total\n      identities {\n        userId\n        provider\n        providerUid\n        providerEmail\n        providerAccessToken\n        providerAccessTokenExpiry\n        providerRefreshToken\n      }\n    }\n  }\n": types.ListIdentitiesDocument,
    "\n  mutation CreateEmailPasswordSession($email: String!, $password: String!) {\n    accountCreateEmailPasswordSession(email: $email, password: $password) {\n      userId\n      expire\n      current\n    }\n  }\n": types.CreateEmailPasswordSessionDocument,
    "\n  mutation DeleteSession($sessionId: String!) {\n    accountDeleteSession(sessionId: $sessionId) {\n      status\n    }\n  }\n": types.DeleteSessionDocument,
    "\n  mutation CreateRecovery($email: String!, $url: String!) {\n    accountCreateRecovery(email: $email, url: $url) {\n      expire\n    }\n  }\n": types.CreateRecoveryDocument,
    "\n  mutation UpdateRecovery(\n    $userId: String!\n    $secret: String!\n    $password: String!\n    $passwordAgain: String!\n  ) {\n    accountUpdateRecovery(\n      userId: $userId\n      secret: $secret\n      password: $password\n      passwordAgain: $passwordAgain\n    ) {\n      expire\n    }\n  }\n": types.UpdateRecoveryDocument,
    "\n  mutation CreateAccount($userId: String!, $name: String, $email: String!, $password: String!) {\n    accountCreate(userId: $userId, name: $name, email: $email, password: $password) {\n      name\n      email\n    }\n  }\n": types.CreateAccountDocument,
    "\n  mutation VerifyEmail($url: String!) {\n    accountCreateVerification(url: $url) {\n      expire\n    }\n  }\n": types.VerifyEmailDocument,
    "\n  mutation UpdateEmail($email: String!, $password: String!) {\n    accountUpdateEmail(email: $email, password: $password) {\n      name\n      email\n    }\n  }\n": types.UpdateEmailDocument,
    "\n  mutation UpdateVerification($userId: String!, $secret: String!) {\n    accountUpdateVerification(userId: $userId, secret: $secret) {\n      expire\n    }\n  }\n": types.UpdateVerificationDocument,
    "\n  query ListDocuments($databaseId: String!, $collectionId: String!, $queries: [String!]) {\n    databasesListDocuments(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      queries: $queries\n    ) {\n      total\n      documents {\n        _id\n        data\n      }\n    }\n  }\n": types.ListDocumentsDocument,
    "\n  mutation CreateDocument(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $data: JSON!\n    $permissions: [String!]\n  ) {\n    databasesCreateDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      data: $data\n      permissions: $permissions\n    ) {\n      _id\n    }\n  }\n": types.CreateDocumentDocument,
    "\n  query GetDocument($databaseId: String!, $collectionId: String!, $documentId: String!) {\n    databasesGetDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n    ) {\n      _id\n      data\n    }\n  }\n": types.GetDocumentDocument,
    "\n  mutation CreateExecution(\n    $functionId: String!\n    $body: String\n    $async: Boolean\n    $path: String\n    $method: String\n    $headers: JSON\n  ) {\n    functionsCreateExecution(\n      functionId: $functionId\n      body: $body\n      async: $async\n      path: $path\n      method: $method\n      headers: $headers\n    ) {\n      _id\n      status\n      responseStatusCode\n      responseBody\n      errors\n      duration\n    }\n  }\n": types.CreateExecutionDocument,
    "\n  query GetFunctionExecution($functionId: String!, $executionId: String!) {\n    functionsGetExecution(functionId: $functionId, executionId: $executionId) {\n      status\n      errors\n      duration\n    }\n  }\n": types.GetFunctionExecutionDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment Account_UserFragment on User {\n    name\n    email\n    prefs {\n      data\n    }\n  }\n"): (typeof documents)["\n  fragment Account_UserFragment on User {\n    name\n    email\n    prefs {\n      data\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query AccountGet {\n    accountGet {\n      ...Account_UserFragment\n    }\n  }\n"): (typeof documents)["\n  query AccountGet {\n    accountGet {\n      ...Account_UserFragment\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ListIdentities($queries: [String!]) {\n    accountListIdentities(queries: $queries) {\n      total\n      identities {\n        userId\n        provider\n        providerUid\n        providerEmail\n        providerAccessToken\n        providerAccessTokenExpiry\n        providerRefreshToken\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListIdentities($queries: [String!]) {\n    accountListIdentities(queries: $queries) {\n      total\n      identities {\n        userId\n        provider\n        providerUid\n        providerEmail\n        providerAccessToken\n        providerAccessTokenExpiry\n        providerRefreshToken\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateEmailPasswordSession($email: String!, $password: String!) {\n    accountCreateEmailPasswordSession(email: $email, password: $password) {\n      userId\n      expire\n      current\n    }\n  }\n"): (typeof documents)["\n  mutation CreateEmailPasswordSession($email: String!, $password: String!) {\n    accountCreateEmailPasswordSession(email: $email, password: $password) {\n      userId\n      expire\n      current\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteSession($sessionId: String!) {\n    accountDeleteSession(sessionId: $sessionId) {\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteSession($sessionId: String!) {\n    accountDeleteSession(sessionId: $sessionId) {\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateRecovery($email: String!, $url: String!) {\n    accountCreateRecovery(email: $email, url: $url) {\n      expire\n    }\n  }\n"): (typeof documents)["\n  mutation CreateRecovery($email: String!, $url: String!) {\n    accountCreateRecovery(email: $email, url: $url) {\n      expire\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateRecovery(\n    $userId: String!\n    $secret: String!\n    $password: String!\n    $passwordAgain: String!\n  ) {\n    accountUpdateRecovery(\n      userId: $userId\n      secret: $secret\n      password: $password\n      passwordAgain: $passwordAgain\n    ) {\n      expire\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateRecovery(\n    $userId: String!\n    $secret: String!\n    $password: String!\n    $passwordAgain: String!\n  ) {\n    accountUpdateRecovery(\n      userId: $userId\n      secret: $secret\n      password: $password\n      passwordAgain: $passwordAgain\n    ) {\n      expire\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateAccount($userId: String!, $name: String, $email: String!, $password: String!) {\n    accountCreate(userId: $userId, name: $name, email: $email, password: $password) {\n      name\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation CreateAccount($userId: String!, $name: String, $email: String!, $password: String!) {\n    accountCreate(userId: $userId, name: $name, email: $email, password: $password) {\n      name\n      email\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation VerifyEmail($url: String!) {\n    accountCreateVerification(url: $url) {\n      expire\n    }\n  }\n"): (typeof documents)["\n  mutation VerifyEmail($url: String!) {\n    accountCreateVerification(url: $url) {\n      expire\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateEmail($email: String!, $password: String!) {\n    accountUpdateEmail(email: $email, password: $password) {\n      name\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateEmail($email: String!, $password: String!) {\n    accountUpdateEmail(email: $email, password: $password) {\n      name\n      email\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateVerification($userId: String!, $secret: String!) {\n    accountUpdateVerification(userId: $userId, secret: $secret) {\n      expire\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateVerification($userId: String!, $secret: String!) {\n    accountUpdateVerification(userId: $userId, secret: $secret) {\n      expire\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ListDocuments($databaseId: String!, $collectionId: String!, $queries: [String!]) {\n    databasesListDocuments(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      queries: $queries\n    ) {\n      total\n      documents {\n        _id\n        data\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListDocuments($databaseId: String!, $collectionId: String!, $queries: [String!]) {\n    databasesListDocuments(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      queries: $queries\n    ) {\n      total\n      documents {\n        _id\n        data\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateDocument(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $data: JSON!\n    $permissions: [String!]\n  ) {\n    databasesCreateDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      data: $data\n      permissions: $permissions\n    ) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateDocument(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $data: JSON!\n    $permissions: [String!]\n  ) {\n    databasesCreateDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      data: $data\n      permissions: $permissions\n    ) {\n      _id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetDocument($databaseId: String!, $collectionId: String!, $documentId: String!) {\n    databasesGetDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n    ) {\n      _id\n      data\n    }\n  }\n"): (typeof documents)["\n  query GetDocument($databaseId: String!, $collectionId: String!, $documentId: String!) {\n    databasesGetDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n    ) {\n      _id\n      data\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateExecution(\n    $functionId: String!\n    $body: String\n    $async: Boolean\n    $path: String\n    $method: String\n    $headers: JSON\n  ) {\n    functionsCreateExecution(\n      functionId: $functionId\n      body: $body\n      async: $async\n      path: $path\n      method: $method\n      headers: $headers\n    ) {\n      _id\n      status\n      responseStatusCode\n      responseBody\n      errors\n      duration\n    }\n  }\n"): (typeof documents)["\n  mutation CreateExecution(\n    $functionId: String!\n    $body: String\n    $async: Boolean\n    $path: String\n    $method: String\n    $headers: JSON\n  ) {\n    functionsCreateExecution(\n      functionId: $functionId\n      body: $body\n      async: $async\n      path: $path\n      method: $method\n      headers: $headers\n    ) {\n      _id\n      status\n      responseStatusCode\n      responseBody\n      errors\n      duration\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetFunctionExecution($functionId: String!, $executionId: String!) {\n    functionsGetExecution(functionId: $functionId, executionId: $executionId) {\n      status\n      errors\n      duration\n    }\n  }\n"): (typeof documents)["\n  query GetFunctionExecution($functionId: String!, $executionId: String!) {\n    functionsGetExecution(functionId: $functionId, executionId: $executionId) {\n      status\n      errors\n      duration\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;