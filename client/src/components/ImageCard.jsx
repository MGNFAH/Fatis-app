import { useState } from 'react'
import { FaHeart } from 'react-icons/fa'

export default function ImageCard({ image, onSpark }) {
  const [sparked, setSparked] = useState(false)
  const [animating, setAnimating] = useState(false)

  const handleLove = (e) => {
    e.stopPropagation()
    if (!sparked) {
      setAnimating(true)
      setTimeout(() => setAnimating(false), 400)
      onSpark?.() // notifica la navbar
      
    }
  else  setSparked(!sparked)
  }

  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-lg">
      <img
        src={image.url}
        alt={image.title}
        className="w-full object-cover"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">

        <div className="flex justify-end">
          <button
            onClick={handleLove
                
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
              ${sparked
                ? 'bg-[#E8000D] text-white'
                : 'bg-white text-[#E8000D] hover:bg-[#E8000D] hover:text-white'
              }`}
          >
            <FaHeart className={`text-sm ${animating ? 'heart-pop' : ''}`} />
            {sparked ? 'I\'m loving it' : 'Love it'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <img
            src={image.avatar}
            alt={image.author}
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-full object-cover border-2 border-white/60 flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate leading-tight">{image.title}</p>
            <p className="text-neutral-300 text-xs truncate leading-tight">@{image.author}</p>
          </div>
        </div>

      </div>
    </div>
  )
}