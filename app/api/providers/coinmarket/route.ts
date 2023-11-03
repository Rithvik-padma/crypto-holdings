
export async function GET(request: Request) {
    const {searchParams} = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const res = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`, {
        headers: {
            'X-CMC_PRO_API_KEY': process.env.COINMARKET_API_KEY!,
        }
    })
    const data = await res.json()
    const newData = {
        status: data.status,
        name: data?.data[symbol!!].name,
        symbol: data?.data[symbol!!].symbol,
        price: data?.data[symbol!!]?.quote?.USD?.price?.toFixed(4),
        percent_change_24h: data?.data[symbol!!]?.quote?.USD?.percent_change_24h.toFixed(3)
    }
    return Response.json(newData)   
  }