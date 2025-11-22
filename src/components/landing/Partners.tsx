import React from 'react'
import Image from 'next/image'

const icons = [
  '/partners/icon1.svg',
  '/partners/icon2.svg',
  '/partners/icon3.svg',
  '/partners/icon4.svg',
]

const Partners = () => {
  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
        <p className="text-md text-slate-400 text-center">Trusted by</p>

        <div className="mt-4 flex items-center gap-6 flex-wrap">
          {icons.map((src, i) => (
            <div key={i} className="w-32 h-18 relative">
              <Image src={src} alt={`partner-${i + 1}`} width={140} height={60} className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Partners