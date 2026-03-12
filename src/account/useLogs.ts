import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, QueryOptions } from '../types'
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

type Variables = VariablesOf<typeof accountListLogs>
type Result = ResultOf<typeof accountListLogs>['accountListLogs']

export function useLogs({ queries }: Variables, opts: QueryOptions = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
    queryKey: [...Keys.account().logs().key(), ...(queries ?? [])],
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
    ...opts,
  })

  return { ...queryResult }
}
