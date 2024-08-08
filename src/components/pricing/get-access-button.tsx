import * as React from 'react'
import {LifetimePriceContext} from './lifetime-price-provider'
import Spinner from '../spinner'

const GetAccessButton: React.FunctionComponent = () => {
  const {loaderOn, pricesLoading, onClickCheckout} =
    React.useContext(LifetimePriceContext)

  return (
    <button
      disabled={pricesLoading}
      className={`w-full px-5 py-2 h-[60px] flex justify-center items-center mt-8 font-semibold text-center text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-md ${
        pricesLoading
          ? 'opacity-60 cursor-default'
          : 'hover:bg-blue-700 hover:scale-105'
      }`}
      onClick={(event) => {
        event.preventDefault()
        onClickCheckout()
      }}
      type="button"
    >
      {loaderOn || pricesLoading ? (
        <Spinner className="absolute text-white" size={6} />
      ) : (
        'Get Lifetime Access'
      )}
    </button>
  )
}

export default GetAccessButton
