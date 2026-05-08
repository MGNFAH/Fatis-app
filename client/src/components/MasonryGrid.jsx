import ImageCard from "./ImageCard";

// Dati finti per ora — verranno dal backend in futuro
const fakeImages = [
  {
    id: 1,
    url: "https://picsum.photos/seed/art1/400/500",
    title: "Opera uno",
    author: "artista1",
  },
  {
    id: 2,
    url: "https://picsum.photos/seed/art2/400/300",
    title: "Opera due",
    author: "artista2",
  },
  {
    id: 3,
    url: "https://picsum.photos/seed/art3/400/600",
    title: "Opera tre",
    author: "artista3",
  },
  {
    id: 4,
    url: "https://picsum.photos/seed/art4/400/400",
    title: "Opera quattro",
    author: "artista4",
  },
  {
    id: 5,
    url: "https://picsum.photos/seed/art5/400/350",
    title: "Opera cinque",
    author: "artista5",
  },
  {
    id: 6,
    url: "https://picsum.photos/seed/art6/400/550",
    title: "Opera sei",
    author: "artista6",
  },
  {
    id: 7,
    url: "https://picsum.photos/seed/art7/400/450",
    title: "Opera sette",
    author: "artista7",
  },
  {
    id: 8,
    url: "https://picsum.photos/seed/art8/400/300",
    title: "Opera otto",
    author: "artista8",
  },
];

export default function MasonryGrid() {
  return (
    <div className="p-4 columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-x-3">
      {fakeImages.map((image) => (
        <div key={image.id} className="">
          <ImageCard image={image} />
        </div>
      ))}
    </div>
  );
}
