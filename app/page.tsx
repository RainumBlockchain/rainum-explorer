'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useQuery } from '@tanstack/react-query'
import { getStatus, getBlocks, getTransactions, getValidators, getTotalSupply, type Block, type Transaction, type ValidatorInfo } from '@/lib/api/rainum-api'
import { Blocks, Activity, Users, TrendingUp, ArrowRight, ArrowRightLeft, ShieldCheck, Coins, Search, Zap, Lock, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Avatar } from '@/components/shared/Avatar'
import { PrivacyBadge } from '@/components/shared/PrivacyBadge'
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

  // Update time every second for live age countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
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
          <div className="bg-[#0019ff] rounded border-4 border-white p-8 relative overflow-hidden group hover:shadow-[0_20px_60px_rgba(0,25,255,0.4)] transition-all duration-300">
            {/* White stripe with animated border */}
            <div className="absolute top-0 left-0 w-full h-2 bg-white">
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400" style={{animation: 'slide-right 3s ease-in-out infinite'}}></div>
            </div>

            {/* Decorative corner accents */}
            <div className="absolute top-2 left-2 w-12 h-12 bg-white/10 rounded"></div>
            <div className="absolute bottom-2 right-2 w-10 h-10 bg-emerald-400/20 rounded"></div>

            <style jsx>{`
              @keyframes slide-right {
                0% { transform: translateX(-100%); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: translateX(100%); opacity: 0; }
              }
            `}</style>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded mb-4 shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-[#0019ff] uppercase tracking-wider">Live Explorer</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Explore Rainum Blockchain
              </h2>
              <p className="text-blue-100 mb-6 text-sm leading-relaxed">
                Fast, secure, and privacy-focused blockchain explorer with real-time data and advanced search capabilities.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded flex items-center justify-center flex-shrink-0 shadow-md">
                    <Search className="text-[#0019ff]" size={18} strokeWidth={2} />
                  </div>
                  <div className="pt-0.5">
                    <h3 className="font-semibold text-white mb-0.5 text-sm">Advanced Search</h3>
                    <p className="text-xs text-blue-100 leading-relaxed">Search blocks, transactions, accounts, and validators instantly</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded flex items-center justify-center flex-shrink-0 shadow-md">
                    <Lock className="text-emerald-600" size={18} strokeWidth={2} />
                  </div>
                  <div className="pt-0.5">
                    <h3 className="font-semibold text-white mb-0.5 text-sm">ZKP Privacy Protection</h3>
                    <p className="text-xs text-blue-100 leading-relaxed">Zero-knowledge proofs for private transactions</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded flex items-center justify-center flex-shrink-0 shadow-md">
                    <Zap className="text-amber-600" size={18} strokeWidth={2} />
                  </div>
                  <div className="pt-0.5">
                    <h3 className="font-semibold text-white mb-0.5 text-sm">Real-Time Updates</h3>
                    <p className="text-xs text-blue-100 leading-relaxed">Live blockchain data refreshed every few seconds</p>
                  </div>
                </div>
              </div>

              {/* Premium Stats Bar */}
              <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-4 gap-3">
                <div className="text-center bg-white/90 backdrop-blur-sm rounded py-3 px-2 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                  <div className="text-lg font-bold text-[#0019ff]">{blocks && blocks.length > 0 ? `${((Date.now() / 1000 - blocks[0]?.timestamp) / 60).toFixed(1)}m` : '...'}</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wide font-medium">Last Block</div>
                </div>
                <div className="text-center bg-white/90 backdrop-blur-sm rounded py-3 px-2 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                  <div className="text-lg font-bold text-emerald-600">{status?.tps ? status.tps.toFixed(1) : '...'}</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wide font-medium">Current TPS</div>
                </div>
                <div className="text-center bg-white/90 backdrop-blur-sm rounded py-3 px-2 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                  <div className="text-lg font-bold text-violet-600">{validators?.filter(v => v.active && !v.jailed).length || 0}</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wide font-medium">Online Now</div>
                </div>
                <div className="text-center bg-white/90 backdrop-blur-sm rounded py-3 px-2 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                  <div className="text-lg font-bold text-amber-600">{totalSupply ? `${(totalSupply / 1000000000).toFixed(1)}B` : '...'}</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wide font-medium">Total Supply</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Rainum Wallet Extension Promo */}
          <div className="bg-[#0019ff] rounded border-4 border-white p-8 flex flex-col relative overflow-hidden group hover:shadow-[0_20px_60px_rgba(0,25,255,0.4)] transition-all duration-300">
            {/* White stripe with animated border */}
            <div className="absolute top-0 left-0 w-full h-2 bg-white">
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400" style={{animation: 'slide-right 3s ease-in-out infinite'}}></div>
            </div>

            {/* Decorative corner accents */}
            <div className="absolute top-2 right-2 w-12 h-12 bg-white/10 rounded"></div>
            <div className="absolute bottom-2 left-2 w-10 h-10 bg-cyan-400/20 rounded"></div>

            <style jsx>{`
              @keyframes slide-right {
                0% { transform: translateX(-100%); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: translateX(100%); opacity: 0; }
              }
            `}</style>

            <div className="relative z-10">
              {/* Badges */}
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded shadow-lg">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-black text-[#0019ff] uppercase tracking-wider">Featured</span>
                </div>
                <a
                  href="https://testnet.rainum.io"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 px-4 py-1.5 rounded shadow-lg transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Coins className="text-white" size={14} strokeWidth={2.5} />
                  <span className="text-xs font-black text-white uppercase tracking-wider">Try Testnet</span>
                </a>
              </div>

              {/* Wallet Icon (white on blue) */}
              <div className="w-16 h-16 bg-white rounded flex items-center justify-center mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-9 h-9 text-[#0019ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                Rainum Wallet Extension
              </h3>

              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                World's first dual-VM blockchain wallet. EVM + Move support in one browser extension.
              </p>

              {/* Feature List (white on blue) */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded flex items-center justify-center flex-shrink-0">
                    <ArrowRightLeft className="text-[#0019ff]" size={18} strokeWidth={2} />
                  </div>
                  <span className="text-sm font-semibold text-white">EVM + Move Dual-VM</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="text-emerald-600" size={18} strokeWidth={2} />
                  </div>
                  <span className="text-sm font-semibold text-white">Built-in ZKP Privacy</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded flex items-center justify-center flex-shrink-0">
                    <Zap className="text-amber-600" size={18} strokeWidth={2} />
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

              <div className="mt-4 text-xs text-center text-blue-100 font-semibold">
                <span className="text-white font-black">FREE</span> · Chrome & Firefox
              </div>
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
            value={totalSupply ? formatNumber(totalSupply) + ' RAIN' : '...'}
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
                              outline: hoveredBlockHash === block.hash ? '2px dashed #f39c12' : 'none',
                              outlineOffset: '-2px',
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
                        {!hoveredBlockHash && (
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
                      <div className="text-right text-base text-gray-700 font-bold">
                        {gasUsed > 0 ? `${(gasUsed / 1000).toFixed(1)}K` : '0'}
                      </div>

                      {/* Reward */}
                      <div className="text-right">
                        <span className="text-base font-black text-amber-600">
                          +{reward}
                        </span>
                      </div>

                      {/* Shard */}
                      <div className="text-center">
                        <span className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded text-base font-black">
                          S{shardId}
                        </span>
                      </div>

                      {/* Validator (med avatar + halvt adresse + multi-highlight) */}
                      <div className="col-span-2 flex justify-end items-center gap-1">
                        <Link
                          href={'/account/' + block.validator}
                          className="inline-flex items-center gap-2 px-2 py-1 rounded"
                          style={{
                            backgroundColor: hoveredValidator?.toLowerCase() === block.validator.toLowerCase() ? '#fef3e7' : 'transparent',
                            outline: hoveredValidator?.toLowerCase() === block.validator.toLowerCase() ? '2px dashed #f39c12' : 'none',
                            outlineOffset: '-2px',
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
                          <span className="font-mono text-base font-bold text-gray-700">
                            {formatHash(block.validator, 8, 6)}
                          </span>
                          {hoveredValidator?.toLowerCase() === block.validator.toLowerCase() && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigator.clipboard.writeText(block.validator);
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
                        {!hoveredValidator && (
                          <button
                            onClick={() => navigator.clipboard.writeText(block.validator)}
                            className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-100 hover:bg-[#f39c12] hover:text-white text-gray-600 transition-all"
                            title="Copy full address"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                          </button>
                        )}
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
              <div className="grid grid-cols-[180px_100px_1fr_1fr_120px_100px] gap-4 text-base font-bold text-gray-700 uppercase tracking-wide">
                <div>TX Hash</div>
                <div>Age</div>
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

                  return (
                  <div
                    key={`${tx.hash}-${index}`}
                    className="px-6 py-5 transition-all hover:bg-blue-50/50 border-t border-gray-200 group"
                  >
                    <div className="grid grid-cols-[180px_100px_1fr_1fr_120px_100px] gap-4 items-center">
                      {/* TX Hash */}
                      <Link href={'/transaction/' + tx.hash}>
                        <span className="font-mono text-base font-semibold text-gray-700 hover:text-[#0019ff] transition-colors">
                          {formatHash(tx.hash, 10, 8)}
                        </span>
                      </Link>

                      {/* Age */}
                      <span className="text-base text-gray-600 font-semibold">{ageText} ago</span>

                      {/* From */}
                      {isPrivate ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded">
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
                        </Link>
                      )}

                      {/* To */}
                      {isPrivate ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded">
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
                        </Link>
                      )}

                      {/* Amount */}
                      <div className="text-right">
                        {isPrivate ? (
                          <div className="flex items-center justify-end gap-1.5 text-purple-700">
                            <ShieldCheck size={16} strokeWidth={2} />
                            <span className="text-base font-bold">Private</span>
                          </div>
                        ) : (
                          <span className="text-base font-bold text-gray-900">
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
    </div>
  )
}

function StatCard({ icon, title, value }: {
  icon: React.ReactNode
  title: string
  value: string
}) {
  return (
    <div className="bg-white rounded border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gray-100 rounded">
          {icon}
        </div>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  )
}
