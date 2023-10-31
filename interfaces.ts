export interface CoinHolding {
    symbol: string | undefined,
    id: string | undefined,
    amount: number,
}

export interface Coin{
    symbol: string | undefined,
    id: string | undefined,
} 

export interface CoinData{
    id: number,
    symbol: string | undefined,
    name: string | undefined,
}

export interface AddModalProps {
    coinHoldings: CoinHolding[],
    initialCoinsList:Coin[],
    addCoin: (newCoin: CoinHolding) => void,
}

export interface CoinStats{
    symbol: string | undefined,
    fiatAmount: number,
    percentChange: number
}