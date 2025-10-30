'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useQuery } from '@tanstack/react-query'
import { Trophy, TrendingUp, Users, Zap } from 'lucide-react'

export default function LeaderboardPage() {
  const { data: validators } = useQuery({
    queryKey: ['validators'],
    queryFn: () => fetch('/api/blockchain/validators').then(r => r.json()),
    refetchInterval: 10000,
  })

  const validatorArray = Array.isArray(validators) ? validators : []
  const sortedByStake = [...validatorArray].sort((a, b) => (b.staked_amount || 0) - (a.staked_amount || 0))
  const sortedByRewards = [...validatorArray].sort((a, b) => (b.total_rewards || 0) - (a.total_rewards || 0))

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="text-yellow-500" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          </div>
          <p className="text-gray-600">Top performers on Rainum Network</p>
        </div>

        {/* Top Validators by Stake */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="text-purple-600" size={20} />
            Top Validators by Stake
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Validator</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Stake</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Tier</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total Rewards</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedByStake.slice(0, 10).map((validator, index) => (
                  <tr key={validator.address} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {index === 0 && <span className="text-2xl">🥇</span>}
                        {index === 1 && <span className="text-2xl">🥈</span>}
                        {index === 2 && <span className="text-2xl">🥉</span>}
                        {index > 2 && <span className="text-gray-600 font-semibold">#{index + 1}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {validator.nickname || `${validator.address.substring(0, 10)}...`}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">{validator.address.substring(0, 16)}...</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-gray-900">{(validator.staked_amount || 0).toLocaleString()} RAIN</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        validator.tier === 3 ? 'bg-purple-100 text-purple-800' :
                        validator.tier === 2 ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        Tier {validator.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-semibold text-green-600">{(validator.total_rewards || 0).toLocaleString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top by Rewards */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-600" size={20} />
            Top Validators by Total Rewards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sortedByRewards.slice(0, 3).map((validator, index) => (
              <div key={validator.address} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  {index === 0 && <span className="text-3xl">🥇</span>}
                  {index === 1 && <span className="text-3xl">🥈</span>}
                  {index === 2 && <span className="text-3xl">🥉</span>}
                  <div>
                    <div className="font-bold text-gray-900">{validator.nickname || 'Anonymous'}</div>
                    <div className="text-xs text-gray-500">Tier {validator.tier}</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">{(validator.total_rewards || 0).toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Rewards</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
