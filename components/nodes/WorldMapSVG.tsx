'use client'

interface NodeCluster {
  country: string
  city: string
  latitude: number
  longitude: number
  count: number
  nodes: string[]
}

interface WorldMapSVGProps {
  clusters: NodeCluster[]
}

export function WorldMapSVG({ clusters }: WorldMapSVGProps) {
  // Convert lat/lon to SVG coordinates (simplified mercator projection)
  const latLonToXY = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 1000
    const y = ((90 - lat) / 180) * 500
    return { x, y }
  }

  const totalNodes = clusters.reduce((sum, c) => sum + c.count, 0)
  const totalCountries = new Set(clusters.map(c => c.country)).size
  const totalCities = clusters.length

  return (
    <div className="relative bg-[#0a0a0a] rounded-lg overflow-hidden border border-gray-800">
      {/* Stats Overlay */}
      <div className="absolute top-6 left-6 z-10 space-y-3">
        <div>
          <div className="text-4xl font-bold text-white">{totalNodes}</div>
          <div className="text-sm text-gray-400">Nodes</div>
        </div>
        <div>
          <div className="text-2xl font-semibold text-white">{totalCountries}</div>
          <div className="text-sm text-gray-400">Countries</div>
        </div>
        <div>
          <div className="text-2xl font-semibold text-white">{totalCities}</div>
          <div className="text-sm text-gray-400">Cities</div>
        </div>
      </div>

      {/* SVG World Map */}
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-[500px]"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* World map paths (simplified continents) */}
        <g fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="0.5">
          {/* North America */}
          <path d="M 150,100 L 250,100 L 280,150 L 270,220 L 240,250 L 200,240 L 170,200 L 150,150 Z" />
          {/* South America */}
          <path d="M 240,260 L 280,260 L 290,320 L 280,380 L 250,400 L 230,380 L 230,300 Z" />
          {/* Europe */}
          <path d="M 470,120 L 520,110 L 550,130 L 540,160 L 500,170 L 480,150 Z" />
          {/* Africa */}
          <path d="M 480,180 L 540,180 L 560,240 L 550,320 L 520,340 L 490,320 L 480,260 Z" />
          {/* Asia */}
          <path d="M 550,100 L 750,90 L 850,120 L 860,180 L 820,220 L 750,200 L 680,180 L 620,150 L 570,130 Z" />
          {/* Australia */}
          <path d="M 760,330 L 830,330 L 850,360 L 840,390 L 780,390 L 760,370 Z" />
        </g>

        {/* Node clusters as glowing blue circles */}
        {clusters.map((cluster, i) => {
          const { x, y } = latLonToXY(cluster.latitude, cluster.longitude)
          const size = Math.max(4, Math.min(20, Math.log(cluster.count + 1) * 3))

          return (
            <g key={i}>
              {/* Outer glow */}
              <circle
                cx={x}
                cy={y}
                r={size + 4}
                fill="#0019ff"
                opacity="0.2"
              />
              {/* Main circle */}
              <circle
                cx={x}
                cy={y}
                r={size}
                fill="#0019ff"
                opacity="0.9"
                className="cursor-pointer hover:opacity-100 transition-opacity"
              >
                <title>{cluster.city}, {cluster.country}: {cluster.count} nodes</title>
              </circle>
              {/* Node count label for larger clusters */}
              {cluster.count > 10 && (
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="white"
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
