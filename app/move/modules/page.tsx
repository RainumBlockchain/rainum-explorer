'use client';

import { useState } from 'react';
import { FileCode, Search, TrendingUp, Users, Code, Package, Clock, User } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export default function MoveModulesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - will be fetched from /move/modules API
  const mockModules = [
    {
      module_id: '0x1::Rainum',
      address: '0x1',
      name: 'Rainum',
      bytecode_size: 2340,
      deployed_at: Date.now() / 1000 - 172800,
    },
    // More modules...
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileCode className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Move Modules</h1>
              <p className="text-gray-500">Explore published Move modules on Rainum</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-500">Total Modules</span>
              </div>
              <div className="text-2xl font-bold">{mockModules.length}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-500">Publishers</span>
              </div>
              <div className="text-2xl font-bold">1</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-500">24h Deployments</span>
              </div>
              <div className="text-2xl font-bold">0</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search modules by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          {mockModules.map((module) => (
            <Link
              key={module.module_id}
              href={`/move/module/${encodeURIComponent(module.module_id)}`}
              className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-purple-300 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileCode className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold font-mono">{module.module_id}</h3>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Code className="w-4 h-4" />
                      <span>{module.bytecode_size} bytes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(module.deployed_at * 1000).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span className="font-mono">{module.address.slice(0, 10)}...</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {mockModules.length === 0 && (
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <FileCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Move Modules Yet</h3>
            <p className="text-gray-500 mb-4">
              No Move modules have been published on this network yet.
            </p>
            <p className="text-sm text-gray-400">
              Be the first to publish a Move module!
            </p>
          </div>
        )}

        {/* Notice */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <FileCode className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <div>
              <div className="font-semibold text-purple-900 mb-1">
                Rainum Move VM - Developer Preview
              </div>
              <div className="text-sm text-purple-700">
                Move VM support is currently in development. Module publishing is available,
                full runtime execution coming in Phase 3.
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
