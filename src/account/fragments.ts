import { gql } from '../__generated__'

export const Account_UserFragment = gql(/* GraphQL */ `
  fragment Account_UserFragment on User {
    name
    email
    prefs {
      data
    }
  }
`)
