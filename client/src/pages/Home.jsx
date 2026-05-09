import MasonryGrid from "../components/MasonryGrid";

export default function Home({ onSpark, onSelectImage }) {
  return (
    <main>
      <MasonryGrid onSpark={onSpark} onSelectImage={onSelectImage} />
    </main>
  );
}
