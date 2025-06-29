import { useState, useEffect } from 'react'
import { Smile, RefreshCw, ExternalLink, TrendingUp } from 'lucide-react'

export default function Bonus() {
  const [memes, setMemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadMemes()
  }, [])

  const loadMemes = async () => {
    setLoading(true)
    try {
      // Simulate loading Reddit memes
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMemes([
        {
          id: 1,
          title: "When you finally understand blockchain",
          author: "crypto_enthusiast",
          ups: 1234,
          comments: 89,
          url: "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg",
          permalink: "/r/cryptocurrency/comments/example1"
        },
        {
          id: 2,
          title: "Me explaining DeFi to my friends",
          author: "defi_master",
          ups: 2156,
          comments: 156,
          url: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
          permalink: "/r/defi/comments/example2"
        },
        {
          id: 3,
          title: "Algorand transaction speeds be like",
          author: "algo_fan",
          ups: 987,
          comments: 67,
          url: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg",
          permalink: "/r/algorand/comments/example3"
        },
        {
          id: 4,
          title: "When gas fees are higher than your transaction",
          author: "eth_user",
          ups: 3421,
          comments: 234,
          url: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg",
          permalink: "/r/ethereum/comments/example4"
        }
      ])
    } catch (error) {
      console.error('Failed to load memes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadMemes()
    setRefreshing(false)
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Smile className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crypto Memes</h1>
          <p className="text-gray-600">
            Take a break and enjoy some blockchain humor
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            {memes.length} memes loaded
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 hover:bg-white/90 transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`${refreshing ? 'animate-spin' : ''}`} size={16} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading fresh memes...</p>
          </div>
        )}

        {/* Memes Grid */}
        {!loading && (
          <div className="grid gap-6">
            {memes.map((meme) => (
              <div
                key={meme.id}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Meme Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{meme.title}</h3>
                      <p className="text-sm text-gray-600">by u/{meme.author}</p>
                    </div>
                    <a
                      href={`https://reddit.com${meme.permalink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                      title="View on Reddit"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>

                {/* Meme Image */}
                <div className="aspect-video bg-gray-100">
                  <img
                    src={meme.url}
                    alt={meme.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Meme Stats */}
                <div className="p-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <TrendingUp size={16} />
                      <span>{formatNumber(meme.ups)} upvotes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Smile size={16} />
                      <span>{formatNumber(meme.comments)} comments</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && memes.length === 0 && (
          <div className="text-center py-12">
            <Smile className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No memes found</h3>
            <p className="text-gray-600 mb-6">
              Try refreshing to load some fresh crypto humor!
            </p>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
            >
              Load Memes
            </button>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">About Crypto Memes</h3>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li>• Curated from popular cryptocurrency subreddits</li>
            <li>• Fresh content updated regularly</li>
            <li>• Community-driven humor about blockchain and crypto</li>
            <li>• Click the external link to view the original post</li>
            <li>• Perfect for taking a break from serious trading!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}