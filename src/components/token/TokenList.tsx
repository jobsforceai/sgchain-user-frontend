'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useTokenStore from '@/stores/token.store';
import SGCButton from '@/components/SGCButton';
import SGCCard from '@/components/SGCCard';
import { Token } from '@/services/token.service';
import { ChevronRight } from 'lucide-react';

interface TokenListProps {
  onStartCreate: () => void;
}

const TokenStatusBadge: React.FC<{ status: Token['status'] }> = ({ status }) => (
  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
    status === 'DRAFT' ? 'bg-yellow-200 text-yellow-800' :
    status === 'DEPLOYED' ? 'bg-green-200 text-green-800' :
    status === 'FAILED' ? 'bg-red-200 text-red-800' :
    'bg-blue-200 text-blue-800'
  }`}>{status.replace('_', ' ')}</span>
);

const TokenListItem: React.FC<{ token: Token; onActionClick: (id: string) => void }> = ({ token, onActionClick }) => (
  <div 
    onClick={() => onActionClick(token._id)}
    className="bg-white/80 backdrop-blur-sm rounded-lg p-4 transition-all hover:shadow-md hover:bg-white cursor-pointer flex justify-between items-center"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-gray-100 rounded-full">
        <span className="font-bold text-gray-600">{token.metadata.symbol}</span>
      </div>
      <div>
        <p className="font-bold text-gray-800">{token.metadata.name}</p>
        <p className="text-sm text-gray-500">{token.tier}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <TokenStatusBadge status={token.status} />
      <ChevronRight className="text-gray-400" />
    </div>
  </div>
);

const TokenList: React.FC<TokenListProps> = ({ onStartCreate }) => {
  const { tokens, loading, error, fetchTokens } = useTokenStore();
  const router = useRouter();

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  const handleActionClick = (tokenId: string) => {
    router.push(`/token/${tokenId}`);
  };

  return (
    <SGCCard>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-bold mb-2 md:mb-0">Your Tokens</h2>
        <SGCButton onClick={onStartCreate} className="w-full md:w-auto">Create New Token</SGCButton>
      </div>

      {loading && <p className="text-center py-4">Loading tokens...</p>}
      {error && <p className="text-red-500 text-center py-4">{error}</p>}
      
      {!loading && !error && (
        <div className="space-y-3">
          {tokens.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>You haven't created any tokens yet.</p>
            </div>
          ) : (
            tokens.map(token => (
              <TokenListItem key={token._id} token={token} onActionClick={handleActionClick} />
            ))
          )}
        </div>
      )}
    </SGCCard>
  );
};

export default TokenList;