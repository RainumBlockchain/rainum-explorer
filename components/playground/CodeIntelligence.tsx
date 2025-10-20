'use client'

import { useEffect } from 'react'
import type monaco from 'monaco-editor'
import {
  solidityLanguageConfig,
  solidityKeywords,
  solidityTypes,
  solidityBuiltins,
  soliditySnippets,
  solidityHoverDocs
} from '@/lib/solidity-language'

export function setupSolidityIntelliSense(monacoInstance: typeof monaco) {
  // Register Solidity language
  monacoInstance.languages.register({ id: 'solidity' })

  // Set language configuration
  monacoInstance.languages.setLanguageConfiguration('solidity', solidityLanguageConfig as any)

  // Set syntax highlighting
  monacoInstance.languages.setMonarchTokensProvider('solidity', {
    keywords: solidityKeywords,
    typeKeywords: solidityTypes,
    builtins: solidityBuiltins,

    operators: [
      '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
      '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
      '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
      '%=', '<<=', '>>=', '>>>='
    ],

    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

    tokenizer: {
      root: [
        // Identifiers and keywords
        [/[a-z_$][\w$]*/, {
          cases: {
            '@keywords': 'keyword',
            '@typeKeywords': 'type',
            '@builtins': 'builtin',
            '@default': 'identifier'
          }
        }],
        [/[A-Z][\w\$]*/, 'type.identifier'],

        // Whitespace
        { include: '@whitespace' },

        // Delimiters and operators
        [/[{}()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [/@symbols/, {
          cases: {
            '@operators': 'operator',
            '@default': ''
          }
        }],

        // Numbers
        [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
        [/0[xX][0-9a-fA-F]+/, 'number.hex'],
        [/\d+/, 'number'],

        // Delimiter: after number because of .\d floats
        [/[;,.]/, 'delimiter'],

        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/'([^'\\]|\\.)*$/, 'string.invalid'],
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single']
      ],

      whitespace: [
        [/[ \t\r\n]+/, ''],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment']
      ],

      comment: [
        [/[^\/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[\/*]/, 'comment']
      ],

      string_double: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, 'string', '@pop']
      ],

      string_single: [
        [/[^\\']+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/'/, 'string', '@pop']
      ]
    }
  } as any)

  // Register completion item provider (auto-complete)
  monacoInstance.languages.registerCompletionItemProvider('solidity', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      }

      const suggestions: any[] = []

      // Add keywords
      solidityKeywords.forEach(keyword => {
        suggestions.push({
          label: keyword,
          kind: monacoInstance.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range: range,
          documentation: solidityHoverDocs[keyword] || `Solidity keyword: ${keyword}`
        })
      })

      // Add types
      solidityTypes.forEach(type => {
        suggestions.push({
          label: type,
          kind: monacoInstance.languages.CompletionItemKind.TypeParameter,
          insertText: type,
          range: range,
          documentation: solidityHoverDocs[type] || `Solidity type: ${type}`
        })
      })

      // Add builtins
      solidityBuiltins.forEach(builtin => {
        suggestions.push({
          label: builtin,
          kind: monacoInstance.languages.CompletionItemKind.Function,
          insertText: builtin,
          range: range,
          documentation: solidityHoverDocs[builtin] || `Solidity builtin: ${builtin}`
        })
      })

      // Add snippets
      soliditySnippets.forEach(snippet => {
        suggestions.push({
          ...snippet,
          range: range
        })
      })

      return { suggestions }
    }
  })

  // Register hover provider
  monacoInstance.languages.registerHoverProvider('solidity', {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position)
      if (!word) return null

      const hoverText = solidityHoverDocs[word.word]
      if (!hoverText) return null

      return {
        range: new monacoInstance.Range(
          position.lineNumber,
          word.startColumn,
          position.lineNumber,
          word.endColumn
        ),
        contents: [
          { value: hoverText }
        ]
      }
    }
  })

  // Register signature help provider
  monacoInstance.languages.registerSignatureHelpProvider('solidity', {
    signatureHelpTriggerCharacters: ['(', ','],
    provideSignatureHelp: (model, position) => {
      // Basic signature help for common functions
      return {
        dispose: () => {},
        value: {
          signatures: [
            {
              label: 'require(bool condition, string memory message)',
              documentation: 'Validates conditions and reverts on failure',
              parameters: [
                {
                  label: 'condition',
                  documentation: 'Boolean condition to check'
                },
                {
                  label: 'message',
                  documentation: 'Error message if condition fails'
                }
              ]
            }
          ],
          activeSignature: 0,
          activeParameter: 0
        }
      }
    }
  })

  // Register definition provider (go-to-definition)
  monacoInstance.languages.registerDefinitionProvider('solidity', {
    provideDefinition: (model, position) => {
      const word = model.getWordAtPosition(position)
      if (!word) return null

      // Search for function/variable definition
      const text = model.getValue()
      const lines = text.split('\n')

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        // Look for function definitions
        if (line.includes(`function ${word.word}`) ||
            line.includes(`${word.word} =`) ||
            line.includes(`${word.word};`)) {
          return {
            uri: model.uri,
            range: new monacoInstance.Range(i + 1, 1, i + 1, line.length)
          }
        }
      }

      return null
    }
  })

  // Register document formatting provider
  monacoInstance.languages.registerDocumentFormattingEditProvider('solidity', {
    provideDocumentFormattingEdits: (model) => {
      const text = model.getValue()
      // Basic formatting (indentation)
      let formatted = text
        .split('\n')
        .map(line => line.trim())
        .join('\n')
        .replace(/\{/g, ' {\n')
        .replace(/\}/g, '\n}')
        .replace(/;/g, ';\n')

      return [{
        range: model.getFullModelRange(),
        text: formatted
      }]
    }
  })

  console.log('✅ Solidity IntelliSense enabled')
}
