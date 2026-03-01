/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
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
  Assoc: { input: any; output: any; }
  InputFile: { input: any; output: any; }
  Json: { input: any; output: any; }
};

export type Continent = {
  __typename?: 'Continent';
  code?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type ContinentList = {
  __typename?: 'ContinentList';
  continents?: Maybe<Array<Maybe<Continent>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type Country = {
  __typename?: 'Country';
  code?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type CountryList = {
  __typename?: 'CountryList';
  countries?: Maybe<Array<Maybe<Country>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type Currency = {
  __typename?: 'Currency';
  code?: Maybe<Scalars['String']['output']>;
  decimalDigits?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  namePlural?: Maybe<Scalars['String']['output']>;
  rounding?: Maybe<Scalars['Float']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
  symbolNative?: Maybe<Scalars['String']['output']>;
};

export type CurrencyList = {
  __typename?: 'CurrencyList';
  currencies?: Maybe<Array<Maybe<Currency>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type Document = {
  __typename?: 'Document';
  _collectionId?: Maybe<Scalars['String']['output']>;
  _createdAt?: Maybe<Scalars['String']['output']>;
  _databaseId?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  _permissions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  _updatedAt?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Scalars['Json']['output']>;
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
  _permissions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  _updatedAt?: Maybe<Scalars['String']['output']>;
  deploymentId?: Maybe<Scalars['String']['output']>;
  duration?: Maybe<Scalars['Float']['output']>;
  errors?: Maybe<Scalars['String']['output']>;
  functionId?: Maybe<Scalars['String']['output']>;
  logs?: Maybe<Scalars['String']['output']>;
  requestHeaders?: Maybe<Array<Maybe<Headers>>>;
  requestMethod?: Maybe<Scalars['String']['output']>;
  requestPath?: Maybe<Scalars['String']['output']>;
  responseBody?: Maybe<Scalars['String']['output']>;
  responseHeaders?: Maybe<Array<Maybe<Headers>>>;
  responseStatusCode?: Maybe<Scalars['Int']['output']>;
  scheduledAt?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  trigger?: Maybe<Scalars['String']['output']>;
};

export type ExecutionList = {
  __typename?: 'ExecutionList';
  executions?: Maybe<Array<Maybe<Execution>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type File = {
  __typename?: 'File';
  _createdAt?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  _permissions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  _updatedAt?: Maybe<Scalars['String']['output']>;
  bucketId?: Maybe<Scalars['String']['output']>;
  chunksTotal?: Maybe<Scalars['Int']['output']>;
  chunksUploaded?: Maybe<Scalars['Int']['output']>;
  mimeType?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  signature?: Maybe<Scalars['String']['output']>;
  sizeOriginal?: Maybe<Scalars['Int']['output']>;
};

export type FileList = {
  __typename?: 'FileList';
  files?: Maybe<Array<Maybe<File>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type Headers = {
  __typename?: 'Headers';
  name?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
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
  identities?: Maybe<Array<Maybe<Identity>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type Jwt = {
  __typename?: 'Jwt';
  jwt?: Maybe<Scalars['String']['output']>;
};

export type Language = {
  __typename?: 'Language';
  code?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  nativeName?: Maybe<Scalars['String']['output']>;
};

export type LanguageList = {
  __typename?: 'LanguageList';
  languages?: Maybe<Array<Maybe<Language>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type Locale = {
  __typename?: 'Locale';
  continent?: Maybe<Scalars['String']['output']>;
  continentCode?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  countryCode?: Maybe<Scalars['String']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  eu?: Maybe<Scalars['Boolean']['output']>;
  ip?: Maybe<Scalars['String']['output']>;
};

export type LocaleCode = {
  __typename?: 'LocaleCode';
  code?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type LocaleCodeList = {
  __typename?: 'LocaleCodeList';
  localeCodes?: Maybe<Array<Maybe<LocaleCode>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type Log = {
  __typename?: 'Log';
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

export type LogList = {
  __typename?: 'LogList';
  logs?: Maybe<Array<Maybe<Log>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type Membership = {
  __typename?: 'Membership';
  _createdAt?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  _updatedAt?: Maybe<Scalars['String']['output']>;
  confirm?: Maybe<Scalars['Boolean']['output']>;
  invited?: Maybe<Scalars['String']['output']>;
  joined?: Maybe<Scalars['String']['output']>;
  mfa?: Maybe<Scalars['Boolean']['output']>;
  roles?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  teamId?: Maybe<Scalars['String']['output']>;
  teamName?: Maybe<Scalars['String']['output']>;
  userEmail?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
};

export type MembershipList = {
  __typename?: 'MembershipList';
  memberships?: Maybe<Array<Maybe<Membership>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type MfaChallenge = {
  __typename?: 'MfaChallenge';
  _createdAt?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  expire?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type MfaFactors = {
  __typename?: 'MfaFactors';
  email?: Maybe<Scalars['Boolean']['output']>;
  phone?: Maybe<Scalars['Boolean']['output']>;
  recoveryCode?: Maybe<Scalars['Boolean']['output']>;
  totp?: Maybe<Scalars['Boolean']['output']>;
};

export type MfaRecoveryCodes = {
  __typename?: 'MfaRecoveryCodes';
  recoveryCodes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type MfaType = {
  __typename?: 'MfaType';
  secret?: Maybe<Scalars['String']['output']>;
  uri?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  accountCreate?: Maybe<User>;
  accountCreateAnonymousSession?: Maybe<Session>;
  accountCreateEmailPasswordSession?: Maybe<Session>;
  accountCreateEmailToken?: Maybe<Token>;
  accountCreateEmailVerification?: Maybe<Token>;
  accountCreateJWT?: Maybe<Jwt>;
  accountCreateMagicURLToken?: Maybe<Token>;
  accountCreateMfaAuthenticator?: Maybe<MfaType>;
  accountCreateMfaChallenge?: Maybe<MfaChallenge>;
  accountCreateMfaRecoveryCodes?: Maybe<MfaRecoveryCodes>;
  accountCreatePhoneToken?: Maybe<Token>;
  accountCreatePhoneVerification?: Maybe<Token>;
  accountCreatePushTarget?: Maybe<Target>;
  accountCreateRecovery?: Maybe<Token>;
  accountCreateSession?: Maybe<Session>;
  accountCreateVerification?: Maybe<Token>;
  accountDeleteIdentity?: Maybe<None>;
  accountDeleteMfaAuthenticator?: Maybe<None>;
  accountDeletePushTarget?: Maybe<None>;
  accountDeleteSession?: Maybe<None>;
  accountDeleteSessions?: Maybe<None>;
  accountUpdateEmail?: Maybe<User>;
  accountUpdateEmailVerification?: Maybe<Token>;
  accountUpdateMFA?: Maybe<User>;
  accountUpdateMagicURLSession?: Maybe<Session>;
  accountUpdateMfaAuthenticator?: Maybe<User>;
  accountUpdateMfaChallenge?: Maybe<Session>;
  accountUpdateMfaRecoveryCodes?: Maybe<MfaRecoveryCodes>;
  accountUpdateName?: Maybe<User>;
  accountUpdatePassword?: Maybe<User>;
  accountUpdatePhone?: Maybe<User>;
  accountUpdatePhoneSession?: Maybe<Session>;
  accountUpdatePhoneVerification?: Maybe<Token>;
  accountUpdatePrefs?: Maybe<User>;
  accountUpdatePushTarget?: Maybe<Target>;
  accountUpdateRecovery?: Maybe<Token>;
  accountUpdateSession?: Maybe<Session>;
  accountUpdateStatus?: Maybe<User>;
  accountUpdateVerification?: Maybe<Token>;
  databasesCreateDocument?: Maybe<Document>;
  databasesCreateOperations?: Maybe<Transaction>;
  databasesCreateTransaction?: Maybe<Transaction>;
  databasesDecrementDocumentAttribute?: Maybe<Document>;
  databasesDeleteDocument?: Maybe<None>;
  databasesDeleteTransaction?: Maybe<None>;
  databasesIncrementDocumentAttribute?: Maybe<Document>;
  databasesUpdateDocument?: Maybe<Document>;
  databasesUpdateTransaction?: Maybe<Transaction>;
  databasesUpsertDocument?: Maybe<Document>;
  functionsCreateExecution?: Maybe<Execution>;
  messagingCreateSubscriber?: Maybe<Subscriber>;
  messagingDeleteSubscriber?: Maybe<None>;
  storageCreateFile?: Maybe<File>;
  storageDeleteFile?: Maybe<None>;
  storageUpdateFile?: Maybe<File>;
  teamsCreate?: Maybe<Team>;
  teamsCreateMembership?: Maybe<Membership>;
  teamsDelete?: Maybe<None>;
  teamsDeleteMembership?: Maybe<None>;
  teamsUpdateMembership?: Maybe<Membership>;
  teamsUpdateMembershipStatus?: Maybe<Membership>;
  teamsUpdateName?: Maybe<Team>;
  teamsUpdatePrefs?: Maybe<Preferences>;
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


export type MutationAccountCreateEmailVerificationArgs = {
  url: Scalars['String']['input'];
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


export type MutationAccountCreatePhoneTokenArgs = {
  phone: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationAccountCreatePushTargetArgs = {
  identifier: Scalars['String']['input'];
  providerId?: InputMaybe<Scalars['String']['input']>;
  targetId: Scalars['String']['input'];
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
  type: Scalars['String']['input'];
};


export type MutationAccountDeletePushTargetArgs = {
  targetId: Scalars['String']['input'];
};


export type MutationAccountDeleteSessionArgs = {
  sessionId: Scalars['String']['input'];
};


export type MutationAccountUpdateEmailArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationAccountUpdateEmailVerificationArgs = {
  secret: Scalars['String']['input'];
  userId: Scalars['String']['input'];
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
  oldPassword?: InputMaybe<Scalars['String']['input']>;
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
  prefs: Scalars['Assoc']['input'];
};


export type MutationAccountUpdatePushTargetArgs = {
  identifier: Scalars['String']['input'];
  targetId: Scalars['String']['input'];
};


export type MutationAccountUpdateRecoveryArgs = {
  password: Scalars['String']['input'];
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
  data: Scalars['Json']['input'];
  databaseId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
  permissions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDatabasesCreateOperationsArgs = {
  operations?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId: Scalars['String']['input'];
};


export type MutationDatabasesCreateTransactionArgs = {
  ttl?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDatabasesDecrementDocumentAttributeArgs = {
  attribute: Scalars['String']['input'];
  collectionId: Scalars['String']['input'];
  databaseId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
  min?: InputMaybe<Scalars['Int']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDatabasesDeleteDocumentArgs = {
  collectionId: Scalars['String']['input'];
  databaseId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
  transactionId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDatabasesDeleteTransactionArgs = {
  transactionId: Scalars['String']['input'];
};


export type MutationDatabasesIncrementDocumentAttributeArgs = {
  attribute: Scalars['String']['input'];
  collectionId: Scalars['String']['input'];
  databaseId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
  max?: InputMaybe<Scalars['Int']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDatabasesUpdateDocumentArgs = {
  collectionId: Scalars['String']['input'];
  data?: InputMaybe<Scalars['Json']['input']>;
  databaseId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
  permissions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDatabasesUpdateTransactionArgs = {
  commit?: InputMaybe<Scalars['Boolean']['input']>;
  rollback?: InputMaybe<Scalars['Boolean']['input']>;
  transactionId: Scalars['String']['input'];
};


export type MutationDatabasesUpsertDocumentArgs = {
  collectionId: Scalars['String']['input'];
  data: Scalars['Json']['input'];
  databaseId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
  permissions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationFunctionsCreateExecutionArgs = {
  async?: InputMaybe<Scalars['Boolean']['input']>;
  body?: InputMaybe<Scalars['String']['input']>;
  functionId: Scalars['String']['input'];
  headers?: InputMaybe<Scalars['String']['input']>;
  method?: InputMaybe<Scalars['String']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  scheduledAt?: InputMaybe<Scalars['String']['input']>;
};


export type MutationMessagingCreateSubscriberArgs = {
  subscriberId: Scalars['String']['input'];
  targetId: Scalars['String']['input'];
  topicId: Scalars['String']['input'];
};


export type MutationMessagingDeleteSubscriberArgs = {
  subscriberId: Scalars['String']['input'];
  topicId: Scalars['String']['input'];
};


export type MutationStorageCreateFileArgs = {
  bucketId: Scalars['String']['input'];
  file: Scalars['InputFile']['input'];
  fileId: Scalars['String']['input'];
  permissions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type MutationStorageDeleteFileArgs = {
  bucketId: Scalars['String']['input'];
  fileId: Scalars['String']['input'];
};


export type MutationStorageUpdateFileArgs = {
  bucketId: Scalars['String']['input'];
  fileId: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type MutationTeamsCreateArgs = {
  name: Scalars['String']['input'];
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  teamId: Scalars['String']['input'];
};


export type MutationTeamsCreateMembershipArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  roles: Array<Scalars['String']['input']>;
  teamId: Scalars['String']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationTeamsDeleteArgs = {
  teamId: Scalars['String']['input'];
};


export type MutationTeamsDeleteMembershipArgs = {
  membershipId: Scalars['String']['input'];
  teamId: Scalars['String']['input'];
};


export type MutationTeamsUpdateMembershipArgs = {
  membershipId: Scalars['String']['input'];
  roles: Array<Scalars['String']['input']>;
  teamId: Scalars['String']['input'];
};


export type MutationTeamsUpdateMembershipStatusArgs = {
  membershipId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
  teamId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationTeamsUpdateNameArgs = {
  name: Scalars['String']['input'];
  teamId: Scalars['String']['input'];
};


export type MutationTeamsUpdatePrefsArgs = {
  prefs: Scalars['Assoc']['input'];
  teamId: Scalars['String']['input'];
};

export type None = {
  __typename?: 'None';
  status?: Maybe<Scalars['String']['output']>;
};

export type Phone = {
  __typename?: 'Phone';
  code?: Maybe<Scalars['String']['output']>;
  countryCode?: Maybe<Scalars['String']['output']>;
  countryName?: Maybe<Scalars['String']['output']>;
};

export type PhoneList = {
  __typename?: 'PhoneList';
  phones?: Maybe<Array<Maybe<Phone>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type Preferences = {
  __typename?: 'Preferences';
  data?: Maybe<Scalars['Json']['output']>;
};

export type Query = {
  __typename?: 'Query';
  accountGet?: Maybe<User>;
  accountGetMfaRecoveryCodes?: Maybe<MfaRecoveryCodes>;
  accountGetPrefs?: Maybe<Preferences>;
  accountGetSession?: Maybe<Session>;
  accountListIdentities?: Maybe<IdentityList>;
  accountListLogs?: Maybe<LogList>;
  accountListMfaFactors?: Maybe<MfaFactors>;
  accountListSessions?: Maybe<SessionList>;
  databasesGetDocument?: Maybe<Document>;
  databasesGetTransaction?: Maybe<Transaction>;
  databasesListDocuments?: Maybe<DocumentList>;
  databasesListTransactions?: Maybe<TransactionList>;
  functionsGetExecution?: Maybe<Execution>;
  functionsListExecutions?: Maybe<ExecutionList>;
  localeGet?: Maybe<Locale>;
  localeListCodes?: Maybe<LocaleCodeList>;
  localeListContinents?: Maybe<ContinentList>;
  localeListCountries?: Maybe<CountryList>;
  localeListCountriesEU?: Maybe<CountryList>;
  localeListCountriesPhones?: Maybe<PhoneList>;
  localeListCurrencies?: Maybe<CurrencyList>;
  localeListLanguages?: Maybe<LanguageList>;
  storageGetFile?: Maybe<File>;
  storageGetFileDownload?: Maybe<None>;
  storageGetFilePreview?: Maybe<None>;
  storageGetFileView?: Maybe<None>;
  storageListFiles?: Maybe<FileList>;
  teamsGet?: Maybe<Team>;
  teamsGetMembership?: Maybe<Membership>;
  teamsGetPrefs?: Maybe<Preferences>;
  teamsList?: Maybe<TeamList>;
  teamsListMemberships?: Maybe<MembershipList>;
};


export type QueryAccountGetSessionArgs = {
  sessionId: Scalars['String']['input'];
};


export type QueryAccountListIdentitiesArgs = {
  queries?: InputMaybe<Scalars['String']['input']>;
  total?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAccountListLogsArgs = {
  queries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  total?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryDatabasesGetDocumentArgs = {
  collectionId: Scalars['String']['input'];
  databaseId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
  queries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDatabasesGetTransactionArgs = {
  transactionId: Scalars['String']['input'];
};


export type QueryDatabasesListDocumentsArgs = {
  collectionId: Scalars['String']['input'];
  databaseId: Scalars['String']['input'];
  queries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  total?: InputMaybe<Scalars['Boolean']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDatabasesListTransactionsArgs = {
  queries?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFunctionsGetExecutionArgs = {
  executionId: Scalars['String']['input'];
  functionId: Scalars['String']['input'];
};


export type QueryFunctionsListExecutionsArgs = {
  functionId: Scalars['String']['input'];
  queries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  total?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryStorageGetFileArgs = {
  bucketId: Scalars['String']['input'];
  fileId: Scalars['String']['input'];
};


export type QueryStorageGetFileDownloadArgs = {
  bucketId: Scalars['String']['input'];
  fileId: Scalars['String']['input'];
  token?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStorageGetFilePreviewArgs = {
  background?: InputMaybe<Scalars['String']['input']>;
  borderColor?: InputMaybe<Scalars['String']['input']>;
  borderRadius?: InputMaybe<Scalars['Int']['input']>;
  borderWidth?: InputMaybe<Scalars['Int']['input']>;
  bucketId: Scalars['String']['input'];
  fileId: Scalars['String']['input'];
  gravity?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  opacity?: InputMaybe<Scalars['Float']['input']>;
  output?: InputMaybe<Scalars['String']['input']>;
  quality?: InputMaybe<Scalars['Int']['input']>;
  rotation?: InputMaybe<Scalars['Int']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStorageGetFileViewArgs = {
  bucketId: Scalars['String']['input'];
  fileId: Scalars['String']['input'];
  token?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStorageListFilesArgs = {
  bucketId: Scalars['String']['input'];
  queries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  search?: InputMaybe<Scalars['String']['input']>;
  total?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryTeamsGetArgs = {
  teamId: Scalars['String']['input'];
};


export type QueryTeamsGetMembershipArgs = {
  membershipId: Scalars['String']['input'];
  teamId: Scalars['String']['input'];
};


export type QueryTeamsGetPrefsArgs = {
  teamId: Scalars['String']['input'];
};


export type QueryTeamsListArgs = {
  queries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  search?: InputMaybe<Scalars['String']['input']>;
  total?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryTeamsListMembershipsArgs = {
  queries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  search?: InputMaybe<Scalars['String']['input']>;
  teamId: Scalars['String']['input'];
  total?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Session = {
  __typename?: 'Session';
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
  current?: Maybe<Scalars['Boolean']['output']>;
  deviceBrand?: Maybe<Scalars['String']['output']>;
  deviceModel?: Maybe<Scalars['String']['output']>;
  deviceName?: Maybe<Scalars['String']['output']>;
  expire?: Maybe<Scalars['String']['output']>;
  factors?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  ip?: Maybe<Scalars['String']['output']>;
  mfaUpdatedAt?: Maybe<Scalars['String']['output']>;
  osCode?: Maybe<Scalars['String']['output']>;
  osName?: Maybe<Scalars['String']['output']>;
  osVersion?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  providerAccessToken?: Maybe<Scalars['String']['output']>;
  providerAccessTokenExpiry?: Maybe<Scalars['String']['output']>;
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

export type Subscriber = {
  __typename?: 'Subscriber';
  _createdAt?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  _updatedAt?: Maybe<Scalars['String']['output']>;
  providerType?: Maybe<Scalars['String']['output']>;
  target?: Maybe<Target>;
  targetId?: Maybe<Scalars['String']['output']>;
  topicId?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
};

export type Target = {
  __typename?: 'Target';
  _createdAt?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  _updatedAt?: Maybe<Scalars['String']['output']>;
  expired?: Maybe<Scalars['Boolean']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  providerId?: Maybe<Scalars['String']['output']>;
  providerType?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type Team = {
  __typename?: 'Team';
  _createdAt?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  _updatedAt?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  prefs?: Maybe<Preferences>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type TeamList = {
  __typename?: 'TeamList';
  teams?: Maybe<Array<Maybe<Team>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type Token = {
  __typename?: 'Token';
  _createdAt?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  expire?: Maybe<Scalars['String']['output']>;
  phrase?: Maybe<Scalars['String']['output']>;
  secret?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type Transaction = {
  __typename?: 'Transaction';
  _createdAt?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  _updatedAt?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['String']['output']>;
  operations?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type TransactionList = {
  __typename?: 'TransactionList';
  total?: Maybe<Scalars['Int']['output']>;
  transactions?: Maybe<Array<Maybe<Transaction>>>;
};

export type User = {
  __typename?: 'User';
  _createdAt?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  _updatedAt?: Maybe<Scalars['String']['output']>;
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
  status?: Maybe<Scalars['Boolean']['output']>;
  targets?: Maybe<Array<Maybe<Target>>>;
};

export type Account_UserFragment = { __typename?: 'User', _id?: string | null, name?: string | null, email?: string | null, prefs?: { __typename?: 'Preferences', data?: any | null } | null } & { ' $fragmentName'?: 'Account_UserFragment' };

export type Identity_ProviderFragment = { __typename?: 'Identity', _id?: string | null, userId?: string | null, provider?: string | null } & { ' $fragmentName'?: 'Identity_ProviderFragment' };

export type AccountGetQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountGetQuery = { __typename?: 'Query', accountGet?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'Account_UserFragment': Account_UserFragment } }
  ) | null };

export type CreateAnonymousSessionMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateAnonymousSessionMutation = { __typename?: 'Mutation', accountCreateAnonymousSession?: { __typename?: 'Session', _id?: string | null, expire?: string | null, current?: boolean | null } | null };

export type CreateEmailTokenMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  email: Scalars['String']['input'];
  phrase?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type CreateEmailTokenMutation = { __typename?: 'Mutation', accountCreateEmailToken?: { __typename?: 'Token', expire?: string | null } | null };

export type CreateEmailVerificationMutationVariables = Exact<{
  url: Scalars['String']['input'];
}>;


export type CreateEmailVerificationMutation = { __typename?: 'Mutation', accountCreateEmailVerification?: { __typename?: 'Token', _id?: string | null, userId?: string | null, secret?: string | null, expire?: string | null } | null };

export type CreateJwtMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateJwtMutation = { __typename?: 'Mutation', accountCreateJWT?: { __typename?: 'Jwt', jwt?: string | null } | null };

export type CreateMagicUrlTokenMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  email: Scalars['String']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
  phrase?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type CreateMagicUrlTokenMutation = { __typename?: 'Mutation', accountCreateMagicURLToken?: { __typename?: 'Token', expire?: string | null } | null };

export type CreateMfaAuthenticatorMutationVariables = Exact<{
  type: Scalars['String']['input'];
}>;


export type CreateMfaAuthenticatorMutation = { __typename?: 'Mutation', accountCreateMfaAuthenticator?: { __typename?: 'MfaType', secret?: string | null, uri?: string | null } | null };

export type CreateMfaChallengeMutationVariables = Exact<{
  factor: Scalars['String']['input'];
}>;


export type CreateMfaChallengeMutation = { __typename?: 'Mutation', accountCreateMfaChallenge?: { __typename?: 'MfaChallenge', _id?: string | null, userId?: string | null, expire?: string | null } | null };

export type CreateMfaRecoveryCodesMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateMfaRecoveryCodesMutation = { __typename?: 'Mutation', accountCreateMfaRecoveryCodes?: { __typename?: 'MfaRecoveryCodes', recoveryCodes?: Array<string | null> | null } | null };

export type CreatePhoneTokenMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  phone: Scalars['String']['input'];
}>;


export type CreatePhoneTokenMutation = { __typename?: 'Mutation', accountCreatePhoneToken?: { __typename?: 'Token', expire?: string | null } | null };

export type CreatePhoneVerificationMutationVariables = Exact<{ [key: string]: never; }>;


export type CreatePhoneVerificationMutation = { __typename?: 'Mutation', accountCreatePhoneVerification?: { __typename?: 'Token', expire?: string | null } | null };

export type CreatePushTargetMutationVariables = Exact<{
  targetId: Scalars['String']['input'];
  identifier: Scalars['String']['input'];
  providerId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreatePushTargetMutation = { __typename?: 'Mutation', accountCreatePushTarget?: { __typename?: 'Target', _id?: string | null, userId?: string | null, providerType?: string | null, identifier?: string | null } | null };

export type CreateSessionMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
}>;


export type CreateSessionMutation = { __typename?: 'Mutation', accountCreateSession?: { __typename?: 'Session', userId?: string | null, expire?: string | null, current?: boolean | null } | null };

export type DeleteIdentityMutationVariables = Exact<{
  identityId: Scalars['String']['input'];
}>;


export type DeleteIdentityMutation = { __typename?: 'Mutation', accountDeleteIdentity?: { __typename?: 'None', status?: string | null } | null };

export type DeleteMfaAuthenticatorMutationVariables = Exact<{
  type: Scalars['String']['input'];
}>;


export type DeleteMfaAuthenticatorMutation = { __typename?: 'Mutation', accountDeleteMfaAuthenticator?: { __typename?: 'None', status?: string | null } | null };

export type DeletePushTargetMutationVariables = Exact<{
  targetId: Scalars['String']['input'];
}>;


export type DeletePushTargetMutation = { __typename?: 'Mutation', accountDeletePushTarget?: { __typename?: 'None', status?: string | null } | null };

export type DeleteSessionMutationVariables = Exact<{
  sessionId: Scalars['String']['input'];
}>;


export type DeleteSessionMutation = { __typename?: 'Mutation', accountDeleteSession?: { __typename?: 'None', status?: string | null } | null };

export type DeleteSessionsMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteSessionsMutation = { __typename?: 'Mutation', accountDeleteSessions?: { __typename?: 'None', status?: string | null } | null };

export type GetMfaRecoveryCodesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMfaRecoveryCodesQuery = { __typename?: 'Query', accountGetMfaRecoveryCodes?: { __typename?: 'MfaRecoveryCodes', recoveryCodes?: Array<string | null> | null } | null };

export type GetPrefsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPrefsQuery = { __typename?: 'Query', accountGetPrefs?: { __typename?: 'Preferences', data?: any | null } | null };

export type GetSessionQueryVariables = Exact<{
  sessionId: Scalars['String']['input'];
}>;


export type GetSessionQuery = { __typename?: 'Query', accountGetSession?: { __typename?: 'Session', userId?: string | null, expire?: string | null, current?: boolean | null } | null };

export type ListIdentitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListIdentitiesQuery = { __typename?: 'Query', accountListIdentities?: { __typename?: 'IdentityList', total?: number | null, identities?: Array<(
      { __typename?: 'Identity' }
      & { ' $fragmentRefs'?: { 'Identity_ProviderFragment': Identity_ProviderFragment } }
    ) | null> | null } | null };

export type ListMfaFactorsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListMfaFactorsQuery = { __typename?: 'Query', accountListMfaFactors?: { __typename?: 'MfaFactors', totp?: boolean | null, phone?: boolean | null, email?: boolean | null } | null };

export type ListSessionsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListSessionsQuery = { __typename?: 'Query', accountListSessions?: { __typename?: 'SessionList', sessions?: Array<{ __typename?: 'Session', _id?: string | null, _createdAt?: string | null, osName?: string | null, clientName?: string | null } | null> | null } | null };

export type CreateEmailPasswordSessionMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type CreateEmailPasswordSessionMutation = { __typename?: 'Mutation', accountCreateEmailPasswordSession?: { __typename?: 'Session', userId?: string | null, expire?: string | null, current?: boolean | null } | null };

export type ListLogsQueryVariables = Exact<{
  queries?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type ListLogsQuery = { __typename?: 'Query', accountListLogs?: { __typename?: 'LogList', total?: number | null, logs?: Array<{ __typename?: 'Log', event?: string | null, userId?: string | null, userEmail?: string | null, userName?: string | null, mode?: string | null, ip?: string | null, time?: string | null, osCode?: string | null, osName?: string | null, osVersion?: string | null, clientType?: string | null, clientCode?: string | null, clientName?: string | null, clientVersion?: string | null, clientEngine?: string | null, clientEngineVersion?: string | null, deviceName?: string | null, deviceBrand?: string | null, deviceModel?: string | null, countryCode?: string | null, countryName?: string | null } | null> | null } | null };

export type CreateRecoveryMutationVariables = Exact<{
  email: Scalars['String']['input'];
  url: Scalars['String']['input'];
}>;


export type CreateRecoveryMutation = { __typename?: 'Mutation', accountCreateRecovery?: { __typename?: 'Token', expire?: string | null } | null };

export type UpdateRecoveryMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type UpdateRecoveryMutation = { __typename?: 'Mutation', accountUpdateRecovery?: { __typename?: 'Token', expire?: string | null } | null };

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


export type VerifyEmailMutation = { __typename?: 'Mutation', accountCreateVerification?: { __typename?: 'Token', expire?: string | null } | null };

export type UpdateEmailMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type UpdateEmailMutation = { __typename?: 'Mutation', accountUpdateEmail?: { __typename?: 'User', name?: string | null, email?: string | null } | null };

export type UpdateEmailVerificationMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
}>;


export type UpdateEmailVerificationMutation = { __typename?: 'Mutation', accountUpdateEmailVerification?: { __typename?: 'Token', _id?: string | null, userId?: string | null, secret?: string | null, expire?: string | null } | null };

export type UpdateMagicUrlSessionMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
}>;


export type UpdateMagicUrlSessionMutation = { __typename?: 'Mutation', accountUpdateMagicURLSession?: { __typename?: 'Session', userId?: string | null, expire?: string | null, current?: boolean | null } | null };

export type UpdateMfaMutationVariables = Exact<{
  mfa: Scalars['Boolean']['input'];
}>;


export type UpdateMfaMutation = { __typename?: 'Mutation', accountUpdateMFA?: { __typename?: 'User', mfa?: boolean | null } | null };

export type UpdateMfaAuthenticatorMutationVariables = Exact<{
  type: Scalars['String']['input'];
  otp: Scalars['String']['input'];
}>;


export type UpdateMfaAuthenticatorMutation = { __typename?: 'Mutation', accountUpdateMfaAuthenticator?: { __typename?: 'User', mfa?: boolean | null } | null };

export type UpdateMfaChallengeMutationVariables = Exact<{
  challengeId: Scalars['String']['input'];
  otp: Scalars['String']['input'];
}>;


export type UpdateMfaChallengeMutation = { __typename?: 'Mutation', accountUpdateMfaChallenge?: { __typename?: 'Session', _id?: string | null, userId?: string | null, expire?: string | null, current?: boolean | null } | null };

export type UpdateMfaRecoveryCodesMutationVariables = Exact<{ [key: string]: never; }>;


export type UpdateMfaRecoveryCodesMutation = { __typename?: 'Mutation', accountUpdateMfaRecoveryCodes?: { __typename?: 'MfaRecoveryCodes', recoveryCodes?: Array<string | null> | null } | null };

export type UpdateNameMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type UpdateNameMutation = { __typename?: 'Mutation', accountUpdateName?: { __typename?: 'User', name?: string | null } | null };

export type UpdatePasswordMutationVariables = Exact<{
  password: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
}>;


export type UpdatePasswordMutation = { __typename?: 'Mutation', accountUpdatePassword?: { __typename?: 'User', status?: boolean | null } | null };

export type UpdatePhoneMutationVariables = Exact<{
  phone: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type UpdatePhoneMutation = { __typename?: 'Mutation', accountUpdatePhone?: { __typename?: 'User', phone?: string | null } | null };

export type UpdatePhoneSessionMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
}>;


export type UpdatePhoneSessionMutation = { __typename?: 'Mutation', accountUpdatePhoneSession?: { __typename?: 'Session', userId?: string | null, expire?: string | null, current?: boolean | null } | null };

export type UpdatePhoneVerificationMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
}>;


export type UpdatePhoneVerificationMutation = { __typename?: 'Mutation', accountUpdatePhoneVerification?: { __typename?: 'Token', expire?: string | null } | null };

export type UpdatePrefsMutationVariables = Exact<{
  prefs: Scalars['Assoc']['input'];
}>;


export type UpdatePrefsMutation = { __typename?: 'Mutation', accountUpdatePrefs?: { __typename?: 'User', prefs?: { __typename?: 'Preferences', data?: any | null } | null } | null };

export type UpdatePushTargetMutationVariables = Exact<{
  targetId: Scalars['String']['input'];
  identifier: Scalars['String']['input'];
}>;


export type UpdatePushTargetMutation = { __typename?: 'Mutation', accountUpdatePushTarget?: { __typename?: 'Target', _id?: string | null, userId?: string | null, providerType?: string | null, identifier?: string | null } | null };

export type UpdateSessionMutationVariables = Exact<{
  sessionId: Scalars['String']['input'];
}>;


export type UpdateSessionMutation = { __typename?: 'Mutation', accountUpdateSession?: { __typename?: 'Session', userId?: string | null, expire?: string | null, current?: boolean | null } | null };

export type UpdateStatusMutationVariables = Exact<{ [key: string]: never; }>;


export type UpdateStatusMutation = { __typename?: 'Mutation', accountUpdateStatus?: { __typename?: 'User', _id?: string | null, status?: boolean | null } | null };

export type UpdateVerificationMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
}>;


export type UpdateVerificationMutation = { __typename?: 'Mutation', accountUpdateVerification?: { __typename?: 'Token', secret?: string | null, expire?: string | null, userId?: string | null } | null };

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
  data: Scalars['Json']['input'];
  permissions?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type CreateDocumentMutation = { __typename?: 'Mutation', databasesCreateDocument?: { __typename?: 'Document', _id?: string | null } | null };

export type CreateOperationsMutationVariables = Exact<{
  transactionId: Scalars['String']['input'];
  operations?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type CreateOperationsMutation = { __typename?: 'Mutation', databasesCreateOperations?: { __typename?: 'Transaction', _id?: string | null, status?: string | null, operations?: number | null, expiresAt?: string | null } | null };

export type CreateTransactionMutationVariables = Exact<{
  ttl?: InputMaybe<Scalars['Int']['input']>;
}>;


export type CreateTransactionMutation = { __typename?: 'Mutation', databasesCreateTransaction?: { __typename?: 'Transaction', _id?: string | null, status?: string | null, operations?: number | null, expiresAt?: string | null } | null };

export type DecrementDocumentAttributeMutationVariables = Exact<{
  databaseId: Scalars['String']['input'];
  collectionId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
  attribute: Scalars['String']['input'];
  value?: InputMaybe<Scalars['Int']['input']>;
  min?: InputMaybe<Scalars['Int']['input']>;
}>;


export type DecrementDocumentAttributeMutation = { __typename?: 'Mutation', databasesDecrementDocumentAttribute?: { __typename?: 'Document', _id?: string | null, data?: any | null } | null };

export type DeleteDocumentMutationVariables = Exact<{
  databaseId: Scalars['String']['input'];
  collectionId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
}>;


export type DeleteDocumentMutation = { __typename?: 'Mutation', databasesDeleteDocument?: { __typename?: 'None', status?: string | null } | null };

export type DeleteTransactionMutationVariables = Exact<{
  transactionId: Scalars['String']['input'];
}>;


export type DeleteTransactionMutation = { __typename?: 'Mutation', databasesDeleteTransaction?: { __typename?: 'None', status?: string | null } | null };

export type GetDocumentQueryVariables = Exact<{
  databaseId: Scalars['String']['input'];
  collectionId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
}>;


export type GetDocumentQuery = { __typename?: 'Query', databasesGetDocument?: { __typename?: 'Document', _id?: string | null, data?: any | null } | null };

export type GetTransactionQueryVariables = Exact<{
  transactionId: Scalars['String']['input'];
}>;


export type GetTransactionQuery = { __typename?: 'Query', databasesGetTransaction?: { __typename?: 'Transaction', _id?: string | null, _createdAt?: string | null, _updatedAt?: string | null, status?: string | null, operations?: number | null, expiresAt?: string | null } | null };

export type IncrementDocumentAttributeMutationVariables = Exact<{
  databaseId: Scalars['String']['input'];
  collectionId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
  attribute: Scalars['String']['input'];
  value?: InputMaybe<Scalars['Int']['input']>;
  max?: InputMaybe<Scalars['Int']['input']>;
}>;


export type IncrementDocumentAttributeMutation = { __typename?: 'Mutation', databasesIncrementDocumentAttribute?: { __typename?: 'Document', _id?: string | null, data?: any | null } | null };

export type ListTransactionsQueryVariables = Exact<{
  queries?: InputMaybe<Scalars['String']['input']>;
}>;


export type ListTransactionsQuery = { __typename?: 'Query', databasesListTransactions?: { __typename?: 'TransactionList', total?: number | null, transactions?: Array<{ __typename?: 'Transaction', _id?: string | null, _createdAt?: string | null, _updatedAt?: string | null, status?: string | null, operations?: number | null, expiresAt?: string | null } | null> | null } | null };

export type UpdateDocumentMutationVariables = Exact<{
  databaseId: Scalars['String']['input'];
  collectionId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
  data?: InputMaybe<Scalars['Json']['input']>;
  permissions?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type UpdateDocumentMutation = { __typename?: 'Mutation', databasesUpdateDocument?: { __typename?: 'Document', _id?: string | null } | null };

export type UpdateTransactionMutationVariables = Exact<{
  transactionId: Scalars['String']['input'];
  commit?: InputMaybe<Scalars['Boolean']['input']>;
  rollback?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateTransactionMutation = { __typename?: 'Mutation', databasesUpdateTransaction?: { __typename?: 'Transaction', _id?: string | null, status?: string | null, operations?: number | null } | null };

export type UpsertDocumentMutationVariables = Exact<{
  databaseId: Scalars['String']['input'];
  collectionId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
  data: Scalars['Json']['input'];
  permissions?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type UpsertDocumentMutation = { __typename?: 'Mutation', databasesUpsertDocument?: { __typename?: 'Document', _id?: string | null } | null };

export type CreateExecutionMutationVariables = Exact<{
  functionId: Scalars['String']['input'];
  body?: InputMaybe<Scalars['String']['input']>;
  async?: InputMaybe<Scalars['Boolean']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  method?: InputMaybe<Scalars['String']['input']>;
  headers?: InputMaybe<Scalars['String']['input']>;
  scheduledAt?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateExecutionMutation = { __typename?: 'Mutation', functionsCreateExecution?: { __typename?: 'Execution', _id?: string | null, status?: string | null, responseStatusCode?: number | null, responseBody?: string | null, errors?: string | null, duration?: number | null } | null };

export type GetFunctionExecutionQueryVariables = Exact<{
  functionId: Scalars['String']['input'];
  executionId: Scalars['String']['input'];
}>;


export type GetFunctionExecutionQuery = { __typename?: 'Query', functionsGetExecution?: { __typename?: 'Execution', status?: string | null, errors?: string | null, duration?: number | null, responseBody?: string | null, requestPath?: string | null } | null };

export type GetExecutionQueryVariables = Exact<{
  functionId: Scalars['String']['input'];
  executionId: Scalars['String']['input'];
}>;


export type GetExecutionQuery = { __typename?: 'Query', functionsGetExecution?: { __typename?: 'Execution', _id?: string | null, _createdAt?: string | null, _updatedAt?: string | null, functionId?: string | null, trigger?: string | null, status?: string | null, requestMethod?: string | null, requestPath?: string | null, responseStatusCode?: number | null, responseBody?: string | null, errors?: string | null, duration?: number | null } | null };

export type ListExecutionsQueryVariables = Exact<{
  functionId: Scalars['String']['input'];
  queries?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type ListExecutionsQuery = { __typename?: 'Query', functionsListExecutions?: { __typename?: 'ExecutionList', total?: number | null, executions?: Array<{ __typename?: 'Execution', _id?: string | null, _createdAt?: string | null, _updatedAt?: string | null, functionId?: string | null, trigger?: string | null, status?: string | null, requestMethod?: string | null, requestPath?: string | null, responseStatusCode?: number | null, responseBody?: string | null, errors?: string | null, duration?: number | null } | null> | null } | null };

export type GetLocaleQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLocaleQuery = { __typename?: 'Query', localeGet?: { __typename?: 'Locale', ip?: string | null, countryCode?: string | null, country?: string | null, continentCode?: string | null, continent?: string | null, eu?: boolean | null, currency?: string | null } | null };

export type ListLocaleCodesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListLocaleCodesQuery = { __typename?: 'Query', localeListCodes?: { __typename?: 'LocaleCodeList', total?: number | null, localeCodes?: Array<{ __typename?: 'LocaleCode', code?: string | null, name?: string | null } | null> | null } | null };

export type ListContinentsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListContinentsQuery = { __typename?: 'Query', localeListContinents?: { __typename?: 'ContinentList', total?: number | null, continents?: Array<{ __typename?: 'Continent', name?: string | null, code?: string | null } | null> | null } | null };

export type ListCountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListCountriesQuery = { __typename?: 'Query', localeListCountries?: { __typename?: 'CountryList', total?: number | null, countries?: Array<{ __typename?: 'Country', name?: string | null, code?: string | null } | null> | null } | null };

export type ListCountriesEuQueryVariables = Exact<{ [key: string]: never; }>;


export type ListCountriesEuQuery = { __typename?: 'Query', localeListCountriesEU?: { __typename?: 'CountryList', total?: number | null, countries?: Array<{ __typename?: 'Country', name?: string | null, code?: string | null } | null> | null } | null };

export type ListCountriesPhonesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListCountriesPhonesQuery = { __typename?: 'Query', localeListCountriesPhones?: { __typename?: 'PhoneList', total?: number | null, phones?: Array<{ __typename?: 'Phone', code?: string | null, countryCode?: string | null, countryName?: string | null } | null> | null } | null };

export type ListCurrenciesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListCurrenciesQuery = { __typename?: 'Query', localeListCurrencies?: { __typename?: 'CurrencyList', total?: number | null, currencies?: Array<{ __typename?: 'Currency', symbol?: string | null, name?: string | null, symbolNative?: string | null, decimalDigits?: number | null, rounding?: number | null, code?: string | null, namePlural?: string | null } | null> | null } | null };

export type ListLanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListLanguagesQuery = { __typename?: 'Query', localeListLanguages?: { __typename?: 'LanguageList', total?: number | null, languages?: Array<{ __typename?: 'Language', name?: string | null, code?: string | null, nativeName?: string | null } | null> | null } | null };

export type CreateSubscriberMutationVariables = Exact<{
  subscriberId: Scalars['String']['input'];
  topicId: Scalars['String']['input'];
  targetId: Scalars['String']['input'];
}>;


export type CreateSubscriberMutation = { __typename?: 'Mutation', messagingCreateSubscriber?: { __typename?: 'Subscriber', _id?: string | null, _createdAt?: string | null, _updatedAt?: string | null, targetId?: string | null, userId?: string | null, userName?: string | null, topicId?: string | null, providerType?: string | null } | null };

export type DeleteSubscriberMutationVariables = Exact<{
  topicId: Scalars['String']['input'];
  subscriberId: Scalars['String']['input'];
}>;


export type DeleteSubscriberMutation = { __typename?: 'Mutation', messagingDeleteSubscriber?: { __typename?: 'None', status?: string | null } | null };

export type DeleteFileMutationVariables = Exact<{
  bucketId: Scalars['String']['input'];
  fileId: Scalars['String']['input'];
}>;


export type DeleteFileMutation = { __typename?: 'Mutation', storageDeleteFile?: { __typename?: 'None', status?: string | null } | null };

export type GetFileQueryVariables = Exact<{
  bucketId: Scalars['String']['input'];
  fileId: Scalars['String']['input'];
}>;


export type GetFileQuery = { __typename?: 'Query', storageGetFile?: { __typename?: 'File', _id?: string | null, bucketId?: string | null, _createdAt?: string | null, _updatedAt?: string | null, _permissions?: Array<string | null> | null, name?: string | null, signature?: string | null, mimeType?: string | null, sizeOriginal?: number | null, chunksTotal?: number | null, chunksUploaded?: number | null } | null };

export type ListFilesQueryVariables = Exact<{
  bucketId: Scalars['String']['input'];
  queries?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type ListFilesQuery = { __typename?: 'Query', storageListFiles?: { __typename?: 'FileList', total?: number | null, files?: Array<{ __typename?: 'File', _id?: string | null, bucketId?: string | null, _createdAt?: string | null, _updatedAt?: string | null, _permissions?: Array<string | null> | null, name?: string | null, signature?: string | null, mimeType?: string | null, sizeOriginal?: number | null, chunksTotal?: number | null, chunksUploaded?: number | null } | null> | null } | null };

export type UpdateFileMutationVariables = Exact<{
  bucketId: Scalars['String']['input'];
  fileId: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type UpdateFileMutation = { __typename?: 'Mutation', storageUpdateFile?: { __typename?: 'File', _id?: string | null, bucketId?: string | null, name?: string | null, _permissions?: Array<string | null> | null } | null };

export type CreateMembershipMutationVariables = Exact<{
  teamId: Scalars['String']['input'];
  roles: Array<Scalars['String']['input']> | Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateMembershipMutation = { __typename?: 'Mutation', teamsCreateMembership?: { __typename?: 'Membership', _id?: string | null, userId?: string | null, teamId?: string | null, roles?: Array<string | null> | null, confirm?: boolean | null } | null };

export type CreateTeamMutationVariables = Exact<{
  teamId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  roles?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type CreateTeamMutation = { __typename?: 'Mutation', teamsCreate?: { __typename?: 'Team', _id?: string | null, name?: string | null, total?: number | null } | null };

export type DeleteMembershipMutationVariables = Exact<{
  teamId: Scalars['String']['input'];
  membershipId: Scalars['String']['input'];
}>;


export type DeleteMembershipMutation = { __typename?: 'Mutation', teamsDeleteMembership?: { __typename?: 'None', status?: string | null } | null };

export type DeleteTeamMutationVariables = Exact<{
  teamId: Scalars['String']['input'];
}>;


export type DeleteTeamMutation = { __typename?: 'Mutation', teamsDelete?: { __typename?: 'None', status?: string | null } | null };

export type GetTeamQueryVariables = Exact<{
  teamId: Scalars['String']['input'];
}>;


export type GetTeamQuery = { __typename?: 'Query', teamsGet?: { __typename?: 'Team', _id?: string | null, _createdAt?: string | null, _updatedAt?: string | null, name?: string | null, total?: number | null, prefs?: { __typename?: 'Preferences', data?: any | null } | null } | null };

export type GetMembershipQueryVariables = Exact<{
  teamId: Scalars['String']['input'];
  membershipId: Scalars['String']['input'];
}>;


export type GetMembershipQuery = { __typename?: 'Query', teamsGetMembership?: { __typename?: 'Membership', _id?: string | null, _createdAt?: string | null, _updatedAt?: string | null, userId?: string | null, userName?: string | null, userEmail?: string | null, teamId?: string | null, teamName?: string | null, invited?: string | null, joined?: string | null, confirm?: boolean | null, mfa?: boolean | null, roles?: Array<string | null> | null } | null };

export type ListMembershipsQueryVariables = Exact<{
  teamId: Scalars['String']['input'];
  queries?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type ListMembershipsQuery = { __typename?: 'Query', teamsListMemberships?: { __typename?: 'MembershipList', total?: number | null, memberships?: Array<{ __typename?: 'Membership', _id?: string | null, _createdAt?: string | null, _updatedAt?: string | null, userId?: string | null, userName?: string | null, userEmail?: string | null, teamId?: string | null, teamName?: string | null, invited?: string | null, joined?: string | null, confirm?: boolean | null, mfa?: boolean | null, roles?: Array<string | null> | null } | null> | null } | null };

export type GetTeamPrefsQueryVariables = Exact<{
  teamId: Scalars['String']['input'];
}>;


export type GetTeamPrefsQuery = { __typename?: 'Query', teamsGetPrefs?: { __typename?: 'Preferences', data?: any | null } | null };

export type ListTeamsQueryVariables = Exact<{
  queries?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type ListTeamsQuery = { __typename?: 'Query', teamsList?: { __typename?: 'TeamList', total?: number | null, teams?: Array<{ __typename?: 'Team', _id?: string | null, _createdAt?: string | null, _updatedAt?: string | null, name?: string | null, total?: number | null, prefs?: { __typename?: 'Preferences', data?: any | null } | null } | null> | null } | null };

export type UpdateMembershipMutationVariables = Exact<{
  teamId: Scalars['String']['input'];
  membershipId: Scalars['String']['input'];
  roles: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type UpdateMembershipMutation = { __typename?: 'Mutation', teamsUpdateMembership?: { __typename?: 'Membership', _id?: string | null, roles?: Array<string | null> | null } | null };

export type UpdateMembershipStatusMutationVariables = Exact<{
  teamId: Scalars['String']['input'];
  membershipId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
}>;


export type UpdateMembershipStatusMutation = { __typename?: 'Mutation', teamsUpdateMembershipStatus?: { __typename?: 'Membership', _id?: string | null, confirm?: boolean | null } | null };

export type UpdateTeamNameMutationVariables = Exact<{
  teamId: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type UpdateTeamNameMutation = { __typename?: 'Mutation', teamsUpdateName?: { __typename?: 'Team', _id?: string | null, name?: string | null } | null };

export type UpdateTeamPrefsMutationVariables = Exact<{
  teamId: Scalars['String']['input'];
  prefs: Scalars['Assoc']['input'];
}>;


export type UpdateTeamPrefsMutation = { __typename?: 'Mutation', teamsUpdatePrefs?: { __typename?: 'Preferences', data?: any | null } | null };

export const Account_UserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Account_User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<Account_UserFragment, unknown>;
export const Identity_ProviderFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Identity_Provider"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Identity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}}]} as unknown as DocumentNode<Identity_ProviderFragment, unknown>;
export const AccountGetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountGet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountGet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Account_User"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Account_User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<AccountGetQuery, AccountGetQueryVariables>;
export const CreateAnonymousSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAnonymousSession"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateAnonymousSession"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}},{"kind":"Field","name":{"kind":"Name","value":"current"}}]}}]}}]} as unknown as DocumentNode<CreateAnonymousSessionMutation, CreateAnonymousSessionMutationVariables>;
export const CreateEmailTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEmailToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phrase"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateEmailToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"phrase"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phrase"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<CreateEmailTokenMutation, CreateEmailTokenMutationVariables>;
export const CreateEmailVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEmailVerification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateEmailVerification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"secret"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<CreateEmailVerificationMutation, CreateEmailVerificationMutationVariables>;
export const CreateJwtDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateJWT"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateJWT"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jwt"}}]}}]}}]} as unknown as DocumentNode<CreateJwtMutation, CreateJwtMutationVariables>;
export const CreateMagicUrlTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMagicURLToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phrase"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateMagicURLToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}},{"kind":"Argument","name":{"kind":"Name","value":"phrase"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phrase"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<CreateMagicUrlTokenMutation, CreateMagicUrlTokenMutationVariables>;
export const CreateMfaAuthenticatorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMfaAuthenticator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateMfaAuthenticator"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"secret"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}}]}}]}}]} as unknown as DocumentNode<CreateMfaAuthenticatorMutation, CreateMfaAuthenticatorMutationVariables>;
export const CreateMfaChallengeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMfaChallenge"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"factor"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateMfaChallenge"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"factor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"factor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<CreateMfaChallengeMutation, CreateMfaChallengeMutationVariables>;
export const CreateMfaRecoveryCodesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMfaRecoveryCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateMfaRecoveryCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recoveryCodes"}}]}}]}}]} as unknown as DocumentNode<CreateMfaRecoveryCodesMutation, CreateMfaRecoveryCodesMutationVariables>;
export const CreatePhoneTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePhoneToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreatePhoneToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"phone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<CreatePhoneTokenMutation, CreatePhoneTokenMutationVariables>;
export const CreatePhoneVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePhoneVerification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreatePhoneVerification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<CreatePhoneVerificationMutation, CreatePhoneVerificationMutationVariables>;
export const CreatePushTargetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePushTarget"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"targetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"providerId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreatePushTarget"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"targetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"targetId"}}},{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}},{"kind":"Argument","name":{"kind":"Name","value":"providerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"providerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"providerType"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}}]} as unknown as DocumentNode<CreatePushTargetMutation, CreatePushTargetMutationVariables>;
export const CreateSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}},{"kind":"Field","name":{"kind":"Name","value":"current"}}]}}]}}]} as unknown as DocumentNode<CreateSessionMutation, CreateSessionMutationVariables>;
export const DeleteIdentityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteIdentity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountDeleteIdentity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identityId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identityId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DeleteIdentityMutation, DeleteIdentityMutationVariables>;
export const DeleteMfaAuthenticatorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMfaAuthenticator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountDeleteMfaAuthenticator"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DeleteMfaAuthenticatorMutation, DeleteMfaAuthenticatorMutationVariables>;
export const DeletePushTargetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePushTarget"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"targetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountDeletePushTarget"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"targetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"targetId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DeletePushTargetMutation, DeletePushTargetMutationVariables>;
export const DeleteSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountDeleteSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sessionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DeleteSessionMutation, DeleteSessionMutationVariables>;
export const DeleteSessionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountDeleteSessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DeleteSessionsMutation, DeleteSessionsMutationVariables>;
export const GetMfaRecoveryCodesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMfaRecoveryCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountGetMfaRecoveryCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recoveryCodes"}}]}}]}}]} as unknown as DocumentNode<GetMfaRecoveryCodesQuery, GetMfaRecoveryCodesQueryVariables>;
export const GetPrefsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPrefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountGetPrefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<GetPrefsQuery, GetPrefsQueryVariables>;
export const GetSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountGetSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sessionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}},{"kind":"Field","name":{"kind":"Name","value":"current"}}]}}]}}]} as unknown as DocumentNode<GetSessionQuery, GetSessionQueryVariables>;
export const ListIdentitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListIdentities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountListIdentities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"identities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Identity_Provider"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Identity_Provider"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Identity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}}]} as unknown as DocumentNode<ListIdentitiesQuery, ListIdentitiesQueryVariables>;
export const ListMfaFactorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListMfaFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountListMfaFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totp"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<ListMfaFactorsQuery, ListMfaFactorsQueryVariables>;
export const ListSessionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListSessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountListSessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"_createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"osName"}},{"kind":"Field","name":{"kind":"Name","value":"clientName"}}]}}]}}]}}]} as unknown as DocumentNode<ListSessionsQuery, ListSessionsQueryVariables>;
export const CreateEmailPasswordSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEmailPasswordSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateEmailPasswordSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}},{"kind":"Field","name":{"kind":"Name","value":"current"}}]}}]}}]} as unknown as DocumentNode<CreateEmailPasswordSessionMutation, CreateEmailPasswordSessionMutationVariables>;
export const ListLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queries"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountListLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"queries"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queries"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"logs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"ip"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"osCode"}},{"kind":"Field","name":{"kind":"Name","value":"osName"}},{"kind":"Field","name":{"kind":"Name","value":"osVersion"}},{"kind":"Field","name":{"kind":"Name","value":"clientType"}},{"kind":"Field","name":{"kind":"Name","value":"clientCode"}},{"kind":"Field","name":{"kind":"Name","value":"clientName"}},{"kind":"Field","name":{"kind":"Name","value":"clientVersion"}},{"kind":"Field","name":{"kind":"Name","value":"clientEngine"}},{"kind":"Field","name":{"kind":"Name","value":"clientEngineVersion"}},{"kind":"Field","name":{"kind":"Name","value":"deviceName"}},{"kind":"Field","name":{"kind":"Name","value":"deviceBrand"}},{"kind":"Field","name":{"kind":"Name","value":"deviceModel"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryName"}}]}}]}}]}}]} as unknown as DocumentNode<ListLogsQuery, ListLogsQueryVariables>;
export const CreateRecoveryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRecovery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateRecovery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<CreateRecoveryMutation, CreateRecoveryMutationVariables>;
export const UpdateRecoveryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRecovery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateRecovery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<UpdateRecoveryMutation, UpdateRecoveryMutationVariables>;
export const CreateAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<CreateAccountMutation, CreateAccountMutationVariables>;
export const VerifyEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateVerification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const UpdateEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<UpdateEmailMutation, UpdateEmailMutationVariables>;
export const UpdateEmailVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEmailVerification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateEmailVerification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"secret"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<UpdateEmailVerificationMutation, UpdateEmailVerificationMutationVariables>;
export const UpdateMagicUrlSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMagicURLSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateMagicURLSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}},{"kind":"Field","name":{"kind":"Name","value":"current"}}]}}]}}]} as unknown as DocumentNode<UpdateMagicUrlSessionMutation, UpdateMagicUrlSessionMutationVariables>;
export const UpdateMfaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMFA"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mfa"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateMFA"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mfa"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mfa"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfa"}}]}}]}}]} as unknown as DocumentNode<UpdateMfaMutation, UpdateMfaMutationVariables>;
export const UpdateMfaAuthenticatorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMfaAuthenticator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateMfaAuthenticator"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"otp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfa"}}]}}]}}]} as unknown as DocumentNode<UpdateMfaAuthenticatorMutation, UpdateMfaAuthenticatorMutationVariables>;
export const UpdateMfaChallengeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMfaChallenge"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"challengeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateMfaChallenge"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"challengeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"challengeId"}}},{"kind":"Argument","name":{"kind":"Name","value":"otp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}},{"kind":"Field","name":{"kind":"Name","value":"current"}}]}}]}}]} as unknown as DocumentNode<UpdateMfaChallengeMutation, UpdateMfaChallengeMutationVariables>;
export const UpdateMfaRecoveryCodesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMfaRecoveryCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateMfaRecoveryCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recoveryCodes"}}]}}]}}]} as unknown as DocumentNode<UpdateMfaRecoveryCodesMutation, UpdateMfaRecoveryCodesMutationVariables>;
export const UpdateNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateNameMutation, UpdateNameMutationVariables>;
export const UpdatePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdatePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"oldPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdatePasswordMutation, UpdatePasswordMutationVariables>;
export const UpdatePhoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePhone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdatePhone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"phone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]} as unknown as DocumentNode<UpdatePhoneMutation, UpdatePhoneMutationVariables>;
export const UpdatePhoneSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePhoneSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdatePhoneSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}},{"kind":"Field","name":{"kind":"Name","value":"current"}}]}}]}}]} as unknown as DocumentNode<UpdatePhoneSessionMutation, UpdatePhoneSessionMutationVariables>;
export const UpdatePhoneVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePhoneVerification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdatePhoneVerification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<UpdatePhoneVerificationMutation, UpdatePhoneVerificationMutationVariables>;
export const UpdatePrefsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePrefs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"prefs"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Assoc"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdatePrefs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"prefs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"prefs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<UpdatePrefsMutation, UpdatePrefsMutationVariables>;
export const UpdatePushTargetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePushTarget"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"targetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdatePushTarget"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"targetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"targetId"}}},{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"providerType"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}}]} as unknown as DocumentNode<UpdatePushTargetMutation, UpdatePushTargetMutationVariables>;
export const UpdateSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sessionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}},{"kind":"Field","name":{"kind":"Name","value":"current"}}]}}]}}]} as unknown as DocumentNode<UpdateSessionMutation, UpdateSessionMutationVariables>;
export const UpdateStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdateStatusMutation, UpdateStatusMutationVariables>;
export const UpdateVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVerification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateVerification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"secret"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<UpdateVerificationMutation, UpdateVerificationMutationVariables>;
export const ListDocumentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListDocuments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queries"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesListDocuments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"databaseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"collectionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"queries"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queries"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<ListDocumentsQuery, ListDocumentsQueryVariables>;
export const CreateDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Json"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesCreateDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"databaseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"collectionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"permissions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<CreateDocumentMutation, CreateDocumentMutationVariables>;
export const CreateOperationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOperations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"transactionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"operations"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesCreateOperations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"transactionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"transactionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"operations"},"value":{"kind":"Variable","name":{"kind":"Name","value":"operations"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"operations"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]} as unknown as DocumentNode<CreateOperationsMutation, CreateOperationsMutationVariables>;
export const CreateTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ttl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesCreateTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ttl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ttl"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"operations"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]} as unknown as DocumentNode<CreateTransactionMutation, CreateTransactionMutationVariables>;
export const DecrementDocumentAttributeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DecrementDocumentAttribute"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"attribute"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"min"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesDecrementDocumentAttribute"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"databaseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"collectionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"attribute"},"value":{"kind":"Variable","name":{"kind":"Name","value":"attribute"}}},{"kind":"Argument","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}},{"kind":"Argument","name":{"kind":"Name","value":"min"},"value":{"kind":"Variable","name":{"kind":"Name","value":"min"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<DecrementDocumentAttributeMutation, DecrementDocumentAttributeMutationVariables>;
export const DeleteDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesDeleteDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"databaseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"collectionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DeleteDocumentMutation, DeleteDocumentMutationVariables>;
export const DeleteTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"transactionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesDeleteTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"transactionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"transactionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DeleteTransactionMutation, DeleteTransactionMutationVariables>;
export const GetDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesGetDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"databaseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"collectionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<GetDocumentQuery, GetDocumentQueryVariables>;
export const GetTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"transactionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesGetTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"transactionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"transactionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"_createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"_updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"operations"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]} as unknown as DocumentNode<GetTransactionQuery, GetTransactionQueryVariables>;
export const IncrementDocumentAttributeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"IncrementDocumentAttribute"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"attribute"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"max"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesIncrementDocumentAttribute"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"databaseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"collectionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"attribute"},"value":{"kind":"Variable","name":{"kind":"Name","value":"attribute"}}},{"kind":"Argument","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}},{"kind":"Argument","name":{"kind":"Name","value":"max"},"value":{"kind":"Variable","name":{"kind":"Name","value":"max"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<IncrementDocumentAttributeMutation, IncrementDocumentAttributeMutationVariables>;
export const ListTransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListTransactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queries"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesListTransactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"queries"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queries"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"transactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"_createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"_updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"operations"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]}}]} as unknown as DocumentNode<ListTransactionsQuery, ListTransactionsQueryVariables>;
export const UpdateDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Json"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesUpdateDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"databaseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"collectionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"permissions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<UpdateDocumentMutation, UpdateDocumentMutationVariables>;
export const UpdateTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"transactionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rollback"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesUpdateTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"transactionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"transactionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"commit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commit"}}},{"kind":"Argument","name":{"kind":"Name","value":"rollback"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rollback"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"operations"}}]}}]}}]} as unknown as DocumentNode<UpdateTransactionMutation, UpdateTransactionMutationVariables>;
export const UpsertDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Json"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesUpsertDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"databaseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"collectionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"permissions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<UpsertDocumentMutation, UpsertDocumentMutationVariables>;
export const CreateExecutionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateExecution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"body"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"async"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"path"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"method"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"headers"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scheduledAt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functionsCreateExecution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"functionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"body"}}},{"kind":"Argument","name":{"kind":"Name","value":"async"},"value":{"kind":"Variable","name":{"kind":"Name","value":"async"}}},{"kind":"Argument","name":{"kind":"Name","value":"path"},"value":{"kind":"Variable","name":{"kind":"Name","value":"path"}}},{"kind":"Argument","name":{"kind":"Name","value":"method"},"value":{"kind":"Variable","name":{"kind":"Name","value":"method"}}},{"kind":"Argument","name":{"kind":"Name","value":"headers"},"value":{"kind":"Variable","name":{"kind":"Name","value":"headers"}}},{"kind":"Argument","name":{"kind":"Name","value":"scheduledAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scheduledAt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"responseStatusCode"}},{"kind":"Field","name":{"kind":"Name","value":"responseBody"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<CreateExecutionMutation, CreateExecutionMutationVariables>;
export const GetFunctionExecutionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFunctionExecution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functionsGetExecution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"functionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"executionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"responseBody"}},{"kind":"Field","name":{"kind":"Name","value":"requestPath"}}]}}]}}]} as unknown as DocumentNode<GetFunctionExecutionQuery, GetFunctionExecutionQueryVariables>;
export const GetExecutionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetExecution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functionsGetExecution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"functionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"executionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"_createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"_updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"functionId"}},{"kind":"Field","name":{"kind":"Name","value":"trigger"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"requestMethod"}},{"kind":"Field","name":{"kind":"Name","value":"requestPath"}},{"kind":"Field","name":{"kind":"Name","value":"responseStatusCode"}},{"kind":"Field","name":{"kind":"Name","value":"responseBody"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<GetExecutionQuery, GetExecutionQueryVariables>;
export const ListExecutionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListExecutions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queries"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functionsListExecutions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"functionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"queries"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queries"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"executions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"_createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"_updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"functionId"}},{"kind":"Field","name":{"kind":"Name","value":"trigger"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"requestMethod"}},{"kind":"Field","name":{"kind":"Name","value":"requestPath"}},{"kind":"Field","name":{"kind":"Name","value":"responseStatusCode"}},{"kind":"Field","name":{"kind":"Name","value":"responseBody"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]}}]} as unknown as DocumentNode<ListExecutionsQuery, ListExecutionsQueryVariables>;
export const GetLocaleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLocale"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localeGet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ip"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"continentCode"}},{"kind":"Field","name":{"kind":"Name","value":"continent"}},{"kind":"Field","name":{"kind":"Name","value":"eu"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}}]}}]} as unknown as DocumentNode<GetLocaleQuery, GetLocaleQueryVariables>;
export const ListLocaleCodesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListLocaleCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localeListCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"localeCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ListLocaleCodesQuery, ListLocaleCodesQueryVariables>;
export const ListContinentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListContinents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localeListContinents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"continents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<ListContinentsQuery, ListContinentsQueryVariables>;
export const ListCountriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListCountries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localeListCountries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<ListCountriesQuery, ListCountriesQueryVariables>;
export const ListCountriesEuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListCountriesEU"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localeListCountriesEU"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<ListCountriesEuQuery, ListCountriesEuQueryVariables>;
export const ListCountriesPhonesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListCountriesPhones"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localeListCountriesPhones"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"phones"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryName"}}]}}]}}]}}]} as unknown as DocumentNode<ListCountriesPhonesQuery, ListCountriesPhonesQueryVariables>;
export const ListCurrenciesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListCurrencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localeListCurrencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbolNative"}},{"kind":"Field","name":{"kind":"Name","value":"decimalDigits"}},{"kind":"Field","name":{"kind":"Name","value":"rounding"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"namePlural"}}]}}]}}]}}]} as unknown as DocumentNode<ListCurrenciesQuery, ListCurrenciesQueryVariables>;
export const ListLanguagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListLanguages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localeListLanguages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"languages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"nativeName"}}]}}]}}]}}]} as unknown as DocumentNode<ListLanguagesQuery, ListLanguagesQueryVariables>;
export const CreateSubscriberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSubscriber"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscriberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"topicId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"targetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messagingCreateSubscriber"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"subscriberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscriberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"topicId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"topicId"}}},{"kind":"Argument","name":{"kind":"Name","value":"targetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"targetId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"_createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"_updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"targetId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"topicId"}},{"kind":"Field","name":{"kind":"Name","value":"providerType"}}]}}]}}]} as unknown as DocumentNode<CreateSubscriberMutation, CreateSubscriberMutationVariables>;
export const DeleteSubscriberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSubscriber"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"topicId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscriberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messagingDeleteSubscriber"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"topicId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"topicId"}}},{"kind":"Argument","name":{"kind":"Name","value":"subscriberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscriberId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DeleteSubscriberMutation, DeleteSubscriberMutationVariables>;
export const DeleteFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bucketId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storageDeleteFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bucketId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bucketId"}}},{"kind":"Argument","name":{"kind":"Name","value":"fileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DeleteFileMutation, DeleteFileMutationVariables>;
export const GetFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bucketId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storageGetFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bucketId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bucketId"}}},{"kind":"Argument","name":{"kind":"Name","value":"fileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucketId"}},{"kind":"Field","name":{"kind":"Name","value":"_createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"_updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"_permissions"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"sizeOriginal"}},{"kind":"Field","name":{"kind":"Name","value":"chunksTotal"}},{"kind":"Field","name":{"kind":"Name","value":"chunksUploaded"}}]}}]}}]} as unknown as DocumentNode<GetFileQuery, GetFileQueryVariables>;
export const ListFilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListFiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bucketId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queries"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storageListFiles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bucketId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bucketId"}}},{"kind":"Argument","name":{"kind":"Name","value":"queries"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queries"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucketId"}},{"kind":"Field","name":{"kind":"Name","value":"_createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"_updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"_permissions"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"sizeOriginal"}},{"kind":"Field","name":{"kind":"Name","value":"chunksTotal"}},{"kind":"Field","name":{"kind":"Name","value":"chunksUploaded"}}]}}]}}]}}]} as unknown as DocumentNode<ListFilesQuery, ListFilesQueryVariables>;
export const UpdateFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bucketId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storageUpdateFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bucketId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bucketId"}}},{"kind":"Argument","name":{"kind":"Name","value":"fileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"permissions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bucketId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"_permissions"}}]}}]}}]} as unknown as DocumentNode<UpdateFileMutation, UpdateFileMutationVariables>;
export const CreateMembershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMembership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roles"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamsCreateMembership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}}},{"kind":"Argument","name":{"kind":"Name","value":"roles"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roles"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"phone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"confirm"}}]}}]}}]} as unknown as DocumentNode<CreateMembershipMutation, CreateMembershipMutationVariables>;
export const CreateTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roles"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamsCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"roles"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roles"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<CreateTeamMutation, CreateTeamMutationVariables>;
export const DeleteMembershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMembership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"membershipId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamsDeleteMembership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}}},{"kind":"Argument","name":{"kind":"Name","value":"membershipId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"membershipId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DeleteMembershipMutation, DeleteMembershipMutationVariables>;
export const DeleteTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamsDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DeleteTeamMutation, DeleteTeamMutationVariables>;
export const GetTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamsGet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"_createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"_updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<GetTeamQuery, GetTeamQueryVariables>;
export const GetMembershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMembership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"membershipId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamsGetMembership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}}},{"kind":"Argument","name":{"kind":"Name","value":"membershipId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"membershipId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"_createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"_updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"teamName"}},{"kind":"Field","name":{"kind":"Name","value":"invited"}},{"kind":"Field","name":{"kind":"Name","value":"joined"}},{"kind":"Field","name":{"kind":"Name","value":"confirm"}},{"kind":"Field","name":{"kind":"Name","value":"mfa"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}}]}}]}}]} as unknown as DocumentNode<GetMembershipQuery, GetMembershipQueryVariables>;
export const ListMembershipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListMemberships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queries"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamsListMemberships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}}},{"kind":"Argument","name":{"kind":"Name","value":"queries"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queries"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"_createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"_updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"teamName"}},{"kind":"Field","name":{"kind":"Name","value":"invited"}},{"kind":"Field","name":{"kind":"Name","value":"joined"}},{"kind":"Field","name":{"kind":"Name","value":"confirm"}},{"kind":"Field","name":{"kind":"Name","value":"mfa"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}}]}}]}}]}}]} as unknown as DocumentNode<ListMembershipsQuery, ListMembershipsQueryVariables>;
export const GetTeamPrefsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTeamPrefs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamsGetPrefs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<GetTeamPrefsQuery, GetTeamPrefsQueryVariables>;
export const ListTeamsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListTeams"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queries"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamsList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"queries"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queries"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"_createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"_updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListTeamsQuery, ListTeamsQueryVariables>;
export const UpdateMembershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMembership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"membershipId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roles"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamsUpdateMembership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}}},{"kind":"Argument","name":{"kind":"Name","value":"membershipId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"membershipId"}}},{"kind":"Argument","name":{"kind":"Name","value":"roles"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roles"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}}]}}]}}]} as unknown as DocumentNode<UpdateMembershipMutation, UpdateMembershipMutationVariables>;
export const UpdateMembershipStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMembershipStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"membershipId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamsUpdateMembershipStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}}},{"kind":"Argument","name":{"kind":"Name","value":"membershipId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"membershipId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"confirm"}}]}}]}}]} as unknown as DocumentNode<UpdateMembershipStatusMutation, UpdateMembershipStatusMutationVariables>;
export const UpdateTeamNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTeamName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamsUpdateName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateTeamNameMutation, UpdateTeamNameMutationVariables>;
export const UpdateTeamPrefsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTeamPrefs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"prefs"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Assoc"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamsUpdatePrefs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamId"}}},{"kind":"Argument","name":{"kind":"Name","value":"prefs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"prefs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<UpdateTeamPrefsMutation, UpdateTeamPrefsMutationVariables>;