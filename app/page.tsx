"use client"
import React, {useState, useEffect} from 'react'
import {Listbox} from "@headlessui/react"
import axios from 'axios'
import {Toaster, toast} from "sonner"
import {CoinHolding, CoinStats, CoinData} from "@/interfaces"
import {Button} from "@radix-ui/themes"
import { ChevronUpDownIcon, ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/20/solid'
import AddHoldingModal from '@/components/addHoldingModal';

const Home: React.FC = () => {

  const initialCoinHoldings: Array<CoinHolding> = [
    {
      symbol: 'BTC',
      amount: 0.5
    },
    {
      symbol: 'ETH',
      amount: 10
    },
    {
      symbol: 'LTC',
      amount: 40
    }
  ]

  const [coinHoldings, setCoinHoldings] = useState<Array<CoinHolding>>(initialCoinHoldings)
  const [selectedCoin, setSelectedCoin] = useState<CoinHolding>(coinHoldings[0])
  const [selectedCoinStats, setSelectedCoinStats] = useState<CoinStats>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [coinsList, setCoinsList] = useState<Array<string>>([])

  useEffect(() => {
    getFiatAmount(selectedCoin)
  }, [selectedCoin])

  useEffect(() => {
    getCoinsList()
  }, [])

  const getCoinsList = async () => {
		try{
      const res = await axios.get(`/api/coins`)
      if(res?.data?.status?.error_code){
        triggerError(res.data.status.error_message)
      }
      else{
					await setCoinsList(res?.data?.coinData?.map((coin: CoinData) => coin.symbol).filter((coinItem: string) => !coinHoldings.find((holding) => holding.symbol === coinItem)))
      }
    }
    catch(err){
      if(err instanceof Error) triggerError(err.message)
    }
	}

  const getFiatAmount = async (coin: CoinHolding) => {
    try{
      setIsLoading(true)
      const res = await axios.get(`/api/coinmarket?symbol=${coin.symbol}`)
      if(res?.data?.status?.error_code){
        triggerError(res.data.status.error_message)
      }
      else{
        await setSelectedCoinStats({symbol: res.data.symbol, fiatAmount: res.data.price, percentChange: res.data.percent_change_24h})
      }
      setIsLoading(false)
    }
    catch(err){
      if(err instanceof Error) triggerError(err.message)
    }
  }

  const triggerError = (Error: string) => toast.error(Error)
  const addCoin = (newCoin: CoinHolding) => {
    const newCoinHolding: CoinHolding = {
      symbol: newCoin.symbol.toUpperCase(),
      amount: newCoin.amount
    }
    if(newCoinHolding.amount <= 0) triggerError("Amount must be greater than 0")
    else if(!newCoinHolding.amount) triggerError("Amount cannot be empty")
    else setCoinHoldings([...coinHoldings, newCoinHolding])
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className='flex flex-col items-center mob:mx-3'>
        <div className='text-center caret-transparent'>
          <h1 className="text-3xl font-bold">Crypto Holdings</h1>
          <p className="text-gray-600">
            App to track your crypto holdings and live prices
          </p>
        </div>
        <div className='w-full flex flex-col gap-2 items-center my-2'>
          {coinsList.length > 0 ?
            <AddHoldingModal
              addCoin={addCoin}
              initialCoinsList={coinsList}
              triggerError={triggerError}
              coinHoldings={coinHoldings}
            />
            :
            <span className="animate-pulse bg-gray-600 w-[70px] h-[20px]"></span>
          }
          <Listbox value={selectedCoin} onChange={setSelectedCoin}>
            <div className="w-fit relative text-xs cursor-pointer caret-transparent text-white">
              <Listbox.Button className="border-[1px] border-gray-600 relative w-fit rounded-lg bg-gray-900 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">{selectedCoin.symbol}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute border-[1px] border-gray-600 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {coinHoldings.map((coinHolding, index) => (
                  <Listbox.Option
                    key={index}
                    value={coinHolding}
                    className={`text-center py-1 hover:opacity-50 ${selectedCoin === coinHolding && 'bg-gray-800'}`}
                  >
                    {coinHolding.symbol}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
        <div className="mt-1 bg-gray-900 w-[300px] p-4 rounded-lg flex flex-row justify-between items-center caret-transparent">
          <div className="text-[18px] flex flex-col gap-[2px]">
            <span>{selectedCoin?.amount} {selectedCoin?.symbol}</span>
            {isLoading ? <span className="animate-pulse w-[60px] h-[15px] bg-gray-600"></span> : <span className="text-[11px] text-gray-500">~ ${(selectedCoin?.amount*(selectedCoinStats?.fiatAmount ?? 0)).toFixed(3)}</span>}
          </div>
          <div className="flex flex-col gap-[2px] items-center">
            {isLoading ? <span className="animate-pulse w-[100px] h-[24px] bg-gray-600"></span> : <span className="text-[13px]">1 {selectedCoinStats?.symbol} = ${selectedCoinStats?.fiatAmount}</span>}
            <div className={`flex flex-row items-center ${selectedCoinStats && selectedCoinStats?.percentChange > 0 ? "text-green-500" : "text-red-500"}`}>
              {isLoading ? 
              <span className="animate-pulse w-[100px] h-[18px] bg-gray-600"></span>
              :
              <>
                <span className="text-sm">{selectedCoinStats && selectedCoinStats?.percentChange > 0 ? "+": "-"}</span>
                <span className="text-xs">
                  {selectedCoinStats && Math.abs(selectedCoinStats?.percentChange)}% (24h)
                </span>
              </>}
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-center" richColors/>
    </main>
  )
}

export default Home
