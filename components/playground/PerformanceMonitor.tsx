'use client'

import { useState, useEffect } from 'react'
import { Activity, Zap, Clock, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Cpu, HardDrive, Network, BarChart3, PieChart, LineChart } from 'lucide-react'

interface PerformanceMetrics {
  compilationTime: number
  gasUsed: number
  memoryUsage: number
  cpuUsage: number
  networkLatency: number
  contractSize: number
  optimizationLevel: number
}

interface PerformanceHistory {
  timestamp: Date
  metric: string
  value: number
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    compilationTime: 0,
    gasUsed: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    networkLatency: 0,
    contractSize: 0,
    optimizationLevel: 0
  })

  const [history, setHistory] = useState<PerformanceHistory[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [activeMetric, setActiveMetric] = useState<'compilation' | 'gas' | 'memory' | 'cpu'>('compilation')

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        // Simulate real-time metrics
        const newMetrics: PerformanceMetrics = {
          compilationTime: Math.random() * 500 + 100,
          gasUsed: Math.floor(Math.random() * 100000 + 50000),
          memoryUsage: Math.random() * 80 + 20,
          cpuUsage: Math.random() * 60 + 10,
          networkLatency: Math.random() * 50 + 10,
          contractSize: Math.floor(Math.random() * 10000 + 5000),
          optimizationLevel: Math.floor(Math.random() * 100)
        }

        setMetrics(newMetrics)

        // Add to history
        setHistory(prev => [
          ...prev.slice(-19),
          {
            timestamp: new Date(),
            metric: activeMetric,
            value: newMetrics[activeMetric === 'compilation' ? 'compilationTime' :
                             activeMetric === 'gas' ? 'gasUsed' :
                             activeMetric === 'memory' ? 'memoryUsage' : 'cpuUsage']
          }
        ])
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isMonitoring, activeMetric])

  const getHealthStatus = () => {
    const avgGas = metrics.gasUsed
    const avgCompilation = metrics.compilationTime
    const avgMemory = metrics.memoryUsage

    if (avgGas < 70000 && avgCompilation < 300 && avgMemory < 50) {
      return { status: 'Excellent', color: 'text-green-600 bg-green-50 border-green-500', icon: CheckCircle }
    } else if (avgGas < 100000 && avgCompilation < 500 && avgMemory < 70) {
      return { status: 'Good', color: 'text-blue-600 bg-blue-50 border-blue-500', icon: CheckCircle }
    } else {
      return { status: 'Needs Optimization', color: 'text-orange-600 bg-orange-50 border-orange-500', icon: AlertCircle }
    }
  }

  const health = getHealthStatus()
  const HealthIcon = health.icon

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Activity size={20} className="text-purple-600" />
            Performance Monitor
          </h3>
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`flex items-center gap-2 px-4 py-2 rounded font-semibold transition-colors ${
              isMonitoring
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isMonitoring ? (
              <>
                <Activity size={16} className="animate-pulse" />
                Stop Monitoring
              </>
            ) : (
              <>
                <Activity size={16} />
                Start Monitoring
              </>
            )}
          </button>
        </div>

        {/* Health Status */}
        <div className={`flex items-center gap-3 p-4 border-2 rounded ${health.color}`}>
          <HealthIcon size={24} />
          <div>
            <div className="font-bold text-lg">System Health: {health.status}</div>
            <div className="text-sm opacity-80">
              {isMonitoring ? 'Real-time monitoring active' : 'Start monitoring to track performance'}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border-2 border-blue-500 rounded hover:shadow-lg transition-shadow cursor-pointer"
             onClick={() => setActiveMetric('compilation')}>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Clock size={18} />
            <span className="text-xs font-semibold">Compilation Time</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.compilationTime.toFixed(0)}ms</div>
          <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
            {metrics.compilationTime < 300 ? (
              <>
                <TrendingDown size={12} className="text-green-600" />
                <span className="text-green-600">Fast</span>
              </>
            ) : (
              <>
                <TrendingUp size={12} className="text-orange-600" />
                <span className="text-orange-600">Slow</span>
              </>
            )}
          </div>
        </div>

        <div className="p-4 bg-white border-2 border-purple-500 rounded hover:shadow-lg transition-shadow cursor-pointer"
             onClick={() => setActiveMetric('gas')}>
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Zap size={18} />
            <span className="text-xs font-semibold">Gas Usage</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.gasUsed.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
            {metrics.gasUsed < 70000 ? (
              <>
                <TrendingDown size={12} className="text-green-600" />
                <span className="text-green-600">Optimized</span>
              </>
            ) : (
              <>
                <TrendingUp size={12} className="text-orange-600" />
                <span className="text-orange-600">High</span>
              </>
            )}
          </div>
        </div>

        <div className="p-4 bg-white border-2 border-green-500 rounded hover:shadow-lg transition-shadow cursor-pointer"
             onClick={() => setActiveMetric('memory')}>
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <HardDrive size={18} />
            <span className="text-xs font-semibold">Memory Usage</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.memoryUsage.toFixed(1)}%</div>
          <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
            {metrics.memoryUsage < 50 ? (
              <>
                <TrendingDown size={12} className="text-green-600" />
                <span className="text-green-600">Normal</span>
              </>
            ) : (
              <>
                <TrendingUp size={12} className="text-orange-600" />
                <span className="text-orange-600">High</span>
              </>
            )}
          </div>
        </div>

        <div className="p-4 bg-white border-2 border-orange-500 rounded hover:shadow-lg transition-shadow cursor-pointer"
             onClick={() => setActiveMetric('cpu')}>
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <Cpu size={18} />
            <span className="text-xs font-semibold">CPU Usage</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.cpuUsage.toFixed(1)}%</div>
          <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
            {metrics.cpuUsage < 40 ? (
              <>
                <TrendingDown size={12} className="text-green-600" />
                <span className="text-green-600">Normal</span>
              </>
            ) : (
              <>
                <TrendingUp size={12} className="text-orange-600" />
                <span className="text-orange-600">High</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Chart */}
      <div className="bg-white border border-gray-200 rounded p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-900 flex items-center gap-2">
            <LineChart size={18} />
            Real-time Performance Metrics
          </h4>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveMetric('compilation')}
              className={`px-3 py-1 text-xs rounded ${activeMetric === 'compilation' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Compilation
            </button>
            <button
              onClick={() => setActiveMetric('gas')}
              className={`px-3 py-1 text-xs rounded ${activeMetric === 'gas' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Gas
            </button>
            <button
              onClick={() => setActiveMetric('memory')}
              className={`px-3 py-1 text-xs rounded ${activeMetric === 'memory' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Memory
            </button>
            <button
              onClick={() => setActiveMetric('cpu')}
              className={`px-3 py-1 text-xs rounded ${activeMetric === 'cpu' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              CPU
            </button>
          </div>
        </div>

        {/* Simple Chart Visualization */}
        <div className="relative h-48 border border-gray-200 rounded bg-gray-50 p-4">
          {history.length > 0 ? (
            <div className="flex items-end gap-1 h-full">
              {history.slice(-20).map((item, idx) => {
                const maxValue = activeMetric === 'compilation' ? 600 :
                                activeMetric === 'gas' ? 150000 : 100
                const height = (item.value / maxValue) * 100
                return (
                  <div
                    key={idx}
                    className={`flex-1 rounded-t transition-all ${
                      activeMetric === 'compilation' ? 'bg-blue-500' :
                      activeMetric === 'gas' ? 'bg-purple-500' :
                      activeMetric === 'memory' ? 'bg-green-500' :
                      'bg-orange-500'
                    }`}
                    style={{ height: `${Math.max(height, 2)}%` }}
                    title={`${item.value.toFixed(0)}`}
                  />
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              Start monitoring to see real-time data
            </div>
          )}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-gray-200 rounded">
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <Network size={18} />
            <span className="text-sm font-semibold">Network Latency</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{metrics.networkLatency.toFixed(1)}ms</div>
          <div className="text-xs text-gray-600 mt-1">Average response time</div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded">
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <BarChart3 size={18} />
            <span className="text-sm font-semibold">Contract Size</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{(metrics.contractSize / 1024).toFixed(2)} KB</div>
          <div className="text-xs text-gray-600 mt-1">Bytecode size</div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded">
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <PieChart size={18} />
            <span className="text-sm font-semibold">Optimization</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{metrics.optimizationLevel}%</div>
          <div className="text-xs text-gray-600 mt-1">Code efficiency score</div>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
        <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <AlertCircle size={18} />
          Performance Tips
        </h4>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Use memory instead of storage when possible to reduce gas costs</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Enable compiler optimization for production deployments</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Cache frequently accessed storage variables in memory</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Use appropriate data types to minimize storage usage</span>
          </div>
        </div>
      </div>
    </div>
  )
}
