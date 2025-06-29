import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Send, Volume2, VolumeX, Mic, MicOff, Bot, User, Video, VideoOff } from 'lucide-react'

export default function Chat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI assistant for Algorand blockchain operations. How can I help you today?',
      timestamp: new Date(),
      audioUrl: null
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showAvatar, setShowAvatar] = useState(true)
  const [playingMessageId, setPlayingMessageId] = useState(null)
  
  const messagesEndRef = useRef(null)
  const audioRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const generateAIResponse = async (userMessage) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          userId: user.id,
          context: 'algorand_dapp'
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      return data.response
    } catch (error) {
      console.error('AI response error:', error)
      return "I apologize, but I'm having trouble processing your request right now. Please try again later."
    }
  }

  const generateSpeech = async (text) => {
    if (isMuted) return null

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/text-to-speech`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voice: 'Rachel',
          userId: user.id
        })
      })

      if (!response.ok) throw new Error('TTS generation failed')

      const audioBlob = await response.blob()
      return URL.createObjectURL(audioBlob)
    } catch (error) {
      console.error('TTS error:', error)
      // Return placeholder audio URL for demo
      return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    }
  }

  const playAudio = async (audioUrl, messageId) => {
    if (!audioUrl || isMuted) return

    try {
      setIsPlaying(true)
      setPlayingMessageId(messageId)

      // Play audio
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
        
        audioRef.current.onended = () => {
          setIsPlaying(false)
          setPlayingMessageId(null)
          if (audioUrl.startsWith('blob:')) {
            URL.revokeObjectURL(audioUrl)
          }
        }
      }
    } catch (error) {
      console.error('Audio playback error:', error)
      setIsPlaying(false)
      setPlayingMessageId(null)
    }
  }

  const playMessageAudio = (message) => {
    if (playingMessageId === message.id) {
      // Stop current playback
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
        setPlayingMessageId(null)
      }
    } else {
      // Start playback
      if (message.audioUrl) {
        playAudio(message.audioUrl, message.id)
      } else {
        // Generate audio for this message
        generateSpeech(message.content).then(audioUrl => {
          if (audioUrl) {
            // Update message with audio URL
            setMessages(prev => prev.map(msg => 
              msg.id === message.id ? { ...msg, audioUrl } : msg
            ))
            playAudio(audioUrl, message.id)
          }
        })
      }
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setIsLoading(true)

    // Add user message
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newUserMessage])

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(userMessage)
      
      // Generate speech first
      const audioUrl = await generateSpeech(aiResponse)
      
      // Add AI message with audio URL
      const newAIMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        audioUrl: audioUrl
      }
      setMessages(prev => [...prev, newAIMessage])

      // Auto-play the response if not muted
      if (audioUrl && !isMuted) {
        setTimeout(() => {
          playAudio(audioUrl, newAIMessage.id)
        }, 500)
      }
    } catch (error) {
      console.error('Message handling error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      setPlayingMessageId(null)
    }
  }

  const toggleAvatar = () => {
    setShowAvatar(!showAvatar)
  }

  // Audio Waveform Component
  const AudioWaveform = ({ isActive }) => {
    return (
      <div className="flex items-center space-x-1 ml-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-1 bg-gradient-to-t from-blue-400 to-blue-600 rounded-full transition-all duration-300 ${
              isActive 
                ? 'animate-pulse shadow-lg shadow-blue-400/50' 
                : 'opacity-30'
            }`}
            style={{
              height: isActive ? `${12 + (i % 3) * 8}px` : '8px',
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.8s'
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 mb-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                <Bot className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
                <p className="text-gray-600">Your intelligent blockchain companion</p>
              </div>
              
              {/* Header Audio Waveform */}
              <AudioWaveform isActive={isPlaying} />
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleAvatar}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  showAvatar 
                    ? 'bg-primary-100 text-primary-600 hover:bg-primary-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={showAvatar ? 'Hide Avatar' : 'Show Avatar'}
              >
                {showAvatar ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
              
              <button
                onClick={toggleMute}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  isMuted 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              
              {recognitionRef.current && (
                <button
                  onClick={toggleVoiceRecognition}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    isListening 
                      ? 'bg-green-100 text-green-600 hover:bg-green-200 animate-pulse' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* AI Avatar Section */}
        {showAvatar && (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 mb-6 p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                {/* Circular AI Avatar Placeholder */}
                <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Bot className="text-gray-600" size={48} />
                </div>
                
                {/* Speaking Indicator Overlay */}
                {isPlaying && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-pulse">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <span>Speaking...</span>
                        <AudioWaveform isActive={true} />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Avatar Status Indicator */}
                <div className="absolute top-2 right-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI Avatar</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {isPlaying ? 'Currently speaking...' : 'Ready to assist you'}
                </p>
                <p className="text-xs text-gray-500">
                  Avatar loading...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end space-x-3 max-w-xs lg:max-w-md ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white' 
                      : 'bg-gradient-to-br from-blue-400 to-blue-500 text-white'
                  }`}>
                    {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  
                  {/* Message Bubble and Audio Controls */}
                  <div className="flex flex-col space-y-2">
                    {/* Message Bubble */}
                    <div className={`rounded-2xl px-4 py-3 shadow-md ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-br-md'
                        : 'bg-white text-gray-900 border border-gray-100 rounded-bl-md'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <span className={`text-xs mt-2 block ${
                        message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    {/* Audio Controls for AI Messages */}
                    {message.type === 'ai' && (
                      <div className="flex flex-col space-y-2">
                        {/* Speaker Icon with Waveform */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => playMessageAudio(message)}
                            className={`p-1 rounded-lg transition-all duration-200 cursor-pointer ${
                              playingMessageId === message.id
                                ? 'text-blue-500 bg-blue-50 hover:bg-blue-100'
                                : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                            }`}
                            title={playingMessageId === message.id ? 'Stop audio' : 'Play audio'}
                          >
                            <Volume2 size={24} />
                          </button>
                          
                          {/* Message-specific Waveform */}
                          <AudioWaveform isActive={playingMessageId === message.id} />
                        </div>
                        
                        {/* Compact Audio Player */}
                        <audio
                          controls
                          className="w-48 h-8"
                          style={{ fontSize: '12px' }}
                          src={message.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'}
                          preload="none"
                        >
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-3 max-w-xs lg:max-w-md">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-md border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <AudioWaveform isActive={true} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form - Sticky at bottom */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(e)
                    }
                  }}
                  placeholder={isListening ? 'Listening...' : 'Ask about Algorand, blockchain, or anything else...'}
                  disabled={isLoading || isListening}
                  rows={1}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none ${
                    isListening ? 'bg-green-50 border-green-200 animate-pulse' : 'bg-white'
                  }`}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Send size={18} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
            
            {/* Quick Actions */}
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>Press Enter to send, Shift+Enter for new line</span>
                {isListening && (
                  <span className="text-green-600 font-medium animate-pulse">
                    🎤 Listening...
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span>{messages.length} messages</span>
                {isPlaying && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <span>🔊 Playing</span>
                    <AudioWaveform isActive={true} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  )
}