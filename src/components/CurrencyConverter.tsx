'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowRightLeft } from 'lucide-react'

interface ExchangeRate {
  [key: string]: number
}

interface ConverterProps {
  initialAmount?: number
  initialFrom?: string
  initialTo?: string
  rates?: ExchangeRate
}

const COMMON_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'MXN', 'BRL', 'ZAR']

export function CurrencyConverter({
  initialAmount = 100,
  initialFrom = 'USD',
  initialTo = 'EUR',
  rates = {},
}: ConverterProps) {
  const [amount, setAmount] = useState<number>(initialAmount)
  const [fromCurrency, setFromCurrency] = useState(initialFrom)
  const [toCurrency, setToCurrency] = useState(initialTo)
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate>(rates)
  const [loading, setLoading] = useState(!Object.keys(rates).length)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('/api/currency/rates')
        if (!response.ok) throw new Error('Failed to fetch rates')
        const data = await response.json()
        setExchangeRates(data.rates)
        setLastUpdate(new Date(data.timestamp))
        setError(null)
      } catch (err) {
        console.error('Currency fetch error:', err)
        setError('Could not load exchange rates')
      } finally {
        setLoading(false)
      }
    }

    if (!Object.keys(rates).length) {
      fetchRates()
    }
  }, [rates])

  const getConversionRate = useCallback(() => {
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      return null
    }
    return exchangeRates[toCurrency] / exchangeRates[fromCurrency]
  }, [exchangeRates, fromCurrency, toCurrency])

  const convertedAmount = useCallback(() => {
    const rate = getConversionRate()
    if (!rate) return null
    return (amount * rate).toFixed(2)
  }, [amount, getConversionRate])

  const handleSwap = useCallback(() => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }, [fromCurrency, toCurrency])

  const rate = getConversionRate()
  const converted = convertedAmount()

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* From */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {COMMON_CURRENCIES.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleSwap}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Swap currencies"
          >
            <ArrowRightLeft size={20} className="text-gray-600" />
          </button>
        </div>

        {/* To */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={converted || ''}
              disabled
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              placeholder="0.00"
            />
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {COMMON_CURRENCIES.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rate Info */}
        {rate && !loading && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              1 {fromCurrency} = <span className="font-semibold text-gray-900">{rate.toFixed(4)}</span> {toCurrency}
            </p>
          </div>
        )}

        {/* Last Update */}
        {lastUpdate && !loading && (
          <p className="text-xs text-gray-500 text-center">
            Rates updated: {lastUpdate.toLocaleTimeString()}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600">Loading rates...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
