import React from 'react'
import Image from 'next/image'

const ApiCard1 = () => {
    return (
        <div className="flex flex-col md:flex-row w-full items-center md:items-stretch gap-6">
            <div className='md:w-1/2 w-full flex flex-col justify-center px-6 md:px-8 gap-4'>
                {/* <h2 className='text-3xl md:text-4xl font-bold text-left'>Powerful, Simple, and Secure Token Integration</h2> */}
                <p className="text-left text-gray-600">
                  Unlock the full potential of digital assets with the SGChain API. Our robust infrastructure provides everything you need to seamlessly integrate token creation, management, and transactions directly into your applications. Focus on building incredible user experiences while we handle the complexities of the underlying blockchain technology.
                </p>
            </div>

            {/* Image column with dotted background + dark-blue edge gradient */}
            <div className='md:w-1/2 w-full flex items-center justify-center'>
                <div
                    className="relative w-full rounded-lg overflow-hidden"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(1,33,203,0.4) 1px, rgba(1,33,203,0) 2px)`,
                        backgroundSize: '24px 24px',
                        backgroundRepeat: 'repeat',
                        backgroundPosition: 'center',
                        padding: '1rem'
                    }}
                >
                    <div className="w-full h-56 md:h-80 lg:h-96">
                      <Image
                        src="/api1.png"
                        alt="api key image"
                        width={800}
                        height={600}
                        className='w-full h-full object-contain' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ApiCard1