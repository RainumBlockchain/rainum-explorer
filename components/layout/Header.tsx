'use client'

import Link from 'next/link'
import { Search, Blocks, ArrowRightLeft, Users, Database, ChevronDown, Activity, Check, BarChart3, Trophy, BookOpen, Monitor, Code, Play, Package, FileCode } from 'lucide-react'
import { useState, useEffect } from 'react'
import { SearchCommand } from '@/components/shared/SearchCommand'
import { useQuery } from '@tanstack/react-query'
import { getTransactions, getValidators } from '@/lib/api/rainum-api'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'

export function Header() {
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false)
  const [isBlockchainOpen, setIsBlockchainOpen] = useState(false)
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)
  const [isResourcesOpen, setIsResourcesOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Fetch data for search - ONLY when search is open
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => getTransactions(),
    enabled: isSearchOpen,
  })

  const { data: validators = [] } = useQuery({
    queryKey: ['validators'],
    queryFn: () => getValidators(),
    enabled: isSearchOpen,
  })

  const { data: blocks = [] } = useQuery({
    queryKey: ['blocks'],
    queryFn: () => fetch('http://localhost:8080/blocks?limit=50').then(res => res.json()),
    enabled: isSearchOpen,
  })

  // CMD+K / Ctrl+K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-[#0019ff] rounded flex items-center justify-center">
                <Database className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg text-gray-900">Rainum Explorer</span>
            </Link>

            {/* Network Selector */}
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded transition-all">
                <div className="w-1.5 h-1.5 bg-[#0019ff] animate-pulse rounded-full"></div>
                <span className="text-xs font-semibold text-gray-900">Devnet</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </MenuButton>
              <MenuItems
                transition
                className="absolute left-0 z-10 mt-2 w-52 origin-top-left rounded bg-white border border-gray-200 py-1 shadow-xl transition data-closed:scale-95 data-closed:opacity-0"
              >
                <MenuItem>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm w-full bg-gray-50 text-gray-900 font-semibold">
                    <div className="w-1.5 h-1.5 bg-[#0019ff] rounded-full"></div>
                    <span>Devnet</span>
                    <Check className="w-4 h-4 ml-auto text-[#0019ff]" />
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 text-sm w-full text-gray-400 cursor-not-allowed"
                  >
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                    <span>Testnet</span>
                    <span className="ml-auto px-2 py-0.5 bg-[#0019ff] text-white text-[9px] font-bold rounded">
                      Q1 2026
                    </span>
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 text-sm w-full text-gray-400 cursor-not-allowed"
                  >
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                    <span>Mainnet</span>
                    <span className="ml-auto px-2 py-0.5 bg-[#0019ff] text-white text-[9px] font-bold rounded">
                      Q2 2026
                    </span>
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>

            <nav className="hidden md:flex items-center gap-1">
              {/* Analytics Menu */}
              <div
                className="relative"
                onMouseEnter={() => setIsAnalyticsOpen(true)}
                onMouseLeave={() => setIsAnalyticsOpen(false)}
              >
                <button
                  className="px-3 py-2 text-gray-700 hover:text-[#0019ff] hover:bg-gray-50 rounded transition-colors font-medium flex items-center gap-1.5 text-sm"
                >
                  <BarChart3 size={15} strokeWidth={2} />
                  Analytics
                  <ChevronDown size={14} strokeWidth={2} className={`transition-transform ${isAnalyticsOpen ? 'rotate-180' : ''}`} />
                </button>

                {isAnalyticsOpen && (
                  <div className="absolute left-0 top-full pt-2 w-64">
                    <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                      <div className="p-2">
                        <Link
                          href="/analytics"
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <BarChart3 size={18} className="text-blue-600" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm mb-0.5">Overview</div>
                            <div className="text-xs text-gray-500">Network statistics & insights</div>
                          </div>
                        </Link>

                        <Link
                          href="/monitoring"
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                            <Monitor size={18} className="text-indigo-600" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm mb-0.5">Network Monitoring</div>
                            <div className="text-xs text-gray-500">Tier performance & topology</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Blockchain Menu */}
              <div
                className="relative"
                onMouseEnter={() => setIsBlockchainOpen(true)}
                onMouseLeave={() => setIsBlockchainOpen(false)}
              >
                <button
                  className="px-3 py-2 text-gray-700 hover:text-[#0019ff] hover:bg-gray-50 rounded transition-colors font-medium flex items-center gap-1.5 text-sm"
                >
                  <Activity size={15} strokeWidth={2} />
                  Blockchain
                  <ChevronDown size={14} strokeWidth={2} className={`transition-transform ${isBlockchainOpen ? 'rotate-180' : ''}`} />
                </button>

                {isBlockchainOpen && (
                  <div className="absolute left-0 top-full pt-2 w-64">
                    <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                      <div className="p-2">
                        <Link
                          href="/transactions"
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <ArrowRightLeft size={18} className="text-[#0019ff]" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm mb-0.5">Transactions</div>
                            <div className="text-xs text-gray-500">View all network transactions</div>
                          </div>
                        </Link>

                        <Link
                          href="/blocks"
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                            <Blocks size={18} className="text-purple-600" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm mb-0.5">Blocks</div>
                            <div className="text-xs text-gray-500">Browse blockchain blocks</div>
                          </div>
                        </Link>

                        <Link
                          href="/validators"
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                            <Users size={18} className="text-green-600" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm mb-0.5">Validators</div>
                            <div className="text-xs text-gray-500">Network validators & staking</div>
                          </div>
                        </Link>

                        <Link
                          href="/contracts"
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                            <FileCode size={18} className="text-indigo-600" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm mb-0.5">Smart Contracts</div>
                            <div className="text-xs text-gray-500">Deployed contracts & verification</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Leaderboard Menu */}
              <div
                className="relative"
                onMouseEnter={() => setIsLeaderboardOpen(true)}
                onMouseLeave={() => setIsLeaderboardOpen(false)}
              >
                <button
                  className="px-3 py-2 text-gray-700 hover:text-[#0019ff] hover:bg-gray-50 rounded transition-colors font-medium flex items-center gap-1.5 text-sm"
                >
                  <Trophy size={15} strokeWidth={2} />
                  Leaderboard
                  <ChevronDown size={14} strokeWidth={2} className={`transition-transform ${isLeaderboardOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLeaderboardOpen && (
                  <div className="absolute left-0 top-full pt-2 w-64">
                    <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                      <div className="p-2">
                        <Link
                          href="/leaderboard"
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="p-2 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-colors">
                            <Trophy size={18} className="text-yellow-600" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm mb-0.5">Top Validators</div>
                            <div className="text-xs text-gray-500">Rankings & performance</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Resources Menu */}
              <div
                className="relative"
                onMouseEnter={() => setIsResourcesOpen(true)}
                onMouseLeave={() => setIsResourcesOpen(false)}
              >
                <button
                  className="px-3 py-2 text-gray-700 hover:text-[#0019ff] hover:bg-gray-50 rounded transition-colors font-medium flex items-center gap-1.5 text-sm"
                >
                  <BookOpen size={15} strokeWidth={2} />
                  Resources
                  <ChevronDown size={14} strokeWidth={2} className={`transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
                </button>

                {isResourcesOpen && (
                  <div className="absolute left-0 top-full pt-2 w-64">
                    <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                      <div className="p-2">
                        <Link
                          href="/api-docs"
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <Code size={18} className="text-blue-600" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm mb-0.5">API Documentation</div>
                            <div className="text-xs text-gray-500">Blockchain API reference</div>
                          </div>
                        </Link>

                        <a
                          href="http://localhost:3005"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                            <Code size={18} className="text-purple-600" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm mb-0.5 flex items-center gap-2">
                              Developer Portal
                              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded">NEW</span>
                            </div>
                            <div className="text-xs text-gray-500">Code playground, IDE, API docs & more</div>
                          </div>
                        </a>

                        <Link
                          href="/docs"
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                            <BookOpen size={18} className="text-indigo-600" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm mb-0.5">Documentation</div>
                            <div className="text-xs text-gray-500">Guides & tutorials</div>
                          </div>
                        </Link>

                        <a
                          href="http://localhost:3004"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                            <Package size={18} className="text-purple-600" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm mb-0.5">SDK & Libraries</div>
                            <div className="text-xs text-gray-500">Developer tools & SDKs</div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 max-w-md mx-4 h-10 px-4 flex items-center gap-3 border border-gray-300 rounded bg-gray-50 hover:bg-white hover:border-gray-400 transition-colors text-left group"
          >
            <Search className="text-gray-400 group-hover:text-gray-600" size={18} strokeWidth={2} />
            <span className="flex-1 text-sm text-gray-500">Search transactions, validators, blocks...</span>
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          <SearchCommand
            transactions={transactions}
            validators={validators}
            blocks={blocks}
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        </div>
      </div>
    </header>
  )
}
