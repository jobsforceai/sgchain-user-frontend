'use client';

import React, { useEffect, useState, useMemo } from 'react';
import useKycStore from '@/stores/kyc.store';
import SGCCard from '@/components/SGCCard';
import SGCButton from '@/components/SGCButton';
import { KycRegion, KycDocumentType, KycStatus, KycStatusValue } from '@/services/kyc.service';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, MapPin, Check, FileCheck2, Send } from 'lucide-react';

const REGIONS: KycRegion[] = ['INDIA', 'DUBAI'];
const DOC_CONFIG: { type: KycDocumentType, label: string, needsBack?: boolean }[] = [
  { type: 'NATIONAL_ID', label: 'National ID', needsBack: true },
  { type: 'DRIVING_LICENSE', label: 'Driving License', needsBack: true },
  { type: 'PASSPORT', label: 'Passport' },
  { type: 'SELFIE', label: 'Selfie' },
  { type: 'PROOF_OF_ADDRESS', label: 'Proof of Address' },
];

const StatusBadge: React.FC<{ status: KycStatusValue | 'NOT_STARTED' }> = ({ status }) => {
  const statusInfo = useMemo(() => {
    switch (status) {
      case 'DRAFT': return { icon: <FileText size={16} />, color: 'bg-blue-100 text-blue-800' };
      case 'PENDING': return { icon: <AlertCircle size={16} />, color: 'bg-yellow-100 text-yellow-800' };
      case 'VERIFIED': return { icon: <CheckCircle2 size={16} />, color: 'bg-green-100 text-green-800' };
      case 'REJECTED': return { icon: <AlertCircle size={16} />, color: 'bg-red-100 text-red-800' };
      default: return { icon: <FileText size={16} />, color: 'bg-gray-100 text-gray-700' };
    }
  }, [status]);

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full ${statusInfo.color}`}>
      {statusInfo.icon}
      {status.replace('_', ' ')}
    </span>
  );
};

const DocumentUploadCard: React.FC<{
  docType: KycDocumentType;
  label: string;
  needsBack?: boolean;
  uploadedDoc?: KycStatus['documents'][0];
  onUpload: (docType: KycDocumentType, front: File, back?: File) => void;
  loading: boolean;
}> = ({ docType, label, needsBack, uploadedDoc, onUpload, loading }) => {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);

  const handleUploadClick = () => {
    if (frontFile) {
      onUpload(docType, frontFile, backFile || undefined);
    }
  };

  return (
    <div className={`p-4 rounded-lg transition-all ${uploadedDoc ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} border`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {uploadedDoc ? <CheckCircle2 className="text-green-500" /> : <FileText className="text-gray-500" />}
          <p className="font-semibold text-gray-800">{label} <span className="text-red-500">*</span></p>
        </div>
        {uploadedDoc && <span className="text-sm font-medium text-green-600">Uploaded</span>}
      </div>
      {!uploadedDoc && (
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Front of Document</label>
              <input type="file" onChange={e => setFrontFile(e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            {needsBack && (
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Back of Document</label>
                <input type="file" onChange={e => setBackFile(e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
            )}
          </div>
          <div className="mt-4">
            <SGCButton onClick={handleUploadClick} disabled={!frontFile || loading} className="px-3 py-1.5 text-sm">
              <UploadCloud className="mr-2" size={16} />
              {loading ? 'Uploading...' : 'Upload'}
            </SGCButton>
          </div>
        </div>
      )}
    </div>
  );
};

const KYCPage: React.FC = () => {
  const { kycStatuses, loading, error, fetchKycStatus, uploadDocument, submitForReview } = useKycStore();
  const [selectedRegion, setSelectedRegion] = useState<KycRegion | null>(null);
  const [step, setStep] = useState<'region' | 'documents' | 'submit'>('region');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchKycStatus();
  }, [fetchKycStatus]);

  const selectedStatus = useMemo(() => kycStatuses.find(s => s.region === selectedRegion), [kycStatuses, selectedRegion]);
  const currentStatusValue = selectedStatus?.status || 'NOT_STARTED';

  const REQUIRED_DOCS: Record<KycRegion, KycDocumentType[]> = {
    INDIA: ['NATIONAL_ID', 'SELFIE'],
    DUBAI: ['PASSPORT', 'SELFIE'],
  };

  const handleRegionSelect = (region: KycRegion) => {
    setSelectedRegion(region);
    setStep('documents');
  };
  
  const handleUpload = async (docType: KycDocumentType, frontFile: File, backFile?: File) => {
    if (!selectedRegion) return;
    setMessage(null);
    try {
      // NOTE: Using a placeholder S3 URL as in the original code.
      const documentUrl = `https://s3.amazonaws.com/sgchain-docs/user-xyz/${Date.now()}-${frontFile.name}`;
      const documentBackUrl = backFile ? `https://s3.amazonaws.com/sgchain-docs/user-xyz/${Date.now()}-${backFile.name}` : undefined;
      await uploadDocument({ region: selectedRegion, documentType: docType, documentUrl, documentBackUrl });
      setMessage({ type: 'success', text: `${docType.replace('_', ' ')} uploaded successfully!` });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to upload ${docType.replace('_', ' ')}.` });
    }
  };

  const handleFinalSubmit = async () => {
    if (!selectedRegion) return;
    setMessage(null);
    try {
      await submitForReview(selectedRegion);
      setMessage({ type: 'success', text: 'KYC application submitted for review.' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to submit for review.` });
    }
  };

  const requiredDocsForRegion = selectedRegion ? REQUIRED_DOCS[selectedRegion] : [];
  const uploadedDocTypes = selectedStatus?.documents.map(doc => doc.documentType) || [];
  const areAllRequiredDocsUploaded = requiredDocsForRegion.every(docType => uploadedDocTypes.includes(docType));

  const renderContent = () => {
    if (loading && !selectedRegion) return <p>Loading KYC status...</p>;
    if (error) return <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>;

    if (currentStatusValue === 'VERIFIED' || currentStatusValue === 'PENDING') {
      return (
        <SGCCard>
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-2">
              {currentStatusValue === 'VERIFIED' ? 'Your KYC is Verified' : 'Your KYC is Pending Review'}
            </h2>
            <p className="text-gray-600 mb-4">
              {currentStatusValue === 'VERIFIED' 
                ? `You have successfully completed KYC for the ${selectedRegion} region.` 
                : `Your documents for the ${selectedRegion} region have been submitted and are awaiting review.`}
            </p>
            <StatusBadge status={currentStatusValue} />
          </div>
        </SGCCard>
      );
    }

    // Wizard Steps
    switch (step) {
      case 'region':
        return (
          <SGCCard title="Start KYC Verification">
            <p className="text-gray-500 text-sm -mt-3 mb-6">Select your region to begin the process.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {REGIONS.map(region => {
                const kycStatus = kycStatuses.find(s => s.region === region);
                const isVerified = kycStatus?.status === 'VERIFIED';

                return (
                  <button
                    key={region}
                    onClick={() => handleRegionSelect(region)}
                    className={`relative p-6 border rounded-lg text-center transition-all group ${isVerified ? 'border-green-500 bg-green-50 cursor-not-allowed' : 'hover:border-blue-500 hover:bg-blue-50'}`}
                    disabled={isVerified}
                  >
                    <MapPin className={`mx-auto mb-2 ${isVerified ? 'text-green-600' : 'text-gray-400 group-hover:text-blue-600'}`} size={32} />
                    <p className="font-semibold text-lg">{region}</p>
                    {isVerified && (
                      <div className="absolute top-2 right-2">
                        <StatusBadge status="VERIFIED" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </SGCCard>
        );
      case 'documents':
        if (!selectedRegion) return null;
        return (
          <SGCCard title={`Upload Documents for ${selectedRegion}`}>
            <p className="text-gray-500 text-sm -mt-3 mb-6">Please upload all required documents.</p>
            <div className="space-y-4">
              {DOC_CONFIG
                .filter(doc => requiredDocsForRegion.includes(doc.type))
                .map(doc => (
                  <DocumentUploadCard
                    key={doc.type}
                    docType={doc.type}
                    label={doc.label}
                    needsBack={doc.needsBack}
                    uploadedDoc={selectedStatus?.documents.find(d => d.documentType === doc.type)}
                    onUpload={handleUpload}
                    loading={loading}
                  />
                ))}
            </div>
            <div className="mt-6 flex justify-between items-center">
              <SGCButton variant="outline" onClick={() => setStep('region')}><ArrowLeft className="mr-2" size={16} /> Back</SGCButton>
              <SGCButton onClick={() => setStep('submit')} disabled={!areAllRequiredDocsUploaded}>Next <ArrowRight className="ml-2" size={16} /></SGCButton>
            </div>
          </SGCCard>
        );
      case 'submit':
        if (!selectedRegion) return null;
        return (
          <SGCCard title="Review & Submit">
            <p className="text-gray-500 text-sm -mt-3 mb-6">Review your uploaded documents and submit your application.</p>
            <ul className="space-y-3">
              {requiredDocsForRegion.map(docType => (
                <li key={docType} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                  <FileCheck2 className="text-green-600" />
                  <span className="font-medium">{DOC_CONFIG.find(d => d.type === docType)?.label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600">By submitting, you confirm that the uploaded documents are accurate and belong to you.</p>
              <div className="mt-4 flex justify-between items-center">
                <SGCButton variant="outline" onClick={() => setStep('documents')}><ArrowLeft className="mr-2" size={16} /> Back</SGCButton>
                <SGCButton onClick={handleFinalSubmit} disabled={loading || currentStatusValue !== 'DRAFT'}>
                  <Send className="mr-2" size={16} /> Submit for Review
                </SGCButton>
              </div>
            </div>
          </SGCCard>
        );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">KYC Verification</h1>
          {selectedRegion && <p className="text-gray-500">Region: {selectedRegion}</p>}
        </div>
        {selectedRegion && <StatusBadge status={currentStatusValue} />}
      </div>
      
      {message && (
        <div className={`mb-4 p-3 rounded-md flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p>{message.text}</p>
        </div>
      )}

      {renderContent()}
    </div>
  );
};

export default KYCPage;