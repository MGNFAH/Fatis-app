import ImageCard from "./ImageCard";
import { fakeImages } from "../data/placeholderImages";
import { useRef } from "react";

export default function MasonryGrid({ onSpark, onSelectImage }) {
  const cardTapMap = useRef({}); // ← qui, DENTRO il componente ma FUORI dal return

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
              // Doppio click — lova, non aprire modale
              cardTapMap.current[image.id] = 0;
              e.stopPropagation();
            } else {
              // Click singolo — apri modale
              cardTapMap.current[image.id] = now;
              onSelectImage(image); // ← usa onSelectImage, non openModal
            }
          }}
        >
          <ImageCard image={image} onSpark={onSpark} />
        </div>
      ))}
    </div>
  );
}
