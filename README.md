# TipLink API Example
Create TipLink URL using API.

## Docs
[TipLink Docs](https://docs.tiplink.io/docs/getting-started/overview)

## How to make TipLink URL
1. Prepare wallet and fund SOL.
2. Create TipLink wallet.
3. Send SOL to TipLink wallet.

## Setup
### Install
```
% npm i
```

### Edit src/main.ts
Replace to your wallet private key. DO NOT SHARE PRIVATE KEY.  
You can export Private Key on Phantom.
```
const SECRET_KEY_BASE58 = 'qkT6L2d7CY3TP1idkij8UNhzwcfQJfdjvU8NMu4FKHokkPrTeXfhooeeqUsQr5rL8rhZrcroMr4T2CFxanvezgQ';
```

Replace to fund SOL(not Lamports) including transaction fee what you need.
```
const FUND_SOL = 0.000905;
```

Number of creation TipLink URLs.
```
const NUMBER_OF_TIPLINK_URL = 1; // e.g. 3: create three TipLink URLs
```

## Run
```
% ts-node src/main.ts
```

## Note
TipLink URL available for Mainnet-beta.