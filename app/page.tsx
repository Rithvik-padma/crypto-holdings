"use client"
import React, {Fragment, useState} from 'react'
import {Listbox} from "@headlessui/react"
import axios from 'axios'
import {Toaster, toast} from "sonner"
import {CoinHolding} from "@/interfaces"
import {Button} from "@radix-ui/themes"
import { ChevronUpDownIcon, PlusCircleIcon} from '@heroicons/react/20/solid'
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

  const [symbol, setSymbol] = useState<string>()
  const [amount, setAmount] = useState<number>()
  const [price, setPrice] = useState<number>(0)
  const [coinHoldings, setCoinHoldings] = useState<Array<CoinHolding>>(initialCoinHoldings)
  const [selectedCoin, setSelectedCoin] = useState<CoinHolding>(coinHoldings[0])

  const getPrice = async () => {
    try{
      const res = await axios.get(`/api/coinmarket?amount=${amount}&symbol=${symbol}`)
      if(res?.data?.status?.error_code){
        triggerError(res.data.status.error_message)
      }
      else{
        await setPrice(res.data.price)
      }
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
    setCoinHoldings([...coinHoldings, newCoinHolding])
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className='flex flex-col items-center mob:mx-3'>
        <h1 className="text-3xl font-bold">Crypto Holdings</h1>
        <p className="text-gray-600">
          App to track your crypto holdings and live prices
        </p>
        <div className='w-full flex flex-col gap-2 items-center my-2'>
          <AddHoldingModal
            addCoin={addCoin}
            triggerError={triggerError}
          />
          <Listbox value={selectedCoin} onChange={setSelectedCoin}>
            <div className="w-fit relative text-xs cursor-pointer caret-transparent text-white">
              <Listbox.Button className="relative w-fit rounded-lg bg-gray-900 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">{selectedCoin.symbol}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
        
      </div>
      <Toaster position="top-center" richColors/>
    </main>
  )
}

export default Home
