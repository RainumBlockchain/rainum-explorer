'use client'

interface NodeCluster {
  country: string
  city: string
  latitude: number
  longitude: number
  count: number
  nodes: string[]
}

interface WorldMapSimpleProps {
  clusters: NodeCluster[]
}

export function WorldMapSimple({ clusters }: WorldMapSimpleProps) {
  // Convert lat/lon to SVG coordinates (simple mercator projection)
  const latLonToXY = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 100
    const y = ((90 - lat) / 180) * 100
    return { x, y }
  }

  const totalNodes = clusters.reduce((sum, c) => sum + c.count, 0)
  const totalCountries = new Set(clusters.map(c => c.country)).size
  const totalCities = clusters.length

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      {/* Stats Overlay */}
      <div className="absolute top-6 left-6 z-10 text-white space-y-2">
        <div className="text-4xl font-bold">{totalNodes.toLocaleString()}</div>
        <div className="text-sm text-gray-400">Nodes</div>
        <div className="text-2xl font-semibold mt-3">{totalCountries}</div>
        <div className="text-sm text-gray-400">Countries</div>
        <div className="text-2xl font-semibold mt-3">{totalCities}</div>
        <div className="text-sm text-gray-400">Cities</div>
      </div>

      {/* SVG World Map */}
      <svg
        viewBox="0 0 100 60"
        className="w-full h-[500px]"
        style={{ background: '#1a1a1a' }}
      >
        {/* Simplified world map paths (continents) */}
        <g opacity="0.3" fill="#374151">
          {/* Europe */}
          <path d="M 45 15 L 55 15 L 58 20 L 55 25 L 48 25 Z" />
          {/* North America */}
          <path d="M 15 15 L 30 15 L 32 25 L 28 35 L 15 30 Z" />
          {/* South America */}
          <path d="M 25 35 L 32 35 L 30 50 L 25 48 Z" />
          {/* Asia */}
          <path d="M 60 15 L 85 15 L 88 30 L 75 35 L 60 30 Z" />
          {/* Africa */}
          <path d="M 48 28 L 58 28 L 58 48 L 50 48 Z" />
          {/* Australia */}
          <path d="M 78 45 L 85 45 L 85 52 L 78 52 Z" />
        </g>

        {/* Node clusters as cyan circles with count labels */}
        {clusters.map((cluster, i) => {
          const { x, y } = latLonToXY(cluster.latitude, cluster.longitude)
          const size = cluster.count > 100 ? 3 : cluster.count > 10 ? 2 : 1.5

          return (
            <g key={i}>
              {/* Glow effect */}
              <circle
                cx={x}
                cy={y}
                r={size + 1}
                fill="#0019ff"
                opacity="0.4"
                className="animate-pulse"
              />
              {/* Main circle */}
              <circle
                cx={x}
                cy={y}
                r={size}
                fill="#0019ff"
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <title>{cluster.city}, {cluster.country}: {cluster.count} nodes</title>
              </circle>
              {/* Count label for larger clusters */}
              {cluster.count > 10 && (
                <text
                  x={x}
                  y={y + 0.5}
                  textAnchor="middle"
                  fontSize="2"
                  fill="white"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {cluster.count}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
