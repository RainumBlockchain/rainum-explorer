'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useQuery } from '@tanstack/react-query'
import { getContracts, type Contract } from '@/lib/api/rainum-api'
import { FileCode, Search, CheckCircle, AlertCircle, Filter, Info, X, Code2, Blocks, Activity } from 'lucide-react'
import Link from 'next/link'
import { formatHash } from '@/lib/utils/format'
import { Avatar } from '@/components/shared/Avatar'
import { useState, useEffect } from 'react'

type VMFilter = 'all' | 'evm' | 'move'

export default function ContractsListPage() {
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [vmFilter, setVmFilter] = useState<VMFilter>('all')
  const [isVMInfoOpen, setIsVMInfoOpen] = useState(false)
  const [isVerificationInfoOpen, setIsVerificationInfoOpen] = useState(false)
  const [hoveredAddress, setHoveredAddress] = useState<string | null>(null)
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null)

  // Update time every second for live age countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Close modals on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVMInfoOpen(false)
        setIsVerificationInfoOpen(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const getAge = (timestamp: number) => {
    // Handle both nanoseconds and seconds timestamps
    // If timestamp > 10 billion, it's nanoseconds - convert to seconds
    const timestampSec = timestamp > 10_000_000_000
      ? Math.floor(timestamp / 1_000_000_000)
      : timestamp

    const seconds = Math.floor((currentTime / 1000) - timestampSec)
    if (seconds < 0) return '0s' // Handle future timestamps
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

  // Detect VM type from address
  const getVMType = (address: string): 'EVM' | 'Move' => {
    // Move addresses contain "::" (module format: 0x...::ModuleName)
    if (address.includes('::')) return 'Move'
    return 'EVM'
  }

  // Filter contracts by VM type
  const filteredContracts = contracts?.filter(contract => {
    if (vmFilter === 'all') return true
    const vmType = getVMType(contract.address)
    return vmFilter === 'evm' ? vmType === 'EVM' : vmType === 'Move'
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
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

          {/* VM Filter */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">Filter by VM:</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setVmFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  vmFilter === 'all'
                    ? 'bg-[#0019ff] text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                All ({contracts?.length || 0})
              </button>
              <button
                onClick={() => setVmFilter('evm')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  vmFilter === 'evm'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                EVM ({contracts?.filter(c => !c.address.includes('::')).length || 0})
              </button>
              <button
                onClick={() => setVmFilter('move')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  vmFilter === 'move'
                    ? 'bg-fuchsia-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                Move ({contracts?.filter(c => c.address.includes('::')).length || 0})
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                {vmFilter === 'all' ? 'All Contracts' : vmFilter === 'evm' ? 'EVM Contracts' : 'Move Modules'}
              </h2>
              {filteredContracts && (
                <span className="text-sm font-medium text-gray-600">{filteredContracts.length} contracts</span>
              )}
            </div>
          </div>

          {/* Table Header */}
          <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-[100px_320px_220px_140px_100px_minmax(200px,1fr)_140px_150px] gap-6 text-base font-bold text-gray-700 uppercase tracking-wide">
              <div>Block</div>
              <div>Contract Address</div>
              <div>Deployer</div>
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
              <div>Name</div>
              <div className="text-center">TX Count</div>
              <div className="text-center flex items-center justify-center gap-1">
                <span>Status</span>
                <button
                  onClick={() => setIsVerificationInfoOpen(true)}
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full text-gray-500 hover:text-[#0019ff] hover:bg-gray-200 transition-all"
                  title="What is contract verification?"
                >
                  <Info size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="px-6 py-5 animate-pulse border-t border-gray-200">
                  <div className="grid grid-cols-[100px_320px_220px_140px_100px_minmax(200px,1fr)_140px_150px] gap-6 items-center">
                    <div className="h-3 w-12 bg-gray-100 rounded"></div>
                    <div className="h-3 w-32 bg-gray-100 rounded"></div>
                    <div className="h-3 w-32 bg-gray-100 rounded"></div>
                    <div className="h-3 w-16 bg-gray-100 rounded"></div>
                    <div className="h-5 w-12 bg-gray-100 rounded"></div>
                    <div className="h-3 w-40 bg-gray-100 rounded"></div>
                    <div className="h-3 w-12 bg-gray-100 rounded mx-auto"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded mx-auto"></div>
                  </div>
                </div>
              ))
            ) : filteredContracts && filteredContracts.length > 0 ? (
              filteredContracts.map((contract: Contract, index: number) => {
                const ageText = getAge(contract.deployed_at)
                const vmType = getVMType(contract.address)
                const blockNum = (contract as any).block_id || '...'
                const txCount = (contract as any).transaction_count || 0

                // Extract module name for Move contracts
                const displayName = contract.address.includes('::')
                  ? contract.address.split('::')[1] // "Counter2" from "0x1::Counter2"
                  : contract.contract_name || 'Unnamed Contract'

                return (
                <div
                  key={`${contract.address}-${index}`}
                  className="px-6 py-5 transition-all hover:bg-blue-50/50 border-t border-gray-200 group"
                >
                  <div className="grid grid-cols-[100px_320px_220px_140px_100px_minmax(200px,1fr)_140px_150px] gap-6 items-center">
                    {/* Block */}
                    <div>
                      {blockNum !== '...' ? (
                        <Link href={'/block/' + blockNum}>
                          <span className="text-base font-black text-[#0019ff] hover:text-[#0014cc] transition-colors">
                            {blockNum}
                          </span>
                        </Link>
                      ) : (
                        <span className="text-base font-semibold text-gray-400">...</span>
                      )}
                    </div>

                    {/* Contract Address */}
                    <Link
                      href={'/contract/' + contract.address}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded"
                      style={{
                        backgroundColor: hoveredAddress?.toLowerCase() === contract.address.toLowerCase() ? '#fef3e7' : 'transparent',
                        outline: hoveredAddress?.toLowerCase() === contract.address.toLowerCase() ? '2px dashed #f39c12' : 'none',
                        outlineOffset: '-2px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transitionDelay: hoveredAddress?.toLowerCase() === contract.address.toLowerCase() ? '0.25s' : '0s'
                      }}
                      onMouseEnter={() => setHoveredAddress(contract.address)}
                      onMouseLeave={() => setHoveredAddress(null)}
                    >
                      <Code2 size={18} className="text-gray-500 flex-shrink-0" strokeWidth={2} />
                      <span className="font-mono text-base font-semibold text-gray-700 hover:text-[#0019ff] transition-colors">
                        {contract.address.includes('::')
                          ? `${formatHash(contract.address.split('::')[0], 6, 4)}::${contract.address.split('::')[1]}`
                          : formatHash(contract.address, 10, 8)
                        }
                      </span>
                      {hoveredAddress?.toLowerCase() === contract.address.toLowerCase() && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigator.clipboard.writeText(contract.address);
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

                    {/* Deployer */}
                    <Link
                      href={'/account/' + contract.deployer}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded"
                      style={{
                        backgroundColor: hoveredAddress?.toLowerCase() === contract.deployer.toLowerCase() ? '#fef3e7' : 'transparent',
                        outline: hoveredAddress?.toLowerCase() === contract.deployer.toLowerCase() ? '2px dashed #f39c12' : 'none',
                        outlineOffset: '-2px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transitionDelay: hoveredAddress?.toLowerCase() === contract.deployer.toLowerCase() ? '0.25s' : '0s'
                      }}
                      onMouseEnter={() => setHoveredAddress(contract.deployer)}
                      onMouseLeave={() => setHoveredAddress(null)}
                    >
                      <div className="w-6 h-6 rounded overflow-hidden flex-shrink-0">
                        <Avatar address={contract.deployer} avatarUrl={null} size={24} />
                      </div>
                      <span className="font-mono text-base font-semibold text-gray-700">
                        {formatHash(contract.deployer, 8, 6)}
                      </span>
                      {hoveredAddress?.toLowerCase() === contract.deployer.toLowerCase() && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigator.clipboard.writeText(contract.deployer);
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

                    {/* Age */}
                    <span className="text-base text-gray-600 font-semibold">{ageText} ago</span>

                    {/* VM Type */}
                    <div>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-black ${
                        vmType === 'EVM'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-fuchsia-50 text-fuchsia-700'
                      }`}>
                        {vmType}
                      </span>
                    </div>

                    {/* Contract Name */}
                    <div className="flex items-center gap-2">
                      <FileCode size={16} className="text-gray-400 flex-shrink-0" strokeWidth={2} />
                      <span className="text-base font-semibold text-gray-900 truncate">
                        {displayName}
                      </span>
                    </div>

                    {/* TX Count */}
                    <div className="text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded">
                        <Activity size={14} className="text-gray-500" strokeWidth={2} />
                        <span className="text-sm font-bold text-gray-700">{txCount}</span>
                      </div>
                    </div>

                    {/* Verification Status */}
                    <div className="text-center relative">
                      {contract.verified ? (
                        <div
                          className="inline-block"
                          onMouseEnter={() => setHoveredBadge(`verified-${index}`)}
                          onMouseLeave={() => setHoveredBadge(null)}
                        >
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded text-sm font-bold cursor-help">
                            <CheckCircle size={14} strokeWidth={2.5} />
                            Verified
                          </span>
                          {hoveredBadge === `verified-${index}` && (
                            <div className="absolute z-50 left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                              Source code published and verified - Safe to audit
                              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className="inline-block"
                          onMouseEnter={() => setHoveredBadge(`unverified-${index}`)}
                          onMouseLeave={() => setHoveredBadge(null)}
                        >
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded text-sm font-bold cursor-help">
                            <AlertCircle size={14} strokeWidth={2} />
                            Unverified
                          </span>
                          {hoveredBadge === `unverified-${index}` && (
                            <div className="absolute z-50 left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                              Source code not published - Use with caution
                              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                )
              })
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                <FileCode className="mx-auto mb-2 text-gray-300" size={32} strokeWidth={1.5} />
                <p className="text-sm">
                  {vmFilter === 'all'
                    ? 'No contracts deployed yet'
                    : `No ${vmFilter.toUpperCase()} contracts deployed yet`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

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
            </div>
          </div>
        </div>
      )}

      {/* Verification Info Modal */}
      {isVerificationInfoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsVerificationInfoOpen(false)}
        >
          <div
            className="bg-gray-800 rounded-lg max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Contract Verification Status</h2>
              <button
                onClick={() => setIsVerificationInfoOpen(false)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Verified */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                  <CheckCircle className="text-white" size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Verified Contracts</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Source code has been published and matches the deployed bytecode. You can review the code, understand contract functionality, and trust that it does what it claims.
                  </p>
                  <div className="mt-2 text-emerald-400 text-sm font-semibold">
                    ✓ Source code available
                  </div>
                  <div className="text-emerald-400 text-sm font-semibold">
                    ✓ Bytecode matches source
                  </div>
                  <div className="text-emerald-400 text-sm font-semibold">
                    ✓ Auditable and transparent
                  </div>
                </div>
              </div>

              {/* Unverified */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <AlertCircle className="text-gray-300" size={20} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Unverified Contracts</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Source code not published. Contract may still be legitimate, but you cannot review the code before interacting. <span className="text-amber-400 font-semibold">Exercise caution</span> when using unverified contracts.
                  </p>
                  <div className="mt-2 text-gray-400 text-sm">
                    ⚠ Source code unavailable
                  </div>
                  <div className="text-gray-400 text-sm">
                    ⚠ Cannot audit functionality
                  </div>
                  <div className="text-gray-400 text-sm">
                    ⚠ Use at your own risk
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <p className="text-gray-300 text-sm">
                  <span className="font-semibold text-white">Note:</span> Contract deployers can verify their contracts by submitting source code through the verification API or explorer interface.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
