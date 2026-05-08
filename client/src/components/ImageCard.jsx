

import { useState } from 'react'

export default function ImageCard({ image }) {
  const [sparked, setSparked] = useState(false)

  return (
  <div className="relative group cursor-pointer overflow-hidden rounded-2xl mb-3 font-bold">
      
      <img
        src={image.url}
        alt={image.title}
        className="w-full object-cover"
        loading="lazy"
      />

      {/* Overlay al hover */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 flex flex-col justify-between">
        
        {/* Pulsante Spark in alto a destra */}
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation() // evita di aprire il modale quando clicchi spark
              setSparked(!sparked)
            }}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition
              ${sparked
                ? 'bg-yellow-400 text-black'
                : 'bg-white text-black hover:bg-yellow-400'
              }`}
          >
            {sparked ? '✦ Sparked' : '✦ Spark'}
          </button>
        </div>

        {/* Info in basso */}
        <div>
          <p className="text-white text-sm font-semibold truncate">{image.title}</p>
          <p className="text-neutral-400 text-xs">@{image.author}</p>
        </div>

      </div>
    </div>
  )
}