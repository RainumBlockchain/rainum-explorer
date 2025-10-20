import Link from 'next/link'
import { Github, Twitter, MessageCircle, Code2, FileCode, Shield, Zap, Activity, Users, FileText, Book, Server, Globe, Boxes, Database, Lock, Sparkles, Terminal, FlaskConical, Search, BarChart3, Cpu, Network, ArrowRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-50"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0019ff] to-[#0047ff] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Boxes className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-2xl text-gray-900">Rainum</h3>
                <p className="text-xs text-gray-600">Next-Gen Blockchain</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-md">
              A high-performance blockchain platform with advanced privacy features, smart contract capabilities,
              and AI-powered development tools. Built for the future of decentralized applications.
            </p>

            {/* Network Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 backdrop-blur-sm border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={14} className="text-green-600" />
                  <span className="text-xs text-gray-600">Network Status</span>
                </div>
                <p className="text-lg font-bold text-green-600">Live</p>
              </div>
              <div className="bg-blue-50 backdrop-blur-sm border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={14} className="text-blue-600" />
                  <span className="text-xs text-gray-600">Block Time</span>
                </div>
                <p className="text-lg font-bold text-gray-900">~3s</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              <a href="https://github.com/rainum" target="_blank" rel="noopener noreferrer" className="group p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-lg transition-all hover:scale-110">
                <Github size={20} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
              </a>
              <a href="https://twitter.com/rainum" target="_blank" rel="noopener noreferrer" className="group p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all hover:scale-110">
                <Twitter size={20} className="text-gray-600 group-hover:text-[#1DA1F2] transition-colors" />
              </a>
              <a href="https://discord.gg/rainum" target="_blank" rel="noopener noreferrer" className="group p-3 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 rounded-lg transition-all hover:scale-110">
                <MessageCircle size={20} className="text-gray-600 group-hover:text-[#5865F2] transition-colors" />
              </a>
            </div>
          </div>

          {/* Explorer Features */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-gray-900 mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Search size={16} className="text-blue-600" />
              Explorer
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/blocks" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Blocks
                </Link>
              </li>
              <li>
                <Link href="/transactions" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Transactions
                </Link>
              </li>
              <li>
                <Link href="/validators" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Validators
                </Link>
              </li>
              <li>
                <Link href="/search" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Search
                </Link>
              </li>
              <li>
                <Link href="/monitoring" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Network Monitoring
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer Tools */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-gray-900 mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Code2 size={16} className="text-purple-600" />
              Developer
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="http://localhost:3005" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Developer Portal
                </a>
              </li>
              <li>
                <Link href="/api-docs" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  API Documentation
                </Link>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  SDK & Libraries
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Contract Templates
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Testing Tools
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Security Audits
                </a>
              </li>
            </ul>
          </div>

          {/* Blockchain Features */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-gray-900 mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Database size={16} className="text-green-600" />
              Features
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Privacy Pools
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Cross-Chain Bridge
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  VRF Consensus
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  AI Assistant
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Atomic Swaps
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Gas Optimization
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-gray-900 mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Book size={16} className="text-yellow-600" />
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Whitepaper
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Technical Docs
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Community Forum
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-[#0019ff] text-sm transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Support Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature Highlights Bar */}
        <div className="border-y border-gray-200 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Shield size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Security</p>
                <p className="text-sm font-semibold text-gray-900">Audited</p>
              </div>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <Zap size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Speed</p>
                <p className="text-sm font-semibold text-gray-900">10K TPS</p>
              </div>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <Lock size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Privacy</p>
                <p className="text-sm font-semibold text-gray-900">Advanced</p>
              </div>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                <Sparkles size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">AI Tools</p>
                <p className="text-sm font-semibold text-gray-900">Powered</p>
              </div>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-pink-50 border border-pink-200 rounded-lg flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                <Network size={20} className="text-pink-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Network</p>
                <p className="text-sm font-semibold text-gray-900">Global</p>
              </div>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                <Cpu size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">EVM + Move</p>
                <p className="text-sm font-semibold text-gray-900">Compatible</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-gray-600">
            <p>&copy; 2025 Rainum Network. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-[#0019ff] transition-colors">Privacy Policy</a>
              <span className="text-gray-300">•</span>
              <a href="#" className="hover:text-[#0019ff] transition-colors">Terms of Service</a>
              <span className="text-gray-300">•</span>
              <a href="#" className="hover:text-[#0019ff] transition-colors">Security</a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Built with</span>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs font-mono text-gray-700">Rust</div>
              <div className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs font-mono text-gray-700">Next.js</div>
              <div className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs font-mono text-gray-700">TypeScript</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
