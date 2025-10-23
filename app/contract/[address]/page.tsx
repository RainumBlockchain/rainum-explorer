'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useQuery } from '@tanstack/react-query'
import { getContract } from '@/lib/api/rainum-api'
import { FileCode, User, Clock, CheckCircle, AlertCircle, Copy, Code } from 'lucide-react'
import Link from 'next/link'
import { formatHash } from '@/lib/utils/format'
import { useState } from 'react'

export default function ContractDetailPage({ params }: { params: { address: string } }) {
  const [copied, setCopied] = useState(false)

  const { data: contract, isLoading } = useQuery({
    queryKey: ['contract', params.address],
    queryFn: () => getContract(params.address),
    refetchInterval: 10000,
  })

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-96 bg-gray-100 rounded mb-8"></div>
            <div className="bg-white rounded border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="h-4 w-full bg-gray-100 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
                <div className="h-4 w-4/6 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="text-center py-12">
            <FileCode className="mx-auto mb-4 text-gray-300" size={48} strokeWidth={1.5} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Contract Not Found</h2>
            <p className="text-gray-600">The contract address you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const deployedDate = new Date(contract.deployed_at * 1000)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FileCode className="text-[#0019ff]" size={32} strokeWidth={2} />
            <h1 className="text-3xl font-bold text-gray-900">
              {contract.contract_name || 'Smart Contract'}
            </h1>
            {contract.verified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold">
                <CheckCircle size={16} strokeWidth={2.5} />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold">
                <AlertCircle size={16} strokeWidth={2} />
                Unverified
              </span>
            )}
          </div>
          <p className="text-gray-600">Contract details and information</p>
        </div>

        {/* Contract Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Contract Address */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileCode className="text-gray-600" size={18} strokeWidth={2} />
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Contract Address</h3>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-lg font-mono font-bold text-gray-900">{contract.address}</code>
              <button
                onClick={() => handleCopy(contract.address)}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="Copy address"
              >
                {copied ? (
                  <CheckCircle size={16} className="text-emerald-600" strokeWidth={2.5} />
                ) : (
                  <Copy size={16} className="text-gray-500" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>

          {/* Deployer */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <User className="text-gray-600" size={18} strokeWidth={2} />
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Deployer</h3>
            </div>
            <Link href={'/account/' + contract.deployer}>
              <code className="text-lg font-mono font-bold text-gray-900 hover:text-[#0019ff] transition-colors">
                {formatHash(contract.deployer, 12, 10)}
              </code>
            </Link>
          </div>

          {/* Deployed At */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="text-gray-600" size={18} strokeWidth={2} />
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Deployed At</h3>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {deployedDate.toLocaleString()}
            </div>
          </div>

          {/* Compiler Version */}
          {contract.compiler_version && (
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Code className="text-gray-600" size={18} strokeWidth={2} />
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Compiler</h3>
              </div>
              <div className="text-lg font-bold text-gray-900">
                {contract.compiler_version}
              </div>
            </div>
          )}
        </div>

        {/* Source Code */}
        {contract.verified && contract.source_code && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-base font-semibold text-gray-900">Contract Source Code</h3>
            </div>
            <div className="p-6">
              <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
                <code className="text-sm font-mono">{contract.source_code}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Bytecode */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-base font-semibold text-gray-900">Contract Bytecode</h3>
          </div>
          <div className="p-6">
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
              <code className="text-xs font-mono break-all">{contract.bytecode}</code>
            </pre>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
