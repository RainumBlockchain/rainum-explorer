'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTransactions, getValidators, getBlocks } from '@/lib/api/rainum-api'
import { SearchCommand } from '@/components/shared/SearchCommand'
import { Search, Zap, Users, TrendingUp, ShieldAlert, CheckCircle2 } from 'lucide-react'

type FilterOption = 'all' | 'trending' | 'new' | 'memecoin' | 'verified'

interface TokenRow {
  rank: number
  name: string
  symbol: string
  address: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  holders: number
  isMemecoin: boolean
  isVerified: boolean
}

const TOKENS: TokenRow[] = [
  {
    rank: 1,
    name: 'Helios AI',
    symbol: 'HEL',
    address: '0x1234...helios',
    price: 2.845,
    change24h: 4.2,
    volume24h: 312_000_000,
    marketCap: 1_784_000_000,
    holders: 42_613,
    isMemecoin: false,
    isVerified: true,
  },
  {
    rank: 2,
    name: 'Nova Ordinals',
    symbol: 'NOVA',
    address: '0x5678...nova',
    price: 0.671,
    change24h: 2.8,
    volume24h: 118_000_000,
    marketCap: 642_000_000,
    holders: 25_410,
    isMemecoin: false,
    isVerified: true,
  },
  {
    rank: 3,
    name: 'Synapse Layer',
    symbol: 'SYN',
    address: '0x4321...synapse',
    price: 12.44,
    change24h: -1.3,
    volume24h: 243_000_000,
    marketCap: 1_200_000_000,
    holders: 31_204,
    isMemecoin: false,
    isVerified: true,
  },
  {
    rank: 4,
    name: 'Pepe Rainum',
    symbol: 'PEPE',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    price: 0.000042,
    change24h: 125.5,
    volume24h: 125_000_000,
    marketCap: 52_000_000,
    holders: 18_340,
    isMemecoin: true,
    isVerified: false,
  },
  {
    rank: 5,
    name: 'Rainum Doge',
    symbol: 'RDOGE',
    address: '0x123d35Cc6634C0532925a3b844Bc9e7595f0abc',
    price: 0.00158,
    change24h: -5.2,
    volume24h: 85_000_000,
    marketCap: 31_000_000,
    holders: 9_820,
    isMemecoin: true,
    isVerified: false,
  },
]

const HIGHLIGHTS = [
  { label: 'Listed tokens', value: '64', icon: Users, accent: 'from-blue-500 to-blue-600' },
  { label: '24h volume', value: '$1.05B', icon: Zap, accent: 'from-emerald-500 to-emerald-600' },
  { label: 'Memecoin inflow', value: '$92M', icon: TrendingUp, accent: 'from-amber-500 to-orange-500' },
  { label: 'Rainum verified', value: '28', icon: CheckCircle2, accent: 'from-indigo-500 to-indigo-600' },
]

export default function TokensPage() {
  const [filter, setFilter] = useState<FilterOption>('all')
  const [search, setSearch] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [spotlightIndex, setSpotlightIndex] = useState(0)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setIsSearchOpen(true)
      }

      if (event.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const { data: transactions = [] } = useQuery({
    queryKey: ['tokens-search-transactions'],
    queryFn: () => getTransactions({ limit: 50 }),
    enabled: isSearchOpen,
  })

  const { data: validators = [] } = useQuery({
    queryKey: ['tokens-search-validators'],
    queryFn: () => getValidators(),
    enabled: isSearchOpen,
  })

  const { data: blocks = [] } = useQuery({
    queryKey: ['tokens-search-blocks'],
    queryFn: () => getBlocks({ limit: 50 }),
    enabled: isSearchOpen,
  })

  const spotlightTokens = useMemo(() => {
    return [...TOKENS].sort((a, b) => b.change24h - a.change24h)
  }, [])

  const spotlightToken =
    spotlightTokens.length > 0 ? spotlightTokens[spotlightIndex % spotlightTokens.length] : null

  useEffect(() => {
    if (spotlightTokens.length === 0) return
    const timer = window.setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % spotlightTokens.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [spotlightTokens.length, spotlightTokens])

  const filteredTokens = useMemo(() => {
    const query = search.trim().toLowerCase()
    return TOKENS.filter((token) => {
      const matchesQuery =
        !query ||
        token.name.toLowerCase().includes(query) ||
        token.symbol.toLowerCase().includes(query)
      if (!matchesQuery) return false

      if (filter === 'trending') return token.change24h > 0
      if (filter === 'new') return token.rank > 3
      if (filter === 'memecoin') return token.isMemecoin
      if (filter === 'verified') return token.isVerified
      return true
    })
  }, [filter, search])

  const marketSummary = useMemo(() => {
    if (TOKENS.length === 0) {
      return {
        totalMarketCap: 0,
        totalVolume: 0,
        positiveShare: 0,
        verifiedTotal: 0,
      }
    }

    const totalMarketCap = TOKENS.reduce((acc, token) => acc + token.marketCap, 0)
    const totalVolume = TOKENS.reduce((acc, token) => acc + token.volume24h, 0)
    const positiveShare = Math.round(
      (TOKENS.filter((token) => token.change24h >= 0).length / TOKENS.length) * 100,
    )
    const verifiedTotal = TOKENS.filter((token) => token.isVerified).length

    return {
      totalMarketCap,
      totalVolume,
      positiveShare,
      verifiedTotal,
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#eef2ff] via-white to-[#f8fafc]">
      <Header />

      <main className="flex-1 w-full">
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <TokenTicker tokens={TOKENS} spotlight={spotlightToken} />

          <section className="relative overflow-hidden rounded border border-white/10 bg-gradient-to-br from-[#0019ff] via-[#0011cc] to-[#000a3d] px-8 py-10 shadow-[0_25px_80px_rgba(0,25,255,0.22)]">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute -top-20 -right-16 h-60 w-60 rounded-full bg-white/15 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/4 rounded-full bg-emerald-400/20 blur-3xl" />
              <div className="hero-sweep absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent blur-2xl" />
              <div className="hero-pulse absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
            </div>
            <div className="relative grid gap-10 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
                  Rainum Explorer
                </span>
                <h1 className="text-4xl font-black text-white leading-tight">
                  Token insights with Rainum launchpad signals and verification.
                </h1>
                <p className="text-base text-white/75 max-w-xl">
                  Filter Rainum Launchpad projects, institutional cohorts, and community memecoins in one unified directory. Track price, liquidity, holder momentum, and verification badges.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="http://localhost:3000/create"
                    className="inline-flex items-center gap-2 rounded bg-white px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.28em] text-[#0019ff] shadow-sm transition hover:bg-blue-50"
                  >
                    Launch your token
                  </Link>
                  <Link
                    href="/transactions"
                    className="inline-flex items-center gap-2 rounded border border-white/20 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-white/10"
                  >
                    View network transactions
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                {spotlightToken && <SpotlightCard token={spotlightToken} />}
                <div className="grid gap-4 sm:grid-cols-2">
                  {HIGHLIGHTS.map((highlight) => (
                    <HighlightCard key={highlight.label} {...highlight} />
                  ))}
                </div>
              </div>
            </div>
            <style jsx>{`
              @keyframes heroDrift {
                0% {
                  transform: translateX(-100%) skewX(-12deg);
                  opacity: 0;
                }
                40% {
                  opacity: 0.35;
                }
                60% {
                  opacity: 0.35;
                }
                100% {
                  transform: translateX(200%) skewX(-12deg);
                  opacity: 0;
                }
              }

              @keyframes heroPulse {
                0%,
                100% {
                  transform: translate(-50%, -50%) scale(0.95);
                  opacity: 0.4;
                }
                50% {
                  transform: translate(-50%, -50%) scale(1.05);
                  opacity: 0.65;
                }
              }

              .hero-sweep {
                animation: heroDrift 14s ease-in-out infinite;
              }

              .hero-pulse {
                animation: heroPulse 8s ease-in-out infinite;
              }
            `}</style>
          </section>

          <MarketPulse summary={marketSummary} />

          <div className="grid gap-6 pt-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
            <aside className="space-y-6">
              <FilterPanel
                active={filter}
                onSelect={setFilter}
                search={search}
                onSearch={setSearch}
                onOpenSearch={() => setIsSearchOpen(true)}
              />
              <RiskNotice />
            </aside>

            <section className="overflow-hidden rounded border border-white/60 bg-white shadow-xl">
              <div className="flex flex-col gap-3 border-b border-gray-200/70 bg-[#f7f8ff] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-[#001a6f]/70">Directory</p>
                  <h2 className="text-xl font-semibold text-gray-900">Rainum token directory</h2>
                </div>
                <Link
                  href="http://localhost:3000/create"
                  className="inline-flex items-center gap-2 rounded border border-[#0019ff]/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#0019ff] transition hover:bg-[#0019ff]/10"
                >
                  Launch your token
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200/60 text-sm">
                  <thead className="bg-[#eef2ff] text-[11px] uppercase tracking-[0.32em] text-[#001a6f]/70">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-[#001244]">#</th>
                      <th className="px-6 py-3 text-left font-semibold text-[#001244]">Token</th>
                      <th className="px-6 py-3 text-right font-semibold text-[#001244]">Price</th>
                      <th className="px-6 py-3 text-right font-semibold text-[#001244]">24h %</th>
                      <th className="px-6 py-3 text-right font-semibold text-[#001244]">24h volume</th>
                      <th className="px-6 py-3 text-right font-semibold text-[#001244]">Market Cap</th>
                      <th className="px-6 py-3 text-right font-semibold text-[#001244]">Holders</th>
                      <th className="px-6 py-3 text-right font-semibold text-[#001244]" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/70">
                    {filteredTokens.map((token) => (
                      <TokenRow key={token.rank} token={token} />
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredTokens.length === 0 && (
                <div className="px-6 py-16 text-center text-sm text-gray-500">
                  No tokens match your filters. Adjust search or pick another cohort.
                </div>
              )}
            </section>
          </div>

          <SearchCommand
            transactions={transactions}
            validators={validators}
            blocks={blocks}
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}

function MarketPulse({
  summary,
}: {
  summary: {
    totalMarketCap: number
    totalVolume: number
    positiveShare: number
    verifiedTotal: number
  }
}) {
  const items = [
    {
      label: 'Total market cap',
      value: formatLargeNumber(summary.totalMarketCap),
      detail: 'Across Rainum listings',
      accent: 'from-[#0019ff]/15 to-[#0019ff]/5',
    },
    {
      label: '24h volume',
      value: formatLargeNumber(summary.totalVolume),
      detail: 'Aggregated trading volume',
      accent: 'from-emerald-500/20 to-emerald-500/5',
    },
    {
      label: 'Tokens in green',
      value: `${summary.positiveShare}%`,
      detail: '24h positive performance',
      progress: summary.positiveShare,
      accent: 'from-amber-500/15 to-amber-500/5',
    },
    {
      label: 'Verified launches',
      value: `${summary.verifiedTotal}`,
      detail: 'Rainum compliant projects',
      accent: 'from-indigo-500/15 to-indigo-500/5',
    },
  ]

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="group relative overflow-hidden rounded border border-[#0019ff]/10 bg-white px-5 py-4 shadow-sm transition hover:shadow-lg"
        >
          {item.accent && (
            <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 transition group-hover:opacity-100`} />
          )}
          <div className="relative z-10 space-y-1">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#001244]/60">{item.label}</p>
            <p className="text-2xl font-semibold text-[#001244]">{item.value}</p>
            <p className="text-xs text-[#001244]/60">{item.detail}</p>
          </div>
          {typeof item.progress === 'number' && (
            <div className="relative z-10 mt-3 h-1.5 w-full rounded bg-gray-200/80">
              <div
                className="absolute inset-y-0 left-0 rounded bg-[#0019ff]"
                style={{ width: `${Math.min(item.progress, 100)}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function SpotlightCard({ token }: { token: TokenRow }) {
  const isPositive = token.change24h >= 0
  const changeValue = `${isPositive ? '+' : ''}${token.change24h.toFixed(2)}%`
  const changeColor = isPositive ? 'text-emerald-300' : 'text-rose-300'
  const changeBg = isPositive ? 'bg-emerald-500/20 border-emerald-400/40' : 'bg-rose-500/20 border-rose-400/40'
  const changeWidth = `${Math.min(Math.abs(token.change24h) / 150, 1) * 100}%`

  return (
    <div className="overflow-hidden rounded border border-white/15 bg-white/10 px-5 py-4 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.32em] text-white/70">Live spotlight</p>
        <span className="text-xs font-semibold text-white/60">#{token.rank}</span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-white">{token.name}</p>
          <p className="text-xs font-mono uppercase tracking-[0.28em] text-white/60">{token.symbol}</p>
        </div>
        <span className={`rounded border ${changeBg} px-2 py-0.5 text-xs font-semibold ${changeColor}`}>
          {changeValue}
        </span>
      </div>
      <div className="mt-4 space-y-2 text-sm text-white/75">
        <div className="flex items-center justify-between">
          <span>Price</span>
          <span className="font-semibold text-white">${token.price.toFixed(3)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Market cap</span>
          <span className="font-semibold text-white/90">{formatLargeNumber(token.marketCap)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Holders</span>
          <span className="font-semibold text-white/90">{token.holders.toLocaleString()}</span>
        </div>
      </div>
      <div className="mt-4 h-1.5 w-full rounded bg-white/10">
        <div
          className={`h-full rounded ${isPositive ? 'bg-emerald-400' : 'bg-rose-400'}`}
          style={{ width: changeWidth }}
        />
      </div>
    </div>
  )
}

function TokenTicker({ tokens, spotlight }: { tokens: TokenRow[]; spotlight: TokenRow | null }) {
  if (tokens.length === 0) return null

  const orderedTokens = [...tokens].sort((a, b) => b.volume24h - a.volume24h)
  const tickerItems = [...orderedTokens, ...orderedTokens]

  return (
    <div className="mb-8 space-y-3 rounded border border-[#0019ff]/15 bg-white/80 p-4 shadow-lg">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-semibold uppercase tracking-[0.28em] text-[#001244]/70">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#0019ff]" />
          Token momentum stream
        </div>
        {spotlight && (
          <div className="text-[11px] uppercase tracking-[0.24em] text-[#001244]/60">
            Spotlight · {spotlight.name} • {spotlight.change24h >= 0 ? '+' : ''}
            {spotlight.change24h.toFixed(2)}%
          </div>
        )}
      </div>
      <div className="relative overflow-hidden">
        <div className="ticker-track flex min-w-max gap-3">
          {tickerItems.map((token, index) => {
            const positive = token.change24h >= 0
            return (
              <div
                key={`${token.symbol}-${index}`}
                className="flex items-center gap-3 rounded border border-[#0019ff]/10 bg-white px-3 py-2 text-sm text-[#001244] shadow-sm"
              >
                <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#001244]/70">
                  {token.symbol}
                </span>
                <span className="text-xs text-[#001244]/60">
                  {formatLargeNumber(token.volume24h)} · {token.holders.toLocaleString()} holders
                </span>
                <span className={`text-xs font-semibold ${positive ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {positive ? '+' : ''}
                  {token.change24h.toFixed(2)}%
                </span>
              </div>
            )
          })}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
      </div>
      <style jsx>{`
        @keyframes tickerMove {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .ticker-track {
          animation: tickerMove 35s linear infinite;
        }
      `}</style>
    </div>
  )
}

function HighlightCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  accent: string
}) {
  return (
    <div className="rounded border border-white/10 bg-white/10 px-5 py-4 shadow-lg backdrop-blur">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded bg-gradient-to-br ${accent} text-white shadow-lg`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/70">{label}</p>
          <p className="text-xl font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  )
}

function FilterPanel({
  active,
  onSelect,
  search,
  onSearch,
  onOpenSearch,
}: {
  active: FilterOption
  onSelect: (value: FilterOption) => void
  search: string
  onSearch: (value: string) => void
  onOpenSearch: () => void
}) {
  const options: Array<{ value: FilterOption; label: string; description: string }> = [
    { value: 'all', label: 'All tokens', description: 'Complete Rainum catalog' },
    { value: 'trending', label: 'Trending', description: 'High momentum & liquidity' },
    { value: 'new', label: 'New listings', description: 'Added within 14 days' },
    { value: 'memecoin', label: 'Memecoins', description: 'High-volatility community tokens' },
    { value: 'verified', label: 'Rainum verified', description: 'Compliance and audit ready' },
  ]

  return (
    <div className="space-y-5 rounded border border-white/10 bg-[#00112e] p-6 shadow-xl text-white">
      <div className="flex items-center gap-2 rounded border border-white/15 bg-white/10 px-3 py-2">
        <Search className="h-4 w-4 text-white/70" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by name or ticker..."
          className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-white/50"
        />
      </div>

      <button
        onClick={onOpenSearch}
        className="flex w-full items-center justify-between rounded border border-white/15 bg-white/5 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.32em] text-white/80 transition hover:border-white/40 hover:bg-white/10"
      >
        Global search & commands
        <kbd className="rounded border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/70">
          ⌘K
        </kbd>
      </button>

      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`w-full text-left rounded border px-4 py-3 text-sm transition ${
              active === option.value
                ? 'border-white bg-white text-[#0019ff]'
                : 'border-white/10 text-white/80 hover:border-white/30 hover:bg-white/5'
            }`}
          >
            <p className={`font-semibold ${active === option.value ? 'text-[#0019ff]' : 'text-white'}`}>
              {option.label}
            </p>
            <p className={`text-xs ${active === option.value ? 'text-[#0019ff]/80' : 'text-white/60'}`}>
              {option.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

function RiskNotice() {
  return (
    <div className="space-y-3 rounded border border-amber-200/70 bg-amber-50/90 p-6 text-sm text-amber-800 shadow-md">
      <div className="flex items-center gap-2 font-semibold text-amber-900">
        <ShieldAlert className="h-4 w-4 text-amber-500" />
        Memecoin caution
      </div>
      <p className="text-xs leading-relaxed">
        Memecoins surface based on community demand. They are unverified and can be extremely volatile.
      </p>
      <ul className="list-disc list-inside space-y-1 text-xs">
        <li>Review holder concentration and liquidity depth.</li>
        <li>Atlas supplies risk scores on token detail pages.</li>
        <li>DYOR — Rainum does not guarantee memecoin safety.</li>
      </ul>
    </div>
  )
}

function TokenRow({ token }: { token: TokenRow }) {
  return (
    <tr className="transition hover:bg-[#0019ff]/5">
      <td className="px-6 py-4 text-sm font-semibold text-[#001a6f]/60">{token.rank}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <TokenAvatar symbol={token.symbol} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-[#0b163a]">{token.name}</p>
              {token.isVerified && (
                <span className="inline-flex items-center gap-1 rounded border border-emerald-400/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </span>
              )}
              {token.isMemecoin && (
                <span className="inline-flex items-center gap-1 rounded border border-amber-300/60 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-600">
                  <TrendingUp className="h-3 w-3" />
                  Meme
                </span>
              )}
            </div>
            <p className="text-xs font-mono uppercase tracking-[0.28em] text-[#001244]/60">
              {token.symbol}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-right font-mono text-sm font-semibold text-[#0b163a]">
        ${token.price.toFixed(3)}
      </td>
      <td className="px-6 py-4 text-right font-semibold text-sm">
        <span className={token.change24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
          {token.change24h >= 0 ? '+' : ''}
          {token.change24h.toFixed(2)}%
        </span>
      </td>
      <td className="px-6 py-4 text-right font-mono text-sm text-[#001244]/70">
        ${(token.volume24h / 1_000_000).toFixed(2)}M
      </td>
      <td className="px-6 py-4 text-right font-mono text-sm text-[#001244]/70">
        ${(token.marketCap / 1_000_000).toFixed(2)}M
      </td>
      <td className="px-6 py-4 text-right text-sm font-semibold text-[#001244]/70">
        {token.holders.toLocaleString()}
      </td>
      <td className="px-6 py-4 text-right text-sm">
        <Link
          href={`/contract/${token.address}`}
          className="inline-flex items-center gap-2 rounded border border-[#0019ff]/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#0019ff] transition hover:bg-[#0019ff]/10"
        >
          View
        </Link>
      </td>
    </tr>
  )
}

function TokenAvatar({ symbol }: { symbol: string }) {
  const initials = symbol.slice(0, 3).toUpperCase()
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded border border-white/40 bg-gradient-to-br from-white to-[#dbe4ff] text-sm font-semibold text-[#0019ff] shadow-inner">
      {initials}
    </div>
  )
}

function formatLargeNumber(value: number) {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }
  return value.toString()
}
