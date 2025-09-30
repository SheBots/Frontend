import { useState, useRef, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState('')
  
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
    const interval = setInterval(checkConnection, 30000) // Check every 30s
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

    // Create abort controller for this request
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
          messages: messages.filter(m => m.role !== 'assistant' || !m.isStreaming)
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
              // Skip invalid JSON
            }
          }
        }
      }
      
      setIsConnected(true)
      setConnectionError('')
    } catch (error) {
      if (error.name === 'AbortError') {
        // Request was cancelled
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
      // Fallback for older browsers
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
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="app-title">Chatbot UI</h1>
          <div className="connection-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'offline'}`}>
              {isConnected ? '●' : '○'}
            </span>
            <span className="status-text">
              {isConnected ? 'Connected' : 'Offline'}
            </span>
            {connectionError && (
              <span className="error-text" title={connectionError}>
                ({connectionError})
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="chat-main">
        <div className="messages-container" role="log" aria-live="polite" aria-label="Chat messages">
          {messages.length === 0 && (
            <div className="welcome-message">
              <h2>Welcome to Chatbot UI</h2>
              <p>Start a conversation by typing a message below.</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-content">
                <div className="message-text">
                  {message.content}
                  {message.isStreaming && <span className="cursor">|</span>}
                </div>
                {message.role === 'assistant' && !message.isStreaming && message.content && (
                  <button
                    className="copy-button"
                    onClick={() => copyToClipboard(message.content)}
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
            <div className="typing-indicator">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="input-footer">
        <div className="input-container">
          <form onSubmit={handleSubmit} className="input-form">
            <div className="textarea-container">
              <label htmlFor="message-input" className="sr-only">
                Type your message
              </label>
              <textarea
                id="message-input"
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                rows="1"
                className="message-input"
                disabled={isLoading}
              />
              <div className="input-actions">
                {isLoading ? (
                  <button
                    type="button"
                    onClick={stopGeneration}
                    className="stop-button"
                    title="Stop generation"
                    aria-label="Stop message generation"
                  >
                    ⏹
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="send-button"
                    title="Send message"
                    aria-label="Send message"
                  >
                    ➤
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className="privacy-note">
          <small>
            Privacy & Use: Messages are sent to the configured backend API. 
            Please don't share sensitive information.
          </small>
        </div>
      </footer>
    </div>
  )
}

export default App