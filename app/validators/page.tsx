'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useQuery } from '@tanstack/react-query'
import { getValidators, getPendingAppeals, getTierStats, type ValidatorInfo, type SlashAppeal, type TierStats } from '@/lib/api/rainum-api'
import { Users, Shield, Award, Star, Key, CheckCircle, XCircle, Scale, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Avatar } from '@/components/shared/Avatar'
import { formatBalance } from '@/lib/utils/format-balance'
import { formatHash } from '@/lib/utils/format'

const TIER_CONFIG = {
  1: { name: 'Tier 1 (Public)', color: 'bg-green-600 text-white', icon: Shield, finality: '2s' },
  2: { name: 'Tier 2 (Premium)', color: 'bg-blue-600 text-white', icon: Award, finality: '800ms' },
  3: { name: 'Tier 3 (Enterprise)', color: 'bg-yellow-500 text-white', icon: Star, finality: '500ms' },
}

export default function ValidatorsPage() {
  const { data: validators, isLoading } = useQuery({
    queryKey: ['validators'],
    queryFn: getValidators,
    refetchInterval: 10000,
  })

  const { data: tierStats } = useQuery({
    queryKey: ['tier-stats'],
    queryFn: getTierStats,
    refetchInterval: 10000,
  })

  const { data: appeals } = useQuery({
    queryKey: ['pending-appeals'],
    queryFn: getPendingAppeals,
    refetchInterval: 10000,
  })

  const activeValidators = validators?.filter((v: ValidatorInfo) => v.active && !v.jailed) || []
  const jailedValidators = validators?.filter((v: ValidatorInfo) => v.jailed) || []

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Validators</h1>
          <p className="text-gray-600">Network validators securing the Rainum blockchain</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-100 rounded">
                <Users className="text-gray-700" size={20} strokeWidth={2} />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Validators</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900">{validators?.length || 0}</div>
          </div>
          <div className="bg-white rounded border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-100 rounded">
                <Shield className="text-emerald-600" size={20} strokeWidth={2} />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Active</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900">{activeValidators.length}</div>
          </div>
          <div className="bg-white rounded border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-100 rounded">
                <Award className="text-red-600" size={20} strokeWidth={2} />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Jailed</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900">{jailedValidators.length}</div>
          </div>
        </div>

        {/* Active Validators */}
        <div className="bg-white rounded border border-gray-200 mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <h2 className="text-base font-semibold text-gray-900">Active Validators</h2>
          </div>

          {/* Table Header */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 hidden lg:grid lg:grid-cols-7 gap-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">
            <div>Address</div>
            <div>Tier</div>
            <div>Keys</div>
            <div>Stake</div>
            <div>Blocks</div>
            <div>Missed</div>
            <div>Rewards</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <div className="px-6 py-12 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0019ff] mx-auto"></div>
              </div>
            ) : activeValidators.length > 0 ? (
              activeValidators.map((validator: ValidatorInfo) => {
                const tierConfig = TIER_CONFIG[validator.tier as keyof typeof TIER_CONFIG] || TIER_CONFIG[1]
                const TierIcon = tierConfig.icon
                return (
                  <Link
                    key={validator.address}
                    href={'/account/' + validator.address}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors block"
                  >
                    {/* Mobile Layout */}
                    <div className="lg:hidden space-y-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0">
                          <Avatar address={validator.address} avatarUrl={validator.avatar_url} size={40} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">
                            {validator.nickname || formatHash(validator.address, 8, 6)}
                          </div>
                          <div className="text-xs text-gray-500 font-mono truncate">{formatHash(validator.address, 8, 6)}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {validator.bls_public_key_hex ? (
                              <div className="flex items-center gap-0.5 text-emerald-600">
                                <CheckCircle size={12} strokeWidth={2} />
                                <span className="text-xs">BLS</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-0.5 text-gray-400">
                                <XCircle size={12} strokeWidth={2} />
                                <span className="text-xs">BLS</span>
                              </div>
                            )}
                            {validator.ed25519_public_key_hex ? (
                              <div className="flex items-center gap-0.5 text-emerald-600">
                                <CheckCircle size={12} strokeWidth={2} />
                                <span className="text-xs">Ed25519</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-0.5 text-gray-400">
                                <XCircle size={12} strokeWidth={2} />
                                <span className="text-xs">Ed25519</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <span className={'px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 flex-shrink-0 ' + tierConfig.color}>
                          <TierIcon size={12} strokeWidth={2.5} />
                          {tierConfig.name}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-gray-500 text-xs mb-0.5">Stake</div>
                          <div className="font-semibold text-gray-900">{formatBalance(validator.stake).full} RAIN</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-0.5">Blocks</div>
                          <div className="font-semibold text-gray-900">{validator.blocks_produced || 0}</div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:grid lg:grid-cols-7 gap-4 items-center">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0">
                          <Avatar address={validator.address} avatarUrl={validator.avatar_url} size={32} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 text-sm truncate">
                            {validator.nickname || formatHash(validator.address, 8, 6)}
                          </div>
                          <div className="text-xs text-gray-500 font-mono truncate">{formatHash(validator.address, 6, 4)}</div>
                        </div>
                      </div>
                      <div>
                        <span className={'px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 w-fit ' + tierConfig.color}>
                          <TierIcon size={12} strokeWidth={2.5} />
                          {tierConfig.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {validator.bls_public_key_hex ? (
                          <div className="flex items-center gap-1 text-emerald-600" title="BLS key registered">
                            <CheckCircle size={16} strokeWidth={2} />
                            <span className="text-xs font-medium">BLS</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-gray-400" title="BLS key missing">
                            <XCircle size={16} strokeWidth={2} />
                            <span className="text-xs font-medium">BLS</span>
                          </div>
                        )}
                        {validator.ed25519_public_key_hex ? (
                          <div className="flex items-center gap-1 text-emerald-600 ml-2" title="Ed25519 key registered">
                            <CheckCircle size={16} strokeWidth={2} />
                            <span className="text-xs font-medium">Ed</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-gray-400 ml-2" title="Ed25519 key missing">
                            <XCircle size={16} strokeWidth={2} />
                            <span className="text-xs font-medium">Ed</span>
                          </div>
                        )}
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {formatBalance(validator.stake).full} RAIN
                      </div>
                      <div className="font-medium text-gray-700 text-sm">
                        {validator.blocks_produced || 0}
                      </div>
                      <div className="font-medium text-gray-700 text-sm">
                        {validator.missed_blocks || 0}
                      </div>
                      <div className="font-semibold text-emerald-600 text-sm">
                        {formatBalance(validator.total_rewards || 0).full} RAIN
                      </div>
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                <Shield className="mx-auto mb-2 text-gray-300" size={32} strokeWidth={1.5} />
                <p className="text-sm">No active validators</p>
              </div>
            )}
          </div>
        </div>

        {/* Jailed Validators */}
        {jailedValidators.length > 0 && (
          <div className="bg-white rounded border border-red-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-red-200 bg-red-50">
              <h2 className="text-base font-semibold text-red-900">Jailed Validators</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {jailedValidators.map((validator: ValidatorInfo) => (
                <Link
                  key={validator.address}
                  href={'/account/' + validator.address}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors block"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0">
                      <Avatar address={validator.address} avatarUrl={validator.avatar_url} size={40} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">
                        {validator.nickname || formatHash(validator.address, 8, 6)}
                      </div>
                      <div className="text-xs text-gray-500 font-mono truncate">{formatHash(validator.address, 8, 6)}</div>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold flex-shrink-0">
                      Jailed
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Slash Appeals */}
        {appeals && appeals.length > 0 && (
          <div className="bg-white rounded border border-orange-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-orange-200 bg-orange-50 flex items-center gap-2">
              <Scale className="text-orange-700" size={20} strokeWidth={2} />
              <h2 className="text-base font-semibold text-orange-900">Pending Slash Appeals</h2>
              <span className="ml-auto px-2 py-1 bg-orange-200 text-orange-900 rounded text-xs font-semibold">
                {appeals.length}
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {appeals.map((appeal: SlashAppeal) => {
                const eventType = appeal.slashing_event.DoubleSign ? 'Double Sign' :
                                 appeal.slashing_event.OfflineValidator ? 'Offline' :
                                 appeal.slashing_event.InvalidBlock ? 'Invalid Block' : 'Unknown';

                const statusColor = {
                  'Pending': 'bg-yellow-100 text-yellow-800',
                  'UnderReview': 'bg-blue-100 text-blue-800',
                  'Approved': 'bg-green-100 text-green-800',
                  'Rejected': 'bg-red-100 text-red-800'
                }[appeal.status] || 'bg-gray-100 text-gray-800';

                const totalVotes = appeal.votes_for + appeal.votes_against;
                const approvalPercent = totalVotes > 0 ? Math.round((appeal.votes_for / totalVotes) * 100) : 0;

                return (
                  <div key={appeal.appeal_id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Avatar address={appeal.validator_address} size={40} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Link
                            href={'/account/' + appeal.validator_address}
                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {formatHash(appeal.validator_address, 8, 6)}
                          </Link>
                          <span className={'px-2 py-0.5 rounded text-xs font-semibold ' + statusColor}>
                            {appeal.status}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                            {eventType}
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-medium">Reason:</span> {appeal.reason}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                          <div>
                            <span className="font-medium text-red-600">Slashed:</span>{' '}
                            {formatBalance(appeal.slashed_amount).full} RAIN
                          </div>
                          <div>
                            <span className="font-medium">Votes:</span>{' '}
                            {appeal.voters.length} validators
                          </div>
                          {totalVotes > 0 && (
                            <div>
                              <span className="font-medium text-green-600">Approval:</span>{' '}
                              {approvalPercent}% ({formatBalance(appeal.votes_for).full} / {formatBalance(totalVotes).full} RAIN)
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Submitted:</span>{' '}
                            {new Date(appeal.submitted_timestamp * 1000).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <AlertTriangle className="text-orange-600" size={24} strokeWidth={2} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
