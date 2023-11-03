export async function GET(request: Request) {
    const {searchParams} = new URL(request.url)
    const id = searchParams.get('id')
    const symbol = searchParams.get('symbol')
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&include_24hr_change=true&precision=4&ids=${id}`)
    const data = await res.json()
    console.log(data)
    const newData = {
        name: id,
        symbol: symbol,
        price: data?.[id!!]?.usd,
        percent_change_24h: data?.[id!!]?.usd_24h_change.toFixed(3)
    }
    return Response.json(newData)   
  }