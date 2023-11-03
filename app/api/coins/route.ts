import {CoinData} from "@/interfaces"

export async function GET() {
    const res = await fetch(`https://pro-api.coinmarketcap.com/v1/partners/flipside-crypto/fcas/listings/latest?limit=${10}`, {
        headers: {
            'X-CMC_PRO_API_KEY': process.env.COINMARKET_API_KEY!,
        }
    })
    const data = await res.json()

    const newData = {
        status: data.status,
        coinData: data.data.map((coin: CoinData) => {
            return ({id: coin.name?.toLowerCase(), symbol: coin.symbol})
        })
    }

    return Response.json(newData)   
  }