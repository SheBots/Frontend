import { useState, useRef, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
// Recommended topics configuration
const TOPICS = [
  { id: 1, label: '심화컴퓨팅전공에서 출업 위해 받아야한 교양학점은 뭐야?', icon: '💼' },
  { id: 2, label: '글로벌소프트웨어융합전공 졸업요건 뭐야?', icon: '🎓' },
  { id: 3, label: '플랫폼소프트웨어전공에서 출업 위해 받아야한 현장실습 학점는 뭐야?', icon: '📚' },
]

function ChatBot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [useDocs, setUseDocs] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [greetingStep, setGreetingStep] = useState(0)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [showGreeting, setShowGreeting] = useState(true)

  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const abortControllerRef = useRef(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/health`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        })
        if (response.ok) {
          setIsConnected(true)
          setConnectionError('')
        } else {
          throw new Error('Backend not responding')
        }
      } catch (error) {
        setIsConnected(false)
        setConnectionError('Backend not available')
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 30000)
    return () => clearInterval(interval)
  }, [])

  // Show greeting bubble on page load
  useEffect(() => {
    // Show first message after 1 second
    const timer1 = setTimeout(() => {
      setGreetingStep(1)
    }, 1000)

    // Hide first message and show second after 2 seconds
    const timer2 = setTimeout(() => {
      setGreetingStep(2)
    }, 3000)

    // Hide second message after 4 seconds
    const timer3 = setTimeout(() => {
      setGreetingStep(0)
    }, 5000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Hide greeting after first message
    setShowGreeting(false)

    const userMessage = { id: Date.now(), role: 'user', content: input.trim() }
    const assistantMessage = { id: Date.now() + 1, role: 'assistant', content: '', isStreaming: true }

    setMessages(prev => [...prev, userMessage, assistantMessage])
    setInput('')
    setIsLoading(true)

    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.filter(m => m.role !== 'assistant' || !m.isStreaming),
          useDocs: useDocs
        }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              setMessages(prev => prev.map(msg =>
                msg.id === assistantMessage.id
                  ? { ...msg, isStreaming: false }
                  : msg
              ))
              break
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.token) {
                setMessages(prev => prev.map(msg =>
                  msg.id === assistantMessage.id
                    ? { ...msg, content: msg.content + parsed.token }
                    : msg
                ))
              }
            } catch (e) {
              // ignore invalid JSON
            }
          }
        }
      }

      setIsConnected(true)
      setConnectionError('')
    } catch (error) {
      if (error.name === 'AbortError') {
        setMessages(prev => prev.filter(msg => msg.id !== assistantMessage.id))
      } else {
        setIsConnected(false)
        setConnectionError(error.message)
        setMessages(prev => prev.map(msg =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                content: `Error: Unable to connect to the backend. ${error.message}`,
                isStreaming: false,
                isError: true
              }
            : msg
        ))
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic.label)
    setInput(topic.label)
  }

  const resetChat = () => {
    setMessages([])
    setSelectedTopic(null)
    setShowGreeting(true)
    setInput('')
  }

  return (
    <div>
      {/* Greeting bubble - appears to the left of the chat button */}
      {!isOpen && greetingStep > 0 && (
        <div className="fixed bottom-6 z-50 animate-fade-in" style={{ right: '6.4rem' }}>
          <div className="bg-white rounded-lg shadow-xl p-4 max-w-xs border border-gray-200 relative">
            {/* Greeting content */}
            {greetingStep === 1 && (
              <p className="font-semibold text-gray-800">Hello, I'm your AI assistant! 👋</p>
            )}
            {greetingStep === 2 && (
              <p className="font-semibold text-gray-800">How can I help you?</p>
            )}
            
            {/* Small arrow pointing to chat button */}
            <div className="absolute bottom-6 -right-2 w-4 h-4 bg-white border-r border-t border-gray-200 transform rotate-45"></div>
          </div>
        </div>
      )}

      {/* Floating chat button (hidden when panel is open) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            className="w-16 h-16 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-transform duration-300 hover:-translate-y-1 active:translate-y-0"
            onClick={() => {
              setIsOpen(true)
              setGreetingStep(0)
            }}
            aria-label="Open chat"
            title="Open chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m2 8l-3-3H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-1z" />
            </svg>
          </button>
        </div>
      )}

      {/* Chat panel modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-end justify-end pointer-events-none p-4 sm:p-6" style={{paddingBottom: '1.5rem'}} role="dialog" aria-modal="true" aria-labelledby="chat-title">
          {/* semi-transparent overlay background */}
          <div className="absolute inset-0 bg-black/20 pointer-events-auto" onClick={() => setIsOpen(false)} aria-hidden></div>

          {/* Panel: positioned with proper spacing from header */}
          <div className="relative w-full max-w-md shadow-lg flex flex-col sm:h-[85vh] h-[85vh] overflow-hidden sm:rounded-xl pointer-events-auto z-50" style={{
            background: 'radial-gradient(circle at top right, #fecaca, #fca5a5, #ffffff)'
          }}>
            {/* Header */}
            <div className="flex items-center justify-center px-4 py-2 border-b bg-white/80 backdrop-blur-sm relative">
              <h2 id="chat-title" className="text-xl font-bold text-red-600">KNU ChatBot Project</h2>
              <div className="absolute right-4 flex items-center gap-2">
                <button onClick={resetChat} className="text-slate-600 hover:text-slate-800" title="Reset chat" aria-label="Reset chat">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </button>
                <button onClick={() => { setIsOpen(false); stopGeneration(); resetChat(); }} className="text-slate-600 hover:text-slate-800" title="Close chat" aria-label="Close chat">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat content */}
            <div className="flex-1 overflow-y-auto p-4" role="log" aria-live="polite" aria-atomic="false">
              <div className="space-y-4">
                {showGreeting && messages.length === 0 && (
                  <div className="space-y-4">
                    {/* Greeting Card */}
                    <div className="bg-white rounded-2xl shadow-md p-3 border border-gray-100">
                      <div className="flex items-start gap-2 mb-2">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-pink-400 flex items-center justify-center text-white text-xl flex-shrink-0">
                          🤖
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 text-lg mb-1">
                            Greetings! I'm your CS department AI Assistant
                          </h3>
                          <div className="text-sm text-slate-600 space-y-1">
                            <p>I can help you with information in both <span className="font-medium">English</span> and <span className="font-medium">Korean</span>.</p>
                            <p className="text-slate-700 font-medium">
                              You may choose a question from below or type your own!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Topic Recommendation Chips */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {TOPICS.map((topic) => (
                          <button
                            key={topic.id}
                            onClick={() => handleTopicClick(topic)}
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                              selectedTopic === topic.label
                                ? 'bg-red-500 text-white shadow-md scale-105'
                                : 'bg-white text-slate-700 border border-gray-200 hover:border-red-300 hover:bg-red-50 hover:shadow-sm'
                            }`}
                            aria-pressed={selectedTopic === topic.label}
                          >
                            <span className="text-base">{topic.icon}</span>
                            <span>{topic.label}</span>
                          </button>
                        ))}
                      </div>                      
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`relative max-w-[80%] px-4 py-2 rounded-lg ${message.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-gray-100 text-slate-900 rounded-bl-sm'}`}>
                      <div className="whitespace-pre-wrap break-words">
                        {message.content}
                        {message.isStreaming && <span className="ml-1 text-blue-500">|</span>}
                      </div>
                      {message.role === 'assistant' && !message.isStreaming && message.content && (
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="absolute -top-3 -right-3 bg-white border rounded p-1 text-sm text-slate-600 shadow"
                          title="Copy to clipboard"
                          aria-label="Copy message to clipboard"
                        >
                          📋
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 bg-gray-100 text-slate-700 px-3 py-2 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                      <span className="text-sm">Assistant is typing…</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input area */}
            <div className="p-3 border-t bg-white/80 backdrop-blur-sm">
              {selectedTopic && (
                <div className="mb-2 flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Topic:</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    {TOPICS.find(t => t.label === selectedTopic)?.icon}
                    {selectedTopic}
                  </span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="flex items-end gap-2" role="form" aria-label="Send a message">
                <label htmlFor="message-input" className="sr-only">Message</label>
                <textarea
                  id="message-input"
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  rows={1}
                  className="flex-1 resize-none rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  disabled={isLoading}
                />

                <div className="flex flex-col gap-2">
                  {isLoading ? (
                    <button type="button" onClick={stopGeneration} title="Stop generation" aria-label="Stop generation" className="bg-red-500 text-white px-3 py-2 rounded-md">Stop</button>
                  ) : (
                    <button type="submit" disabled={!input.trim() || isLoading} title="Send" aria-label="Send message" className="bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-3 py-2 rounded-md">Send</button>
                  )}
                </div>
              </form>

              {/* input area is placed at the bottom of the panel */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatBot