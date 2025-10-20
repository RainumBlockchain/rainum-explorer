'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useQuery } from '@tanstack/react-query'
import { getBlocks, getValidators, type Block } from '@/lib/api/rainum-api'
import { Blocks, Clock } from 'lucide-react'
import Link from 'next/link'
import { Avatar } from '@/components/shared/Avatar'
import { formatHash, formatTimeAgo } from '@/lib/utils/format'
import { useMemo } from 'react'

export default function BlocksListPage() {
  const { data: blocks, isLoading } = useQuery({
    queryKey: ['blocks', 'all'],
    queryFn: () => getBlocks({ limit: 50 }),
    refetchInterval: 5000,
  })

  const { data: validators } = useQuery({
    queryKey: ['validators'],
    queryFn: () => getValidators(),
  })

  // Create validator lookup map for O(1) access
  const validatorMap = useMemo(() => {
    if (!validators) return new Map()
    return new Map(validators.map(v => [v.address.toLowerCase(), v]))
  }, [validators])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blocks</h1>
          <p className="text-gray-600">Recent blocks on the Rainum blockchain</p>
        </div>

        <div className="bg-white rounded border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">All Blocks</h2>
              {blocks && (
                <span className="text-sm font-medium text-gray-600">{blocks.length} blocks</span>
              )}
            </div>
          </div>

          {/* Table Header */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 hidden md:grid md:grid-cols-5 gap-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">
            <div>Block</div>
            <div>Age</div>
            <div>Transactions</div>
            <div>Validator</div>
            <div>Hash</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="px-6 py-4 animate-pulse">
                  <div className="hidden md:grid md:grid-cols-5 gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded"></div>
                      <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-3 w-20 bg-gray-100 rounded"></div>
                    <div className="h-4 w-10 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-100 rounded"></div>
                    <div className="h-3 w-32 bg-gray-100 rounded"></div>
                  </div>
                  <div className="md:hidden space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        <div className="h-4 w-10 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-3 w-16 bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-3 w-40 bg-gray-100 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : blocks && blocks.length > 0 ? (
              blocks.map((block: Block) => {
                const validator = validatorMap.get(block.validator.toLowerCase())

                return (
                <Link
                  key={block.id}
                  href={'/block/' + block.hash}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors block"
                >
                  {/* Mobile Layout */}
                  <div className="md:hidden space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <Blocks className="text-gray-600" size={14} strokeWidth={2} />
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">#{block.id}</span>
                      </div>
                      <span className="text-xs text-gray-500">{formatTimeAgo(block.timestamp)}</span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      Hash: {formatHash(block.hash, 8, 6)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        {block.transaction_count || 0} txs
                      </div>
                      {validator && (
                        <div className="flex items-center gap-1.5">
                          <Avatar address={block.validator} avatarUrl={validator.avatar_url} size={16} />
                          <span className="text-xs text-gray-600">{validator.nickname || formatHash(block.validator, 6, 4)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-5 gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <Blocks className="text-gray-600" size={16} strokeWidth={2} />
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">#{block.id}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Clock size={12} strokeWidth={2} />
                      <span className="text-sm">{formatTimeAgo(block.timestamp)}</span>
                    </div>
                    <div className="text-gray-900 font-medium text-sm">
                      {block.transaction_count || 0} txs
                    </div>
                    <div className="flex items-center gap-2">
                      {validator ? (
                        <>
                          <Avatar address={block.validator} avatarUrl={validator.avatar_url} size={20} />
                          <span className="text-sm font-medium text-gray-900">{validator.nickname || formatHash(block.validator, 8, 6)}</span>
                        </>
                      ) : (
                        <span className="text-sm font-mono text-gray-600">{formatHash(block.validator, 8, 6)}</span>
                      )}
                    </div>
                    <div className="text-sm font-mono text-gray-500">
                      {formatHash(block.hash, 10, 8)}
                    </div>
                  </div>
                </Link>
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
      </main>

      <Footer />
    </div>
  )
}
