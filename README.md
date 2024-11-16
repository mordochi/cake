# CAKE

### WebSite: https://cake-topaz.vercel.app/

Cake is a DeFi management platform designed to make complex on-chain interactions as easy as eating cake. By utilizing ERC-7702 for account abstraction on EOA wallets, Cake delivers a Web2-like experience for effortless asset management. Users can monitor portfolios via the 1inch API’s wallet tracker, receive personalized yield farming notifications through Push Protocol, and seamlessly optimize DeFi positions across chains and asset types. Cake is focused on simplifying DeFi usability while maximizing users’ asset yields.
Key features include:

- Seamless Asset Transfers: Cross-chain and multi-asset position management to optimize yields with minimal effort.
- Advanced Portfolio Tracking: Integrated wallet tracking via the 1inch API for instant portfolio insights.
- Personalized Notifications: Push Protocol notifications tailored to individual DeFi needs, including position updates and high-yield pool alerts.
  By addressing the usability and efficiency gaps in DeFi, Cake empowers users to unlock the full potential of their assets with minimal friction.

## Technologies Used

- **Blockscout**: Verify contracts on Blockscout and direct users to Blockscout explorer.
- **Push Protocol**: We use Push Protocol to send the best APY yield information to users daily. Users can subscribe Push Protocol from our web app.
- **NounsDAO**: We’ve brought the design style of Nouns DAO into Cake Stake, combining it with the Cake brand to create a fun and unique identity.
- **1inch Dev Portal APIs**: Use 1inch api to fetch users' assets to let us to move current positions to another DeFi protocol.

## Installation

To set up CAKE on your local machine, follow these steps:

1. Running your local net!

   ```bash
       anvil -f https://mainnet.infura.io/v3/${INFURA_KEY} -ardfork prague --fork-block-number 21202319 --chain-id 1 --gas-price 1
   ```

1. Install the dependencies:

   ```bash
   yarn add
   ```

1. Configure environment variables:

   - Set up API keys and other necessary configurations in a `.env` file.

1. Start the application:
   ```bash
   yarn dev
   ```
