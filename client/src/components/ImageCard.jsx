export default function ImageCard({ image }) {
  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-2xl mb-3 font-bold">
      {/* Immagine */}
      <img
        src={image.url}
        alt={image.title}
        className="w-full object-cover"
        loading="lazy"
      />

      {/* Overlay al hover */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 flex flex-col justify-end">
        <p className="text-white text-sm font-semibold truncate">
          {image.title}
        </p>
        <p className="text-neutral-400 text-xs">@{image.author}</p>
      </div>
    </div>
  );
}
