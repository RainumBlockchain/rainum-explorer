'use client'

interface CountryData {
  country: string
  count: number
}

interface NodesRankingProps {
  data: CountryData[]
}

export function NodesRanking({ data }: NodesRankingProps) {
  const maxCount = Math.max(...data.map(d => d.count), 1)

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Nodes Ranking
      </h3>
      <p className="text-sm text-gray-500 mb-8">Ranked by country and region</p>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-6">
            {/* Country name */}
            <div className="w-48 text-sm text-gray-600">
              {item.country}
            </div>

            {/* Bar with count */}
            <div className="flex-1 flex items-center gap-3">
              <div className="flex-1 h-8 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-700 ease-out"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
              <div className="w-16 text-right text-sm font-semibold text-gray-900">
                {item.count}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
