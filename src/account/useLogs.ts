import { UseQueryOptions } from '@tanstack/react-query'
import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { ListLogsQuery, ListLogsQueryVariables } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const accountListLogs = gql(/* GraphQL */ `
  query ListLogs($queries: [String!]) {
    accountListLogs(queries: $queries) {
      total
      logs {
        event
        userId
        userEmail
        userName
        mode
        ip
        time
        osCode
        osName
        osVersion
        clientType
        clientCode
        clientName
        clientVersion
        clientEngine
        clientEngineVersion
        deviceName
        deviceBrand
        deviceModel
        countryCode
        countryName
      }
    }
  }
`)

export function useLogs({ queries }: ListLogsQueryVariables) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<
    ListLogsQuery['accountListLogs'],
    AppwriteException,
    ListLogsQuery['accountListLogs']
  >({
    queryKey: ['appwrite', 'account', 'logs', queries],
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: accountListLogs,
        variables: {
          queries,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountListLogs
    },
  })

  return { ...queryResult }
}
