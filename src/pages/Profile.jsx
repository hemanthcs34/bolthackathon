import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import AlgorandWallet from '../components/AlgorandWallet'
import { User, Wallet, History, Trophy, Settings } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [donations, setDonations] = useState([])
  const [chatSummary, setChatSummary] = useState(null)
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfileData()
  }, [user])

  const loadProfileData = async () => {
    try {
      // Load donations
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-donations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id })
      })

      if (response.ok) {
        const data = await response.json()
        setDonations(data.donations || [])
      }

      // Simulate chat summary and badges
      setChatSummary({
        totalChats: 42,
        favoriteTopics: ['Blockchain', 'Algorand', 'DeFi'],
        lastChat: new Date()
      })

      setBadges([
        { id: 1, name: 'First Steps', description: 'Completed first chat', earned: true },
        { id: 2, name: 'Generous Heart', description: 'Made first donation', earned: true },
        { id: 3, name: 'Blockchain Explorer', description: 'Asked 10+ blockchain questions', earned: true },
        { id: 4, name: 'AI Whisperer', description: 'Had 50+ AI conversations', earned: false },
      ])
    } catch (error) {
      console.error('Failed to load profile data:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'wallet', name: 'Wallet', icon: Wallet },
    { id: 'history', name: 'History', icon: History },
    { id: 'badges', name: 'Badges', icon: Trophy },
  ]

  if (loading) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
              <User className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.email}</h1>
              <p className="text-gray-600">Member since {new Date(user?.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Account Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600">{chatSummary?.totalChats || 0}</div>
                  <div className="text-blue-700">AI Conversations</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-600">{donations.length}</div>
                  <div className="text-green-700">Donations Made</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {badges.filter(b => b.earned).length}
                  </div>
                  <div className="text-purple-700">Badges Earned</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Favorite Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {chatSummary?.favoriteTopics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Algorand Wallet</h2>
              <AlgorandWallet />
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Donation History</h2>
              {donations.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No donations yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <div
                      key={donation.id}
                      className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">
                            {donation.amount} ALGO
                          </div>
                          <div className="text-sm text-gray-600">
                            To: {donation.recipient}
                          </div>
                          {donation.message && (
                            <div className="text-sm text-gray-500 italic mt-1">
                              "{donation.message}"
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'badges' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Achievement Badges</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`border rounded-xl p-4 transition-all duration-200 ${
                      badge.earned
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        badge.earned ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                        <Trophy className="text-white" size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{badge.name}</div>
                        <div className="text-sm text-gray-600">{badge.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}