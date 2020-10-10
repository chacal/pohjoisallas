import { expect } from 'chai'
import 'mocha'
import { fetchNordPoolSpotPrices } from '../src'


describe('pohjoisallas', function () {
  this.timeout(5000)

  it('should return spot prices for the default (FI) area', async () => {
    const prices = await fetchNordPoolSpotPrices()
    expect(prices.length).to.be.gte(24)
  })
  it('should return spot prices for SE1 area', async () => {
    const prices = await fetchNordPoolSpotPrices('SE1')
    expect(prices.length).to.be.gte(24)
  })
})
