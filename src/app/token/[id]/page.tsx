'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import EditTokenForm from '@/components/token/EditTokenForm';
import useTokenStore from '@/stores/token.store';
import useWalletStore from '@/stores/wallet.store';

const TokenPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { currentToken, getToken } = useTokenStore();
  const { fetchWallet } = useWalletStore();

  useEffect(() => {
    if (id && id !== 'undefined') {
      console.log('Fetching token with ID:', id);
      getToken(id);
    }
  }, [getToken, id]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const isViewOnly = currentToken?.status !== 'DRAFT';
  const title = isViewOnly ? 'View Token' : 'Edit Token Draft';

  if (!id) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <EditTokenForm id={id} isViewOnly={isViewOnly} />
    </div>
  );
};

export default TokenPage;
