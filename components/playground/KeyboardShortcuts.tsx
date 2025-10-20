'use client'

import { Keyboard, X } from 'lucide-react'

interface Shortcut {
  keys: string[]
  description: string
  category: string
}

interface KeyboardShortcutsProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  if (!isOpen) return null

  const shortcuts: Shortcut[] = [
    // Editor
    { keys: ['⌘', 'S'], description: 'Save file', category: 'Editor' },
    { keys: ['⌘', 'F'], description: 'Find', category: 'Editor' },
    { keys: ['⌘', 'H'], description: 'Replace', category: 'Editor' },
    { keys: ['⌘', 'Z'], description: 'Undo', category: 'Editor' },
    { keys: ['⌘', '⇧', 'Z'], description: 'Redo', category: 'Editor' },
    { keys: ['⌘', '/'], description: 'Toggle comment', category: 'Editor' },
    { keys: ['⌘', 'D'], description: 'Duplicate line', category: 'Editor' },
    { keys: ['⌥', '↑'], description: 'Move line up', category: 'Editor' },
    { keys: ['⌥', '↓'], description: 'Move line down', category: 'Editor' },

    // Compilation
    { keys: ['⌘', 'Enter'], description: 'Compile code', category: 'Compilation' },
    { keys: ['⌘', 'R'], description: 'Run tests', category: 'Compilation' },
    { keys: ['⌘', 'B'], description: 'Build & deploy', category: 'Compilation' },

    // Navigation
    { keys: ['⌘', '1'], description: 'Go to Editor', category: 'Navigation' },
    { keys: ['⌘', '2'], description: 'Go to Templates', category: 'Navigation' },
    { keys: ['⌘', '3'], description: 'Go to Deploy', category: 'Navigation' },
    { keys: ['⌘', '4'], description: 'Go to Gas Analysis', category: 'Navigation' },
    { keys: ['⌘', '5'], description: 'Go to AI Assistant', category: 'Navigation' },
    { keys: ['⌘', 'P'], description: 'Quick open file', category: 'Navigation' },
    { keys: ['⌘', 'W'], description: 'Close file', category: 'Navigation' },
    { keys: ['⌘', 'N'], description: 'New file', category: 'Navigation' },

    // View
    { keys: ['⌘', 'T'], description: 'Toggle theme', category: 'View' },
    { keys: ['⌘', ','], description: 'Settings', category: 'View' },
    { keys: ['⌘', 'K'], description: 'Show shortcuts', category: 'View' },
    { keys: ['F11'], description: 'Fullscreen', category: 'View' },
  ]

  const categories = Array.from(new Set(shortcuts.map(s => s.category)))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-3xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Keyboard size={24} className="text-[#0019ff]" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Keyboard Shortcuts</h2>
              <p className="text-sm text-gray-600">Master your workflow with these shortcuts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          {categories.map((category) => (
            <div key={category} className="mb-8 last:mb-0">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#0019ff] rounded"></span>
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter(s => s.category === category)
                  .map((shortcut, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm text-gray-700">{shortcut.description}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, j) => (
                          <kbd
                            key={j}
                            className="px-2 py-1 bg-white border-2 border-gray-300 rounded text-xs font-semibold text-gray-700 shadow-sm min-w-[28px] text-center"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
          <p className="text-xs text-gray-600">
            Press <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-semibold">⌘ K</kbd> anytime to show this dialog
          </p>
        </div>
      </div>
    </div>
  )
}
