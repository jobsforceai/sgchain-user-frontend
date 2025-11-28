'use client';

import React, { useState } from 'react';
import TokenList from '@/components/token/TokenList';
import CreateTokenForm from '@/components/token/CreateTokenForm';
import AnimateGSAP from '@/components/AnimateGSAP';
import SGCCard from '@/components/SGCCard';
import SGCButton from '@/components/SGCButton';

const CreateTokenPage: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="w-full px-4">
      <div className="mb-6">
        <AnimateGSAP>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Create & Manage Tokens</h1>
              <p className="text-sm text-slate-600">Launch tokens, manage drafts, and view status.</p>
            </div>

            <div>
              <SGCButton onClick={() => setIsCreating(s => !s)} className="w-full md:w-auto">{isCreating ? 'Close' : 'Create Token'}</SGCButton>
            </div>
          </div>
        </AnimateGSAP>
      </div>

      <div className="mb-6">
        <AnimateGSAP>
          {isCreating ? (
            <CreateTokenForm onCancel={() => setIsCreating(false)} />
          ) : (
            <SGCCard className="sgc-glass rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">Create a new token</h3>
              <p className="text-sm text-slate-600 mb-4">Start a draft and configure your token's supply, allocations and metadata.</p>
              <SGCButton onClick={() => setIsCreating(true)} className="w-full md:w-auto">Start Creating</SGCButton>
            </SGCCard>
          )}
        </AnimateGSAP>
      </div>

      <div className="mb-6">
        <AnimateGSAP>
          <TokenList onStartCreate={() => setIsCreating(true)} />
        </AnimateGSAP>
      </div>

      
    </div>
  );
};

export default CreateTokenPage;
