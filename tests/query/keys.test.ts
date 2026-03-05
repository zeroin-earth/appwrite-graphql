import { describe, expect, test } from 'bun:test'

import { Keys } from '../../src/query/Keys'

describe('Query Keys', () => {
  describe('account keys', () => {
    test('account', () => {
      expect(Keys.account().key()).toEqual(['appwrite', 'account'])
    })

    test('account jwt', () => {
      expect(Keys.account().jwt().key()).toEqual(['appwrite', 'account', 'jwt'])
    })

    test('account anonymous', () => {
      expect(Keys.account().anonymous().key()).toEqual(['appwrite', 'account', 'anonymous'])
    })

    test('account emailToken', () => {
      expect(Keys.account().emailToken().key()).toEqual(['appwrite', 'account', 'emailToken'])
    })

    test('account emailVerification', () => {
      expect(Keys.account().emailVerification().key()).toEqual([
        'appwrite',
        'account',
        'emailVerification',
      ])
    })

    test('account magicUrl', () => {
      expect(Keys.account().magicUrl().key()).toEqual(['appwrite', 'account', 'magicUrl'])
    })

    test('account mfaAuthenticator', () => {
      expect(Keys.account().mfaAuthenticator().key()).toEqual([
        'appwrite',
        'account',
        'mfaAuthenticator',
      ])
    })

    test('account mfaChallenge', () => {
      expect(Keys.account().mfaChallenge().key()).toEqual(['appwrite', 'account', 'mfaChallenge'])
    })

    test('account mfaCodes', () => {
      expect(Keys.account().mfaCodes().key()).toEqual(['appwrite', 'account', 'mfaCodes'])
    })

    test('account oauth2Token', () => {
      expect(Keys.account().oauth2Token().key()).toEqual(['appwrite', 'account', 'oauth2Token'])
    })

    test('account phoneToken', () => {
      expect(Keys.account().phoneToken().key()).toEqual(['appwrite', 'account', 'phoneToken'])
    })

    test('account phoneVerification', () => {
      expect(Keys.account().phoneVerification().key()).toEqual([
        'appwrite',
        'account',
        'phoneVerification',
      ])
    })

    test('account pushTarget', () => {
      expect(Keys.account().pushTarget().key()).toEqual(['appwrite', 'account', 'pushTarget'])
    })

    test('account identity', () => {
      expect(Keys.account().identity().key()).toEqual(['appwrite', 'account', 'identity'])
    })

    test('account prefs', () => {
      expect(Keys.account().prefs().key()).toEqual(['appwrite', 'account', 'prefs'])
    })

    test('account login', () => {
      expect(Keys.account().login().key()).toEqual(['appwrite', 'account', 'login'])
    })

    test('signUp', () => {
      expect(Keys.account().signUp().key()).toEqual(['appwrite', 'account', 'signUp'])
    })

    test('account name', () => {
      expect(Keys.account().name().key()).toEqual(['appwrite', 'account', 'name'])
    })

    test('account email', () => {
      expect(Keys.account().email().key()).toEqual(['appwrite', 'account', 'email'])
    })

    test('account phone', () => {
      expect(Keys.account().phone().key()).toEqual(['appwrite', 'account', 'phone'])
    })

    test('account password', () => {
      expect(Keys.account().password().key()).toEqual(['appwrite', 'account', 'password'])
    })

    test('account recovery', () => {
      expect(Keys.account().recovery().key()).toEqual(['appwrite', 'account', 'recovery'])
    })

    test('account mfa', () => {
      expect(Keys.account().mfa().key()).toEqual(['appwrite', 'account', 'mfa'])
    })

    test('account status', () => {
      expect(Keys.account().status().key()).toEqual(['appwrite', 'account', 'status'])
    })

    test('account logs', () => {
      expect(Keys.account().logs().key()).toEqual(['appwrite', 'account', 'logs'])
    })

    test('account verifications', () => {
      expect(Keys.account().verification().key()).toEqual(['appwrite', 'account', 'verification'])
    })

    test('account session', () => {
      expect(Keys.account().session('sessionId').key()).toEqual([
        'appwrite',
        'account',
        'sessions',
        'sessionId',
      ])
    })

    test('account sessions', () => {
      expect(Keys.account().sessions()).toEqual(['appwrite', 'account', 'sessions'])
    })

    test('account identities', () => {
      expect(Keys.account().identities()).toEqual(['appwrite', 'account', 'identities'])
    })

    test('account mfaFactors', () => {
      expect(Keys.account().mfaFactors()).toEqual(['appwrite', 'account', 'mfaFactors'])
    })
  })

  describe('database keys', () => {
    test('collections', () => {
      expect(Keys.database('databaseId').collections().key()).toEqual([
        'appwrite',
        'databases',
        'databaseId',
        'collections',
      ])
    })

    test('collection', () => {
      expect(Keys.database('databaseId').collection('collectionId').key()).toEqual([
        'appwrite',
        'databases',
        'databaseId',
        'collections',
        'collectionId',
      ])
    })

    test('transaction', () => {
      expect(Keys.database('databaseId').transaction('transactionId').key()).toEqual([
        'appwrite',
        'databases',
        'databaseId',
        'transactions',
        'transactionId',
      ])
    })

    test('transactions', () => {
      expect(Keys.database('databaseId').transactions().key()).toEqual([
        'appwrite',
        'databases',
        'databaseId',
        'transactions',
      ])
    })

    test('operations', () => {
      expect(Keys.database('databaseId').transaction('transactionId').operations().key()).toEqual([
        'appwrite',
        'databases',
        'databaseId',
        'transactions',
        'transactionId',
        'operations',
      ])
    })
  })

  describe('collection keys', () => {
    test('documents', () => {
      expect(Keys.database('databaseId').collection('collectionId').documents().key()).toEqual([
        'appwrite',
        'databases',
        'databaseId',
        'collections',
        'collectionId',
        'documents',
      ])
    })

    test('document', () => {
      expect(
        Keys.database('databaseId').collection('collectionId').document('documentId').key(),
      ).toEqual([
        'appwrite',
        'databases',
        'databaseId',
        'collections',
        'collectionId',
        'documents',
        'documentId',
      ])
    })
  })

  describe('tableDB keys', () => {
    test('tableDB', () => {
      expect(Keys.tablesDB('databaseId').key()).toEqual(['appwrite', 'tablesDB', 'databaseId'])
    })

    test('tableDB table', () => {
      expect(Keys.tablesDB('databaseId').table('tableId').key()).toEqual([
        'appwrite',
        'tablesDB',
        'databaseId',
        'table',
        'tableId',
      ])
    })

    test('tableDB table rows', () => {
      expect(Keys.tablesDB('databaseId').table('tableId').rows().key()).toEqual([
        'appwrite',
        'tablesDB',
        'databaseId',
        'table',
        'tableId',
        'rows',
      ])
    })

    test('tableDB table row', () => {
      expect(Keys.tablesDB('databaseId').table('tableId').row('rowId').key()).toEqual([
        'appwrite',
        'tablesDB',
        'databaseId',
        'table',
        'tableId',
        'row',
        'rowId',
      ])
    })
  })

  describe('bucket keys', () => {
    test('files', () => {
      expect(Keys.bucket('bucketId').files().key()).toEqual([
        'appwrite',
        'buckets',
        'bucketId',
        'files',
      ])
    })

    test('file', () => {
      expect(Keys.bucket('bucketId').file('fileId').key()).toEqual([
        'appwrite',
        'buckets',
        'bucketId',
        'files',
        'fileId',
      ])
    })
  })

  describe('functions keys', () => {
    test('executions', () => {
      expect(Keys.function('functionId').executions().key()).toEqual([
        'appwrite',
        'functions',
        'functionId',
        'executions',
      ])
    })

    test('execution', () => {
      expect(Keys.function('functionId').execution('executionId').key()).toEqual([
        'appwrite',
        'functions',
        'functionId',
        'executions',
        'executionId',
      ])
    })
  })

  describe('team keys', () => {
    test('teamName', () => {
      expect(Keys.team('teamId').teamName().key()).toEqual(['appwrite', 'teams', 'teamId', 'name'])
    })

    test('teamPrefs', () => {
      expect(Keys.team('teamId').teamPrefs().key()).toEqual([
        'appwrite',
        'teams',
        'teamId',
        'prefs',
      ])
    })

    test('memberships', () => {
      expect(Keys.team('teamId').memberships().key()).toEqual([
        'appwrite',
        'teams',
        'teamId',
        'memberships',
      ])
    })

    test('membership', () => {
      expect(Keys.team('teamId').membership('membershipId').key()).toEqual([
        'appwrite',
        'teams',
        'teamId',
        'memberships',
        'membershipId',
      ])
    })

    test('membershipStatus', () => {
      expect(Keys.team('teamId').membershipStatus().key()).toEqual([
        'appwrite',
        'teams',
        'teamId',
        'membershipStatus',
      ])
    })
  })

  describe('locale keys', () => {
    test('continents', () => {
      expect(Keys.locale().continents()).toEqual(['appwrite', 'locale', 'continents'])
    })

    test('countries', () => {
      expect(Keys.locale().countries()).toEqual(['appwrite', 'locale', 'countries'])
    })

    test('countriesEU', () => {
      expect(Keys.locale().countriesEU()).toEqual(['appwrite', 'locale', 'countriesEU'])
    })

    test('countriesPhones', () => {
      expect(Keys.locale().countriesPhones()).toEqual(['appwrite', 'locale', 'countriesPhones'])
    })

    test('currencies', () => {
      expect(Keys.locale().currencies()).toEqual(['appwrite', 'locale', 'currencies'])
    })

    test('languages', () => {
      expect(Keys.locale().languages()).toEqual(['appwrite', 'locale', 'languages'])
    })

    test('codes', () => {
      expect(Keys.locale().codes()).toEqual(['appwrite', 'locale', 'codes'])
    })
  })

  describe('messaging keys', () => {
    test('subscriber', () => {
      expect(Keys.messaging().subscriber().key()).toEqual(['appwrite', 'messaging', 'subscriber'])
    })
  })

  describe('actionable keys', () => {
    test('create', () => {
      expect(
        Keys.database('databaseId').collection('collectionId').document('documentId').create(),
      ).toEqual([
        'appwrite',
        'databases',
        'databaseId',
        'collections',
        'collectionId',
        'documents',
        'documentId',
        'create',
      ])
    })

    test('upsert', () => {
      expect(
        Keys.database('databaseId').collection('collectionId').document('documentId').upsert(),
      ).toEqual([
        'appwrite',
        'databases',
        'databaseId',
        'collections',
        'collectionId',
        'documents',
        'documentId',
        'upsert',
      ])
    })

    test('update', () => {
      expect(
        Keys.database('databaseId').collection('collectionId').document('documentId').update(),
      ).toEqual([
        'appwrite',
        'databases',
        'databaseId',
        'collections',
        'collectionId',
        'documents',
        'documentId',
        'update',
      ])
    })

    test('delete', () => {
      expect(
        Keys.database('databaseId').collection('collectionId').document('documentId').delete(),
      ).toEqual([
        'appwrite',
        'databases',
        'databaseId',
        'collections',
        'collectionId',
        'documents',
        'documentId',
        'delete',
      ])
    })
  })
})
