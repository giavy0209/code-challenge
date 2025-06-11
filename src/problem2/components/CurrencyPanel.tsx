/** @format */

import React from "react"
import { Token } from "../types"
import { TokenSelector } from "./TokenSelector"
import { DEFAULT_PRECISION } from "../constants"

interface CurrencyPanelProps {
  label: string
  tokens: Token[]
  selectedToken: Token | null
  onSelectToken: (token: Token) => void
  amount: string
  onAmountChange?: (amount: string) => void
  isAmountReadOnly: boolean
  balance?: number
  isTokenSelectorDisabled?: boolean
}

export const CurrencyPanel: React.FC<CurrencyPanelProps> = ({
  label,
  tokens,
  selectedToken,
  onSelectToken,
  amount,
  onAmountChange,
  isAmountReadOnly,
  balance,
  isTokenSelectorDisabled = false,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onAmountChange) {
      let value = e.target.value
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        onAmountChange(value)
      }
    }
  }

  const displayedAmount = isAmountReadOnly && amount && !isNaN(parseFloat(amount)) ? parseFloat(amount).toFixed(DEFAULT_PRECISION) : amount

  return (
    <div className="p-4 bg-slate-800 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-slate-400 font-medium">{label}</span>
        {typeof balance === "number" && <span className="text-xs text-slate-400">Balance: {balance.toFixed(2)}</span>}
      </div>
      <div className="flex items-stretch space-x-3">
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.0"
          value={displayedAmount}
          onChange={handleInputChange}
          readOnly={isAmountReadOnly}
          className={`w-full flex-grow bg-transparent text-2xl font-mono text-white placeholder-slate-500 focus:outline-none ${isAmountReadOnly ? "cursor-default" : ""}`}
          aria-label={`${label} amount`}
        />
        <div className="w-40 flex-shrink-0">
          <TokenSelector tokens={tokens} selectedToken={selectedToken} onSelectToken={onSelectToken} disabled={isTokenSelectorDisabled} />
        </div>
      </div>
    </div>
  )
}
