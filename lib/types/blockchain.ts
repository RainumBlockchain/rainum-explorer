export interface Block {
  id: number;
  hash: string;
  previous_hash: string;
  timestamp: number;
  validator: string;
  transactions: Transaction[];
  transaction_count: number;
  merkle_root?: string;
  nonce?: number;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: number;
  gas_price: number;
  gas_limit: number;
  gas_used: number;
  fee_paid: number;
  base_fee?: number;
  priority_fee?: number;
  tier?: number;
  nonce: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  block_hash?: string;
  block_id?: number;
  signature?: string;
  error_message?: string;
}

export interface Account {
  address: string;
  balance: number;
  nonce: number;
  transaction_count: number;
  first_seen: number;
  last_activity: number;
  is_validator: boolean;
  is_contract: boolean;
}

export interface NetworkStats {
  block_height: number;
  tps: number;
  total_transactions: number;
  total_accounts: number;
  total_validators: number;
  active_validators: number;
  avg_block_time: number;
  gas_price: number;
}
