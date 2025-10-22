'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useQuery } from '@tanstack/react-query'
import { getTransactions, getValidators, type Transaction } from '@/lib/api/rainum-api'
import { ArrowRightLeft, ArrowRight, Search, ShieldCheck, Info, X, Activity, Blocks } from 'lucide-react'
import Link from 'next/link'
import { Avatar } from '@/components/shared/Avatar'
import { RainIcon } from '@/components/shared/RainIcon'
import { formatHash, formatTimeAgo } from '@/lib/utils/format'
import { formatBalance } from '@/lib/utils/format-balance'
import { SearchCommand } from '@/components/shared/SearchCommand'
import { useState, useEffect } from 'react'

export default function TransactionsListPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [hoveredAddress, setHoveredAddress] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [isVMInfoOpen, setIsVMInfoOpen] = useState(false)

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

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', 'all'],
    queryFn: () => getTransactions({ limit: 50 }),
    refetchInterval: 5000,
  })

  const { data: validators } = useQuery({
    queryKey: ['validators'],
    queryFn: () => getValidators(),
  })

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
              <p className="text-gray-600">Recent transactions on the Rainum blockchain</p>
            </div>

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Search size={18} className="text-gray-500" />
              <span className="text-sm text-gray-700">Search</span>
              <kbd className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>

        <div className="bg-white rounded border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">All Transactions</h2>
              {transactions && (
                <span className="text-sm font-medium text-gray-600">{transactions.length} transactions</span>
              )}
            </div>
          </div>

          {/* Table Header */}
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

          {/* Table Body */}
          <div>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
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
              transactions.map((tx: Transaction, index: number) => {
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
                <ArrowRightLeft className="mx-auto mb-2 text-gray-300" size={32} strokeWidth={1.5} />
                <p className="text-sm">No transactions found</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Search Command Modal */}
      <SearchCommand
        transactions={transactions || []}
        validators={validators || []}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

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
