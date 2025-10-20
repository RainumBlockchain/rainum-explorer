'use client'

import { useState, useEffect } from 'react'
import { Flame, TrendingUp, TrendingDown, Info, Zap, AlertTriangle } from 'lucide-react'

interface LineGasCost {
  line: number
  gas: number
  code: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  recommendation?: string
}

interface GasHeatmapProps {
  code: string
  compilationResult?: {
    bytecode?: string
    gas_estimate?: number
  }
}

export function GasHeatmap({ code, compilationResult }: GasHeatmapProps) {
  const [lineGasCosts, setLineGasCosts] = useState<LineGasCost[]>([])
  const [selectedLine, setSelectedLine] = useState<LineGasCost | null>(null)
  const [sortBy, setSortBy] = useState<'line' | 'gas'>('gas')

  useEffect(() => {
    if (code && compilationResult?.bytecode) {
      analyzeGasCosts()
    }
  }, [code, compilationResult])

  const analyzeGasCosts = () => {
    const lines = code.split('\n')
    const costs: LineGasCost[] = []

    lines.forEach((lineCode, index) => {
      const lineNum = index + 1
      let gas = 0
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
      let recommendation = ''

      // Storage operations (SSTORE = 20,000 gas for new value, 5,000 for existing)
      if (lineCode.includes('=') && !lineCode.includes('memory') && !lineCode.includes('//')) {
        if (lineCode.includes('mapping') || lineCode.includes('storage')) {
          gas = 20000
          severity = 'critical'
          recommendation = 'Storage write detected. Consider using memory for temporary data.'
        } else if (lineCode.match(/\w+\s*=\s*\w+/)) {
          gas = 5000
          severity = 'high'
          recommendation = 'State variable modification. Cache in memory if used multiple times.'
        }
      }

      // Loop operations (high gas if unbounded)
      if (lineCode.includes('for') || lineCode.includes('while')) {
        gas = 10000
        severity = 'high'
        recommendation = 'Loop detected. Ensure bounded iteration to avoid gas limit errors.'
      }

      // External calls (CALL = 700 base + transfer costs)
      if (lineCode.includes('.call') || lineCode.includes('.transfer') || lineCode.includes('.send')) {
        gas = 9000
        severity = 'high'
        recommendation = 'External call detected. Use checks-effects-interactions pattern.'
      }

      // Contract creation (CREATE = 32,000 gas)
      if (lineCode.includes('new ') && lineCode.includes('(')) {
        gas = 32000
        severity = 'critical'
        recommendation = 'Contract deployment. Very expensive operation.'
      }

      // SLOAD operations (storage read = 2,100 gas for warm, 2,100 for cold)
      if (lineCode.match(/\breturn\s+\w+/) && !lineCode.includes('memory')) {
        gas = 2100
        severity = 'medium'
        recommendation = 'Storage read. Cache in memory if used multiple times in same transaction.'
      }

      // Event emissions (LOG = 375 + 375 per topic + 8 gas per byte)
      if (lineCode.includes('emit ')) {
        gas = 1500
        severity = 'low'
        recommendation = 'Event emission. Relatively cheap for off-chain logging.'
      }

      // Function calls (internal = 24 gas, external = 700+ gas)
      if (lineCode.match(/\w+\(.*\)/) && !lineCode.includes('function') && !lineCode.includes('//')) {
        if (lineCode.includes('this.') || lineCode.includes('address(')) {
          gas = 2600
          severity = 'medium'
          recommendation = 'External function call. Consider making it internal if possible.'
        } else {
          gas = 100
          severity = 'low'
          recommendation = 'Internal function call. Efficient operation.'
        }
      }

      // Memory operations (MSTORE = 3 gas)
      if (lineCode.includes('memory')) {
        gas = 50
        severity = 'low'
        recommendation = 'Memory operation. Cheap compared to storage.'
      }

      // Arithmetic operations (ADD/SUB/MUL = 3-5 gas, DIV/MOD = 5 gas)
      if (lineCode.match(/[+\-*/%]/) && !lineCode.includes('//')) {
        gas = 10
        severity = 'low'
        recommendation = 'Arithmetic operation. Very cheap.'
      }

      // Require/assert (validation = varies)
      if (lineCode.includes('require') || lineCode.includes('assert')) {
        gas = 200
        severity = 'low'
        recommendation = 'Input validation. Essential for security. Use require for user input.'
      }

      if (gas > 0 && lineCode.trim() && !lineCode.trim().startsWith('//')) {
        costs.push({
          line: lineNum,
          gas,
          code: lineCode.trim(),
          severity,
          recommendation
        })
      }
    })

    setLineGasCosts(costs)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getSeverityBorder = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500'
      case 'high': return 'border-orange-500'
      case 'medium': return 'border-yellow-500'
      case 'low': return 'border-green-500'
      default: return 'border-gray-500'
    }
  }

  const getHeatIntensity = (gas: number) => {
    if (gas >= 20000) return 'bg-red-500/90'
    if (gas >= 10000) return 'bg-orange-500/80'
    if (gas >= 5000) return 'bg-yellow-500/70'
    if (gas >= 1000) return 'bg-blue-500/60'
    return 'bg-green-500/50'
  }

  const sortedLines = [...lineGasCosts].sort((a, b) => {
    if (sortBy === 'gas') return b.gas - a.gas
    return a.line - b.line
  })

  const totalGas = lineGasCosts.reduce((sum, item) => sum + item.gas, 0)
  const avgGas = lineGasCosts.length > 0 ? Math.round(totalGas / lineGasCosts.length) : 0
  const maxGas = Math.max(...lineGasCosts.map(l => l.gas), 0)
  const criticalLines = lineGasCosts.filter(l => l.severity === 'critical').length
  const highLines = lineGasCosts.filter(l => l.severity === 'high').length

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500 rounded">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Zap size={18} />
            <span className="text-xs font-semibold">Total Gas</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{totalGas.toLocaleString()}</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-500 rounded">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <TrendingUp size={18} />
            <span className="text-xs font-semibold">Average Gas</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{avgGas.toLocaleString()}</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-500 rounded">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <Flame size={18} />
            <span className="text-xs font-semibold">Peak Gas</span>
          </div>
          <div className="text-2xl font-bold text-orange-900">{maxGas.toLocaleString()}</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-500 rounded">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertTriangle size={18} />
            <span className="text-xs font-semibold">Hot Spots</span>
          </div>
          <div className="text-2xl font-bold text-red-900">{criticalLines + highLines}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Flame size={20} className="text-orange-500" />
          Gas Heatmap ({lineGasCosts.length} lines analyzed)
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <button
            onClick={() => setSortBy('gas')}
            className={`px-3 py-1 text-sm rounded ${
              sortBy === 'gas' ? 'bg-[#0019ff] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Gas Cost
          </button>
          <button
            onClick={() => setSortBy('line')}
            className={`px-3 py-1 text-sm rounded ${
              sortBy === 'line' ? 'bg-[#0019ff] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Line Number
          </button>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid gap-2">
        {sortedLines.length > 0 ? (
          sortedLines.map((item) => (
            <div
              key={item.line}
              onClick={() => setSelectedLine(item)}
              className={`p-4 border-2 rounded cursor-pointer transition-all hover:scale-[1.02] ${
                getSeverityBorder(item.severity)
              } ${
                selectedLine?.line === item.line ? 'ring-4 ring-[#0019ff] ring-opacity-50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Line indicator */}
                <div className="flex-shrink-0 w-16">
                  <div className="text-xs text-gray-500 mb-1">Line {item.line}</div>
                  <div className={`w-full h-2 rounded ${getHeatIntensity(item.gas)}`}></div>
                </div>

                {/* Code */}
                <div className="flex-1 min-w-0">
                  <code className="text-sm text-gray-800 font-mono block truncate">{item.code}</code>
                  {item.recommendation && selectedLine?.line === item.line && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 flex items-start gap-2">
                      <Info size={14} className="flex-shrink-0 mt-0.5" />
                      <span>{item.recommendation}</span>
                    </div>
                  )}
                </div>

                {/* Gas cost badge */}
                <div className="flex-shrink-0 flex flex-col items-end gap-1">
                  <span className={`px-3 py-1 ${getSeverityColor(item.severity)} text-white text-xs font-bold rounded-full uppercase`}>
                    {item.severity}
                  </span>
                  <span className="text-lg font-bold text-gray-900">{item.gas.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">gas</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Flame size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-semibold">No gas analysis available</p>
            <p className="text-sm mt-1">Compile your code to see line-by-line gas costs</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded">
        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Info size={16} />
          Severity Legend
        </h4>
        <div className="grid md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-xs text-gray-700"><strong>Critical:</strong> 20,000+ gas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-xs text-gray-700"><strong>High:</strong> 5,000-20,000 gas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-xs text-gray-700"><strong>Medium:</strong> 1,000-5,000 gas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-xs text-gray-700"><strong>Low:</strong> &lt;1,000 gas</span>
          </div>
        </div>
      </div>
    </div>
  )
}
