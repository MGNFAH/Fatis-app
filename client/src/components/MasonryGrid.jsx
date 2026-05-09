import ImageCard from "./ImageCard";
import { fakeImages } from "../data/placeholderImages";

export default function MasonryGrid({ onSpark, onSelectImage }) {
  return (
    <div className="p-4 columns-2 md:columns-3 lg:columns-4 xl:columns-4 gap-x-3">
      {fakeImages.map((image) => (
        <div
          key={image.id}
          className="mb-3 break-inside-avoid cursor-pointer"
          onClick={() => onSelectImage(image)}
        >
          <ImageCard image={image} onSpark={onSpark} />
        </div>
      ))}
    </div>
  );
}
