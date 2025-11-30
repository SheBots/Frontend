import { useState, useRef, useEffect, useContext, memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ChatbotIcon from '../assets/chatbot-icon.jpg'
import { LanguageContext } from '../App'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://3.27.241.187:8000'

// Memoized Markdown component for better performance
const MarkdownContent = memo(({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({children, ...props}) => <h1 className="text-base font-bold mt-3 mb-1.5 first:mt-0 text-slate-900" {...props}>{children}</h1>,
        h2: ({children, ...props}) => <h2 className="text-sm font-bold mt-2.5 mb-1 first:mt-0 text-slate-900" {...props}>{children}</h2>,
        h3: ({children, ...props}) => <h3 className="text-sm font-semibold mt-2 mb-1 first:mt-0 text-slate-800" {...props}>{children}</h3>,
        p: ({children, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed text-slate-900" {...props}>{children}</p>,
        ul: ({children, ...props}) => <ul className="list-disc ml-5 mb-2 space-y-1 pl-1" {...props}>{children}</ul>,
        ol: ({children, ...props}) => <ol className="list-decimal ml-5 mb-2 space-y-1 pl-1" {...props}>{children}</ol>,
        li: ({children, ...props}) => <li className="ml-0 leading-relaxed" {...props}>{children}</li>,
        strong: ({children, ...props}) => <strong className="font-bold text-slate-900" {...props}>{children}</strong>,
        em: ({children, ...props}) => <em className="italic text-slate-800" {...props}>{children}</em>,
        del: ({children, ...props}) => <span className="font-bold text-slate-900" {...props}>{children}</span>,
        code: ({inline, children, ...props}) => {
          if (inline) {
            return <code className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
          }
          return <code className="block bg-slate-100 text-slate-900 p-2.5 rounded-md my-2 text-xs overflow-x-auto font-mono border border-slate-200" {...props}>{children}</code>
        },
        pre: ({children, ...props}) => <pre className="bg-slate-100 rounded-md my-2 overflow-x-auto border border-slate-200" {...props}>{children}</pre>,
        hr: ({...props}) => <hr className="my-3 border-slate-300" {...props} />,
        blockquote: ({children, ...props}) => <blockquote className="border-l-3 border-red-400 pl-3 my-2 italic text-slate-700 bg-red-50 py-1 rounded-r" {...props}>{children}</blockquote>,
        a: ({children, ...props}) => <a className="text-blue-600 hover:text-blue-800 underline font-medium" {...props}>{children}</a>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
})
// Localized suggested topics
const TOPICS_KO = [
  { id: 1, label: '심화컴퓨팅전공에서 졸업 위해 받아야 할 교양학점은 뭐야?' },
  { id: 2, label: '글로벌소프트웨어융합전공 졸업요건 뭐야?' },
  { id: 3, label: '플랫폼소프트웨어전공에서 졸업 위해 필요한 현장실습 학점은 뭐야?' },
]

const TOPICS_EN = [
  { id: 1, label: 'In the Advanced Computing major, what liberal arts credits are required for graduation?' },
  { id: 2, label: 'What are the graduation requirements for the Global Software Convergence major?' },
  { id: 3, label: 'For the Platform Software major, how many internship credits are required to graduate?' },
]

// Localized greeting texts
const GREETING = {
  bubble1: {
    en: "Hello, I'm your AI assistant! 👋",
    ko: '안녕하세요, 저는 AI 도우미입니다! 👋',
  },
  bubble2: {
    en: 'How can I help you?',
    ko: '무엇을 도와드릴까요?',
  },
  cardTitle: {
    en: "Greetings! I'm your CS department AI Assistant",
    ko: '안녕하세요! 저는 컴퓨터학부 AI 안내 챗봇입니다',
  },
  cardLine1: {
    en: 'I can help you with information in both English and Korean.',
    ko: '영어와 한국어로 정보를 제공해 드릴 수 있어요.',
  },
  cardLine2: {
    en: 'You may choose a question from below or type your own!',
    ko: '아래 질문을 선택하거나 직접 질문을 입력해 보세요!',
  },
}

function ChatBot() {
  const { lang } = useContext(LanguageContext)
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
  // Track if initial RAG context was already provided by backend
  const [contextProvided, setContextProvided] = useState(false)

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
    // Clear selected topic
    setSelectedTopic(null)

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
          useDocs: useDocs,
          language: lang,
          context_provided: contextProvided
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
                // Update context state if backend indicates it provided context
                if (parsed.context_provided !== undefined) {
                  setContextProvided(parsed.context_provided)
                }
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
    setContextProvided(false)
  }

  return (
    <div>
      {/* Greeting bubble - appears to the left of the chat button */}
      {!isOpen && greetingStep > 0 && (
        <div className="fixed bottom-6 z-50 animate-fade-in" style={{ right: '6.4rem' }}>
          <div className="bg-white rounded-lg shadow-xl p-4 max-w-xs border border-gray-200 relative">
            {/* Greeting content */}
            {greetingStep === 1 && (
              <p className="font-semibold text-gray-800">{GREETING.bubble1[lang]}</p>
            )}
            {greetingStep === 2 && (
              <p className="font-semibold text-gray-800">{GREETING.bubble2[lang]}</p>
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
            className="w-16 h-16 rounded-full bg-transparent shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-transform duration-300 hover:-translate-y-1 active:translate-y-0"
            onClick={() => {
              setIsOpen(true)
              setGreetingStep(0)
            }}
            aria-label="Open chat"
            title="Open chat"
          >
            <img src={ChatbotIcon} alt="Open chat" className="w-14 h-14 rounded-full object-contain bg-white border border-white ring-1 ring-white p-0.5" />
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
              <h2 id="chat-title" className="text-2xl font-bold text-red-600">SheBots</h2>
              <div className="absolute right-4 flex items-center gap-2">
                <div className="relative group">
                  <button onClick={resetChat} className="text-slate-600 hover:text-slate-800" title="Reset chat" aria-label="Reset chat">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 bg-slate-800 text-white text-xs rounded py-1 px-2 z-10">
                    {lang === 'ko' ? '새로운 주제로 질문하려면 초기화 버튼을 사용하세요' : 'Reset to ask about a different topic'}
                  </div>
                </div>
                <button onClick={() => { setIsOpen(false); stopGeneration(); resetChat(); }} className="text-slate-600 hover:text-slate-800" title="Close chat" aria-label="Close chat">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat content */}
            <div className="flex-1 overflow-y-auto p-3" role="log" aria-live="polite" aria-atomic="false">
              <div className="space-y-2">
                {showGreeting && messages.length === 0 && (
                  <div className="space-y-2">
                    {/* Greeting Card */}
                    <div className="bg-white rounded-xl shadow-md p-2 border border-gray-100">
                      <div className="flex items-start gap-2 mb-1">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-gray-200 bg-white">
                          <img src={ChatbotIcon} alt="Assistant" className="w-8 h-8 object-contain rounded-full mx-auto my-0.5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-m mb-0.5">{GREETING.cardTitle[lang]}</h3>
                          <div className="text-sm text-slate-600 space-y-0.5">
                            <p>{GREETING.cardLine1[lang]}</p>
                            <p className="text-slate-700 font-medium">{GREETING.cardLine2[lang]}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Topic Recommendation Chips */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap gap-1.5">
                        {(lang === 'ko' ? TOPICS_KO : TOPICS_EN).map((topic) => (
                          <button
                            key={topic.id}
                            onClick={() => handleTopicClick(topic)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                              selectedTopic === topic.label
                                ? 'bg-red-500 text-white shadow-md scale-105'
                                : 'bg-white text-slate-700 border border-gray-200 hover:border-red-300 hover:bg-red-50 hover:shadow-sm'
                            }`}
                            aria-pressed={selectedTopic === topic.label}
                          >
                            <span>{topic.label}</span>
                          </button>
                        ))}
                      </div>                      
                    </div>
                  </div>
                )}

                {/* Beta tip after first message */}
                {messages.length > 0 && !showGreeting && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs text-blue-800">
                    <strong>💡 {lang === 'ko' ? '팁:' : 'Tip:'}</strong> {lang === 'ko' ? '다른 주제로 질문하려면 상단의 초기화 버튼을 클릭하세요.' : 'Click the reset button (top-right) to start a new topic.'}
                  </div>
                )}

                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`relative max-w-[80%] px-3 py-1.5 rounded-lg text-sm ${message.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-gray-100 text-slate-900 rounded-bl-sm'}`}>
                      <div className="break-words">
                        {message.role === 'assistant' ? (
                          <>
                            <MarkdownContent content={message.content} />
                            {message.isStreaming && message.content.length === 0 && (
                              <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{animationDelay: '0ms'}} />
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{animationDelay: '150ms'}} />
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{animationDelay: '300ms'}} />
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="whitespace-pre-wrap">{message.content}</span>
                        )}
                      </div>
                      {message.role === 'assistant' && !message.isStreaming && message.content && (
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="absolute -top-2 -right-2 bg-white border rounded p-0.5 text-xs text-slate-600 shadow hover:shadow-md transition-shadow"
                          title="Copy to clipboard"
                          aria-label="Copy message to clipboard"
                        >
                          📋
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input area */}
            <div className="p-2 border-t bg-white/80 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="flex items-end gap-1.5" role="form" aria-label="Send a message">
                <label htmlFor="message-input" className="sr-only">Message</label>
                <textarea
                  id="message-input"
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  rows={1}
                  className="flex-1 resize-none rounded-md border px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  disabled={isLoading}
                />

                <div className="flex flex-col gap-1.5">
                  {isLoading ? (
                    <button type="button" onClick={stopGeneration} title="Stop generation" aria-label="Stop generation" className="bg-red-500 text-white px-2.5 py-1.5 rounded-md text-sm">Stop</button>
                  ) : (
                    <button type="submit" disabled={!input.trim() || isLoading} title="Send" aria-label="Send message" className="bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-2.5 py-1.5 rounded-md text-sm">Send</button>
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