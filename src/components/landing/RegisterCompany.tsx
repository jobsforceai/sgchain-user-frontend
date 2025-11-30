"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import SGCBlackButton from '@/components/SGCBlackButton'
import Modal from '@/components/Modal'
import SGCInput from '@/components/SGCInput'
import { formsService, CompanyRegistrationPayload } from '@/services/forms.service'
import SGCButton from '../SGCButton'

const businessTypes = [
    { value: 'STARTUP', label: 'Startup' },
    { value: 'EXCHANGE', label: 'Crypto Exchange' },
    { value: 'HEDGE_FUND', label: 'Hedge Fund' },
    { value: 'FINTECH', label: 'FinTech Company' },
    { value: 'ENTERPRISE', label: 'Large Enterprise' },
    { value: 'OTHER', label: 'Other' },
];

const RegisterCompany: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState<CompanyRegistrationPayload>({
        companyName: '',
        businessType: businessTypes[0].value,
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        additionalInfo: '',
    });

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSubmissionStatus('idle');
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmissionStatus('loading');
        try {
            await formsService.submitCompanyRegistration(formData);
            setSubmissionStatus('success');
        } catch (error) {
            setSubmissionStatus('error');
        }
    };


    return (
        <>
            <section className="md:-my-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center">

                        {/* Left: heading, description, bullets, CTA */}
                        <div className='flex flex-col items-start md:items-center gap-4'>
                            <h2 className="text-3xl text-center md:text-5xl font-bold w-full">Register your company<br></br> at <span className='text-[#0121cb] font-cream'>Sgchain</span>   </h2>
                            <p className="mt-4 text-slate-700 max-w-md text-center">Start your on-chain journey: register your company to access institutional-grade tools, token issuance, and liquidity management tailored for enterprises.</p>

                            <div className="mt-6 flex justify-center w-full">
                                <SGCBlackButton name={"Register Now"} onClick={handleOpenModal} className="px-6 py-3" />
                            </div>
                        </div>

                        {/* Right: image card */}
                        <div className="relative">
                            <div className="rounded-xl overflow-hidden ">
                                <div className="">
                                    <Image src="/bse.png" alt="BSE" width={640} height={420} className="object-contain w-full h-full" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Register Your Company">
                {submissionStatus === 'success' ? (
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-green-600">Registration Submitted!</h3>
                        <p className="mt-2">Thank you for your interest. Our institutional team will contact you shortly.</p>
                        <SGCBlackButton name="Close" onClick={handleCloseModal} className="mt-6" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-1">
                        <SGCInput
                            id="companyName"
                            name="companyName"
                            label="Company Name"
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                        />
                        <SGCInput
                            id="businessType"
                            name="businessType"
                            label="Business Type"
                            type="select"
                            options={businessTypes}
                            value={formData.businessType}
                            onChange={handleChange}
                            required
                        />
                        <SGCInput
                            id="contactPerson"
                            name="contactPerson"
                            label="Contact Person"
                            value={formData.contactPerson}
                            onChange={handleChange}
                            required
                        />
                        <SGCInput
                            id="contactEmail"
                            name="contactEmail"
                            label="Contact Email"
                            type="email"
                            value={formData.contactEmail}
                            onChange={handleChange}
                            required
                        />
                        <SGCInput
                            id="contactPhone"
                            name="contactPhone"
                            label="Contact Phone (Optional)"
                            type="tel"
                            value={formData.contactPhone}
                            onChange={handleChange}
                        />
                         <div>
                            <label htmlFor="additionalInfo" className="block text-gray-700 text-sm font-bold mb-2">Additional Info (Optional)</label>
                            <textarea
                                id="additionalInfo"
                                name="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={handleChange}
                                rows={3}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="pt-4">
                            {/* <SGCBlackButton
                                name={submissionStatus === 'loading' ? 'Submitting...' : 'Submit Registration'}
                                type="submit"
                                disabled={submissionStatus === 'loading'}
                                className="w-full"
                            /> */}
                                <SGCButton
                                type="submit"
                                disabled={submissionStatus === 'loading' }
                            >
   {submissionStatus === 'loading' ? 'Submitting...' : 'Submit Registration'}
                            </SGCButton>
                        </div>
                        {submissionStatus === 'error' && (
                            <p className="mt-2 text-sm text-center text-red-600">An error occurred. Please try again.</p>
                        )}
                    </form>
                )}
            </Modal>
        </>
    )
}

export default RegisterCompany;