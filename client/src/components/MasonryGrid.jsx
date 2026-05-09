import ImageCard from "./ImageCard";
import { fakeImages } from "../data/placeholderImages";
import { useRef } from "react";
export default function MasonryGrid({ onSpark, onSelectImage }) {
  return (

    <div className="p-4 columns-2 md:columns-3 lg:columns-4 xl:columns-4 gap-x-3">
      {fakeImages.map((image) => (
        <div
          key={image.id}
          className="mb-3 break-inside-avoid cursor-pointer"
          onClick={(e) => {
            const now = Date.now();
            const last = cardTapMap.current[image.id] || 0;

            if (now - last < 350) {
              // Doppio click — non aprire il modale
              cardTapMap.current[image.id] = 0;
              e.stopPropagation();
            } else {
              // Click singolo — apri il modale normalmente
              cardTapMap.current[image.id] = now;
              openModal(image);
            }
          }}
        >
          
          <ImageCard image={image} onSpark={onSpark} />
        </div>
      ))}
    </div>
        const cardTapMap = useRef({})
  );
}
