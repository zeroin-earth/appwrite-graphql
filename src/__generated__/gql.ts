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
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment Account_User on User {\n    _id\n    name\n    email\n    prefs {\n      data\n    }\n  }\n": typeof types.Account_UserFragmentDoc,
    "\n  fragment Identity_Provider on Identity {\n    _id\n    userId\n    provider\n  }\n": typeof types.Identity_ProviderFragmentDoc,
    "\n  query AccountGet {\n    accountGet {\n      ...Account_User\n    }\n  }\n": typeof types.AccountGetDocument,
    "\n  mutation CreateAnonymousSession {\n    accountCreateAnonymousSession {\n      _id\n      expire\n      current\n    }\n  }\n": typeof types.CreateAnonymousSessionDocument,
    "\n  mutation CreateEmailToken($userId: String!, $email: String!, $phrase: Boolean) {\n    accountCreateEmailToken(userId: $userId, email: $email, phrase: $phrase) {\n      expire\n    }\n  }\n": typeof types.CreateEmailTokenDocument,
    "\n  mutation CreateEmailVerification($url: String!) {\n    accountCreateEmailVerification(url: $url) {\n      _id\n      userId\n      secret\n      expire\n    }\n  }\n": typeof types.CreateEmailVerificationDocument,
    "\n  mutation CreateJWT {\n    accountCreateJWT {\n      jwt\n    }\n  }\n": typeof types.CreateJwtDocument,
    "\n  mutation CreateMagicURLToken($userId: String!, $email: String!, $url: String, $phrase: Boolean) {\n    accountCreateMagicURLToken(userId: $userId, email: $email, url: $url, phrase: $phrase) {\n      expire\n    }\n  }\n": typeof types.CreateMagicUrlTokenDocument,
    "\n  mutation CreateMfaAuthenticator($type: String!) {\n    accountCreateMfaAuthenticator(type: $type) {\n      secret\n      uri\n    }\n  }\n": typeof types.CreateMfaAuthenticatorDocument,
    "\n  mutation CreateMfaChallenge($factor: String!) {\n    accountCreateMfaChallenge(factor: $factor) {\n      _id\n      userId\n      expire\n    }\n  }\n": typeof types.CreateMfaChallengeDocument,
    "\n  mutation CreateMfaRecoveryCodes {\n    accountCreateMfaRecoveryCodes {\n      recoveryCodes\n    }\n  }\n": typeof types.CreateMfaRecoveryCodesDocument,
    "\n  mutation CreatePhoneToken($userId: String!, $phone: String!) {\n    accountCreatePhoneToken(userId: $userId, phone: $phone) {\n      expire\n    }\n  }\n": typeof types.CreatePhoneTokenDocument,
    "\n  mutation CreatePhoneVerification {\n    accountCreatePhoneVerification {\n      expire\n    }\n  }\n": typeof types.CreatePhoneVerificationDocument,
    "\n  mutation CreatePushTarget($targetId: String!, $identifier: String!, $providerId: String) {\n    accountCreatePushTarget(targetId: $targetId, identifier: $identifier, providerId: $providerId) {\n      _id\n      userId\n      providerType\n      identifier\n    }\n  }\n": typeof types.CreatePushTargetDocument,
    "\n  mutation CreateSession($userId: String!, $secret: String!) {\n    accountCreateSession(userId: $userId, secret: $secret) {\n      userId\n      expire\n      current\n    }\n  }\n": typeof types.CreateSessionDocument,
    "\n  mutation DeleteAccount {\n    accountDelete {\n      status\n    }\n  }\n": typeof types.DeleteAccountDocument,
    "\n  mutation DeleteIdentity($identityId: String!) {\n    accountDeleteIdentity(identityId: $identityId) {\n      status\n    }\n  }\n": typeof types.DeleteIdentityDocument,
    "\n  mutation DeleteMfaAuthenticator($type: String!) {\n    accountDeleteMfaAuthenticator(type: $type) {\n      status\n    }\n  }\n": typeof types.DeleteMfaAuthenticatorDocument,
    "\n  mutation DeletePushTarget($targetId: String!) {\n    accountDeletePushTarget(targetId: $targetId) {\n      status\n    }\n  }\n": typeof types.DeletePushTargetDocument,
    "\n  mutation DeleteSession($sessionId: String!) {\n    accountDeleteSession(sessionId: $sessionId) {\n      status\n    }\n  }\n": typeof types.DeleteSessionDocument,
    "\n  mutation DeleteSessions {\n    accountDeleteSessions {\n      status\n    }\n  }\n": typeof types.DeleteSessionsDocument,
    "\n  query GetMfaRecoveryCodes {\n    accountGetMfaRecoveryCodes {\n      recoveryCodes\n    }\n  }\n": typeof types.GetMfaRecoveryCodesDocument,
    "\n  query GetPrefs {\n    accountGetPrefs {\n      data\n    }\n  }\n": typeof types.GetPrefsDocument,
    "\n  query GetSession($sessionId: String!) {\n    accountGetSession(sessionId: $sessionId) {\n      userId\n      expire\n      current\n    }\n  }\n": typeof types.GetSessionDocument,
    "\n  query ListIdentities {\n    accountListIdentities {\n      total\n      identities {\n        ...Identity_Provider\n      }\n    }\n  }\n": typeof types.ListIdentitiesDocument,
    "\n  query ListMfaFactors {\n    accountListMfaFactors {\n      totp\n      phone\n      email\n    }\n  }\n": typeof types.ListMfaFactorsDocument,
    "\n  query ListSessions {\n    accountListSessions {\n      sessions {\n        _id\n        _createdAt\n        osName\n        clientName\n      }\n    }\n  }\n": typeof types.ListSessionsDocument,
    "\n  mutation CreateEmailPasswordSession($email: String!, $password: String!) {\n    accountCreateEmailPasswordSession(email: $email, password: $password) {\n      userId\n      expire\n      current\n    }\n  }\n": typeof types.CreateEmailPasswordSessionDocument,
    "\n  query ListLogs($queries: [String!]) {\n    accountListLogs(queries: $queries) {\n      total\n      logs {\n        event\n        userId\n        userEmail\n        userName\n        mode\n        ip\n        time\n        osCode\n        osName\n        osVersion\n        clientType\n        clientCode\n        clientName\n        clientVersion\n        clientEngine\n        clientEngineVersion\n        deviceName\n        deviceBrand\n        deviceModel\n        countryCode\n        countryName\n      }\n    }\n  }\n": typeof types.ListLogsDocument,
    "\n  mutation CreateRecovery($email: String!, $url: String!) {\n    accountCreateRecovery(email: $email, url: $url) {\n      expire\n    }\n  }\n": typeof types.CreateRecoveryDocument,
    "\n  mutation UpdateRecovery($userId: String!, $secret: String!, $password: String!) {\n    accountUpdateRecovery(userId: $userId, secret: $secret, password: $password) {\n      expire\n    }\n  }\n": typeof types.UpdateRecoveryDocument,
    "\n  mutation CreateAccount($userId: String!, $name: String, $email: String!, $password: String!) {\n    accountCreate(userId: $userId, name: $name, email: $email, password: $password) {\n      name\n      email\n    }\n  }\n": typeof types.CreateAccountDocument,
    "\n  mutation VerifyEmail($url: String!) {\n    accountCreateVerification(url: $url) {\n      expire\n    }\n  }\n": typeof types.VerifyEmailDocument,
    "\n  mutation UpdateEmail($email: String!, $password: String!) {\n    accountUpdateEmail(email: $email, password: $password) {\n      name\n      email\n    }\n  }\n": typeof types.UpdateEmailDocument,
    "\n  mutation UpdateEmailVerification($userId: String!, $secret: String!) {\n    accountUpdateEmailVerification(userId: $userId, secret: $secret) {\n      _id\n      userId\n      secret\n      expire\n    }\n  }\n": typeof types.UpdateEmailVerificationDocument,
    "\n  mutation UpdateMagicURLSession($userId: String!, $secret: String!) {\n    accountUpdateMagicURLSession(userId: $userId, secret: $secret) {\n      userId\n      expire\n      current\n    }\n  }\n": typeof types.UpdateMagicUrlSessionDocument,
    "\n  mutation UpdateMFA($mfa: Boolean!) {\n    accountUpdateMFA(mfa: $mfa) {\n      mfa\n    }\n  }\n": typeof types.UpdateMfaDocument,
    "\n  mutation UpdateMfaAuthenticator($type: String!, $otp: String!) {\n    accountUpdateMfaAuthenticator(type: $type, otp: $otp) {\n      mfa\n    }\n  }\n": typeof types.UpdateMfaAuthenticatorDocument,
    "\n  mutation UpdateMfaChallenge($challengeId: String!, $otp: String!) {\n    accountUpdateMfaChallenge(challengeId: $challengeId, otp: $otp) {\n      _id\n      userId\n      expire\n      current\n    }\n  }\n": typeof types.UpdateMfaChallengeDocument,
    "\n  mutation UpdateMfaRecoveryCodes {\n    accountUpdateMfaRecoveryCodes {\n      recoveryCodes\n    }\n  }\n": typeof types.UpdateMfaRecoveryCodesDocument,
    "\n  mutation UpdateName($name: String!) {\n    accountUpdateName(name: $name) {\n      name\n    }\n  }\n": typeof types.UpdateNameDocument,
    "\n  mutation UpdatePassword($password: String!, $oldPassword: String!) {\n    accountUpdatePassword(password: $password, oldPassword: $oldPassword) {\n      status\n    }\n  }\n": typeof types.UpdatePasswordDocument,
    "\n  mutation UpdatePhone($phone: String!, $password: String!) {\n    accountUpdatePhone(phone: $phone, password: $password) {\n      phone\n    }\n  }\n": typeof types.UpdatePhoneDocument,
    "\n  mutation UpdatePhoneSession($userId: String!, $secret: String!) {\n    accountUpdatePhoneSession(userId: $userId, secret: $secret) {\n      userId\n      expire\n      current\n    }\n  }\n": typeof types.UpdatePhoneSessionDocument,
    "\n  mutation UpdatePhoneVerification($userId: String!, $secret: String!) {\n    accountUpdatePhoneVerification(userId: $userId, secret: $secret) {\n      expire\n    }\n  }\n": typeof types.UpdatePhoneVerificationDocument,
    "\n  mutation UpdatePrefs($prefs: Assoc!) {\n    accountUpdatePrefs(prefs: $prefs) {\n      prefs {\n        data\n      }\n    }\n  }\n": typeof types.UpdatePrefsDocument,
    "\n  mutation UpdatePushTarget($targetId: String!, $identifier: String!) {\n    accountUpdatePushTarget(targetId: $targetId, identifier: $identifier) {\n      _id\n      userId\n      providerType\n      identifier\n    }\n  }\n": typeof types.UpdatePushTargetDocument,
    "\n  mutation UpdateSession($sessionId: String!) {\n    accountUpdateSession(sessionId: $sessionId) {\n      userId\n      expire\n      current\n    }\n  }\n": typeof types.UpdateSessionDocument,
    "\n  mutation UpdateStatus {\n    accountUpdateStatus {\n      _id\n      status\n    }\n  }\n": typeof types.UpdateStatusDocument,
    "\n  mutation UpdateVerification($userId: String!, $secret: String!) {\n    accountUpdateVerification(userId: $userId, secret: $secret) {\n      secret\n      expire\n      userId\n    }\n  }\n": typeof types.UpdateVerificationDocument,
    "\n  query ListDocuments($databaseId: String!, $collectionId: String!, $queries: [String!]) {\n    databasesListDocuments(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      queries: $queries\n    ) {\n      total\n      documents {\n        _id\n        data\n      }\n    }\n  }\n": typeof types.ListDocumentsDocument,
    "\n  mutation CreateDocument(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $data: Json!\n    $permissions: [String!]\n  ) {\n    databasesCreateDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      data: $data\n      permissions: $permissions\n    ) {\n      _id\n    }\n  }\n": typeof types.CreateDocumentDocument,
    "\n  mutation CreateDocuments($databaseId: String!, $collectionId: String!, $documents: [Json!]!) {\n    databasesCreateDocuments(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documents: $documents\n    ) {\n      total\n      documents {\n        _id\n      }\n    }\n  }\n": typeof types.CreateDocumentsDocument,
    "\n  mutation CreateOperations($transactionId: String!, $operations: [String!]) {\n    databasesCreateOperations(transactionId: $transactionId, operations: $operations) {\n      _id\n      status\n      operations\n      expiresAt\n    }\n  }\n": typeof types.CreateOperationsDocument,
    "\n  mutation CreateTransaction($ttl: Int) {\n    databasesCreateTransaction(ttl: $ttl) {\n      _id\n      status\n      operations\n      expiresAt\n    }\n  }\n": typeof types.CreateTransactionDocument,
    "\n  mutation DecrementDocumentAttribute(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $attribute: String!\n    $value: Int\n    $min: Int\n  ) {\n    databasesDecrementDocumentAttribute(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      attribute: $attribute\n      value: $value\n      min: $min\n    ) {\n      _id\n      data\n    }\n  }\n": typeof types.DecrementDocumentAttributeDocument,
    "\n  mutation DeleteDocument($databaseId: String!, $collectionId: String!, $documentId: String!) {\n    databasesDeleteDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n    ) {\n      status\n    }\n  }\n": typeof types.DeleteDocumentDocument,
    "\n  mutation DeleteDocuments($databaseId: String!, $collectionId: String!, $queries: [String!]) {\n    databasesDeleteDocuments(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      queries: $queries\n    ) {\n      total\n      documents {\n        _id\n      }\n    }\n  }\n": typeof types.DeleteDocumentsDocument,
    "\n  mutation DeleteTransaction($transactionId: String!) {\n    databasesDeleteTransaction(transactionId: $transactionId) {\n      status\n    }\n  }\n": typeof types.DeleteTransactionDocument,
    "\n  query GetDocument($databaseId: String!, $collectionId: String!, $documentId: String!) {\n    databasesGetDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n    ) {\n      _id\n      data\n    }\n  }\n": typeof types.GetDocumentDocument,
    "\n  query GetTransaction($transactionId: String!) {\n    databasesGetTransaction(transactionId: $transactionId) {\n      _id\n      _createdAt\n      _updatedAt\n      status\n      operations\n      expiresAt\n    }\n  }\n": typeof types.GetTransactionDocument,
    "\n  mutation IncrementDocumentAttribute(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $attribute: String!\n    $value: Int\n    $max: Int\n  ) {\n    databasesIncrementDocumentAttribute(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      attribute: $attribute\n      value: $value\n      max: $max\n    ) {\n      _id\n      data\n    }\n  }\n": typeof types.IncrementDocumentAttributeDocument,
    "\n  query ListTransactions($queries: String) {\n    databasesListTransactions(queries: $queries) {\n      total\n      transactions {\n        _id\n        _createdAt\n        _updatedAt\n        status\n        operations\n        expiresAt\n      }\n    }\n  }\n": typeof types.ListTransactionsDocument,
    "\n  mutation UpdateDocument(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $data: Json\n    $permissions: [String!]\n  ) {\n    databasesUpdateDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      data: $data\n      permissions: $permissions\n    ) {\n      _id\n    }\n  }\n": typeof types.UpdateDocumentDocument,
    "\n  mutation UpdateDocuments(\n    $databaseId: String!\n    $collectionId: String!\n    $data: Json\n    $queries: [String!]\n  ) {\n    databasesUpdateDocuments(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      data: $data\n      queries: $queries\n    ) {\n      total\n      documents {\n        _id\n      }\n    }\n  }\n": typeof types.UpdateDocumentsDocument,
    "\n  mutation UpdateTransaction($transactionId: String!, $commit: Boolean, $rollback: Boolean) {\n    databasesUpdateTransaction(\n      transactionId: $transactionId\n      commit: $commit\n      rollback: $rollback\n    ) {\n      _id\n      status\n      operations\n    }\n  }\n": typeof types.UpdateTransactionDocument,
    "\n  mutation UpsertDocument(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $data: Json!\n    $permissions: [String!]\n  ) {\n    databasesUpsertDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      data: $data\n      permissions: $permissions\n    ) {\n      _id\n    }\n  }\n": typeof types.UpsertDocumentDocument,
    "\n  mutation CreateExecution(\n    $functionId: String!\n    $body: String\n    $async: Boolean\n    $path: String\n    $method: String\n    $headers: Json\n    $scheduledAt: String\n  ) {\n    functionsCreateExecution(\n      functionId: $functionId\n      body: $body\n      async: $async\n      path: $path\n      method: $method\n      headers: $headers\n      scheduledAt: $scheduledAt\n    ) {\n      _id\n      status\n      responseStatusCode\n      responseBody\n      errors\n      duration\n    }\n  }\n": typeof types.CreateExecutionDocument,
    "\n  query GetFunctionExecution($functionId: String!, $executionId: String!) {\n    functionsGetExecution(functionId: $functionId, executionId: $executionId) {\n      status\n      errors\n      duration\n      responseBody\n      requestPath\n    }\n  }\n": typeof types.GetFunctionExecutionDocument,
    "\n  query GetExecution($functionId: String!, $executionId: String!) {\n    functionsGetExecution(functionId: $functionId, executionId: $executionId) {\n      _id\n      _createdAt\n      _updatedAt\n      functionId\n      trigger\n      status\n      requestMethod\n      requestPath\n      responseStatusCode\n      responseBody\n      errors\n      duration\n    }\n  }\n": typeof types.GetExecutionDocument,
    "\n  query ListExecutions($functionId: String!, $queries: [String!]) {\n    functionsListExecutions(functionId: $functionId, queries: $queries) {\n      total\n      executions {\n        _id\n        _createdAt\n        _updatedAt\n        functionId\n        trigger\n        status\n        requestMethod\n        requestPath\n        responseStatusCode\n        responseBody\n        errors\n        duration\n      }\n    }\n  }\n": typeof types.ListExecutionsDocument,
    "\n  query GetLocale {\n    localeGet {\n      ip\n      countryCode\n      country\n      continentCode\n      continent\n      eu\n      currency\n    }\n  }\n": typeof types.GetLocaleDocument,
    "\n  query ListLocaleCodes {\n    localeListCodes {\n      total\n      localeCodes {\n        code\n        name\n      }\n    }\n  }\n": typeof types.ListLocaleCodesDocument,
    "\n  query ListContinents {\n    localeListContinents {\n      total\n      continents {\n        name\n        code\n      }\n    }\n  }\n": typeof types.ListContinentsDocument,
    "\n  query ListCountries {\n    localeListCountries {\n      total\n      countries {\n        name\n        code\n      }\n    }\n  }\n": typeof types.ListCountriesDocument,
    "\n  query ListCountriesEU {\n    localeListCountriesEU {\n      total\n      countries {\n        name\n        code\n      }\n    }\n  }\n": typeof types.ListCountriesEuDocument,
    "\n  query ListCountriesPhones {\n    localeListCountriesPhones {\n      total\n      phones {\n        code\n        countryCode\n        countryName\n      }\n    }\n  }\n": typeof types.ListCountriesPhonesDocument,
    "\n  query ListCurrencies {\n    localeListCurrencies {\n      total\n      currencies {\n        symbol\n        name\n        symbolNative\n        decimalDigits\n        rounding\n        code\n        namePlural\n      }\n    }\n  }\n": typeof types.ListCurrenciesDocument,
    "\n  query ListLanguages {\n    localeListLanguages {\n      total\n      languages {\n        name\n        code\n        nativeName\n      }\n    }\n  }\n": typeof types.ListLanguagesDocument,
    "\n  mutation DeleteFile($bucketId: String!, $fileId: String!) {\n    storageDeleteFile(bucketId: $bucketId, fileId: $fileId) {\n      status\n    }\n  }\n": typeof types.DeleteFileDocument,
    "\n  query GetFile($bucketId: String!, $fileId: String!) {\n    storageGetFile(bucketId: $bucketId, fileId: $fileId) {\n      _id\n      bucketId\n      _createdAt\n      _updatedAt\n      _permissions\n      name\n      signature\n      mimeType\n      sizeOriginal\n      chunksTotal\n      chunksUploaded\n    }\n  }\n": typeof types.GetFileDocument,
    "\n  query ListFiles($bucketId: String!, $queries: [String!], $search: String) {\n    storageListFiles(bucketId: $bucketId, queries: $queries, search: $search) {\n      total\n      files {\n        _id\n        bucketId\n        _createdAt\n        _updatedAt\n        _permissions\n        name\n        signature\n        mimeType\n        sizeOriginal\n        chunksTotal\n        chunksUploaded\n      }\n    }\n  }\n": typeof types.ListFilesDocument,
    "\n  mutation UpdateFile(\n    $bucketId: String!\n    $fileId: String!\n    $name: String\n    $permissions: [String!]\n  ) {\n    storageUpdateFile(\n      bucketId: $bucketId\n      fileId: $fileId\n      name: $name\n      permissions: $permissions\n    ) {\n      _id\n      bucketId\n      name\n      _permissions\n    }\n  }\n": typeof types.UpdateFileDocument,
    "\n  mutation CreateMembership(\n    $teamId: String!\n    $roles: [String!]!\n    $email: String\n    $userId: String\n    $phone: String\n    $url: String\n    $name: String\n  ) {\n    teamsCreateMembership(\n      teamId: $teamId\n      roles: $roles\n      email: $email\n      userId: $userId\n      phone: $phone\n      url: $url\n      name: $name\n    ) {\n      _id\n      userId\n      teamId\n      roles\n      confirm\n    }\n  }\n": typeof types.CreateMembershipDocument,
    "\n  mutation CreateTeam($teamId: String!, $name: String!, $roles: [String!]) {\n    teamsCreate(teamId: $teamId, name: $name, roles: $roles) {\n      _id\n      name\n      total\n    }\n  }\n": typeof types.CreateTeamDocument,
    "\n  mutation DeleteMembership($teamId: String!, $membershipId: String!) {\n    teamsDeleteMembership(teamId: $teamId, membershipId: $membershipId) {\n      status\n    }\n  }\n": typeof types.DeleteMembershipDocument,
    "\n  mutation DeleteTeam($teamId: String!) {\n    teamsDelete(teamId: $teamId) {\n      status\n    }\n  }\n": typeof types.DeleteTeamDocument,
    "\n  query GetTeam($teamId: String!) {\n    teamsGet(teamId: $teamId) {\n      _id\n      _createdAt\n      _updatedAt\n      name\n      total\n      prefs {\n        data\n      }\n    }\n  }\n": typeof types.GetTeamDocument,
    "\n  query GetMembership($teamId: String!, $membershipId: String!) {\n    teamsGetMembership(teamId: $teamId, membershipId: $membershipId) {\n      _id\n      _createdAt\n      _updatedAt\n      userId\n      userName\n      userEmail\n      teamId\n      teamName\n      invited\n      joined\n      confirm\n      mfa\n      roles\n    }\n  }\n": typeof types.GetMembershipDocument,
    "\n  query ListMemberships($teamId: String!, $queries: [String!], $search: String) {\n    teamsListMemberships(teamId: $teamId, queries: $queries, search: $search) {\n      total\n      memberships {\n        _id\n        _createdAt\n        _updatedAt\n        userId\n        userName\n        userEmail\n        teamId\n        teamName\n        invited\n        joined\n        confirm\n        mfa\n        roles\n      }\n    }\n  }\n": typeof types.ListMembershipsDocument,
    "\n  query GetTeamPrefs($teamId: String!) {\n    teamsGetPrefs(teamId: $teamId) {\n      data\n    }\n  }\n": typeof types.GetTeamPrefsDocument,
    "\n  query ListTeams($queries: [String!], $search: String) {\n    teamsList(queries: $queries, search: $search) {\n      total\n      teams {\n        _id\n        _createdAt\n        _updatedAt\n        name\n        total\n        prefs {\n          data\n        }\n      }\n    }\n  }\n": typeof types.ListTeamsDocument,
    "\n  mutation UpdateMembership($teamId: String!, $membershipId: String!, $roles: [String!]!) {\n    teamsUpdateMembership(teamId: $teamId, membershipId: $membershipId, roles: $roles) {\n      _id\n      roles\n    }\n  }\n": typeof types.UpdateMembershipDocument,
    "\n  mutation UpdateMembershipStatus(\n    $teamId: String!\n    $membershipId: String!\n    $userId: String!\n    $secret: String!\n  ) {\n    teamsUpdateMembershipStatus(\n      teamId: $teamId\n      membershipId: $membershipId\n      userId: $userId\n      secret: $secret\n    ) {\n      _id\n      confirm\n    }\n  }\n": typeof types.UpdateMembershipStatusDocument,
    "\n  mutation UpdateTeamName($teamId: String!, $name: String!) {\n    teamsUpdateName(teamId: $teamId, name: $name) {\n      _id\n      name\n    }\n  }\n": typeof types.UpdateTeamNameDocument,
    "\n  mutation UpdateTeamPrefs($teamId: String!, $prefs: Assoc!) {\n    teamsUpdatePrefs(teamId: $teamId, prefs: $prefs) {\n      data\n    }\n  }\n": typeof types.UpdateTeamPrefsDocument,
};
const documents: Documents = {
    "\n  fragment Account_User on User {\n    _id\n    name\n    email\n    prefs {\n      data\n    }\n  }\n": types.Account_UserFragmentDoc,
    "\n  fragment Identity_Provider on Identity {\n    _id\n    userId\n    provider\n  }\n": types.Identity_ProviderFragmentDoc,
    "\n  query AccountGet {\n    accountGet {\n      ...Account_User\n    }\n  }\n": types.AccountGetDocument,
    "\n  mutation CreateAnonymousSession {\n    accountCreateAnonymousSession {\n      _id\n      expire\n      current\n    }\n  }\n": types.CreateAnonymousSessionDocument,
    "\n  mutation CreateEmailToken($userId: String!, $email: String!, $phrase: Boolean) {\n    accountCreateEmailToken(userId: $userId, email: $email, phrase: $phrase) {\n      expire\n    }\n  }\n": types.CreateEmailTokenDocument,
    "\n  mutation CreateEmailVerification($url: String!) {\n    accountCreateEmailVerification(url: $url) {\n      _id\n      userId\n      secret\n      expire\n    }\n  }\n": types.CreateEmailVerificationDocument,
    "\n  mutation CreateJWT {\n    accountCreateJWT {\n      jwt\n    }\n  }\n": types.CreateJwtDocument,
    "\n  mutation CreateMagicURLToken($userId: String!, $email: String!, $url: String, $phrase: Boolean) {\n    accountCreateMagicURLToken(userId: $userId, email: $email, url: $url, phrase: $phrase) {\n      expire\n    }\n  }\n": types.CreateMagicUrlTokenDocument,
    "\n  mutation CreateMfaAuthenticator($type: String!) {\n    accountCreateMfaAuthenticator(type: $type) {\n      secret\n      uri\n    }\n  }\n": types.CreateMfaAuthenticatorDocument,
    "\n  mutation CreateMfaChallenge($factor: String!) {\n    accountCreateMfaChallenge(factor: $factor) {\n      _id\n      userId\n      expire\n    }\n  }\n": types.CreateMfaChallengeDocument,
    "\n  mutation CreateMfaRecoveryCodes {\n    accountCreateMfaRecoveryCodes {\n      recoveryCodes\n    }\n  }\n": types.CreateMfaRecoveryCodesDocument,
    "\n  mutation CreatePhoneToken($userId: String!, $phone: String!) {\n    accountCreatePhoneToken(userId: $userId, phone: $phone) {\n      expire\n    }\n  }\n": types.CreatePhoneTokenDocument,
    "\n  mutation CreatePhoneVerification {\n    accountCreatePhoneVerification {\n      expire\n    }\n  }\n": types.CreatePhoneVerificationDocument,
    "\n  mutation CreatePushTarget($targetId: String!, $identifier: String!, $providerId: String) {\n    accountCreatePushTarget(targetId: $targetId, identifier: $identifier, providerId: $providerId) {\n      _id\n      userId\n      providerType\n      identifier\n    }\n  }\n": types.CreatePushTargetDocument,
    "\n  mutation CreateSession($userId: String!, $secret: String!) {\n    accountCreateSession(userId: $userId, secret: $secret) {\n      userId\n      expire\n      current\n    }\n  }\n": types.CreateSessionDocument,
    "\n  mutation DeleteAccount {\n    accountDelete {\n      status\n    }\n  }\n": types.DeleteAccountDocument,
    "\n  mutation DeleteIdentity($identityId: String!) {\n    accountDeleteIdentity(identityId: $identityId) {\n      status\n    }\n  }\n": types.DeleteIdentityDocument,
    "\n  mutation DeleteMfaAuthenticator($type: String!) {\n    accountDeleteMfaAuthenticator(type: $type) {\n      status\n    }\n  }\n": types.DeleteMfaAuthenticatorDocument,
    "\n  mutation DeletePushTarget($targetId: String!) {\n    accountDeletePushTarget(targetId: $targetId) {\n      status\n    }\n  }\n": types.DeletePushTargetDocument,
    "\n  mutation DeleteSession($sessionId: String!) {\n    accountDeleteSession(sessionId: $sessionId) {\n      status\n    }\n  }\n": types.DeleteSessionDocument,
    "\n  mutation DeleteSessions {\n    accountDeleteSessions {\n      status\n    }\n  }\n": types.DeleteSessionsDocument,
    "\n  query GetMfaRecoveryCodes {\n    accountGetMfaRecoveryCodes {\n      recoveryCodes\n    }\n  }\n": types.GetMfaRecoveryCodesDocument,
    "\n  query GetPrefs {\n    accountGetPrefs {\n      data\n    }\n  }\n": types.GetPrefsDocument,
    "\n  query GetSession($sessionId: String!) {\n    accountGetSession(sessionId: $sessionId) {\n      userId\n      expire\n      current\n    }\n  }\n": types.GetSessionDocument,
    "\n  query ListIdentities {\n    accountListIdentities {\n      total\n      identities {\n        ...Identity_Provider\n      }\n    }\n  }\n": types.ListIdentitiesDocument,
    "\n  query ListMfaFactors {\n    accountListMfaFactors {\n      totp\n      phone\n      email\n    }\n  }\n": types.ListMfaFactorsDocument,
    "\n  query ListSessions {\n    accountListSessions {\n      sessions {\n        _id\n        _createdAt\n        osName\n        clientName\n      }\n    }\n  }\n": types.ListSessionsDocument,
    "\n  mutation CreateEmailPasswordSession($email: String!, $password: String!) {\n    accountCreateEmailPasswordSession(email: $email, password: $password) {\n      userId\n      expire\n      current\n    }\n  }\n": types.CreateEmailPasswordSessionDocument,
    "\n  query ListLogs($queries: [String!]) {\n    accountListLogs(queries: $queries) {\n      total\n      logs {\n        event\n        userId\n        userEmail\n        userName\n        mode\n        ip\n        time\n        osCode\n        osName\n        osVersion\n        clientType\n        clientCode\n        clientName\n        clientVersion\n        clientEngine\n        clientEngineVersion\n        deviceName\n        deviceBrand\n        deviceModel\n        countryCode\n        countryName\n      }\n    }\n  }\n": types.ListLogsDocument,
    "\n  mutation CreateRecovery($email: String!, $url: String!) {\n    accountCreateRecovery(email: $email, url: $url) {\n      expire\n    }\n  }\n": types.CreateRecoveryDocument,
    "\n  mutation UpdateRecovery($userId: String!, $secret: String!, $password: String!) {\n    accountUpdateRecovery(userId: $userId, secret: $secret, password: $password) {\n      expire\n    }\n  }\n": types.UpdateRecoveryDocument,
    "\n  mutation CreateAccount($userId: String!, $name: String, $email: String!, $password: String!) {\n    accountCreate(userId: $userId, name: $name, email: $email, password: $password) {\n      name\n      email\n    }\n  }\n": types.CreateAccountDocument,
    "\n  mutation VerifyEmail($url: String!) {\n    accountCreateVerification(url: $url) {\n      expire\n    }\n  }\n": types.VerifyEmailDocument,
    "\n  mutation UpdateEmail($email: String!, $password: String!) {\n    accountUpdateEmail(email: $email, password: $password) {\n      name\n      email\n    }\n  }\n": types.UpdateEmailDocument,
    "\n  mutation UpdateEmailVerification($userId: String!, $secret: String!) {\n    accountUpdateEmailVerification(userId: $userId, secret: $secret) {\n      _id\n      userId\n      secret\n      expire\n    }\n  }\n": types.UpdateEmailVerificationDocument,
    "\n  mutation UpdateMagicURLSession($userId: String!, $secret: String!) {\n    accountUpdateMagicURLSession(userId: $userId, secret: $secret) {\n      userId\n      expire\n      current\n    }\n  }\n": types.UpdateMagicUrlSessionDocument,
    "\n  mutation UpdateMFA($mfa: Boolean!) {\n    accountUpdateMFA(mfa: $mfa) {\n      mfa\n    }\n  }\n": types.UpdateMfaDocument,
    "\n  mutation UpdateMfaAuthenticator($type: String!, $otp: String!) {\n    accountUpdateMfaAuthenticator(type: $type, otp: $otp) {\n      mfa\n    }\n  }\n": types.UpdateMfaAuthenticatorDocument,
    "\n  mutation UpdateMfaChallenge($challengeId: String!, $otp: String!) {\n    accountUpdateMfaChallenge(challengeId: $challengeId, otp: $otp) {\n      _id\n      userId\n      expire\n      current\n    }\n  }\n": types.UpdateMfaChallengeDocument,
    "\n  mutation UpdateMfaRecoveryCodes {\n    accountUpdateMfaRecoveryCodes {\n      recoveryCodes\n    }\n  }\n": types.UpdateMfaRecoveryCodesDocument,
    "\n  mutation UpdateName($name: String!) {\n    accountUpdateName(name: $name) {\n      name\n    }\n  }\n": types.UpdateNameDocument,
    "\n  mutation UpdatePassword($password: String!, $oldPassword: String!) {\n    accountUpdatePassword(password: $password, oldPassword: $oldPassword) {\n      status\n    }\n  }\n": types.UpdatePasswordDocument,
    "\n  mutation UpdatePhone($phone: String!, $password: String!) {\n    accountUpdatePhone(phone: $phone, password: $password) {\n      phone\n    }\n  }\n": types.UpdatePhoneDocument,
    "\n  mutation UpdatePhoneSession($userId: String!, $secret: String!) {\n    accountUpdatePhoneSession(userId: $userId, secret: $secret) {\n      userId\n      expire\n      current\n    }\n  }\n": types.UpdatePhoneSessionDocument,
    "\n  mutation UpdatePhoneVerification($userId: String!, $secret: String!) {\n    accountUpdatePhoneVerification(userId: $userId, secret: $secret) {\n      expire\n    }\n  }\n": types.UpdatePhoneVerificationDocument,
    "\n  mutation UpdatePrefs($prefs: Assoc!) {\n    accountUpdatePrefs(prefs: $prefs) {\n      prefs {\n        data\n      }\n    }\n  }\n": types.UpdatePrefsDocument,
    "\n  mutation UpdatePushTarget($targetId: String!, $identifier: String!) {\n    accountUpdatePushTarget(targetId: $targetId, identifier: $identifier) {\n      _id\n      userId\n      providerType\n      identifier\n    }\n  }\n": types.UpdatePushTargetDocument,
    "\n  mutation UpdateSession($sessionId: String!) {\n    accountUpdateSession(sessionId: $sessionId) {\n      userId\n      expire\n      current\n    }\n  }\n": types.UpdateSessionDocument,
    "\n  mutation UpdateStatus {\n    accountUpdateStatus {\n      _id\n      status\n    }\n  }\n": types.UpdateStatusDocument,
    "\n  mutation UpdateVerification($userId: String!, $secret: String!) {\n    accountUpdateVerification(userId: $userId, secret: $secret) {\n      secret\n      expire\n      userId\n    }\n  }\n": types.UpdateVerificationDocument,
    "\n  query ListDocuments($databaseId: String!, $collectionId: String!, $queries: [String!]) {\n    databasesListDocuments(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      queries: $queries\n    ) {\n      total\n      documents {\n        _id\n        data\n      }\n    }\n  }\n": types.ListDocumentsDocument,
    "\n  mutation CreateDocument(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $data: Json!\n    $permissions: [String!]\n  ) {\n    databasesCreateDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      data: $data\n      permissions: $permissions\n    ) {\n      _id\n    }\n  }\n": types.CreateDocumentDocument,
    "\n  mutation CreateDocuments($databaseId: String!, $collectionId: String!, $documents: [Json!]!) {\n    databasesCreateDocuments(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documents: $documents\n    ) {\n      total\n      documents {\n        _id\n      }\n    }\n  }\n": types.CreateDocumentsDocument,
    "\n  mutation CreateOperations($transactionId: String!, $operations: [String!]) {\n    databasesCreateOperations(transactionId: $transactionId, operations: $operations) {\n      _id\n      status\n      operations\n      expiresAt\n    }\n  }\n": types.CreateOperationsDocument,
    "\n  mutation CreateTransaction($ttl: Int) {\n    databasesCreateTransaction(ttl: $ttl) {\n      _id\n      status\n      operations\n      expiresAt\n    }\n  }\n": types.CreateTransactionDocument,
    "\n  mutation DecrementDocumentAttribute(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $attribute: String!\n    $value: Int\n    $min: Int\n  ) {\n    databasesDecrementDocumentAttribute(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      attribute: $attribute\n      value: $value\n      min: $min\n    ) {\n      _id\n      data\n    }\n  }\n": types.DecrementDocumentAttributeDocument,
    "\n  mutation DeleteDocument($databaseId: String!, $collectionId: String!, $documentId: String!) {\n    databasesDeleteDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n    ) {\n      status\n    }\n  }\n": types.DeleteDocumentDocument,
    "\n  mutation DeleteDocuments($databaseId: String!, $collectionId: String!, $queries: [String!]) {\n    databasesDeleteDocuments(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      queries: $queries\n    ) {\n      total\n      documents {\n        _id\n      }\n    }\n  }\n": types.DeleteDocumentsDocument,
    "\n  mutation DeleteTransaction($transactionId: String!) {\n    databasesDeleteTransaction(transactionId: $transactionId) {\n      status\n    }\n  }\n": types.DeleteTransactionDocument,
    "\n  query GetDocument($databaseId: String!, $collectionId: String!, $documentId: String!) {\n    databasesGetDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n    ) {\n      _id\n      data\n    }\n  }\n": types.GetDocumentDocument,
    "\n  query GetTransaction($transactionId: String!) {\n    databasesGetTransaction(transactionId: $transactionId) {\n      _id\n      _createdAt\n      _updatedAt\n      status\n      operations\n      expiresAt\n    }\n  }\n": types.GetTransactionDocument,
    "\n  mutation IncrementDocumentAttribute(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $attribute: String!\n    $value: Int\n    $max: Int\n  ) {\n    databasesIncrementDocumentAttribute(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      attribute: $attribute\n      value: $value\n      max: $max\n    ) {\n      _id\n      data\n    }\n  }\n": types.IncrementDocumentAttributeDocument,
    "\n  query ListTransactions($queries: String) {\n    databasesListTransactions(queries: $queries) {\n      total\n      transactions {\n        _id\n        _createdAt\n        _updatedAt\n        status\n        operations\n        expiresAt\n      }\n    }\n  }\n": types.ListTransactionsDocument,
    "\n  mutation UpdateDocument(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $data: Json\n    $permissions: [String!]\n  ) {\n    databasesUpdateDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      data: $data\n      permissions: $permissions\n    ) {\n      _id\n    }\n  }\n": types.UpdateDocumentDocument,
    "\n  mutation UpdateDocuments(\n    $databaseId: String!\n    $collectionId: String!\n    $data: Json\n    $queries: [String!]\n  ) {\n    databasesUpdateDocuments(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      data: $data\n      queries: $queries\n    ) {\n      total\n      documents {\n        _id\n      }\n    }\n  }\n": types.UpdateDocumentsDocument,
    "\n  mutation UpdateTransaction($transactionId: String!, $commit: Boolean, $rollback: Boolean) {\n    databasesUpdateTransaction(\n      transactionId: $transactionId\n      commit: $commit\n      rollback: $rollback\n    ) {\n      _id\n      status\n      operations\n    }\n  }\n": types.UpdateTransactionDocument,
    "\n  mutation UpsertDocument(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $data: Json!\n    $permissions: [String!]\n  ) {\n    databasesUpsertDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      data: $data\n      permissions: $permissions\n    ) {\n      _id\n    }\n  }\n": types.UpsertDocumentDocument,
    "\n  mutation CreateExecution(\n    $functionId: String!\n    $body: String\n    $async: Boolean\n    $path: String\n    $method: String\n    $headers: Json\n    $scheduledAt: String\n  ) {\n    functionsCreateExecution(\n      functionId: $functionId\n      body: $body\n      async: $async\n      path: $path\n      method: $method\n      headers: $headers\n      scheduledAt: $scheduledAt\n    ) {\n      _id\n      status\n      responseStatusCode\n      responseBody\n      errors\n      duration\n    }\n  }\n": types.CreateExecutionDocument,
    "\n  query GetFunctionExecution($functionId: String!, $executionId: String!) {\n    functionsGetExecution(functionId: $functionId, executionId: $executionId) {\n      status\n      errors\n      duration\n      responseBody\n      requestPath\n    }\n  }\n": types.GetFunctionExecutionDocument,
    "\n  query GetExecution($functionId: String!, $executionId: String!) {\n    functionsGetExecution(functionId: $functionId, executionId: $executionId) {\n      _id\n      _createdAt\n      _updatedAt\n      functionId\n      trigger\n      status\n      requestMethod\n      requestPath\n      responseStatusCode\n      responseBody\n      errors\n      duration\n    }\n  }\n": types.GetExecutionDocument,
    "\n  query ListExecutions($functionId: String!, $queries: [String!]) {\n    functionsListExecutions(functionId: $functionId, queries: $queries) {\n      total\n      executions {\n        _id\n        _createdAt\n        _updatedAt\n        functionId\n        trigger\n        status\n        requestMethod\n        requestPath\n        responseStatusCode\n        responseBody\n        errors\n        duration\n      }\n    }\n  }\n": types.ListExecutionsDocument,
    "\n  query GetLocale {\n    localeGet {\n      ip\n      countryCode\n      country\n      continentCode\n      continent\n      eu\n      currency\n    }\n  }\n": types.GetLocaleDocument,
    "\n  query ListLocaleCodes {\n    localeListCodes {\n      total\n      localeCodes {\n        code\n        name\n      }\n    }\n  }\n": types.ListLocaleCodesDocument,
    "\n  query ListContinents {\n    localeListContinents {\n      total\n      continents {\n        name\n        code\n      }\n    }\n  }\n": types.ListContinentsDocument,
    "\n  query ListCountries {\n    localeListCountries {\n      total\n      countries {\n        name\n        code\n      }\n    }\n  }\n": types.ListCountriesDocument,
    "\n  query ListCountriesEU {\n    localeListCountriesEU {\n      total\n      countries {\n        name\n        code\n      }\n    }\n  }\n": types.ListCountriesEuDocument,
    "\n  query ListCountriesPhones {\n    localeListCountriesPhones {\n      total\n      phones {\n        code\n        countryCode\n        countryName\n      }\n    }\n  }\n": types.ListCountriesPhonesDocument,
    "\n  query ListCurrencies {\n    localeListCurrencies {\n      total\n      currencies {\n        symbol\n        name\n        symbolNative\n        decimalDigits\n        rounding\n        code\n        namePlural\n      }\n    }\n  }\n": types.ListCurrenciesDocument,
    "\n  query ListLanguages {\n    localeListLanguages {\n      total\n      languages {\n        name\n        code\n        nativeName\n      }\n    }\n  }\n": types.ListLanguagesDocument,
    "\n  mutation DeleteFile($bucketId: String!, $fileId: String!) {\n    storageDeleteFile(bucketId: $bucketId, fileId: $fileId) {\n      status\n    }\n  }\n": types.DeleteFileDocument,
    "\n  query GetFile($bucketId: String!, $fileId: String!) {\n    storageGetFile(bucketId: $bucketId, fileId: $fileId) {\n      _id\n      bucketId\n      _createdAt\n      _updatedAt\n      _permissions\n      name\n      signature\n      mimeType\n      sizeOriginal\n      chunksTotal\n      chunksUploaded\n    }\n  }\n": types.GetFileDocument,
    "\n  query ListFiles($bucketId: String!, $queries: [String!], $search: String) {\n    storageListFiles(bucketId: $bucketId, queries: $queries, search: $search) {\n      total\n      files {\n        _id\n        bucketId\n        _createdAt\n        _updatedAt\n        _permissions\n        name\n        signature\n        mimeType\n        sizeOriginal\n        chunksTotal\n        chunksUploaded\n      }\n    }\n  }\n": types.ListFilesDocument,
    "\n  mutation UpdateFile(\n    $bucketId: String!\n    $fileId: String!\n    $name: String\n    $permissions: [String!]\n  ) {\n    storageUpdateFile(\n      bucketId: $bucketId\n      fileId: $fileId\n      name: $name\n      permissions: $permissions\n    ) {\n      _id\n      bucketId\n      name\n      _permissions\n    }\n  }\n": types.UpdateFileDocument,
    "\n  mutation CreateMembership(\n    $teamId: String!\n    $roles: [String!]!\n    $email: String\n    $userId: String\n    $phone: String\n    $url: String\n    $name: String\n  ) {\n    teamsCreateMembership(\n      teamId: $teamId\n      roles: $roles\n      email: $email\n      userId: $userId\n      phone: $phone\n      url: $url\n      name: $name\n    ) {\n      _id\n      userId\n      teamId\n      roles\n      confirm\n    }\n  }\n": types.CreateMembershipDocument,
    "\n  mutation CreateTeam($teamId: String!, $name: String!, $roles: [String!]) {\n    teamsCreate(teamId: $teamId, name: $name, roles: $roles) {\n      _id\n      name\n      total\n    }\n  }\n": types.CreateTeamDocument,
    "\n  mutation DeleteMembership($teamId: String!, $membershipId: String!) {\n    teamsDeleteMembership(teamId: $teamId, membershipId: $membershipId) {\n      status\n    }\n  }\n": types.DeleteMembershipDocument,
    "\n  mutation DeleteTeam($teamId: String!) {\n    teamsDelete(teamId: $teamId) {\n      status\n    }\n  }\n": types.DeleteTeamDocument,
    "\n  query GetTeam($teamId: String!) {\n    teamsGet(teamId: $teamId) {\n      _id\n      _createdAt\n      _updatedAt\n      name\n      total\n      prefs {\n        data\n      }\n    }\n  }\n": types.GetTeamDocument,
    "\n  query GetMembership($teamId: String!, $membershipId: String!) {\n    teamsGetMembership(teamId: $teamId, membershipId: $membershipId) {\n      _id\n      _createdAt\n      _updatedAt\n      userId\n      userName\n      userEmail\n      teamId\n      teamName\n      invited\n      joined\n      confirm\n      mfa\n      roles\n    }\n  }\n": types.GetMembershipDocument,
    "\n  query ListMemberships($teamId: String!, $queries: [String!], $search: String) {\n    teamsListMemberships(teamId: $teamId, queries: $queries, search: $search) {\n      total\n      memberships {\n        _id\n        _createdAt\n        _updatedAt\n        userId\n        userName\n        userEmail\n        teamId\n        teamName\n        invited\n        joined\n        confirm\n        mfa\n        roles\n      }\n    }\n  }\n": types.ListMembershipsDocument,
    "\n  query GetTeamPrefs($teamId: String!) {\n    teamsGetPrefs(teamId: $teamId) {\n      data\n    }\n  }\n": types.GetTeamPrefsDocument,
    "\n  query ListTeams($queries: [String!], $search: String) {\n    teamsList(queries: $queries, search: $search) {\n      total\n      teams {\n        _id\n        _createdAt\n        _updatedAt\n        name\n        total\n        prefs {\n          data\n        }\n      }\n    }\n  }\n": types.ListTeamsDocument,
    "\n  mutation UpdateMembership($teamId: String!, $membershipId: String!, $roles: [String!]!) {\n    teamsUpdateMembership(teamId: $teamId, membershipId: $membershipId, roles: $roles) {\n      _id\n      roles\n    }\n  }\n": types.UpdateMembershipDocument,
    "\n  mutation UpdateMembershipStatus(\n    $teamId: String!\n    $membershipId: String!\n    $userId: String!\n    $secret: String!\n  ) {\n    teamsUpdateMembershipStatus(\n      teamId: $teamId\n      membershipId: $membershipId\n      userId: $userId\n      secret: $secret\n    ) {\n      _id\n      confirm\n    }\n  }\n": types.UpdateMembershipStatusDocument,
    "\n  mutation UpdateTeamName($teamId: String!, $name: String!) {\n    teamsUpdateName(teamId: $teamId, name: $name) {\n      _id\n      name\n    }\n  }\n": types.UpdateTeamNameDocument,
    "\n  mutation UpdateTeamPrefs($teamId: String!, $prefs: Assoc!) {\n    teamsUpdatePrefs(teamId: $teamId, prefs: $prefs) {\n      data\n    }\n  }\n": types.UpdateTeamPrefsDocument,
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
export function gql(source: "\n  fragment Identity_Provider on Identity {\n    _id\n    userId\n    provider\n  }\n"): (typeof documents)["\n  fragment Identity_Provider on Identity {\n    _id\n    userId\n    provider\n  }\n"];
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
export function gql(source: "\n  mutation CreateEmailVerification($url: String!) {\n    accountCreateEmailVerification(url: $url) {\n      _id\n      userId\n      secret\n      expire\n    }\n  }\n"): (typeof documents)["\n  mutation CreateEmailVerification($url: String!) {\n    accountCreateEmailVerification(url: $url) {\n      _id\n      userId\n      secret\n      expire\n    }\n  }\n"];
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
export function gql(source: "\n  mutation CreateMfaChallenge($factor: String!) {\n    accountCreateMfaChallenge(factor: $factor) {\n      _id\n      userId\n      expire\n    }\n  }\n"): (typeof documents)["\n  mutation CreateMfaChallenge($factor: String!) {\n    accountCreateMfaChallenge(factor: $factor) {\n      _id\n      userId\n      expire\n    }\n  }\n"];
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
export function gql(source: "\n  mutation CreatePushTarget($targetId: String!, $identifier: String!, $providerId: String) {\n    accountCreatePushTarget(targetId: $targetId, identifier: $identifier, providerId: $providerId) {\n      _id\n      userId\n      providerType\n      identifier\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePushTarget($targetId: String!, $identifier: String!, $providerId: String) {\n    accountCreatePushTarget(targetId: $targetId, identifier: $identifier, providerId: $providerId) {\n      _id\n      userId\n      providerType\n      identifier\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateSession($userId: String!, $secret: String!) {\n    accountCreateSession(userId: $userId, secret: $secret) {\n      userId\n      expire\n      current\n    }\n  }\n"): (typeof documents)["\n  mutation CreateSession($userId: String!, $secret: String!) {\n    accountCreateSession(userId: $userId, secret: $secret) {\n      userId\n      expire\n      current\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteAccount {\n    accountDelete {\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteAccount {\n    accountDelete {\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteIdentity($identityId: String!) {\n    accountDeleteIdentity(identityId: $identityId) {\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteIdentity($identityId: String!) {\n    accountDeleteIdentity(identityId: $identityId) {\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteMfaAuthenticator($type: String!) {\n    accountDeleteMfaAuthenticator(type: $type) {\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteMfaAuthenticator($type: String!) {\n    accountDeleteMfaAuthenticator(type: $type) {\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeletePushTarget($targetId: String!) {\n    accountDeletePushTarget(targetId: $targetId) {\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation DeletePushTarget($targetId: String!) {\n    accountDeletePushTarget(targetId: $targetId) {\n      status\n    }\n  }\n"];
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
export function gql(source: "\n  query ListIdentities {\n    accountListIdentities {\n      total\n      identities {\n        ...Identity_Provider\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListIdentities {\n    accountListIdentities {\n      total\n      identities {\n        ...Identity_Provider\n      }\n    }\n  }\n"];
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
export function gql(source: "\n  mutation UpdateRecovery($userId: String!, $secret: String!, $password: String!) {\n    accountUpdateRecovery(userId: $userId, secret: $secret, password: $password) {\n      expire\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateRecovery($userId: String!, $secret: String!, $password: String!) {\n    accountUpdateRecovery(userId: $userId, secret: $secret, password: $password) {\n      expire\n    }\n  }\n"];
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
export function gql(source: "\n  mutation UpdateEmailVerification($userId: String!, $secret: String!) {\n    accountUpdateEmailVerification(userId: $userId, secret: $secret) {\n      _id\n      userId\n      secret\n      expire\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateEmailVerification($userId: String!, $secret: String!) {\n    accountUpdateEmailVerification(userId: $userId, secret: $secret) {\n      _id\n      userId\n      secret\n      expire\n    }\n  }\n"];
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
export function gql(source: "\n  mutation UpdateMfaChallenge($challengeId: String!, $otp: String!) {\n    accountUpdateMfaChallenge(challengeId: $challengeId, otp: $otp) {\n      _id\n      userId\n      expire\n      current\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateMfaChallenge($challengeId: String!, $otp: String!) {\n    accountUpdateMfaChallenge(challengeId: $challengeId, otp: $otp) {\n      _id\n      userId\n      expire\n      current\n    }\n  }\n"];
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
export function gql(source: "\n  mutation UpdatePrefs($prefs: Assoc!) {\n    accountUpdatePrefs(prefs: $prefs) {\n      prefs {\n        data\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePrefs($prefs: Assoc!) {\n    accountUpdatePrefs(prefs: $prefs) {\n      prefs {\n        data\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdatePushTarget($targetId: String!, $identifier: String!) {\n    accountUpdatePushTarget(targetId: $targetId, identifier: $identifier) {\n      _id\n      userId\n      providerType\n      identifier\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePushTarget($targetId: String!, $identifier: String!) {\n    accountUpdatePushTarget(targetId: $targetId, identifier: $identifier) {\n      _id\n      userId\n      providerType\n      identifier\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateSession($sessionId: String!) {\n    accountUpdateSession(sessionId: $sessionId) {\n      userId\n      expire\n      current\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateSession($sessionId: String!) {\n    accountUpdateSession(sessionId: $sessionId) {\n      userId\n      expire\n      current\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateStatus {\n    accountUpdateStatus {\n      _id\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateStatus {\n    accountUpdateStatus {\n      _id\n      status\n    }\n  }\n"];
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
export function gql(source: "\n  mutation CreateDocument(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $data: Json!\n    $permissions: [String!]\n  ) {\n    databasesCreateDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      data: $data\n      permissions: $permissions\n    ) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateDocument(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $data: Json!\n    $permissions: [String!]\n  ) {\n    databasesCreateDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      data: $data\n      permissions: $permissions\n    ) {\n      _id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateDocuments($databaseId: String!, $collectionId: String!, $documents: [Json!]!) {\n    databasesCreateDocuments(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documents: $documents\n    ) {\n      total\n      documents {\n        _id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateDocuments($databaseId: String!, $collectionId: String!, $documents: [Json!]!) {\n    databasesCreateDocuments(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documents: $documents\n    ) {\n      total\n      documents {\n        _id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateOperations($transactionId: String!, $operations: [String!]) {\n    databasesCreateOperations(transactionId: $transactionId, operations: $operations) {\n      _id\n      status\n      operations\n      expiresAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateOperations($transactionId: String!, $operations: [String!]) {\n    databasesCreateOperations(transactionId: $transactionId, operations: $operations) {\n      _id\n      status\n      operations\n      expiresAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateTransaction($ttl: Int) {\n    databasesCreateTransaction(ttl: $ttl) {\n      _id\n      status\n      operations\n      expiresAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTransaction($ttl: Int) {\n    databasesCreateTransaction(ttl: $ttl) {\n      _id\n      status\n      operations\n      expiresAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DecrementDocumentAttribute(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $attribute: String!\n    $value: Int\n    $min: Int\n  ) {\n    databasesDecrementDocumentAttribute(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      attribute: $attribute\n      value: $value\n      min: $min\n    ) {\n      _id\n      data\n    }\n  }\n"): (typeof documents)["\n  mutation DecrementDocumentAttribute(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $attribute: String!\n    $value: Int\n    $min: Int\n  ) {\n    databasesDecrementDocumentAttribute(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      attribute: $attribute\n      value: $value\n      min: $min\n    ) {\n      _id\n      data\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteDocument($databaseId: String!, $collectionId: String!, $documentId: String!) {\n    databasesDeleteDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n    ) {\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteDocument($databaseId: String!, $collectionId: String!, $documentId: String!) {\n    databasesDeleteDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n    ) {\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteDocuments($databaseId: String!, $collectionId: String!, $queries: [String!]) {\n    databasesDeleteDocuments(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      queries: $queries\n    ) {\n      total\n      documents {\n        _id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteDocuments($databaseId: String!, $collectionId: String!, $queries: [String!]) {\n    databasesDeleteDocuments(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      queries: $queries\n    ) {\n      total\n      documents {\n        _id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteTransaction($transactionId: String!) {\n    databasesDeleteTransaction(transactionId: $transactionId) {\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteTransaction($transactionId: String!) {\n    databasesDeleteTransaction(transactionId: $transactionId) {\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetDocument($databaseId: String!, $collectionId: String!, $documentId: String!) {\n    databasesGetDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n    ) {\n      _id\n      data\n    }\n  }\n"): (typeof documents)["\n  query GetDocument($databaseId: String!, $collectionId: String!, $documentId: String!) {\n    databasesGetDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n    ) {\n      _id\n      data\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetTransaction($transactionId: String!) {\n    databasesGetTransaction(transactionId: $transactionId) {\n      _id\n      _createdAt\n      _updatedAt\n      status\n      operations\n      expiresAt\n    }\n  }\n"): (typeof documents)["\n  query GetTransaction($transactionId: String!) {\n    databasesGetTransaction(transactionId: $transactionId) {\n      _id\n      _createdAt\n      _updatedAt\n      status\n      operations\n      expiresAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation IncrementDocumentAttribute(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $attribute: String!\n    $value: Int\n    $max: Int\n  ) {\n    databasesIncrementDocumentAttribute(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      attribute: $attribute\n      value: $value\n      max: $max\n    ) {\n      _id\n      data\n    }\n  }\n"): (typeof documents)["\n  mutation IncrementDocumentAttribute(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $attribute: String!\n    $value: Int\n    $max: Int\n  ) {\n    databasesIncrementDocumentAttribute(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      attribute: $attribute\n      value: $value\n      max: $max\n    ) {\n      _id\n      data\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ListTransactions($queries: String) {\n    databasesListTransactions(queries: $queries) {\n      total\n      transactions {\n        _id\n        _createdAt\n        _updatedAt\n        status\n        operations\n        expiresAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListTransactions($queries: String) {\n    databasesListTransactions(queries: $queries) {\n      total\n      transactions {\n        _id\n        _createdAt\n        _updatedAt\n        status\n        operations\n        expiresAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateDocument(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $data: Json\n    $permissions: [String!]\n  ) {\n    databasesUpdateDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      data: $data\n      permissions: $permissions\n    ) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateDocument(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $data: Json\n    $permissions: [String!]\n  ) {\n    databasesUpdateDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      data: $data\n      permissions: $permissions\n    ) {\n      _id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateDocuments(\n    $databaseId: String!\n    $collectionId: String!\n    $data: Json\n    $queries: [String!]\n  ) {\n    databasesUpdateDocuments(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      data: $data\n      queries: $queries\n    ) {\n      total\n      documents {\n        _id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateDocuments(\n    $databaseId: String!\n    $collectionId: String!\n    $data: Json\n    $queries: [String!]\n  ) {\n    databasesUpdateDocuments(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      data: $data\n      queries: $queries\n    ) {\n      total\n      documents {\n        _id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateTransaction($transactionId: String!, $commit: Boolean, $rollback: Boolean) {\n    databasesUpdateTransaction(\n      transactionId: $transactionId\n      commit: $commit\n      rollback: $rollback\n    ) {\n      _id\n      status\n      operations\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateTransaction($transactionId: String!, $commit: Boolean, $rollback: Boolean) {\n    databasesUpdateTransaction(\n      transactionId: $transactionId\n      commit: $commit\n      rollback: $rollback\n    ) {\n      _id\n      status\n      operations\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpsertDocument(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $data: Json!\n    $permissions: [String!]\n  ) {\n    databasesUpsertDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      data: $data\n      permissions: $permissions\n    ) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation UpsertDocument(\n    $databaseId: String!\n    $collectionId: String!\n    $documentId: String!\n    $data: Json!\n    $permissions: [String!]\n  ) {\n    databasesUpsertDocument(\n      databaseId: $databaseId\n      collectionId: $collectionId\n      documentId: $documentId\n      data: $data\n      permissions: $permissions\n    ) {\n      _id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateExecution(\n    $functionId: String!\n    $body: String\n    $async: Boolean\n    $path: String\n    $method: String\n    $headers: Json\n    $scheduledAt: String\n  ) {\n    functionsCreateExecution(\n      functionId: $functionId\n      body: $body\n      async: $async\n      path: $path\n      method: $method\n      headers: $headers\n      scheduledAt: $scheduledAt\n    ) {\n      _id\n      status\n      responseStatusCode\n      responseBody\n      errors\n      duration\n    }\n  }\n"): (typeof documents)["\n  mutation CreateExecution(\n    $functionId: String!\n    $body: String\n    $async: Boolean\n    $path: String\n    $method: String\n    $headers: Json\n    $scheduledAt: String\n  ) {\n    functionsCreateExecution(\n      functionId: $functionId\n      body: $body\n      async: $async\n      path: $path\n      method: $method\n      headers: $headers\n      scheduledAt: $scheduledAt\n    ) {\n      _id\n      status\n      responseStatusCode\n      responseBody\n      errors\n      duration\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetFunctionExecution($functionId: String!, $executionId: String!) {\n    functionsGetExecution(functionId: $functionId, executionId: $executionId) {\n      status\n      errors\n      duration\n      responseBody\n      requestPath\n    }\n  }\n"): (typeof documents)["\n  query GetFunctionExecution($functionId: String!, $executionId: String!) {\n    functionsGetExecution(functionId: $functionId, executionId: $executionId) {\n      status\n      errors\n      duration\n      responseBody\n      requestPath\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetExecution($functionId: String!, $executionId: String!) {\n    functionsGetExecution(functionId: $functionId, executionId: $executionId) {\n      _id\n      _createdAt\n      _updatedAt\n      functionId\n      trigger\n      status\n      requestMethod\n      requestPath\n      responseStatusCode\n      responseBody\n      errors\n      duration\n    }\n  }\n"): (typeof documents)["\n  query GetExecution($functionId: String!, $executionId: String!) {\n    functionsGetExecution(functionId: $functionId, executionId: $executionId) {\n      _id\n      _createdAt\n      _updatedAt\n      functionId\n      trigger\n      status\n      requestMethod\n      requestPath\n      responseStatusCode\n      responseBody\n      errors\n      duration\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ListExecutions($functionId: String!, $queries: [String!]) {\n    functionsListExecutions(functionId: $functionId, queries: $queries) {\n      total\n      executions {\n        _id\n        _createdAt\n        _updatedAt\n        functionId\n        trigger\n        status\n        requestMethod\n        requestPath\n        responseStatusCode\n        responseBody\n        errors\n        duration\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListExecutions($functionId: String!, $queries: [String!]) {\n    functionsListExecutions(functionId: $functionId, queries: $queries) {\n      total\n      executions {\n        _id\n        _createdAt\n        _updatedAt\n        functionId\n        trigger\n        status\n        requestMethod\n        requestPath\n        responseStatusCode\n        responseBody\n        errors\n        duration\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetLocale {\n    localeGet {\n      ip\n      countryCode\n      country\n      continentCode\n      continent\n      eu\n      currency\n    }\n  }\n"): (typeof documents)["\n  query GetLocale {\n    localeGet {\n      ip\n      countryCode\n      country\n      continentCode\n      continent\n      eu\n      currency\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ListLocaleCodes {\n    localeListCodes {\n      total\n      localeCodes {\n        code\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListLocaleCodes {\n    localeListCodes {\n      total\n      localeCodes {\n        code\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ListContinents {\n    localeListContinents {\n      total\n      continents {\n        name\n        code\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListContinents {\n    localeListContinents {\n      total\n      continents {\n        name\n        code\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ListCountries {\n    localeListCountries {\n      total\n      countries {\n        name\n        code\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListCountries {\n    localeListCountries {\n      total\n      countries {\n        name\n        code\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ListCountriesEU {\n    localeListCountriesEU {\n      total\n      countries {\n        name\n        code\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListCountriesEU {\n    localeListCountriesEU {\n      total\n      countries {\n        name\n        code\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ListCountriesPhones {\n    localeListCountriesPhones {\n      total\n      phones {\n        code\n        countryCode\n        countryName\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListCountriesPhones {\n    localeListCountriesPhones {\n      total\n      phones {\n        code\n        countryCode\n        countryName\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ListCurrencies {\n    localeListCurrencies {\n      total\n      currencies {\n        symbol\n        name\n        symbolNative\n        decimalDigits\n        rounding\n        code\n        namePlural\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListCurrencies {\n    localeListCurrencies {\n      total\n      currencies {\n        symbol\n        name\n        symbolNative\n        decimalDigits\n        rounding\n        code\n        namePlural\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ListLanguages {\n    localeListLanguages {\n      total\n      languages {\n        name\n        code\n        nativeName\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListLanguages {\n    localeListLanguages {\n      total\n      languages {\n        name\n        code\n        nativeName\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteFile($bucketId: String!, $fileId: String!) {\n    storageDeleteFile(bucketId: $bucketId, fileId: $fileId) {\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteFile($bucketId: String!, $fileId: String!) {\n    storageDeleteFile(bucketId: $bucketId, fileId: $fileId) {\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetFile($bucketId: String!, $fileId: String!) {\n    storageGetFile(bucketId: $bucketId, fileId: $fileId) {\n      _id\n      bucketId\n      _createdAt\n      _updatedAt\n      _permissions\n      name\n      signature\n      mimeType\n      sizeOriginal\n      chunksTotal\n      chunksUploaded\n    }\n  }\n"): (typeof documents)["\n  query GetFile($bucketId: String!, $fileId: String!) {\n    storageGetFile(bucketId: $bucketId, fileId: $fileId) {\n      _id\n      bucketId\n      _createdAt\n      _updatedAt\n      _permissions\n      name\n      signature\n      mimeType\n      sizeOriginal\n      chunksTotal\n      chunksUploaded\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ListFiles($bucketId: String!, $queries: [String!], $search: String) {\n    storageListFiles(bucketId: $bucketId, queries: $queries, search: $search) {\n      total\n      files {\n        _id\n        bucketId\n        _createdAt\n        _updatedAt\n        _permissions\n        name\n        signature\n        mimeType\n        sizeOriginal\n        chunksTotal\n        chunksUploaded\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListFiles($bucketId: String!, $queries: [String!], $search: String) {\n    storageListFiles(bucketId: $bucketId, queries: $queries, search: $search) {\n      total\n      files {\n        _id\n        bucketId\n        _createdAt\n        _updatedAt\n        _permissions\n        name\n        signature\n        mimeType\n        sizeOriginal\n        chunksTotal\n        chunksUploaded\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateFile(\n    $bucketId: String!\n    $fileId: String!\n    $name: String\n    $permissions: [String!]\n  ) {\n    storageUpdateFile(\n      bucketId: $bucketId\n      fileId: $fileId\n      name: $name\n      permissions: $permissions\n    ) {\n      _id\n      bucketId\n      name\n      _permissions\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateFile(\n    $bucketId: String!\n    $fileId: String!\n    $name: String\n    $permissions: [String!]\n  ) {\n    storageUpdateFile(\n      bucketId: $bucketId\n      fileId: $fileId\n      name: $name\n      permissions: $permissions\n    ) {\n      _id\n      bucketId\n      name\n      _permissions\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateMembership(\n    $teamId: String!\n    $roles: [String!]!\n    $email: String\n    $userId: String\n    $phone: String\n    $url: String\n    $name: String\n  ) {\n    teamsCreateMembership(\n      teamId: $teamId\n      roles: $roles\n      email: $email\n      userId: $userId\n      phone: $phone\n      url: $url\n      name: $name\n    ) {\n      _id\n      userId\n      teamId\n      roles\n      confirm\n    }\n  }\n"): (typeof documents)["\n  mutation CreateMembership(\n    $teamId: String!\n    $roles: [String!]!\n    $email: String\n    $userId: String\n    $phone: String\n    $url: String\n    $name: String\n  ) {\n    teamsCreateMembership(\n      teamId: $teamId\n      roles: $roles\n      email: $email\n      userId: $userId\n      phone: $phone\n      url: $url\n      name: $name\n    ) {\n      _id\n      userId\n      teamId\n      roles\n      confirm\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateTeam($teamId: String!, $name: String!, $roles: [String!]) {\n    teamsCreate(teamId: $teamId, name: $name, roles: $roles) {\n      _id\n      name\n      total\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTeam($teamId: String!, $name: String!, $roles: [String!]) {\n    teamsCreate(teamId: $teamId, name: $name, roles: $roles) {\n      _id\n      name\n      total\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteMembership($teamId: String!, $membershipId: String!) {\n    teamsDeleteMembership(teamId: $teamId, membershipId: $membershipId) {\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteMembership($teamId: String!, $membershipId: String!) {\n    teamsDeleteMembership(teamId: $teamId, membershipId: $membershipId) {\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteTeam($teamId: String!) {\n    teamsDelete(teamId: $teamId) {\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteTeam($teamId: String!) {\n    teamsDelete(teamId: $teamId) {\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetTeam($teamId: String!) {\n    teamsGet(teamId: $teamId) {\n      _id\n      _createdAt\n      _updatedAt\n      name\n      total\n      prefs {\n        data\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetTeam($teamId: String!) {\n    teamsGet(teamId: $teamId) {\n      _id\n      _createdAt\n      _updatedAt\n      name\n      total\n      prefs {\n        data\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMembership($teamId: String!, $membershipId: String!) {\n    teamsGetMembership(teamId: $teamId, membershipId: $membershipId) {\n      _id\n      _createdAt\n      _updatedAt\n      userId\n      userName\n      userEmail\n      teamId\n      teamName\n      invited\n      joined\n      confirm\n      mfa\n      roles\n    }\n  }\n"): (typeof documents)["\n  query GetMembership($teamId: String!, $membershipId: String!) {\n    teamsGetMembership(teamId: $teamId, membershipId: $membershipId) {\n      _id\n      _createdAt\n      _updatedAt\n      userId\n      userName\n      userEmail\n      teamId\n      teamName\n      invited\n      joined\n      confirm\n      mfa\n      roles\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ListMemberships($teamId: String!, $queries: [String!], $search: String) {\n    teamsListMemberships(teamId: $teamId, queries: $queries, search: $search) {\n      total\n      memberships {\n        _id\n        _createdAt\n        _updatedAt\n        userId\n        userName\n        userEmail\n        teamId\n        teamName\n        invited\n        joined\n        confirm\n        mfa\n        roles\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListMemberships($teamId: String!, $queries: [String!], $search: String) {\n    teamsListMemberships(teamId: $teamId, queries: $queries, search: $search) {\n      total\n      memberships {\n        _id\n        _createdAt\n        _updatedAt\n        userId\n        userName\n        userEmail\n        teamId\n        teamName\n        invited\n        joined\n        confirm\n        mfa\n        roles\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetTeamPrefs($teamId: String!) {\n    teamsGetPrefs(teamId: $teamId) {\n      data\n    }\n  }\n"): (typeof documents)["\n  query GetTeamPrefs($teamId: String!) {\n    teamsGetPrefs(teamId: $teamId) {\n      data\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ListTeams($queries: [String!], $search: String) {\n    teamsList(queries: $queries, search: $search) {\n      total\n      teams {\n        _id\n        _createdAt\n        _updatedAt\n        name\n        total\n        prefs {\n          data\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListTeams($queries: [String!], $search: String) {\n    teamsList(queries: $queries, search: $search) {\n      total\n      teams {\n        _id\n        _createdAt\n        _updatedAt\n        name\n        total\n        prefs {\n          data\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateMembership($teamId: String!, $membershipId: String!, $roles: [String!]!) {\n    teamsUpdateMembership(teamId: $teamId, membershipId: $membershipId, roles: $roles) {\n      _id\n      roles\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateMembership($teamId: String!, $membershipId: String!, $roles: [String!]!) {\n    teamsUpdateMembership(teamId: $teamId, membershipId: $membershipId, roles: $roles) {\n      _id\n      roles\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateMembershipStatus(\n    $teamId: String!\n    $membershipId: String!\n    $userId: String!\n    $secret: String!\n  ) {\n    teamsUpdateMembershipStatus(\n      teamId: $teamId\n      membershipId: $membershipId\n      userId: $userId\n      secret: $secret\n    ) {\n      _id\n      confirm\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateMembershipStatus(\n    $teamId: String!\n    $membershipId: String!\n    $userId: String!\n    $secret: String!\n  ) {\n    teamsUpdateMembershipStatus(\n      teamId: $teamId\n      membershipId: $membershipId\n      userId: $userId\n      secret: $secret\n    ) {\n      _id\n      confirm\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateTeamName($teamId: String!, $name: String!) {\n    teamsUpdateName(teamId: $teamId, name: $name) {\n      _id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateTeamName($teamId: String!, $name: String!) {\n    teamsUpdateName(teamId: $teamId, name: $name) {\n      _id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateTeamPrefs($teamId: String!, $prefs: Assoc!) {\n    teamsUpdatePrefs(teamId: $teamId, prefs: $prefs) {\n      data\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateTeamPrefs($teamId: String!, $prefs: Assoc!) {\n    teamsUpdatePrefs(teamId: $teamId, prefs: $prefs) {\n      data\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;