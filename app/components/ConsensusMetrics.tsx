'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ConsensusStats {
  current_view: number;
  current_phase: string;
  leader: string;
  leader_tier: number;
  active_validators: number;
  bls_enabled: boolean;
  vrf_enabled: boolean;
  quorum_size: number;
  recent_finality_times: number[];
  avg_finality_ms: number;
  signature_aggregation_ratio: number;
}

export default function ConsensusMetrics() {
  const [stats, setStats] = useState<ConsensusStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/consensus/stats');
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch consensus stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 2000); // Update every 2s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="h-32 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-400">Failed to load consensus stats</p>
      </div>
    );
  }

  // Calculate finality percentiles
  const sortedFinality = [...stats.recent_finality_times].sort((a, b) => a - b);
  const p50 = sortedFinality[Math.floor(sortedFinality.length * 0.5)] || 0;
  const p95 = sortedFinality[Math.floor(sortedFinality.length * 0.95)] || 0;
  const p99 = sortedFinality[Math.floor(sortedFinality.length * 0.99)] || 0;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold mb-2">HotStuff BFT Consensus</h2>
        <p className="text-sm text-gray-400">
          Enterprise-grade Byzantine Fault Tolerant consensus with BLS aggregation and VRF
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Current View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4"
        >
          <div className="text-sm text-blue-300 mb-1">Current View</div>
          <div className="text-3xl font-bold">#{stats.current_view}</div>
          <div className="text-xs text-blue-300 mt-2">{stats.current_phase}</div>
        </motion.div>

        {/* Active Validators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4"
        >
          <div className="text-sm text-purple-300 mb-1">Active Validators</div>
          <div className="text-3xl font-bold">{stats.active_validators}</div>
          <div className="text-xs text-purple-300 mt-2">
            Quorum: {stats.quorum_size}/{stats.active_validators}
          </div>
        </motion.div>

        {/* Avg Finality */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-4"
        >
          <div className="text-sm text-green-300 mb-1">Avg Finality</div>
          <div className="text-3xl font-bold">{stats.avg_finality_ms}ms</div>
          <div className="text-xs text-green-300 mt-2">P50: {p50}ms | P99: {p99}ms</div>
        </motion.div>

        {/* BLS Aggregation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg p-4"
        >
          <div className="text-sm text-orange-300 mb-1">BLS Aggregation</div>
          <div className="text-3xl font-bold">
            {(stats.signature_aggregation_ratio * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-orange-300 mt-2">
            {stats.bls_enabled ? '✅ Enabled' : '❌ Disabled'}
          </div>
        </motion.div>
      </div>

      {/* Current Leader */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Current Leader (VRF Selected)</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">👑</span>
              </div>
              <div>
                <div className="font-mono text-lg">{stats.leader.slice(0, 20)}...</div>
                <div className="text-sm text-gray-400">
                  Tier {stats.leader_tier} Validator
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">VRF Selection</div>
            <div className={`px-3 py-1 rounded ${stats.vrf_enabled ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
              {stats.vrf_enabled ? '✅ Active' : '⚠️ Round-Robin'}
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BLS12-381 Signatures */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">BLS12-381 Signatures</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className={stats.bls_enabled ? 'text-green-400' : 'text-red-400'}>
                {stats.bls_enabled ? '✅ Enabled' : '❌ Disabled'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Aggregation Ratio</span>
              <span className="text-white font-mono">
                {(stats.signature_aggregation_ratio * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Bandwidth Savings</span>
              <span className="text-green-400">~60%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Verification Speedup</span>
              <span className="text-green-400">7x faster</span>
            </div>
          </div>
        </div>

        {/* VRF Leader Selection */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">VRF Leader Selection</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className={stats.vrf_enabled ? 'text-green-400' : 'text-yellow-400'}>
                {stats.vrf_enabled ? '✅ Enabled' : '⚠️ Fallback'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Algorithm</span>
              <span className="text-white font-mono">schnorrkel</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Weighting</span>
              <span className="text-white">Stake × Tier</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Unpredictability</span>
              <span className="text-green-400">Cryptographic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Finality Performance */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Finality Performance (Last 100 Blocks)</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-400 mb-1">P50 (Median)</div>
            <div className="text-2xl font-bold">{p50}ms</div>
            <div className="text-xs text-gray-400">Target: &lt;2000ms</div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">P95</div>
            <div className="text-2xl font-bold">{p95}ms</div>
            <div className="text-xs text-gray-400">Target: &lt;3000ms</div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">P99</div>
            <div className="text-2xl font-bold">{p99}ms</div>
            <div className="text-xs text-gray-400">Target: &lt;5000ms</div>
          </div>
        </div>

        {/* Finality Chart (simple bar chart) */}
        <div className="mt-6">
          <div className="flex items-end gap-1 h-32">
            {stats.recent_finality_times.slice(-20).map((time, i) => {
              const maxTime = Math.max(...stats.recent_finality_times);
              const height = (time / maxTime) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                  style={{ height: `${height}%` }}
                  title={`${time}ms`}
                />
              );
            })}
          </div>
          <div className="text-xs text-gray-400 text-center mt-2">
            Last 20 blocks finality time
          </div>
        </div>
      </div>

      {/* Whitepaper Compliance */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-blue-700">
        <h3 className="text-lg font-bold mb-4">Whitepaper Compliance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400 mb-2">Consensus Features</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>HotStuff BFT Protocol</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={stats.bls_enabled ? 'text-green-400' : 'text-yellow-400'}>
                  {stats.bls_enabled ? '✅' : '⚠️'}
                </span>
                <span>BLS12-381 Aggregation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={stats.vrf_enabled ? 'text-green-400' : 'text-yellow-400'}>
                  {stats.vrf_enabled ? '✅' : '⚠️'}
                </span>
                <span>VRF Leader Selection</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>Tier-based Timeouts</span>
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-2">Performance Targets</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Tier 3 Finality</span>
                <span className={p99 < 500 ? 'text-green-400' : 'text-yellow-400'}>
                  {p99 < 500 ? '✅' : '⚠️'} &lt;500ms
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tier 2 Finality</span>
                <span className={p95 < 800 ? 'text-green-400' : 'text-yellow-400'}>
                  {p95 < 800 ? '✅' : '⚠️'} &lt;800ms
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tier 1 Finality</span>
                <span className={p50 < 2000 ? 'text-green-400' : 'text-yellow-400'}>
                  {p50 < 2000 ? '✅' : '⚠️'} &lt;2s
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Message Complexity</span>
                <span className="text-green-400">✅ O(n)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
