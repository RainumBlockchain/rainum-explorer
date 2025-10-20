'use client'

import { Command } from 'cmdk'
import { Search, Clock, User, Filter, ArrowRight, Hash } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Avatar } from './Avatar'
import { formatHash } from '@/lib/utils/format'
import { formatBalance } from '@/lib/utils/format-balance'
import { useRouter } from 'next/navigation'

interface Transaction {
  hash: string
  from: string
  to: string
  amount: number
  timestamp: number
  status: string
}

interface Validator {
  address: string
  nickname?: string
  avatar_url?: string
  tier: number
  stake: number
}

interface Block {
  id: number
  hash: string
  validator: string
  timestamp: number
  transaction_count: number
}

interface SearchCommandProps {
  transactions: Transaction[]
  validators?: Validator[]
  blocks?: Block[]
  isOpen: boolean
  onClose: () => void
}

const QUICK_FILTERS = [
  { label: 'Last 24 hours', value: 'last_24h', icon: Clock },
  { label: 'Amount > 1,000 RAIN', value: 'amount_gt_1000', icon: Filter },
  { label: 'Amount > 10,000 RAIN', value: 'amount_gt_10000', icon: Filter },
  { label: 'Amount > 100,000 RAIN', value: 'amount_gt_100000', icon: Filter },
]

export function SearchCommand({ transactions, validators = [], blocks = [], isOpen, onClose }: SearchCommandProps) {
  const [search, setSearch] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const router = useRouter()

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const addRecentSearch = (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const handleSelect = (value: string, type: string) => {
    addRecentSearch(value)

    if (type === 'transaction') {
      router.push(`/transaction/${value}`)
    } else if (type === 'address') {
      router.push(`/account/${value}`)
    } else if (type === 'block') {
      router.push(`/block/${value}`)
    } else if (type === 'filter') {
      // Handle filter logic (will be implemented)
      console.log('Filter:', value)
    }

    onClose()
  }

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(tx =>
    tx.hash.toLowerCase().includes(search.toLowerCase()) ||
    tx.from.toLowerCase().includes(search.toLowerCase()) ||
    tx.to.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5)

  // Filter validators based on search
  const filteredValidators = validators.filter(v =>
    v.address.toLowerCase().includes(search.toLowerCase()) ||
    v.nickname?.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5)

  // Filter blocks based on search
  const filteredBlocks = blocks.filter(b =>
    b.hash.toLowerCase().includes(search.toLowerCase()) ||
    b.id.toString().includes(search) ||
    b.validator.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Command Menu */}
      <Command
        className="relative bg-white rounded-lg shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[600px] overflow-hidden"
        shouldFilter={false}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
          <Search size={20} className="text-gray-400 flex-shrink-0" />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search: transactions, hash, validator names, wallet addresses..."
            className="flex-1 outline-none text-sm text-gray-900 placeholder:text-gray-400"
            autoFocus
          />
          <kbd className="px-2 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <Command.List className="max-h-[500px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-gray-500">
            No results found.
          </Command.Empty>

          {/* Recent Searches */}
          {!search && recentSearches.length > 0 && (
            <Command.Group heading="Recent" className="mb-2">
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <Clock size={12} />
                Recent Searches
              </div>
              {recentSearches.map((item) => (
                <Command.Item
                  key={item}
                  value={item}
                  onSelect={() => setSearch(item)}
                  className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer text-sm text-gray-700 flex items-center gap-2"
                >
                  <Clock size={14} className="text-gray-400" />
                  <span className="font-mono">{formatHash(item, 12, 8)}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Quick Filters */}
          {!search && (
            <Command.Group heading="Filters" className="mb-2">
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <Filter size={12} />
                Quick Filters
              </div>
              {QUICK_FILTERS.map((filter) => {
                const FilterIcon = filter.icon
                return (
                  <Command.Item
                    key={filter.value}
                    value={filter.value}
                    onSelect={() => handleSelect(filter.value, 'filter')}
                    className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer text-sm text-gray-700 flex items-center gap-2"
                  >
                    <FilterIcon size={14} className="text-gray-400" />
                    {filter.label}
                  </Command.Item>
                )
              })}
            </Command.Group>
          )}

          {/* Blocks */}
          {search && filteredBlocks.length > 0 && (
            <Command.Group heading="Blocks" className="mb-2">
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <Hash size={12} />
                Blocks
              </div>
              {filteredBlocks.map((block) => (
                <Command.Item
                  key={block.hash}
                  value={block.hash}
                  onSelect={() => handleSelect(block.hash, 'block')}
                  className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer text-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900">
                      Block #{block.id}
                    </span>
                    <span className="text-xs text-gray-500">
                      {block.transaction_count} txs
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Avatar address={block.validator} size={16} />
                    <span className="font-mono">{formatHash(block.validator, 8, 6)}</span>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Validators */}
          {search && filteredValidators.length > 0 && (
            <Command.Group heading="Validators" className="mb-2">
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <User size={12} />
                Validators
              </div>
              {filteredValidators.map((validator) => (
                <Command.Item
                  key={validator.address}
                  value={validator.address}
                  onSelect={() => handleSelect(validator.address, 'address')}
                  className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-3"
                >
                  <Avatar
                    address={validator.address}
                    avatarUrl={validator.avatar_url}
                    size={32}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900">
                      {validator.nickname || formatHash(validator.address, 8, 6)}
                    </div>
                    <div className="text-xs text-gray-500 font-mono truncate">
                      {formatHash(validator.address, 10, 8)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatBalance(validator.stake).main} RAIN
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Transactions */}
          {search && filteredTransactions.length > 0 && (
            <Command.Group heading="Transactions" className="mb-2">
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <Hash size={12} />
                Transactions
              </div>
              {filteredTransactions.map((tx) => (
                <Command.Item
                  key={tx.hash}
                  value={tx.hash}
                  onSelect={() => handleSelect(tx.hash, 'transaction')}
                  className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer text-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-[#0019ff] font-medium">
                      {formatHash(tx.hash, 12, 8)}
                    </span>
                    <span className="text-xs font-semibold text-gray-900">
                      {formatBalance(tx.amount).main} RAIN
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Avatar address={tx.from} size={16} />
                    <span className="font-mono">{formatHash(tx.from, 6, 4)}</span>
                    <ArrowRight size={10} className="text-gray-300" />
                    <Avatar address={tx.to} size={16} />
                    <span className="font-mono">{formatHash(tx.to, 6, 4)}</span>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </Command>
    </div>
  )
}
