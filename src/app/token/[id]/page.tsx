'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import EditTokenForm from '@/components/token/EditTokenForm';
import DeployTokenSummary from '@/components/token/DeployTokenSummary';
import useTokenStore from '@/stores/token.store';
import useWalletStore from '@/stores/wallet.store';
import { DottedHourglassLoader } from '@/components/DottedHourglassLoader';

const TokenPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const { currentToken, getToken, deployToken, loading } = useTokenStore();
  const { fetchWallet } = useWalletStore();

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id && id !== 'undefined') {
      getToken(id);
    }
  }, [getToken, id]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const handleDeploy = () => {
    if (id) {
      // In a real app, you might want a confirmation modal here
      deployToken(id);
    }
  };

  if (!currentToken) {
    return (
      <div className="flex items-center justify-center h-64">
        <DottedHourglassLoader />
      </div>
    );
  }

  const isDraft = currentToken.status === 'DRAFT';
  const showSummary = isDraft && !isEditing;

  let title = 'View Token';
  if (isDraft && isEditing) {
    title = 'Edit Token Draft';
  } else if (isDraft) {
    title = 'Deploy Token';
  }

  // Ensure id is not undefined before rendering child components
  if (!id) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Invalid Token ID.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      
      {showSummary ? (
        <DeployTokenSummary
          token={currentToken}
          onDeploy={handleDeploy}
          onEdit={() => setIsEditing(true)}
          isDeploying={loading}
        />
      ) : (
        <EditTokenForm 
          id={id} 
          isViewOnly={!isDraft} 
          onDraftUpdate={() => setIsEditing(false)} // Go back to summary after saving
        />
      )}
    </div>
  );
};

export default TokenPage;