
export async function GET(request: Request) {
    const {searchParams} = new URL(request.url)
    const amount = searchParams.get('amount')
    const symbol = searchParams.get('symbol')
    const res = await fetch(`https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount=${amount}&symbol=${symbol}`, {
        headers: {
            'X-CMC_PRO_API_KEY': process.env.COINMARKET_API_KEY,
        }
    })
    const data = await res.json()
    console.log(data)
    const newData = {
        status: data?.status,
        id: data?.data?.id,
        name: data?.data?.name,
        symbol: data?.data?.symbol,
        amount: data?.data?.amount,
        price: data?.data?.quote?.USD?.price
    }
    return Response.json(newData)   
  }