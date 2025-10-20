'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useQuery } from '@tanstack/react-query'
import { getAccount, getAccountTransactions, getValidatorInfo, getValidatorBlocks, type Transaction, type Block } from '@/lib/api/rainum-api'
import { useParams } from 'next/navigation'
import { Wallet, ArrowRightLeft, Copy, Check, ArrowRight, Star, ExternalLink, Package, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { AddressBadge } from '@/components/shared/AddressBadge'
import { Avatar } from '@/components/shared/Avatar'
import { PrivacyBadge } from '@/components/shared/PrivacyBadge'
import { formatHash, formatTimeAgo } from '@/lib/utils/format'
import { formatBalance } from '@/lib/utils/format-balance'
import { useState } from 'react'

const TIER_CONFIG = {
  1: { name: 'Bronze', color: 'bg-amber-700 text-white', icon: Star },
  2: { name: 'Silver', color: 'bg-gray-500 text-white', icon: Star },
  3: { name: 'Gold', color: 'bg-yellow-500 text-white', icon: Star },
  4: { name: 'Platinum', color: 'bg-purple-600 text-white', icon: Star },
}

export default function AccountProfilePage() {
  const params = useParams()
  const address = params.address as string
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [activeTab, setActiveTab] = useState<'transactions' | 'blocks'>('transactions')

  const { data: account, isLoading: accountLoading } = useQuery({
    queryKey: ['account', address],
    queryFn: () => getAccount(address),
  })

  const { data: validator, isLoading: validatorLoading } = useQuery({
    queryKey: ['validator', address],
    queryFn: () => getValidatorInfo(address),
    enabled: !!address,
  })

  const { data: transactions, isLoading: txLoading } = useQuery({
    queryKey: ['account-transactions', address],
    queryFn: () => getAccountTransactions(address),
  })

  const { data: producedBlocks, isLoading: blocksLoading } = useQuery({
    queryKey: ['validator-blocks', address],
    queryFn: () => getValidatorBlocks(address),
    enabled: !!validator,
  })

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  if (accountLoading || validatorLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-xl mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const isValidator = !!validator
  const tierConfig = validator ? TIER_CONFIG[validator.tier as keyof typeof TIER_CONFIG] || TIER_CONFIG[1] : null
  const TierIcon = tierConfig?.icon

  if (!account) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="text-center py-12">
            <Wallet className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Not Found</h2>
            <p className="text-gray-600">The account you are looking for does not exist.</p>
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
        {/* Account Header */}
        <div className="bg-[#0019ff] rounded border border-[#0014cc] p-6 text-white mb-6">
          <div className="flex items-start gap-6 mb-6">
            {/* Avatar */}
            <Avatar
              address={address}
              avatarUrl={validator?.avatar_url}
              size={80}
              className="ring-4 ring-white/20"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                {isValidator ? (
                  <>
                    <h1 className="text-3xl font-bold">{validator?.nickname || 'Validator'}</h1>
                    {tierConfig && TierIcon && (
                      <div className={'px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ' + tierConfig.color}>
                        <TierIcon size={14} />
                        {tierConfig.name}
                      </div>
                    )}
                    {validator?.jailed && (
                      <div className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold">
                        Jailed
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Wallet size={32} />
                    <h1 className="text-3xl font-bold">Wallet</h1>
                  </>
                )}
              </div>

              {/* Description for validators */}
              {validator?.description && (
                <p className="text-white/80 text-sm mb-3">{validator.description}</p>
              )}

              {/* Website for validators */}
              {validator?.website && (
                <a
                  href={validator.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white mb-3"
                >
                  <ExternalLink size={14} />
                  {validator.website}
                </a>
              )}

              <div className="flex items-center gap-3 bg-white/20 rounded px-4 py-3 backdrop-blur-sm">
                <span className="font-mono text-sm break-all">{address}</span>
                <button
                  onClick={handleCopyAddress}
                  className="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
                >
                  {copiedAddress ? (
                    <Check size={16} className="text-green-300" />
                  ) : (
                    <Copy size={16} className="text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={'grid gap-3 ' + (isValidator ? 'grid-cols-1 md:grid-cols-6' : 'grid-cols-1 md:grid-cols-4')}>
            <div className="bg-white/10 rounded p-4">
              <div className="text-white/70 text-sm mb-1">Balance</div>
              <div className="text-2xl font-bold">{formatBalance(account.balance).full} RAIN</div>
            </div>
            <div className="bg-white/10 rounded p-4">
              <div className="text-white/70 text-sm mb-1">Transactions</div>
              <div className="text-2xl font-bold">{account.transaction_count || 0}</div>
            </div>
            <div className="bg-white/10 rounded p-4">
              <div className="text-white/70 text-sm mb-1">First Seen</div>
              <div className="text-sm">{account.first_seen ? formatTimeAgo(account.first_seen) : 'N/A'}</div>
            </div>
            <div className="bg-white/10 rounded p-4">
              <div className="text-white/70 text-sm mb-1">Last Activity</div>
              <div className="text-sm">{account.last_seen ? formatTimeAgo(account.last_seen) : 'N/A'}</div>
            </div>

            {/* Validator-specific stats */}
            {isValidator && validator && (
              <>
                <div className="bg-white/10 rounded p-4">
                  <div className="text-white/70 text-sm mb-1">Stake</div>
                  <div className="text-xl font-bold">{formatBalance(validator.stake).full} RAIN</div>
                </div>
                <div className="bg-white/10 rounded p-4">
                  <div className="text-white/70 text-sm mb-1">Blocks Produced</div>
                  <div className="text-xl font-bold">{validator.blocks_produced || 0}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Transaction History / Produced Blocks */}
        <div className="bg-white rounded border border-gray-200">
          <div className="border-b border-gray-200">
            {isValidator && validator ? (
              <div className="flex gap-0">
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={'px-6 py-4 text-base font-semibold transition-colors flex items-center gap-2 ' + (activeTab === 'transactions' ? 'text-[#0019ff] border-b-2 border-[#0019ff]' : 'text-gray-500 hover:text-gray-900')}
                >
                  <ArrowRightLeft size={18} />
                  Transactions
                </button>
                <button
                  onClick={() => setActiveTab('blocks')}
                  className={'px-6 py-4 text-base font-semibold transition-colors flex items-center gap-2 ' + (activeTab === 'blocks' ? 'text-[#0019ff] border-b-2 border-[#0019ff]' : 'text-gray-500 hover:text-gray-900')}
                >
                  <Package size={18} />
                  Produced Blocks ({validator.blocks_produced || 0})
                </button>
              </div>
            ) : (
              <div className="px-6 py-4">
                <h2 className="text-base font-semibold text-gray-900">Transaction History</h2>
              </div>
            )}
          </div>
          <div className="divide-y divide-gray-100">
            {activeTab === 'transactions' ? (
              txLoading ? (
                <div className="px-6 py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0019ff] mx-auto"></div>
                </div>
              ) : transactions && transactions.length > 0 ? (
              transactions.map((tx: Transaction) => {
                const isOutgoing = tx.from.toLowerCase() === address.toLowerCase()
                const isPrivate = tx.zkp_enabled && tx.privacy_level === 'full'

                return (
                  <Link
                    key={tx.hash}
                    href={'/transaction/' + tx.hash}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors block"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={'w-10 h-10 rounded-lg flex items-center justify-center ' + (isPrivate ? 'bg-purple-50' : isOutgoing ? 'bg-red-50' : 'bg-green-50')}>
                          {isPrivate ? (
                            <ShieldCheck className="text-purple-500" size={20} />
                          ) : (
                            <ArrowRight
                              className={isOutgoing ? 'text-red-500' : 'text-green-500'}
                              size={20}
                              style={{ transform: isOutgoing ? 'rotate(0deg)' : 'rotate(180deg)' }}
                            />
                          )}
                        </div>
                        <div>
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
                          <div className="text-xs text-gray-500">
                            {formatTimeAgo(tx.timestamp)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {isPrivate ? (
                          <>
                            <div className="flex items-center justify-end gap-1 text-purple-700 font-bold">
                              <ShieldCheck size={14} />
                              <span>Private Amount</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Private Transaction
                            </div>
                          </>
                        ) : (
                          <>
                            <div className={'font-bold ' + (isOutgoing ? 'text-red-600' : 'text-green-600')}>
                              {isOutgoing ? '-' : '+'}{formatBalance(tx.amount).full} RAIN
                            </div>
                            <div className="text-xs text-gray-500">
                              {isOutgoing ? 'Sent' : 'Received'}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {isPrivate ? (
                        <>
                          <span className="text-gray-500">{isOutgoing ? 'To:' : 'From:'}</span>
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 rounded text-purple-700 text-xs font-medium">
                            <ShieldCheck size={12} />
                            <span>Private Address</span>
                          </div>
                        </>
                      ) : isOutgoing ? (
                        <>
                          <span className="text-gray-500">To:</span>
                          <AddressBadge address={tx.to} short={true} showCopy={false} link={false} />
                        </>
                      ) : (
                        <>
                          <span className="text-gray-500">From:</span>
                          <AddressBadge address={tx.from} short={true} showCopy={false} link={false} />
                        </>
                      )}
                    </div>
                  </Link>
                )
              })
              ) : (
                <div className="px-6 py-12 text-center text-gray-500">
                  <ArrowRightLeft className="mx-auto mb-3 text-gray-300" size={48} />
                  <p>No transactions yet</p>
                </div>
              )
            ) : (
              // Produced Blocks Tab
              blocksLoading ? (
                <div className="px-6 py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0019ff] mx-auto"></div>
                </div>
              ) : producedBlocks && producedBlocks.length > 0 ? (
                producedBlocks.map((block: Block) => (
                  <Link
                    key={block.id}
                    href={'/block/' + block.hash}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors block"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Package className="text-blue-500" size={20} />
                        </div>
                        <div>
                          <div className="font-mono text-sm text-[#0019ff] font-semibold">
                            Block #{block.id}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatTimeAgo(block.timestamp)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {block.transaction_count} {block.transaction_count === 1 ? 'Transaction' : 'Transactions'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatHash(block.hash, 8, 6)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="px-6 py-12 text-center text-gray-500">
                  <Package className="mx-auto mb-3 text-gray-300" size={48} />
                  <p>No blocks produced yet</p>
                </div>
              )
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
