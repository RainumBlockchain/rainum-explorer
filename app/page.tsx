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
import { useState } from 'react'

export default function Home() {
  const [hoveredValidator, setHoveredValidator] = useState<string | null>(null)
  const [hoveredAddress, setHoveredAddress] = useState<string | null>(null)
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
          <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 rounded border border-blue-100 p-8 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            {/* Subtle animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/0 via-cyan-100/50 to-blue-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Decorative corner accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-200/20 to-transparent rounded-tr-full"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 px-3 py-1.5 rounded-full mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Live Explorer</span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Explore Rainum Blockchain
              </h2>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Fast, secure, and privacy-focused blockchain explorer with real-time data and advanced search capabilities.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-3.5">
                <div className="flex items-start gap-3 group/item">
                  <div className="w-10 h-10 bg-white border border-blue-200 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:border-blue-400 group-hover/item:shadow-md transition-all duration-200">
                    <Search className="text-blue-600" size={18} strokeWidth={2} />
                  </div>
                  <div className="pt-0.5">
                    <h3 className="font-semibold text-gray-900 mb-0.5 text-sm">Advanced Search</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">Search blocks, transactions, accounts, and validators instantly</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group/item">
                  <div className="w-10 h-10 bg-white border border-cyan-200 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:border-cyan-400 group-hover/item:shadow-md transition-all duration-200">
                    <Lock className="text-cyan-600" size={18} strokeWidth={2} />
                  </div>
                  <div className="pt-0.5">
                    <h3 className="font-semibold text-gray-900 mb-0.5 text-sm">ZKP Privacy Protection</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">Zero-knowledge proofs for private transactions</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group/item">
                  <div className="w-10 h-10 bg-white border border-blue-200 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:border-blue-400 group-hover/item:shadow-md transition-all duration-200">
                    <Zap className="text-blue-600" size={18} strokeWidth={2} />
                  </div>
                  <div className="pt-0.5">
                    <h3 className="font-semibold text-gray-900 mb-0.5 text-sm">Real-Time Updates</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">Live blockchain data refreshed every few seconds</p>
                  </div>
                </div>
              </div>

              {/* Premium Stats Bar */}
              <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-4 gap-3">
                <div className="text-center bg-white/60 backdrop-blur-sm rounded-lg py-3 px-2 border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="text-lg font-bold text-blue-600">{blocks && blocks.length > 0 ? `${((Date.now() / 1000 - blocks[0]?.timestamp) / 60).toFixed(1)}m` : '...'}</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wide font-medium">Last Block</div>
                </div>
                <div className="text-center bg-white/60 backdrop-blur-sm rounded-lg py-3 px-2 border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="text-lg font-bold text-cyan-600">{status?.tps ? status.tps.toFixed(1) : '...'}</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wide font-medium">Current TPS</div>
                </div>
                <div className="text-center bg-white/60 backdrop-blur-sm rounded-lg py-3 px-2 border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="text-lg font-bold text-purple-600">{validators?.filter(v => v.active && !v.jailed).length || 0}</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wide font-medium">Online Now</div>
                </div>
                <div className="text-center bg-white/60 backdrop-blur-sm rounded-lg py-3 px-2 border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="text-lg font-bold text-green-600">{totalSupply ? `${(totalSupply / 1000000000).toFixed(1)}B` : '...'}</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wide font-medium">Total Supply</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Sponsor/Ad Banner */}
          <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded border border-gray-200 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            {/* Subtle animated orbs */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute -top-12 -left-12 w-40 h-40 bg-blue-200 rounded-full filter blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-cyan-200 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-1.5 rounded-full mb-5 shadow-sm">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Sponsored by</span>
              </div>

              <h3 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
                andr.e
              </h3>

              <p className="text-gray-600 mb-6 max-w-sm text-sm leading-relaxed">
                Building the future of <span className="text-blue-600 font-semibold">decentralized infrastructure</span>. Enterprise-grade blockchain solutions.
              </p>

              <div className="space-y-2.5 mb-6">
                <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-green-300 hover:shadow-sm transition-all duration-200">
                  <ShieldCheck className="text-green-600" size={15} strokeWidth={2} />
                  <span className="font-medium">Secure Infrastructure</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-yellow-300 hover:shadow-sm transition-all duration-200">
                  <Zap className="text-yellow-600" size={15} strokeWidth={2} />
                  <span className="font-medium">Lightning Fast</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
                  <Users className="text-blue-600" size={15} strokeWidth={2} />
                  <span className="font-medium">Enterprise Ready</span>
                </div>
              </div>

              <a
                href="#"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm"
              >
                Learn More
                <ExternalLink size={16} strokeWidth={2} />
              </a>

              <div className="mt-6 text-xs text-gray-500 border-t border-gray-200 pt-4">
                Want to sponsor this space? <span className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700">Contact us</span>
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

        {/* Recent Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-6">
          {/* Recent Blocks */}
          <div className="bg-white rounded border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <Blocks className="text-gray-700" size={16} strokeWidth={2} />
                </div>
                <h2 className="text-base font-semibold text-gray-900">Latest Blocks</h2>
              </div>
              <Link
                href="/blocks"
                className="text-[#0019ff] hover:text-[#0014cc] text-sm font-medium flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </div>

            {/* Column Headers */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Block</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Block Hash</div>
                </div>
                <div className="text-center" style={{ width: '120px' }}>
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Transactions</div>
                </div>
                <div className="text-right" style={{ width: '140px' }}>
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Validator</div>
                </div>
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
                  const validatorColor = getAddressColor(block.validator)

                  return (
                  <div
                    key={block.id}
                    className="px-6 py-3 transition-all border-l-4 border-transparent hover:border-transparent border-t border-gray-200 group"
                    style={{
                      backgroundColor: isSameValidator ? `${validatorColor}08` : 'transparent'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Block Info - Left */}
                      <div className="flex-1 min-w-0">
                        <Link href={'/block/' + block.hash}>
                          <span className="font-bold text-[#0019ff] hover:text-[#0014cc] text-sm transition-colors">
                            Block #{block.id}
                          </span>
                        </Link>
                      </div>

                      {/* Block Hash - Center */}
                      <div className="flex-1 text-center min-w-0">
                        <Link href={'/block/' + block.hash}>
                          <span className="font-mono text-xs font-medium text-gray-700 hover:text-[#0019ff] transition-colors">
                            {formatHash(block.hash, 8, 6)}
                          </span>
                        </Link>
                      </div>

                      {/* Transactions - Center */}
                      <div className="text-center" style={{ width: '120px' }}>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                          <ArrowRightLeft size={10} strokeWidth={2} />
                          {block.transaction_count || 0}
                        </span>
                      </div>

                      {/* Validator - Right */}
                      <div className="flex justify-end min-w-0" style={{ width: '140px' }}>
                        <div
                          className="flex items-center gap-2 px-2 py-1 transition-all min-w-0 max-w-full"
                          style={{
                            borderRadius: '4px',
                            backgroundColor: isSameValidator ? '#fef3e7' : 'transparent',
                            outline: isSameValidator ? `2px dashed #f39c12` : 'none',
                            outlineOffset: '-2px',
                            boxShadow: 'none'
                          }}
                          onMouseEnter={() => setHoveredValidator(block.validator)}
                          onMouseLeave={() => setHoveredValidator(null)}
                        >
                        <div className="flex-shrink-0">
                          <Link href={'/account/' + block.validator} onClick={(e) => e.stopPropagation()}>
                            <Avatar
                              address={block.validator}
                              avatarUrl={validator?.avatar_url}
                              size={20}
                            />
                          </Link>
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={'/account/' + block.validator}
                            className="text-xs font-semibold text-gray-900 hover:text-[#0019ff] transition-colors truncate block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {validator?.nickname || formatHash(block.validator, 6, 4)}
                          </Link>
                        </div>
                        </div>
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

          {/* Recent Transactions */}
          <div className="bg-white rounded border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <Activity className="text-gray-700" size={16} strokeWidth={2} />
                </div>
                <h2 className="text-base font-semibold text-gray-900">Latest Transactions</h2>
              </div>
              <Link
                href="/transactions"
                className="text-[#0019ff] hover:text-[#0014cc] text-sm font-medium flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </div>

            {/* Column Headers */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Transaction Hash</div>
                </div>
                <div className="flex-[1.5] text-center">
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">From → To</div>
                </div>
                <div className="text-right" style={{ width: '140px' }}>
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Amount</div>
                </div>
                <div className="text-center" style={{ width: '100px' }}>
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</div>
                </div>
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

                  return (
                  <div
                    key={`${tx.hash}-${index}`}
                    className="px-6 py-3 transition-all border-l-4 border-transparent hover:border-transparent border-t border-gray-200 group"
                  >
                    <div className="flex items-center gap-4">
                      {/* TX Hash - Left */}
                      <div className="flex-1 min-w-0 flex items-center gap-1.5">
                        <Link href={'/transaction/' + tx.hash}>
                          <span className="font-mono text-xs font-bold text-[#0019ff] hover:text-[#0014cc] transition-colors">
                            {formatHash(tx.hash, 8, 6)}
                          </span>
                        </Link>
                        {tx.zkp_enabled && (
                          <PrivacyBadge
                            privacyLevel={tx.privacy_level || 'none'}
                            zkpEnabled={true}
                            size="sm"
                            showLabel={false}
                          />
                        )}
                      </div>

                      {/* From -> To - Center */}
                      <div className="flex-[1.5] flex items-center justify-center gap-1.5 text-xs min-w-0">
                        {isPrivate ? (
                          <>
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 rounded text-purple-700">
                              <ShieldCheck size={12} />
                              <span className="font-medium">Private</span>
                            </div>
                            <ArrowRight size={10} className="text-gray-300 flex-shrink-0" strokeWidth={2} />
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 rounded text-purple-700">
                              <ShieldCheck size={12} />
                              <span className="font-medium">Private</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <Link
                              href={'/account/' + tx.from}
                              className="flex items-center gap-1 px-2 py-0.5 rounded transition-all min-w-0"
                              style={{
                                backgroundColor: hoveredAddress?.toLowerCase() === tx.from.toLowerCase() ? '#fef3e7' : '#f3f4f6',
                                outline: hoveredAddress?.toLowerCase() === tx.from.toLowerCase() ? '2px dashed #f39c12' : 'none',
                                outlineOffset: '-2px'
                              }}
                              onMouseEnter={() => setHoveredAddress(tx.from)}
                              onMouseLeave={() => setHoveredAddress(null)}
                            >
                              <div className="flex-shrink-0">
                                <Avatar address={tx.from} avatarUrl={null} size={16} />
                              </div>
                              <span className="font-mono text-gray-700 truncate">{formatHash(tx.from, 6, 4)}</span>
                            </Link>
                            <ArrowRight size={10} className="text-gray-300 flex-shrink-0" strokeWidth={2} />
                            <Link
                              href={'/account/' + tx.to}
                              className="flex items-center gap-1 px-2 py-0.5 rounded transition-all min-w-0"
                              style={{
                                backgroundColor: hoveredAddress?.toLowerCase() === tx.to.toLowerCase() ? '#fef3e7' : '#f3f4f6',
                                outline: hoveredAddress?.toLowerCase() === tx.to.toLowerCase() ? '2px dashed #f39c12' : 'none',
                                outlineOffset: '-2px'
                              }}
                              onMouseEnter={() => setHoveredAddress(tx.to)}
                              onMouseLeave={() => setHoveredAddress(null)}
                            >
                              <div className="flex-shrink-0">
                                <Avatar address={tx.to} avatarUrl={null} size={16} />
                              </div>
                              <span className="font-mono text-gray-700 truncate">{formatHash(tx.to, 6, 4)}</span>
                            </Link>
                          </>
                        )}
                      </div>

                      {/* Amount - Right */}
                      <div className="text-right" style={{ width: '140px' }}>
                        {isPrivate ? (
                          <div className="flex items-center justify-end gap-1 text-purple-700">
                            <ShieldCheck size={12} />
                            <span className="text-xs font-bold">Private</span>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-gray-900">
                            {formatBalance(tx.amount).full} RAIN
                          </span>
                        )}
                      </div>

                      {/* Status - Right */}
                      <div className="text-center" style={{ width: '100px' }}>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
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
