
import MasonryGrid from "../components/MasonryGrid";

export default function Home() {
  return (
    <main>
      <MasonryGrid onSpark={() => setSparkCount((c) => c + 1)} />
    </main>
  );
}
