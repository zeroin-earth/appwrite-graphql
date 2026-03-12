export type NetworkAdapter = {
  listen: (callback: (isOnline: boolean) => void) => () => void
}
