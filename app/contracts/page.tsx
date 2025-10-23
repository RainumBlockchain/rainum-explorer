'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useQuery } from '@tanstack/react-query'
import { getContracts, type Contract } from '@/lib/api/rainum-api'
import { FileCode, Search, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { formatHash } from '@/lib/utils/format'
import { useState, useEffect } from 'react'

export default function ContractsListPage() {
  const [currentTime, setCurrentTime] = useState(Date.now())

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

  const { data: contracts, isLoading } = useQuery({
    queryKey: ['contracts', 'all'],
    queryFn: () => getContracts(),
    refetchInterval: 10000,
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Contracts</h1>
              <p className="text-gray-600">Deployed contracts on the Rainum blockchain</p>
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
              <h2 className="text-base font-semibold text-gray-900">All Contracts</h2>
              {contracts && (
                <span className="text-sm font-medium text-gray-600">{contracts.length} contracts</span>
              )}
            </div>
          </div>

          {/* Table Header */}
          <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-[200px_200px_140px_1fr_120px] gap-4 text-base font-bold text-gray-700 uppercase tracking-wide">
              <div>Contract Address</div>
              <div>Deployer</div>
              <div>Age</div>
              <div>Name</div>
              <div className="text-center">Status</div>
            </div>
          </div>

          {/* Table Body */}
          <div>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="px-6 py-5 animate-pulse border-t border-gray-200">
                  <div className="grid grid-cols-[200px_200px_140px_1fr_120px] gap-4 items-center">
                    <div className="h-3 w-32 bg-gray-100 rounded"></div>
                    <div className="h-3 w-32 bg-gray-100 rounded"></div>
                    <div className="h-3 w-20 bg-gray-100 rounded"></div>
                    <div className="h-3 w-40 bg-gray-100 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded mx-auto"></div>
                  </div>
                </div>
              ))
            ) : contracts && contracts.length > 0 ? (
              contracts.map((contract: Contract, index: number) => {
                const ageText = getAge(contract.deployed_at)

                return (
                <div
                  key={`${contract.address}-${index}`}
                  className="px-6 py-5 transition-all hover:bg-blue-50/50 border-t border-gray-200 group"
                >
                  <div className="grid grid-cols-[200px_200px_140px_1fr_120px] gap-4 items-center">
                    {/* Contract Address */}
                    <Link href={'/contract/' + contract.address}>
                      <span className="font-mono text-base font-semibold text-gray-700 hover:text-[#0019ff] transition-colors">
                        {formatHash(contract.address, 10, 8)}
                      </span>
                    </Link>

                    {/* Deployer */}
                    <Link href={'/account/' + contract.deployer}>
                      <span className="font-mono text-base text-gray-600 hover:text-[#0019ff] transition-colors">
                        {formatHash(contract.deployer, 10, 8)}
                      </span>
                    </Link>

                    {/* Age */}
                    <span className="text-base text-gray-600 font-semibold">{ageText} ago</span>

                    {/* Contract Name */}
                    <span className="text-base font-semibold text-gray-900">
                      {contract.contract_name || 'Unnamed Contract'}
                    </span>

                    {/* Verification Status */}
                    <div className="text-center">
                      {contract.verified ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded text-sm font-bold">
                          <CheckCircle size={14} strokeWidth={2.5} />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded text-sm font-bold">
                          <AlertCircle size={14} strokeWidth={2} />
                          Unverified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                )
              })
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                <FileCode className="mx-auto mb-2 text-gray-300" size={32} strokeWidth={1.5} />
                <p className="text-sm">No contracts deployed yet</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
