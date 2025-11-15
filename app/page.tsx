'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useQuery } from '@tanstack/react-query'
import { getStatus, getBlocks, getTransactions, getValidators, getTotalSupply, type Block, type Transaction, type ValidatorInfo } from '@/lib/api/rainum-api'
import { Blocks, Activity, Users, TrendingUp, ArrowRight, ArrowRightLeft, ShieldCheck, Coins, Search, Zap, Lock, ExternalLink, Info, X, ChevronLeft, ChevronRight, Rocket, Code } from 'lucide-react'
import Link from 'next/link'
import { Avatar } from '@/components/shared/Avatar'
import { PrivacyBadge } from '@/components/shared/PrivacyBadge'
import { RainIcon } from '@/components/shared/RainIcon'
import { formatHash, formatNumber } from '@/lib/utils/format'
import { formatBalance } from '@/lib/utils/format-balance'
import { getAddressColor } from '@/lib/utils/color-hash'
import { useState, useEffect } from 'react'

export default function Home() {
  const [hoveredValidator, setHoveredValidator] = useState<string | null>(null)
  const [hoveredAddress, setHoveredAddress] = useState<string | null>(null)
  const [hoveredBlockHash, setHoveredBlockHash] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'blocks' | 'transactions'>('transactions')
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [isVMInfoOpen, setIsVMInfoOpen] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)

  // Update time every second for live age countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsVMInfoOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Auto-rotate slides every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3)
    }, 30000)
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
  const { data: status } = useQuery({
    queryKey: ['status'],
    queryFn: getStatus,
    refetchInterval: 10000,
  })

  const { data: blocks, isLoading: blocksLoading } = useQuery({
    queryKey: ['blocks', 'latest'],
    queryFn: () => getBlocks({ limit: 10 }),
    refetchInterval: 5000,
  })

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions', 'latest'],
    queryFn: () => getTransactions({ limit: 10 }),
    refetchInterval: 3000,
  })

  const { data: validators } = useQuery({
    queryKey: ['validators'],
    queryFn: () => getValidators(),
  })

  const { data: totalSupply } = useQuery({
    queryKey: ['totalSupply'],
    queryFn: getTotalSupply,
    refetchInterval: 10000,
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Section with Features and Ad Space */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          {/* Left Side - Explorer Features */}
          <div className="bg-[#0019ff] rounded border-4 border-white p-10 relative overflow-hidden group hover:shadow-[0_20px_60px_rgba(0,25,255,0.4)] transition-all duration-300">
            {/* White stripe with animated border */}
            <div className="absolute top-0 left-0 w-full h-2 bg-white">
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400" style={{animation: 'slide-right 3s ease-in-out infinite'}}></div>
            </div>

            {/* Decorative corner accents */}
            <div className="absolute top-2 left-2 w-16 h-16 bg-white/10 rounded"></div>
            <div className="absolute bottom-2 right-2 w-12 h-12 bg-emerald-400/20 rounded"></div>

            <style jsx>{`
              @keyframes slide-right {
                0% { transform: translateX(-100%); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: translateX(100%); opacity: 0; }
              }
            `}</style>

            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded mb-6 shadow-lg">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-black text-[#0019ff] uppercase tracking-wider">Live Network</span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl font-normal text-white mb-3 leading-tight">
                Explore Rainum Blockchain
              </h1>

              {/* Subtitle with Dual-VM highlight */}
              <p className="text-blue-100 mb-8 text-base leading-relaxed">
                The world's first <span className="text-white font-bold bg-white/20 px-2 py-0.5 rounded">EVM + Move</span> dual-VM blockchain explorer with real-time data and zero-knowledge privacy.
              </p>

              {/* Feature Grid - 1x4 (single row) */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {/* Dual-VM Support */}
                <div className="bg-white/95 backdrop-blur-sm rounded p-3 border-2 border-transparent hover:border-[#0019ff]/30 transition-all duration-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 bg-[#0019ff] rounded flex items-center justify-center flex-shrink-0">
                      <ArrowRightLeft className="text-white" size={16} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-black text-gray-900 text-xs">Dual-VM Support</h3>
                  </div>
                  <p className="text-[10px] text-gray-600 leading-tight">Execute EVM and Move smart contracts on one chain</p>
                </div>

                {/* ZKP Privacy */}
                <div className="bg-white/95 backdrop-blur-sm rounded p-3 border-2 border-transparent hover:border-[#0019ff]/30 transition-all duration-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center flex-shrink-0">
                      <Lock className="text-white" size={16} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-black text-gray-900 text-xs">ZKP Privacy</h3>
                  </div>
                  <p className="text-[10px] text-gray-600 leading-tight">Zero-knowledge proofs for confidential transactions</p>
                </div>

                {/* Real-Time Data */}
                <div className="bg-white/95 backdrop-blur-sm rounded p-3 border-2 border-transparent hover:border-[#0019ff]/30 transition-all duration-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 bg-[#0019ff] rounded flex items-center justify-center flex-shrink-0">
                      <Zap className="text-white" size={16} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-black text-gray-900 text-xs">Real-Time Data</h3>
                  </div>
                  <p className="text-[10px] text-gray-600 leading-tight">Live updates every few seconds with instant sync</p>
                </div>

                {/* Cross-VM Calls */}
                <div className="bg-white/95 backdrop-blur-sm rounded p-3 border-2 border-transparent hover:border-[#0019ff]/30 transition-all duration-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center flex-shrink-0">
                      <Activity className="text-white" size={16} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-black text-gray-900 text-xs">Cross-VM Calls</h3>
                  </div>
                  <p className="text-[10px] text-gray-600 leading-tight">Seamless interoperability between EVM and Move</p>
                </div>
              </div>

              {/* Live Stats - Bento Box Layout */}
              <div className="grid grid-cols-8 grid-rows-2 gap-3">
                {/* Last Block - Spans 2 cols, 2 rows (tall card) */}
                <div className="col-span-2 row-span-2 relative overflow-hidden bg-black rounded p-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group border border-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0019ff]/10 to-[#0019ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-auto">
                      <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center backdrop-blur-sm">
                        <Blocks className="text-white" size={24} strokeWidth={2.5} />
                      </div>
                      <div className="w-2 h-2 bg-[#0019ff] rounded-full animate-pulse"></div>
                    </div>

                    <div className="mt-auto">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Last Block</div>
                      <div className="text-5xl font-black text-white leading-none mb-2">
                        {blocks && blocks.length > 0 ? `${Math.floor(Date.now() / 1000 - blocks[0]?.timestamp)}` : '...'}
                      </div>
                      <div className="text-sm font-semibold text-gray-400">seconds ago</div>

                      {/* Progress bar - fills to 100% based on actual average block time */}
                      <div className="mt-4 h-1.5 bg-white/10 rounded overflow-hidden">
                        <div
                          className="h-full bg-[#0019ff] rounded transition-all duration-1000 ease-linear"
                          style={{
                            width: (() => {
                              if (!blocks || blocks.length < 2) return '0%';

                              // Calculate average block time from last 10 blocks
                              const recentBlocks = blocks.slice(0, Math.min(10, blocks.length));
                              let totalTimeDiff = 0;
                              for (let i = 0; i < recentBlocks.length - 1; i++) {
                                totalTimeDiff += recentBlocks[i].timestamp - recentBlocks[i + 1].timestamp;
                              }
                              const avgBlockTime = totalTimeDiff / (recentBlocks.length - 1);

                              // Calculate progress based on time since last block
                              const timeSinceLastBlock = Date.now() / 1000 - blocks[0].timestamp;
                              const progress = Math.min((timeSinceLastBlock / avgBlockTime) * 100, 100);

                              return `${progress}%`;
                            })()
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current TPS - Spans 3 cols, 1 row (wide card) */}
                <div className="col-span-3 row-span-1 relative overflow-hidden bg-white border-2 border-gray-200 rounded p-6 shadow-lg hover:shadow-xl hover:border-[#0019ff] transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center group-hover:bg-[#0019ff] group-hover:scale-110 transition-all">
                          <Zap className="text-gray-700 group-hover:text-white transition-colors" size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Network Speed</span>
                      </div>
                      <div className="text-4xl font-black text-gray-900 leading-none">
                        {status?.tps ? status.tps.toFixed(1) : '...'}
                      </div>
                      <div className="text-sm font-semibold text-gray-500 mt-1">transactions/sec</div>
                    </div>

                    {/* Mini sparkline chart */}
                    <div className="flex items-end gap-1 h-16">
                      <div className="w-2 bg-gray-200 rounded-t" style={{height: '40%'}}></div>
                      <div className="w-2 bg-gray-300 rounded-t" style={{height: '60%'}}></div>
                      <div className="w-2 bg-gray-400 rounded-t" style={{height: '80%'}}></div>
                      <div className="w-2 bg-[#0019ff] rounded-t" style={{height: '100%'}}></div>
                      <div className="w-2 bg-gray-400 rounded-t" style={{height: '70%'}}></div>
                      <div className="w-2 bg-gray-300 rounded-t" style={{height: '50%'}}></div>
                    </div>
                  </div>
                </div>

                {/* Online Validators - Spans 3 cols, 1 row */}
                <div className="col-span-3 row-span-1 relative overflow-hidden bg-white border-2 border-gray-200 rounded p-6 shadow-lg hover:shadow-xl hover:border-gray-400 transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center group-hover:bg-gray-900 transition-all">
                          <Users className="text-gray-700 group-hover:text-white transition-colors" size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Validators</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-[#0019ff] rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-gray-600">ONLINE</span>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-4xl font-black text-gray-900 leading-none">
                        {validators?.filter(v => v.active && !v.jailed).length || 0}
                      </div>
                      <div className="text-lg font-semibold text-gray-500">/ {validators?.length || 0}</div>
                    </div>
                    <div className="text-sm font-semibold text-gray-500 mt-1">active nodes</div>
                  </div>
                </div>

                {/* Total Supply - Spans 3 cols, 1 row (bottom wide card) */}
                <div className="col-span-3 row-span-1 relative overflow-hidden bg-white border-2 border-gray-200 rounded p-6 shadow-lg hover:shadow-xl hover:border-gray-400 transition-all duration-300 group">
                  <div className="absolute top-0 left-0 w-full h-full opacity-5 group-hover:opacity-10 transition-opacity">
                    <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center group-hover:bg-gray-900 group-hover:scale-110 transition-all">
                        <Coins className="text-gray-700 group-hover:text-white transition-colors" size={20} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Supply</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <RainIcon size={24} className="text-[#0019ff]" />
                      <div className="text-4xl font-black text-gray-900 leading-none">
                        {totalSupply ? `${(totalSupply / 1000000000).toFixed(1)}B` : '...'}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-500 mt-1">RAIN tokens</div>
                  </div>
                </div>

                {/* Network Health - Spans 3 cols, 1 row (new card!) */}
                <div className="col-span-3 row-span-1 relative overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white/20 rounded flex items-center justify-center backdrop-blur-sm">
                          <Activity className="text-white" size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-xs font-bold text-white/90 uppercase tracking-wider">Network Health</span>
                      </div>
                      <div className="px-3 py-1 bg-white/20 rounded backdrop-blur-sm">
                        <span className="text-xs font-black text-white">EXCELLENT</span>
                      </div>
                    </div>
                    <div className="text-4xl font-black text-white leading-none mb-2">
                      98.7%
                    </div>
                    <div className="text-sm font-semibold text-white/80">uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Video Only */}
          <div className="bg-black rounded border-4 border-white relative overflow-hidden group hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-300 min-h-[600px]">
            {/* White stripe with animated border */}
            <div className="absolute top-0 left-0 w-full h-2 bg-white z-20">
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400" style={{animation: 'slide-right 3s ease-in-out infinite'}}></div>
            </div>

            {/* Decorative corner accents */}
            <div className="absolute top-2 right-2 w-12 h-12 bg-white/10 rounded z-20"></div>
            <div className="absolute bottom-2 left-2 w-10 h-10 bg-cyan-400/20 rounded z-20"></div>

            <style jsx>{`
              @keyframes slide-right {
                0% { transform: translateX(-100%); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: translateX(100%); opacity: 0; }
              }
            `}</style>

            {/* Video */}
            <video
              className="w-full h-full object-cover absolute inset-0"
              controls
              preload="auto"
              autoPlay
              muted
              loop
            >
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            icon={<Blocks className="text-[#0019ff]" size={20} strokeWidth={2} />}
            title="Block Height"
            value={status?.block_height ? formatNumber(status.block_height) : '...'}
          />
          {/* Narwhal Consensus Badge */}
          {status?.consensus === 'Narwhal-Bullshark' && status?.narwhal && (
            <StatCard
              icon={<Rocket className="text-orange-500" size={20} strokeWidth={2} />}
              title="Narwhal Workers"
              value={`${status.narwhal.worker_count} Active`}
              subtitle={`Round ${status.narwhal.current_round} • ${status.narwhal.total_certificates} certs`}
            />
          )}
          <StatCard
            icon={<Activity className="text-emerald-600" size={20} strokeWidth={2} />}
            title="Transactions Per Second"
            value={status?.tps ? status.tps.toFixed(2) : '...'}
          />
          <StatCard
            icon={<TrendingUp className="text-violet-600" size={20} strokeWidth={2} />}
            title="Total Transactions"
            value={status?.total_transactions ? formatNumber(status.total_transactions) : '...'}
          />
          <StatCard
            icon={<Users className="text-amber-600" size={20} strokeWidth={2} />}
            title="Active Validators"
            value={status?.active_validators ? formatNumber(status.active_validators) : '...'}
          />
          <StatCard
            icon={<Coins className="text-cyan-600" size={20} strokeWidth={2} />}
            title="Total Supply"
            value={totalSupply ? (
              <div className="flex items-center gap-2 w-full overflow-hidden">
                <RainIcon size={20} className="flex-shrink-0" />
                <span className="truncate text-2xl">{formatNumber(totalSupply)} R</span>
              </div>
            ) : '...'}
          />
          </div>
        </div>

        {/* Recent Data - Tabbed View */}
        <div className="w-full">
          <div className="bg-white rounded border border-gray-200 overflow-hidden">
          {/* Tab Headers */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 ${
                  activeTab === 'transactions'
                    ? 'bg-[#0019ff] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Activity size={16} strokeWidth={2} />
                <span className="text-sm font-semibold">Latest Transactions</span>
              </button>
              <button
                onClick={() => setActiveTab('blocks')}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 ${
                  activeTab === 'blocks'
                    ? 'bg-[#0019ff] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Blocks size={16} strokeWidth={2} />
                <span className="text-sm font-semibold">Latest Blocks</span>
              </button>
            </div>
            <Link
              href={activeTab === 'blocks' ? '/blocks' : '/transactions'}
              className="text-[#0019ff] hover:text-[#0014cc] text-sm font-medium flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>

          {/* Blocks Tab Content */}
          {activeTab === 'blocks' && (
          <div>

            {/* Column Headers */}
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

            <div>
              {blocksLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded"></div>
                        <div>
                          <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 w-32 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 w-12 bg-gray-200 rounded mb-2 ml-auto"></div>
                        <div className="h-3 w-16 bg-gray-100 rounded ml-auto"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : blocks && blocks.length > 0 ? (
                blocks.slice(0, 10).map((block: Block) => {
                  const validator = validators?.find((v: ValidatorInfo) => v.address.toLowerCase() === block.validator.toLowerCase())
                  const isSameValidator = hoveredValidator?.toLowerCase() === block.validator.toLowerCase()
                  const ageText = getAge(block.timestamp)
                  const gasUsed = (block.transaction_count || 0) * 21000
                  const reward = block.validator_tier === 3 ? 30 : block.validator_tier === 2 ? 20 : 10
                  const shardId = block.id % 16

                  return (
                  <div
                    key={block.id}
                    className="px-6 py-5 transition-all hover:bg-blue-50/50 border-t border-gray-200 group"
                  >
                    <div className="grid grid-cols-10 gap-4 items-center">
                      {/* Block Number */}
                      <Link href={'/block/' + block.hash}>
                        <span className="font-black text-[#0019ff] hover:text-[#0014cc] transition-colors text-lg">
                          #{block.id}
                        </span>
                      </Link>

                      {/* Block Hash (halvt) */}
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

                      {/* Validator (med avatar + badge + copy icon inside) */}
                      <div className="col-span-2 flex justify-end items-center">
                        <Link
                          href={'/account/' + block.validator}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200"
                          style={{
                            borderRadius: '4px',
                            outline: hoveredValidator?.toLowerCase() === block.validator.toLowerCase() ? '2px dashed #f39c12' : 'none',
                            outlineOffset: hoveredValidator?.toLowerCase() === block.validator.toLowerCase() ? '2px' : '0',
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
                          <span className="font-mono text-base font-bold text-amber-700">
                            {formatHash(block.validator, 8, 6)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigator.clipboard.writeText(block.validator);
                            }}
                            className="inline-flex items-center justify-center w-5 h-5 rounded bg-amber-100 hover:bg-[#f39c12] hover:text-white text-amber-600 transition-colors"
                            title="Copy full address"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                          </button>
                        </Link>
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
          )}

          {/* Transactions Tab Content */}
          {activeTab === 'transactions' && (
          <div>

            {/* Column Headers */}
            <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-[100px_220px_100px_80px_100px_1fr_1fr_200px_130px] gap-4 text-base font-bold text-gray-700 uppercase tracking-wide">
                <div>Block</div>
                <div>TX Hash</div>
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
                <div>Type</div>
                <div>From</div>
                <div>To</div>
                <div className="text-right">Amount</div>
                <div className="text-center">Status</div>
              </div>
            </div>

            <div>
              {transactionsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 animate-pulse">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      <div className="h-3 w-20 bg-gray-100 rounded"></div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-28 bg-gray-200 rounded"></div>
                      <div className="h-3 w-3 bg-gray-100 rounded"></div>
                      <div className="h-6 w-28 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-5 w-16 bg-emerald-100 rounded"></div>
                    </div>
                  </div>
                ))
              ) : transactions && transactions.length > 0 ? (
                transactions.slice(0, 10).map((tx: Transaction, index: number) => {
                  const isPrivate = tx.zkp_enabled && tx.privacy_level === 'full'
                  const ageText = getAge(tx.timestamp)

                  // Determine VM type and transaction type
                  const vmType = (tx as any).vm_type || 'EVM'
                  const txTypeRaw = (tx as any).tx_type || 'Transfer'

                  // Map backend tx_type to display string
                  const txType = txTypeRaw === 'ContractDeployment' ? 'Smart Contract'
                    : txTypeRaw === 'ContractCall' ? 'Contract Call'
                    : tx.to ? 'Transfer' : 'Contract'

                  // Extract block number from block_hash if available
                  const blockNumber = (tx as any).block_id || (tx as any).block_number || '...'

                  return (
                  <div
                    key={`${tx.hash}-${index}`}
                    className="px-6 py-5 transition-all hover:bg-blue-50/50 border-t border-gray-200 group"
                  >
                    <div className="grid grid-cols-[100px_220px_100px_80px_100px_1fr_1fr_200px_130px] gap-4 items-center">
                      {/* Block */}
                      <div>
                        {blockNumber !== '...' ? (
                          <Link href={'/block/' + blockNumber}>
                            <span className="text-base font-black text-[#0019ff] hover:text-[#0014cc] transition-colors">
                              {blockNumber}
                            </span>
                          </Link>
                        ) : (
                          <span className="text-base font-semibold text-gray-400">...</span>
                        )}
                      </div>

                      {/* TX Hash */}
                      <Link href={'/transaction/' + tx.hash}>
                        <span className="font-mono text-base font-semibold text-gray-700 hover:text-[#0019ff] transition-colors">
                          {formatHash(tx.hash, 10, 8)}
                        </span>
                      </Link>

                      {/* Age */}
                      <span className="text-base text-gray-600 font-semibold">{ageText} ago</span>

                      {/* VM Type */}
                      <div>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-black ${
                          vmType === 'EVM'
                            ? 'bg-blue-50 text-blue-700'
                            : vmType === 'Move'
                            ? 'bg-fuchsia-50 text-fuchsia-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {vmType.toUpperCase()}
                        </span>
                      </div>

                      {/* Type */}
                      <div>
                        <span className="text-sm font-semibold text-gray-600">
                          {txType}
                        </span>
                      </div>

                      {/* From */}
                      <div>
                        {isPrivate ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded">
                            <ShieldCheck className="text-purple-600" size={18} strokeWidth={2} />
                            <span className="text-base font-semibold text-purple-700">Private</span>
                          </div>
                        ) : (
                          <Link
                            href={'/account/' + tx.from}
                            className="inline-flex items-center gap-2 px-2 py-1 rounded"
                            style={{
                              backgroundColor: hoveredAddress?.toLowerCase() === tx.from.toLowerCase() ? '#fef3e7' : 'transparent',
                              outline: hoveredAddress?.toLowerCase() === tx.from.toLowerCase() ? '2px dashed #f39c12' : 'none',
                              outlineOffset: '-2px',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              transitionDelay: hoveredAddress?.toLowerCase() === tx.from.toLowerCase() ? '0.25s' : '0s'
                            }}
                            onMouseEnter={() => setHoveredAddress(tx.from)}
                            onMouseLeave={() => setHoveredAddress(null)}
                          >
                            <div className="w-6 h-6 rounded overflow-hidden flex-shrink-0">
                              <Avatar address={tx.from} avatarUrl={null} size={24} />
                            </div>
                            <span className="font-mono text-base font-semibold text-gray-700">{formatHash(tx.from, 8, 6)}</span>
                            {hoveredAddress?.toLowerCase() === tx.from.toLowerCase() && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(tx.from);
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
                        )}
                      </div>

                      {/* To */}
                      <div>
                        {isPrivate ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded">
                            <ShieldCheck className="text-purple-600" size={18} strokeWidth={2} />
                            <span className="text-base font-semibold text-purple-700">Private</span>
                          </div>
                        ) : (
                          <Link
                            href={'/account/' + tx.to}
                            className="inline-flex items-center gap-2 px-2 py-1 rounded"
                            style={{
                              backgroundColor: hoveredAddress?.toLowerCase() === tx.to.toLowerCase() ? '#fef3e7' : 'transparent',
                              outline: hoveredAddress?.toLowerCase() === tx.to.toLowerCase() ? '2px dashed #f39c12' : 'none',
                              outlineOffset: '-2px',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              transitionDelay: hoveredAddress?.toLowerCase() === tx.to.toLowerCase() ? '0.25s' : '0s'
                            }}
                            onMouseEnter={() => setHoveredAddress(tx.to)}
                            onMouseLeave={() => setHoveredAddress(null)}
                          >
                            <div className="w-6 h-6 rounded overflow-hidden flex-shrink-0">
                              <Avatar address={tx.to} avatarUrl={null} size={24} />
                            </div>
                            <span className="font-mono text-base font-semibold text-gray-700">{formatHash(tx.to, 8, 6)}</span>
                            {hoveredAddress?.toLowerCase() === tx.to.toLowerCase() && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(tx.to);
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
                        )}
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        {isPrivate ? (
                          <div className="flex items-center justify-end gap-1.5 text-purple-700">
                            <ShieldCheck size={16} strokeWidth={2} />
                            <span className="text-base font-bold">Private</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5 text-base font-bold text-gray-900">
                            <RainIcon size={16} className="flex-shrink-0" />
                            <span className="whitespace-nowrap">{formatBalance(tx.amount).full} RAIN</span>
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      <div className="text-center">
                        <span className={`inline-flex items-center px-4 py-2 rounded text-base font-black ${
                          tx.status === 'confirmed' || !tx.status
                            ? 'bg-emerald-50 text-emerald-700'
                            : tx.status === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {tx.status === 'confirmed' || !tx.status ? 'Confirmed' : tx.status === 'pending' ? 'Pending' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  </div>
                  )
                })
              ) : (
                <div className="px-6 py-12 text-center text-gray-500">
                  <Activity className="mx-auto mb-2 text-gray-300" size={32} strokeWidth={1.5} />
                  <p className="text-sm">No transactions found</p>
                </div>
              )}
            </div>
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
            className="bg-gray-800 rounded max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Virtual Machine Types</h2>
              <button
                onClick={() => setIsVMInfoOpen(false)}
                className="inline-flex items-center justify-center w-8 h-8 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
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
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fuchsia-500 flex items-center justify-center">
                  <span className="text-white font-black text-xs">Move</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Move VM</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Execute Move smart contracts (Aptos/Sui inspired). Enhanced safety with resource-oriented programming and formal verification capabilities.
                  </p>
                </div>
              </div>

              {/* Cross-VM */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                  <ArrowRightLeft className="text-white" size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Cross-VM Transaction</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Transaction that calls between EVM ↔ Move VMs. <span className="text-emerald-400 font-semibold">Rainum's unique dual-VM interoperability feature</span> enabling seamless communication across different blockchain runtimes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, title, value, subtitle }: {
  icon: React.ReactNode
  title: string
  value: string | React.ReactNode
  subtitle?: string
}) {
  return (
    <div className="relative bg-white rounded border-2 border-gray-200 p-6 hover:border-[#0019ff] hover:shadow-[0_0_20px_rgba(0,25,255,0.1)] transition-all duration-300 group overflow-hidden min-h-[120px] flex flex-col justify-between">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity" style={{
        backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0,25,255,.05) 25%, rgba(0,25,255,.05) 26%, transparent 27%, transparent 74%, rgba(0,25,255,.05) 75%, rgba(0,25,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0,25,255,.05) 25%, rgba(0,25,255,.05) 26%, transparent 27%, transparent 74%, rgba(0,25,255,.05) 75%, rgba(0,25,255,.05) 76%, transparent 77%, transparent)',
        backgroundSize: '20px 20px'
      }}></div>

      <div className="relative flex-1 flex flex-col">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 bg-gray-100 rounded group-hover:bg-[#0019ff]/10 transition-colors">
            {icon}
          </div>
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{title}</h3>
        </div>
        <div className="text-3xl font-black text-gray-900 font-mono flex items-center gap-2 mt-auto">{value}</div>
        {subtitle && (
          <div className="mt-3 text-xs text-gray-500 font-medium">{subtitle}</div>
        )}
      </div>
    </div>
  )
}
