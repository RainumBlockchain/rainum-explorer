// Solidity Language Configuration for Monaco Editor
export const solidityLanguageConfig = {
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/']
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')']
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  folding: {
    markers: {
      start: new RegExp('^\\s*//\\s*#?region\\b'),
      end: new RegExp('^\\s*//\\s*#?endregion\\b')
    }
  }
}

// Solidity Keywords and Types
export const solidityKeywords = [
  'abstract', 'after', 'alias', 'apply', 'auto', 'case', 'catch', 'copyof',
  'default', 'define', 'final', 'immutable', 'implements', 'in', 'inline',
  'let', 'macro', 'match', 'mutable', 'null', 'of', 'override', 'partial',
  'promise', 'reference', 'relocatable', 'sealed', 'sizeof', 'static',
  'supports', 'switch', 'try', 'type', 'typedef', 'typeof', 'unchecked',
  'anonymous', 'as', 'assembly', 'break', 'constant', 'constructor',
  'continue', 'contract', 'delete', 'do', 'else', 'emit', 'enum', 'event',
  'external', 'fallback', 'for', 'function', 'if', 'import', 'indexed',
  'interface', 'internal', 'is', 'library', 'mapping', 'memory', 'modifier',
  'new', 'payable', 'pragma', 'private', 'public', 'pure', 'receive',
  'return', 'returns', 'revert', 'storage', 'struct', 'throw', 'using',
  'view', 'virtual', 'while'
]

export const solidityTypes = [
  'address', 'bool', 'string', 'var', 'int', 'uint', 'bytes', 'byte',
  'int8', 'int16', 'int24', 'int32', 'int40', 'int48', 'int56', 'int64',
  'int72', 'int80', 'int88', 'int96', 'int104', 'int112', 'int120', 'int128',
  'int136', 'int144', 'int152', 'int160', 'int168', 'int176', 'int184', 'int192',
  'int200', 'int208', 'int216', 'int224', 'int232', 'int240', 'int248', 'int256',
  'uint8', 'uint16', 'uint24', 'uint32', 'uint40', 'uint48', 'uint56', 'uint64',
  'uint72', 'uint80', 'uint88', 'uint96', 'uint104', 'uint112', 'uint120', 'uint128',
  'uint136', 'uint144', 'uint152', 'uint160', 'uint168', 'uint176', 'uint184', 'uint192',
  'uint200', 'uint208', 'uint216', 'uint224', 'uint232', 'uint240', 'uint248', 'uint256',
  'bytes1', 'bytes2', 'bytes3', 'bytes4', 'bytes5', 'bytes6', 'bytes7', 'bytes8',
  'bytes9', 'bytes10', 'bytes11', 'bytes12', 'bytes13', 'bytes14', 'bytes15', 'bytes16',
  'bytes17', 'bytes18', 'bytes19', 'bytes20', 'bytes21', 'bytes22', 'bytes23', 'bytes24',
  'bytes25', 'bytes26', 'bytes27', 'bytes28', 'bytes29', 'bytes30', 'bytes31', 'bytes32'
]

export const solidityBuiltins = [
  'msg', 'block', 'tx', 'now', 'this', 'super', 'selfdestruct', 'suicide',
  'assert', 'require', 'revert', 'addmod', 'mulmod', 'keccak256', 'sha256',
  'sha3', 'ripemd160', 'ecrecover', 'blockhash', 'gasleft'
]

// Code snippets for auto-complete
export const soliditySnippets = [
  {
    label: 'contract',
    kind: 14, // Snippet
    insertText: 'contract ${1:ContractName} {\n\t$0\n}',
    insertTextRules: 4, // InsertAsSnippet
    documentation: 'Create a new contract'
  },
  {
    label: 'function',
    kind: 14,
    insertText: 'function ${1:functionName}(${2:params}) ${3|public,private,internal,external|} ${4|pure,view,payable|} ${5:returns (${6:type})} {\n\t$0\n}',
    insertTextRules: 4,
    documentation: 'Create a new function'
  },
  {
    label: 'constructor',
    kind: 14,
    insertText: 'constructor(${1:params}) ${2|public,internal|} {\n\t$0\n}',
    insertTextRules: 4,
    documentation: 'Create a constructor'
  },
  {
    label: 'modifier',
    kind: 14,
    insertText: 'modifier ${1:modifierName}(${2:params}) {\n\t${3:require(condition, "error message");}\n\t_;\n}',
    insertTextRules: 4,
    documentation: 'Create a modifier'
  },
  {
    label: 'event',
    kind: 14,
    insertText: 'event ${1:EventName}(${2:params});',
    insertTextRules: 4,
    documentation: 'Create an event'
  },
  {
    label: 'mapping',
    kind: 14,
    insertText: 'mapping(${1:address} => ${2:uint256}) ${3|public,private,internal|} ${4:mappingName};',
    insertTextRules: 4,
    documentation: 'Create a mapping'
  },
  {
    label: 'struct',
    kind: 14,
    insertText: 'struct ${1:StructName} {\n\t${2:uint256 id;}\n}',
    insertTextRules: 4,
    documentation: 'Create a struct'
  },
  {
    label: 'require',
    kind: 14,
    insertText: 'require(${1:condition}, "${2:error message}");',
    insertTextRules: 4,
    documentation: 'Add require statement'
  },
  {
    label: 'emit',
    kind: 14,
    insertText: 'emit ${1:EventName}(${2:params});',
    insertTextRules: 4,
    documentation: 'Emit an event'
  },
  {
    label: 'erc20',
    kind: 14,
    insertText: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract \${1:MyToken} {
    string public name = "\${2:My Token}";
    string public symbol = "\${3:MTK}";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply * 10 ** decimals;
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from], "Insufficient balance");
        require(_value <= allowance[_from][msg.sender], "Allowance exceeded");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}`,
    insertTextRules: 4,
    documentation: 'Complete ERC-20 token implementation'
  }
]

// Hover documentation for common Solidity keywords
export const solidityHoverDocs: Record<string, string> = {
  'contract': '**contract** - Defines a new smart contract\n\n```solidity\ncontract MyContract {\n  // contract code\n}\n```',
  'function': '**function** - Defines a function in a contract\n\nVisibility: public, private, internal, external\nState mutability: pure, view, payable',
  'mapping': '**mapping** - Key-value storage structure\n\n```solidity\nmapping(address => uint256) public balances;\n```',
  'address': '**address** - Holds a 20-byte Ethereum address\n\nMethods: balance, transfer, send, call, delegatecall, staticcall',
  'uint256': '**uint256** - Unsigned integer (256 bits)\n\nRange: 0 to 2^256 - 1',
  'msg.sender': '**msg.sender** - Address of the account that initiated the transaction',
  'msg.value': '**msg.value** - Amount of wei sent with the transaction',
  'require': '**require** - Validates conditions and reverts on failure\n\n```solidity\nrequire(condition, "error message");\n```',
  'emit': '**emit** - Triggers an event\n\n```solidity\nemit EventName(param1, param2);\n```',
  'payable': '**payable** - Allows function to receive Ether',
  'view': '**view** - Function that reads but does not modify state',
  'pure': '**pure** - Function that neither reads nor modifies state',
  'memory': '**memory** - Temporary data storage during function execution',
  'storage': '**storage** - Permanent data storage on the blockchain',
  'calldata': '**calldata** - Read-only reference to function arguments (gas efficient)'
}
