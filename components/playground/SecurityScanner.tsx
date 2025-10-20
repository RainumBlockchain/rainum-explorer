'use client'

import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, XCircle, CheckCircle, Info } from 'lucide-react'

interface SecurityIssue {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  title: string
  description: string
  line?: number
  recommendation: string
}

interface SecurityScannerProps {
  code: string
  onScanComplete?: (issues: SecurityIssue[]) => void
}

export function SecurityScanner({ code, onScanComplete }: SecurityScannerProps) {
  const [scanning, setScanning] = useState(false)
  const [issues, setIssues] = useState<SecurityIssue[]>([])

  const scanCode = async () => {
    setScanning(true)

    // Simulate security analysis
    await new Promise(resolve => setTimeout(resolve, 2000))

    const detectedIssues: SecurityIssue[] = []

    // Check for common vulnerabilities
    if (code.includes('tx.origin')) {
      detectedIssues.push({
        id: '1',
        severity: 'high',
        title: 'Use of tx.origin',
        description: 'Using tx.origin for authorization can lead to phishing attacks',
        line: code.split('\n').findIndex(l => l.includes('tx.origin')) + 1,
        recommendation: 'Use msg.sender instead of tx.origin for authorization checks'
      })
    }

    if (code.includes('call.value') || code.includes('.call{value:')) {
      detectedIssues.push({
        id: '2',
        severity: 'critical',
        title: 'Reentrancy Vulnerability',
        description: 'External calls with value transfer can lead to reentrancy attacks',
        line: code.split('\n').findIndex(l => l.includes('call') && l.includes('value')) + 1,
        recommendation: 'Use the Checks-Effects-Interactions pattern or ReentrancyGuard'
      })
    }

    if (!code.includes('SafeMath') && code.match(/\+|\-|\*|\//)) {
      detectedIssues.push({
        id: '3',
        severity: 'medium',
        title: 'Arithmetic Operations Without SafeMath',
        description: 'Integer overflow/underflow possible in older Solidity versions',
        recommendation: 'Use Solidity 0.8.0+ with built-in overflow checks or SafeMath library'
      })
    }

    if (code.includes('selfdestruct')) {
      detectedIssues.push({
        id: '4',
        severity: 'high',
        title: 'Use of selfdestruct',
        description: 'selfdestruct can lead to loss of funds and contract state',
        line: code.split('\n').findIndex(l => l.includes('selfdestruct')) + 1,
        recommendation: 'Consider alternative patterns like pausable or upgradeable contracts'
      })
    }

    if (!code.includes('public') && !code.includes('private') && !code.includes('internal')) {
      detectedIssues.push({
        id: '5',
        severity: 'medium',
        title: 'Missing Visibility Modifiers',
        description: 'Functions without explicit visibility can lead to unexpected access',
        recommendation: 'Always specify visibility (public, private, internal, external)'
      })
    }

    if (code.includes('now')) {
      detectedIssues.push({
        id: '6',
        severity: 'low',
        title: 'Use of deprecated "now"',
        description: 'The "now" keyword is deprecated in newer Solidity versions',
        line: code.split('\n').findIndex(l => l.includes('now')) + 1,
        recommendation: 'Use block.timestamp instead of now'
      })
    }

    // Add info messages
    if (code.includes('pragma solidity')) {
      const version = code.match(/pragma solidity \^?(\d+\.\d+\.\d+)/)?.[1]
      if (version && parseFloat(version) < 0.8) {
        detectedIssues.push({
          id: '7',
          severity: 'info',
          title: 'Older Solidity Version',
          description: `Using Solidity ${version}. Consider upgrading to 0.8.0+ for built-in safety features`,
          recommendation: 'Upgrade to Solidity 0.8.0 or later for automatic overflow checks'
        })
      }
    }

    setIssues(detectedIssues)
    setScanning(false)

    if (onScanComplete) {
      onScanComplete(detectedIssues)
    }
  }

  useEffect(() => {
    if (code) {
      scanCode()
    }
  }, [code])

  const getSeverityColor = (severity: SecurityIssue['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-500 text-red-900'
      case 'high': return 'bg-orange-50 border-orange-500 text-orange-900'
      case 'medium': return 'bg-yellow-50 border-yellow-500 text-yellow-900'
      case 'low': return 'bg-blue-50 border-blue-500 text-blue-900'
      case 'info': return 'bg-gray-50 border-gray-500 text-gray-900'
    }
  }

  const getSeverityIcon = (severity: SecurityIssue['severity']) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <XCircle size={20} className="text-red-600" />
      case 'medium':
        return <AlertTriangle size={20} className="text-yellow-600" />
      case 'low':
        return <Info size={20} className="text-blue-600" />
      case 'info':
        return <Info size={20} className="text-gray-600" />
    }
  }

  const criticalCount = issues.filter(i => i.severity === 'critical').length
  const highCount = issues.filter(i => i.severity === 'high').length
  const mediumCount = issues.filter(i => i.severity === 'medium').length
  const lowCount = issues.filter(i => i.severity === 'low').length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield size={24} className={issues.length === 0 ? 'text-green-600' : 'text-red-600'} />
          <div>
            <h3 className="text-lg font-bold text-gray-900">Security Scanner</h3>
            <p className="text-sm text-gray-600">
              {scanning ? 'Scanning for vulnerabilities...' :
               issues.length === 0 ? 'No issues found' :
               `${issues.length} issue(s) detected`}
            </p>
          </div>
        </div>
        <button
          onClick={scanCode}
          disabled={scanning}
          className="px-4 py-2 bg-[#0019ff] text-white rounded font-semibold hover:bg-[#0015cc] transition-colors disabled:opacity-50"
        >
          {scanning ? 'Scanning...' : 'Re-scan'}
        </button>
      </div>

      {/* Summary */}
      {issues.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {criticalCount > 0 && (
            <div className="p-3 bg-red-50 border-2 border-red-500 rounded text-center">
              <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
              <div className="text-xs text-red-700">Critical</div>
            </div>
          )}
          {highCount > 0 && (
            <div className="p-3 bg-orange-50 border-2 border-orange-500 rounded text-center">
              <div className="text-2xl font-bold text-orange-600">{highCount}</div>
              <div className="text-xs text-orange-700">High</div>
            </div>
          )}
          {mediumCount > 0 && (
            <div className="p-3 bg-yellow-50 border-2 border-yellow-500 rounded text-center">
              <div className="text-2xl font-bold text-yellow-600">{mediumCount}</div>
              <div className="text-xs text-yellow-700">Medium</div>
            </div>
          )}
          {lowCount > 0 && (
            <div className="p-3 bg-blue-50 border-2 border-blue-500 rounded text-center">
              <div className="text-2xl font-bold text-blue-600">{lowCount}</div>
              <div className="text-xs text-blue-700">Low</div>
            </div>
          )}
        </div>
      )}

      {/* Issues List */}
      {scanning ? (
        <div className="text-center py-12">
          <Shield size={48} className="mx-auto mb-4 text-gray-300 animate-pulse" />
          <p className="text-gray-500">Analyzing code for security vulnerabilities...</p>
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-12 bg-green-50 border-2 border-green-500 rounded">
          <CheckCircle size={48} className="mx-auto mb-4 text-green-600" />
          <h4 className="text-xl font-bold text-green-900 mb-2">All Clear!</h4>
          <p className="text-green-700">No security issues detected in your code</p>
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className={`p-4 rounded border-l-4 ${getSeverityColor(issue.severity)}`}
            >
              <div className="flex items-start gap-3">
                {getSeverityIcon(issue.severity)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      issue.severity === 'critical' ? 'bg-red-600' :
                      issue.severity === 'high' ? 'bg-orange-600' :
                      issue.severity === 'medium' ? 'bg-yellow-600' :
                      issue.severity === 'low' ? 'bg-blue-600' :
                      'bg-gray-600'
                    } text-white uppercase`}>
                      {issue.severity}
                    </span>
                    {issue.line && (
                      <span className="text-xs text-gray-600">Line {issue.line}</span>
                    )}
                  </div>
                  <h4 className="font-bold mb-1">{issue.title}</h4>
                  <p className="text-sm mb-2">{issue.description}</p>
                  <div className="p-2 bg-white/50 rounded text-sm">
                    <strong>Recommendation:</strong> {issue.recommendation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
