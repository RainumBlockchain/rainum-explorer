'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getBlock, getTransaction, getAccount } from '@/lib/api/rainum-api'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, Blocks, ArrowRightLeft, Wallet, AlertCircle } from 'lucide-react'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  const [isSearching, setIsSearching] = useState(false)
  const [resultType, setResultType] = useState<'block' | 'transaction' | 'account' | 'not-found' | null>(null)

  useEffect(() => {
    if (!query) return

    setIsSearching(true)
    setResultType(null)

    // Try to determine what type of search this is
    const searchBlockchain = async () => {
      try {
        // Try block ID first if query is a number
        if (/^\d+$/.test(query)) {
          try {
            const block = await getBlock(parseInt(query))
            if (block) {
              // Redirect directly to block page
              router.push('/block/' + block.hash)
              return
            }
          } catch {}
        }

        // Try as hash (block, tx, or address)
        if (query.startsWith('0x')) {
          // Try block hash
          try {
            const block = await getBlock(query)
            if (block) {
              router.push('/block/' + query)
              return
            }
          } catch {}

          // Try transaction hash
          try {
            const tx = await getTransaction(query)
            if (tx) {
              router.push('/transaction/' + query)
              return
            }
          } catch {}

          // Try account address
          try {
            const account = await getAccount(query)
            if (account) {
              router.push('/account/' + query)
              return
            }
          } catch {}
        }

        // Nothing found
        setResultType('not-found')
      } catch (error) {
        console.error('Search error:', error)
        setResultType('not-found')
      } finally {
        setIsSearching(false)
      }
    }

    searchBlockchain()
  }, [query, router])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Search Results</h1>
          <p className="text-gray-600">
            Searching for: <span className="font-mono font-semibold text-[#0019ff]">{query}</span>
          </p>
        </div>

        {isSearching ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <Loader2 className="mx-auto mb-4 text-[#0019ff] animate-spin" size={48} />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Searching...</h2>
            <p className="text-gray-600">Looking through blocks, transactions, and accounts...</p>
          </div>
        ) : resultType === 'not-found' ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find anything matching your search.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">Search Tips:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use a block number (e.g., 12345)</li>
                <li>• Use a full block hash (e.g., 0xabc123...)</li>
                <li>• Use a transaction hash (e.g., 0xdef456...)</li>
                <li>• Use an account address (e.g., 0x789abc...)</li>
              </ul>
            </div>
          </div>
        ) : null}

        {/* Search Examples */}
        <div className="mt-12 bg-gray-50 rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Searches</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/search?q=1')}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-[#0019ff] hover:shadow-md transition-all text-left"
            >
              <Blocks className="text-[#0019ff] mb-2" size={24} />
              <div className="font-semibold text-gray-900 mb-1">Block #1</div>
              <div className="text-sm text-gray-600">Search by block number</div>
            </button>
            
            <Link
              href="/transactions"
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-[#0019ff] hover:shadow-md transition-all text-left"
            >
              <ArrowRightLeft className="text-purple-500 mb-2" size={24} />
              <div className="font-semibold text-gray-900 mb-1">Recent Transactions</div>
              <div className="text-sm text-gray-600">Browse all transactions</div>
            </Link>
            
            <Link
              href="/validators"
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-[#0019ff] hover:shadow-md transition-all text-left"
            >
              <Wallet className="text-green-500 mb-2" size={24} />
              <div className="font-semibold text-gray-900 mb-1">Validators</div>
              <div className="text-sm text-gray-600">View all validators</div>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0019ff]" size={48} />
        </main>
        <Footer />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
