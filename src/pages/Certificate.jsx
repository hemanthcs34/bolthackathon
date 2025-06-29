import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Award, Download, Share2, Calendar, CheckCircle } from 'lucide-react'

export default function Certificate() {
  const { user } = useAuth()
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading certificates
    setTimeout(() => {
      setCertificates([
        {
          id: 1,
          title: 'Blockchain Basics',
          description: 'Completed introduction to blockchain technology',
          issueDate: new Date('2024-01-15'),
          type: 'completion',
          skills: ['Blockchain Fundamentals', 'Cryptocurrency', 'Decentralization']
        },
        {
          id: 2,
          title: 'First Donation',
          description: 'Made your first charitable donation on Algorand',
          issueDate: new Date('2024-02-01'),
          type: 'achievement',
          skills: ['Philanthropy', 'Algorand', 'Smart Contracts']
        },
        {
          id: 3,
          title: 'AI Chat Expert',
          description: 'Completed 50+ conversations with AI assistant',
          issueDate: new Date('2024-02-20'),
          type: 'milestone',
          skills: ['AI Interaction', 'Problem Solving', 'Communication']
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleDownload = (certificate) => {
    // Simulate certificate download
    alert(`Downloading certificate: ${certificate.title}`)
  }

  const handleShare = (certificate) => {
    // Simulate certificate sharing
    if (navigator.share) {
      navigator.share({
        title: `My ${certificate.title} Certificate`,
        text: `I just earned a certificate in ${certificate.title}!`,
        url: window.location.href
      })
    } else {
      alert(`Sharing certificate: ${certificate.title}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your certificates...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Certificates</h1>
          <p className="text-gray-600">
            Showcase your blockchain achievements and earned credentials
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">{certificates.length}</div>
            <div className="text-gray-600">Total Certificates</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {certificates.filter(c => c.type === 'achievement').length}
            </div>
            <div className="text-gray-600">Achievements</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {certificates.filter(c => c.type === 'milestone').length}
            </div>
            <div className="text-gray-600">Milestones</div>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid gap-6">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    certificate.type === 'completion' ? 'bg-blue-100 text-blue-600' :
                    certificate.type === 'achievement' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{certificate.title}</h3>
                    <p className="text-gray-600">{certificate.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownload(certificate)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                    title="Download Certificate"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    onClick={() => handleShare(certificate)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                    title="Share Certificate"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>Issued {certificate.issueDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle size={16} />
                    <span className="capitalize">{certificate.type}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {certificate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {certificates.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No certificates yet</h3>
            <p className="text-gray-600 mb-6">
              Complete activities and achievements to earn your first certificate!
            </p>
            <button
              onClick={() => window.location.href = '/chat'}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
            >
              Start Learning
            </button>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">About Certificates</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Certificates are issued for completing specific activities</li>
            <li>• All certificates are verifiable on the blockchain</li>
            <li>• You can download and share your certificates</li>
            <li>• Certificates showcase your Web3 and blockchain skills</li>
            <li>• New certificate opportunities are added regularly</li>
          </ul>
        </div>
      </div>
    </div>
  )
}