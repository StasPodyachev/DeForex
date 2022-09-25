# DeForex V1

[![Lint]TBD
[![Tests]TBD
[![Fuzz Testing]TBD
[![Mythx]TBD

This repository contains smart contracts and developer tools for DeForex V1 protocol which powers https://de-forex.vercel.app/

## What is DeForex?

DeForex V1 is an open protocol for trustless currency exchange. Users can trade currency pairs using leverage provided by Automated Leverage Pool (ALP). Suppliers can participate in liquidity providing for ALP and generate yield.

If we are talking about classical Forex, it consists of two layers.

First layer is the currency market, where big banks exchange huge amounts of USD for instance for Euro. For instance, a transnational corporation that produces beverages, has to pay out dividends in USD, but it has euros in its bank account. It calls the bank asking to exchange this euro to USD. And the bank goes to the Forex platform and makes the deal on behalf of the client. And such deals define the EUR/USD rate.

Now the second layer. Forex brokers, who work with physical persons, get the information feed about rates. Those brokers get bets from their clients and provide clients with leverage. This means, if the client has 100 dollars, with 10 000 x leverage he can buy euro for 1 000 000 dollars. And if the price of euros drops by at least one hundredth of a cent, the client will lose his bet. But the price of euros will go higher, even a small move will let the client earn and he will be able to make a profit. But in the user's interface it looks like the client is not doing a bet, but purchasing a long or short position for a significant amount. But we remember, he came just with one hundred bucks! It is made like this to link the second layer of forex to the first, basic one. So clients feel themselves as a specialist, a trader, not a player at the casino. And it’s ok. What we want is to make that casino equal for everybody and don't create conditions for bad brokers to cheat their clients. So we decided to start from assets with low volatility: stablecoins like DAI and USDT. If we take the last 12 months this pair demonstrates less volatility compared with traditional fiat currencies like EUR/USD, for instance. Let's take a look at our order form. This is a long trade, when the client buys DAI for USDt. He can choose, for instance, USDC or BUSD. Our system calculates maximal possible leverage for each pair, based on volatility and other parameters. Then the user chose Stop Loss level. It is like armor. If it is heavy, it will protect you better. And you have to pay more. In a long contract, it means how deep can your asset go down before you'll be liquidated. After signing the order, AMM takes it and lends ten x more money to buy the asset (DAI in our case) from the market. If the rate of the asset goes close to the SL level, client's position becomes liquidated, the asset is sold at the market and money lended has got back by the liquidity pool. If the rate of the asset goes up, the client can sign the message to close the position. In this case, the asset is sold at the market, lended money returns and the client gets his profit.

## Documentation

#### Whitepaper: in progress

For more comprehensive information about DeForex V1 you can read our whitepaper and project description on our [Notion Documentation](https://husky-breath-587.notion.site/DeForex-Leverage-ETH-Global-2022-Public-Documentation-6ff8f3befe8f45b2a1d6e856e94e14f2).

#### Technical Documentation

Check our full Documentation [here](https://husky-breath-587.notion.site/DeForex-Leverage-ETH-Global-2022-Public-Documentation-6ff8f3befe8f45b2a1d6e856e94e14f2) for more technical details.

## Smart contracts

Copy .env.example to .env and define all variables.

`yarn`

or

`npm install`

### Deploy & configure

```
yarn compile
npx hardhat deploy:all --network <network>
npx hardhat configure:all --network <network>
```

**network** - the following networks are supported in this code: `optimistic-kovan`, `mumbai`

### Verify

```
npx hardhat run scripts/verify.ts --network <network>
```

## Subgraph

`yarn`

or

`npm install`

### Deploy

```
yarn prepare:<network>
yarn codegen
yarn deploy:<network>
```

**network** - the following networks are supported in this code: `optimistic-kovan`, `mumbai`

## Frontend

`yarn start`
or
`npm run start`

## Testing

in progress.

## Contracts

You can find current contract addresses at deployed.json file.

## Security

#### Independent Audits

All production smart contracts will be going through independent audit.

#### Code Coverage

in progress

## Community.

Join our community at discord.
https://discord.gg/FSNWFS72

## Licensing

...

### Other Exceptions
