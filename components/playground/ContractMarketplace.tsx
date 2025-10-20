'use client'

import { useState } from 'react'
import { Search, Star, Download, Eye, Code, TrendingUp, Filter, Tag, Users, Clock, Check, Award } from 'lucide-react'

interface MarketplaceTemplate {
  id: string
  name: string
  description: string
  category: string
  author: string
  downloads: number
  views: number
  rating: number
  reviews: number
  tags: string[]
  verified: boolean
  premium: boolean
  lastUpdated: string
  code: string
}

export function ContractMarketplace({ onLoadTemplate }: { onLoadTemplate: (code: string, name: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular')
  const [selectedTemplate, setSelectedTemplate] = useState<MarketplaceTemplate | null>(null)

  // Mock marketplace data
  const templates: MarketplaceTemplate[] = [
    {
      id: '1',
      name: 'ERC-20 Token',
      description: 'Standard fungible token implementation with burn and mint capabilities',
      category: 'token',
      author: 'OpenZeppelin',
      downloads: 45230,
      views: 125400,
      rating: 4.9,
      reviews: 892,
      tags: ['token', 'erc20', 'fungible', 'standard'],
      verified: true,
      premium: false,
      lastUpdated: '2 days ago',
      code: '// ERC-20 Token Implementation\npragma solidity ^0.8.0;\n\ncontract ERC20Token {\n    // Implementation here\n}'
    },
    {
      id: '2',
      name: 'NFT Collection',
      description: 'Complete ERC-721 NFT collection with minting, metadata, and marketplace integration',
      category: 'nft',
      author: 'Rainum Labs',
      downloads: 32140,
      views: 98750,
      rating: 4.8,
      reviews: 654,
      tags: ['nft', 'erc721', 'collectibles', 'metadata'],
      verified: true,
      premium: true,
      lastUpdated: '1 week ago',
      code: '// NFT Collection\npragma solidity ^0.8.0;\n\ncontract NFTCollection {\n    // Implementation here\n}'
    },
    {
      id: '3',
      name: 'DAO Governance',
      description: 'Decentralized governance system with voting, proposals, and treasury management',
      category: 'governance',
      author: 'Compound',
      downloads: 28650,
      views: 87320,
      rating: 4.7,
      reviews: 512,
      tags: ['dao', 'governance', 'voting', 'treasury'],
      verified: true,
      premium: false,
      lastUpdated: '3 days ago',
      code: '// DAO Governance\npragma solidity ^0.8.0;\n\ncontract DAOGovernance {\n    // Implementation here\n}'
    },
    {
      id: '4',
      name: 'DeFi Staking Pool',
      description: 'Liquidity staking pool with rewards distribution and lock-up periods',
      category: 'defi',
      author: 'Uniswap',
      downloads: 19870,
      views: 65430,
      rating: 4.6,
      reviews: 387,
      tags: ['defi', 'staking', 'rewards', 'liquidity'],
      verified: true,
      premium: true,
      lastUpdated: '5 days ago',
      code: '// DeFi Staking Pool\npragma solidity ^0.8.0;\n\ncontract StakingPool {\n    // Implementation here\n}'
    },
    {
      id: '5',
      name: 'Multi-Sig Wallet',
      description: 'Secure multi-signature wallet with configurable approvals and time locks',
      category: 'security',
      author: 'Gnosis',
      downloads: 15420,
      views: 52180,
      rating: 4.9,
      reviews: 421,
      tags: ['security', 'multisig', 'wallet', 'safety'],
      verified: true,
      premium: false,
      lastUpdated: '1 week ago',
      code: '// Multi-Sig Wallet\npragma solidity ^0.8.0;\n\ncontract MultiSigWallet {\n    // Implementation here\n}'
    },
    {
      id: '6',
      name: 'AMM DEX',
      description: 'Automated market maker decentralized exchange with liquidity pools',
      category: 'defi',
      author: 'Balancer',
      downloads: 12340,
      views: 43210,
      rating: 4.5,
      reviews: 298,
      tags: ['defi', 'dex', 'amm', 'swap'],
      verified: false,
      premium: true,
      lastUpdated: '2 weeks ago',
      code: '// AMM DEX\npragma solidity ^0.8.0;\n\ncontract AMMDEX {\n    // Implementation here\n}'
    }
  ]

  const categories = ['all', 'token', 'nft', 'governance', 'defi', 'security']

  const filteredTemplates = templates
    .filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.downloads - a.downloads
      if (sortBy === 'rating') return b.rating - a.rating
      return 0 // newest would compare dates
    })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'token': return 'bg-green-500'
      case 'nft': return 'bg-blue-500'
      case 'governance': return 'bg-purple-500'
      case 'defi': return 'bg-pink-500'
      case 'security': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contract Marketplace</h2>
        <p className="text-gray-600">Discover, explore, and deploy verified smart contract templates</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates, tags, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0019ff]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-600" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0019ff]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-gray-600" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0019ff]"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
      </div>

      {/* Template Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            className="p-6 border-2 border-gray-200 rounded hover:border-[#0019ff] hover:shadow-lg transition-all cursor-pointer bg-white"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">{template.name}</h3>
                  {template.verified && (
                    <Check size={14} className="text-white bg-blue-500 rounded-full p-0.5" title="Verified" />
                  )}
                  {template.premium && (
                    <Award size={14} className="text-yellow-500" title="Premium" />
                  )}
                </div>
                <p className="text-xs text-gray-600">by {template.author}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Download size={12} />
                <span>{(template.downloads / 1000).toFixed(1)}k</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={12} />
                <span>{(template.views / 1000).toFixed(1)}k</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span>{template.rating}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap mb-4">
              <span className={`px-2 py-1 ${getCategoryColor(template.category)} text-white text-xs rounded font-semibold`}>
                {template.category}
              </span>
              {template.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{template.lastUpdated}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span>{template.reviews} reviews</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn"
             onClick={() => setSelectedTemplate(null)}>
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
               onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#0019ff] to-[#0047ff] text-white">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold">{selectedTemplate.name}</h3>
                    {selectedTemplate.verified && (
                      <Check size={20} className="bg-white text-blue-500 rounded-full p-1" />
                    )}
                    {selectedTemplate.premium && (
                      <Award size={20} className="text-yellow-300" />
                    )}
                  </div>
                  <p className="text-blue-100">by {selectedTemplate.author}</p>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-white hover:bg-white/20 rounded p-2 transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-blue-100">{selectedTemplate.description}</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[600px] overflow-y-auto">
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                    <Download size={16} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{(selectedTemplate.downloads / 1000).toFixed(1)}k</div>
                  <div className="text-xs text-gray-600">Downloads</div>
                </div>
                <div className="p-4 bg-gray-50 rounded text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                    <Eye size={16} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{(selectedTemplate.views / 1000).toFixed(1)}k</div>
                  <div className="text-xs text-gray-600">Views</div>
                </div>
                <div className="p-4 bg-gray-50 rounded text-center">
                  <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                    <Star size={16} className="fill-current" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{selectedTemplate.rating}</div>
                  <div className="text-xs text-gray-600">Rating</div>
                </div>
                <div className="p-4 bg-gray-50 rounded text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                    <Users size={16} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{selectedTemplate.reviews}</div>
                  <div className="text-xs text-gray-600">Reviews</div>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag size={18} />
                  Tags
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {selectedTemplate.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Code Preview */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Code size={18} />
                  Code Preview
                </h4>
                <div className="p-4 bg-[#1e1e1e] rounded border border-gray-800 max-h-64 overflow-auto">
                  <code className="text-sm text-green-400 font-mono whitespace-pre">
                    {selectedTemplate.code}
                  </code>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onLoadTemplate(selectedTemplate.code, selectedTemplate.name)
                    setSelectedTemplate(null)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#0019ff] text-white rounded font-semibold hover:bg-[#0015cc] transition-colors"
                >
                  <Download size={18} />
                  Use This Template
                </button>
                <button
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded font-semibold hover:bg-gray-200 transition-colors"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
