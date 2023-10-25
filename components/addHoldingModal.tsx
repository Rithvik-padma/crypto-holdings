import { Dialog, Transition, Listbox } from '@headlessui/react'					
import { ChevronUpDownIcon, PlusCircleIcon } from '@heroicons/react/20/solid'
import {Button, TextField} from "@radix-ui/themes";
import React, {useState, useEffect} from 'react'
import axios from "axios"
import {CoinData, CoinHolding, AddModalProps} from "@/interfaces"

const AddHoldingModal: React.FC<AddModalProps>= ({addCoin, triggerError}: AddModalProps) => {

	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [selectedCoin, setSelectedCoin] = useState<string>("")
	const [amount, setAmount] = useState<number>(0)
	const [coinsList, setCoinsList] = useState<Array<string>>([])

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
					await setCoinsList(res?.data?.coinData?.map((coin: CoinData) => coin.symbol.toUpperCase()))
					await setSelectedCoin(res?.data?.coinData[0]?.symbol.toUpperCase())
      }
    }
    catch(err){
      if(err instanceof Error) triggerError(err.message)
    }
	}
	const openModal = () => setIsOpen(true)
  const closeModal = () => {
		setSelectedCoin(coinsList[0])
		setAmount(0)
		setIsOpen(false)
	}

	return (
		<div>
			<Button
				className='caret-transparent flex items-center gap-1 text-xs p-2 rounded-md my-1 bg-gray-900'
				onClick={openModal}
			>
				<PlusCircleIcon
					className="h-[11px] w-[11px]"
					aria-hidden="true"
				/>
				<span >Add coin</span>
			</Button>
			<Transition appear show={isOpen}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-gray-900 p-6 text-left align-middle shadow-xl transition-all text-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-200"
                  >
                    Add Coin
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">
                      Add a coin to your holdings
                    </p>
                  </div>
                  <div className="mt-4 flex flex-col items-center gap-3">
										<div className="flex flex-row gap-3 justify-between items-center text-xs">
											<label>Select coin :</label>
											<Listbox value={selectedCoin} onChange={setSelectedCoin}>
												<div className="w-fit relative text-xs cursor-pointer caret-transparent">
													<Listbox.Button className="relative w-fit rounded-lg bg-gray-900 py-2 pl-3 pr-10 text-left border-[1px] border-gray-600 shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300">
														<span className="block truncate">{selectedCoin}</span>
														<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
															<ChevronUpDownIcon
																className="h-5 w-5 text-gray-400"
																aria-hidden="true"
															/>
														</span>
													</Listbox.Button>
													<Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
														{coinsList?.map((coin, index) => (
															<Listbox.Option
																key={index}
																value={coin}
																className={`text-center py-1 hover:opacity-50 ${selectedCoin === coin && 'bg-gray-800'}`}
															>
																{coin}
															</Listbox.Option>
														))}
													</Listbox.Options>
												</div>
											</Listbox>
										</div>
										<div className="flex flex-row gap-3 justify-between items-center text-xs">
											<label>Select amount :</label>
											<input 
												type="number"
												placeholder={`in ${selectedCoin}`}
												value={amount}
												onChange={(e) => setAmount(e.target.value.length ? parseFloat(e.target.value) : NaN)}
												className="w-[60px] text-xs border-[1px] border-gray-600 rounded-md p-1 py-2 text-center text-gray-200 bg-gray-900 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300" 
											/>
										</div>
                    <Button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-2 py-1 text-xs font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
												addCoin({symbol: selectedCoin, amount: amount})
												closeModal()
											}}
                    >
                      Add Coin
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
		</div>
	)
}

export default AddHoldingModal

					
					
    	