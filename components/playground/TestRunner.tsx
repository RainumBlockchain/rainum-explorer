'use client'

import { useState } from 'react'
import { Play, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'

interface Test {
  id: string
  name: string
  code: string
  status: 'pending' | 'running' | 'passed' | 'failed'
  duration?: number
  error?: string
}

interface TestRunnerProps {
  contractCode: string
  onTestComplete?: (results: any) => void
}

export function TestRunner({ contractCode, onTestComplete }: TestRunnerProps) {
  const [tests, setTests] = useState<Test[]>([
    {
      id: '1',
      name: 'Should deploy successfully',
      code: 'await contract.deploy()',
      status: 'pending'
    },
    {
      id: '2',
      name: 'Should set value correctly',
      code: 'await contract.set(42); expect(await contract.get()).to.equal(42)',
      status: 'pending'
    },
    {
      id: '3',
      name: 'Should emit ValueChanged event',
      code: 'await expect(contract.set(100)).to.emit(contract, "ValueChanged")',
      status: 'pending'
    }
  ])
  const [running, setRunning] = useState(false)

  const runTests = async () => {
    setRunning(true)

    // Simulate test execution
    for (let i = 0; i < tests.length; i++) {
      setTests(prev => prev.map((t, idx) =>
        idx === i ? { ...t, status: 'running' } : t
      ))

      await new Promise(resolve => setTimeout(resolve, 1000))

      const passed = Math.random() > 0.3 // 70% pass rate for demo
      setTests(prev => prev.map((t, idx) =>
        idx === i ? {
          ...t,
          status: passed ? 'passed' : 'failed',
          duration: Math.floor(Math.random() * 500) + 100,
          error: passed ? undefined : 'Expected value to be 42, but got 0'
        } : t
      ))
    }

    setRunning(false)
    if (onTestComplete) {
      onTestComplete({ passed: tests.filter(t => t.status === 'passed').length, total: tests.length })
    }
  }

  const getStatusIcon = (status: Test['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle size={16} className="text-green-600" />
      case 'failed':
        return <XCircle size={16} className="text-red-600" />
      case 'running':
        return <Clock size={16} className="text-blue-600 animate-spin" />
      default:
        return <Clock size={16} className="text-gray-400" />
    }
  }

  const passedCount = tests.filter(t => t.status === 'passed').length
  const failedCount = tests.filter(t => t.status === 'failed').length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Test Suite</h3>
          <p className="text-sm text-gray-600">
            {passedCount} passed, {failedCount} failed, {tests.length} total
          </p>
        </div>
        <button
          onClick={runTests}
          disabled={running}
          className="flex items-center gap-2 px-4 py-2 bg-[#0019ff] text-white rounded font-semibold hover:bg-[#0015cc] transition-colors disabled:opacity-50"
        >
          <Play size={16} />
          {running ? 'Running...' : 'Run Tests'}
        </button>
      </div>

      <div className="space-y-2">
        {tests.map((test) => (
          <div
            key={test.id}
            className={`p-4 rounded border ${
              test.status === 'passed' ? 'bg-green-50 border-green-200' :
              test.status === 'failed' ? 'bg-red-50 border-red-200' :
              test.status === 'running' ? 'bg-blue-50 border-blue-200' :
              'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {getStatusIcon(test.status)}
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{test.name}</div>
                <code className="text-xs text-gray-600 font-mono block mt-1">{test.code}</code>
                {test.duration && (
                  <div className="text-xs text-gray-500 mt-1">{test.duration}ms</div>
                )}
                {test.error && (
                  <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800">
                    {test.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
