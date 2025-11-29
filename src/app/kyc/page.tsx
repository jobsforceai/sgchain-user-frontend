'use client';

import React, { useEffect, useState, useMemo } from 'react';
import useKycStore from '@/stores/kyc.store';
import SGCCard from '@/components/SGCCard';
import SGCButton from '@/components/SGCButton';
import { KycRegion, KycDocumentType, KycStatus, KycStatusValue, KycUploadDocumentType } from '@/services/kyc.service';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, MapPin, FileCheck2, Send } from 'lucide-react';

// --- NEW CONFIGURATION BASED ON MASTER GUIDE ---

const REGIONS: KycRegion[] = ['INDIA', 'DUBAI'];

interface DocumentConfig {
  label: string;
  uploadType: KycUploadDocumentType;
  backendType: KycDocumentType;
  needsBack?: boolean;
  uploadTypeBack?: KycUploadDocumentType;
}

const DOC_CONFIG: Record<string, DocumentConfig> = {
  // India
  AADHAAR: { label: 'Aadhaar Card', uploadType: 'AADHAAR_FRONT', uploadTypeBack: 'AADHAAR_BACK', backendType: 'NATIONAL_ID', needsBack: true },
  SELFIE_INDIA: { label: 'Selfie', uploadType: 'SELFIE', backendType: 'SELFIE' },
  // Dubai
  PASSPORT: { label: 'Passport', uploadType: 'PASSPORT', backendType: 'PASSPORT' },
  EMIRATES_ID: { label: 'Emirates ID', uploadType: 'NATIONAL_ID', backendType: 'NATIONAL_ID' },
  SELFIE_DUBAI: { label: 'Selfie', uploadType: 'SELFIE', backendType: 'SELFIE' },
};

const REGION_DOCS: Record<KycRegion, string[]> = {
  INDIA: ['AADHAAR', 'SELFIE_INDIA'],
  DUBAI: ['PASSPORT', 'EMIRATES_ID', 'SELFIE_DUBAI'],
};

// --- COMPONENTS ---

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
  config: DocumentConfig;
  isUploaded: boolean;
  onUpload: (config: DocumentConfig, front: File, back?: File) => void;
  loading: boolean;
  disabled?: boolean;
}> = ({ config, isUploaded, onUpload, loading, disabled = false }) => {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);

  const handleUploadClick = () => {
    if (frontFile) {
      onUpload(config, frontFile, backFile || undefined);
    }
  };

  const showUploadUI = !isUploaded && !disabled;

  return (
    <div className={`p-4 rounded-lg transition-all ${isUploaded ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} border ${disabled ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {isUploaded ? <CheckCircle2 className="text-green-500" /> : <FileText className="text-gray-500" />}
          <p className="font-semibold text-gray-800">{config.label} <span className="text-red-500">*</span></p>
        </div>
        {isUploaded && <span className="text-sm font-medium text-green-600">Uploaded</span>}
      </div>
      {showUploadUI && (
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Front of Document</label>
              <input type="file" onChange={e => setFrontFile(e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            {config.needsBack && (
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Back of Document</label>
                <input type="file" onChange={e => setBackFile(e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
            )}
          </div>
          <div className="mt-4">
            <SGCButton onClick={handleUploadClick} disabled={!frontFile || (config.needsBack && !backFile) || loading} className="px-3 py-1.5 text-sm">
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
  const currentStatusValue: KycStatusValue | 'NOT_STARTED' = selectedStatus?.status || 'NOT_STARTED';
  const isRejected = currentStatusValue === 'REJECTED';

  const handleRegionSelect = (region: KycRegion) => {
    setSelectedRegion(region);
    setStep('documents');
  };
  
  const handleUpload = async (config: DocumentConfig, frontFile: File, backFile?: File) => {
    if (!selectedRegion) return;
    setMessage(null);
    try {
      await uploadDocument({ region: selectedRegion, docType: config.uploadType, file: frontFile });
      if (config.uploadTypeBack && backFile) {
        await uploadDocument({ region: selectedRegion, docType: config.uploadTypeBack, file: backFile });
      }
      setMessage({ type: 'success', text: `${config.label} uploaded successfully!` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || `Failed to upload ${config.label}.` });
    }
  };

  const handleFinalSubmit = async () => {
    if (!selectedRegion) return;
    setMessage(null);
    try {
      await submitForReview(selectedRegion);
      setMessage({ type: 'success', text: 'KYC application submitted for review.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || `Failed to submit for review.` });
    }
  };

  const uploadedBackendTypes = useMemo(() => selectedStatus?.documents.map(doc => doc.documentType) || [], [selectedStatus]);

  const areAllRequiredDocsUploaded = useMemo(() => {
    if (!selectedRegion) return false;

    switch (selectedRegion) {
      case 'INDIA':
        return uploadedBackendTypes.includes('NATIONAL_ID') && uploadedBackendTypes.includes('SELFIE');
      case 'DUBAI':
        const hasId = uploadedBackendTypes.includes('PASSPORT') || uploadedBackendTypes.includes('NATIONAL_ID');
        const hasSelfie = uploadedBackendTypes.includes('SELFIE');
        return hasId && hasSelfie;
      default:
        return false;
    }
  }, [selectedRegion, uploadedBackendTypes]);

  const renderContent = () => {
    if (loading && kycStatuses.length === 0) return <p>Loading KYC status...</p>;
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
                  <button key={region} onClick={() => handleRegionSelect(region)} disabled={isVerified}
                    className={`relative p-6 border rounded-lg text-center transition-all group ${isVerified ? 'border-green-500 bg-green-50 cursor-not-allowed' : 'hover:border-blue-500 hover:bg-blue-50'}`}>
                    <MapPin className={`mx-auto mb-2 ${isVerified ? 'text-green-600' : 'text-gray-400 group-hover:text-blue-600'}`} size={32} />
                    <p className="font-semibold text-lg">{region}</p>
                    {isVerified && <div className="absolute top-2 right-2"><StatusBadge status="VERIFIED" /></div>}
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
            {isRejected && selectedStatus?.rejectionReason && (
              <div className="mb-6 p-3 rounded-md bg-red-50 text-red-900 border border-red-200">
                <p className="font-bold text-sm">Your application was rejected</p>
                <p className="text-sm">{selectedStatus.rejectionReason}</p>
              </div>
            )}
            {selectedRegion === 'DUBAI' && (
              <p className="text-gray-500 text-sm -mt-3 mb-4">Please upload a Selfie and EITHER your Passport OR Emirates ID.</p>
            )}
            <div className="space-y-4">
              {REGION_DOCS[selectedRegion].map(key => {
                const config = DOC_CONFIG[key];
                return (
                  <DocumentUploadCard
                    key={key}
                    config={config}
                    isUploaded={uploadedBackendTypes.includes(config.backendType)}
                    onUpload={handleUpload}
                    loading={loading}
                  />
                );
              })}
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
              {uploadedBackendTypes.map(docType => (
                <li key={docType} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                  <FileCheck2 className="text-green-600" />
                  <span className="font-medium">{Object.values(DOC_CONFIG).find(d => d.backendType === docType)?.label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600">By submitting, you confirm that the uploaded documents are accurate and belong to you.</p>
              <div className="mt-4 flex justify-between items-center">
                <SGCButton variant="outline" onClick={() => setStep('documents')}><ArrowLeft className="mr-2" size={16} /> Back</SGCButton>
                <SGCButton onClick={handleFinalSubmit} disabled={loading || !['DRAFT', 'REJECTED'].includes(currentStatusValue)}>
                  <Send className="mr-2" size={16} /> {isRejected ? 'Resubmit' : 'Submit for Review'}
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
          <h1 className="text-2xl md:text-3xl font-bold">KYC Verification</h1>
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
