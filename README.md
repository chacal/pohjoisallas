## General 
`pohjoisallas` a is Typescript library for fetching Nord Pool spot electricity prices
from [Nord Pool's API](https://www.nordpoolgroup.com/api). No registration is required for using
the market data part of the API. 

## Installation

    npm install pohjoisallas

## Example

```typescript
import { fetchNordPoolSpotPrices } from 'pohjoisallas'

fetchNordPoolSpotPrices()
  .then(prices => console.log(prices))

/*
  Output:

  [
    {
      start: 2020-10-09T22:00:00.000Z,
      end: 2020-10-09T23:00:00.000Z,
      price: 16.97
    },
    {
      start: 2020-10-09T23:00:00.000Z,
      end: 2020-10-10T00:00:00.000Z,
      price: 16.04
    },
    ...
  ]
*/

```

Returned prices are in EUR/MWh. Prices for the next day are usually available in the afternoon (UTC) of the current day.