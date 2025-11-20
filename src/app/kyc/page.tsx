'use client';

import React, { useEffect, useState, useMemo } from 'react';
import useKycStore from '@/stores/kyc.store';
import SGCCard from '@/components/SGCCard';
import SGCButton from '@/components/SGCButton';
import { KycRegion, KycDocumentType, KycStatus, KycStatusValue } from '@/services/kyc.service';

const REGIONS: KycRegion[] = ['INDIA', 'DUBAI'];
const DOC_CONFIG: { type: KycDocumentType, label: string, needsBack?: boolean }[] = [
  { type: 'NATIONAL_ID', label: 'National ID', needsBack: true },
  { type: 'DRIVING_LICENSE', label: 'Driving License', needsBack: true },
  { type: 'PASSPORT', label: 'Passport' },
  { type: 'SELFIE', label: 'Selfie' },
  { type: 'PROOF_OF_ADDRESS', label: 'Proof of Address' },
];

const uploadFilePlaceholder = async (file: File): Promise<string> => {
  console.log(`Uploading file: ${file.name}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `https://s3.amazonaws.com/sgchain-docs/user-xyz/${Date.now()}-${file.name}`;
};

const StatusBadge: React.FC<{ status: KycStatusValue | 'NOT_STARTED' }> = ({ status }) => {
  const statusStyles: Record<typeof status, string> = {
    'NOT_STARTED': 'bg-gray-200 text-gray-800',
    'DRAFT': 'bg-blue-200 text-blue-800',
    'PENDING': 'bg-yellow-200 text-yellow-800',
    'VERIFIED': 'bg-green-200 text-green-800',
    'REJECTED': 'bg-red-200 text-red-800',
  };
  return <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusStyles[status]}`}>{status.replace('_', ' ')}</span>;
};

const KycForm: React.FC<{ region: KycRegion, status: KycStatus | undefined }> = ({ region, status }) => {

  const { loading, uploadDocument, submitForReview } = useKycStore();

  const [files, setFiles] = useState<Record<string, File | null>>({});

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);



  const REQUIRED_DOCS: Record<KycRegion, KycDocumentType[]> = {

    INDIA: ['NATIONAL_ID', 'SELFIE'],

    DUBAI: ['PASSPORT', 'SELFIE'],

  };



  const handleFileChange = (key: string, file: File | null) => {

    setFiles(prev => ({ ...prev, [key]: file }));

  };



  const handleUpload = async (docType: KycDocumentType, needsBack?: boolean) => {

    const frontFile = files[`${docType}_FRONT`];

    const backFile = needsBack ? files[`${docType}_BACK`] : null;

    if (!frontFile) return;

    setMessage(null);

    try {

      const documentUrl = await uploadFilePlaceholder(frontFile);

      const documentBackUrl = backFile ? await uploadFilePlaceholder(backFile) : undefined;

      await uploadDocument({ region, documentType: docType, documentUrl, documentBackUrl });

      setMessage({ type: 'success', text: `${docType.replace('_', ' ')} uploaded successfully!` });

    } catch (err) {

      setMessage({ type: 'error', text: `Failed to upload ${docType.replace('_', ' ')}.` });

    }

  };



  const handleFinalSubmit = async () => {

    setMessage(null);

    try {

      await submitForReview(region);

      setMessage({ type: 'success', text: 'KYC application submitted for review.' });

    } catch (err) {

      setMessage({ type: 'error', text: `Failed to submit for review.` });

    }

  };



  const getUploadedDoc = (docType: KycDocumentType) => status?.documents.find(d => d.documentType === docType);



  const requiredDocs = REQUIRED_DOCS[region];

  const uploadedDocTypes = status?.documents.map(doc => doc.documentType) || [];

  const areAllRequiredDocsUploaded = requiredDocs.every(docType => uploadedDocTypes.includes(docType));

  const missingDocs = requiredDocs.filter(docType => !uploadedDocTypes.includes(docType));



  return (

    <SGCCard title={`Submit Documents for ${region}`}>

      <div className="space-y-4">

        {DOC_CONFIG.map(({ type, label, needsBack }) => {

          const uploadedDoc = getUploadedDoc(type);

          const isRequired = requiredDocs.includes(type);

          return (

            <div key={type} className="border p-4 rounded-lg bg-gray-50">

              <div className="flex justify-between items-center">

                <p className="font-semibold text-gray-700">{label} {isRequired && <span className="text-red-500">*</span>}</p>

                {uploadedDoc ? (

                  <span className="text-sm font-medium text-green-600">✔ Uploaded</span>

                ) : (

                  <span className="text-sm font-medium text-gray-500">Pending</span>

                )}

              </div>

              {!uploadedDoc && (

                <div className="mt-4 pt-4 border-t border-gray-200">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">

                    <div>

                      <label className="text-sm font-medium text-gray-600">Front of Document</label>

                      <input type="file" onChange={e => handleFileChange(`${type}_FRONT`, e.target.files?.[0] || null)} className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />

                    </div>

                    {needsBack && (

                      <div>

                        <label className="text-sm font-medium text-gray-600">Back of Document</label>

                        <input type="file" onChange={e => handleFileChange(`${type}_BACK`, e.target.files?.[0] || null)} className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />

                      </div>

                    )}

                  </div>

                  <div className="mt-4">

                    <SGCButton onClick={() => handleUpload(type, needsBack)} disabled={!files[`${type}_FRONT`] || loading}>

                      {loading ? 'Uploading...' : `Upload ${label}`}

                    </SGCButton>

                  </div>

                </div>

              )}

            </div>

          );

        })}

      </div>

      <div className="mt-6 pt-6 border-t">

        <h3 className="text-lg font-semibold">Final Submission</h3>

        <p className="text-sm text-gray-600 mt-1">Once all required documents are uploaded, you can submit your application for review.</p>

        <div className="mt-4">

          <SGCButton onClick={handleFinalSubmit} disabled={loading || status?.status !== 'DRAFT' || !areAllRequiredDocsUploaded}>

            Submit for Review

          </SGCButton>

          {status?.status !== 'DRAFT' && <p className="text-xs mt-2 text-gray-500">You can only submit an application when it is in DRAFT status.</p>}

          {missingDocs.length > 0 && status?.status === 'DRAFT' && (

            <p className="text-xs mt-2 text-red-500">

              Required documents missing: {missingDocs.join(', ').replace(/_/g, ' ')}

            </p>

          )}

        </div>

      </div>

      {message && <p className={`mt-4 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>}

    </SGCCard>

  );

};

const KYCPage: React.FC = () => {
  const { kycStatuses, loading, error, fetchKycStatus } = useKycStore();
  const [selectedRegion, setSelectedRegion] = useState<KycRegion>(REGIONS[0]);

  useEffect(() => {
    fetchKycStatus();
  }, [fetchKycStatus]);

  const selectedStatus = useMemo(() => kycStatuses.find(s => s.region === selectedRegion), [kycStatuses, selectedRegion]);
  const currentStatus = selectedStatus?.status || 'NOT_STARTED';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">KYC Verification</h1>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Region</label>
        <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value as KycRegion)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {loading && <p>Loading KYC status...</p>}
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}

      {!loading && !error && (
        <div>
          <SGCCard>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">Application Status</h2>
                <p className="text-sm text-gray-600">Your status for <span className="font-semibold">{selectedRegion}</span></p>
              </div>
              <StatusBadge status={currentStatus} />
            </div>
            {selectedStatus?.rejectionReason && <p className="mt-2 text-sm text-red-500 bg-red-50 p-2 rounded"><strong>Rejection Reason:</strong> {selectedStatus.rejectionReason}</p>}
          </SGCCard>

          {(currentStatus === 'DRAFT' || currentStatus === 'NOT_STARTED' || currentStatus === 'REJECTED') && (
            <div className="mt-6">
              <KycForm region={selectedRegion} status={selectedStatus} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KYCPage;