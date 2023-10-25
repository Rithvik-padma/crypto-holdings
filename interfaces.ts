export interface CoinHolding {
    symbol: string,
    amount: number,
}

export interface CoinData{
    id: number,
    symbol: string
}

export interface AddModalProps {
    addCoin: (newCoin: CoinHolding) => void,
    triggerError: (Error: string) => void
}