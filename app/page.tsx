"use client"
import React, {useState} from 'react'
import {TextField, Button} from "@radix-ui/themes";
import axios from 'axios'
import {Toaster, toast} from "sonner"


const Home: React.FC = () => {

  const [symbol, setSymbol] = useState<string>()
  const [amount, setAmount] = useState<number>()
  const [price, setPrice] = useState<number>(0)

  const getPrice = async () => {
    try{
      const res = await axios.get(`/api/coinmarket?amount=${amount}&symbol=${symbol}`)
      if(res?.data?.status?.error_code){
        toast.error(res.data.status.error_message)
      }
      else{
        await setPrice(res.data.price)
      }
    }
    catch(err){
      if(err instanceof Error) toast.error(err.message)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div>
        <h1 className="text-3xl font-bold">Crypto Holdings</h1>
        <p className="text-gray-600">
          App to track your crypto holdings and live prices
        </p>
        <div>
          <TextField.Input 
            placeholder="Enter the symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}  
            className='text-sm pl-2 py-1 my-1 bg-gray-800'
          />
          <TextField.Input 
            placeholder="Enter the amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}  
            className='text-sm pl-2 py-1 my-1 bg-gray-800'
          />
          <Button
            onClick={getPrice}
            className='text-xs p-2 rounded-md my-1 bg-gray-800'
          >
            Get Price
          </Button>
          {price > 0 && <p className='text-sm'>Calculated price : ${price.toFixed(2)}</p>}
        </div>
      </div>
      <Toaster position="top-center" richColors/>
    </main>
  )
}

export default Home
