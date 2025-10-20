'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, Copy, Check, Code, Zap, Shield, BarChart3, FileCode, Trash2, Download, Wand2, ThumbsUp, ThumbsDown, User, Bot, Maximize2, Minimize2, X, Search, Plus, List as ListIcon, Mic, Maximize } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { formatDistanceToNow } from 'date-fns'
import { VariableSizeList as VirtualList } from 'react-window'

interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  codeSnippets?: Array<{
    language: string
    code: string
  }>
  actions?: Array<{
    label: string
    type: 'insert' | 'replace' | 'append'
    code: string
  }>
  reaction?: 'like' | 'dislike' | null
}

interface ChatSession {
  id: string
  name: string
  messages: AIMessage[]
  createdAt: Date
}

interface AIAssistantV2Props {
  currentCode: string
  files: Array<{ id: string; name: string; content: string }>
  compilationErrors?: Array<{ line: number; message: string }>
  onInsertCode: (code: string) => void
  onReplaceCode: (code: string) => void
  onAppendCode: (code: string) => void
  isWidget?: boolean
  onToggleWidget?: () => void
  onCloseWidget?: () => void
}

export function AIAssistantV2({
  currentCode,
  files,
  compilationErrors = [],
  onInsertCode,
  onReplaceCode,
  onAppendCode,
  isWidget = false,
  onToggleWidget,
  onCloseWidget
}: AIAssistantV2Props) {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [diffModal, setDiffModal] = useState<{ show: boolean; oldCode: string; newCode: string; label: string } | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>('')
  const [showSessionsPanel, setShowSessionsPanel] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Smooth scroll to bottom WITHOUT jumping
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  // Only scroll when messages change
  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timer)
  }, [messages.length])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = false
        recognitionInstance.lang = 'en-US'

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInput(prev => prev + (prev ? ' ' : '') + transcript)
          setIsListening(false)
        }

        recognitionInstance.onerror = () => {
          setIsListening(false)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      }
    }
  }, [])

  const toggleVoiceInput = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser')
      return
    }

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
      setIsListening(true)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to send message
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (input.trim() && !loading) {
          handleSend()
        }
      }

      // Cmd/Ctrl + K to focus input
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }

      // Escape to blur input or close search
      if (e.key === 'Escape') {
        if (showSearch) {
          setShowSearch(false)
          setSearchQuery('')
        } else {
          inputRef.current?.blur()
        }
      }

      // Cmd/Ctrl + F to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault()
        setShowSearch(!showSearch)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [input, loading, showSearch])

  // Load sessions and chat history
  useEffect(() => {
    const savedSessions = localStorage.getItem('rainum-ai-sessions-v2')
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions)
        const sessionsWithDates = parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          messages: s.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }))
        setSessions(sessionsWithDates)

        if (sessionsWithDates.length > 0) {
          const lastSession = sessionsWithDates[sessionsWithDates.length - 1]
          setCurrentSessionId(lastSession.id)
          setMessages(lastSession.messages)
        } else {
          // Create default session
          const newSession: ChatSession = {
            id: Date.now().toString(),
            name: 'Chat 1',
            messages: [],
            createdAt: new Date()
          }
          setSessions([newSession])
          setCurrentSessionId(newSession.id)
        }
      } catch (e) {
        console.error('Failed to load sessions')
        // Create default session on error
        const newSession: ChatSession = {
          id: Date.now().toString(),
          name: 'Chat 1',
          messages: [],
          createdAt: new Date()
        }
        setSessions([newSession])
        setCurrentSessionId(newSession.id)
      }
    } else {
      // Create default session
      const newSession: ChatSession = {
        id: Date.now().toString(),
        name: 'Chat 1',
        messages: [],
        createdAt: new Date()
      }
      setSessions([newSession])
      setCurrentSessionId(newSession.id)
    }
  }, [])

  // Save sessions when they change
  useEffect(() => {
    if (sessions.length > 0 && currentSessionId) {
      // Update current session with current messages
      const updatedSessions = sessions.map(s =>
        s.id === currentSessionId ? { ...s, messages } : s
      )
      localStorage.setItem('rainum-ai-sessions-v2', JSON.stringify(updatedSessions))
      setSessions(updatedSessions)
    }
  }, [messages, currentSessionId])

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      name: `Chat ${sessions.length + 1}`,
      messages: [],
      createdAt: new Date()
    }
    setSessions([...sessions, newSession])
    setCurrentSessionId(newSession.id)
    setMessages([])
    setShowSessionsPanel(false)
  }

  const switchSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      setCurrentSessionId(sessionId)
      setMessages(session.messages)
      setShowSessionsPanel(false)
    }
  }

  const deleteSession = (sessionId: string) => {
    if (sessions.length === 1) return // Don't delete last session

    const updatedSessions = sessions.filter(s => s.id !== sessionId)
    setSessions(updatedSessions)

    if (currentSessionId === sessionId) {
      const newCurrent = updatedSessions[updatedSessions.length - 1]
      setCurrentSessionId(newCurrent.id)
      setMessages(newCurrent.messages)
    }

    localStorage.setItem('rainum-ai-sessions-v2', JSON.stringify(updatedSessions))
  }

  const suggestedPrompts = [
    { icon: <Code size={14} />, text: "Write ERC-20 token", color: "blue" },
    { icon: <Shield size={14} />, text: "Security audit", color: "green" },
    { icon: <BarChart3 size={14} />, text: "Optimize gas", color: "purple" },
    { icon: <Zap size={14} />, text: "Fix errors", color: "orange", disabled: compilationErrors.length === 0 },
    { icon: <FileCode size={14} />, text: "Generate tests", color: "pink" },
    { icon: <Wand2 size={14} />, text: "Explain code", color: "indigo" },
  ]

  const handleSend = async (customPrompt?: string) => {
    const messageText = customPrompt || input.trim()
    if (!messageText || loading) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    const context = {
      currentFile: files.find(f => f.content === currentCode)?.name || 'Contract.sol',
      code: currentCode,
      allFiles: files.map(f => ({ name: f.name, lines: f.content.split('\n').length })),
      errors: compilationErrors
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      const response = generateMockResponse(messageText, context)

      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
        codeSnippets: response.codeSnippets,
        actions: response.actions,
        reaction: null
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: 'Failed to get AI response. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleCopy = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleAction = (action: AIMessage['actions'][0], showDiff?: boolean) => {
    if (showDiff && action.type === 'replace') {
      setDiffModal({
        show: true,
        oldCode: currentCode,
        newCode: action.code,
        label: action.label
      })
      return
    }

    if (action.type === 'insert') {
      onInsertCode(action.code)
      showFeedback('✅ Code inserted successfully')
    } else if (action.type === 'replace') {
      onReplaceCode(action.code)
      showFeedback('✅ Code replaced successfully')
    } else if (action.type === 'append') {
      onAppendCode(action.code)
      showFeedback('✅ Code appended successfully')
    }
  }

  const applyDiffChanges = () => {
    if (diffModal) {
      onReplaceCode(diffModal.newCode)
      showFeedback('✅ Code replaced successfully')
      setDiffModal(null)
    }
  }

  const showFeedback = (text: string) => {
    const feedbackMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'system',
      content: text,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, feedbackMessage])
  }

  const setReaction = (messageId: string, reaction: 'like' | 'dislike') => {
    setMessages(prev => prev.map(m =>
      m.id === messageId ? { ...m, reaction: m.reaction === reaction ? null : reaction } : m
    ))
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem('rainum-ai-chat-history-v2')
  }

  const exportChat = () => {
    const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-chat-${Date.now()}.json`
    a.click()
  }

  const chatContent = (
    <div className={`h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden ${isWidget ? 'rounded-xl shadow-2xl border-2 border-gray-200' : ''}`}>
      {/* Animated background */}
      {!isWidget && (
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      )}

      {/* Header */}
      <div className="relative px-6 py-4 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0019ff] to-[#0047ff] rounded-xl flex items-center justify-center shadow-lg animate-pulse">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                AI Smart Contract Assistant
                <span className="px-2 py-0.5 bg-gradient-to-r from-[#0019ff] to-[#0047ff] text-white text-xs font-bold rounded animate-pulse">
                  BETA
                </span>
              </h2>
              <p className="text-sm text-gray-600">Context-aware • Multi-file support • Real-time analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSessionsPanel(!showSessionsPanel)}
              className={`p-2 rounded-lg transition-all hover:scale-110 ${
                showSessionsPanel ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Manage sessions"
            >
              <ListIcon size={18} />
            </button>
            <button
              onClick={createNewSession}
              className="p-2 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all hover:scale-110"
              title="New session"
            >
              <Plus size={18} />
            </button>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-lg transition-all hover:scale-110 ${
                showSearch ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Search messages (Ctrl+F)"
            >
              <Search size={18} />
            </button>
            <button
              onClick={exportChat}
              disabled={messages.length === 0}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all hover:scale-110 disabled:opacity-50"
              title="Export chat"
            >
              <Download size={18} />
            </button>
            <button
              onClick={clearChat}
              disabled={messages.length === 0}
              className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all hover:scale-110 disabled:opacity-50"
              title="Clear chat"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-2 rounded-lg transition-all hover:scale-110 ${
                isExpanded ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={isExpanded ? 'Exit focus mode' : 'Enter focus mode'}
            >
              <Maximize size={18} />
            </button>
            {onToggleWidget && !isWidget && (
              <button
                onClick={onToggleWidget}
                className="p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all hover:scale-110"
                title="Pop out as floating widget"
              >
                <Maximize2 size={18} />
              </button>
            )}
            {isWidget && onCloseWidget && (
              <button
                onClick={onCloseWidget}
                className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all hover:scale-110"
                title="Close widget"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sessions Panel */}
      {showSessionsPanel && (
        <div className="relative px-6 py-4 bg-purple-50/80 backdrop-blur-sm border-b border-purple-200 flex-shrink-0 animate-fadeIn">
          <h4 className="text-sm font-bold text-purple-900 mb-3">Chat Sessions ({sessions.length})</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer ${
                  session.id === currentSessionId
                    ? 'bg-purple-200 border-2 border-purple-400'
                    : 'bg-white border-2 border-purple-200 hover:bg-purple-100'
                }`}
                onClick={() => switchSession(session.id)}
              >
                <div className="flex-1">
                  <div className="font-semibold text-sm text-purple-900">{session.name}</div>
                  <div className="text-xs text-purple-600">
                    {session.messages.length} messages • {formatDistanceToNow(session.createdAt, { addSuffix: true })}
                  </div>
                </div>
                {sessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSession(session.id)
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-all"
                    title="Delete session"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      {showSearch && (
        <div className="relative px-6 py-3 bg-yellow-50/80 backdrop-blur-sm border-b border-yellow-200 flex-shrink-0 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-yellow-700" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="flex-1 px-3 py-1.5 text-sm border-2 border-yellow-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none"
              autoFocus
            />
            {searchQuery && (
              <div className="text-xs text-yellow-700 font-medium">
                {messages.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase())).length} results
              </div>
            )}
          </div>
        </div>
      )}

      {/* Context Pills */}
      <div className="relative px-6 py-2 bg-blue-50/80 backdrop-blur-sm border-b border-blue-200 flex-shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-semibold text-blue-700 flex-shrink-0">Context:</span>
          <div className="flex gap-2">
            <div className="px-2 py-1 bg-blue-100 border border-blue-300 rounded-md text-xs font-medium text-blue-800 flex items-center gap-1">
              <FileCode size={12} />
              {files.find(f => f.content === currentCode)?.name || 'Contract.sol'}
            </div>
            {compilationErrors.length > 0 && (
              <div className="px-2 py-1 bg-red-100 border border-red-300 rounded-md text-xs font-medium text-red-800 flex items-center gap-1">
                <Shield size={12} />
                {compilationErrors.length} error{compilationErrors.length > 1 ? 's' : ''}
              </div>
            )}
            <div className="px-2 py-1 bg-purple-100 border border-purple-300 rounded-md text-xs font-medium text-purple-800 flex items-center gap-1">
              <Code size={12} />
              {files.length} file{files.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="relative px-6 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => !prompt.disabled && handleSend(prompt.text)}
              disabled={prompt.disabled || loading}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap transform hover:scale-105 ${
                prompt.color === 'red' ? 'bg-red-50 text-red-700 hover:bg-red-100 border-2 border-red-200 hover:shadow-md' :
                prompt.color === 'purple' ? 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-2 border-purple-200 hover:shadow-md' :
                prompt.color === 'green' ? 'bg-green-50 text-green-700 hover:bg-green-100 border-2 border-green-200 hover:shadow-md' :
                prompt.color === 'orange' ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-2 border-orange-200 hover:shadow-md' :
                prompt.color === 'pink' ? 'bg-pink-50 text-pink-700 hover:bg-pink-100 border-2 border-pink-200 hover:shadow-md' :
                prompt.color === 'indigo' ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-2 border-indigo-200 hover:shadow-md' :
                'bg-blue-50 text-blue-700 hover:bg-blue-100 border-2 border-blue-200 hover:shadow-md'
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {prompt.icon}
              {prompt.text}
            </button>
          ))}
        </div>
      </div>

      {/* Messages - FIXED HEIGHT AND SCROLL */}
      <div
        ref={messagesContainerRef}
        className="relative flex-1 overflow-y-auto px-6 py-4 space-y-4"
        style={{
          minHeight: 0,
          maxHeight: 'calc(100vh - 500px)',
          overflowY: 'auto',
          scrollBehavior: 'smooth'
        }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-full">
            <div className="w-20 h-20 bg-gradient-to-br from-[#0019ff]/20 to-[#0047ff]/20 rounded-2xl flex items-center justify-center mb-4 animate-bounce">
              <Sparkles size={40} className="text-[#0019ff]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to assist you</h3>
            <p className="text-sm text-gray-600 mb-4 max-w-md">
              I can help you write, optimize, and secure your smart contracts
            </p>
          </div>
        ) : (
          <>
            {messages
              .filter(message => {
                if (!searchQuery) return true
                return message.content.toLowerCase().includes(searchQuery.toLowerCase())
              })
              .map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {/* Avatar */}
                {message.role !== 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#0019ff] to-[#0047ff] flex items-center justify-center shadow-lg">
                    {message.role === 'system' ? (
                      <Sparkles size={16} className="text-white" />
                    ) : (
                      <Bot size={16} className="text-white" />
                    )}
                  </div>
                )}

                <div className={`max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-[#0019ff] to-[#0047ff] text-white rounded-2xl rounded-br-md shadow-lg transform hover:scale-[1.02] transition-all'
                    : message.role === 'system'
                    ? 'bg-green-50 border-2 border-green-200 text-green-900 rounded-xl shadow-sm'
                    : 'bg-white border-2 border-gray-200 text-gray-900 rounded-2xl rounded-bl-md shadow-md hover:shadow-lg transition-all'
                }`}>
                  <div className="p-4">
                    <div className={`prose prose-sm max-w-none ${message.role === 'user' ? 'prose-invert' : ''}`}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code: ({ node, className, children, ...props }) => {
                            const inline = !className
                            return inline ? (
                              <code className="px-1.5 py-0.5 bg-gray-100 text-gray-900 rounded text-xs font-mono" {...props}>
                                {children}
                              </code>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            )
                          },
                          p: ({ children }) => <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>,
                          a: ({ children, href }) => (
                            <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
                              {children}
                            </a>
                          ),
                          ul: ({ children }) => <ul className="list-disc list-inside text-sm mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside text-sm mb-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="text-sm">{children}</li>,
                          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-gray-300 pl-3 italic text-gray-600 my-2">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>

                    {/* Code snippets */}
                    {message.codeSnippets && message.codeSnippets.map((snippet, i) => (
                      <div key={i} className="mt-3 rounded-xl overflow-hidden border-2 border-gray-300 bg-gray-900 shadow-lg transform hover:scale-[1.01] transition-all">
                        <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
                          <span className="text-xs font-mono font-semibold text-gray-300">{snippet.language}</span>
                          <button
                            onClick={() => handleCopy(snippet.code, `${message.id}-${i}`)}
                            className="flex items-center gap-1 text-xs text-gray-300 hover:text-white transition-all hover:scale-110"
                          >
                            {copiedId === `${message.id}-${i}` ? (
                              <>
                                <Check size={12} />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 text-xs text-gray-100 overflow-x-auto">
                          <code>{snippet.code}</code>
                        </pre>
                      </div>
                    ))}

                    {/* Action buttons */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.actions.map((action, i) => (
                          <div key={i} className="flex gap-1">
                            <button
                              onClick={() => handleAction(action)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0019ff] to-[#0047ff] hover:from-[#0015cc] hover:to-[#003acc] text-white text-xs font-semibold rounded-lg transition-all shadow-md hover:shadow-xl transform hover:scale-105"
                            >
                              <Code size={14} />
                              {action.label}
                            </button>
                            {action.type === 'replace' && (
                              <button
                                onClick={() => handleAction(action, true)}
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-all shadow-sm hover:shadow-md transform hover:scale-105"
                                title="Preview changes"
                              >
                                Preview
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Timestamp & reactions */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className={`text-xs ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </div>
                      {message.role === 'assistant' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setReaction(message.id, 'like')}
                            className={`p-1 rounded transition-all hover:scale-125 ${
                              message.reaction === 'like' ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-green-600'
                            }`}
                          >
                            <ThumbsUp size={12} />
                          </button>
                          <button
                            onClick={() => setReaction(message.id, 'dislike')}
                            className={`p-1 rounded transition-all hover:scale-125 ${
                              message.reaction === 'dislike' ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-600'
                            }`}
                          >
                            <ThumbsDown size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* User avatar */}
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start animate-fadeIn">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#0019ff] to-[#0047ff] flex items-center justify-center shadow-lg animate-pulse">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-2xl rounded-bl-md shadow-md p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#0019ff] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#0019ff] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-[#0019ff] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input - FIXED AT BOTTOM */}
      <div className="relative px-6 py-4 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-lg flex-shrink-0">
        <div className="relative">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask AI to write, explain, or optimize your code..."
            className="w-full pl-4 pr-40 py-3.5 border-2 border-gray-300 rounded-xl focus:border-[#0019ff] focus:ring-2 focus:ring-[#0019ff]/20 outline-none text-sm shadow-sm transition-all"
            disabled={loading}
            maxLength={2000}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <span className="text-xs text-gray-400 font-medium">{input.length}/2000</span>
            <button
              onClick={toggleVoiceInput}
              disabled={loading}
              className={`p-2 rounded-lg transition-all shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isListening ? 'Stop recording' : 'Start voice input'}
            >
              <Mic size={16} />
            </button>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="h-[38px] px-5 bg-gradient-to-r from-[#0019ff] to-[#0047ff] hover:from-[#0015cc] hover:to-[#003acc] text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 disabled:hover:scale-100"
            >
              <Send size={16} />
              <span className="text-sm">Send</span>
            </button>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
          <Sparkles size={12} className="text-[#0019ff]" />
          <span>AI automatically analyzes your code and compilation errors</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Diff Preview Modal */}
      {diffModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-gradient-to-r from-[#0019ff] to-[#0047ff] text-white flex items-center justify-between">
              <h3 className="text-lg font-bold">{diffModal.label} - Preview Changes</h3>
              <button
                onClick={() => setDiffModal(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="px-3 py-2 bg-red-100 border-l-4 border-red-500 text-red-800 font-semibold text-sm mb-2">
                    Current Code
                  </div>
                  <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-xs overflow-auto max-h-[60vh] border-2 border-red-500">
                    <code>{diffModal.oldCode}</code>
                  </pre>
                </div>
                <div>
                  <div className="px-3 py-2 bg-green-100 border-l-4 border-green-500 text-green-800 font-semibold text-sm mb-2">
                    New Code
                  </div>
                  <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-xs overflow-auto max-h-[60vh] border-2 border-green-500">
                    <code>{diffModal.newCode}</code>
                  </pre>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setDiffModal(null)}
                className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={applyDiffChanges}
                className="px-5 py-2.5 bg-gradient-to-r from-[#0019ff] to-[#0047ff] hover:from-[#0015cc] hover:to-[#003acc] text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  if (isExpanded) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
        <div className="w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
          {chatContent}
        </div>
      </div>
    )
  }

  return chatContent
}

// Mock AI response generator
function generateMockResponse(prompt: string, context: any) {
  const lowerPrompt = prompt.toLowerCase()

  if (lowerPrompt.includes('erc-20') || lowerPrompt.includes('token')) {
    const erc20Code = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MyToken {
    string public name = "MyToken";
    string public symbol = "MTK";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply * 10 ** decimals;
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from], "Insufficient balance");
        require(_value <= allowance[_from][msg.sender], "Allowance exceeded");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}`
    return {
      text: "I've created a complete ERC-20 token contract with all standard functions, events, and security best practices. This includes transfer, approve, and transferFrom functionality.",
      codeSnippets: [{ language: 'solidity', code: erc20Code }],
      actions: [
        { label: 'Replace Current Code', type: 'replace' as const, code: erc20Code },
        { label: 'Insert at Cursor', type: 'insert' as const, code: erc20Code }
      ]
    }
  }

  if (lowerPrompt.includes('optimize') || lowerPrompt.includes('gas')) {
    const optimizedCode = context.code.replace(/uint8/g, 'uint256').replace(/uint16/g, 'uint256').replace(/uint32/g, 'uint256')
    return {
      text: "I've optimized your contract for gas efficiency:\n\n✅ Replaced smaller uint types with uint256 (cheaper in loops)\n✅ Analyzed storage variable packing\n✅ Checked for unnecessary SSTORE operations\n\nEstimated gas savings: ~15-25%",
      codeSnippets: [{ language: 'solidity', code: optimizedCode }],
      actions: [{ label: 'Apply Optimizations', type: 'replace' as const, code: optimizedCode }]
    }
  }

  if (lowerPrompt.includes('security') || lowerPrompt.includes('audit')) {
    const securityCode = `// Security Features

bool private locked;

modifier nonReentrant() {
    require(!locked, "No reentrancy");
    locked = true;
    _;
    locked = false;
}

address public owner;

modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}

constructor() {
    owner = msg.sender;
}`
    return {
      text: "Security audit completed! Here's what I found:\n\n✅ Good: Using Solidity 0.8+ (overflow protection)\n⚠️ Add: Reentrancy guard for external calls\n⚠️ Add: Access control modifiers\n⚠️ Add: Pausable functionality\n\nI've generated the security code below:",
      codeSnippets: [{ language: 'solidity', code: securityCode }],
      actions: [{ label: 'Add Security Features', type: 'append' as const, code: '\n\n' + securityCode }]
    }
  }

  if (lowerPrompt.includes('test')) {
    const testCode = `describe("Contract Tests", function() {
    it("Should deploy successfully", async function() {
        const Contract = await ethers.getContractFactory("YourContract");
        const contract = await Contract.deploy();
        expect(contract.address).to.not.equal(0);
    });

    it("Should handle basic operations", async function() {
        // Test your contract logic
    });
});`
    return {
      text: "I've generated a comprehensive test suite using Hardhat and Ethers.js. This includes deployment tests, functionality tests, and edge case coverage.",
      codeSnippets: [{ language: 'javascript', code: testCode }],
      actions: [{ label: 'Create Test File', type: 'insert' as const, code: testCode }]
    }
  }

  if (lowerPrompt.includes('explain')) {
    return {
      text: `This is a ${context.code.includes('token') ? 'token contract' : 'smart contract'} written in Solidity.\n\n📊 Stats:\n• Functions: ${context.code.split('function').length - 1}\n• Events: ${context.code.split('event').length - 1}\n• Modifiers: ${context.code.split('modifier').length - 1}\n\nWould you like me to explain a specific part?`,
      codeSnippets: [],
      actions: []
    }
  }

  return {
    text: "I can help you with:\n\n🔧 Writing contracts (ERC-20, ERC-721, etc.)\n⚡ Gas optimization\n🛡️ Security audits\n📝 Explaining code\n🧪 Generating tests\n\nWhat would you like me to do?",
    codeSnippets: [],
    actions: []
  }
}
