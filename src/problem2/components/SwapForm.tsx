/** @format */

import React, { useState, useEffect, useCallback } from "react"
import { Token } from "../types"
import { CurrencyPanel } from "./CurrencyPanel"
import { fetchTokensWithPrices } from "../services/tokenService"
import { ArrowDownUp, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react"
import { DEFAULT_PRECISION } from "../constants"

export const SwapForm: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [fromToken, setFromToken] = useState<Token | null>(null)
  const [toToken, setToToken] = useState<Token | null>(null)
  const [fromAmount, setFromAmount] = useState<string>("")
  const [toAmount, setToAmount] = useState<string>("")

  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(true)
  const [isSwapping, setIsSwapping] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadTokens = async () => {
      setIsLoadingTokens(true)
      setError(null)
      try {
        const fetchedTokens = await fetchTokensWithPrices()
        if (fetchedTokens.length === 0) {
          setError("Could not load any tokens. Please try again later.")
        } else {
          setTokens(fetchedTokens)
          if (fetchedTokens.length > 0) {
            setFromToken(fetchedTokens.find((t) => t.currency === "ETH") || fetchedTokens[0])
          }
          if (fetchedTokens.length > 1) {
            setToToken(fetchedTokens.find((t) => t.currency === "USD") || fetchedTokens[1])
          }
        }
      } catch (e) {
        setError("Failed to load token prices. Check your connection or try again later.")
        console.error(e)
      } finally {
        setIsLoadingTokens(false)
      }
    }
    loadTokens()
  }, [])

  const calculateToAmount = useCallback(() => {
    if (fromToken && toToken && fromAmount) {
      const amount = parseFloat(fromAmount)
      if (!isNaN(amount) && amount > 0 && fromToken.price > 0 && toToken.price > 0) {
        const rate = fromToken.price / toToken.price
        const result = amount * rate
        setToAmount(result.toFixed(DEFAULT_PRECISION))
        setError(null)
      } else {
        setToAmount("")
      }
    } else {
      setToAmount("")
    }
  }, [fromAmount, fromToken, toToken])

  useEffect(() => {
    calculateToAmount()
  }, [calculateToAmount])

  const handleFromAmountChange = (amount: string) => {
    setFromAmount(amount)
    setError(null)
    setSuccessMessage(null)
  }

  const handleFromTokenSelect = (token: Token) => {
    if (token.currency === toToken?.currency) {
      setToToken(fromToken)
    }
    setFromToken(token)
    setError(null)
    setSuccessMessage(null)
  }

  const handleToTokenSelect = (token: Token) => {
    if (token.currency === fromToken?.currency) {
      setFromToken(toToken)
    }
    setToToken(token)
    setError(null)
    setSuccessMessage(null)
  }

  const handleSwapCurrencies = () => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
    calculateToAmount()
    setError(null)
    setSuccessMessage(null)
  }

  const validateInputs = (): boolean => {
    if (!fromToken || !toToken) {
      setError("Please select both 'From' and 'To' currencies.")
      return false
    }
    if (fromToken.currency === toToken.currency) {
      setError("'From' and 'To' currencies cannot be the same.")
      return false
    }
    const amount = parseFloat(fromAmount)
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount to swap (must be greater than 0).")
      return false
    }
    setError(null)
    return true
  }

  const handleSubmitSwap = async () => {
    if (!validateInputs()) return

    setIsSwapping(true)
    setError(null)
    setSuccessMessage(null)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (Math.random() > 0.1) {
      // 90% success rate
      setSuccessMessage(`Successfully swapped ${fromAmount} ${fromToken?.currency} for ${toAmount} ${toToken?.currency}!`)
      setFromAmount("")
    } else {
      setError("Swap failed. Please try again.")
    }
    setIsSwapping(false)
  }

  const exchangeRate = fromToken && toToken && fromToken.price > 0 && toToken.price > 0 ? (fromToken.price / toToken.price).toFixed(DEFAULT_PRECISION) : null

  if (isLoadingTokens) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-slate-300">
        <Loader2 className="w-12 h-12 animate-spin text-sky-500 mb-4" />
        <p>Loading available tokens...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-md shadow-2xl rounded-xl p-6 space-y-5 border border-slate-700">
      <h1 className="text-2xl font-semibold text-center text-white mb-4">Currency Swap</h1>

      <CurrencyPanel
        label="You Pay"
        tokens={tokens}
        selectedToken={fromToken}
        onSelectToken={handleFromTokenSelect}
        amount={fromAmount}
        onAmountChange={handleFromAmountChange}
        isAmountReadOnly={false}
      />

      <div className="flex justify-center my-[-8px]">
        {" "}
        <button
          onClick={handleSwapCurrencies}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full text-sky-400 hover:text-sky-300 transition-all duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          aria-label="Swap currencies"
          disabled={!fromToken || !toToken}
        >
          <ArrowDownUp className="w-5 h-5" />
        </button>
      </div>

      <CurrencyPanel label="You Receive (Estimated)" tokens={tokens} selectedToken={toToken} onSelectToken={handleToTokenSelect} amount={toAmount} isAmountReadOnly={true} />

      {exchangeRate && fromToken && toToken && (
        <div className="text-sm text-center text-slate-400 pt-2">
          1 {fromToken.currency} ≈ {exchangeRate} {toToken.currency}
        </div>
      )}

      {error && (
        <div className="flex items-center p-3 text-sm text-red-400 bg-red-900/30 rounded-md border border-red-700/50">
          <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="flex items-center p-3 text-sm text-green-400 bg-green-900/30 rounded-md border border-green-700/50">
          <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <button
        onClick={handleSubmitSwap}
        disabled={isSwapping || isLoadingTokens || !fromToken || !toToken || !fromAmount || parseFloat(fromAmount) <= 0}
        className="w-full flex items-center justify-center bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSwapping ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Swapping...
          </>
        ) : (
          "Swap"
        )}
      </button>
      <p className="text-xs text-slate-500 text-center pt-2">Token prices are for demonstration purposes.</p>
    </div>
  )
}
