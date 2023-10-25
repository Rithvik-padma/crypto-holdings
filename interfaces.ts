export interface CoinHolding {
    symbol: string,
    amount: number,
}

export interface CoinData{
    id: number,
    symbol: string
}

export interface AddModalProps {
    coinHoldings: CoinHolding[],
    addCoin: (newCoin: CoinHolding) => void,
    triggerError: (Error: string) => void
}

export interface CoinStats{
    symbol: string,
    fiatAmount: number,
    percentChange: number
}