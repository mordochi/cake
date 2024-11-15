// first connect coinbase wallet id is `coinbase`, but autoConnect coinbase wallet id is `coinbaseWalletSDK`
export const formatConnectorId = (connectorId: string) => {
  return connectorId.startsWith('coinbase') ? 'coinbaseWallet' : connectorId;
};
