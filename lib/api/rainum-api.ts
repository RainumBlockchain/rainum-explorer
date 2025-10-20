/**
 * Rainum Blockchain Explorer API Client
 * Read-only functions for querying blockchain data
 * All amounts are now in RAIN directly (no micro-RAIN conversion)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface NetworkStats {
  block_height: number;
  total_transactions: number;
  active_validators: number;
  tps: number;
  total_supply?: number;
  circulating_supply?: number;
}

export interface Block {
  id: number;
  hash: string;
  previous_hash: string;
  timestamp: number;
  validator: string;
  transactions: Transaction[];
  transaction_count: number;
  merkle_root?: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  status: string;
  block_hash?: string;
  validator?: string;
  gas_price?: number;
  gas_limit?: number;
  gas_used?: number;
  nonce?: number;
  // ZKP Privacy fields
  zkp_enabled?: boolean;
  privacy_level?: 'full' | 'partial' | 'none';
  zkp_proof?: string;
  amount_commitment?: string;
  nullifier?: string;
  sender_visible?: string;
  receiver_visible?: string;
  amount_visible?: number;
}

export interface Account {
  address: string;
  balance: number;
  nonce: number;
  exists: boolean;
  is_validator?: boolean;
  transaction_count?: number;
  first_seen?: number;
  last_seen?: number;
}

export interface ValidatorInfo {
  address: string;
  stake: number;
  tier: number;
  active: boolean;
  jailed: boolean;
  missed_blocks: number;
  blocks_produced: number;
  total_rewards: number;
  delegators_count?: number;
  commission_rate?: number;
  nickname?: string;
  avatar_url?: string;
  description?: string;
  website?: string;
  // ✅ Cryptographic keys for consensus
  bls_public_key_hex?: string;      // BLS12-381 public key (96 chars hex)
  ed25519_public_key_hex?: string;  // Ed25519 public key (64 chars hex)
}

export interface SlashAppeal {
  appeal_id: string;
  validator_address: string;
  slashing_event: {
    DoubleSign?: { validator: string; block_height: number; evidence_timestamp: number };
    OfflineValidator?: { validator: string; missed_blocks: number; threshold: number; timestamp: number };
    InvalidBlock?: { validator: string; block_height: number; reason: string; timestamp: number };
  };
  slashed_amount: number;
  reason: string;
  evidence: string;
  submitted_timestamp: number;
  status: 'Pending' | 'UnderReview' | 'Approved' | 'Rejected';
  votes_for: number;
  votes_against: number;
  voters: string[];
}

export interface SlashingEvent {
  event: {
    DoubleSign?: { validator: string; block_height: number; evidence_timestamp: number };
    OfflineValidator?: { validator: string; missed_blocks: number; threshold: number; timestamp: number };
    InvalidBlock?: { validator: string; block_height: number; reason: string; timestamp: number };
  };
  amount: number;
}

// ============================================================================
// NETWORK STATUS
// ============================================================================

/**
 * Get network status and statistics
 */
export async function getStatus(): Promise<NetworkStats> {
  try {
    const res = await fetch(`${API_BASE}/status`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const status = await res.json();

    // Map API response to NetworkStats interface
    return {
      block_height: status.total_blocks || 0,
      total_transactions: status.total_transactions || 0,
      active_validators: status.active_validators || 0,
      tps: status.peak_tps || 0,
      total_supply: status.total_supply,
      circulating_supply: status.circulating_supply,
    };
  } catch (error) {
    console.error('Failed to fetch status:', error);
    throw error;
  }
}

// ============================================================================
// BLOCKS
// ============================================================================

/**
 * Get list of recent blocks
 */
export async function getBlocks(options?: { limit?: number }): Promise<Block[]> {
  try {
    const limit = options?.limit || 50;
    const res = await fetch(`${API_BASE}/blocks?limit=${limit}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const blocks = await res.json();

    // Map API response to Block interface
    return blocks.map((block: Record<string, unknown>) => {
      const txs = Array.isArray(block.transactions) ? block.transactions : [];
      return {
        id: block.id as number,
        hash: block.hash as string,
        previous_hash: block.previous_hash as string,
        timestamp: block.timestamp as number,
        validator: (block.validator_address || block.validator || 'unknown') as string,
        transactions: txs,
        transaction_count: txs.length,
        merkle_root: block.state_root as string | undefined,
      };
    });
  } catch (error) {
    console.error('Failed to fetch blocks:', error);
    return [];
  }
}

/**
 * Get specific block by hash or ID
 */
export async function getBlock(hashOrId: string | number): Promise<Block | null> {
  try {
    const res = await fetch(`${API_BASE}/block/${hashOrId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const block = await res.json();

    // Map API response to Block interface
    return {
      id: block.id,
      hash: block.hash,
      previous_hash: block.previous_hash,
      timestamp: block.timestamp,
      validator: block.validator_address || block.validator || 'unknown',
      transactions: block.transactions || [],
      transaction_count: block.transactions?.length || 0,
      merkle_root: block.state_root,
    };
  } catch (error) {
    console.error('Failed to fetch block:', error);
    return null;
  }
}

// ============================================================================
// TRANSACTIONS
// ============================================================================

/**
 * Get list of recent transactions
 */
export async function getTransactions(options?: { limit?: number }): Promise<Transaction[]> {
  try {
    const limit = options?.limit || 50;
    const res = await fetch(`${API_BASE}/transactions?limit=${limit}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const transactions = await res.json();

    // Map API response, convert micro-RAIN to RAIN, and add status field
    return transactions.map((tx: Record<string, unknown>) => ({
      ...tx,
      amount: tx.amount || 0,
      gas_price: tx.gas_price ? tx.gas_price : undefined,
      status: tx.status || 'Confirmed',
      validator: tx.validator || tx.validator_address || undefined,
    }));
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return [];
  }
}

/**
 * Get specific transaction by hash
 */
export async function getTransaction(hash: string): Promise<Transaction | null> {
  try {
    const res = await fetch(`${API_BASE}/transaction/${hash}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const tx = await res.json();

    // Convert micro-RAIN to RAIN
    return {
      ...tx,
      amount: tx.amount || 0,
      gas_price: tx.gas_price ? tx.gas_price : undefined,
    };
  } catch (error) {
    console.error('Failed to fetch transaction:', error);
    return null;
  }
}

// ============================================================================
// ACCOUNTS
// ============================================================================

/**
 * Get account information
 */
export async function getAccount(address: string): Promise<Account | null> {
  try {
    const normalizedAddress = address.toLowerCase();
    const res = await fetch(`${API_BASE}/account/${normalizedAddress}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const account = await res.json();

    // Convert micro-RAIN to RAIN for balance
    return {
      ...account,
      balance: account.balance || 0,
    };
  } catch (error) {
    console.error('Failed to fetch account:', error);
    return null;
  }
}

/**
 * Get transaction history for an account
 */
export async function getAccountTransactions(address: string): Promise<Transaction[]> {
  try {
    const normalizedAddress = address.toLowerCase();
    const res = await fetch(`${API_BASE}/transactions/${normalizedAddress}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    // Helper to convert micro-RAIN amounts in transactions
    const convertTx = (tx: Record<string, unknown>): Transaction => ({
      ...(tx as Partial<Transaction>),
      hash: tx.hash as string,
      from: tx.from as string,
      to: tx.to as string,
      amount: (tx.amount as number) || 0,
      timestamp: tx.timestamp as number,
      status: (tx.status as string) || 'Confirmed',
      gas_price: tx.gas_price ? (tx.gas_price as number) : undefined,
    } as Transaction);

    // API might return {incoming: [...], outgoing: [...]} format
    if (data && typeof data === 'object' && 'incoming' in data && 'outgoing' in data) {
      const allTransactions = [
        ...data.outgoing.map((tx: Record<string, unknown>) => convertTx({ ...tx, direction: 'outgoing' })),
        ...data.incoming.map((tx: Record<string, unknown>) => convertTx({ ...tx, direction: 'incoming' }))
      ];

      // Sort by timestamp (most recent first)
      return allTransactions.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }

    // Fallback if API returns array directly
    return Array.isArray(data) ? data.map(convertTx) : [];
  } catch (error) {
    console.error('Failed to fetch account transactions:', error);
    return [];
  }
}

// ============================================================================
// VALIDATORS
// ============================================================================

/**
 * Get all validators
 */
export async function getValidators(): Promise<ValidatorInfo[]> {
  try {
    const res = await fetch(`${API_BASE}/validators`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const validators = Array.isArray(data) ? data : (data.validators || []);

    // Map backend fields to frontend interface and convert micro-RAIN to RAIN
    return validators.map((v: Record<string, unknown>) => ({
      address: v.address,
      stake: v.staked_amount || v.stake || 0,
      tier: v.tier || 1,
      active: v.is_active ?? v.active ?? false,
      jailed: v.jailed || false,
      missed_blocks: v.missed_blocks || 0,
      blocks_produced: v.total_blocks_produced || v.blocks_produced || 0,
      total_rewards: v.total_rewards || 0,
      delegators_count: v.delegators_count,
      commission_rate: v.commission_rate,
      nickname: v.nickname,
      avatar_url: v.avatar_url,
      description: v.description,
      website: v.website,
    }));
  } catch (error) {
    console.error('Failed to fetch validators:', error);
    return [];
  }
}

/**
 * Get specific validator info
 */
export async function getValidatorInfo(address: string): Promise<ValidatorInfo | null> {
  try {
    const res = await fetch(`${API_BASE}/validator/${address}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const v = data.validator || data;

    return {
      address: v.address,
      stake: v.staked_amount || v.stake || 0,
      tier: v.tier || 1,
      active: v.is_active ?? v.active ?? false,
      jailed: v.jailed || false,
      missed_blocks: v.missed_blocks || 0,
      blocks_produced: v.total_blocks_produced || v.blocks_produced || 0,
      total_rewards: v.total_rewards || 0,
      delegators_count: v.delegators_count,
      commission_rate: v.commission_rate,
      nickname: v.nickname,
      avatar_url: v.avatar_url,
      description: v.description,
      website: v.website,
    };
  } catch (error) {
    console.error('Failed to fetch validator info:', error);
    return null;
  }
}

/**
 * Get blocks produced by a specific validator
 */
export async function getValidatorBlocks(address: string): Promise<Block[]> {
  try {
    const res = await fetch(`${API_BASE}/blocks/validator/${address}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const blocks = await res.json();

    // Map API response to Block interface
    return blocks.map((block: Record<string, unknown>) => {
      const txs = Array.isArray(block.transactions) ? block.transactions : [];
      return {
        id: block.id as number,
        hash: block.hash as string,
        previous_hash: block.previous_hash as string,
        timestamp: block.timestamp as number,
        validator: (block.validator_address || block.validator || 'unknown') as string,
        transactions: txs,
        transaction_count: txs.length,
        merkle_root: block.state_root as string | undefined,
      };
    });
  } catch (error) {
    console.error('Failed to fetch validator blocks:', error);
    return [];
  }
}

// ============================================================================
// TOTAL SUPPLY
// ============================================================================

/**
 * Get total supply by summing all account balances
 * This is the DEFINITIVE source of truth for circulating supply
 */
export async function getTotalSupply(): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}/accounts`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const accounts = await res.json();

    // Sum all account balances - this is in RAIN directly (no micro-RAIN)
    const totalSupply = Object.values(accounts as Record<string, number>).reduce(
      (sum, balance) => sum + balance,
      0
    );

    return totalSupply;
  } catch (error) {
    console.error('Failed to fetch total supply:', error);
    throw error;
  }
}

// ============================================================================
// SLASHING & APPEALS
// ============================================================================

/**
 * Get all pending slash appeals
 */
export async function getPendingAppeals(): Promise<SlashAppeal[]> {
  try {
    const res = await fetch(`${API_BASE}/slashing/appeals/pending`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const appeals = await res.json();
    return appeals || [];
  } catch (error) {
    console.error('Failed to fetch pending appeals:', error);
    return [];
  }
}

/**
 * Get slashing history for a validator
 */
export async function getValidatorSlashingHistory(address: string): Promise<SlashingEvent[]> {
  try {
    const res = await fetch(`${API_BASE}/slashing/history/${address}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const history = await res.json();
    return history || [];
  } catch (error) {
    console.error('Failed to fetch slashing history:', error);
    return [];
  }
}

/**
 * Get all appeals for a validator
 */
export async function getValidatorAppeals(address: string): Promise<SlashAppeal[]> {
  try {
    const res = await fetch(`${API_BASE}/slashing/appeals/validator/${address}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const appeals = await res.json();
    return appeals || [];
  } catch (error) {
    console.error('Failed to fetch validator appeals:', error);
    return [];
  }
}
