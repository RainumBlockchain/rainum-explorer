'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, Copy, Check, Code, Zap, Shield, BarChart3, FileCode, Trash2, RotateCcw, Download, Wand2 } from 'lucide-react'

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
}

interface AIAssistantProps {
  currentCode: string
  files: Array<{ id: string; name: string; content: string }>
  compilationErrors?: Array<{ line: number; message: string }>
  onInsertCode: (code: string) => void
  onReplaceCode: (code: string) => void
  onAppendCode: (code: string) => void
}

export function AIAssistant({
  currentCode,
  files,
  compilationErrors = [],
  onInsertCode,
  onReplaceCode,
  onAppendCode
}: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rainum-ai-chat-history')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setMessages(parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })))
      } catch (e) {
        console.error('Failed to load chat history')
      }
    }
  }, [])

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('rainum-ai-chat-history', JSON.stringify(messages))
    }
  }, [messages])

  const suggestedPrompts = [
    { icon: <Code size={16} />, text: "Write an ERC-20 token contract", color: "blue" },
    { icon: <Shield size={16} />, text: "Add security best practices", color: "green" },
    { icon: <BarChart3 size={16} />, text: "Optimize gas usage", color: "purple" },
    { icon: <Zap size={16} />, text: "Fix compilation errors", color: "orange" },
    { icon: <FileCode size={16} />, text: "Generate unit tests", color: "pink" },
    { icon: <Wand2 size={16} />, text: "Explain this contract", color: "indigo" },
  ]

  const quickActions = [
    {
      icon: <Zap size={14} />,
      label: "Fix Errors",
      prompt: `Fix these compilation errors:\n${compilationErrors.map(e => `Line ${e.line}: ${e.message}`).join('\n')}`,
      disabled: compilationErrors.length === 0,
      color: "red"
    },
    {
      icon: <BarChart3 size={14} />,
      label: "Optimize Gas",
      prompt: "Analyze and optimize the gas usage in this contract",
      color: "purple"
    },
    {
      icon: <Shield size={14} />,
      label: "Security Audit",
      prompt: "Perform a security audit and suggest improvements",
      color: "green"
    },
    {
      icon: <Code size={14} />,
      label: "Add Events",
      prompt: "Add appropriate events to this contract",
      color: "blue"
    },
  ]

  const handleSend = async (customPrompt?: string) => {
    const messageText = customPrompt || input.trim()
    if (!messageText || loading) return

    // Add user message
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // Build context
    const context = {
      currentFile: files.find(f => f.content === currentCode)?.name || 'Contract.sol',
      code: currentCode,
      allFiles: files.map(f => ({ name: f.name, lines: f.content.split('\n').length })),
      errors: compilationErrors
    }

    try {
      // Simulate AI response (replace with real API call)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generate mock response based on prompt
      const response = generateMockResponse(messageText, context)

      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
        codeSnippets: response.codeSnippets,
        actions: response.actions
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

  const handleAction = (action: AIMessage['actions'][0]) => {
    console.log('Action clicked:', action.type, 'Code length:', action.code.length)

    if (action.type === 'insert') {
      onInsertCode(action.code)
      // Show visual feedback
      const userMessage: AIMessage = {
        id: Date.now().toString(),
        role: 'system',
        content: '✅ Code inserted at cursor position',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])
    } else if (action.type === 'replace') {
      onReplaceCode(action.code)
      // Show visual feedback
      const userMessage: AIMessage = {
        id: Date.now().toString(),
        role: 'system',
        content: '✅ Code replaced successfully',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])
    } else if (action.type === 'append') {
      onAppendCode(action.code)
      // Show visual feedback
      const userMessage: AIMessage = {
        id: Date.now().toString(),
        role: 'system',
        content: '✅ Code appended to end of file',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])
    }
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem('rainum-ai-chat-history')
  }

  const exportChat = () => {
    const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-chat-${Date.now()}.json`
    a.click()
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0019ff] to-[#0047ff] rounded-lg flex items-center justify-center shadow-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                AI Smart Contract Assistant
                <span className="px-2 py-0.5 bg-gradient-to-r from-[#0019ff] to-[#0047ff] text-white text-xs font-bold rounded">
                  BETA
                </span>
              </h2>
              <p className="text-sm text-gray-600">Powered by advanced AI • Context-aware • Multi-file support</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportChat}
              disabled={messages.length === 0}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              title="Export chat"
            >
              <Download size={18} />
            </button>
            <button
              onClick={clearChat}
              disabled={messages.length === 0}
              className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded transition-colors disabled:opacity-50"
              title="Clear chat"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-3 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-gray-600 mr-2 flex-shrink-0">QUICK ACTIONS:</span>
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => handleSend(action.prompt)}
              disabled={action.disabled || loading}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                action.color === 'red' ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' :
                action.color === 'purple' ? 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200' :
                action.color === 'green' ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200' :
                'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
              } disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0019ff]/10 to-[#0047ff]/10 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles size={32} className="text-[#0019ff]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Development</h3>
            <p className="text-sm text-gray-600 mb-4 max-w-md">
              Get intelligent code suggestions, explanations, and optimizations
            </p>
            <div className="grid grid-cols-3 gap-2 w-full max-w-3xl">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt.text)}
                  className={`flex items-center gap-2 p-3 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-${prompt.color}-500 rounded-lg transition-all text-left group shadow-sm hover:shadow-md`}
                >
                  <div className={`w-8 h-8 bg-${prompt.color}-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <div className={`text-${prompt.color}-600`}>{prompt.icon}</div>
                  </div>
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900">{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-[#0019ff] to-[#0047ff] text-white rounded-2xl rounded-br-md shadow-lg'
                    : message.role === 'system'
                    ? 'bg-red-50 border-2 border-red-200 text-red-900 rounded-lg'
                    : 'bg-white border-2 border-gray-200 text-gray-900 rounded-2xl rounded-bl-md shadow-md'
                }`}>
                  <div className="p-4">
                    {/* Message content */}
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {/* Code snippets */}
                    {message.codeSnippets && message.codeSnippets.map((snippet, i) => (
                      <div key={i} className="mt-3 rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-900">
                        <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
                          <span className="text-xs font-mono font-semibold text-gray-300">{snippet.language}</span>
                          <button
                            onClick={() => handleCopy(snippet.code, `${message.id}-${i}`)}
                            className="flex items-center gap-1 text-xs text-gray-300 hover:text-white transition-colors"
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
                          <button
                            key={i}
                            onClick={() => handleAction(action)}
                            className="flex items-center gap-2 px-3 py-2 bg-[#0019ff] hover:bg-[#0015cc] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                          >
                            <Code size={14} />
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className={`mt-2 text-xs ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
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

      {/* Input */}
      <div className="px-6 py-4 bg-white border-t border-gray-200 shadow-lg flex-shrink-0">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Ask AI to write, explain, or optimize your code... (Shift+Enter for new line)"
              className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:border-[#0019ff] focus:ring-2 focus:ring-[#0019ff]/20 outline-none resize-none text-sm shadow-sm"
              rows={2}
              disabled={loading}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {input.length}/2000
            </div>
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="px-6 py-3 bg-gradient-to-r from-[#0019ff] to-[#0047ff] hover:from-[#0015cc] hover:to-[#003acc] text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Send size={18} />
            Send
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          💡 Tip: AI automatically analyzes your current code and compilation errors for context-aware suggestions
        </div>
      </div>
    </div>
  )
}

// Mock AI response generator (replace with real API)
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
      text: "I'll create a complete ERC-20 token contract with best practices. This includes standard functions, events, and security features.",
      codeSnippets: [
        {
          language: 'solidity',
          code: erc20Code
        }
      ],
      actions: [
        { label: 'Replace Current Code', type: 'replace' as const, code: erc20Code },
        { label: 'Insert at Cursor', type: 'insert' as const, code: erc20Code }
      ]
    }
  }

  if (lowerPrompt.includes('optimize') || lowerPrompt.includes('gas')) {
    const optimizedCode = context.code.replace(/uint8/g, 'uint256')
      .replace(/uint16/g, 'uint256')
      .replace(/uint32/g, 'uint256')

    return {
      text: "Here are 3 key gas optimizations I recommend:\n\n1. Use uint256 instead of smaller types (saves gas in loops)\n2. Pack storage variables to reduce SSTORE operations\n3. Use memory instead of storage where possible\n\nI've applied optimization #1 to your contract.",
      codeSnippets: [
        {
          language: 'solidity',
          code: optimizedCode
        }
      ],
      actions: [
        { label: 'Apply Optimizations', type: 'replace' as const, code: optimizedCode }
      ]
    }
  }

  if (lowerPrompt.includes('security') || lowerPrompt.includes('audit')) {
    const securityCode = `// Add this to your contract for reentrancy protection
bool private locked;

modifier nonReentrant() {
    require(!locked, "No reentrancy");
    locked = true;
    _;
    locked = false;
}

// Add this for access control
address public owner;

modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}

constructor() {
    owner = msg.sender;
}`
    return {
      text: "I've performed a security audit. Here are my findings:\n\n✅ Good: Using Solidity 0.8+ with overflow protection\n⚠️ Warning: No reentrancy guard on transfer function\n⚠️ Warning: Missing access control modifiers\n\nHere's the security code to add:",
      codeSnippets: [
        {
          language: 'solidity',
          code: securityCode
        }
      ],
      actions: [
        { label: 'Add Security Features', type: 'append' as const, code: '\n\n' + securityCode }
      ]
    }
  }

  if (lowerPrompt.includes('fix') || lowerPrompt.includes('error')) {
    return {
      text: `I've analyzed the compilation errors. The main issues are:\n\n${context.errors.map((e: any) => `• Line ${e.line}: ${e.message}`).join('\n') || 'No compilation errors found!'}\n\nYour code looks good! If you have specific errors, please compile first.`,
      codeSnippets: [],
      actions: []
    }
  }

  if (lowerPrompt.includes('explain')) {
    return {
      text: `This contract appears to be a ${context.code.includes('ERC-20') || context.code.includes('token') ? 'token contract' : 'smart contract'}.\n\nKey features:\n• Uses Solidity ${context.code.match(/pragma solidity \^?(\d+\.\d+)/)?.[1] || '0.8.0'}\n• ${context.code.split('function').length - 1} functions defined\n• ${context.code.split('event').length - 1} events\n\nWould you like me to explain a specific part in detail?`,
      codeSnippets: [],
      actions: []
    }
  }

  if (lowerPrompt.includes('test')) {
    const testCode = `// Test suite for your contract
describe("Contract Tests", function() {
    it("Should deploy successfully", async function() {
        const Contract = await ethers.getContractFactory("YourContract");
        const contract = await Contract.deploy();
        expect(contract.address).to.not.equal(0);
    });

    it("Should handle basic operations", async function() {
        // Add your test logic here
    });
});`
    return {
      text: "I'll generate a comprehensive test suite for your contract using Hardhat/Ethers.js:",
      codeSnippets: [
        {
          language: 'javascript',
          code: testCode
        }
      ],
      actions: [
        { label: 'Create Test File', type: 'insert' as const, code: testCode }
      ]
    }
  }

  return {
    text: "I understand your request. I can help with:\n\n• Writing new contracts (ERC-20, ERC-721, etc.)\n• Optimizing gas usage\n• Security audits\n• Explaining code\n• Generating tests\n• Fixing compilation errors\n\nWhat would you like me to do?",
    codeSnippets: [],
    actions: []
  }
}
