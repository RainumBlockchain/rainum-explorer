'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useQuery } from '@tanstack/react-query'
import { getStatus, getBlocks, getTransactions, getValidators, getTotalSupply, type Block, type Transaction, type ValidatorInfo } from '@/lib/api/rainum-api'
import { Blocks, Activity, Users, TrendingUp, ArrowRight, ArrowRightLeft, ShieldCheck, Coins, Search, Zap, Lock, ExternalLink, Info, X, ChevronLeft, ChevronRight, Rocket, Code } from 'lucide-react'
import Link from 'next/link'
import { Avatar } from '@/components/shared/Avatar'
import { PrivacyBadge } from '@/components/shared/PrivacyBadge'
import { RainIcon } from '@/components/shared/RainIcon'
import { formatHash, formatNumber } from '@/lib/utils/format'
import { formatBalance } from '@/lib/utils/format-balance'
import { getAddressColor } from '@/lib/utils/color-hash'
import { useState, useEffect } from 'react'

export default function Home() {
  const [hoveredValidator, setHoveredValidator] = useState<string | null>(null)
  const [hoveredAddress, setHoveredAddress] = useState<string | null>(null)
  const [hoveredBlockHash, setHoveredBlockHash] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'blocks' | 'transactions'>('transactions')
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [isVMInfoOpen, setIsVMInfoOpen] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)

  // Update time every second for live age countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsVMInfoOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Auto-rotate slides every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const getAge = (timestamp: number) => {
    const seconds = Math.floor((currentTime / 1000 - timestamp))
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    return `${days}d`
  }
  const { data: status } = useQuery({
    queryKey: ['status'],
    queryFn: getStatus,
    refetchInterval: 10000,
  })

  const { data: blocks, isLoading: blocksLoading } = useQuery({
    queryKey: ['blocks', 'latest'],
    queryFn: () => getBlocks({ limit: 10 }),
    refetchInterval: 5000,
  })

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions', 'latest'],
    queryFn: () => getTransactions({ limit: 10 }),
    refetchInterval: 3000,
  })

  const { data: validators } = useQuery({
    queryKey: ['validators'],
    queryFn: () => getValidators(),
  })

  const { data: totalSupply } = useQuery({
    queryKey: ['totalSupply'],
    queryFn: getTotalSupply,
    refetchInterval: 10000,
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Section with Features and Ad Space */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          {/* Left Side - Explorer Features */}
          <div className="bg-[#0019ff] rounded border-4 border-white p-10 relative overflow-hidden group hover:shadow-[0_20px_60px_rgba(0,25,255,0.4)] transition-all duration-300">
            {/* White stripe with animated border */}
            <div className="absolute top-0 left-0 w-full h-2 bg-white">
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400" style={{animation: 'slide-right 3s ease-in-out infinite'}}></div>
            </div>

            {/* Decorative corner accents */}
            <div className="absolute top-2 left-2 w-16 h-16 bg-white/10 rounded"></div>
            <div className="absolute bottom-2 right-2 w-12 h-12 bg-emerald-400/20 rounded"></div>

            <style jsx>{`
              @keyframes slide-right {
                0% { transform: translateX(-100%); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: translateX(100%); opacity: 0; }
              }
            `}</style>

            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg mb-6 shadow-lg">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-black text-[#0019ff] uppercase tracking-wider">Live Network</span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl font-black text-white mb-3 leading-tight">
                Explore Rainum Blockchain
              </h1>

              {/* Subtitle with Dual-VM highlight */}
              <p className="text-blue-100 mb-8 text-base leading-relaxed">
                The world's first <span className="text-white font-bold bg-white/20 px-2 py-0.5 rounded">EVM + Move</span> dual-VM blockchain explorer with real-time data and zero-knowledge privacy.
              </p>

              {/* Feature Grid - 2x2 */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Dual-VM Support */}
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ArrowRightLeft className="text-white" size={20} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-black text-gray-900 text-sm">Dual-VM Support</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">Execute EVM and Move smart contracts on one chain</p>
                </div>

                {/* ZKP Privacy */}
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lock className="text-white" size={20} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-black text-gray-900 text-sm">ZKP Privacy</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">Zero-knowledge proofs for confidential transactions</p>
                </div>

                {/* Real-Time Data */}
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="text-white" size={20} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-black text-gray-900 text-sm">Real-Time Data</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">Live updates every few seconds with instant sync</p>
                </div>

                {/* Cross-VM Calls */}
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Activity className="text-white" size={20} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-black text-gray-900 text-sm">Cross-VM Calls</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">Seamless interoperability between EVM and Move</p>
                </div>
              </div>

              {/* Live Stats */}
              <div className="grid grid-cols-4 gap-3">
                <div className="flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg py-5 px-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 min-h-[100px]">
                  <div className="text-2xl font-black text-[#0019ff] leading-tight mb-2">{blocks && blocks.length > 0 ? `${((Date.now() / 1000 - blocks[0]?.timestamp) / 60).toFixed(1)}m` : '...'}</div>
                  <div className="text-[9px] text-gray-600 uppercase tracking-wider font-bold leading-tight">Last Block</div>
                </div>
                <div className="flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg py-5 px-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 min-h-[100px]">
                  <div className="text-2xl font-black text-emerald-600 leading-tight mb-2">{status?.tps ? status.tps.toFixed(1) : '...'}</div>
                  <div className="text-[9px] text-gray-600 uppercase tracking-wider font-bold leading-tight">Current TPS</div>
                </div>
                <div className="flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg py-5 px-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 min-h-[100px]">
                  <div className="text-2xl font-black text-violet-600 leading-tight mb-2">{validators?.filter(v => v.active && !v.jailed).length || 0}</div>
                  <div className="text-[9px] text-gray-600 uppercase tracking-wider font-bold leading-tight">Online Now</div>
                </div>
                <div className="flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg py-5 px-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 min-h-[100px]">
                  <div className="text-2xl font-black text-amber-600 leading-tight mb-2">{totalSupply ? `${(totalSupply / 1000000000).toFixed(1)}B` : '...'}</div>
                  <div className="text-[9px] text-gray-600 uppercase tracking-wider font-bold leading-tight">Total Supply</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Promo Carousel */}
          <div className="bg-[#0019ff] rounded border-4 border-white p-8 flex flex-col relative overflow-hidden group hover:shadow-[0_20px_60px_rgba(0,25,255,0.4)] transition-all duration-300">
            {/* White stripe with animated border */}
            <div className="absolute top-0 left-0 w-full h-2 bg-white">
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400" style={{animation: 'slide-right 3s ease-in-out infinite'}}></div>
            </div>

            {/* Decorative corner accents */}
            <div className="absolute top-2 right-2 w-12 h-12 bg-white/10 rounded"></div>
            <div className="absolute bottom-2 left-2 w-10 h-10 bg-cyan-400/20 rounded"></div>

            {/* Navigation Arrows - Top Right */}
            <div className="absolute top-4 right-4 z-20 flex gap-1">
              <button
                onClick={() => setActiveSlide((prev) => (prev - 1 + 3) % 3)}
                className="w-6 h-6 bg-white/70 hover:bg-white/90 rounded flex items-center justify-center shadow-sm hover:shadow transition-all"
              >
                <ChevronLeft className="text-[#0019ff]" size={14} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setActiveSlide((prev) => (prev + 1) % 3)}
                className="w-6 h-6 bg-white/70 hover:bg-white/90 rounded flex items-center justify-center shadow-sm hover:shadow transition-all"
              >
                <ChevronRight className="text-[#0019ff]" size={14} strokeWidth={2.5} />
              </button>
            </div>

            <style jsx>{`
              @keyframes slide-right {
                0% { transform: translateX(-100%); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: translateX(100%); opacity: 0; }
              }
            `}</style>

            <div className="relative z-10 min-h-[480px] flex flex-col">
              {/* Slide 0: Wallet Extension */}
              {activeSlide === 0 && (
                <>
              {/* Badges - Fixed at top */}
              <div className="flex items-center gap-2 mb-6">
                <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded shadow-lg">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-black text-[#0019ff] uppercase tracking-wider">Wallet</span>
                </div>
                <a
                  href="https://testnet.rainum.io"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 px-3 py-1.5 rounded shadow-lg transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Coins className="text-white" size={14} strokeWidth={2.5} />
                  <span className="text-xs font-black text-white uppercase tracking-wider">Testnet</span>
                </a>
              </div>

              {/* Centered Content */}
              <div className="flex-1 flex flex-col justify-center">
                {/* Wallet Icon (white on blue) */}
                <div className="w-14 h-14 bg-white rounded flex items-center justify-center mb-3 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-[#0019ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  Rainum Wallet Extension
                </h3>

                <p className="text-blue-100 text-sm leading-relaxed mb-4">
                  World's first dual-VM blockchain wallet. EVM + Move support in one browser extension.
                </p>

                {/* Feature List (white on blue) */}
                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white rounded flex items-center justify-center flex-shrink-0">
                      <ArrowRightLeft className="text-[#0019ff]" size={16} strokeWidth={2} />
                    </div>
                    <span className="text-sm font-semibold text-white">EVM + Move Dual-VM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white rounded flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="text-emerald-600" size={16} strokeWidth={2} />
                    </div>
                    <span className="text-sm font-semibold text-white">Built-in ZKP Privacy</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white rounded flex items-center justify-center flex-shrink-0">
                      <Zap className="text-amber-600" size={16} strokeWidth={2} />
                    </div>
                    <span className="text-sm font-semibold text-white">1-Click Cross-VM Calls</span>
                  </div>
                </div>

                {/* Download Button */}
                <a
                  href="https://chrome.google.com/webstore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-cyan-300 text-[#0019ff] hover:text-[#0014cc] px-6 py-3 rounded font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-200 text-sm w-full"
                >
                  <ExternalLink size={18} strokeWidth={2} />
                  <span className="font-black">Download Extension</span>
                </a>

                <div className="mt-3 text-xs text-center text-blue-100 font-semibold">
                  <span className="text-white font-black">FREE</span> · Chrome & Firefox
                </div>
              </div>
                </>
              )}

              {/* Slide 1: DApps Promo */}
              {activeSlide === 1 && (
                <>
                  {/* Badge - Fixed at top */}
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded shadow-lg">
                      <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-black text-[#0019ff] uppercase tracking-wider">Developer</span>
                    </div>
                  </div>

                  {/* Centered Content */}
                  <div className="flex-1 flex flex-col justify-center">
                    {/* Rocket Icon */}
                    <div className="w-14 h-14 bg-white rounded flex items-center justify-center mb-3 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <Rocket className="text-[#0019ff]" size={28} strokeWidth={2.5} />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">
                      Build on Rainum
                    </h3>

                    <p className="text-blue-100 text-sm leading-relaxed mb-4">
                      Deploy decentralized applications with dual-VM support. Choose EVM, Move, or use both.
                    </p>

                    {/* Feature List */}
                    <div className="space-y-2.5 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white rounded flex items-center justify-center flex-shrink-0">
                          <Code className="text-[#0019ff]" size={16} strokeWidth={2} />
                        </div>
                        <span className="text-sm font-semibold text-white">Full SDK & CLI Tools</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white rounded flex items-center justify-center flex-shrink-0">
                          <Coins className="text-emerald-600" size={16} strokeWidth={2} />
                        </div>
                        <span className="text-sm font-semibold text-white">Low Gas Fees</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white rounded flex items-center justify-center flex-shrink-0">
                          <ArrowRightLeft className="text-amber-600" size={16} strokeWidth={2} />
                        </div>
                        <span className="text-sm font-semibold text-white">Native Cross-VM Calls</span>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-2">
                      <a
                        href="https://docs.rainum.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-[#0019ff] px-6 py-3 rounded font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-200 text-sm w-full"
                      >
                        <Code size={18} strokeWidth={2} />
                        <span className="font-black">View Documentation</span>
                      </a>
                      <a
                        href="https://github.com/rainum-labs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 border-2 border-white text-white px-6 py-3 rounded font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-200 text-sm w-full"
                      >
                        <Rocket size={18} strokeWidth={2} />
                        <span className="font-black">Start Building</span>
                      </a>
                    </div>

                    <div className="mt-3 text-xs text-center text-blue-100 font-semibold">
                      <span className="text-white font-black">OPEN SOURCE</span> · Community Built
                    </div>
                  </div>
                </>
              )}

              {/* Slide 2: RainSwap DApp Promo */}
              {activeSlide === 2 && (
                <>
                  {/* Badge - Fixed at top */}
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded shadow-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-black text-purple-600 uppercase tracking-wider">Live DEX</span>
                    </div>
                  </div>

                  {/* Centered Content */}
                  <div className="flex-1 flex flex-col justify-center">
                    {/* RainSwap Icon */}
                    <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-3 shadow-lg transform group-hover:scale-110 transition-transform duration-300 relative">
                      <div className="absolute inset-0 bg-purple-400 rounded-xl blur opacity-40"></div>
                      <ArrowRightLeft className="text-white relative z-10" size={28} strokeWidth={2.5} />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">
                      RainSwap DEX
                    </h3>

                    <p className="text-blue-100 text-sm leading-relaxed mb-4">
                      World's first dual-VM decentralized exchange. Swap EVM and Move tokens seamlessly.
                    </p>

                    {/* Feature List */}
                    <div className="space-y-2.5 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-purple-600 rounded flex items-center justify-center flex-shrink-0">
                          <ArrowRightLeft className="text-white" size={16} strokeWidth={2} />
                        </div>
                        <span className="text-sm font-semibold text-white">Swap EVM ↔ Move Tokens</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-purple-600 rounded flex items-center justify-center flex-shrink-0">
                          <Coins className="text-white" size={16} strokeWidth={2} />
                        </div>
                        <span className="text-sm font-semibold text-white">Cross-VM Liquidity Pools</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-purple-600 rounded flex items-center justify-center flex-shrink-0">
                          <Zap className="text-white" size={16} strokeWidth={2} />
                        </div>
                        <span className="text-sm font-semibold text-white">Lightning Fast Swaps</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <a
                      href="https://rainswap.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-200 text-sm w-full"
                    >
                      <ExternalLink size={18} strokeWidth={2} />
                      <span className="font-black">Launch RainSwap</span>
                    </a>

                    <div className="mt-3 text-xs text-center text-blue-100 font-semibold">
                      <span className="text-purple-300 font-black">LIVE ON MAINNET</span> · 50K+ Users
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            icon={<Blocks className="text-[#0019ff]" size={20} strokeWidth={2} />}
            title="Block Height"
            value={status?.block_height ? formatNumber(status.block_height) : '...'}
          />
          <StatCard
            icon={<Activity className="text-emerald-600" size={20} strokeWidth={2} />}
            title="Transactions Per Second"
            value={status?.tps ? status.tps.toFixed(2) : '...'}
          />
          <StatCard
            icon={<TrendingUp className="text-violet-600" size={20} strokeWidth={2} />}
            title="Total Transactions"
            value={status?.total_transactions ? formatNumber(status.total_transactions) : '...'}
          />
          <StatCard
            icon={<Users className="text-amber-600" size={20} strokeWidth={2} />}
            title="Active Validators"
            value={status?.active_validators ? formatNumber(status.active_validators) : '...'}
          />
          <StatCard
            icon={<Coins className="text-cyan-600" size={20} strokeWidth={2} />}
            title="Total Supply"
            value={totalSupply ? (
              <>
                <RainIcon size={20} />
                {formatNumber(totalSupply)} RAIN
              </>
            ) : '...'}
          />
        </div>

        {/* Recent Data - Tabbed View */}
        <div className="bg-white rounded border border-gray-200 overflow-hidden">
          {/* Tab Headers */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 ${
                  activeTab === 'transactions'
                    ? 'bg-[#0019ff] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Activity size={16} strokeWidth={2} />
                <span className="text-sm font-semibold">Latest Transactions</span>
              </button>
              <button
                onClick={() => setActiveTab('blocks')}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 ${
                  activeTab === 'blocks'
                    ? 'bg-[#0019ff] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Blocks size={16} strokeWidth={2} />
                <span className="text-sm font-semibold">Latest Blocks</span>
              </button>
            </div>
            <Link
              href={activeTab === 'blocks' ? '/blocks' : '/transactions'}
              className="text-[#0019ff] hover:text-[#0014cc] text-sm font-medium flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>

          {/* Blocks Tab Content */}
          {activeTab === 'blocks' && (
          <div>

            {/* Column Headers */}
            <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-10 gap-4 text-base font-bold text-gray-700 uppercase tracking-wide">
                <div>Block</div>
                <div className="col-span-2">Block Hash</div>
                <div>Age</div>
                <div className="text-center">Txs</div>
                <div className="text-right">Gas Used</div>
                <div className="text-right">Reward</div>
                <div className="text-center">Shard</div>
                <div className="text-right col-span-2">Validator</div>
              </div>
            </div>

            <div>
              {blocksLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded"></div>
                        <div>
                          <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 w-32 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 w-12 bg-gray-200 rounded mb-2 ml-auto"></div>
                        <div className="h-3 w-16 bg-gray-100 rounded ml-auto"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : blocks && blocks.length > 0 ? (
                blocks.slice(0, 10).map((block: Block) => {
                  const validator = validators?.find((v: ValidatorInfo) => v.address.toLowerCase() === block.validator.toLowerCase())
                  const isSameValidator = hoveredValidator?.toLowerCase() === block.validator.toLowerCase()
                  const ageText = getAge(block.timestamp)
                  const gasUsed = (block.transaction_count || 0) * 21000
                  const reward = block.validator_tier === 3 ? 30 : block.validator_tier === 2 ? 20 : 10
                  const shardId = block.id % 16

                  return (
                  <div
                    key={block.id}
                    className="px-6 py-5 transition-all hover:bg-blue-50/50 border-t border-gray-200 group"
                  >
                    <div className="grid grid-cols-10 gap-4 items-center">
                      {/* Block Number */}
                      <Link href={'/block/' + block.hash}>
                        <span className="font-black text-[#0019ff] hover:text-[#0014cc] transition-colors text-lg">
                          #{block.id}
                        </span>
                      </Link>

                      {/* Block Hash (halvt) */}
                      <div
                        className="col-span-2 inline-flex items-center gap-1"
                        onMouseEnter={() => setHoveredBlockHash(block.hash)}
                        onMouseLeave={() => setHoveredBlockHash(null)}
                      >
                        <Link href={'/block/' + block.hash}>
                          <span
                            className="inline-flex items-center gap-2 font-mono text-base font-semibold px-3 py-1.5 rounded"
                            style={{
                              backgroundColor: hoveredBlockHash === block.hash ? '#fef3e7' : 'transparent',
                              outline: hoveredBlockHash === block.hash ? '4px dashed #f39c12' : 'none',
                              outlineOffset: '-4px',
                              color: hoveredBlockHash === block.hash ? '#0019ff' : '#374151',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              transitionDelay: hoveredBlockHash === block.hash ? '0.25s' : '0s'
                            }}
                          >
                            {formatHash(block.hash, 10, 8)}
                            {hoveredBlockHash === block.hash && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(block.hash);
                                }}
                                className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#f39c12] hover:bg-[#e67e22] text-white transition-colors"
                                title="Copy full hash"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                              </button>
                            )}
                          </span>
                        </Link>
                        {hoveredBlockHash !== block.hash && (
                          <button
                            onClick={() => navigator.clipboard.writeText(block.hash)}
                            className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-100 hover:bg-[#f39c12] hover:text-white text-gray-600 transition-all"
                            title="Copy full hash"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Age */}
                      <span className="text-base text-gray-600 font-semibold">{ageText} ago</span>

                      {/* Transactions */}
                      <div className="text-center">
                        <span className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded text-base font-black">
                          {block.transaction_count || 0}
                        </span>
                      </div>

                      {/* Gas Used */}
                      <div className="text-right text-base text-gray-700 font-bold flex items-center justify-end gap-1">
                        <RainIcon size={16} />
                        {gasUsed > 0 ? `${(gasUsed / 1000).toFixed(1)}K` : '0'}
                      </div>

                      {/* Reward */}
                      <div className="text-right">
                        <span className="text-base font-black text-amber-600 flex items-center justify-end gap-1">
                          <RainIcon size={16} />
                          +{reward}
                        </span>
                      </div>

                      {/* Shard */}
                      <div className="text-center">
                        <span className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded text-base font-black">
                          S{shardId}
                        </span>
                      </div>

                      {/* Validator (med avatar + badge + copy icon inside) */}
                      <div className="col-span-2 flex justify-end items-center">
                        <Link
                          href={'/account/' + block.validator}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200"
                          style={{
                            outline: hoveredValidator?.toLowerCase() === block.validator.toLowerCase() ? '4px dashed #f39c12' : 'none',
                            outlineOffset: hoveredValidator?.toLowerCase() === block.validator.toLowerCase() ? '4px' : '0',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transitionDelay: hoveredValidator?.toLowerCase() === block.validator.toLowerCase() ? '0.25s' : '0s'
                          }}
                          onMouseEnter={() => setHoveredValidator(block.validator)}
                          onMouseLeave={() => setHoveredValidator(null)}
                        >
                          <div className="w-6 h-6 rounded overflow-hidden flex-shrink-0">
                            <Avatar
                              address={block.validator}
                              avatarUrl={validator?.avatar_url}
                              size={24}
                            />
                          </div>
                          <span className="font-mono text-base font-bold text-amber-700">
                            {formatHash(block.validator, 8, 6)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigator.clipboard.writeText(block.validator);
                            }}
                            className="inline-flex items-center justify-center w-5 h-5 rounded bg-amber-100 hover:bg-[#f39c12] hover:text-white text-amber-600 transition-colors"
                            title="Copy full address"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  )
                })
              ) : (
                <div className="px-6 py-12 text-center text-gray-500">
                  <Blocks className="mx-auto mb-2 text-gray-300" size={32} strokeWidth={1.5} />
                  <p className="text-sm">No blocks found</p>
                </div>
              )}
            </div>
          </div>
          )}

          {/* Transactions Tab Content */}
          {activeTab === 'transactions' && (
          <div>

            {/* Column Headers */}
            <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-[100px_220px_100px_80px_100px_1fr_1fr_150px_130px] gap-4 text-base font-bold text-gray-700 uppercase tracking-wide">
                <div>Block</div>
                <div>TX Hash</div>
                <div>Age</div>
                <div className="flex items-center gap-1">
                  <span>VM</span>
                  <button
                    onClick={() => setIsVMInfoOpen(true)}
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full text-gray-500 hover:text-[#0019ff] hover:bg-gray-200 transition-all"
                    title="What is VM Type?"
                  >
                    <Info size={14} strokeWidth={2.5} />
                  </button>
                </div>
                <div>Type</div>
                <div>From</div>
                <div>To</div>
                <div className="text-right">Amount</div>
                <div className="text-center">Status</div>
              </div>
            </div>

            <div>
              {transactionsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 animate-pulse">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      <div className="h-3 w-20 bg-gray-100 rounded"></div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-28 bg-gray-200 rounded"></div>
                      <div className="h-3 w-3 bg-gray-100 rounded"></div>
                      <div className="h-6 w-28 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-5 w-16 bg-emerald-100 rounded"></div>
                    </div>
                  </div>
                ))
              ) : transactions && transactions.length > 0 ? (
                transactions.slice(0, 10).map((tx: Transaction, index: number) => {
                  const isPrivate = tx.zkp_enabled && tx.privacy_level === 'full'
                  const ageText = getAge(tx.timestamp)

                  // Determine VM type (mock data until API provides it)
                  const vmType = (tx as any).vm_type || 'EVM'
                  const txType = tx.to ? 'Transfer' : 'Contract'

                  // Extract block number from block_hash if available
                  const blockNumber = (tx as any).block_id || (tx as any).block_number || '...'

                  return (
                  <div
                    key={`${tx.hash}-${index}`}
                    className="px-6 py-5 transition-all hover:bg-blue-50/50 border-t border-gray-200 group"
                  >
                    <div className="grid grid-cols-[100px_220px_100px_80px_100px_1fr_1fr_150px_130px] gap-4 items-center">
                      {/* Block */}
                      <div>
                        {blockNumber !== '...' ? (
                          <Link href={'/block/' + blockNumber}>
                            <span className="text-base font-black text-[#0019ff] hover:text-[#0014cc] transition-colors">
                              {blockNumber}
                            </span>
                          </Link>
                        ) : (
                          <span className="text-base font-semibold text-gray-400">...</span>
                        )}
                      </div>

                      {/* TX Hash */}
                      <Link href={'/transaction/' + tx.hash}>
                        <span className="font-mono text-base font-semibold text-gray-700 hover:text-[#0019ff] transition-colors">
                          {formatHash(tx.hash, 10, 8)}
                        </span>
                      </Link>

                      {/* Age */}
                      <span className="text-base text-gray-600 font-semibold">{ageText} ago</span>

                      {/* VM Type */}
                      <div>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-black ${
                          vmType === 'EVM'
                            ? 'bg-blue-50 text-blue-700'
                            : vmType === 'Move'
                            ? 'bg-violet-50 text-violet-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {vmType}
                        </span>
                      </div>

                      {/* Type */}
                      <div>
                        <span className="text-sm font-semibold text-gray-600">
                          {txType}
                        </span>
                      </div>

                      {/* From */}
                      <div>
                        {isPrivate ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded">
                            <ShieldCheck className="text-purple-600" size={18} strokeWidth={2} />
                            <span className="text-base font-semibold text-purple-700">Private</span>
                          </div>
                        ) : (
                          <Link
                            href={'/account/' + tx.from}
                            className="inline-flex items-center gap-2 px-2 py-1 rounded"
                            style={{
                              backgroundColor: hoveredAddress?.toLowerCase() === tx.from.toLowerCase() ? '#fef3e7' : 'transparent',
                              outline: hoveredAddress?.toLowerCase() === tx.from.toLowerCase() ? '2px dashed #f39c12' : 'none',
                              outlineOffset: '-2px',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              transitionDelay: hoveredAddress?.toLowerCase() === tx.from.toLowerCase() ? '0.25s' : '0s'
                            }}
                            onMouseEnter={() => setHoveredAddress(tx.from)}
                            onMouseLeave={() => setHoveredAddress(null)}
                          >
                            <div className="w-6 h-6 rounded overflow-hidden flex-shrink-0">
                              <Avatar address={tx.from} avatarUrl={null} size={24} />
                            </div>
                            <span className="font-mono text-base font-semibold text-gray-700">{formatHash(tx.from, 8, 6)}</span>
                            {hoveredAddress?.toLowerCase() === tx.from.toLowerCase() && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(tx.from);
                                }}
                                className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#f39c12] hover:bg-[#e67e22] text-white transition-colors"
                                title="Copy full address"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                              </button>
                            )}
                          </Link>
                        )}
                      </div>

                      {/* To */}
                      <div>
                        {isPrivate ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded">
                            <ShieldCheck className="text-purple-600" size={18} strokeWidth={2} />
                            <span className="text-base font-semibold text-purple-700">Private</span>
                          </div>
                        ) : (
                          <Link
                            href={'/account/' + tx.to}
                            className="inline-flex items-center gap-2 px-2 py-1 rounded"
                            style={{
                              backgroundColor: hoveredAddress?.toLowerCase() === tx.to.toLowerCase() ? '#fef3e7' : 'transparent',
                              outline: hoveredAddress?.toLowerCase() === tx.to.toLowerCase() ? '2px dashed #f39c12' : 'none',
                              outlineOffset: '-2px',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              transitionDelay: hoveredAddress?.toLowerCase() === tx.to.toLowerCase() ? '0.25s' : '0s'
                            }}
                            onMouseEnter={() => setHoveredAddress(tx.to)}
                            onMouseLeave={() => setHoveredAddress(null)}
                          >
                            <div className="w-6 h-6 rounded overflow-hidden flex-shrink-0">
                              <Avatar address={tx.to} avatarUrl={null} size={24} />
                            </div>
                            <span className="font-mono text-base font-semibold text-gray-700">{formatHash(tx.to, 8, 6)}</span>
                            {hoveredAddress?.toLowerCase() === tx.to.toLowerCase() && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(tx.to);
                                }}
                                className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#f39c12] hover:bg-[#e67e22] text-white transition-colors"
                                title="Copy full address"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                              </button>
                            )}
                          </Link>
                        )}
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        {isPrivate ? (
                          <div className="flex items-center justify-end gap-1.5 text-purple-700">
                            <ShieldCheck size={16} strokeWidth={2} />
                            <span className="text-base font-bold">Private</span>
                          </div>
                        ) : (
                          <span className="text-base font-bold text-gray-900 flex items-center justify-end gap-1.5">
                            <RainIcon size={16} />
                            {formatBalance(tx.amount).full} RAIN
                          </span>
                        )}
                      </div>

                      {/* Status */}
                      <div className="text-center">
                        <span className={`inline-flex items-center px-4 py-2 rounded text-base font-black ${
                          tx.status === 'confirmed' || !tx.status
                            ? 'bg-emerald-50 text-emerald-700'
                            : tx.status === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {tx.status === 'confirmed' || !tx.status ? 'Confirmed' : tx.status === 'pending' ? 'Pending' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  </div>
                  )
                })
              ) : (
                <div className="px-6 py-12 text-center text-gray-500">
                  <Activity className="mx-auto mb-2 text-gray-300" size={32} strokeWidth={1.5} />
                  <p className="text-sm">No transactions found</p>
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </main>

      <Footer />

      {/* VM Info Modal */}
      {isVMInfoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsVMInfoOpen(false)}
        >
          <div
            className="bg-gray-800 rounded-lg max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Virtual Machine Types</h2>
              <button
                onClick={() => setIsVMInfoOpen(false)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              {/* EVM */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-black text-sm">EVM</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">EVM (Ethereum Virtual Machine)</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Execute Solidity smart contracts compatible with Ethereum. Most widely used blockchain runtime with extensive tooling and developer ecosystem.
                  </p>
                </div>
              </div>

              {/* Move VM */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center">
                  <span className="text-white font-black text-xs">Move</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Move VM</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Execute Move smart contracts (Aptos/Sui inspired). Enhanced safety with resource-oriented programming and formal verification capabilities.
                  </p>
                </div>
              </div>

              {/* Cross-VM */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                  <ArrowRightLeft className="text-white" size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Cross-VM Transaction</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Transaction that calls between EVM ↔ Move VMs. <span className="text-emerald-400 font-semibold">Rainum's unique dual-VM interoperability feature</span> enabling seamless communication across different blockchain runtimes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, title, value }: {
  icon: React.ReactNode
  title: string
  value: string | React.ReactNode
}) {
  return (
    <div className="bg-white rounded border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gray-100 rounded">
          {icon}
        </div>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <div className="text-2xl font-bold text-gray-900 flex items-center gap-2">{value}</div>
    </div>
  )
}
