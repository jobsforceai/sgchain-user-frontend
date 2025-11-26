import React from 'react'
import Image from 'next/image'

const ApiCard1 = () => {
    return (
        <div className="flex flex-col md:flex-row w-full items-center md:items-stretch gap-6">
            <div className='md:w-1/2 w-full flex items-center px-6 md:px-8'>
                <h2 className='text-center md:text-left'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem architecto aut magni ex enim accusantium assumenda exercitationem tempora obcaecati </h2>
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