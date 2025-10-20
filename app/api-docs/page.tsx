'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useState } from 'react'
import { ChevronDown, ChevronRight, Copy, Check, ExternalLink, Code, BookOpen, Zap, Shield, ArrowRight, Lock, Blocks, ArrowRightLeft, Users, Database } from 'lucide-react'

interface EndpointProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  summary: string
  description: string
  requiresAuth?: boolean
  parameters?: Array<{
    name: string
    in: 'path' | 'query' | 'body'
    required: boolean
    type: string
    description: string
  }>
  requestBody?: {
    required: boolean
    content: any
  }
  responses: Record<string, {
    description: string
    content?: any
  }>
}

const Endpoint = ({ method, path, summary, description, requiresAuth, parameters, requestBody, responses }: EndpointProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Swagger UI standard colors - light backgrounds with darker borders
  const methodStyles = {
    GET: {
      bg: 'bg-[#e7f6fd]',
      border: 'border-[#61affe]',
      badge: 'bg-[#61affe]',
      text: 'text-[#0c3354]'
    },
    POST: {
      bg: 'bg-[#e7f7ed]',
      border: 'border-[#49cc90]',
      badge: 'bg-[#49cc90]',
      text: 'text-[#0e4d24]'
    },
    PUT: {
      bg: 'bg-[#fef5e7]',
      border: 'border-[#fca130]',
      badge: 'bg-[#fca130]',
      text: 'text-[#5e3a0f]'
    },
    DELETE: {
      bg: 'bg-[#fdeaea]',
      border: 'border-[#f93e3e]',
      badge: 'bg-[#f93e3e]',
      text: 'text-[#5e0f0f]'
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const generateCurlExample = () => {
    let curl = `curl -X ${method} "http://localhost:8080${path}"`
    if (requestBody) {
      curl += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(requestBody.content, null, 2)}'`
    }
    return curl
  }

  const style = methodStyles[method]

  return (
    <div className={`border-2 ${style.border} ${style.bg} rounded overflow-hidden mb-3 shadow-sm hover:shadow-md transition-all`}>
      <div
        className="flex items-stretch cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Method Badge - Left Side */}
        <div className={`${style.badge} text-white px-5 py-3.5 flex items-center justify-center min-w-[100px]`}>
          <span className="font-bold text-sm uppercase tracking-wide">{method}</span>
        </div>

        {/* Path & Summary - Middle (samme farvet baggrund) */}
        <div className="flex-1 px-4 py-3.5 flex items-center gap-3">
          <span className={`font-mono text-sm font-bold ${style.text}`}>{path}</span>
          <span className={`text-sm ${style.text} opacity-70`}>{summary}</span>
        </div>

        {/* Icons - Right Side */}
        <div className="flex items-center gap-3 px-4">
          {requiresAuth && (
            <Lock size={18} className="text-gray-600 opacity-60" />
          )}
          <ChevronDown
            size={20}
            className={`text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-300 bg-gray-50">
          <div className="p-6">
            {/* Description */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-700">{description}</p>
            </div>

            {/* Parameters */}
            {parameters && parameters.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Parameters</h4>
                <div className="border border-gray-300 rounded overflow-hidden bg-white">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b border-gray-300">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-900 text-xs">Name</th>
                        <th className="text-left p-3 font-semibold text-gray-900 text-xs">In</th>
                        <th className="text-left p-3 font-semibold text-gray-900 text-xs">Type</th>
                        <th className="text-left p-3 font-semibold text-gray-900 text-xs">Required</th>
                        <th className="text-left p-3 font-semibold text-gray-900 text-xs">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parameters.map((param, idx) => (
                        <tr key={idx} className="border-t border-gray-200">
                          <td className="p-3 font-mono text-xs font-semibold text-gray-900">{param.name}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs font-medium">
                              {param.in}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-xs text-gray-700">{param.type}</td>
                          <td className="p-3">
                            {param.required ? (
                              <span className="text-xs text-red-600 font-medium">required</span>
                            ) : (
                              <span className="text-xs text-gray-500 font-medium">optional</span>
                            )}
                          </td>
                          <td className="p-3 text-gray-700 text-xs">{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Request Body */}
            {requestBody && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Request Body</h4>
                <div className="bg-[#41444e] rounded p-4 relative">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(requestBody.content, null, 2), `request-${path}`)}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedCode === `request-${path}` ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <pre className="text-xs text-white overflow-x-auto font-mono">
                    <code>{JSON.stringify(requestBody.content, null, 2)}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Responses */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Responses</h4>
              {Object.entries(responses).map(([code, response]) => (
                <div key={code} className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded font-bold text-xs ${code.startsWith('2') ? 'bg-[#49cc90] text-white' : 'bg-[#f93e3e] text-white'}`}>
                      {code}
                    </span>
                    <span className="text-xs text-gray-700 font-medium">{response.description}</span>
                  </div>
                  {response.content && (
                    <div className="bg-[#41444e] rounded p-4 relative ml-4">
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(response.content, null, 2), `response-${code}-${path}`)}
                        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        {copiedCode === `response-${code}-${path}` ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                      <pre className="text-xs text-white overflow-x-auto font-mono">
                        <code>{JSON.stringify(response.content, null, 2)}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Try it out - cURL Example */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Try it out</h4>
              <div className="bg-[#41444e] rounded p-4 relative">
                <button
                  onClick={() => copyToClipboard(generateCurlExample(), `curl-${path}`)}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                >
                  {copiedCode === `curl-${path}` ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <pre className="text-xs text-green-400 overflow-x-auto font-mono">
                  <code>{generateCurlExample()}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ApiDocsPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>('core')
  const [activeGuide, setActiveGuide] = useState<'quickstart' | 'auth' | 'examples' | 'best-practices'>('quickstart')
  const [activeTab, setActiveTab] = useState<'overview' | 'reference'>('overview')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const scrollToSection = (sectionId: string) => {
    setActiveTab('reference')
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(id)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#0019ff] via-[#0019ff] to-[#0047ff] text-white">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded mb-6">
                <BookOpen size={18} />
                <span className="text-sm font-semibold">API Documentation</span>
                <span className="px-2 py-0.5 bg-white/20 rounded text-xs">v1.0.0</span>
              </div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Build on Rainum Blockchain
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-2xl">
                Enterprise-grade Layer-1 blockchain API with VRF consensus, atomic swaps, smart contracts, and 5000+ TPS.
                Start building in minutes with our comprehensive REST API.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <button
                  onClick={() => setActiveTab('overview')}
                  className="px-6 py-3 bg-white text-[#0019ff] rounded font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <Zap size={18} />
                  Get Started
                </button>
                <button
                  onClick={() => setActiveTab('reference')}
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded font-semibold hover:bg-white/20 transition-colors border border-white/20 flex items-center gap-2"
                >
                  <Code size={18} />
                  API Reference
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold mb-1">5,000+</div>
                  <div className="text-sm text-blue-200">Transactions/sec</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">0.4s</div>
                  <div className="text-sm text-blue-200">Block Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">100+</div>
                  <div className="text-sm text-blue-200">API Endpoints</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">99.9%</div>
                  <div className="text-sm text-blue-200">Uptime SLA</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Getting Started Section */}
              <div className="bg-white rounded border border-gray-300 overflow-hidden shadow-sm">
                <div className="bg-[#0019ff] text-white px-4 py-3">
                  <h3 className="font-bold text-sm">Getting Started</h3>
                </div>
                <div className="p-4">
                  <button
                    onClick={() => {
                      setActiveTab('reference')
                      setActiveGuide('quickstart')
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                      activeGuide === 'quickstart' && activeTab === 'reference' ? 'bg-[#0019ff] text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Quick Start
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('reference')
                      setActiveGuide('auth')
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors mt-1 ${
                      activeGuide === 'auth' && activeTab === 'reference' ? 'bg-[#0019ff] text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Authentication
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('reference')
                      setActiveGuide('examples')
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors mt-1 ${
                      activeGuide === 'examples' && activeTab === 'reference' ? 'bg-[#0019ff] text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Code Examples
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('reference')
                      setActiveGuide('best-practices')
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors mt-1 ${
                      activeGuide === 'best-practices' && activeTab === 'reference' ? 'bg-[#0019ff] text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Best Practices
                  </button>
                </div>
              </div>

              {/* API Sections Navigation */}
              <div className="bg-white rounded border border-gray-300 overflow-hidden shadow-sm">
                <div className="bg-gray-900 text-white px-4 py-3">
                  <h3 className="font-bold text-sm">API Sections</h3>
                </div>
                <div className="p-2 max-h-[400px] overflow-y-auto">
                  <button
                    onClick={() => scrollToSection('core')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    Core API
                  </button>
                  <button
                    onClick={() => scrollToSection('htlc')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    HTLC / Atomic Swaps
                  </button>
                  <button
                    onClick={() => scrollToSection('contracts')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    Smart Contracts
                  </button>
                  <button
                    onClick={() => scrollToSection('governance')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    Governance
                  </button>
                  <button
                    onClick={() => scrollToSection('bridge')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    Cross-Chain Bridge
                  </button>
                  <button
                    onClick={() => scrollToSection('zkp')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    Zero-Knowledge Proofs
                  </button>
                  <button
                    onClick={() => scrollToSection('validators')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    Validator Management
                  </button>
                  <button
                    onClick={() => scrollToSection('wallets')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    Wallet Operations
                  </button>
                  <button
                    onClick={() => scrollToSection('performance')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    Performance & Metrics
                  </button>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded border border-gray-300 overflow-hidden shadow-sm">
                <div className="bg-[#49cc90] text-white px-4 py-3">
                  <h3 className="font-bold text-sm">Resources</h3>
                </div>
                <div className="p-4 space-y-2">
                  <a href="#" className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#0019ff] transition-colors">
                    <ExternalLink size={14} />
                    <span>GitHub Repository</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#0019ff] transition-colors">
                    <BookOpen size={14} />
                    <span>Full Documentation</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#0019ff] transition-colors">
                    <Code size={14} />
                    <span>SDK Downloads</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Start Card - Make this a standout */}
                <div className="bg-white rounded border-2 border-[#0019ff] shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-[#0019ff] to-[#0047ff] p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur rounded flex items-center justify-center">
                        <Zap size={22} className="text-white" />
                      </div>
                      <h2 className="text-2xl font-bold">Make Your First API Call in 30 Seconds</h2>
                    </div>
                    <p className="text-blue-100">No sign up required. Start testing immediately.</p>
                  </div>

                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Left: Request */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <ArrowRight size={18} className="text-[#0019ff]" />
                            Request
                          </h3>
                          <button
                            onClick={() => handleCopy(`curl http://localhost:8080/status \\
  -H "Content-Type: application/json"`, 'overview-request')}
                            className="text-xs text-[#0019ff] hover:underline flex items-center gap-1"
                          >
                            {copiedCode === 'overview-request' ? <Check size={12} /> : <Copy size={12} />}
                            {copiedCode === 'overview-request' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <div className="bg-[#1e1e1e] rounded p-4 border border-gray-800">
                          <pre className="text-xs text-green-400 font-mono overflow-x-auto leading-relaxed">
{`curl http://localhost:8080/status \\
  -H "Content-Type: application/json"`}
                          </pre>
                        </div>
                      </div>

                      {/* Right: Response */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Check size={18} className="text-[#49cc90]" />
                            Response
                          </h3>
                          <span className="px-2 py-1 bg-[#49cc90] text-white text-xs font-bold rounded">200 OK</span>
                        </div>
                        <div className="bg-[#1e1e1e] rounded p-4 border border-gray-800">
                          <pre className="text-xs text-gray-300 font-mono overflow-x-auto leading-relaxed">
{`{
  "total_blocks": 15234567,
  "total_transactions": 1200000000,
  "average_block_time": 0.4,
  "peak_tps": 5000.0
}`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded p-4">
                      <Shield size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-blue-900 text-sm mb-1">No Authentication Required</div>
                        <div className="text-xs text-blue-700">Most endpoints are public. JWT authentication is only needed for admin features.</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => scrollToSection('core')}>
                    <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center mb-4">
                      <Blocks size={24} className="text-[#0019ff]" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Core Blockchain</h3>
                    <p className="text-sm text-gray-600 mb-4">Access blocks, transactions, accounts, and real-time blockchain data</p>
                    <div className="text-xs text-[#0019ff] font-semibold flex items-center gap-1">
                      Explore API →
                    </div>
                  </div>

                  <div className="bg-white rounded border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => scrollToSection('contracts')}>
                    <div className="w-12 h-12 bg-purple-100 rounded flex items-center justify-center mb-4">
                      <Code size={24} className="text-purple-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Smart Contracts</h3>
                    <p className="text-sm text-gray-600 mb-4">Deploy and interact with EVM-compatible smart contracts</p>
                    <div className="text-xs text-[#0019ff] font-semibold flex items-center gap-1">
                      Explore API →
                    </div>
                  </div>

                  <div className="bg-white rounded border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => scrollToSection('htlc')}>
                    <div className="w-12 h-12 bg-green-100 rounded flex items-center justify-center mb-4">
                      <ArrowRightLeft size={24} className="text-green-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Atomic Swaps</h3>
                    <p className="text-sm text-gray-600 mb-4">Cross-chain swaps with Ethereum using HTLC protocol</p>
                    <div className="text-xs text-[#0019ff] font-semibold flex items-center gap-1">
                      Explore API →
                    </div>
                  </div>
                </div>

                {/* Popular Use Cases */}
                <div className="bg-white rounded border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold mb-6">Popular Use Cases</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-[#0019ff]">1</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">Send & Receive Payments</h3>
                          <p className="text-sm text-gray-600 mb-3">Transfer RAIN tokens with sub-second confirmation times and low fees.</p>
                          <button onClick={() => scrollToSection('core')} className="text-xs text-[#0019ff] font-semibold hover:underline">
                            View /transaction endpoint →
                          </button>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-purple-600">2</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">Deploy DeFi Applications</h3>
                          <p className="text-sm text-gray-600 mb-3">Build decentralized exchanges, lending protocols, and yield farms.</p>
                          <button onClick={() => scrollToSection('contracts')} className="text-xs text-[#0019ff] font-semibold hover:underline">
                            View Smart Contracts API →
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-green-600">3</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">Cross-Chain Trading</h3>
                          <p className="text-sm text-gray-600 mb-3">Execute trustless atomic swaps between Rainum and Ethereum.</p>
                          <button onClick={() => scrollToSection('htlc')} className="text-xs text-[#0019ff] font-semibold hover:underline">
                            View HTLC API →
                          </button>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-yellow-100 rounded flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-yellow-600">4</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">Run Validators</h3>
                          <p className="text-sm text-gray-600 mb-3">Participate in consensus and earn rewards with tiered staking.</p>
                          <button onClick={() => scrollToSection('validators')} className="text-xs text-[#0019ff] font-semibold hover:underline">
                            View Validator API →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SDK Cards */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded p-8 text-white">
                  <h2 className="text-2xl font-bold mb-2">Client Libraries & SDKs</h2>
                  <p className="text-gray-300 mb-6">Integrate Rainum in your favorite programming language</p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white/10 backdrop-blur rounded p-5 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
                      <div className="font-bold mb-2 flex items-center gap-2">
                        <Code size={18} />
                        JavaScript / TypeScript
                      </div>
                      <p className="text-xs text-gray-300 mb-3">Official Node.js SDK with TypeScript support</p>
                      <div className="text-xs font-mono bg-black/30 rounded px-3 py-2">npm install @rainum/sdk</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur rounded p-5 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
                      <div className="font-bold mb-2 flex items-center gap-2">
                        <Code size={18} />
                        Python
                      </div>
                      <p className="text-xs text-gray-300 mb-3">Pythonic interface for Rainum blockchain</p>
                      <div className="text-xs font-mono bg-black/30 rounded px-3 py-2">pip install rainum</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur rounded p-5 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
                      <div className="font-bold mb-2 flex items-center gap-2">
                        <Code size={18} />
                        Go
                      </div>
                      <p className="text-xs text-gray-300 mb-3">High-performance Go client library</p>
                      <div className="text-xs font-mono bg-black/30 rounded px-3 py-2">go get github.com/rainum/sdk</div>
                    </div>
                  </div>
                </div>

                {/* Next Steps - More Actionable */}
                <div className="bg-white rounded border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold mb-6">Ready to Build?</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <button
                      onClick={() => {
                        setActiveGuide('quickstart')
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="text-left bg-gradient-to-br from-[#0019ff] to-[#0047ff] text-white rounded p-6 hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Zap size={24} />
                        <h3 className="font-bold text-xl">Quick Start Tutorial</h3>
                      </div>
                      <p className="text-blue-100 text-sm mb-4">Follow our step-by-step guide to make your first API call, send transactions, and more.</p>
                      <div className="text-sm font-semibold flex items-center gap-2">
                        Start Tutorial <ArrowRight size={16} />
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('reference')}
                      className="text-left bg-white border-2 border-gray-200 rounded p-6 hover:border-[#0019ff] hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <BookOpen size={24} className="text-[#0019ff]" />
                        <h3 className="font-bold text-xl text-gray-900">Full API Reference</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">Browse all 100+ endpoints with detailed parameters, responses, and code examples.</p>
                      <div className="text-sm font-semibold text-[#0019ff] flex items-center gap-2">
                        View Reference <ArrowRight size={16} />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reference' && (
              <div className="space-y-6">
                {/* Guide Content */}
                {activeGuide === 'quickstart' && (
              <div className="bg-white rounded border border-gray-300 p-8 mb-6 shadow-sm">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Quick Start Guide</h2>
                <p className="text-gray-600 mb-6 text-base">Get up and running with Rainum Blockchain API in under 5 minutes</p>

                <div className="space-y-8">
                  {/* Introduction */}
                  <div className="bg-gradient-to-r from-[#0019ff]/5 to-transparent border-l-4 border-[#0019ff] p-5 rounded-r">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg flex items-center gap-2">
                      <BookOpen size={20} className="text-[#0019ff]" />
                      What is Rainum Blockchain?
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      Rainum is an enterprise-grade Layer-1 blockchain featuring VRF-based consensus, cross-chain atomic swaps via HTLC,
                      EVM-compatible smart contracts, zero-knowledge proofs for privacy, and a multi-tier validator system capable of 5000+ TPS.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                      <div className="bg-white rounded p-3 border border-gray-200">
                        <div className="text-2xl font-bold text-[#0019ff]">5000+</div>
                        <div className="text-xs text-gray-600">TPS Throughput</div>
                      </div>
                      <div className="bg-white rounded p-3 border border-gray-200">
                        <div className="text-2xl font-bold text-[#49cc90]">0.4s</div>
                        <div className="text-xs text-gray-600">Block Time</div>
                      </div>
                      <div className="bg-white rounded p-3 border border-gray-200">
                        <div className="text-2xl font-bold text-[#fca130]">100+</div>
                        <div className="text-xs text-gray-600">API Endpoints</div>
                      </div>
                      <div className="bg-white rounded p-3 border border-gray-200">
                        <div className="text-2xl font-bold text-[#f93e3e]">EVM</div>
                        <div className="text-xs text-gray-600">Compatible</div>
                      </div>
                    </div>
                  </div>

                  {/* Prerequisites */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                      <Shield size={20} className="text-green-600" />
                      Prerequisites
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span><strong>HTTP Client:</strong> Any tool that can make HTTP requests (curl, Postman, or programming language HTTP library)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span><strong>JSON Knowledge:</strong> Basic understanding of JSON format for request/response bodies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span><strong>Blockchain Basics:</strong> Familiarity with addresses, transactions, and blocks (helpful but not required)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span><strong>Optional:</strong> Ethereum wallet address for testing (can be generated via API)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Step 1 */}
                  <div className="border border-gray-200 rounded p-5 bg-gray-50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-[#0019ff] text-white rounded-full flex items-center justify-center font-bold">1</div>
                      <h3 className="font-bold text-gray-900 text-lg">Configure Base URL & Headers</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      All API requests must be sent to the base URL with proper headers. The API accepts and returns JSON data.
                    </p>
                    <div className="bg-white border border-gray-300 rounded p-4 mb-3">
                      <div className="text-xs font-semibold text-gray-600 mb-1">BASE URL</div>
                      <code className="block bg-gray-100 px-3 py-2 rounded font-mono text-sm text-[#0019ff]">
                        http://localhost:8080
                      </code>
                    </div>
                    <div className="bg-white border border-gray-300 rounded p-4">
                      <div className="text-xs font-semibold text-gray-600 mb-2">REQUIRED HEADERS</div>
                      <div className="space-y-1 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Content-Type:</span>
                          <span className="text-[#49cc90]">application/json</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Authorization:</span>
                          <span className="text-gray-400">Bearer TOKEN (for protected endpoints)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="border border-gray-200 rounded p-5 bg-gray-50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-[#0019ff] text-white rounded-full flex items-center justify-center font-bold">2</div>
                      <h3 className="font-bold text-gray-900 text-lg">Check Blockchain Status</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      Verify the API is running and retrieve current blockchain statistics including block height, transaction count, and network health.
                    </p>
                    <div className="bg-[#41444e] rounded p-4 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-400">CURL REQUEST</span>
                        <button
                          onClick={() => handleCopy(`curl -X GET "http://localhost:8080/status" \\
  -H "Content-Type: application/json"`, 'quickstart-status')}
                          className="text-gray-400 hover:text-white text-xs flex items-center gap-1"
                        >
                          {copiedCode === 'quickstart-status' ? <Check size={12} /> : <Copy size={12} />}
                          {copiedCode === 'quickstart-status' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <pre className="text-xs text-green-400 font-mono overflow-x-auto">
{`curl -X GET "http://localhost:8080/status" \\
  -H "Content-Type: application/json"`}
                      </pre>
                    </div>
                    <div className="bg-white border border-gray-300 rounded p-4">
                      <div className="text-xs font-semibold text-gray-600 mb-2">RESPONSE EXAMPLE (200 OK)</div>
                      <pre className="text-xs text-gray-700 font-mono overflow-x-auto">
{`{
  "total_blocks": 15234567,
  "total_accounts": 2500000,
  "total_transactions": 1200000000,
  "pending_transactions": 42,
  "average_block_time": 0.4,
  "peak_tps": 5000.0,
  "node_id": "validator_t3_1",
  "node_tier": "3",
  "network_health": "excellent"
}`}
                      </pre>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="border border-gray-200 rounded p-5 bg-gray-50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-[#49cc90] text-white rounded-full flex items-center justify-center font-bold">3</div>
                      <h3 className="font-bold text-gray-900 text-lg">Get Testnet Tokens</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      Request free testnet RAIN tokens from the faucet. Each request grants 1000 RAIN tokens for testing purposes.
                      Rate limited to 1 request per address per 24 hours.
                    </p>
                    <div className="bg-[#41444e] rounded p-4 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-400">CURL REQUEST</span>
                        <button
                          onClick={() => handleCopy(`curl -X POST "http://localhost:8080/faucet" \\
  -H "Content-Type: application/json" \\
  -d '{
    "address": "0x5e32bf527466df1da2404704fb3121f7d084a08c"
  }'`, 'quickstart-faucet')}
                          className="text-gray-400 hover:text-white text-xs flex items-center gap-1"
                        >
                          {copiedCode === 'quickstart-faucet' ? <Check size={12} /> : <Copy size={12} />}
                          {copiedCode === 'quickstart-faucet' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <pre className="text-xs text-green-400 font-mono overflow-x-auto">
{`curl -X POST "http://localhost:8080/faucet" \\
  -H "Content-Type: application/json" \\
  -d '{
    "address": "0x5e32bf527466df1da2404704fb3121f7d084a08c"
  }'`}
                      </pre>
                    </div>
                    <div className="bg-white border border-gray-300 rounded p-4 mb-3">
                      <div className="text-xs font-semibold text-gray-600 mb-2">RESPONSE EXAMPLE (200 OK)</div>
                      <pre className="text-xs text-gray-700 font-mono overflow-x-auto">
{`{
  "success": true,
  "message": "Sent 1000 RAIN to address",
  "amount": "1000",
  "tx_hash": "0xabc123def456...",
  "balance": "1000"
}`}
                      </pre>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <p className="text-xs text-yellow-800">
                        <strong>⚠️ Rate Limit:</strong> 1 request per address per 24 hours. For production use, acquire RAIN tokens through exchanges.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="border border-gray-200 rounded p-5 bg-gray-50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-[#49cc90] text-white rounded-full flex items-center justify-center font-bold">4</div>
                      <h3 className="font-bold text-gray-900 text-lg">Send Your First Transaction</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      Submit a transaction to transfer RAIN tokens between addresses. Transactions are processed immediately and confirmed in ~0.4 seconds.
                    </p>
                    <div className="bg-[#41444e] rounded p-4 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-400">CURL REQUEST</span>
                        <button
                          onClick={() => handleCopy(`curl -X POST "http://localhost:8080/transaction" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "0x5e32bf527466df1da2404704fb3121f7d084a08c",
    "to": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    "amount": "100000000"
  }'`, 'quickstart-transaction')}
                          className="text-gray-400 hover:text-white text-xs flex items-center gap-1"
                        >
                          {copiedCode === 'quickstart-transaction' ? <Check size={12} /> : <Copy size={12} />}
                          {copiedCode === 'quickstart-transaction' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <pre className="text-xs text-green-400 font-mono overflow-x-auto">
{`curl -X POST "http://localhost:8080/transaction" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "0x5e32bf527466df1da2404704fb3121f7d084a08c",
    "to": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    "amount": "100000000"
  }'`}
                      </pre>
                    </div>
                    <div className="bg-white border border-gray-300 rounded p-4 mb-3">
                      <div className="text-xs font-semibold text-gray-600 mb-2">RESPONSE EXAMPLE (200 OK)</div>
                      <pre className="text-xs text-gray-700 font-mono overflow-x-auto">
{`{
  "success": true,
  "message": "Transaction submitted",
  "tx_hash": "0xabc123def456789...",
  "from": "0x5e32bf527466df1da2404704fb3121f7d084a08c",
  "to": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
  "amount": "100000000",
  "gas_used": 21000,
  "status": "confirmed",
  "block_number": 15234568
}`}
                      </pre>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white border border-gray-200 rounded p-3">
                        <div className="text-xs text-gray-600 mb-1">Amount Format</div>
                        <div className="text-xs font-mono text-gray-900">Wei (1 RAIN = 10^18)</div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded p-3">
                        <div className="text-xs text-gray-600 mb-1">Gas Fee</div>
                        <div className="text-xs font-mono text-gray-900">~21,000 wei</div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded p-3">
                        <div className="text-xs text-gray-600 mb-1">Confirmation</div>
                        <div className="text-xs font-mono text-gray-900">~0.4 seconds</div>
                      </div>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="border border-gray-200 rounded p-5 bg-gray-50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-[#fca130] text-white rounded-full flex items-center justify-center font-bold">5</div>
                      <h3 className="font-bold text-gray-900 text-lg">Verify Transaction Status</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      Check your transaction status and account balance to confirm the transfer was successful.
                    </p>
                    <div className="bg-[#41444e] rounded p-4 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-400">CURL REQUEST</span>
                      </div>
                      <pre className="text-xs text-green-400 font-mono overflow-x-auto">
{`# Check account balance
curl -X GET "http://localhost:8080/account/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1" \\
  -H "Content-Type: application/json"`}
                      </pre>
                    </div>
                    <div className="bg-white border border-gray-300 rounded p-4">
                      <div className="text-xs font-semibold text-gray-600 mb-2">RESPONSE EXAMPLE</div>
                      <pre className="text-xs text-gray-700 font-mono overflow-x-auto">
{`{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
  "balance": "100000000",
  "nonce": 1,
  "is_validator": false,
  "transactions_count": 1
}`}
                      </pre>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-gradient-to-r from-blue-50 to-transparent border-l-4 border-blue-500 p-5 rounded-r">
                    <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                      <Zap size={20} className="text-blue-600" />
                      Next Steps
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-white rounded p-4 border border-gray-200">
                        <div className="font-semibold text-sm text-gray-900 mb-2">🔐 Enable Authentication</div>
                        <p className="text-xs text-gray-600 mb-2">Set up JWT authentication for admin and enterprise endpoints</p>
                        <button onClick={() => setActiveGuide('auth')} className="text-xs text-[#0019ff] hover:underline font-medium">
                          View Auth Guide →
                        </button>
                      </div>
                      <div className="bg-white rounded p-4 border border-gray-200">
                        <div className="font-semibold text-sm text-gray-900 mb-2">💻 Integrate SDK</div>
                        <p className="text-xs text-gray-600 mb-2">Use code examples in JavaScript, Python, or Go</p>
                        <button onClick={() => setActiveGuide('examples')} className="text-xs text-[#0019ff] hover:underline font-medium">
                          View Examples →
                        </button>
                      </div>
                      <div className="bg-white rounded p-4 border border-gray-200">
                        <div className="font-semibold text-sm text-gray-900 mb-2">⚡ Deploy Smart Contracts</div>
                        <p className="text-xs text-gray-600 mb-2">Deploy and interact with EVM-compatible smart contracts</p>
                        <button onClick={() => scrollToSection('contracts')} className="text-xs text-[#0019ff] hover:underline font-medium">
                          View Smart Contracts API →
                        </button>
                      </div>
                      <div className="bg-white rounded p-4 border border-gray-200">
                        <div className="font-semibold text-sm text-gray-900 mb-2">🔄 Cross-Chain Swaps</div>
                        <p className="text-xs text-gray-600 mb-2">Execute atomic swaps with Ethereum using HTLC</p>
                        <button onClick={() => scrollToSection('htlc')} className="text-xs text-[#0019ff] hover:underline font-medium">
                          View HTLC API →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Common Errors */}
                  <div className="bg-red-50 border border-red-200 rounded p-5">
                    <h3 className="font-bold text-gray-900 mb-3 text-base flex items-center gap-2">
                      <Shield size={18} className="text-red-600" />
                      Common Errors & Solutions
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div className="bg-white rounded p-3 border border-red-100">
                        <div className="font-semibold text-red-800 mb-1">400 Bad Request - Invalid address format</div>
                        <div className="text-gray-600">Ensure addresses start with "0x" and are 42 characters long (including prefix)</div>
                      </div>
                      <div className="bg-white rounded p-3 border border-red-100">
                        <div className="font-semibold text-red-800 mb-1">400 Bad Request - Insufficient balance</div>
                        <div className="text-gray-600">Request tokens from faucet first or check your account balance</div>
                      </div>
                      <div className="bg-white rounded p-3 border border-red-100">
                        <div className="font-semibold text-red-800 mb-1">429 Too Many Requests</div>
                        <div className="text-gray-600">Rate limit exceeded. Wait before making more requests</div>
                      </div>
                      <div className="bg-white rounded p-3 border border-red-100">
                        <div className="font-semibold text-red-800 mb-1">500 Internal Server Error</div>
                        <div className="text-gray-600">Contact support or check node status at /status endpoint</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeGuide === 'auth' && (
              <div className="bg-white rounded border border-gray-300 p-6 mb-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h2>
                <div className="space-y-4 text-sm text-gray-700">
                  <p>Most endpoints are public and don't require authentication. However, administrative and enterprise features require a JWT token.</p>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-base">Authenticate</h3>
                    <div className="bg-[#41444e] rounded p-4 mb-2">
                      <pre className="text-xs text-green-400 font-mono">
{`curl -X POST "http://localhost:8080/enterprise/auth/authenticate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "admin",
    "password": "your-password"
  }'`}
                      </pre>
                    </div>
                    <p className="text-xs text-gray-600">Response will contain a JWT token valid for 1 hour.</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-base">Use Token in Requests</h3>
                    <div className="bg-[#41444e] rounded p-4">
                      <pre className="text-xs text-green-400 font-mono">
{`curl -X GET "http://localhost:8080/enterprise/auth/user" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>🔒 Security:</strong> Endpoints requiring authentication are marked with a lock icon <Lock size={14} className="inline" /> in the API reference below.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeGuide === 'examples' && (
              <div className="bg-white rounded border border-gray-300 p-6 mb-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-base">JavaScript / Node.js</h3>
                    <div className="bg-[#41444e] rounded p-4">
                      <pre className="text-xs text-white font-mono">
{`const axios = require('axios');

// Get blockchain status
const getStatus = async () => {
  const response = await axios.get('http://localhost:8080/status');
  console.log(response.data);
};

// Submit transaction
const sendTransaction = async () => {
  const response = await axios.post('http://localhost:8080/transaction', {
    from: '0x5e32bf527466df1da2404704fb3121f7d084a08c',
    to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    amount: '100000000'
  });
  console.log(response.data);
};`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-base">Python</h3>
                    <div className="bg-[#41444e] rounded p-4">
                      <pre className="text-xs text-white font-mono">
{`import requests

# Get blockchain status
response = requests.get('http://localhost:8080/status')
print(response.json())

# Submit transaction
payload = {
    'from': '0x5e32bf527466df1da2404704fb3121f7d084a08c',
    'to': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    'amount': '100000000'
}
response = requests.post('http://localhost:8080/transaction', json=payload)
print(response.json())`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-base">Go</h3>
                    <div className="bg-[#41444e] rounded p-4">
                      <pre className="text-xs text-white font-mono">
{`package main

import (
    "bytes"
    "encoding/json"
    "net/http"
)

func main() {
    // Get blockchain status
    resp, _ := http.Get("http://localhost:8080/status")
    // Handle response...

    // Submit transaction
    payload := map[string]string{
        "from": "0x5e32bf527466df1da2404704fb3121f7d084a08c",
        "to": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
        "amount": "100000000",
    }
    jsonData, _ := json.Marshal(payload)
    http.Post("http://localhost:8080/transaction", "application/json", bytes.NewBuffer(jsonData))
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeGuide === 'best-practices' && (
              <div className="bg-white rounded border border-gray-300 p-6 mb-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Shield size={18} className="text-green-600" />
                      Error Handling
                    </h3>
                    <p className="text-sm text-gray-700 mb-2">Always implement proper error handling for API requests:</p>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Check HTTP status codes (200 = success, 400 = bad request, 404 = not found)</li>
                      <li>Parse error messages from response body</li>
                      <li>Implement retry logic for network failures</li>
                      <li>Use exponential backoff for rate limiting</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Zap size={18} className="text-yellow-600" />
                      Performance
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Use batch endpoints when available</li>
                      <li>Cache frequently accessed data</li>
                      <li>Implement pagination for large result sets</li>
                      <li>Monitor API response times</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Lock size={18} className="text-blue-600" />
                      Security
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Never expose API keys or private keys in frontend code</li>
                      <li>Store JWT tokens securely (httpOnly cookies recommended)</li>
                      <li>Validate all user inputs before sending to API</li>
                      <li>Use HTTPS in production environments</li>
                      <li>Implement rate limiting on your application side</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Code size={18} className="text-purple-600" />
                      Transaction Best Practices
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Always estimate gas before submitting transactions</li>
                      <li>Verify account balance before transactions</li>
                      <li>Use proper nonce management for transaction ordering</li>
                      <li>Wait for transaction confirmation before proceeding</li>
                      <li>Handle transaction failures gracefully</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

                {/* Server Info Cards - Only in Reference Tab */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded border border-gray-300 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#61affe]/10 rounded flex items-center justify-center">
                        <Zap className="text-[#61affe]" size={20} />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">Base URL</h3>
                    </div>
                    <code className="text-xs bg-gray-100 px-3 py-2 rounded font-mono text-gray-900 block">
                      http://localhost:8080
                    </code>
                  </div>

                  <div className="bg-white rounded border border-gray-300 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#49cc90]/10 rounded flex items-center justify-center">
                        <Shield className="text-[#49cc90]" size={20} />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">Authentication</h3>
                    </div>
                    <p className="text-xs text-gray-700">Bearer JWT Token (optional)</p>
                  </div>

                  <div className="bg-white rounded border border-gray-300 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#fca130]/10 rounded flex items-center justify-center">
                        <Code className="text-[#fca130]" size={20} />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">Content Type</h3>
                    </div>
                    <code className="text-xs bg-gray-100 px-3 py-2 rounded font-mono text-gray-900 block">
                      application/json
                    </code>
                  </div>
                </div>

                {/* API Endpoints - Collapsible Sections */}
                <div className="space-y-3">
          {/* Core Endpoints */}
          <div id="core" className="bg-white rounded border border-gray-300 overflow-hidden scroll-mt-24">
            <button
              onClick={() => toggleSection('core')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`transform transition-transform ${expandedSection === 'core' ? 'rotate-90' : ''}`}>
                  <ChevronRight size={20} className="text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Core API</h2>
                <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs font-semibold">8 endpoints</span>
              </div>
            </button>
            {expandedSection === 'core' && (
              <div className="p-4 pt-0 space-y-3">
                <Endpoint
                  method="GET"
                  path="/status"
                  summary="Get blockchain status"
                  description="Returns the current status of the blockchain including total blocks, accounts, transactions, validators, and network information."
                  responses={{
                    '200': {
                      description: 'Successful response',
                      content: {
                        total_blocks: 15234567,
                        total_accounts: 2500000,
                        total_transactions: 1200000000,
                        pending_transactions: 42,
                        average_block_time: 0.4,
                        peak_tps: 5000.0,
                        node_id: 'validator_t3_1',
                        node_tier: '3'
                      }
                    }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/blocks"
                  summary="Get recent blocks"
                  description="Retrieve a list of recent blocks from the blockchain with transaction counts and validator information."
                  parameters={[
                    { name: 'limit', in: 'query', required: false, type: 'number', description: 'Number of blocks to return (default: 10)' }
                  ]}
                  responses={{
                    '200': {
                      description: 'List of blocks',
                      content: [{
                        id: 15234567,
                        hash: '0xa1b2c3d4...',
                        previous_hash: '0x9e8f7d6c...',
                        timestamp: 1633024800,
                        transaction_count: 342,
                        validator: '0x5e32bf527466df1da2404704fb3121f7d084a08c'
                      }]
                    }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/block/:hash"
                  summary="Get block by hash"
                  description="Retrieve detailed information about a specific block including all transactions and validator details."
                  parameters={[
                    { name: 'hash', in: 'path', required: true, type: 'string', description: 'Block hash (with or without 0x prefix)' }
                  ]}
                  responses={{
                    '200': { description: 'Block details' },
                    '404': { description: 'Block not found' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/transactions"
                  summary="Get recent transactions"
                  description="Retrieve a list of recent transactions from the blockchain with sender, receiver, amount, and status."
                  responses={{
                    '200': {
                      description: 'List of transactions',
                      content: [{
                        hash: '0xabc123...',
                        from: '0x5e32bf527466df1da2404704fb3121f7d084a08c',
                        to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
                        amount: '100000000',
                        timestamp: 1633024800,
                        status: 'confirmed'
                      }]
                    }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/transaction"
                  summary="Submit new transaction"
                  description="Submit a new transaction to the blockchain for processing."
                  requestBody={{
                    required: true,
                    content: {
                      from: '0x5e32bf527466df1da2404704fb3121f7d084a08c',
                      to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
                      amount: '100000000'
                    }
                  }}
                  responses={{
                    '200': {
                      description: 'Transaction submitted successfully',
                      content: { success: true, message: 'Transaction submitted', tx_hash: '0xabc123...' }
                    },
                    '400': { description: 'Invalid transaction data' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/account/:address"
                  summary="Get account information"
                  description="Retrieve detailed information about a specific account including balance, nonce, and validator status."
                  parameters={[
                    { name: 'address', in: 'path', required: true, type: 'string', description: 'Account address' }
                  ]}
                  responses={{
                    '200': {
                      description: 'Account details',
                      content: {
                        address: '0x5e32bf527466df1da2404704fb3121f7d084a08c',
                        balance: 1500000000,
                        nonce: 42,
                        is_validator: true
                      }
                    },
                    '404': { description: 'Account not found' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/validators"
                  summary="Get all validators"
                  description="Retrieve information about all validators in the network including stake, tier, status, blocks produced, and rewards."
                  responses={{
                    '200': {
                      description: 'List of validators',
                      content: [{
                        address: '0x5e32bf527466df1da2404704fb3121f7d084a08c',
                        stake: 100000000,
                        tier: 3,
                        is_active: true,
                        is_jailed: false,
                        total_blocks_produced: 1234,
                        total_rewards: 50000000
                      }]
                    }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/faucet"
                  summary="Request testnet tokens"
                  description="Request free testnet RAIN tokens for development and testing purposes."
                  requestBody={{
                    required: true,
                    content: { address: '0x5e32bf527466df1da2404704fb3121f7d084a08c' }
                  }}
                  responses={{
                    '200': {
                      description: 'Tokens sent successfully',
                      content: { success: true, message: 'Sent 1000 RAIN to address' }
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* HTLC / Atomic Swaps */}
          <div id="htlc" className="bg-white rounded border border-gray-300 overflow-hidden scroll-mt-24">
            <button
              onClick={() => toggleSection('htlc')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`transform transition-transform ${expandedSection === 'htlc' ? 'rotate-90' : ''}`}>
                  <ChevronRight size={20} className="text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">HTLC / Atomic Swaps</h2>
                <span className="px-2 py-1 bg-[#fca130]/20 text-[#fca130] rounded text-xs font-semibold">6 endpoints</span>
              </div>
            </button>
            {expandedSection === 'htlc' && (
              <div className="p-4 pt-0 space-y-3">
                <Endpoint
                  method="POST"
                  path="/api/htlc/create"
                  summary="Create HTLC contract"
                  description="Create a new Hash Time-Locked Contract for cross-chain atomic swaps with secret hash and timelock."
                  requestBody={{
                    required: true,
                    content: {
                      sender: '0x5e32bf527466df1da2404704fb3121f7d084a08c',
                      receiver: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
                      amount: '100',
                      secret: 'deadbeef...',
                      timeout_hours: 24,
                      target_chain: 'ethereum'
                    }
                  }}
                  responses={{
                    '200': {
                      description: 'HTLC created successfully',
                      content: { success: true, message: 'HTLC created', htlc: { contract_id: 'htlc_abc123', hash_lock: '0x247d08f3...', state: 'Locked' } }
                    }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/api/htlc/claim"
                  summary="Claim HTLC funds"
                  description="Claim funds from an HTLC contract by providing the secret preimage."
                  requestBody={{
                    required: true,
                    content: { contract_id: 'htlc_abc123', secret: 'deadbeef...' }
                  }}
                  responses={{
                    '200': { description: 'Funds claimed successfully' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/api/htlc/refund"
                  summary="Refund HTLC"
                  description="Refund an expired HTLC contract back to the sender after the timelock has expired."
                  requestBody={{
                    required: true,
                    content: { contract_id: 'htlc_abc123' }
                  }}
                  responses={{
                    '200': { description: 'Refund successful' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/api/htlc/:contract_id"
                  summary="Get HTLC details"
                  description="Retrieve detailed information about a specific HTLC contract."
                  parameters={[
                    { name: 'contract_id', in: 'path', required: true, type: 'string', description: 'HTLC contract ID' }
                  ]}
                  responses={{
                    '200': { description: 'HTLC contract details' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/api/htlc/address/:address"
                  summary="Get HTLCs for address"
                  description="Retrieve all HTLC contracts associated with a specific address (as sender or receiver)."
                  parameters={[
                    { name: 'address', in: 'path', required: true, type: 'string', description: 'Ethereum address' }
                  ]}
                  responses={{
                    '200': { description: 'List of HTLC contracts' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/api/htlc/stats"
                  summary="Get swap statistics"
                  description="Retrieve global statistics about atomic swaps including total volume, active swaps, and success rate."
                  responses={{
                    '200': { description: 'Swap statistics' }
                  }}
                />
              </div>
            )}
          </div>

          {/* Smart Contracts */}
          <div id="contracts" className="bg-white rounded border border-gray-300 overflow-hidden scroll-mt-24">
            <button
              onClick={() => toggleSection('contracts')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`transform transition-transform ${expandedSection === 'contracts' ? 'rotate-90' : ''}`}>
                  <ChevronRight size={20} className="text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Smart Contracts</h2>
                <span className="px-2 py-1 bg-[#49cc90]/20 text-[#49cc90] rounded text-xs font-semibold">10 endpoints</span>
              </div>
            </button>
            {expandedSection === 'contracts' && (
              <div className="p-4 pt-0 space-y-3">
                <Endpoint
                  method="POST"
                  path="/contract/deploy"
                  summary="Deploy smart contract"
                  description="Deploy a new EVM-compatible smart contract to the blockchain."
                  requestBody={{
                    required: true,
                    content: { deployer: '0x...', bytecode: '0x608060...', constructor_args: [] }
                  }}
                  responses={{
                    '200': { description: 'Contract deployed successfully' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/contract/call"
                  summary="Call contract method"
                  description="Execute a method on a deployed smart contract."
                  requestBody={{
                    required: true,
                    content: { caller: '0x...', contract: '0x...', method: 'transfer', args: ['0x...', '100'] }
                  }}
                  responses={{
                    '200': { description: 'Method executed successfully' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/contracts"
                  summary="List all contracts"
                  description="Retrieve a list of all deployed smart contracts on the blockchain."
                  responses={{
                    '200': { description: 'List of contracts' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/contract/:address"
                  summary="Get contract details"
                  description="Retrieve detailed information about a specific smart contract including bytecode, ABI, and storage."
                  parameters={[
                    { name: 'address', in: 'path', required: true, type: 'string', description: 'Contract address' }
                  ]}
                  responses={{
                    '200': { description: 'Contract details' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/contracts/verify"
                  summary="Verify contract source"
                  description="Verify smart contract source code against deployed bytecode."
                  requestBody={{
                    required: true,
                    content: { address: '0x...', source_code: 'contract MyToken {...}', compiler_version: '0.8.0' }
                  }}
                  responses={{
                    '200': { description: 'Contract verified successfully' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/contracts/:address/verification"
                  summary="Get verification status"
                  description="Check if a contract has been verified and retrieve its source code."
                  parameters={[
                    { name: 'address', in: 'path', required: true, type: 'string', description: 'Contract address' }
                  ]}
                  responses={{
                    '200': { description: 'Verification status' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/contracts/verified"
                  summary="List verified contracts"
                  description="Retrieve all contracts that have been source-verified."
                  responses={{
                    '200': { description: 'List of verified contracts' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/contracts/gas/estimate"
                  summary="Estimate gas cost"
                  description="Estimate the gas cost for a contract method call before execution."
                  requestBody={{
                    required: true,
                    content: { from: '0x...', to: '0x...', data: '0x...' }
                  }}
                  responses={{
                    '200': { description: 'Gas estimate' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/contracts/upgradeable/register"
                  summary="Register proxy contract"
                  description="Register a proxy contract for upgradeable pattern."
                  requestBody={{
                    required: true,
                    content: { proxy_address: '0x...', implementation_address: '0x...', admin: '0x...' }
                  }}
                  responses={{
                    '200': { description: 'Proxy registered' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/contracts/upgradeable/upgrade"
                  summary="Upgrade contract"
                  description="Upgrade a proxy contract to a new implementation."
                  requestBody={{
                    required: true,
                    content: { proxy_address: '0x...', new_implementation: '0x...', admin: '0x...' }
                  }}
                  responses={{
                    '200': { description: 'Contract upgraded' }
                  }}
                />
              </div>
            )}
          </div>

          {/* Governance */}
          <div id="governance" className="bg-white rounded border border-gray-300 overflow-hidden scroll-mt-24">
            <button
              onClick={() => toggleSection('governance')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`transform transition-transform ${expandedSection === 'governance' ? 'rotate-90' : ''}`}>
                  <ChevronRight size={20} className="text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Governance</h2>
                <span className="px-2 py-1 bg-[#61affe]/20 text-[#61affe] rounded text-xs font-semibold">8 endpoints</span>
              </div>
            </button>
            {expandedSection === 'governance' && (
              <div className="p-4 pt-0 space-y-3">
                <Endpoint
                  method="POST"
                  path="/proposal/create"
                  summary="Create governance proposal"
                  description="Create a new governance proposal for network parameter changes or upgrades."
                  requestBody={{
                    required: true,
                    content: { proposer: '0x...', title: 'Increase block size', description: '...', voting_period: 604800 }
                  }}
                  responses={{
                    '200': { description: 'Proposal created' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/proposal/:id/vote"
                  summary="Vote on proposal"
                  description="Cast a vote on an active governance proposal."
                  parameters={[
                    { name: 'id', in: 'path', required: true, type: 'string', description: 'Proposal ID' }
                  ]}
                  requestBody={{
                    required: true,
                    content: { voter: '0x...', vote: 'yes' }
                  }}
                  responses={{
                    '200': { description: 'Vote cast successfully' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/proposals"
                  summary="List all proposals"
                  description="Retrieve all governance proposals with their current status and vote counts."
                  responses={{
                    '200': { description: 'List of proposals' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/proposal/:id"
                  summary="Get proposal details"
                  description="Retrieve detailed information about a specific governance proposal."
                  parameters={[
                    { name: 'id', in: 'path', required: true, type: 'string', description: 'Proposal ID' }
                  ]}
                  responses={{
                    '200': { description: 'Proposal details' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/governance/delegate"
                  summary="Delegate voting power"
                  description="Delegate your voting power to another address."
                  requestBody={{
                    required: true,
                    content: { delegator: '0x...', delegatee: '0x...' }
                  }}
                  responses={{
                    '200': { description: 'Delegation successful' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/governance/delegate/revoke"
                  summary="Revoke delegation"
                  description="Revoke previously delegated voting power."
                  requestBody={{
                    required: true,
                    content: { delegator: '0x...' }
                  }}
                  responses={{
                    '200': { description: 'Delegation revoked' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/governance/delegations/:address"
                  summary="Get delegations"
                  description="Retrieve delegation information for a specific address."
                  parameters={[
                    { name: 'address', in: 'path', required: true, type: 'string', description: 'Address' }
                  ]}
                  responses={{
                    '200': { description: 'Delegation info' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/governance/templates"
                  summary="Get proposal templates"
                  description="Retrieve pre-defined templates for common governance proposals."
                  responses={{
                    '200': { description: 'Proposal templates' }
                  }}
                />
              </div>
            )}
          </div>

          {/* Bridge */}
          <div id="bridge" className="bg-white rounded border border-gray-300 overflow-hidden scroll-mt-24">
            <button
              onClick={() => toggleSection('bridge')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`transform transition-transform ${expandedSection === 'bridge' ? 'rotate-90' : ''}`}>
                  <ChevronRight size={20} className="text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Cross-Chain Bridge</h2>
                <span className="px-2 py-1 bg-[#f93e3e]/20 text-[#f93e3e] rounded text-xs font-semibold">5 endpoints</span>
              </div>
            </button>
            {expandedSection === 'bridge' && (
              <div className="p-4 pt-0 space-y-3">
                <Endpoint
                  method="POST"
                  path="/bridge/wrap"
                  summary="Wrap tokens"
                  description="Wrap native tokens for cross-chain transfer."
                  requestBody={{
                    required: true,
                    content: { from: '0x...', amount: '1000', target_chain: 'ethereum' }
                  }}
                  responses={{
                    '200': { description: 'Tokens wrapped' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/bridge/unwrap"
                  summary="Unwrap tokens"
                  description="Unwrap tokens received from another chain back to native tokens."
                  requestBody={{
                    required: true,
                    content: { to: '0x...', amount: '1000', proof: '0x...' }
                  }}
                  responses={{
                    '200': { description: 'Tokens unwrapped' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/bridge/transactions"
                  summary="Get bridge transactions"
                  description="Retrieve all cross-chain bridge transactions with their status."
                  responses={{
                    '200': { description: 'Bridge transactions' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/bridge/wrapped-tokens"
                  summary="Get wrapped tokens"
                  description="List all wrapped token types supported by the bridge."
                  responses={{
                    '200': { description: 'Wrapped tokens list' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/bridge/status/:id"
                  summary="Get bridge transaction status"
                  description="Check the status of a specific bridge transaction."
                  parameters={[
                    { name: 'id', in: 'path', required: true, type: 'string', description: 'Transaction ID' }
                  ]}
                  responses={{
                    '200': { description: 'Transaction status' }
                  }}
                />
              </div>
            )}
          </div>

          {/* ZKP */}
          <div id="zkp" className="bg-white rounded border border-gray-300 overflow-hidden scroll-mt-24">
            <button
              onClick={() => toggleSection('zkp')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`transform transition-transform ${expandedSection === 'zkp' ? 'rotate-90' : ''}`}>
                  <ChevronRight size={20} className="text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Zero-Knowledge Proofs</h2>
                <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs font-semibold">9 endpoints</span>
              </div>
            </button>
            {expandedSection === 'zkp' && (
              <div className="p-4 pt-0 space-y-3">
                <Endpoint
                  method="POST"
                  path="/zkp/shield"
                  summary="Shield tokens"
                  description="Shield (hide) tokens using zero-knowledge proofs for private transactions."
                  requestBody={{
                    required: true,
                    content: { address: '0x...', amount: '1000' }
                  }}
                  responses={{
                    '200': { description: 'Tokens shielded successfully' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/zkp/unshield"
                  summary="Unshield tokens"
                  description="Unshield (reveal) tokens from private balance to public balance."
                  requestBody={{
                    required: true,
                    content: { address: '0x...', amount: '500' }
                  }}
                  responses={{
                    '200': { description: 'Tokens unshielded successfully' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/zkp/status"
                  summary="Check ZKP status"
                  description="Check if ZKP privacy features are enabled on the network."
                  responses={{
                    '200': { description: 'ZKP status information' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/zkp/balance/:address"
                  summary="Get shielded balance"
                  description="Retrieve the shielded (private) balance for an address."
                  parameters={[
                    { name: 'address', in: 'path', required: true, type: 'string', description: 'Account address' }
                  ]}
                  responses={{
                    '200': { description: 'Shielded balance' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/zkp/enable"
                  summary="Enable ZKP for account"
                  description="Enable zero-knowledge proof privacy for an account."
                  requestBody={{
                    required: true,
                    content: { address: '0x...' }
                  }}
                  responses={{
                    '200': { description: 'ZKP enabled' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/zkp/disable"
                  summary="Disable ZKP"
                  description="Disable zero-knowledge proof privacy for an account."
                  requestBody={{
                    required: true,
                    content: { address: '0x...' }
                  }}
                  responses={{
                    '200': { description: 'ZKP disabled' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/zkp/generate-proof"
                  summary="Generate ZK proof"
                  description="Generate a zero-knowledge proof for a private transaction."
                  requestBody={{
                    required: true,
                    content: { statement: '...', witness: '...' }
                  }}
                  responses={{
                    '200': { description: 'Proof generated' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/zkp/verify-proof"
                  summary="Verify ZK proof"
                  description="Verify a zero-knowledge proof without revealing the underlying data."
                  requestBody={{
                    required: true,
                    content: { proof: '0x...', public_inputs: [] }
                  }}
                  responses={{
                    '200': { description: 'Proof verification result' }
                  }}
                />
              </div>
            )}
          </div>

          {/* Validator Management */}
          <div id="validators" className="bg-white rounded border border-gray-300 overflow-hidden scroll-mt-24">
            <button
              onClick={() => toggleSection('validators')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`transform transition-transform ${expandedSection === 'validators' ? 'rotate-90' : ''}`}>
                  <ChevronRight size={20} className="text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Validator Management</h2>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">11 endpoints</span>
              </div>
            </button>
            {expandedSection === 'validators' && (
              <div className="p-4 pt-0 space-y-3">
                <Endpoint
                  method="POST"
                  path="/validator/register"
                  summary="Register validator"
                  description="Register a new validator with initial stake and tier."
                  requestBody={{
                    required: true,
                    content: { address: '0x...', stake: '100000', tier: 3 }
                  }}
                  responses={{
                    '200': { description: 'Validator registered' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/validator/update-profile"
                  summary="Update validator profile"
                  description="Update validator profile information like name, website, and description."
                  requestBody={{
                    required: true,
                    content: { address: '0x...', name: 'My Validator', website: 'https://...', description: '...' }
                  }}
                  responses={{
                    '200': { description: 'Profile updated' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/validator/add-stake"
                  summary="Add stake"
                  description="Add additional stake to an existing validator."
                  requestBody={{
                    required: true,
                    content: { address: '0x...', amount: '50000' }
                  }}
                  responses={{
                    '200': { description: 'Stake added' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/validator/upgrade-tier"
                  summary="Upgrade validator tier"
                  description="Upgrade validator to a higher tier with increased requirements and rewards."
                  requestBody={{
                    required: true,
                    content: { address: '0x...', new_tier: 4 }
                  }}
                  responses={{
                    '200': { description: 'Tier upgraded' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/validator/unstake"
                  summary="Unstake validator"
                  description="Begin unstaking process for a validator (21-day unbonding period)."
                  requestBody={{
                    required: true,
                    content: { address: '0x...', amount: '25000' }
                  }}
                  responses={{
                    '200': { description: 'Unstaking initiated' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/validator/withdraw/:address"
                  summary="Withdraw unstaked funds"
                  description="Withdraw funds after unbonding period has completed."
                  parameters={[
                    { name: 'address', in: 'path', required: true, type: 'string', description: 'Validator address' }
                  ]}
                  responses={{
                    '200': { description: 'Withdrawal successful' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/validator/:address/unbonding"
                  summary="Get unbonding status"
                  description="Check the unbonding status and remaining time for a validator."
                  parameters={[
                    { name: 'address', in: 'path', required: true, type: 'string', description: 'Validator address' }
                  ]}
                  responses={{
                    '200': { description: 'Unbonding status' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/validator/unjail"
                  summary="Unjail validator"
                  description="Request to unjail a validator after serving jail penalty."
                  requestBody={{
                    required: true,
                    content: { address: '0x...' }
                  }}
                  responses={{
                    '200': { description: 'Validator unjailed' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/validator/:address/slashing-history"
                  summary="Get slashing history"
                  description="Retrieve the slashing and jail history for a validator."
                  parameters={[
                    { name: 'address', in: 'path', required: true, type: 'string', description: 'Validator address' }
                  ]}
                  responses={{
                    '200': { description: 'Slashing history' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/delegate"
                  summary="Delegate to validator"
                  description="Delegate tokens to a validator to earn staking rewards."
                  requestBody={{
                    required: true,
                    content: { delegator: '0x...', validator: '0x...', amount: '10000' }
                  }}
                  responses={{
                    '200': { description: 'Delegation successful' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/undelegate"
                  summary="Undelegate from validator"
                  description="Undelegate tokens from a validator (21-day unbonding period)."
                  requestBody={{
                    required: true,
                    content: { delegator: '0x...', validator: '0x...', amount: '5000' }
                  }}
                  responses={{
                    '200': { description: 'Undelegation initiated' }
                  }}
                />
              </div>
            )}
          </div>

          {/* Wallets */}
          <div id="wallets" className="bg-white rounded border border-gray-300 overflow-hidden scroll-mt-24">
            <button
              onClick={() => toggleSection('wallets')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`transform transition-transform ${expandedSection === 'wallets' ? 'rotate-90' : ''}`}>
                  <ChevronRight size={20} className="text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Wallet Operations</h2>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">2 endpoints</span>
              </div>
            </button>
            {expandedSection === 'wallets' && (
              <div className="p-4 pt-0 space-y-3">
                <Endpoint
                  method="POST"
                  path="/wallet/create"
                  summary="Create new wallet"
                  description="Generate a new wallet with mnemonic seed phrase."
                  requestBody={{
                    required: true,
                    content: { password: 'secure-password' }
                  }}
                  responses={{
                    '200': {
                      description: 'Wallet created',
                      content: { success: true, address: '0x...', mnemonic: 'word1 word2 ...' }
                    }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/wallet/login"
                  summary="Login to wallet"
                  description="Login to an existing wallet using mnemonic or private key."
                  requestBody={{
                    required: true,
                    content: { mnemonic: 'word1 word2 ...', password: 'secure-password' }
                  }}
                  responses={{
                    '200': { description: 'Login successful' }
                  }}
                />
              </div>
            )}
          </div>

          {/* Performance & Metrics */}
          <div id="performance" className="bg-white rounded border border-gray-300 overflow-hidden scroll-mt-24">
            <button
              onClick={() => toggleSection('performance')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`transform transition-transform ${expandedSection === 'performance' ? 'rotate-90' : ''}`}>
                  <ChevronRight size={20} className="text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Performance & Metrics</h2>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">5 endpoints</span>
              </div>
            </button>
            {expandedSection === 'performance' && (
              <div className="p-4 pt-0 space-y-3">
                <Endpoint
                  method="GET"
                  path="/performance"
                  summary="Get performance metrics"
                  description="Retrieve detailed performance metrics including TPS, block times, and network health."
                  responses={{
                    '200': {
                      description: 'Performance metrics',
                      content: { tps: 5000, avg_block_time: 0.4, peak_tps: 12000 }
                    }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/metrics"
                  summary="Get Prometheus metrics"
                  description="Retrieve metrics in Prometheus format for monitoring systems."
                  responses={{
                    '200': { description: 'Prometheus metrics' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/gas/price"
                  summary="Get gas price"
                  description="Get current gas price for transactions."
                  responses={{
                    '200': {
                      description: 'Gas price',
                      content: { gas_price: '20', unit: 'gwei' }
                    }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/gas/estimate"
                  summary="Estimate gas for transaction"
                  description="Estimate gas cost before executing a transaction."
                  requestBody={{
                    required: true,
                    content: { from: '0x...', to: '0x...', data: '0x...' }
                  }}
                  responses={{
                    '200': {
                      description: 'Gas estimate',
                      content: { gas_estimate: 21000 }
                    }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/peers"
                  summary="Get connected peers"
                  description="List all connected P2P network peers."
                  responses={{
                    '200': {
                      description: 'Connected peers',
                      content: { peer_count: 42, peers: [] }
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Mempool & DAG */}
          <div className="bg-white rounded border border-gray-300 overflow-hidden">
            <button
              onClick={() => toggleSection('mempool')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`transform transition-transform ${expandedSection === 'mempool' ? 'rotate-90' : ''}`}>
                  <ChevronRight size={20} className="text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Mempool & DAG</h2>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-semibold">4 endpoints</span>
              </div>
            </button>
            {expandedSection === 'mempool' && (
              <div className="p-4 pt-0 space-y-3">
                <Endpoint
                  method="GET"
                  path="/mempool"
                  summary="Get mempool transactions"
                  description="Retrieve all pending transactions in the mempool."
                  responses={{
                    '200': {
                      description: 'Mempool transactions',
                      content: { count: 150, transactions: [] }
                    }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/dag/stats"
                  summary="Get DAG statistics"
                  description="Retrieve statistics about the DAG mempool structure."
                  responses={{
                    '200': {
                      description: 'DAG stats',
                      content: { nodes: 150, edges: 450, depth: 5 }
                    }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/dag/structure"
                  summary="Get DAG structure"
                  description="Retrieve the full DAG mempool structure with dependencies."
                  responses={{
                    '200': { description: 'DAG structure data' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/dag/transactions"
                  summary="Get DAG transactions"
                  description="Retrieve all transactions in the DAG mempool with their dependencies."
                  responses={{
                    '200': { description: 'DAG transactions' }
                  }}
                />
              </div>
            )}
          </div>

          {/* Sharding */}
          <div className="bg-white rounded border border-gray-300 overflow-hidden">
            <button
              onClick={() => toggleSection('sharding')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`transform transition-transform ${expandedSection === 'sharding' ? 'rotate-90' : ''}`}>
                  <ChevronRight size={20} className="text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Sharding</h2>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-semibold">3 endpoints</span>
              </div>
            </button>
            {expandedSection === 'sharding' && (
              <div className="p-4 pt-0 space-y-3">
                <Endpoint
                  method="GET"
                  path="/sharding/status"
                  summary="Get sharding status"
                  description="Retrieve current sharding configuration and status."
                  responses={{
                    '200': {
                      description: 'Sharding status',
                      content: { enabled: true, shard_count: 4, cross_shard_txs: 1250 }
                    }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/sharding/shard/:id"
                  summary="Get shard information"
                  description="Retrieve detailed information about a specific shard."
                  parameters={[
                    { name: 'id', in: 'path', required: true, type: 'number', description: 'Shard ID' }
                  ]}
                  responses={{
                    '200': { description: 'Shard information' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/sharding/address/:address/shard"
                  summary="Get address shard"
                  description="Determine which shard an address belongs to."
                  parameters={[
                    { name: 'address', in: 'path', required: true, type: 'string', description: 'Account address' }
                  ]}
                  responses={{
                    '200': {
                      description: 'Shard assignment',
                      content: { address: '0x...', shard_id: 2 }
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Admin & Audit */}
          <div className="bg-white rounded border border-gray-300 overflow-hidden">
            <button
              onClick={() => toggleSection('admin')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`transform transition-transform ${expandedSection === 'admin' ? 'rotate-90' : ''}`}>
                  <ChevronRight size={20} className="text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Admin & Audit</h2>
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">10 endpoints</span>
              </div>
            </button>
            {expandedSection === 'admin' && (
              <div className="p-4 pt-0 space-y-3">
                <Endpoint
                  method="GET"
                  path="/audit/logs"
                  summary="Get audit logs"
                  description="Retrieve all audit logs for compliance and security monitoring."
                  responses={{
                    '200': { description: 'Audit logs' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/audit/logs/:address"
                  summary="Get logs for address"
                  description="Retrieve audit logs for a specific address."
                  parameters={[
                    { name: 'address', in: 'path', required: true, type: 'string', description: 'Account address' }
                  ]}
                  responses={{
                    '200': { description: 'Address audit logs' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/admin/block"
                  summary="Block address"
                  description="Block an address from transacting (admin only)."
                  requiresAuth={true}
                  requestBody={{
                    required: true,
                    content: { address: '0x...', reason: 'Suspicious activity' }
                  }}
                  responses={{
                    '200': { description: 'Address blocked' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/admin/unblock"
                  summary="Unblock address"
                  description="Unblock a previously blocked address (admin only)."
                  requiresAuth={true}
                  requestBody={{
                    required: true,
                    content: { address: '0x...' }
                  }}
                  responses={{
                    '200': { description: 'Address unblocked' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/admin/blocked"
                  summary="Get blocked addresses"
                  description="List all currently blocked addresses."
                  requiresAuth={true}
                  responses={{
                    '200': { description: 'Blocked addresses list' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/admin/prune"
                  summary="Prune old state"
                  description="Prune old blockchain state to reduce storage (admin only)."
                  requiresAuth={true}
                  requestBody={{
                    required: true,
                    content: { keep_blocks: 10000 }
                  }}
                  responses={{
                    '200': { description: 'State pruned' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/admin/prune/stats"
                  summary="Get pruning statistics"
                  description="Retrieve statistics about state pruning."
                  responses={{
                    '200': { description: 'Pruning stats' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/admin/prune/restore/:block_id"
                  summary="Restore pruned block"
                  description="Restore a previously pruned block from archive."
                  parameters={[
                    { name: 'block_id', in: 'path', required: true, type: 'number', description: 'Block ID' }
                  ]}
                  responses={{
                    '200': { description: 'Block restored' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/account/nonce/:address"
                  summary="Get account nonce"
                  description="Get the current nonce for an address (for transaction ordering)."
                  parameters={[
                    { name: 'address', in: 'path', required: true, type: 'string', description: 'Account address' }
                  ]}
                  responses={{
                    '200': {
                      description: 'Account nonce',
                      content: { address: '0x...', nonce: 42 }
                    }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/debug/signature"
                  summary="Debug signature"
                  description="Debug and verify message signatures (development only)."
                  requestBody={{
                    required: true,
                    content: { message: '...', signature: '0x...', address: '0x...' }
                  }}
                  responses={{
                    '200': { description: 'Signature verification result' }
                  }}
                />
              </div>
            )}
          </div>

          {/* Bridge Security */}
          <div className="bg-white rounded border border-gray-300 overflow-hidden">
            <button
              onClick={() => toggleSection('bridge-security')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`transform transition-transform ${expandedSection === 'bridge-security' ? 'rotate-90' : ''}`}>
                  <ChevronRight size={20} className="text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Bridge Security</h2>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">11 endpoints</span>
              </div>
            </button>
            {expandedSection === 'bridge-security' && (
              <div className="p-4 pt-0 space-y-3">
                <Endpoint
                  method="POST"
                  path="/bridge/security/timelock"
                  summary="Create timelock withdrawal"
                  description="Create a time-locked withdrawal for enhanced security (24-72 hour delay)."
                  requestBody={{
                    required: true,
                    content: { from: '0x...', to: '0x...', amount: '1000', chain: 'ethereum' }
                  }}
                  responses={{
                    '200': { description: 'Timelock created' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/bridge/security/execute"
                  summary="Execute withdrawal"
                  description="Execute a withdrawal after timelock period has expired."
                  requestBody={{
                    required: true,
                    content: { tx_id: '0xabc...' }
                  }}
                  responses={{
                    '200': { description: 'Withdrawal executed' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/bridge/security/withdrawals/pending"
                  summary="Get pending withdrawals"
                  description="List all pending time-locked withdrawals."
                  responses={{
                    '200': { description: 'Pending withdrawals' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/bridge/security/withdrawals/ready"
                  summary="Get ready withdrawals"
                  description="List withdrawals ready to be executed (timelock expired)."
                  responses={{
                    '200': { description: 'Ready withdrawals' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/bridge/security/alerts"
                  summary="Get fraud alerts"
                  description="Retrieve all security and fraud detection alerts."
                  responses={{
                    '200': { description: 'Security alerts' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/bridge/security/alerts/unresolved"
                  summary="Get unresolved alerts"
                  description="List all unresolved security alerts requiring attention."
                  responses={{
                    '200': { description: 'Unresolved alerts' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/bridge/security/alerts/resolve"
                  summary="Resolve alert"
                  description="Mark a security alert as resolved (admin only)."
                  requestBody={{
                    required: true,
                    content: { alert_id: '123', resolution: 'False positive' }
                  }}
                  responses={{
                    '200': { description: 'Alert resolved' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/bridge/security/pause"
                  summary="Emergency pause"
                  description="Activate emergency pause on bridge (halts all operations)."
                  requestBody={{
                    required: true,
                    content: { reason: 'Security incident detected' }
                  }}
                  responses={{
                    '200': { description: 'Bridge paused' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/bridge/security/unpause"
                  summary="Unpause bridge"
                  description="Deactivate emergency pause and resume bridge operations."
                  responses={{
                    '200': { description: 'Bridge unpaused' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/bridge/security/stats"
                  summary="Get security statistics"
                  description="Retrieve bridge security statistics and health metrics."
                  responses={{
                    '200': {
                      description: 'Security stats',
                      content: { total_alerts: 5, resolved_alerts: 3, pending_withdrawals: 12 }
                    }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/bridge/security/withdrawal/:tx_id/ready"
                  summary="Check withdrawal readiness"
                  description="Check if a specific withdrawal is ready to execute."
                  parameters={[
                    { name: 'tx_id', in: 'path', required: true, type: 'string', description: 'Transaction ID' }
                  ]}
                  responses={{
                    '200': {
                      description: 'Withdrawal status',
                      content: { ready: false, time_remaining: 43200 }
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* HTLC Ethereum Integration */}
          <div className="bg-white rounded border border-gray-300 overflow-hidden">
            <button
              onClick={() => toggleSection('htlc-ethereum')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`transform transition-transform ${expandedSection === 'htlc-ethereum' ? 'rotate-90' : ''}`}>
                  <ChevronRight size={20} className="text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">HTLC Ethereum Integration</h2>
                <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-xs font-semibold">3 endpoints</span>
              </div>
            </button>
            {expandedSection === 'htlc-ethereum' && (
              <div className="p-4 pt-0 space-y-3">
                <Endpoint
                  method="POST"
                  path="/api/htlc/ethereum/verify"
                  summary="Verify Ethereum proof"
                  description="Verify proof that an Ethereum HTLC contract was created."
                  requestBody={{
                    required: true,
                    content: { contract_address: '0x...', proof: '0x...' }
                  }}
                  responses={{
                    '200': { description: 'Proof verified' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/api/htlc/ethereum/watch-secrets"
                  summary="Watch Ethereum secrets"
                  description="Monitor Ethereum for revealed HTLC secrets (for auto-claiming)."
                  responses={{
                    '200': { description: 'Watched secrets' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/api/htlc/ethereum/create-swap"
                  summary="Create Ethereum swap"
                  description="Create an HTLC on Ethereum for cross-chain atomic swap."
                  requestBody={{
                    required: true,
                    content: {
                      sender: '0x...',
                      receiver: '0x...',
                      amount: '1.5',
                      hash_lock: '0x...',
                      timeout_hours: 24
                    }
                  }}
                  responses={{
                    '200': { description: 'Ethereum HTLC created' }
                  }}
                />
              </div>
            )}
          </div>

          {/* Enterprise & API Keys */}
          <div className="bg-white rounded border border-gray-300 overflow-hidden">
            <button
              onClick={() => toggleSection('enterprise')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`transform transition-transform ${expandedSection === 'enterprise' ? 'rotate-90' : ''}`}>
                  <ChevronRight size={20} className="text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Enterprise & API Keys</h2>
                <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs font-semibold">5 endpoints</span>
              </div>
            </button>
            {expandedSection === 'enterprise' && (
              <div className="p-4 pt-0 space-y-3">
                <Endpoint
                  method="POST"
                  path="/enterprise/auth/authenticate"
                  summary="Authenticate enterprise user"
                  description="Authenticate an enterprise user and receive JWT token."
                  requestBody={{
                    required: true,
                    content: { username: 'admin', password: 'secure-password' }
                  }}
                  responses={{
                    '200': {
                      description: 'Authentication successful',
                      content: { token: 'eyJhbGc...', expires_in: 3600 }
                    }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/enterprise/auth/user"
                  summary="Get user info"
                  description="Get authenticated user information."
                  requiresAuth={true}
                  responses={{
                    '200': { description: 'User information' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/enterprise/api-keys"
                  summary="Create API key"
                  description="Generate a new API key for programmatic access."
                  requiresAuth={true}
                  requestBody={{
                    required: true,
                    content: { name: 'Production API Key', permissions: ['read', 'write'] }
                  }}
                  responses={{
                    '200': {
                      description: 'API key created',
                      content: { api_key: 'rk_...', secret: 'sk_...' }
                    }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/enterprise/api-keys"
                  summary="List API keys"
                  description="List all API keys for the authenticated user."
                  requiresAuth={true}
                  responses={{
                    '200': { description: 'API keys list' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/enterprise/api-keys/:key/revoke"
                  summary="Revoke API key"
                  description="Revoke an API key (cannot be undone)."
                  requiresAuth={true}
                  parameters={[
                    { name: 'key', in: 'path', required: true, type: 'string', description: 'API key ID' }
                  ]}
                  responses={{
                    '200': { description: 'API key revoked' }
                  }}
                />
              </div>
            )}
          </div>

          {/* Monitoring & Alerting */}
          <div className="bg-white rounded border border-gray-300 overflow-hidden">
            <button
              onClick={() => toggleSection('monitoring')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`transform transition-transform ${expandedSection === 'monitoring' ? 'rotate-90' : ''}`}>
                  <ChevronRight size={20} className="text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Monitoring & Alerting</h2>
                <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs font-semibold">7 endpoints</span>
              </div>
            </button>
            {expandedSection === 'monitoring' && (
              <div className="p-4 pt-0 space-y-3">
                <Endpoint
                  method="GET"
                  path="/monitoring/metrics"
                  summary="Get monitoring metrics"
                  description="Retrieve comprehensive monitoring metrics for observability."
                  responses={{
                    '200': { description: 'Monitoring metrics' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/monitoring/snapshot"
                  summary="Get metrics snapshot"
                  description="Get a point-in-time snapshot of all metrics."
                  responses={{
                    '200': { description: 'Metrics snapshot' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/monitoring/alerts"
                  summary="Get monitoring alerts"
                  description="Retrieve all monitoring alerts and their status."
                  responses={{
                    '200': { description: 'Monitoring alerts' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/monitoring/alerts/resolve"
                  summary="Resolve alert"
                  description="Mark a monitoring alert as resolved."
                  requestBody={{
                    required: true,
                    content: { alert_id: 'alert_123' }
                  }}
                  responses={{
                    '200': { description: 'Alert resolved' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/monitoring/alerts/check"
                  summary="Check alert rules"
                  description="Manually trigger alert rule evaluation."
                  responses={{
                    '200': { description: 'Alerts checked' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/monitoring/alerts/rules"
                  summary="Get alert rules"
                  description="List all configured alert rules."
                  responses={{
                    '200': { description: 'Alert rules' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/monitoring/webhooks/add"
                  summary="Add webhook"
                  description="Register a webhook URL for alert notifications."
                  requestBody={{
                    required: true,
                    content: { url: 'https://...', events: ['alert.triggered'] }
                  }}
                  responses={{
                    '200': { description: 'Webhook added' }
                  }}
                />
              </div>
            )}
          </div>

          {/* Playground */}
          <div className="bg-white rounded border border-gray-300 overflow-hidden">
            <button
              onClick={() => toggleSection('playground')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`transform transition-transform ${expandedSection === 'playground' ? 'rotate-90' : ''}`}>
                  <ChevronRight size={20} className="text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Smart Contract Playground</h2>
                <span className="px-2 py-1 bg-lime-100 text-lime-700 rounded text-xs font-semibold">9 endpoints</span>
              </div>
            </button>
            {expandedSection === 'playground' && (
              <div className="p-4 pt-0 space-y-3">
                <Endpoint
                  method="GET"
                  path="/playground/templates"
                  summary="Get contract templates"
                  description="Retrieve all available smart contract templates."
                  responses={{
                    '200': { description: 'Contract templates' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/playground/templates/:id"
                  summary="Get specific template"
                  description="Get a specific contract template by ID."
                  parameters={[
                    { name: 'id', in: 'path', required: true, type: 'string', description: 'Template ID' }
                  ]}
                  responses={{
                    '200': { description: 'Template details' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/playground/compile"
                  summary="Compile smart contract"
                  description="Compile Solidity smart contract code."
                  requestBody={{
                    required: true,
                    content: { code: 'contract MyToken { ... }', version: '0.8.0' }
                  }}
                  responses={{
                    '200': {
                      description: 'Compilation result',
                      content: { success: true, bytecode: '0x608060...', abi: [] }
                    }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/playground/simulate"
                  summary="Simulate execution"
                  description="Simulate contract execution in sandbox environment."
                  requestBody={{
                    required: true,
                    content: { bytecode: '0x...', function: 'transfer', args: ['0x...', 100] }
                  }}
                  responses={{
                    '200': { description: 'Simulation result' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/playground/gas/:bytecode"
                  summary="Analyze gas usage"
                  description="Analyze gas consumption for contract bytecode."
                  parameters={[
                    { name: 'bytecode', in: 'path', required: true, type: 'string', description: 'Contract bytecode' }
                  ]}
                  responses={{
                    '200': { description: 'Gas analysis' }
                  }}
                />

                <Endpoint
                  method="POST"
                  path="/playground/projects/save"
                  summary="Save project"
                  description="Save a playground project for later editing."
                  requestBody={{
                    required: true,
                    content: { name: 'My DeFi Protocol', code: '...', owner: '0x...' }
                  }}
                  responses={{
                    '200': {
                      description: 'Project saved',
                      content: { project_id: 'proj_123' }
                    }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/playground/projects/:id"
                  summary="Get project"
                  description="Load a saved playground project."
                  parameters={[
                    { name: 'id', in: 'path', required: true, type: 'string', description: 'Project ID' }
                  ]}
                  responses={{
                    '200': { description: 'Project data' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/playground/projects/user/:owner"
                  summary="List user projects"
                  description="List all projects for a specific user."
                  parameters={[
                    { name: 'owner', in: 'path', required: true, type: 'string', description: 'Owner address' }
                  ]}
                  responses={{
                    '200': { description: 'User projects' }
                  }}
                />

                <Endpoint
                  method="GET"
                  path="/playground/stats"
                  summary="Get playground statistics"
                  description="Get usage statistics for the contract playground."
                  responses={{
                    '200': {
                      description: 'Playground stats',
                      content: { total_compiles: 50000, total_projects: 1250 }
                    }
                  }}
                />
              </div>
            )}
          </div>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
