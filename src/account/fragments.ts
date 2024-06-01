import { gql } from '../__generated__'

export const Account_UserFragment = gql(/* GraphQL */ `
  fragment Account_UserFragment on User {
    _id
    name
    email
    prefs {
      data
    }
  }
`)

export const Identity_ProviderFragment = gql(/* GraphQL */ `
  fragment Identity_ProviderFragment on Identity {
    userId
    provider
  }
`)
