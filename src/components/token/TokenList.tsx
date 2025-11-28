'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useTokenStore from '@/stores/token.store';
import SGCButton from '@/components/SGCButton';
import SGCCard from '@/components/SGCCard';

interface TokenListProps {
  onStartCreate: () => void;
}

const TokenList: React.FC<TokenListProps> = ({ onStartCreate }) => {
  const { tokens, loading, error, fetchTokens } = useTokenStore();
  const router = useRouter();

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  const handleActionClick = (tokenId: string) => {
    console.log('Navigating to token with ID:', tokenId);
    router.push(`/token/${tokenId}`);
  };

  return (
    <SGCCard>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-bold mb-2 md:mb-0">Your Tokens</h2>
        <SGCButton onClick={onStartCreate} className="w-full md:w-auto">Create New Token</SGCButton>
      </div>

      {loading && <p>Loading tokens...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-gray-800">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Symbol</th>
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Tier</th>
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tokens.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-sm">You haven't created any tokens yet.</td>
                </tr>
              ) : (
                tokens.map(token => (
                  <tr key={token._id} className="border-b border-gray-200">
                    <td className="py-3 px-4 text-sm">{token.metadata.name}</td>
                    <td className="py-3 px-4 text-sm">{token.metadata.symbol}</td>
                    <td className="py-3 px-4 text-sm">{token.tier}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        token.status === 'DRAFT' ? 'bg-yellow-200 text-yellow-800' :
                        token.status === 'DEPLOYED' ? 'bg-green-200 text-green-800' :
                        'bg-gray-200 text-gray-800'
                      }`}>{token.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <SGCButton onClick={() => handleActionClick(token._id)} className="text-sm py-1 px-2">
                        {token.status === 'DRAFT' ? 'Edit' : 'View'}
                      </SGCButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </SGCCard>
  );
};

export default TokenList;
