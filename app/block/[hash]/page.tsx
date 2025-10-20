'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useQuery } from '@tanstack/react-query'
import { getBlock, type Transaction } from '@/lib/api/rainum-api'
import { useParams } from 'next/navigation'
import { Blocks, Clock, Hash, User, ArrowRight, Copy, Check, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { AddressBadge } from '@/components/shared/AddressBadge'
import { PrivacyBadge } from '@/components/shared/PrivacyBadge'
import { formatHash, formatTimestamp, formatTimeAgo } from '@/lib/utils/format'
import { formatBalance } from '@/lib/utils/format-balance'
import { useState } from 'react'

export default function BlockDetailPage() {
  const params = useParams()
  const hash = params.hash as string
  const [copiedHash, setCopiedHash] = useState(false)

  const { data: block, isLoading } = useQuery({
    queryKey: ['block', hash],
    queryFn: () => getBlock(hash),
  })

  const handleCopyHash = () => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!block) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="text-center py-12">
            <Blocks className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Block Not Found</h2>
            <p className="text-gray-600">The block you are looking for does not exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Block #{block.id}</h1>
          <p className="text-gray-600">Block details and transactions</p>
        </div>

        {/* Block Overview Card */}
        <div className="bg-white rounded border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Block Overview</h2>
          </div>
          <div className="p-6 space-y-4">
            <DetailRow
              label="Block Height"
              value={'#' + block.id}
              icon={<Blocks className="text-[#0019ff]" size={20} />}
            />
            <DetailRow
              label="Block Hash"
              value={
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{block.hash}</span>
                  <button
                    onClick={handleCopyHash}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {copiedHash ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} className="text-gray-500" />
                    )}
                  </button>
                </div>
              }
              icon={<Hash className="text-purple-500" size={20} />}
            />
            <DetailRow
              label="Previous Hash"
              value={<span className="font-mono text-sm">{block.previous_hash}</span>}
              icon={<Hash className="text-gray-400" size={20} />}
            />
            <DetailRow
              label="Timestamp"
              value={
                <div className="flex flex-col">
                  <span>{formatTimestamp(block.timestamp)}</span>
                  <span className="text-sm text-gray-500">{formatTimeAgo(block.timestamp)}</span>
                </div>
              }
              icon={<Clock className="text-blue-500" size={20} />}
            />
            <DetailRow
              label="Validator"
              value={<AddressBadge address={block.validator} short={false} />}
              icon={<User className="text-orange-500" size={20} />}
            />
            <DetailRow
              label="Transactions"
              value={block.transaction_count + ' transactions in this block'}
              icon={<ArrowRight className="text-green-500" size={20} />}
            />
          </div>
        </div>

        {/* Transactions in Block */}
        <div className="bg-white rounded border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">
              Transactions ({block.transaction_count})
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {block.transactions && block.transactions.length > 0 ? (
              block.transactions.map((tx: Transaction) => {
                const isPrivate = tx.zkp_enabled && tx.privacy_level === 'full'

                return (
                  <Link
                    key={tx.hash}
                    href={'/transaction/' + tx.hash}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors block"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="font-mono text-sm text-[#0019ff] font-semibold">
                          {formatHash(tx.hash, 10, 8)}
                        </div>
                        {tx.zkp_enabled && (
                          <PrivacyBadge
                            privacyLevel={tx.privacy_level || 'none'}
                            zkpEnabled={true}
                            size="sm"
                            showLabel={false}
                          />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTimeAgo(tx.timestamp)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      {isPrivate ? (
                        <>
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 rounded text-purple-700 text-xs font-medium">
                            <ShieldCheck size={12} />
                            <span>Private Address</span>
                          </div>
                          <ArrowRight size={14} className="text-gray-400" />
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 rounded text-purple-700 text-xs font-medium">
                            <ShieldCheck size={12} />
                            <span>Private Address</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <AddressBadge address={tx.from} short={true} showCopy={false} link={false} avatarSize={16} />
                          <ArrowRight size={14} className="text-gray-400" />
                          <AddressBadge address={tx.to} short={true} showCopy={false} link={false} avatarSize={16} />
                        </>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {isPrivate ? (
                        <div className="flex items-center gap-1.5 text-purple-700">
                          <ShieldCheck size={14} />
                          <span>Private Amount</span>
                        </div>
                      ) : (
                        <span>{formatBalance(tx.amount).full} RAIN</span>
                      )}
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                No transactions in this block
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function DetailRow({ label, value, icon }: { label: string; value: React.ReactNode; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-3">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-9 h-9 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">{label}</div>
          <div className="text-gray-900 text-sm break-all">{value}</div>
        </div>
      </div>
    </div>
  )
}
