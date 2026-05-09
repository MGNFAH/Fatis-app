import MasonryGrid from "../components/MasonryGrid";

export default function Home({ onSpark }) {
  return (
    <main>
      <MasonryGrid onSpark={onSpark} />
    </main>
  );
}
