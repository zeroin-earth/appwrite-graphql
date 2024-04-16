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

export type Mutation = {
  __typename?: 'Mutation';
  accountCreate?: Maybe<User>;
  accountCreateEmailPasswordSession?: Maybe<Session>;
  accountCreateMagicURLSession?: Maybe<Token>;
  accountCreatePhoneSession?: Maybe<Token>;
  accountCreatePhoneVerification?: Maybe<Token>;
  accountCreateRecovery?: Maybe<Token>;
  accountCreateVerification?: Maybe<Token>;
  accountDeleteIdentity?: Maybe<Status>;
  accountDeleteSession?: Maybe<Status>;
  accountDeleteSessions?: Maybe<Status>;
  accountUpdateEmail?: Maybe<User>;
  accountUpdateMagicURLSession?: Maybe<Session>;
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


export type MutationAccountCreateMagicUrlSessionArgs = {
  email: Scalars['String']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};


export type MutationAccountCreatePhoneSessionArgs = {
  phone: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationAccountCreateRecoveryArgs = {
  email: Scalars['String']['input'];
  url: Scalars['String']['input'];
};


export type MutationAccountCreateVerificationArgs = {
  url: Scalars['String']['input'];
};


export type MutationAccountDeleteIdentityArgs = {
  identityId: Scalars['String']['input'];
};


export type MutationAccountDeleteSessionArgs = {
  sessionId: Scalars['String']['input'];
};


export type MutationAccountUpdateEmailArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationAccountUpdateMagicUrlSessionArgs = {
  secret: Scalars['String']['input'];
  userId: Scalars['String']['input'];
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
  accountGetPrefs?: Maybe<Preferences>;
  accountGetSession?: Maybe<Session>;
  accountListIdentities?: Maybe<IdentityList>;
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
  current?: Maybe<Scalars['Boolean']['output']>;
  expire?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type Status = {
  __typename?: 'Status';
  status?: Maybe<Scalars['Boolean']['output']>;
};

export type Token = {
  __typename?: 'Token';
  _createdAt?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['String']['output']>;
  expire?: Maybe<Scalars['String']['output']>;
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
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  phoneVerification?: Maybe<Scalars['Boolean']['output']>;
  prefs?: Maybe<Preferences>;
  registration?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type Account_UserFragmentFragment = { __typename?: 'User', name?: string | null, email?: string | null, prefs?: { __typename?: 'Preferences', data?: any | null } | null } & { ' $fragmentName'?: 'Account_UserFragmentFragment' };

export type AccountGetQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountGetQuery = { __typename?: 'Query', accountGet?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'Account_UserFragmentFragment': Account_UserFragmentFragment } }
  ) | null };

export type ListIdentitiesQueryVariables = Exact<{
  queries?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type ListIdentitiesQuery = { __typename?: 'Query', accountListIdentities?: { __typename?: 'IdentityList', total: number, identities?: Array<{ __typename?: 'Identity', userId?: string | null, provider?: string | null, providerUid?: string | null, providerEmail?: string | null, providerAccessToken?: string | null, providerAccessTokenExpiry?: string | null, providerRefreshToken?: string | null }> | null } | null };

export type CreateEmailPasswordSessionMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type CreateEmailPasswordSessionMutation = { __typename?: 'Mutation', accountCreateEmailPasswordSession?: { __typename?: 'Session', userId?: string | null, expire?: string | null, current?: boolean | null } | null };

export type DeleteSessionMutationVariables = Exact<{
  sessionId: Scalars['String']['input'];
}>;


export type DeleteSessionMutation = { __typename?: 'Mutation', accountDeleteSession?: { __typename?: 'Status', status?: boolean | null } | null };

export type CreateRecoveryMutationVariables = Exact<{
  email: Scalars['String']['input'];
  url: Scalars['String']['input'];
}>;


export type CreateRecoveryMutation = { __typename?: 'Mutation', accountCreateRecovery?: { __typename?: 'Token', expire?: string | null } | null };

export type UpdateRecoveryMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordAgain: Scalars['String']['input'];
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

export type UpdateVerificationMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
}>;


export type UpdateVerificationMutation = { __typename?: 'Mutation', accountUpdateVerification?: { __typename?: 'Token', expire?: string | null } | null };

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

export type GetDocumentQueryVariables = Exact<{
  databaseId: Scalars['String']['input'];
  collectionId: Scalars['String']['input'];
  documentId: Scalars['String']['input'];
}>;


export type GetDocumentQuery = { __typename?: 'Query', databasesGetDocument?: { __typename?: 'Document', _id?: string | null, data?: any | null } | null };

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
export const AccountGetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountGet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountGet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Account_UserFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Account_UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<AccountGetQuery, AccountGetQueryVariables>;
export const ListIdentitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListIdentities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queries"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountListIdentities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"queries"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queries"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"identities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"providerUid"}},{"kind":"Field","name":{"kind":"Name","value":"providerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"providerAccessToken"}},{"kind":"Field","name":{"kind":"Name","value":"providerAccessTokenExpiry"}},{"kind":"Field","name":{"kind":"Name","value":"providerRefreshToken"}}]}}]}}]}}]} as unknown as DocumentNode<ListIdentitiesQuery, ListIdentitiesQueryVariables>;
export const CreateEmailPasswordSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEmailPasswordSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateEmailPasswordSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"expire"}},{"kind":"Field","name":{"kind":"Name","value":"current"}}]}}]}}]} as unknown as DocumentNode<CreateEmailPasswordSessionMutation, CreateEmailPasswordSessionMutationVariables>;
export const DeleteSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountDeleteSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sessionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DeleteSessionMutation, DeleteSessionMutationVariables>;
export const CreateRecoveryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRecovery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateRecovery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<CreateRecoveryMutation, CreateRecoveryMutationVariables>;
export const UpdateRecoveryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRecovery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordAgain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateRecovery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"passwordAgain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordAgain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<UpdateRecoveryMutation, UpdateRecoveryMutationVariables>;
export const CreateAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<CreateAccountMutation, CreateAccountMutationVariables>;
export const VerifyEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCreateVerification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const UpdateEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<UpdateEmailMutation, UpdateEmailMutationVariables>;
export const UpdateVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVerification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUpdateVerification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expire"}}]}}]}}]} as unknown as DocumentNode<UpdateVerificationMutation, UpdateVerificationMutationVariables>;
export const ListDocumentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListDocuments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queries"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesListDocuments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"databaseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"collectionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"queries"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queries"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<ListDocumentsQuery, ListDocumentsQueryVariables>;
export const CreateDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesCreateDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"databaseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"collectionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"permissions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<CreateDocumentMutation, CreateDocumentMutationVariables>;
export const GetDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databasesGetDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"databaseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"databaseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"collectionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<GetDocumentQuery, GetDocumentQueryVariables>;
export const CreateExecutionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateExecution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"body"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"async"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"path"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"method"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"headers"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functionsCreateExecution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"functionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"body"}}},{"kind":"Argument","name":{"kind":"Name","value":"async"},"value":{"kind":"Variable","name":{"kind":"Name","value":"async"}}},{"kind":"Argument","name":{"kind":"Name","value":"path"},"value":{"kind":"Variable","name":{"kind":"Name","value":"path"}}},{"kind":"Argument","name":{"kind":"Name","value":"method"},"value":{"kind":"Variable","name":{"kind":"Name","value":"method"}}},{"kind":"Argument","name":{"kind":"Name","value":"headers"},"value":{"kind":"Variable","name":{"kind":"Name","value":"headers"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"responseStatusCode"}},{"kind":"Field","name":{"kind":"Name","value":"responseBody"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<CreateExecutionMutation, CreateExecutionMutationVariables>;
export const GetFunctionExecutionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFunctionExecution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functionsGetExecution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"functionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"executionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<GetFunctionExecutionQuery, GetFunctionExecutionQueryVariables>;