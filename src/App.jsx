import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Auth from './components/Auth'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Donate from './pages/Donate'
import Certificate from './pages/Certificate'
import Profile from './pages/Profile'
import Bonus from './pages/Bonus'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <Auth />
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <Navigation />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/certificate" element={<Certificate />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bonus" element={<Bonus />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App