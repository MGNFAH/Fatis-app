import { useRef } from "react";
import ImageCard from "./ImageCard";
<div
  className="p-4 columns-2 md:columns-3 lg:columns-4 xl:columns-4 gap-x-3"
  onDoubleClick={(e) => alert("dblclick sulla GRIGLIA! " + e.target.tagName)}
></div>;
export default function MasonryGrid({ images, onSpark, onSelectImage }) {
  const cardTapMap = useRef({});
  const cardRefs = useRef({});

  return (
    <div className="p-4 columns-2 md:columns-3 lg:columns-4 xl:columns-4 gap-x-3">
      {images.map(
        (
          image, // ← era fakeImages.map, ora images.map
        ) => (
          <div
            key={image.id}
            className="mb-3 break-inside-avoid cursor-pointer"
            onClick={(e) => {
              const now = Date.now();
              const last = cardTapMap.current[image.id] || 0;

              if (now - last < 350) {
                cardTapMap.current[image.id] = 0;
                if (cardTapMap.current[`timer_${image.id}`]) {
                  clearTimeout(cardTapMap.current[`timer_${image.id}`]);
                  cardTapMap.current[`timer_${image.id}`] = null;
                }
                e.stopPropagation();
                cardRefs.current[image.id]?.triggerLove(e);
              } else {
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
        ),
      )}
    </div>
  );
}