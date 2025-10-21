'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useQuery } from '@tanstack/react-query'
import { getTransaction } from '@/lib/api/rainum-api'
import { useParams } from 'next/navigation'
import { ArrowRightLeft, Clock, Hash, CheckCircle2, XCircle, ArrowRight, Copy, Check, Shield, Lock, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { AddressBadge } from '@/components/shared/AddressBadge'
import { PrivacyBadge } from '@/components/shared/PrivacyBadge'
import { VMTypeBadge } from '@/components/shared/VMSelector'
import { MoveTransactionDetails } from '@/components/shared/MoveTransactionDetails'
import { formatHash, formatTimestamp, formatTimeAgo } from '@/lib/utils/format'
import { formatBalance } from '@/lib/utils/format-balance'
import { useState } from 'react'

export default function TransactionDetailPage() {
  const params = useParams()
  const hash = params.hash as string
  const [copiedHash, setCopiedHash] = useState(false)
  const [showProofData, setShowProofData] = useState(false)

  const { data: tx, isLoading } = useQuery({
    queryKey: ['transaction', hash],
    queryFn: () => getTransaction(hash),
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
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!tx) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="text-center py-12">
            <ArrowRightLeft className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Transaction Not Found</h2>
            <p className="text-gray-600">The transaction you are looking for does not exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const StatusIcon = tx.status === 'confirmed' ? CheckCircle2 : tx.status === 'failed' ? XCircle : Clock

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-8 py-12 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 text-sm mb-12 text-gray-500 font-medium">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link href="/transactions" className="hover:text-gray-900 transition-colors">
            Transactions
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold">{formatHash(hash)}</span>
        </nav>

        {/* Header */}
        <div className="mb-14">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Transaction</h1>
                {/* ⭐ NEW: VM Type Badge */}
                <VMTypeBadge type={(tx as any).vm_type || 'evm'} />
                <div className={'inline-flex items-center gap-2 px-4 py-2 text-sm font-bold backdrop-blur-sm transition-all shadow-sm ' +
                  (tx.status === 'confirmed' ? 'bg-green-50 text-green-700 ring-2 ring-green-200 hover:ring-green-300 hover:bg-green-100' :
                   tx.status === 'failed' ? 'bg-red-50 text-red-700 ring-2 ring-red-200 hover:ring-red-300 hover:bg-red-100' :
                   'bg-yellow-50 text-yellow-700 ring-2 ring-yellow-200 hover:ring-yellow-300 hover:bg-yellow-100')}
                  style={{borderRadius: '4px'}}>
                  <StatusIcon size={16} strokeWidth={2.5} />
                  <span>{tx.status === 'confirmed' ? 'Success' : tx.status}</span>
                </div>
                {tx.zkp_enabled && (
                  <PrivacyBadge privacyLevel={tx.privacy_level} zkpEnabled={tx.zkp_enabled} size="md" />
                )}
              </div>
              <div className="flex items-center gap-3 text-base text-gray-600 font-medium">
                <Clock size={16} strokeWidth={2} />
                <span>{formatTimeAgo(tx.timestamp)}</span>
                <span className="text-gray-300">•</span>
                <span>{formatTimestamp(tx.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Flow Visual */}
        {tx.zkp_enabled && tx.privacy_level === 'full' ? (
          // Full Privacy View
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 p-8 mb-10" style={{borderRadius: '4px'}}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Lock className="text-purple-600" size={28} />
              <h3 className="text-2xl font-bold text-gray-900">Private Transaction</h3>
              <PrivacyBadge privacyLevel={tx.privacy_level} zkpEnabled={tx.zkp_enabled} size="lg" />
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Sender Hash */}
                <div className="bg-white/80 backdrop-blur p-4 border border-purple-200" style={{borderRadius: '4px'}}>
                  <div className="text-xs text-purple-600 font-semibold mb-2 uppercase tracking-wide">Sender Commitment</div>
                  <div className="font-mono text-xs text-gray-700 break-all">
                    {tx.zkp_proof ? JSON.parse(tx.zkp_proof).sender_hash : 'N/A'}
                  </div>
                </div>

                {/* Amount Commitment */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-3 shadow-lg" style={{borderRadius: '50%'}}>
                    <Shield className="text-white" size={40} />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-purple-600 font-semibold mb-1">Amount</div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <EyeOff size={16} className="text-purple-500" />
                      <span className="font-bold text-lg">Private</span>
                    </div>
                  </div>
                </div>

                {/* Receiver Hash */}
                <div className="bg-white/80 backdrop-blur p-4 border border-purple-200" style={{borderRadius: '4px'}}>
                  <div className="text-xs text-purple-600 font-semibold mb-2 uppercase tracking-wide">Receiver Commitment</div>
                  <div className="font-mono text-xs text-gray-700 break-all">
                    {tx.zkp_proof ? JSON.parse(tx.zkp_proof).receiver_hash : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Info Note */}
              <div className="mt-6 bg-purple-100/50 p-4 border border-purple-200" style={{borderRadius: '4px'}}>
                <div className="flex items-start gap-3">
                  <Shield className="text-purple-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-purple-700">Zero-knowledge privacy enabled.</span> Sender, receiver, and amount are cryptographically hidden. Only cryptographic commitments are visible on-chain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Transaction Flow
          <div className="group bg-white border border-gray-200 hover:border-[#0019ff] mb-10 transition-all duration-200" style={{borderRadius: '4px'}}>
            <div className="py-10 px-12">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-10 items-center max-w-6xl mx-auto">
                {/* From */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">From</div>
                  </div>
                  <AddressBadge address={tx.from} short={false} />
                </div>

                {/* Arrow & Amount */}
                <div className="flex flex-col items-center gap-5 px-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#0019ff]/5 blur-xl"></div>
                    <div className="relative w-12 h-12 bg-white flex items-center justify-center border border-gray-200 group-hover:border-[#0019ff] transition-all" style={{borderRadius: '4px'}}>
                      <ArrowRight className="text-gray-700 group-hover:text-[#0019ff] transition-colors" size={20} strokeWidth={2} />
                    </div>
                  </div>
                  <div className="text-center whitespace-nowrap">
                    <div className="text-3xl font-bold text-gray-900 tracking-tight mb-0.5">{formatBalance(tx.amount).full}</div>
                    <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">RAIN</div>
                  </div>
                </div>

                {/* To */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0019ff]"></div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">To</div>
                  </div>
                  <AddressBadge address={tx.to} short={false} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Details */}
        <div className="bg-white border border-gray-200 hover:border-[#0019ff] mb-10 transition-all" style={{borderRadius: '4px'}}>
          <div className="px-8 py-5 border-b border-gray-200 bg-gray-50/30">
            <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Transaction Details</h2>
          </div>
          <div className="p-8">
            <div className="space-y-1">
            <DetailRow
              label="Transaction Hash"
              value={
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{tx.hash}</span>
                  <button
                    onClick={handleCopyHash}
                    className="p-1 hover:bg-gray-100 transition-colors"
                    style={{borderRadius: '6px'}}
                  >
                    {copiedHash ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} className="text-gray-400" />
                    )}
                  </button>
                </div>
              }
            />

            <DetailRow
              label="Status"
              value={
                <div className={'inline-flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all shadow-sm ' +
                  (tx.status === 'confirmed' ? 'bg-green-100 text-green-800 hover:bg-green-200 ring-2 ring-green-200' :
                   tx.status === 'failed' ? 'bg-red-100 text-red-800 hover:bg-red-200 ring-2 ring-red-200' :
                   'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 ring-2 ring-yellow-200')}
                  style={{borderRadius: '4px'}}>
                  <StatusIcon size={14} strokeWidth={2.5} />
                  <span>{tx.status === 'confirmed' ? 'Success' : tx.status}</span>
                </div>
              }
            />

            <DetailRow
              label="Block"
              value={
                tx.block_hash ? (
                  <Link
                    href={'/block/' + tx.block_hash}
                    className="text-[#0019ff] hover:text-[#0028ff] inline-flex items-center gap-2 transition-all group/link font-semibold"
                  >
                    <span className="group-hover/link:underline">{formatHash(tx.block_hash)}</span>
                    <ArrowRight size={16} strokeWidth={2.5} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <span className="text-yellow-600 font-bold">Pending</span>
                )
              }
            />

            <DetailRow
              label="Timestamp"
              value={
                <div>
                  <div>{formatTimestamp(tx.timestamp)}</div>
                  <div className="text-xs text-gray-500 mt-0.5">({formatTimeAgo(tx.timestamp)})</div>
                </div>
              }
            />

            <DetailRow
              label="From"
              value={<AddressBadge address={tx.from} short={false} />}
            />

            <DetailRow
              label="To"
              value={<AddressBadge address={tx.to} short={false} />}
            />

            {tx.zkp_enabled && tx.privacy_level === 'full' ? (
              <DetailRow
                label="Amount"
                value={
                  <div className="flex items-center gap-2">
                    <EyeOff size={16} className="text-gray-600" />
                    <span>Private (Hidden)</span>
                  </div>
                }
              />
            ) : (
              <DetailRow
                label="Amount"
                value={<span className="font-semibold">{formatBalance(tx.amount).full} RAIN</span>}
              />
            )}

            <DetailRow
              label="Gas Price"
              value={<span>{formatBalance(tx.gas_price).full} RAIN</span>}
            />

            <DetailRow
              label="Gas Used"
              value={<span>{tx.gas_used?.toLocaleString() || 'N/A'} units</span>}
            />

            <DetailRow
              label="Transaction Fee"
              value={
                <span className="font-semibold">
                  {(tx.gas_price && tx.gas_used) ? formatBalance(tx.gas_price * tx.gas_used).full : 'N/A'} RAIN
                </span>
              }
            />

            <DetailRow
              label="Nonce"
              value={<span className="font-mono">{tx.nonce}</span>}
            />
            </div>
          </div>
        </div>

        {/* Move VM Transaction Details */}
        {(tx as any).vm_type === 'move' && (
          <div className="bg-white border border-gray-200 hover:border-purple-300 mb-10 transition-all" style={{borderRadius: '4px'}}>
            <div className="px-8 py-5 border-b border-gray-200 bg-purple-50/30">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Move VM Details</h2>
                <VMTypeBadge type="move" />
              </div>
            </div>
            <div className="p-8">
              <MoveTransactionDetails tx={tx as any} />
            </div>
          </div>
        )}

        {/* ZKP Privacy Information */}
        {tx.zkp_enabled && tx.privacy_level && tx.privacy_level !== 'none' && (
          <div className="bg-white border border-gray-200 hover:border-[#0019ff] mt-10 transition-all" style={{borderRadius: '4px'}}>
            <div className="px-8 py-5 border-b border-gray-200 bg-purple-50/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="text-purple-600" size={20} strokeWidth={2} />
                  <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Zero-Knowledge Proof Privacy</h2>
                  <PrivacyBadge privacyLevel={tx.privacy_level} zkpEnabled={tx.zkp_enabled} size="sm" />
                </div>
              </div>
            </div>
            <div className="p-8 space-y-6">
              {/* How ZKP Works */}
              <div className="bg-purple-50 hover:bg-purple-100/50 transition-colors p-5 border border-purple-200" style={{borderRadius: '4px'}}>
                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield size={18} strokeWidth={2.5} />
                  How Zero-Knowledge Privacy Works
                </h3>
                <p className="text-base text-gray-900 mb-4 font-medium">
                  Instead of revealing the actual sender, receiver, and amount, the transaction stores cryptographic <strong>commitments</strong> (fingerprints) that:
                </p>
                <ul className="text-base text-gray-900 space-y-2 ml-5 font-medium">
                  <li>• <strong>Hide</strong> the real values using one-way hashing</li>
                  <li>• <strong>Prove</strong> validity without revealing data</li>
                  <li>• Are <strong>impossible to reverse</strong> back to original values</li>
                </ul>
              </div>

              {/* Commitments Grid */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Cryptographic Commitments</h3>
                <div className="grid grid-cols-1 gap-4">
                  {tx.zkp_proof && (() => {
                    const proof = JSON.parse(tx.zkp_proof);
                    return (
                      <>
                        <div className="bg-gray-50 hover:bg-gray-100 transition-colors p-4 border border-gray-200 hover:border-blue-300" style={{borderRadius: '4px'}}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-blue-100 flex items-center justify-center" style={{borderRadius: '4px'}}>
                              <Hash className="text-blue-600" size={16} strokeWidth={2} />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-gray-900">Sender Commitment</div>
                              <div className="text-xs text-gray-500">Hash(Sender Address + Random Salt)</div>
                            </div>
                          </div>
                          <div className="font-mono text-xs text-gray-700 bg-white p-2 break-all border border-gray-200" style={{borderRadius: '4px'}}>
                            {proof.sender_hash}
                          </div>
                        </div>

                        <div className="bg-gray-50 hover:bg-gray-100 transition-colors p-4 border border-gray-200 hover:border-green-300" style={{borderRadius: '4px'}}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-green-100 flex items-center justify-center" style={{borderRadius: '4px'}}>
                              <Hash className="text-green-600" size={16} strokeWidth={2} />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-gray-900">Receiver Commitment</div>
                              <div className="text-xs text-gray-500">Hash(Receiver Address + Random Salt)</div>
                            </div>
                          </div>
                          <div className="font-mono text-xs text-gray-700 bg-white p-2 break-all border border-gray-200" style={{borderRadius: '4px'}}>
                            {proof.receiver_hash}
                          </div>
                        </div>

                        <div className="bg-gray-50 hover:bg-gray-100 transition-colors p-4 border border-gray-200 hover:border-purple-300" style={{borderRadius: '4px'}}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-purple-100 flex items-center justify-center" style={{borderRadius: '4px'}}>
                              <Hash className="text-purple-600" size={16} strokeWidth={2} />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-gray-900">Amount Commitment</div>
                              <div className="text-xs text-gray-500">Hash(Transaction Amount + Random Salt)</div>
                            </div>
                          </div>
                          <div className="font-mono text-xs text-gray-700 bg-white p-2 break-all border border-gray-200" style={{borderRadius: '4px'}}>
                            {proof.amount_commitment}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Cryptographic Proofs */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-5 tracking-tight">Cryptographic Proofs (128 bytes each)</h3>
                <div className="space-y-5">
                  <div className="bg-white hover:bg-gray-50 transition-all p-6 border-2 border-gray-900 hover:border-[#0019ff] shadow-sm" style={{borderRadius: '4px'}}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-900 flex items-center justify-center flex-shrink-0" style={{borderRadius: '4px'}}>
                        <CheckCircle2 className="text-white" size={18} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-bold text-gray-900 mb-2">Balance Proof</div>
                        <div className="text-sm text-gray-900 font-medium">
                          Mathematically proves that the sender has sufficient balance for this transaction <strong>without revealing</strong> their actual balance amount.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white hover:bg-gray-50 transition-all p-6 border-2 border-gray-900 hover:border-[#0019ff] shadow-sm" style={{borderRadius: '4px'}}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-900 flex items-center justify-center flex-shrink-0" style={{borderRadius: '4px'}}>
                        <CheckCircle2 className="text-white" size={18} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-bold text-gray-900 mb-2">Transaction Proof</div>
                        <div className="text-sm text-gray-900 font-medium">
                          Cryptographically verifies that the transaction is mathematically valid and properly signed <strong>without revealing</strong> transaction details.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {tx.nullifier && (
                <DetailRow
                  label="Nullifier (Double-Spend Prevention)"
                  value={
                    <div>
                      <div className="font-mono text-xs break-all mb-1">{tx.nullifier}</div>
                      <div className="text-xs text-gray-500">Unique identifier that prevents this commitment from being spent twice</div>
                    </div>
                  }
                  icon={<Shield className="text-green-500" size={20} />}
                />
              )}

              {tx.zkp_proof && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowProofData(!showProofData)}
                    className="flex items-center gap-2 text-sm font-medium text-[#0019ff] hover:text-[#0028ff] transition-all hover:gap-3"
                  >
                    {showProofData ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
                    {showProofData ? 'Hide' : 'Show'} Raw ZKP Proof Data (Advanced)
                  </button>
                  {showProofData && (
                    <div className="mt-4 p-5 bg-gray-50 hover:bg-gray-100/50 transition-colors border border-gray-200" style={{borderRadius: '8px'}}>
                      <div className="text-xs text-gray-600 mb-3 font-medium">Complete cryptographic proof including 256 bytes of proof data (balance_proof + transaction_proof):</div>
                      <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap break-all overflow-x-auto bg-white p-4 border border-gray-200" style={{borderRadius: '6px'}}>
                        {JSON.stringify(JSON.parse(tx.zkp_proof), null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="group/row grid grid-cols-[200px_1fr] gap-8 py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 -mx-4 px-4 transition-colors" style={{borderRadius: '4px'}}>
      <div className="text-sm text-gray-500 font-medium tracking-tight">{label}</div>
      <div className="text-sm text-gray-900 font-medium break-all">{value}</div>
    </div>
  )
}
