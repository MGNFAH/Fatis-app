import { useRef } from "react";
import ImageCard from "./ImageCard";
import { fakeImages } from "../data/placeholderImages";
<div
  className="p-4 columns-2 md:columns-3 lg:columns-4 xl:columns-4 gap-x-3"
  onDoubleClick={(e) => alert("dblclick sulla GRIGLIA! " + e.target.tagName)}
></div>
export default function MasonryGrid({ onSpark, onSelectImage }) {
  const cardTapMap = useRef({});
  const cardRefs = useRef({});

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
              // Doppio click rilevato
              cardTapMap.current[image.id] = 0;
              // Cancella il timer del click singolo se ancora in attesa
              if (cardTapMap.current[`timer_${image.id}`]) {
                clearTimeout(cardTapMap.current[`timer_${image.id}`]);
                cardTapMap.current[`timer_${image.id}`] = null;
              }
              e.stopPropagation();
              cardRefs.current[image.id]?.triggerLove(e);
            } else {
              // Aspetta 350ms prima di aprire il modale
              cardTapMap.current[image.id] = now;
              cardTapMap.current[`timer_${image.id}`] = setTimeout(() => {
                cardTapMap.current[`timer_${image.id}`] = null;
                onSelectImage(image);
              }, 250);
            }
          }}
        >
          <ImageCard
            image={image}
            onSpark={onSpark}
            ref={(el) => {
              cardRefs.current[image.id] = el;
            }}
          />
        </div>
      ))}
    </div>
  );
}
