'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useQuery } from '@tanstack/react-query'
import { getTransactions, getValidators, type Transaction } from '@/lib/api/rainum-api'
import { ArrowRightLeft, ArrowRight, Search, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { AddressBadge } from '@/components/shared/AddressBadge'
import { ValidatorBadge } from '@/components/shared/ValidatorBadge'
import { PrivacyBadge } from '@/components/shared/PrivacyBadge'
import { VMTypeBadge } from '@/components/shared/VMSelector'
import { CrossVMIndicator } from '@/components/shared/CrossVMBadge'
import { formatHash, formatTimeAgo } from '@/lib/utils/format'
import { formatBalance } from '@/lib/utils/format-balance'
import { SearchCommand } from '@/components/shared/SearchCommand'
import { useState, useEffect } from 'react'

export default function TransactionsListPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', 'all'],
    queryFn: () => getTransactions({ limit: 50 }),
    refetchInterval: 3000,
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
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 hidden lg:grid gap-6 text-xs font-semibold text-gray-700 uppercase tracking-wide" style={{ gridTemplateColumns: '1.3fr 1.4fr 1.4fr 1.2fr 1.5fr 0.9fr 0.9fr' }}>
            <div>TX Hash</div>
            <div>From</div>
            <div>To</div>
            <div>Amount</div>
            <div>Validator</div>
            <div>Age</div>
            <div>Status</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="px-6 py-4 animate-pulse">
                  <div className="hidden lg:grid gap-6 items-center" style={{ gridTemplateColumns: '1.3fr 1.4fr 1.4fr 1.2fr 1.5fr 0.9fr 0.9fr' }}>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 bg-gray-100 rounded-full"></div>
                      <div className="h-6 w-28 bg-gray-100 rounded"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 bg-gray-100 rounded-full"></div>
                      <div className="h-6 w-28 bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 bg-gray-100 rounded-full"></div>
                      <div className="h-4 w-20 bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-3 w-16 bg-gray-100 rounded"></div>
                    <div className="h-5 w-16 bg-emerald-100 rounded"></div>
                  </div>
                  <div className="lg:hidden space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      <div className="h-5 w-16 bg-emerald-100 rounded"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-28 bg-gray-100 rounded"></div>
                      <div className="h-3 w-3 bg-gray-100 rounded"></div>
                      <div className="h-6 w-28 bg-gray-100 rounded"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-3 w-16 bg-gray-100 rounded"></div>
                    </div>
                    <div className="pt-1 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-gray-100 rounded-full"></div>
                        <div className="h-4 w-20 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : transactions && transactions.length > 0 ? (
              transactions.map((tx: Transaction) => {
                const isPrivate = tx.zkp_enabled && tx.privacy_level === 'full'

                return (
                <Link
                  key={tx.hash}
                  href={'/transaction/' + tx.hash}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors block"
                >
                  {/* Mobile Layout */}
                  <div className="lg:hidden space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="font-mono text-sm text-[#0019ff] font-medium">
                          {formatHash(tx.hash, 10, 8)}
                        </div>
                        {/* ⭐ NEW: VM Type Badge */}
                        <VMTypeBadge type={(tx as any).vm_type || 'evm'} />
                        {/* 🌉 Cross-VM Indicator */}
                        <CrossVMIndicator isCrossVM={!!(tx as any).cross_vm_call} />
                        {tx.zkp_enabled && (
                          <PrivacyBadge privacyLevel={tx.privacy_level} zkpEnabled={tx.zkp_enabled} size="sm" showLabel={false} />
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTimeAgo(tx.timestamp)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isPrivate ? (
                        <>
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 rounded text-purple-700 text-xs font-medium">
                            <ShieldCheck size={12} />
                            <span>Private</span>
                          </div>
                          <ArrowRight size={12} className="text-gray-300 flex-shrink-0" strokeWidth={2} />
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 rounded text-purple-700 text-xs font-medium">
                            <ShieldCheck size={12} />
                            <span>Private</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <AddressBadge address={tx.from} short={true} showCopy={false} link={false} avatarSize={16} />
                          <ArrowRight size={12} className="text-gray-300 flex-shrink-0" strokeWidth={2} />
                          <AddressBadge address={tx.to} short={true} showCopy={false} link={false} avatarSize={16} />
                        </>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      {isPrivate ? (
                        <div className="flex items-center gap-1.5 text-purple-700 font-semibold text-sm">
                          <ShieldCheck size={14} />
                          <span>Private</span>
                        </div>
                      ) : (
                        <span className="font-semibold text-gray-900 text-sm">
                          {formatBalance(tx.amount).full} RAIN
                        </span>
                      )}
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-medium">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                    {tx.validator && (
                      <div className="pt-1 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Validator:</span>
                          <ValidatorBadge address={tx.validator} validators={validators || []} link={false} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden lg:grid gap-6 items-center" style={{ gridTemplateColumns: '1.3fr 1.4fr 1.4fr 1.2fr 1.5fr 0.9fr 0.9fr' }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="font-mono text-sm text-[#0019ff] font-medium truncate">
                        {formatHash(tx.hash, 10, 8)}
                      </div>
                      {/* ⭐ VM Type Badge */}
                      <VMTypeBadge type={(tx as any).vm_type || 'evm'} />
                      {/* 🌉 Cross-VM Indicator */}
                      <CrossVMIndicator isCrossVM={!!(tx as any).cross_vm_call} />
                      {tx.zkp_enabled && (
                        <PrivacyBadge privacyLevel={tx.privacy_level} zkpEnabled={tx.zkp_enabled} size="sm" showLabel={false} />
                      )}
                    </div>
                    <div className="min-w-0">
                      {isPrivate ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 rounded text-purple-700 text-xs font-medium">
                          <ShieldCheck size={12} />
                          <span>Private</span>
                        </div>
                      ) : (
                        <AddressBadge address={tx.from} short={true} showCopy={false} link={false} avatarSize={16} />
                      )}
                    </div>
                    <div className="min-w-0">
                      {isPrivate ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 rounded text-purple-700 text-xs font-medium">
                          <ShieldCheck size={12} />
                          <span>Private</span>
                        </div>
                      ) : (
                        <AddressBadge address={tx.to} short={true} showCopy={false} link={false} avatarSize={16} />
                      )}
                    </div>
                    <div className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                      {isPrivate ? (
                        <div className="flex items-center gap-1.5 text-purple-700">
                          <ShieldCheck size={14} />
                          <span>Private</span>
                        </div>
                      ) : (
                        <span>{formatBalance(tx.amount).full} RAIN</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      {tx.validator ? (
                        <ValidatorBadge address={tx.validator} validators={validators || []} link={false} />
                      ) : (
                        <span className="text-xs text-gray-400">Unknown</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">
                      {formatTimeAgo(tx.timestamp)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-emerald-50 text-emerald-700 whitespace-nowrap">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </Link>
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
    </div>
  )
}
