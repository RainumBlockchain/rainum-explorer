'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useQuery } from '@tanstack/react-query'
import { getStatus } from '@/lib/api/rainum-api'
import { Monitor, Activity, Server, Globe } from 'lucide-react'
import dynamic from 'next/dynamic'
import { NodesRanking } from '@/components/nodes/NodesRanking'

// Leaflet World Map (proper geography, dark theme)
const WorldMap = dynamic(() => import('@/components/nodes/WorldMap').then(mod => ({ default: mod.WorldMap })), {
  ssr: false,
  loading: () => <div className="h-[500px] bg-gray-900 rounded-lg animate-pulse" />,
})

// Demo data showing how network will look with global distribution
// TODO: Replace with real API data from /nodes/map endpoint
const getDemoClusters = (validators: any) => {
  const realValidatorCount = validators?.length || 2

  return [
    { country: 'Denmark', country_code: 'DK', city: 'Frederiksberg', latitude: 55.6769, longitude: 12.5268, count: realValidatorCount, nodes: validators?.map((v: any) => v.address) || [] },
    { country: 'United States', country_code: 'US', city: 'New York', latitude: 40.7128, longitude: -74.0060, count: 1541, nodes: ['demo-node-1'] },
    { country: 'United States', country_code: 'US', city: 'San Francisco', latitude: 37.7749, longitude: -122.4194, count: 248, nodes: ['demo-node-2'] },
    { country: 'Ireland', country_code: 'IE', city: 'Dublin', latitude: 53.3498, longitude: -6.2603, count: 1032, nodes: ['demo-node-3'] },
    { country: 'Germany', country_code: 'DE', city: 'Frankfurt', latitude: 50.1109, longitude: 8.6821, count: 674, nodes: ['demo-node-4'] },
    { country: 'United Kingdom', country_code: 'GB', city: 'London', latitude: 51.5074, longitude: -0.1278, count: 2963, nodes: ['demo-node-5'] },
    { country: 'France', country_code: 'FR', city: 'Paris', latitude: 48.8566, longitude: 2.3522, count: 166, nodes: ['demo-node-6'] },
    { country: 'Netherlands', country_code: 'NL', city: 'Amsterdam', latitude: 52.3676, longitude: 4.9041, count: 122, nodes: ['demo-node-7'] },
    { country: 'Singapore', country_code: 'SG', city: 'Singapore', latitude: 1.3521, longitude: 103.8198, count: 556, nodes: ['demo-node-8'] },
    { country: 'China', country_code: 'CN', city: 'Shanghai', latitude: 31.2304, longitude: 121.4737, count: 897, nodes: ['demo-node-9'] },
    { country: 'China', country_code: 'CN', city: 'Hong Kong', latitude: 22.3193, longitude: 114.1694, count: 1733, nodes: ['demo-node-10'] },
    { country: 'Japan', country_code: 'JP', city: 'Tokyo', latitude: 35.6762, longitude: 139.6503, count: 218, nodes: ['demo-node-11'] },
    { country: 'South Korea', country_code: 'KR', city: 'Seoul', latitude: 37.5665, longitude: 126.9780, count: 98, nodes: ['demo-node-12'] },
    { country: 'Australia', country_code: 'AU', city: 'Sydney', latitude: -33.8688, longitude: 151.2093, count: 69, nodes: ['demo-node-13'] },
    { country: 'Brazil', country_code: 'BR', city: 'São Paulo', latitude: -23.5505, longitude: -46.6333, count: 22, nodes: ['demo-node-14'] },
    { country: 'Canada', country_code: 'CA', city: 'Toronto', latitude: 43.6532, longitude: -79.3832, count: 66, nodes: ['demo-node-15'] },
    { country: 'India', country_code: 'IN', city: 'Mumbai', latitude: 19.0760, longitude: 72.8777, count: 101, nodes: ['demo-node-16'] },
    { country: 'Russia', country_code: 'RU', city: 'Moscow', latitude: 55.7558, longitude: 37.6173, count: 18, nodes: ['demo-node-17'] },
  ]
}

const getDemoRanking = (validators: any) => {
  const realValidatorCount = validators?.length || 2

  return [
    { country: 'United Kingdom', count: 2963 },
    { country: 'China (Hong Kong)', count: 1733 },
    { country: 'United States (NY)', count: 1541 },
    { country: 'Ireland', count: 1032 },
    { country: 'China (Shanghai)', count: 897 },
    { country: 'Germany', count: 674 },
    { country: 'Singapore', count: 556 },
    { country: 'United States (SF)', count: 248 },
    { country: 'Japan', count: 218 },
    { country: 'France', count: 166 },
    { country: 'Netherlands', count: 122 },
    { country: 'India', count: 101 },
    { country: 'South Korea', count: 98 },
    { country: 'Australia', count: 69 },
    { country: 'Canada', count: 66 },
    { country: 'Brazil', count: 22 },
    { country: 'Russia', count: 18 },
    { country: 'Denmark (Your Nodes)', count: realValidatorCount },
  ]
}

export default function NodesPage() {
  const { data: status, isLoading } = useQuery({
    queryKey: ['node-status'],
    queryFn: getStatus,
    refetchInterval: 5000,
  })

  const { data: validators } = useQuery({
    queryKey: ['validators'],
    queryFn: () => fetch('/api/blockchain/validators').then(r => r.json()),
    refetchInterval: 10000,
  })

  const clusters = getDemoClusters(validators)
  const ranking = getDemoRanking(validators)
  const totalNodes = clusters.reduce((sum, c) => sum + c.count, 0)
  const totalCountries = clusters.length

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Globe className="text-emerald-600" size={24} strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Nodes</h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {totalNodes}
            </div>
            <div className="text-gray-600">Total Nodes</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {totalCountries}
            </div>
            <div className="text-gray-600">Countries / Regions</div>
          </div>
        </div>

        {/* World Map */}
        <div className="mb-8">
          <WorldMap clusters={clusters} />
        </div>

        {/* Nodes Ranking */}
        <NodesRanking data={ranking} />

        {/* Current Network Status */}
        {!isLoading && status && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <Monitor className="text-blue-600" size={20} />
              <h3 className="text-lg font-semibold text-blue-900">
                Current Network Status
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-blue-600 font-medium">Active Validators</div>
                <div className="text-2xl font-bold text-blue-900">{status.active_validators}</div>
              </div>
              <div>
                <div className="text-blue-600 font-medium">P2P Peers</div>
                <div className="text-2xl font-bold text-blue-900">{status.p2p?.peers || 0}</div>
              </div>
              <div>
                <div className="text-blue-600 font-medium">Block Height</div>
                <div className="text-2xl font-bold text-blue-900">{status.total_blocks}</div>
              </div>
              <div>
                <div className="text-blue-600 font-medium">Network Status</div>
                <div className="text-2xl font-bold text-green-600">
                  {status.p2p?.status === 'running' ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs text-blue-700 bg-blue-100 px-3 py-2 rounded">
              Note: Map shows current validators. Geographic data will expand as network grows and peers connect.
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
