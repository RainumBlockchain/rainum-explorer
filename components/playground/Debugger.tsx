'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, StepForward, ArrowDownCircle, ArrowUpCircle, RotateCcw, Circle, CircleOff, Bug, Eye, List as ListIcon, Terminal, AlertCircle, CheckCircle } from 'lucide-react'

interface Breakpoint {
  line: number
  enabled: boolean
}

interface Variable {
  name: string
  value: string
  type: string
  scope: 'local' | 'state' | 'memory'
}

interface StackFrame {
  function: string
  line: number
  file: string
}

interface DebuggerProps {
  code: string
  onBreakpointToggle?: (line: number) => void
  breakpoints?: number[]
}

export function Debugger({ code, onBreakpointToggle, breakpoints = [] }: DebuggerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentLine, setCurrentLine] = useState<number | null>(null)
  const [localBreakpoints, setLocalBreakpoints] = useState<Breakpoint[]>([])
  const [variables, setVariables] = useState<Variable[]>([])
  const [callStack, setCallStack] = useState<StackFrame[]>([])
  const [console, setConsole] = useState<Array<{ type: 'log' | 'error' | 'warning', message: string }>>([])
  const [activeTab, setActiveTab] = useState<'variables' | 'callstack' | 'console'>('variables')

  useEffect(() => {
    // Initialize breakpoints only once when component mounts
    if (breakpoints.length > 0 && localBreakpoints.length === 0) {
      const bps: Breakpoint[] = breakpoints.map(line => ({ line, enabled: true }))
      setLocalBreakpoints(bps)
    }
  }, [breakpoints.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleBreakpoint = (line: number) => {
    const existing = localBreakpoints.find(bp => bp.line === line)
    if (existing) {
      setLocalBreakpoints(localBreakpoints.filter(bp => bp.line !== line))
    } else {
      setLocalBreakpoints([...localBreakpoints, { line, enabled: true }])
    }
    onBreakpointToggle?.(line)
  }

  const startDebugging = () => {
    setIsRunning(true)
    setIsPaused(false)
    setCurrentLine(1)
    addConsoleMessage('log', '🐛 Debug session started')

    // Simulate initial state
    setVariables([
      { name: 'value', value: '0', type: 'uint256', scope: 'state' },
      { name: 'msg.sender', value: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', type: 'address', scope: 'memory' },
      { name: 'msg.value', value: '0', type: 'uint256', scope: 'memory' }
    ])

    setCallStack([
      { function: 'set(uint256)', line: 1, file: 'Contract.sol' }
    ])
  }

  const pauseDebugging = () => {
    setIsPaused(!isPaused)
    addConsoleMessage('warning', isPaused ? '▶️ Resumed execution' : '⏸️ Paused execution')
  }

  const stopDebugging = () => {
    setIsRunning(false)
    setIsPaused(false)
    setCurrentLine(null)
    setVariables([])
    setCallStack([])
    addConsoleMessage('log', '🛑 Debug session ended')
  }

  const stepOver = () => {
    if (!isRunning) return
    const nextLine = (currentLine || 0) + 1
    const lines = code.split('\n')
    if (nextLine <= lines.length) {
      setCurrentLine(nextLine)
      addConsoleMessage('log', `Step: Line ${nextLine}`)

      // Simulate variable changes
      updateVariablesForLine(nextLine, lines[nextLine - 1])
    } else {
      stopDebugging()
    }
  }

  const stepInto = () => {
    if (!isRunning) return
    const nextLine = (currentLine || 0) + 1
    setCurrentLine(nextLine)
    addConsoleMessage('log', `Step into: Line ${nextLine}`)

    // Simulate entering a function
    const lines = code.split('\n')
    const line = lines[nextLine - 1]
    if (line?.includes('function')) {
      setCallStack([
        { function: 'get()', line: nextLine, file: 'Contract.sol' },
        ...callStack
      ])
    }
  }

  const stepOut = () => {
    if (!isRunning || callStack.length <= 1) return
    const parent = callStack[1]
    setCurrentLine(parent.line)
    setCallStack(callStack.slice(1))
    addConsoleMessage('log', `Step out: Returned to ${parent.function}`)
  }

  const updateVariablesForLine = (line: number, lineCode: string) => {
    // Simulate variable updates based on code
    if (lineCode.includes('value =')) {
      const match = lineCode.match(/value\s*=\s*(\d+|_value)/)
      if (match) {
        setVariables(prev => prev.map(v =>
          v.name === 'value' ? { ...v, value: match[1] === '_value' ? '42' : match[1] } : v
        ))
      }
    }

    if (lineCode.includes('emit')) {
      addConsoleMessage('log', `📡 Event: ValueChanged(${variables.find(v => v.name === 'value')?.value || '0'})`)
    }
  }

  const addConsoleMessage = (type: 'log' | 'error' | 'warning', message: string) => {
    setConsole(prev => [...prev, { type, message }])
  }

  const getLineNumbers = () => {
    return code.split('\n').map((line, idx) => ({
      number: idx + 1,
      code: line,
      hasBreakpoint: localBreakpoints.some(bp => bp.line === idx + 1 && bp.enabled),
      isCurrent: currentLine === idx + 1
    }))
  }

  const getVariableColor = (scope: string) => {
    switch (scope) {
      case 'state': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'local': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'memory': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Debugger Controls */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Bug size={20} className="text-blue-600" />
            Smart Contract Debugger
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            {isRunning && (
              <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded font-semibold">
                <Circle size={8} className="fill-current animate-pulse" />
                {isPaused ? 'Paused' : 'Running'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              onClick={startDebugging}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-semibold transition-colors"
            >
              <Play size={16} />
              Start Debug
            </button>
          ) : (
            <>
              <button
                onClick={pauseDebugging}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded font-semibold transition-colors"
              >
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={stopDebugging}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold transition-colors"
              >
                <CircleOff size={16} />
                Stop
              </button>
              <div className="w-px h-8 bg-gray-300 mx-2"></div>
              <button
                onClick={stepOver}
                disabled={!isPaused && isRunning}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Step Over (F10)"
              >
                <StepForward size={16} />
                Step Over
              </button>
              <button
                onClick={stepInto}
                disabled={!isPaused && isRunning}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Step Into (F11)"
              >
                <ArrowDownCircle size={16} />
                Into
              </button>
              <button
                onClick={stepOut}
                disabled={!isPaused && isRunning}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Step Out (Shift+F11)"
              >
                <ArrowUpCircle size={16} />
                Out
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Code with Breakpoints */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <Terminal size={18} />
              Code Execution
            </h4>
          </div>
          <div className="p-4 max-h-[500px] overflow-y-auto bg-[#1e1e1e]">
            {getLineNumbers().map(({ number, code: lineCode, hasBreakpoint, isCurrent }) => (
              <div
                key={number}
                className={`flex items-center gap-2 font-mono text-sm py-1 ${
                  isCurrent ? 'bg-yellow-400/20 border-l-4 border-yellow-400' : ''
                }`}
              >
                <button
                  onClick={() => toggleBreakpoint(number)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-red-500/20 rounded transition-colors"
                  title="Toggle breakpoint"
                >
                  {hasBreakpoint ? (
                    <Circle size={12} className="fill-red-500 text-red-500" />
                  ) : (
                    <CircleOff size={12} className="text-gray-600 opacity-0 hover:opacity-50" />
                  )}
                </button>
                <span className="text-gray-500 w-10 text-right select-none">{number}</span>
                <span className={`${isCurrent ? 'text-yellow-300 font-bold' : 'text-gray-300'}`}>
                  {lineCode || ' '}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Debug Info Panel */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setActiveTab('variables')}
              className={`flex-1 px-4 py-3 font-semibold text-sm ${
                activeTab === 'variables' ? 'bg-white border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Eye size={16} className="inline mr-2" />
              Variables
            </button>
            <button
              onClick={() => setActiveTab('callstack')}
              className={`flex-1 px-4 py-3 font-semibold text-sm ${
                activeTab === 'callstack' ? 'bg-white border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ListIcon size={16} className="inline mr-2" />
              Call Stack
            </button>
            <button
              onClick={() => setActiveTab('console')}
              className={`flex-1 px-4 py-3 font-semibold text-sm ${
                activeTab === 'console' ? 'bg-white border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Terminal size={16} className="inline mr-2" />
              Console
            </button>
          </div>

          <div className="p-4 max-h-[500px] overflow-y-auto">
            {/* Variables Tab */}
            {activeTab === 'variables' && (
              <div className="space-y-2">
                {variables.length > 0 ? (
                  variables.map((variable, idx) => (
                    <div key={idx} className={`p-3 border rounded ${getVariableColor(variable.scope)}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-sm font-bold">{variable.name}</span>
                        <span className="text-xs uppercase font-semibold opacity-70">{variable.scope}</span>
                      </div>
                      <div className="text-xs opacity-70 mb-1">{variable.type}</div>
                      <div className="font-mono text-sm font-bold">{variable.value}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Eye size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-sm">Start debugging to see variables</p>
                  </div>
                )}
              </div>
            )}

            {/* Call Stack Tab */}
            {activeTab === 'callstack' && (
              <div className="space-y-2">
                {callStack.length > 0 ? (
                  callStack.map((frame, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="font-mono text-sm font-bold text-blue-600">{frame.function}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {frame.file}:{frame.line}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <ListIcon size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-sm">Start debugging to see call stack</p>
                  </div>
                )}
              </div>
            )}

            {/* Console Tab */}
            {activeTab === 'console' && (
              <div className="space-y-1">
                {console.length > 0 ? (
                  console.map((entry, idx) => (
                    <div key={idx} className={`p-2 rounded text-xs font-mono flex items-start gap-2 ${
                      entry.type === 'error' ? 'bg-red-50 text-red-700' :
                      entry.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {entry.type === 'error' ? <AlertCircle size={14} className="flex-shrink-0 mt-0.5" /> :
                       entry.type === 'warning' ? <AlertCircle size={14} className="flex-shrink-0 mt-0.5" /> :
                       <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />}
                      <span>{entry.message}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Terminal size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-sm">Console output will appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
        <strong>Keyboard Shortcuts:</strong> F5 = Start/Continue | F10 = Step Over | F11 = Step Into | Shift+F11 = Step Out | Shift+F5 = Stop
      </div>
    </div>
  )
}
