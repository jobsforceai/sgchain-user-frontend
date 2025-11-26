"use client"

import React from 'react'
import Image from 'next/image'
import SGCBlackButton from '../SGCBlackButton'

const ApiCard2 = () => {
    return (
        <div className="flex flex-col md:flex-row w-full items-center md:items-stretch gap-6">

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
                        src="/api4.png"
                        alt="api key image"
                        width={800}
                        height={600}
                        className='w-full h-full object-contain' />
                    </div>
                </div>
            </div>
            <div className='md:w-1/2 w-full flex flex-col justify-center items-center gap-4 px-6 md:px-8'>
                <h2 className='text-center md:text-left'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem architecto aut magni ex enim accusantium assumenda exercitationem tempora obcaecati </h2>
                <SGCBlackButton name="Documentation" link="/documentation" />
            </div>
        </div>
    )
}

export default ApiCard2