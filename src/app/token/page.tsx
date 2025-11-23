'use client';

import React, { useState } from 'react';
import TokenList from '@/components/token/TokenList';
import CreateTokenForm from '@/components/token/CreateTokenForm';

const CreateTokenPage: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create & Manage Tokens</h1>
      
      {isCreating ? (
        <CreateTokenForm onCancel={() => setIsCreating(false)} />
      ) : (
        <TokenList onStartCreate={() => setIsCreating(true)} />
      )}
    </div>
  );
};

export default CreateTokenPage;
