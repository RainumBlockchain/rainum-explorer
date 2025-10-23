'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useQuery } from '@tanstack/react-query'
import { getBlocks, getValidators, type Block } from '@/lib/api/rainum-api'
import { Blocks, Search } from 'lucide-react'
import Link from 'next/link'
import { Avatar } from '@/components/shared/Avatar'
import { RainIcon } from '@/components/shared/RainIcon'
import { formatHash } from '@/lib/utils/format'
import { useMemo, useState, useEffect } from 'react'

export default function BlocksListPage() {
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [hoveredValidator, setHoveredValidator] = useState<string | null>(null)
  const [hoveredBlockHash, setHoveredBlockHash] = useState<string | null>(null)

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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Blocks</h1>
              <p className="text-gray-600">Recent blocks on the Rainum blockchain</p>
            </div>

            {/* Search Button */}
            <button
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
              <h2 className="text-base font-semibold text-gray-900">All Blocks</h2>
              {blocks && (
                <span className="text-sm font-medium text-gray-600">{blocks.length} blocks</span>
              )}
            </div>
          </div>

          {/* Table Header */}
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

          {/* Table Body */}
          <div>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="px-6 py-5 animate-pulse border-t border-gray-200">
                  <div className="grid grid-cols-10 gap-4 items-center">
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    <div className="col-span-2 h-3 w-32 bg-gray-100 rounded"></div>
                    <div className="h-3 w-20 bg-gray-100 rounded"></div>
                    <div className="h-4 w-10 bg-gray-200 rounded mx-auto"></div>
                    <div className="h-3 w-16 bg-gray-100 rounded ml-auto"></div>
                    <div className="h-3 w-12 bg-gray-100 rounded ml-auto"></div>
                    <div className="h-4 w-10 bg-gray-200 rounded mx-auto"></div>
                    <div className="col-span-2 h-3 w-32 bg-gray-100 rounded ml-auto"></div>
                  </div>
                </div>
              ))
            ) : blocks && blocks.length > 0 ? (
              blocks.map((block: Block, index: number) => {
                const validator = validatorMap.get(block.validator.toLowerCase())
                const ageText = getAge(block.timestamp)
                const gasUsed = (block.transaction_count || 0) * 21000
                const reward = (block as any).validator_tier === 3 ? 30 : (block as any).validator_tier === 2 ? 20 : 10
                const shardId = block.id % 16

                return (
                <div
                  key={`${block.id}-${index}`}
                  className="px-6 py-5 transition-all hover:bg-blue-50/50 border-t border-gray-200 group"
                >
                  <div className="grid grid-cols-10 gap-4 items-center">
                    {/* Block Number */}
                    <Link href={'/block/' + block.hash}>
                      <span className="font-black text-[#0019ff] hover:text-[#0014cc] transition-colors text-lg">
                        #{block.id}
                      </span>
                    </Link>

                    {/* Block Hash */}
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
                      {hoveredBlockHash !== block.hash && (
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
                    <div className="text-right text-base text-gray-700 font-bold flex items-center justify-end gap-1">
                      <RainIcon size={16} className="flex-shrink-0" />
                      <span className="whitespace-nowrap">{gasUsed > 0 ? `${(gasUsed / 1000).toFixed(1)}K` : '0'}</span>
                    </div>

                    {/* Reward */}
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-base font-black text-amber-600">
                        <RainIcon size={16} className="flex-shrink-0" />
                        <span className="whitespace-nowrap">+{reward}</span>
                      </div>
                    </div>

                    {/* Shard */}
                    <div className="text-center">
                      <span className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded text-base font-black">
                        S{shardId}
                      </span>
                    </div>

                    {/* Validator */}
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
                      {hoveredValidator?.toLowerCase() !== block.validator.toLowerCase() && (
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
      </main>

      <Footer />
    </div>
  )
}
