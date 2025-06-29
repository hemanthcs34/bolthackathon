import { Link } from 'react-router-dom'
import { MessageCircle, Heart, Shield, Sparkles, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-16 animate-fade-in">
          {/* Heart/Helping Hands Icon */}
          <div className="flex justify-center mb-8 animate-bounce-slow">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-500 via-red-500 to-rose-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-pink-500/30 animate-glow">
                <Heart className="text-white" size={40} fill="currentColor" />
              </div>
              {/* Floating sparkles */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Main Heading with Animation */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 animate-slide-up">
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
              UsheGuard
            </span>
          </h1>
          
          {/* Subheading */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-700 mb-8 animate-slide-up-delay-1">
            Your AI-Powered Charity Advisor
          </h2>
          
          {/* Description Paragraph */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up-delay-2">
            Discover trustworthy causes, donate with confidence, and earn blockchain-verified certificates. 
            Let our AI guide you through meaningful charitable giving in the Web3 era.
          </p>
          
          {/* Large Glowing Get Started Button */}
          <div className="animate-slide-up-delay-3">
            <Link
              to="/chat"
              className="group inline-flex items-center px-12 py-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white text-xl font-bold rounded-2xl hover:from-pink-700 hover:via-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl animate-glow-button relative overflow-hidden"
            >
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              
              <MessageCircle className="mr-4 group-hover:rotate-12 transition-transform duration-300" size={28} />
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform duration-300" size={28} />
              
              {/* Shine effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 animate-fade-in-up">
          <div className="group bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/30 hover:border-pink-200 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Sparkles className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Guidance</h3>
            <p className="text-gray-600 leading-relaxed">
              Our intelligent AI analyzes charity effectiveness, transparency, and impact to help you make informed giving decisions.
            </p>
          </div>

          <div className="group bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/30 hover:border-green-200 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Shield className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure Donations</h3>
            <p className="text-gray-600 leading-relaxed">
              Make transparent, traceable donations using Algorand's eco-friendly blockchain technology with complete security and trust.
            </p>
          </div>

          <div className="group bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/30 hover:border-purple-200 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Heart className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Verified Impact</h3>
            <p className="text-gray-600 leading-relaxed">
              Earn blockchain-verified certificates for your charitable contributions and track the real-world impact of your generosity.
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30 animate-fade-in-up-delay">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Trusted by Changemakers</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                Fast
              </div>
              <div className="text-sm text-gray-600">4.5s Finality</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                Green
              </div>
              <div className="text-sm text-gray-600">Carbon Negative</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                Secure
              </div>
              <div className="text-sm text-gray-600">Blockchain Verified</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                Smart
              </div>
              <div className="text-sm text-gray-600">AI Powered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}