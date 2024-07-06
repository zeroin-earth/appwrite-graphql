import { gql } from '../__generated__'

export const Account_User = gql(/* GraphQL */ `
  fragment Account_User on User {
    _id
    name
    email
    prefs {
      data
    }
  }
`)

export const Identity_Provider = gql(/* GraphQL */ `
  fragment Identity_Provider on Identity {
    userId
    provider
  }
`)
