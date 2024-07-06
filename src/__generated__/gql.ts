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
    "\n  fragment Account_User on User {\n    _id\n    name\n    email\n    prefs {\n      data\n    }\n  }\n": types.Account_UserFragmentDoc,
    "\n  fragment Identity_Provider on Identity {\n    userId\n    provider\n  }\n": types.Identity_ProviderFragmentDoc,
    "\n  query AccountGet {\n    accountGet {\n      ...Account_User\n    }\n  }\n": types.AccountGetDocument,
    "\n  mutation CreateAnonymousSession {\n    accountCreateAnonymousSession {\n      _id\n      expire\n      current\n    }\n  }\n": types.CreateAnonymousSessionDocument,
    "\n  mutation CreateEmailToken($userId: String!, $email: String!, $phrase: Boolean) {\n    accountCreateEmailToken(userId: $userId, email: $email, phrase: $phrase) {\n      expire\n    }\n  }\n": types.CreateEmailTokenDocument,
    "\n  mutation CreateJWT {\n    accountCreateJWT {\n      jwt\n    }\n  }\n": types.CreateJwtDocument,
    "\n  mutation CreateMagicURLToken($userId: String!, $email: String!, $url: String, $phrase: Boolean) {\n    accountCreateMagicURLToken(userId: $userId, email: $email, url: $url, phrase: $phrase) {\n      expire\n    }\n  }\n": types.CreateMagicUrlTokenDocument,
    "\n  mutation CreateMfaAuthenticator($type: String!) {\n    accountCreateMfaAuthenticator(type: $type) {\n      secret\n      uri\n    }\n  }\n": types.CreateMfaAuthenticatorDocument,
    "\n  mutation CreateMfaChallenge($factor: String!) {\n    accountCreateMfaChallenge(factor: $factor) {\n      userId\n      expire\n    }\n  }\n": types.CreateMfaChallengeDocument,
    "\n  mutation CreateMfaRecoveryCodes {\n    accountCreateMfaRecoveryCodes {\n      recoveryCodes\n    }\n  }\n": types.CreateMfaRecoveryCodesDocument,
    "\n  mutation CreatePhoneToken($userId: String!, $phone: String!) {\n    accountCreatePhoneToken(userId: $userId, phone: $phone) {\n      expire\n    }\n  }\n": types.CreatePhoneTokenDocument,
    "\n  mutation CreatePhoneVerification {\n    accountCreatePhoneVerification {\n      expire\n    }\n  }\n": types.CreatePhoneVerificationDocument,
    "\n  mutation CreateSession($userId: String!, $secret: String!) {\n    accountCreateSession(userId: $userId, secret: $secret) {\n      userId\n      expire\n      current\n    }\n  }\n": types.CreateSessionDocument,
    "\n  mutation DeleteIdentity($identityId: String!) {\n    accountDeleteIdentity(identityId: $identityId) {\n      status\n    }\n  }\n": types.DeleteIdentityDocument,
    "\n  mutation DeleteMfaAuthenticator($type: String!, $otp: String!) {\n    accountDeleteMfaAuthenticator(type: $type, otp: $otp) {\n      mfa\n    }\n  }\n": types.DeleteMfaAuthenticatorDocument,
    "\n  mutation DeleteSession($sessionId: String!) {\n    accountDeleteSession(sessionId: $sessionId) {\n      status\n    }\n  }\n": types.DeleteSessionDocument,
    "\n  mutation DeleteSessions {\n    accountDeleteSessions {\n      status\n    }\n  }\n": types.DeleteSessionsDocument,
    "\n  query GetMfaRecoveryCodes {\n    accountGetMfaRecoveryCodes {\n      recoveryCodes\n    }\n  }\n": types.GetMfaRecoveryCodesDocument,
    "\n  query GetPrefs {\n    accountGetPrefs {\n      data\n    }\n  }\n": types.GetPrefsDocument,
    "\n  query GetSession($sessionId: String!) {\n    accountGetSession(sessionId: $sessionId) {\n      userId\n      expire\n      current\n    }\n  }\n": types.GetSessionDocument,
    "\n  query ListIdentities($queries: [String!]) {\n    accountListIdentities(queries: $queries) {\n      total\n      identities {\n        ...Identity_Provider\n      }\n    }\n  }\n": types.ListIdentitiesDocument,
    "\n  query ListMfaFactors {\n    accountListMfaFactors {\n      totp\n      phone\n      email\n    }\n  }\n": types.ListMfaFactorsDocument,
    "\n  query ListSessions {\n    accountListSessions {\n      sessions {\n        _id\n        _createdAt\n        osName\n        clientName\n      }\n    }\n  }\n": types.ListSessionsDocument,
    "\n  mutation CreateEmailPasswordSession($email: String!, $password: String!) {\n    accountCreateEmailPasswordSession(email: $email, password: $password) {\n      userId\n      expire\n      current\n    }\n  }\n": types.CreateEmailPasswordSessionDocument,
    "\n  query ListLogs($queries: [String!]) {\n    accountListLogs(queries: $queries) {\n      total\n      logs {\n        event\n        userId\n        userEmail\n        userName\n        mode\n        ip\n        time\n        osCode\n        osName\n        osVersion\n        clientType\n        clientCode\n        clientName\n        clientVersion\n        clientEngine\n        clientEngineVersion\n        deviceName\n        deviceBrand\n        deviceModel\n        countryCode\n        countryName\n      }\n    }\n  }\n": types.ListLogsDocument,
    "\n  mutation CreateRecovery($email: String!, $url: String!) {\n    accountCreateRecovery(email: $email, url: $url) {\n      expire\n    }\n  }\n": types.CreateRecoveryDocument,
    "\n  mutation UpdateRecovery(\n    $userId: String!\n    $secret: String!\n    $password: String!\n    $passwordAgain: String!\n  ) {\n    accountUpdateRecovery(\n      userId: $userId\n      secret: $secret\n      password: $password\n      passwordAgain: $passwordAgain\n    ) {\n      expire\n    }\n  }\n": types.UpdateRecoveryDocument,
    "\n  mutation CreateAccount($userId: String!, $name: String, $email: String!, $password: String!) {\n    accountCreate(userId: $userId, name: $name, email: $email, password: $password) {\n      name\n      email\n    }\n  }\n": types.CreateAccountDocument,
    "\n  mutation VerifyEmail($url: String!) {\n    accountCreateVerification(url: $url) {\n      expire\n    }\n  }\n": types.VerifyEmailDocument,
    "\n  mutation UpdateEmail($email: String!, $password: String!) {\n    accountUpdateEmail(email: $email, password: $password) {\n      name\n      email\n    }\n  }\n": types.UpdateEmailDocument,
    "\n  mutation UpdateMagicURLSession($userId: String!, $secret: String!) {\n    accountUpdateMagicURLSession(userId: $userId, secret: $secret) {\n      userId\n      expire\n      current\n    }\n  }\n": types.UpdateMagicUrlSessionDocument,
    "\n  mutation UpdateMFA($mfa: Boolean!) {\n    accountUpdateMFA(mfa: $mfa) {\n      mfa\n    }\n  }\n": types.UpdateMfaDocument,
    "\n  mutation UpdateMfaAuthenticator($type: String!, $otp: String!) {\n    accountUpdateMfaAuthenticator(type: $type, otp: $otp) {\n      mfa\n    }\n  }\n": types.UpdateMfaAuthenticatorDocument,
    "\n  mutation UpdateMfaChallenge($challengeId: String!, $otp: String!) {\n    accountUpdateMfaChallenge(challengeId: $challengeId, otp: $otp) {\n      status\n    }\n  }\n": types.UpdateMfaChallengeDocument,
    "\n  mutation UpdateMfaRecoveryCodes {\n    accountUpdateMfaRecoveryCodes {\n      recoveryCodes\n    }\n  }\n": types.UpdateMfaRecoveryCodesDocument,
    "\n  mutation UpdateName($name: String!) {\n    accountUpdateName(name: $name) {\n      name\n    }\n  }\n": types.UpdateNameDocument,
    "\n  mutation UpdatePassword($password: String!, $oldPassword: String!) {\n    accountUpdatePassword(password: $password, oldPassword: $oldPassword) {\n      status\n    }\n  }\n": types.UpdatePasswordDocument,
    "\n  mutation UpdatePhone($phone: String!, $password: String!) {\n    accountUpdatePhone(phone: $phone, password: $password) {\n      phone\n    }\n  }\n": types.UpdatePhoneDocument,
    "\n  mutation UpdatePhoneSession($userId: String!, $secret: String!) {\n    accountUpdatePhoneSession(userId: $userId, secret: $secret) {\n      userId\n      expire\n      current\n    }\n  }\n": types.UpdatePhoneSessionDocument,
    "\n  mutation UpdatePhoneVerification($userId: String!, $secret: String!) {\n    accountUpdatePhoneVerification(userId: $userId, secret: $secret) {\n      expire\n    }\n  }\n": types.UpdatePhoneVerificationDocument,
    "\n  mutation UpdatePrefs($prefs: JSON!) {\n    accountUpdatePrefs(prefs: $prefs) {\n      prefs {\n        data\n      }\n    }\n  }\n": types.UpdatePrefsDocument,
    "\n  mutation UpdateSession($sessionId: String!) {\n    accountUpdateSession(sessionId: $sessionId) {\n      userId\n      expire\n      current\n    }\n  }\n": types.UpdateSessionDocument,
    "\n  mutation UpdateVerification($userId: String!, $secret: String!) {\n    accountUpdateVerification(userId: $userId, secret: $secret) {\n      secret\n      expire\n      userId\n    }\n  }\n": types.UpdateVerificationDocument,
    "\n  query ListDocuments($databaseId: String!, $collectionId: String!, $queries: [String!]) {\n    databasesListDocuments(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      queries: $queries\n    ) {\n      total\n      documents {\n        _id\n        data\n      }\n    }\n  }\n": types.ListDocumentsDocument,
    "\n  mutation CreateDocument(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $data: JSON!\n    $permissions: [String!]\n  ) {\n    databasesCreateDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      data: $data\n      permissions: $permissions\n    ) {\n      _id\n    }\n  }\n": types.CreateDocumentDocument,
    "\n  mutation DeleteDocument($databaseId: String!, $collectionId: String!, $documentId: String!) {\n    databasesDeleteDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n    ) {\n      status\n    }\n  }\n": types.DeleteDocumentDocument,
    "\n  query GetDocument($databaseId: String!, $collectionId: String!, $documentId: String!) {\n    databasesGetDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n    ) {\n      _id\n      data\n    }\n  }\n": types.GetDocumentDocument,
    "\n  mutation UpdateDocument(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $data: JSON\n    $permissions: [String!]\n  ) {\n    databasesUpdateDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      data: $data\n      permissions: $permissions\n    ) {\n      _id\n    }\n  }\n": types.UpdateDocumentDocument,
    "\n  mutation CreateExecution(\n    $functionId: String!\n    $body: String\n    $async: Boolean\n    $path: String\n    $method: String # $headers: JSON\n  ) {\n    functionsCreateExecution(\n      functionId: $functionId\n      body: $body\n      async: $async\n      path: $path\n      method: $method # headers: $headers\n    ) {\n      _id\n      status\n      responseStatusCode\n      responseBody\n      errors\n      duration\n    }\n  }\n": types.CreateExecutionDocument,
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
export function gql(source: "\n  fragment Account_User on User {\n    _id\n    name\n    email\n    prefs {\n      data\n    }\n  }\n"): (typeof documents)["\n  fragment Account_User on User {\n    _id\n    name\n    email\n    prefs {\n      data\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment Identity_Provider on Identity {\n    userId\n    provider\n  }\n"): (typeof documents)["\n  fragment Identity_Provider on Identity {\n    userId\n    provider\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query AccountGet {\n    accountGet {\n      ...Account_User\n    }\n  }\n"): (typeof documents)["\n  query AccountGet {\n    accountGet {\n      ...Account_User\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateAnonymousSession {\n    accountCreateAnonymousSession {\n      _id\n      expire\n      current\n    }\n  }\n"): (typeof documents)["\n  mutation CreateAnonymousSession {\n    accountCreateAnonymousSession {\n      _id\n      expire\n      current\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateEmailToken($userId: String!, $email: String!, $phrase: Boolean) {\n    accountCreateEmailToken(userId: $userId, email: $email, phrase: $phrase) {\n      expire\n    }\n  }\n"): (typeof documents)["\n  mutation CreateEmailToken($userId: String!, $email: String!, $phrase: Boolean) {\n    accountCreateEmailToken(userId: $userId, email: $email, phrase: $phrase) {\n      expire\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateJWT {\n    accountCreateJWT {\n      jwt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateJWT {\n    accountCreateJWT {\n      jwt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateMagicURLToken($userId: String!, $email: String!, $url: String, $phrase: Boolean) {\n    accountCreateMagicURLToken(userId: $userId, email: $email, url: $url, phrase: $phrase) {\n      expire\n    }\n  }\n"): (typeof documents)["\n  mutation CreateMagicURLToken($userId: String!, $email: String!, $url: String, $phrase: Boolean) {\n    accountCreateMagicURLToken(userId: $userId, email: $email, url: $url, phrase: $phrase) {\n      expire\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateMfaAuthenticator($type: String!) {\n    accountCreateMfaAuthenticator(type: $type) {\n      secret\n      uri\n    }\n  }\n"): (typeof documents)["\n  mutation CreateMfaAuthenticator($type: String!) {\n    accountCreateMfaAuthenticator(type: $type) {\n      secret\n      uri\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateMfaChallenge($factor: String!) {\n    accountCreateMfaChallenge(factor: $factor) {\n      userId\n      expire\n    }\n  }\n"): (typeof documents)["\n  mutation CreateMfaChallenge($factor: String!) {\n    accountCreateMfaChallenge(factor: $factor) {\n      userId\n      expire\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateMfaRecoveryCodes {\n    accountCreateMfaRecoveryCodes {\n      recoveryCodes\n    }\n  }\n"): (typeof documents)["\n  mutation CreateMfaRecoveryCodes {\n    accountCreateMfaRecoveryCodes {\n      recoveryCodes\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreatePhoneToken($userId: String!, $phone: String!) {\n    accountCreatePhoneToken(userId: $userId, phone: $phone) {\n      expire\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePhoneToken($userId: String!, $phone: String!) {\n    accountCreatePhoneToken(userId: $userId, phone: $phone) {\n      expire\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreatePhoneVerification {\n    accountCreatePhoneVerification {\n      expire\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePhoneVerification {\n    accountCreatePhoneVerification {\n      expire\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateSession($userId: String!, $secret: String!) {\n    accountCreateSession(userId: $userId, secret: $secret) {\n      userId\n      expire\n      current\n    }\n  }\n"): (typeof documents)["\n  mutation CreateSession($userId: String!, $secret: String!) {\n    accountCreateSession(userId: $userId, secret: $secret) {\n      userId\n      expire\n      current\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteIdentity($identityId: String!) {\n    accountDeleteIdentity(identityId: $identityId) {\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteIdentity($identityId: String!) {\n    accountDeleteIdentity(identityId: $identityId) {\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteMfaAuthenticator($type: String!, $otp: String!) {\n    accountDeleteMfaAuthenticator(type: $type, otp: $otp) {\n      mfa\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteMfaAuthenticator($type: String!, $otp: String!) {\n    accountDeleteMfaAuthenticator(type: $type, otp: $otp) {\n      mfa\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteSession($sessionId: String!) {\n    accountDeleteSession(sessionId: $sessionId) {\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteSession($sessionId: String!) {\n    accountDeleteSession(sessionId: $sessionId) {\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteSessions {\n    accountDeleteSessions {\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteSessions {\n    accountDeleteSessions {\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMfaRecoveryCodes {\n    accountGetMfaRecoveryCodes {\n      recoveryCodes\n    }\n  }\n"): (typeof documents)["\n  query GetMfaRecoveryCodes {\n    accountGetMfaRecoveryCodes {\n      recoveryCodes\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPrefs {\n    accountGetPrefs {\n      data\n    }\n  }\n"): (typeof documents)["\n  query GetPrefs {\n    accountGetPrefs {\n      data\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetSession($sessionId: String!) {\n    accountGetSession(sessionId: $sessionId) {\n      userId\n      expire\n      current\n    }\n  }\n"): (typeof documents)["\n  query GetSession($sessionId: String!) {\n    accountGetSession(sessionId: $sessionId) {\n      userId\n      expire\n      current\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ListIdentities($queries: [String!]) {\n    accountListIdentities(queries: $queries) {\n      total\n      identities {\n        ...Identity_Provider\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListIdentities($queries: [String!]) {\n    accountListIdentities(queries: $queries) {\n      total\n      identities {\n        ...Identity_Provider\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ListMfaFactors {\n    accountListMfaFactors {\n      totp\n      phone\n      email\n    }\n  }\n"): (typeof documents)["\n  query ListMfaFactors {\n    accountListMfaFactors {\n      totp\n      phone\n      email\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ListSessions {\n    accountListSessions {\n      sessions {\n        _id\n        _createdAt\n        osName\n        clientName\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListSessions {\n    accountListSessions {\n      sessions {\n        _id\n        _createdAt\n        osName\n        clientName\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateEmailPasswordSession($email: String!, $password: String!) {\n    accountCreateEmailPasswordSession(email: $email, password: $password) {\n      userId\n      expire\n      current\n    }\n  }\n"): (typeof documents)["\n  mutation CreateEmailPasswordSession($email: String!, $password: String!) {\n    accountCreateEmailPasswordSession(email: $email, password: $password) {\n      userId\n      expire\n      current\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ListLogs($queries: [String!]) {\n    accountListLogs(queries: $queries) {\n      total\n      logs {\n        event\n        userId\n        userEmail\n        userName\n        mode\n        ip\n        time\n        osCode\n        osName\n        osVersion\n        clientType\n        clientCode\n        clientName\n        clientVersion\n        clientEngine\n        clientEngineVersion\n        deviceName\n        deviceBrand\n        deviceModel\n        countryCode\n        countryName\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListLogs($queries: [String!]) {\n    accountListLogs(queries: $queries) {\n      total\n      logs {\n        event\n        userId\n        userEmail\n        userName\n        mode\n        ip\n        time\n        osCode\n        osName\n        osVersion\n        clientType\n        clientCode\n        clientName\n        clientVersion\n        clientEngine\n        clientEngineVersion\n        deviceName\n        deviceBrand\n        deviceModel\n        countryCode\n        countryName\n      }\n    }\n  }\n"];
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
export function gql(source: "\n  mutation UpdateMagicURLSession($userId: String!, $secret: String!) {\n    accountUpdateMagicURLSession(userId: $userId, secret: $secret) {\n      userId\n      expire\n      current\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateMagicURLSession($userId: String!, $secret: String!) {\n    accountUpdateMagicURLSession(userId: $userId, secret: $secret) {\n      userId\n      expire\n      current\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateMFA($mfa: Boolean!) {\n    accountUpdateMFA(mfa: $mfa) {\n      mfa\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateMFA($mfa: Boolean!) {\n    accountUpdateMFA(mfa: $mfa) {\n      mfa\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateMfaAuthenticator($type: String!, $otp: String!) {\n    accountUpdateMfaAuthenticator(type: $type, otp: $otp) {\n      mfa\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateMfaAuthenticator($type: String!, $otp: String!) {\n    accountUpdateMfaAuthenticator(type: $type, otp: $otp) {\n      mfa\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateMfaChallenge($challengeId: String!, $otp: String!) {\n    accountUpdateMfaChallenge(challengeId: $challengeId, otp: $otp) {\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateMfaChallenge($challengeId: String!, $otp: String!) {\n    accountUpdateMfaChallenge(challengeId: $challengeId, otp: $otp) {\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateMfaRecoveryCodes {\n    accountUpdateMfaRecoveryCodes {\n      recoveryCodes\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateMfaRecoveryCodes {\n    accountUpdateMfaRecoveryCodes {\n      recoveryCodes\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateName($name: String!) {\n    accountUpdateName(name: $name) {\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateName($name: String!) {\n    accountUpdateName(name: $name) {\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdatePassword($password: String!, $oldPassword: String!) {\n    accountUpdatePassword(password: $password, oldPassword: $oldPassword) {\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePassword($password: String!, $oldPassword: String!) {\n    accountUpdatePassword(password: $password, oldPassword: $oldPassword) {\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdatePhone($phone: String!, $password: String!) {\n    accountUpdatePhone(phone: $phone, password: $password) {\n      phone\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePhone($phone: String!, $password: String!) {\n    accountUpdatePhone(phone: $phone, password: $password) {\n      phone\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdatePhoneSession($userId: String!, $secret: String!) {\n    accountUpdatePhoneSession(userId: $userId, secret: $secret) {\n      userId\n      expire\n      current\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePhoneSession($userId: String!, $secret: String!) {\n    accountUpdatePhoneSession(userId: $userId, secret: $secret) {\n      userId\n      expire\n      current\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdatePhoneVerification($userId: String!, $secret: String!) {\n    accountUpdatePhoneVerification(userId: $userId, secret: $secret) {\n      expire\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePhoneVerification($userId: String!, $secret: String!) {\n    accountUpdatePhoneVerification(userId: $userId, secret: $secret) {\n      expire\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdatePrefs($prefs: JSON!) {\n    accountUpdatePrefs(prefs: $prefs) {\n      prefs {\n        data\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePrefs($prefs: JSON!) {\n    accountUpdatePrefs(prefs: $prefs) {\n      prefs {\n        data\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateSession($sessionId: String!) {\n    accountUpdateSession(sessionId: $sessionId) {\n      userId\n      expire\n      current\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateSession($sessionId: String!) {\n    accountUpdateSession(sessionId: $sessionId) {\n      userId\n      expire\n      current\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateVerification($userId: String!, $secret: String!) {\n    accountUpdateVerification(userId: $userId, secret: $secret) {\n      secret\n      expire\n      userId\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateVerification($userId: String!, $secret: String!) {\n    accountUpdateVerification(userId: $userId, secret: $secret) {\n      secret\n      expire\n      userId\n    }\n  }\n"];
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
export function gql(source: "\n  mutation DeleteDocument($databaseId: String!, $collectionId: String!, $documentId: String!) {\n    databasesDeleteDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n    ) {\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteDocument($databaseId: String!, $collectionId: String!, $documentId: String!) {\n    databasesDeleteDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n    ) {\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetDocument($databaseId: String!, $collectionId: String!, $documentId: String!) {\n    databasesGetDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n    ) {\n      _id\n      data\n    }\n  }\n"): (typeof documents)["\n  query GetDocument($databaseId: String!, $collectionId: String!, $documentId: String!) {\n    databasesGetDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n    ) {\n      _id\n      data\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateDocument(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $data: JSON\n    $permissions: [String!]\n  ) {\n    databasesUpdateDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      data: $data\n      permissions: $permissions\n    ) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateDocument(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $data: JSON\n    $permissions: [String!]\n  ) {\n    databasesUpdateDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      data: $data\n      permissions: $permissions\n    ) {\n      _id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateExecution(\n    $functionId: String!\n    $body: String\n    $async: Boolean\n    $path: String\n    $method: String # $headers: JSON\n  ) {\n    functionsCreateExecution(\n      functionId: $functionId\n      body: $body\n      async: $async\n      path: $path\n      method: $method # headers: $headers\n    ) {\n      _id\n      status\n      responseStatusCode\n      responseBody\n      errors\n      duration\n    }\n  }\n"): (typeof documents)["\n  mutation CreateExecution(\n    $functionId: String!\n    $body: String\n    $async: Boolean\n    $path: String\n    $method: String # $headers: JSON\n  ) {\n    functionsCreateExecution(\n      functionId: $functionId\n      body: $body\n      async: $async\n      path: $path\n      method: $method # headers: $headers\n    ) {\n      _id\n      status\n      responseStatusCode\n      responseBody\n      errors\n      duration\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetFunctionExecution($functionId: String!, $executionId: String!) {\n    functionsGetExecution(functionId: $functionId, executionId: $executionId) {\n      status\n      errors\n      duration\n    }\n  }\n"): (typeof documents)["\n  query GetFunctionExecution($functionId: String!, $executionId: String!) {\n    functionsGetExecution(functionId: $functionId, executionId: $executionId) {\n      status\n      errors\n      duration\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;