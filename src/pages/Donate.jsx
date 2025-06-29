import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Heart, Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function Donate() {
  const { user } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadWallet()
  }, [user])

  const loadWallet = async () => {
    try {
      const { data } = await supabase
        .from('algorand_wallets')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setWallet(data)
      }
    } catch (err) {
      // Wallet doesn't exist yet
    }
  }

  const handleDonate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-donation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          recipient: recipient.trim(),
          amount: parseFloat(amount),
          message: message.trim(),
          isAnonymous
        })
      })

      const data = await response.json()
      if (response.ok) {
        setResult(data)
        setRecipient('')
        setAmount('')
        setMessage('')
        setIsAnonymous(false)
      } else {
        setError(data.error || 'Donation failed')
      }
    } catch (err) {
      setError(err.message || 'Donation failed')
    } finally {
      setLoading(false)
    }
  }

  if (!wallet) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet Required</h2>
            <p className="text-gray-600 mb-6">
              You need to set up an Algorand wallet before you can make donations. 
              Please visit your profile to create or import a wallet.
            </p>
            <button
              onClick={() => window.location.href = '/profile'}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
            >
              Go to Profile
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Make a Donation</h1>
          <p className="text-gray-600">
            Support causes and individuals with secure blockchain donations
          </p>
        </div>

        {/* Donation Form */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-8">
          <form onSubmit={handleDonate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter Algorand address..."
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (ALGO)
              </label>
              <input
                type="number"
                step="0.000001"
                min="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.000000"
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message..."
                rows={3}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
              />
              <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
                Make this donation anonymous
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Send Donation</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Success Message */}
        {result && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="text-green-500 mr-3" size={24} />
              <h3 className="text-lg font-semibold text-green-800">Donation Successful!</h3>
            </div>
            <div className="space-y-2 text-sm text-green-700">
              <p><strong>Transaction ID:</strong> {result.txId}</p>
              <p><strong>Amount:</strong> {result.amount} ALGO</p>
              <p><strong>Recipient:</strong> {result.recipient}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center mb-2">
              <AlertCircle className="text-red-500 mr-3" size={24} />
              <h3 className="text-lg font-semibold text-red-800">Donation Failed</h3>
            </div>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">How it works</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Donations are processed on the Algorand blockchain</li>
            <li>• Transactions are fast (4.5 seconds) and eco-friendly</li>
            <li>• All donations are transparent and verifiable</li>
            <li>• Minimum donation amount is 0.001 ALGO</li>
            <li>• Small network fees apply to cover transaction costs</li>
          </ul>
        </div>
      </div>
    </div>
  )
}