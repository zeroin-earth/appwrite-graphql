import NetInfo from '@react-native-community/netinfo'

import type { NetworkAdapter } from '../types'

export function reactNativeNetworkAdapter(): NetworkAdapter {
  return {
    listen: (callback) => {
      const handleConnectivityChange = (state: { isConnected: boolean }) => {
        callback(state.isConnected)
      }

      const unsubscribe = NetInfo.addEventListener(handleConnectivityChange)

      // Initial status
      void NetInfo.fetch().then((state: { isConnected: boolean }) => {
        callback(state.isConnected)
      })

      return () => {
        unsubscribe()
      }
    },
  }
}
