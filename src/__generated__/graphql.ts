/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type Document = {
  __typename?: 'Document';
  _collectionId?: Maybe<Scalars['String']['output']>;
  _createdAt?: Maybe<Scalars['String']['output']>;
  _databaseId?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  _permissions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  _updatedAt?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Scalars['JSON']['output']>;
};

export type DocumentList = {
  __typename?: 'DocumentList';
  documents?: Maybe<Array<Maybe<Document>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type Execution = {
  __typename?: 'Execution';
  _createdAt?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  _updatedAt?: Maybe<Scalars['String']['output']>;
  duration?: Maybe<Scalars['Float']['output']>;
  errors?: Maybe<Scalars['String']['output']>;
  functionId?: Maybe<Scalars['String']['output']>;
  requestMethod?: Maybe<Scalars['String']['output']>;
  requestPath?: Maybe<Scalars['String']['output']>;
  responseBody?: Maybe<Scalars['String']['output']>;
  responseStatusCode?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  trigger?: Maybe<Scalars['String']['output']>;
};

export type Identity = {
  __typename?: 'Identity';
  _createdAt?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  _updatedAt?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  providerAccessToken?: Maybe<Scalars['String']['output']>;
  providerAccessTokenExpiry?: Maybe<Scalars['String']['output']>;
  providerEmail?: Maybe<Scalars['String']['output']>;
  providerRefreshToken?: Maybe<Scalars['String']['output']>;
  providerUid?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type IdentityList = {
  __typename?: 'IdentityList';
  identities?: Maybe<Array<Identity>>;
  total: Scalars['Int']['output'];
};

export type Jwt = {
  __typename?: 'JWT';
  jwt?: Maybe<Scalars['String']['output']>;
};

export type Log = {
  __typename?: 'Log';
  _createdAt?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  _updatedAt?: Maybe<Scalars['String']['output']>;
  clientCode?: Maybe<Scalars['String']['output']>;
  clientEngine?: Maybe<Scalars['String']['output']>;
  clientEngineVersion?: Maybe<Scalars['String']['output']>;
  clientName?: Maybe<Scalars['String']['output']>;
  clientType?: Maybe<Scalars['String']['output']>;
  clientVersion?: Maybe<Scalars['String']['output']>;
  countryCode?: Maybe<Scalars['String']['output']>;
  countryName?: Maybe<Scalars['String']['output']>;
  deviceBrand?: Maybe<Scalars['String']['output']>;
  deviceModel?: Maybe<Scalars['String']['output']>;
  deviceName?: Maybe<Scalars['String']['output']>;
  event?: Maybe<Scalars['String']['output']>;
  ip?: Maybe<Scalars['String']['output']>;
  mode?: Maybe<Scalars['String']['output']>;
  osCode?: Maybe<Scalars['String']['output']>;
  osName?: Maybe<Scalars['String']['output']>;
  osVersion?: Maybe<Scalars['String']['output']>;
  time?: Maybe<Scalars['String']['output']>;
  userEmail?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
};

export type LogsList = {
  __typename?: 'LogsList';
  logs?: Maybe<Array<Log>>;
  total: Scalars['Int']['output'];
};

export type MfaChallenge = {
  __typename?: 'MFAChallenge';
  _createdAt?: Maybe<Scalars['Date']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  expire?: Maybe<Scalars['Date']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type MfaFactors = {
  __typename?: 'MFAFactors';
  email?: Maybe<Scalars['Boolean']['output']>;
  phone?: Maybe<Scalars['Boolean']['output']>;
  totp?: Maybe<Scalars['Boolean']['output']>;
};

export type MfaRecoveryCodes = {
  __typename?: 'MFARecoveryCodes';
  recoveryCodes: Array<Scalars['String']['output']>;
};

export type MfaType = {
  __typename?: 'MFAType';
  secret?: Maybe<Scalars['String']['output']>;
  uri?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  accountCreate?: Maybe<User>;
  accountCreateAnonymousSession?: Maybe<Session>;
  accountCreateEmailPasswordSession?: Maybe<Session>;
  accountCreateEmailToken?: Maybe<Token>;
  accountCreateJWT?: Maybe<Jwt>;
  accountCreateMagicURLSession?: Maybe<Token>;
  accountCreateMagicURLToken?: Maybe<Token>;
  accountCreateMfaAuthenticator?: Maybe<MfaType>;
  accountCreateMfaChallenge?: Maybe<MfaChallenge>;
  accountCreateMfaRecoveryCodes?: Maybe<MfaRecoveryCodes>;
  accountCreatePhoneSession?: Maybe<Token>;
  accountCreatePhoneToken?: Maybe<Token>;
  accountCreatePhoneVerification?: Maybe<Token>;
  accountCreateRecovery?: Maybe<Token>;
  accountCreateSession?: Maybe<Session>;
  accountCreateVerification?: Maybe<Token>;
  accountDeleteIdentity?: Maybe<Status>;
  accountDeleteMfaAuthenticator?: Maybe<User>;
  accountDeleteSession?: Maybe<Status>;
  accountDeleteSessions?: Maybe<Status>;
  accountUpdateEmail?: Maybe<User>;
  accountUpdateMFA?: Maybe<User>;
  accountUpdateMagicURLSession?: Maybe<Session>;
  accountUpdateMfaAuthenticator?: Maybe<User>;
  accountUpdateMfaChallenge?: Maybe<Status>;
  accountUpdateMfaRecoveryCodes?: Maybe<MfaRecoveryCodes>;
  accountUpdateName?: Maybe<User>;
  accountUpdatePassword?: Maybe<User>;
  accountUpdatePhone?: Maybe<User>;
  accountUpdatePhoneSession?: Maybe<Session>;
  accountUpdatePhoneVerification?: Maybe<Token>;
  accountUpdatePrefs?: Maybe<User>;
  accountUpdateRecovery?: Maybe<Token>;
  accountUpdateSession?: Maybe<Session>;
  accountUpdateVerification?: Maybe<Token>;
  databasesCreateDocument?: Maybe<Document>;
  databasesDeleteDocument?: Maybe<Status>;
  databasesUpdateDocument?: Maybe<Document>;
  functionsCreateExecution?: Maybe<Execution>;
};


export type MutationAccountCreateArgs = {
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationAccountCreateEmailPasswordSessionArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationAccountCreateEmailTokenArgs = {
  email: Scalars['String']['input'];
  phrase?: InputMaybe<Scalars['Boolean']['input']>;
  userId: Scalars['String']['input'];
};


export type MutationAccountCreateMagicUrlSessionArgs = {
  email: Scalars['String']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};


export type MutationAccountCreateMagicUrlTokenArgs = {
  email: Scalars['String']['input'];
  phrase?: InputMaybe<Scalars['Boolean']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};


export type MutationAccountCreateMfaAuthenticatorArgs = {
  type: Scalars['String']['input'];
};


export type MutationAccountCreateMfaChallengeArgs = {
  factor: Scalars['String']['input'];
};


export type MutationAccountCreatePhoneSessionArgs = {
  phone: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationAccountCreatePhoneTokenArgs = {
  phone: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationAccountCreateRecoveryArgs = {
  email: Scalars['String']['input'];
  url: Scalars['String']['input'];
};


export type MutationAccountCreateSessionArgs = {
  secret: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationAccountCreateVerificationArgs = {
  url: Scalars['String']['input'];
};


export type MutationAccountDeleteIdentityArgs = {
  identityId: Scalars['String']['input'];
};


export type MutationAccountDeleteMfaAuthenticatorArgs = {
  otp: Scalars['String']['input'];
  type: Scalars['String']['input'];
};


export type MutationAccountDeleteSessionArgs = {
  sessionId: Scalars['String']['input'];
};


export type MutationAccountUpdateEmailArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationAccountUpdateMfaArgs = {
  mfa: Scalars['Boolean']['input'];
};


export type MutationAccountUpdateMagicUrlSessionArgs = {
  secret: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationAccountUpdateMfaAuthenticatorArgs = {
  otp: Scalars['String']['input'];
  type: Scalars['String']['input'];
};


export type MutationAccountUpdateMfaChallengeArgs = {
  challengeId: Scalars['String']['input'];
  otp: Scalars['String']['input'];
};


export type MutationAccountUpdateNameArgs = {
  name: Scalars['String']['input'];
};


export type MutationAccountUpdatePasswordArgs = {
  oldPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationAccountUpdatePhoneArgs = {
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};


export type MutationAccountUpdatePhoneSessionArgs = {
  secret: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationAccountUpdatePhoneVerificationArgs = {
  secret: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationAccountUpdatePrefsArgs = {
  prefs: Scalars['JSON']['input'];
};


export type MutationAccountUpdateRecoveryArgs = {
  password: Scalars['String']['input'];
  passwordAgain: Scalars['String']['input'];
  secret: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationAccountUpdateSessionArgs = {
  sessionId: Scalars['String']['input'];
};


export type MutationAccountUpdateVerificationArgs = {
  secret: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationDatabasesCreateDocumentArgs = {
  collectionId: Scalars['String']['input'];
  data: Scalars['JSON']['input'];
  databaseId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationDatabasesDeleteDocumentArgs = {
  collectionId: Scalars['String']['input'];
  databaseId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
};


export type MutationDatabasesUpdateDocumentArgs = {
  collectionId: Scalars['String']['input'];
  data?: InputMaybe<Scalars['JSON']['input']>;
  databaseId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationFunctionsCreateExecutionArgs = {
  async?: InputMaybe<Scalars['Boolean']['input']>;
  body?: InputMaybe<Scalars['String']['input']>;
  functionId: Scalars['String']['input'];
  headers?: InputMaybe<Scalars['JSON']['input']>;
  method?: InputMaybe<Scalars['String']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
};

export type Preferences = {
  __typename?: 'Preferences';
  data?: Maybe<Scalars['JSON']['output']>;
};

export type Query = {
  __typename?: 'Query';
  accountGet?: Maybe<User>;
  accountGetMfaRecoveryCodes?: Maybe<MfaRecoveryCodes>;
  accountGetPrefs?: Maybe<Preferences>;
  accountGetSession?: Maybe<Session>;
  accountListIdentities?: Maybe<IdentityList>;
  accountListLogs?: Maybe<LogsList>;
  accountListMfaFactors?: Maybe<MfaFactors>;
  accountListSessions?: Maybe<SessionList>;
  databasesGetDocument?: Maybe<Document>;
  databasesListDocuments?: Maybe<DocumentList>;
  functionsGetExecution?: Maybe<Execution>;
};


export type QueryAccountGetSessionArgs = {
  sessionId: Scalars['String']['input'];
};


export type QueryAccountListIdentitiesArgs = {
  queries?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryAccountListLogsArgs = {
  queries?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryDatabasesGetDocumentArgs = {
  collectionId: Scalars['String']['input'];
  databaseId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
};


export type QueryDatabasesListDocumentsArgs = {
  collectionId: Scalars['String']['input'];
  databaseId: Scalars['String']['input'];
  queries?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryFunctionsGetExecutionArgs = {
  executionId: Scalars['String']['input'];
  functionId: Scalars['String']['input'];
};

export type Session = {
  __typename?: 'Session';
  _createdAt?: Maybe<Scalars['Date']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  clientCode?: Maybe<Scalars['String']['output']>;
  clientEngine?: Maybe<Scalars['String']['output']>;
  clientEngineVersion?: Maybe<Scalars['String']['output']>;
  clientName?: Maybe<Scalars['String']['output']>;
  clientType?: Maybe<Scalars['String']['output']>;
  clientVersion?: Maybe<Scalars['String']['output']>;
  countryCode?: Maybe<Scalars['String']['output']>;
  countryName?: Maybe<Scalars['String']['output']>;
  current?: Maybe<Scalars['Boolean']['output']>;
  deviceBrand?: Maybe<Scalars['String']['output']>;
  deviceModel?: Maybe<Scalars['String']['output']>;
  deviceName?: Maybe<Scalars['String']['output']>;
  expire?: Maybe<Scalars['Date']['output']>;
  factors?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  ip?: Maybe<Scalars['String']['output']>;
  mfaUpdatedAt?: Maybe<Scalars['Date']['output']>;
  osCode?: Maybe<Scalars['String']['output']>;
  osName?: Maybe<Scalars['String']['output']>;
  osVersion?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  providerAccessToken?: Maybe<Scalars['String']['output']>;
  providerAccessTokenExpiry?: Maybe<Scalars['Date']['output']>;
  providerRefreshToken?: Maybe<Scalars['String']['output']>;
  providerUid?: Maybe<Scalars['String']['output']>;
  secret?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type SessionList = {
  __typename?: 'SessionList';
  sessions?: Maybe<Array<Maybe<Session>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type Status = {
  __typename?: 'Status';
  status?: Maybe<Scalars['Boolean']['output']>;
};

export type Target = {
  __typename?: 'Target';
  _createdAt?: Maybe<Scalars['Date']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  _updatedAt?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  providerId?: Maybe<Scalars['String']['output']>;
  providerType?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type Token = {
  __typename?: 'Token';
  _createdAt?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  expire?: Maybe<Scalars['Date']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  _createdAt?: Maybe<Scalars['Date']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  _updatedAt?: Maybe<Scalars['Date']['output']>;
  accessedAt?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailVerification?: Maybe<Scalars['Boolean']['output']>;
  labels?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  mfa?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  phoneVerification?: Maybe<Scalars['Boolean']['output']>;
  prefs?: Maybe<Preferences>;
  registration?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  targets?: Maybe<Array<Maybe<Target>>>;
};

export type Account_UserFragmentFragment = { __typename?: 'User', name?: string | null, email?: string | null, prefs?: { __typename?: 'Preferences', data?: any | null } | null } & { ' $fragmentName'?: 'Account_UserFragmentFragment' };

export type Identity_ProviderFragmentFragment = { __typename?: 'Identity', userId?: string | null, provider?: string | null } & { ' $fragmentName'?: 'Identity_ProviderFragmentFragment' };

export type AccountGetQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountGetQuery = { __typename?: 'Query', accountGet?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'Account_UserFragmentFragment': Account_UserFragmentFragment } }
  ) | null };

export type CreateAnonymousSessionMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateAnonymousSessionMutation = { __typename?: 'Mutation', accountCreateAnonymousSession?: { __typename?: 'Session', _id?: string | null, expire?: any | null, current?: boolean | null } | null };

export type CreateEmailTokenMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  email: Scalars['String']['input'];
  phrase?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type CreateEmailTokenMutation = { __typename?: 'Mutation', accountCreateEmailToken?: { __typename?: 'Token', expire?: any | null } | null };

export type CreateJwtMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateJwtMutation = { __typename?: 'Mutation', accountCreateJWT?: { __typename?: 'JWT', jwt?: string | null } | null };

export type CreateMagicUrlTokenMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  email: Scalars['String']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
  phrase?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type CreateMagicUrlTokenMutation = { __typename?: 'Mutation', accountCreateMagicURLToken?: { __typename?: 'Token', expire?: any | null } | null };

export type CreateMfaAuthenticatorMutationVariables = Exact<{
  type: Scalars['String']['input'];
}>;


export type CreateMfaAuthenticatorMutation = { __typename?: 'Mutation', accountCreateMfaAuthenticator?: { __typename?: 'MFAType', secret?: string | null, uri?: string | null } | null };

export type CreateMfaChallengeMutationVariables = Exact<{
  factor: Scalars['String']['input'];
}>;


export type CreateMfaChallengeMutation = { __typename?: 'Mutation', accountCreateMfaChallenge?: { __typename?: 'MFAChallenge', userId?: string | null, expire?: any | null } | null };

export type CreateMfaRecoveryCodesMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateMfaRecoveryCodesMutation = { __typename?: 'Mutation', accountCreateMfaRecoveryCodes?: { __typename?: 'MFARecoveryCodes', recoveryCodes: Array<string> } | null };

export type CreatePhoneTokenMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  phone: Scalars['String']['input'];
}>;


export type CreatePhoneTokenMutation = { __typename?: 'Mutation', accountCreatePhoneToken?: { __typename?: 'Token', expire?: any | null } | null };

export type CreatePhoneVerificationMutationVariables = Exact<{ [key: string]: never; }>;


export type CreatePhoneVerificationMutation = { __typename?: 'Mutation', accountCreatePhoneVerification?: { __typename?: 'Token', expire?: any | null } | null };

export type CreateSessionMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
}>;


export type CreateSessionMutation = { __typename?: 'Mutation', accountCreateSession?: { __typename?: 'Session', userId?: string | null, expire?: any | null, current?: boolean | null } | null };

export type DeleteIdentityMutationVariables = Exact<{
  identityId: Scalars['String']['input'];
}>;


export type DeleteIdentityMutation = { __typename?: 'Mutation', accountDeleteIdentity?: { __typename?: 'Status', status?: boolean | null } | null };

export type DeleteMfaAuthenticatorMutationVariables = Exact<{
  type: Scalars['String']['input'];
  otp: Scalars['String']['input'];
}>;


export type DeleteMfaAuthenticatorMutation = { __typename?: 'Mutation', accountDeleteMfaAuthenticator?: { __typename?: 'User', mfa?: boolean | null } | null };

export type DeleteSessionMutationVariables = Exact<{
  sessionId: Scalars['String']['input'];
}>;


export type DeleteSessionMutation = { __typename?: 'Mutation', accountDeleteSession?: { __typename?: 'Status', status?: boolean | null } | null };

export type GetMfaRecoveryCodesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMfaRecoveryCodesQuery = { __typename?: 'Query', accountGetMfaRecoveryCodes?: { __typename?: 'MFARecoveryCodes', recoveryCodes: Array<string> } | null };

export type GetPrefsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPrefsQuery = { __typename?: 'Query', accountGetPrefs?: { __typename?: 'Preferences', data?: any | null } | null };

export type GetSessionQueryVariables = Exact<{
  sessionId: Scalars['String']['input'];
}>;


export type GetSessionQuery = { __typename?: 'Query', accountGetSession?: { __typename?: 'Session', userId?: string | null, expire?: any | null, current?: boolean | null } | null };

export type ListIdentitiesQueryVariables = Exact<{
  queries?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type ListIdentitiesQuery = { __typename?: 'Query', accountListIdentities?: { __typename?: 'IdentityList', total: number, identities?: Array<(
      { __typename?: 'Identity' }
      & { ' $fragmentRefs'?: { 'Identity_ProviderFragmentFragment': Identity_ProviderFragmentFragment } }
    )> | null } | null };

export type ListMfaFactorsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListMfaFactorsQuery = { __typename?: 'Query', accountListMfaFactors?: { __typename?: 'MFAFactors', totp?: boolean | null, phone?: boolean | null, email?: boolean | null } | null };

export type ListSessionsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListSessionsQuery = { __typename?: 'Query', accountListSessions?: { __typename?: 'SessionList', sessions?: Array<{ __typename?: 'Session', _id?: string | null, _createdAt?: any | null, osName?: string | null, clientName?: string | null } | null> | null } | null };

export type CreateEmailPasswordSessionMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type CreateEmailPasswordSessionMutation = { __typename?: 'Mutation', accountCreateEmailPasswordSession?: { __typename?: 'Session', userId?: string | null, expire?: any | null, current?: boolean | null } | null };

export type ListLogsQueryVariables = Exact<{
  queries?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type ListLogsQuery = { __typename?: 'Query', accountListLogs?: { __typename?: 'LogsList', total: number, logs?: Array<{ __typename?: 'Log', event?: string | null, userId?: string | null, userEmail?: string | null, userName?: string | null, mode?: string | null, ip?: string | null, time?: string | null, osCode?: string | null, osName?: string | null, osVersion?: string | null, clientType?: string | null, clientCode?: string | null, clientName?: string | null, clientVersion?: string | null, clientEngine?: string | null, clientEngineVersion?: string | null, deviceName?: string | null, deviceBrand?: string | null, deviceModel?: string | null, countryCode?: string | null, countryName?: string | null }> | null } | null };

export type CreateRecoveryMutationVariables = Exact<{
  email: Scalars['String']['input'];
  url: Scalars['String']['input'];
}>;


export type CreateRecoveryMutation = { __typename?: 'Mutation', accountCreateRecovery?: { __typename?: 'Token', expire?: any | null } | null };

export type UpdateRecoveryMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordAgain: Scalars['String']['input'];
}>;


export type UpdateRecoveryMutation = { __typename?: 'Mutation', accountUpdateRecovery?: { __typename?: 'Token', expire?: any | null } | null };

export type CreateAccountMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', accountCreate?: { __typename?: 'User', name?: string | null, email?: string | null } | null };

export type VerifyEmailMutationVariables = Exact<{
  url: Scalars['String']['input'];
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', accountCreateVerification?: { __typename?: 'Token', expire?: any | null } | null };

export type UpdateEmailMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type UpdateEmailMutation = { __typename?: 'Mutation', accountUpdateEmail?: { __typename?: 'User', name?: string | null, email?: string | null } | null };

export type UpdateMfaMutationVariables = Exact<{
  mfa: Scalars['Boolean']['input'];
}>;


export type UpdateMfaMutation = { __typename?: 'Mutation', accountUpdateMFA?: { __typename?: 'User', mfa?: boolean | null } | null };

export type UpdateMagicUrlSessionMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
}>;


export type UpdateMagicUrlSessionMutation = { __typename?: 'Mutation', accountUpdateMagicURLSession?: { __typename?: 'Session', userId?: string | null, expire?: any | null, current?: boolean | null } | null };

export type UpdateMfaAuthenticatorMutationVariables = Exact<{
  type: Scalars['String']['input'];
  otp: Scalars['String']['input'];
}>;


export type UpdateMfaAuthenticatorMutation = { __typename?: 'Mutation', accountUpdateMfaAuthenticator?: { __typename?: 'User', mfa?: boolean | null } | null };

export type UpdateMfaChallengeMutationVariables = Exact<{
  challengeId: Scalars['String']['input'];
  otp: Scalars['String']['input'];
}>;


export type UpdateMfaChallengeMutation = { __typename?: 'Mutation', accountUpdateMfaChallenge?: { __typename?: 'Status', status?: boolean | null } | null };

export type UpdateMfaRecoveryCodesMutationVariables = Exact<{ [key: string]: never; }>;


export type UpdateMfaRecoveryCodesMutation = { __typename?: 'Mutation', accountUpdateMfaRecoveryCodes?: { __typename?: 'MFARecoveryCodes', recoveryCodes: Array<string> } | null };

export type UpdateNameMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type UpdateNameMutation = { __typename?: 'Mutation', accountUpdateName?: { __typename?: 'User', name?: string | null } | null };

export type UpdatePasswordMutationVariables = Exact<{
  password: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
}>;


export type UpdatePasswordMutation = { __typename?: 'Mutation', accountUpdatePassword?: { __typename?: 'User', status?: string | null } | null };

export type UpdatePhoneMutationVariables = Exact<{
  phone: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type UpdatePhoneMutation = { __typename?: 'Mutation', accountUpdatePhone?: { __typename?: 'User', phone?: string | null } | null };

export type UpdatePhoneSessionMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
}>;


export type UpdatePhoneSessionMutation = { __typename?: 'Mutation', accountUpdatePhoneSession?: { __typename?: 'Session', userId?: string | null, expire?: any | null, current?: boolean | null } | null };

export type UpdatePhoneVerificationMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
}>;


export type UpdatePhoneVerificationMutation = { __typename?: 'Mutation', accountUpdatePhoneVerification?: { __typename?: 'Token', expire?: any | null } | null };

export type UpdatePrefsMutationVariables = Exact<{
  prefs: Scalars['JSON']['input'];
}>;


export type UpdatePrefsMutation = { __typename?: 'Mutation', accountUpdatePrefs?: { __typename?: 'User', prefs?: { __typename?: 'Preferences', data?: any | null } | null } | null };

export type UpdateSessionMutationVariables = Exact<{
  sessionId: Scalars['String']['input'];
}>;


export type UpdateSessionMutation = { __typename?: 'Mutation', accountUpdateSession?: { __typename?: 'Session', userId?: string | null, expire?: any | null, current?: boolean | null } | null };

export type UpdateVerificationMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
}>;


export type UpdateVerificationMutation = { __typename?: 'Mutation', accountUpdateVerification?: { __typename?: 'Token', expire?: any | null } | null };

export type ListDocumentsQueryVariables = Exact<{
  databaseId: Scalars['String']['input'];
  collectionId: Scalars['String']['input'];
  queries?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type ListDocumentsQuery = { __typename?: 'Query', databasesListDocuments?: { __typename?: 'DocumentList', total?: number | null, documents?: Array<{ __typename?: 'Document', _id?: string | null, data?: any | null } | null> | null } | null };

export type CreateDocumentMutationVariables = Exact<{
  databaseId: Scalars['String']['input'];
  collectionId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
  data: Scalars['JSON']['input'];
  permissions?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type CreateDocumentMutation = { __typename?: 'Mutation', databasesCreateDocument?: { __typename?: 'Document', _id?: string | null } | null };

export type DeleteDocumentMutationVariables = Exact<{
  databaseId: Scalars['String']['input'];
  collectionId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
}>;


export type DeleteDocumentMutation = { __typename?: 'Mutation', databasesDeleteDocument?: { __typename?: 'Status', status?: boolean | null } | null };

export type GetDocumentQueryVariables = Exact<{
  databaseId: Scalars['String']['input'];
  collectionId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
}>;


export type GetDocumentQuery = { __typename?: 'Query', databasesGetDocument?: { __typename?: 'Document', _id?: string | null, data?: any | null } | null };

export type UpdateDocumentMutationVariables = Exact<{
  databaseId: Scalars['String']['input'];
  collectionId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
  data: Scalars['JSON']['input'];
  permissions?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type UpdateDocumentMutation = { __typename?: 'Mutation', databasesUpdateDocument?: { __typename?: 'Document', _id?: string | null, _collectionId?: string | null, _databaseId?: string | null, _createdAt?: string | null, _updatedAt?: string | null, _permissions?: Array<string | null> | null, data?: any | null } | null };

export type CreateExecutionMutationVariables = Exact<{
  functionId: Scalars['String']['input'];
  body?: InputMaybe<Scalars['String']['input']>;
  async?: InputMaybe<Scalars['Boolean']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  method?: InputMaybe<Scalars['String']['input']>;
  headers?: InputMaybe<Scalars['JSON']['input']>;
}>;


export type CreateExecutionMutation = { __typename?: 'Mutation', functionsCreateExecution?: { __typename?: 'Execution', _id?: string | null, status?: string | null, responseStatusCode?: number | null, responseBody?: string | null, errors?: string | null, duration?: number | null } | null };

export type GetFunctionExecutionQueryVariables = Exact<{
  functionId: Scalars['String']['input'];
  executionId: Scalars['String']['input'];
}>;


export type GetFunctionExecutionQuery = { __typename?: 'Query', functionsGetExecution?: { __typename?: 'Execution', status?: string | null, errors?: string | null, duration?: number | null } | null };

export const Account_UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Account_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<Account_UserFragmentFragment, unknown>;
export const Identity_ProviderFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Identity_ProviderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Identity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}}]} as unknown as DocumentNode<Identity_ProviderFragmentFragment, unknown>;
export const AccountGetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountGet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountGet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Account_UserFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Account_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<AccountGetQuery, AccountGetQueryVariables>;
export const CreateAnonymousSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAnonymousSession"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateAnonymousSession"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}},{"kind":"Field","name":{"kind":"Name","value":"current"}}]}}]}}]} as unknown as DocumentNode<CreateAnonymousSessionMutation, CreateAnonymousSessionMutationVariables>;
export const CreateEmailTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEmailToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phrase"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateEmailToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"phrase"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phrase"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<CreateEmailTokenMutation, CreateEmailTokenMutationVariables>;
export const CreateJwtDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateJWT"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateJWT"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jwt"}}]}}]}}]} as unknown as DocumentNode<CreateJwtMutation, CreateJwtMutationVariables>;
export const CreateMagicUrlTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMagicURLToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phrase"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateMagicURLToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}},{"kind":"Argument","name":{"kind":"Name","value":"phrase"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phrase"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<CreateMagicUrlTokenMutation, CreateMagicUrlTokenMutationVariables>;
export const CreateMfaAuthenticatorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMfaAuthenticator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateMfaAuthenticator"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"secret"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}}]}}]}}]} as unknown as DocumentNode<CreateMfaAuthenticatorMutation, CreateMfaAuthenticatorMutationVariables>;
export const CreateMfaChallengeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMfaChallenge"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"factor"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateMfaChallenge"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"factor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"factor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<CreateMfaChallengeMutation, CreateMfaChallengeMutationVariables>;
export const CreateMfaRecoveryCodesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMfaRecoveryCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateMfaRecoveryCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recoveryCodes"}}]}}]}}]} as unknown as DocumentNode<CreateMfaRecoveryCodesMutation, CreateMfaRecoveryCodesMutationVariables>;
export const CreatePhoneTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePhoneToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreatePhoneToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"phone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<CreatePhoneTokenMutation, CreatePhoneTokenMutationVariables>;
export const CreatePhoneVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePhoneVerification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreatePhoneVerification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<CreatePhoneVerificationMutation, CreatePhoneVerificationMutationVariables>;
export const CreateSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}},{"kind":"Field","name":{"kind":"Name","value":"current"}}]}}]}}]} as unknown as DocumentNode<CreateSessionMutation, CreateSessionMutationVariables>;
export const DeleteIdentityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteIdentity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountDeleteIdentity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identityId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identityId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DeleteIdentityMutation, DeleteIdentityMutationVariables>;
export const DeleteMfaAuthenticatorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMfaAuthenticator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountDeleteMfaAuthenticator"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"otp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfa"}}]}}]}}]} as unknown as DocumentNode<DeleteMfaAuthenticatorMutation, DeleteMfaAuthenticatorMutationVariables>;
export const DeleteSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountDeleteSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sessionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DeleteSessionMutation, DeleteSessionMutationVariables>;
export const GetMfaRecoveryCodesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMfaRecoveryCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountGetMfaRecoveryCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recoveryCodes"}}]}}]}}]} as unknown as DocumentNode<GetMfaRecoveryCodesQuery, GetMfaRecoveryCodesQueryVariables>;
export const GetPrefsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPrefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountGetPrefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<GetPrefsQuery, GetPrefsQueryVariables>;
export const GetSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountGetSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sessionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}},{"kind":"Field","name":{"kind":"Name","value":"current"}}]}}]}}]} as unknown as DocumentNode<GetSessionQuery, GetSessionQueryVariables>;
export const ListIdentitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListIdentities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queries"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountListIdentities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"queries"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queries"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"identities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Identity_ProviderFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Identity_ProviderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Identity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}}]} as unknown as DocumentNode<ListIdentitiesQuery, ListIdentitiesQueryVariables>;
export const ListMfaFactorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListMfaFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountListMfaFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totp"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<ListMfaFactorsQuery, ListMfaFactorsQueryVariables>;
export const ListSessionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListSessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountListSessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"_createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"osName"}},{"kind":"Field","name":{"kind":"Name","value":"clientName"}}]}}]}}]}}]} as unknown as DocumentNode<ListSessionsQuery, ListSessionsQueryVariables>;
export const CreateEmailPasswordSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEmailPasswordSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateEmailPasswordSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}},{"kind":"Field","name":{"kind":"Name","value":"current"}}]}}]}}]} as unknown as DocumentNode<CreateEmailPasswordSessionMutation, CreateEmailPasswordSessionMutationVariables>;
export const ListLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queries"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountListLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"queries"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queries"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"logs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"ip"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"osCode"}},{"kind":"Field","name":{"kind":"Name","value":"osName"}},{"kind":"Field","name":{"kind":"Name","value":"osVersion"}},{"kind":"Field","name":{"kind":"Name","value":"clientType"}},{"kind":"Field","name":{"kind":"Name","value":"clientCode"}},{"kind":"Field","name":{"kind":"Name","value":"clientName"}},{"kind":"Field","name":{"kind":"Name","value":"clientVersion"}},{"kind":"Field","name":{"kind":"Name","value":"clientEngine"}},{"kind":"Field","name":{"kind":"Name","value":"clientEngineVersion"}},{"kind":"Field","name":{"kind":"Name","value":"deviceName"}},{"kind":"Field","name":{"kind":"Name","value":"deviceBrand"}},{"kind":"Field","name":{"kind":"Name","value":"deviceModel"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryName"}}]}}]}}]}}]} as unknown as DocumentNode<ListLogsQuery, ListLogsQueryVariables>;
export const CreateRecoveryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRecovery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateRecovery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<CreateRecoveryMutation, CreateRecoveryMutationVariables>;
export const UpdateRecoveryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRecovery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordAgain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateRecovery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"passwordAgain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordAgain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<UpdateRecoveryMutation, UpdateRecoveryMutationVariables>;
export const CreateAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<CreateAccountMutation, CreateAccountMutationVariables>;
export const VerifyEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateVerification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const UpdateEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<UpdateEmailMutation, UpdateEmailMutationVariables>;
export const UpdateMfaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMFA"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mfa"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateMFA"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mfa"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mfa"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfa"}}]}}]}}]} as unknown as DocumentNode<UpdateMfaMutation, UpdateMfaMutationVariables>;
export const UpdateMagicUrlSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMagicURLSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateMagicURLSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}},{"kind":"Field","name":{"kind":"Name","value":"current"}}]}}]}}]} as unknown as DocumentNode<UpdateMagicUrlSessionMutation, UpdateMagicUrlSessionMutationVariables>;
export const UpdateMfaAuthenticatorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMfaAuthenticator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateMfaAuthenticator"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"otp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfa"}}]}}]}}]} as unknown as DocumentNode<UpdateMfaAuthenticatorMutation, UpdateMfaAuthenticatorMutationVariables>;
export const UpdateMfaChallengeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMfaChallenge"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"challengeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateMfaChallenge"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"challengeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"challengeId"}}},{"kind":"Argument","name":{"kind":"Name","value":"otp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdateMfaChallengeMutation, UpdateMfaChallengeMutationVariables>;
export const UpdateMfaRecoveryCodesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMfaRecoveryCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateMfaRecoveryCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recoveryCodes"}}]}}]}}]} as unknown as DocumentNode<UpdateMfaRecoveryCodesMutation, UpdateMfaRecoveryCodesMutationVariables>;
export const UpdateNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateNameMutation, UpdateNameMutationVariables>;
export const UpdatePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdatePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"oldPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdatePasswordMutation, UpdatePasswordMutationVariables>;
export const UpdatePhoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePhone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdatePhone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"phone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]} as unknown as DocumentNode<UpdatePhoneMutation, UpdatePhoneMutationVariables>;
export const UpdatePhoneSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePhoneSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdatePhoneSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}},{"kind":"Field","name":{"kind":"Name","value":"current"}}]}}]}}]} as unknown as DocumentNode<UpdatePhoneSessionMutation, UpdatePhoneSessionMutationVariables>;
export const UpdatePhoneVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePhoneVerification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdatePhoneVerification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<UpdatePhoneVerificationMutation, UpdatePhoneVerificationMutationVariables>;
export const UpdatePrefsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePrefs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"prefs"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdatePrefs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"prefs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"prefs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<UpdatePrefsMutation, UpdatePrefsMutationVariables>;
export const UpdateSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sessionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}},{"kind":"Field","name":{"kind":"Name","value":"current"}}]}}]}}]} as unknown as DocumentNode<UpdateSessionMutation, UpdateSessionMutationVariables>;
export const UpdateVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVerification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateVerification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<UpdateVerificationMutation, UpdateVerificationMutationVariables>;
export const ListDocumentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListDocuments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queries"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesListDocuments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"databaseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"collectionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"queries"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queries"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<ListDocumentsQuery, ListDocumentsQueryVariables>;
export const CreateDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesCreateDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"databaseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"collectionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"permissions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<CreateDocumentMutation, CreateDocumentMutationVariables>;
export const DeleteDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesDeleteDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"databaseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"collectionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DeleteDocumentMutation, DeleteDocumentMutationVariables>;
export const GetDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesGetDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"databaseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"collectionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<GetDocumentQuery, GetDocumentQueryVariables>;
export const UpdateDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesUpdateDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"databaseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"collectionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"permissions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"_collectionId"}},{"kind":"Field","name":{"kind":"Name","value":"_databaseId"}},{"kind":"Field","name":{"kind":"Name","value":"_createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"_updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"_permissions"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<UpdateDocumentMutation, UpdateDocumentMutationVariables>;
export const CreateExecutionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateExecution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"body"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"async"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"path"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"method"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"headers"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functionsCreateExecution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"functionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"body"}}},{"kind":"Argument","name":{"kind":"Name","value":"async"},"value":{"kind":"Variable","name":{"kind":"Name","value":"async"}}},{"kind":"Argument","name":{"kind":"Name","value":"path"},"value":{"kind":"Variable","name":{"kind":"Name","value":"path"}}},{"kind":"Argument","name":{"kind":"Name","value":"method"},"value":{"kind":"Variable","name":{"kind":"Name","value":"method"}}},{"kind":"Argument","name":{"kind":"Name","value":"headers"},"value":{"kind":"Variable","name":{"kind":"Name","value":"headers"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"responseStatusCode"}},{"kind":"Field","name":{"kind":"Name","value":"responseBody"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<CreateExecutionMutation, CreateExecutionMutationVariables>;
export const GetFunctionExecutionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFunctionExecution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functionsGetExecution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"functionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"executionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<GetFunctionExecutionQuery, GetFunctionExecutionQueryVariables>;