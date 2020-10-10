import fetch from 'node-fetch'
import { format, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
import { addDays } from 'date-fns'

const TZ = 'Europe/Oslo'  // Nord Pool API uses Oslo local time for timestamps
const HOURLY_PRICE_URL = (date: string) => 'https://www.nordpoolgroup.com/api/marketdata/page/10?endDate=' + date

export interface SpotPrice {
  price: number,
  start: Date,
  end: Date
}

export function fetchNordPoolSpotPrices(areaCode: string = 'FI'): Promise<SpotPrice[]> {
  const timeInOslo = utcToZonedTime(new Date(), TZ)
  const todayInOslo = format(timeInOslo, 'dd-MM-yyyy', { timeZone: TZ })
  const tomorrowInOslo = format(addDays(timeInOslo, 1), 'dd-MM-yyyy', { timeZone: TZ })

  return Promise.all([fetchPricesForDate(todayInOslo, areaCode), fetchPricesForDate(tomorrowInOslo, areaCode)])
    .then(res => [].concat.apply([], res))
}

function fetchPricesForDate(date: string, areaCode: string) {
  return fetch(HOURLY_PRICE_URL(date))
    .then(res => res.json())
    .then(json => parseResponse(json, areaCode))
}

function parseResponse(json: any, areaCode: string): SpotPrice[] {
  return json.data.Rows
    .filter(isNotExtraRow)
    .map((row: any) => parsePriceRow(row, areaCode))
    .filter((price: SpotPrice) => !isNaN(price.price))
}

function isNotExtraRow(row: any): any {
  return !row.IsExtraRow
}

function parsePriceRow(row: any, area: string): SpotPrice {
  return {
    start: zonedTimeToUtc(new Date(row.StartTime), TZ),
    end: zonedTimeToUtc(new Date(row.EndTime), TZ),
    price: parseFloatColumnValue(columnByName(row, area)),
  }
}

function parseFloatColumnValue(col: any): number {
  return parseFloat(col.Value.replace(/,/, '.').replace(/ /g, ''))
}

function columnByName(row: any, name: string): any {
  return row.Columns.find(nameFilter(name))
}

function nameFilter(name: string) {
  return (col: any) => col.Name === name
}