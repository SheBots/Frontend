import { useState, useRef, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

function ChatBot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [useDocs, setUseDocs] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState('')
  const [isOpen, setIsOpen] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

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

  return (
    <div className="bg-white min-h-screen">
      {/* Floating chat button (hidden when panel is open) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
            onClick={() => setIsOpen(true)}
            aria-label="Open chat"
            title="Open chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m2 8l-3-3H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-1z" />
            </svg>
          </button>
        </div>
      )}

      {/* Chat panel modal */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center sm:justify-end" role="dialog" aria-modal="true">
          {/* white overlay background */}
          <div className="absolute inset-0 bg-white" onClick={() => setIsOpen(false)} aria-hidden></div>

          {/* Panel: mobile = bottom centered, desktop = right side 80vh height */}
          <div className="relative w-full max-w-md mx-4 mb-6 sm:mb-0 sm:rounded-xl bg-white shadow-lg flex flex-col sm:h-[80vh] h-auto max-h-[90vh] overflow-hidden sm:mr-6">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-slate-900">SheBots</h2>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`} aria-hidden></span>
                  <span>{isConnected ? 'Connected' : 'Offline'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setIsOpen(false); stopGeneration(); }} className="text-slate-600 hover:text-slate-800" title="Close chat" aria-label="Close chat">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat content */}
            <div className="flex-1 overflow-y-auto p-4 bg-white" role="log" aria-live="polite" aria-atomic="false">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-slate-500">
                    <p className="font-medium">Welcome to SheBots</p>
                    <p className="text-sm">Type a message to start the conversation.</p>
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
            <div className="p-3 border-t bg-white">
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
                    <button type="submit" disabled={!input.trim() || isLoading} title="Send" aria-label="Send message" className="bg-blue-600 disabled:opacity-60 text-white px-3 py-2 rounded-md">Send</button>
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