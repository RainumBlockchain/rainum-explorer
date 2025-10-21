/// Cross-VM Call Badge Component
///
/// Displays when a transaction involves cross-VM calls

'use client';

import { ArrowLeftRight, Zap } from 'lucide-react';

interface CrossVMBadgeProps {
  sourceVM: 'evm' | 'move';
  targetVM: 'evm' | 'move';
  size?: 'sm' | 'md' | 'lg';
}

export function CrossVMBadge({ sourceVM, targetVM, size = 'md' }: CrossVMBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-bold rounded transition-all ${sizeClasses[size]} bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-700 border border-purple-300 hover:border-purple-400`}
    >
      <ArrowLeftRight size={iconSizes[size]} className="text-purple-600" strokeWidth={2.5} />
      <span className="uppercase tracking-wide">
        {sourceVM} → {targetVM}
      </span>
      <Zap size={iconSizes[size]} className="text-blue-600" strokeWidth={2.5} />
    </div>
  );
}

interface CrossVMIndicatorProps {
  isCrossVM: boolean;
  size?: 'sm' | 'md';
}

export function CrossVMIndicator({ isCrossVM, size = 'sm' }: CrossVMIndicatorProps) {
  if (!isCrossVM) return null;

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[9px]',
    md: 'px-2 py-1 text-[10px]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-extrabold rounded ${sizeClasses[size]} bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm`}
    >
      <Zap size={10} strokeWidth={3} />
      <span>CROSS-VM</span>
    </span>
  );
}
