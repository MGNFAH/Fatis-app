import { useState, useEffect } from "react";

const PLACEHOLDERS = [
  "Cerca Preraffaelliti...",
  "Cerca Van Gogh...",
  "Cerca paesaggi romantici...",
  "Cerca natura morta...",
  "Cerca Impressionismo...",
  "Cerca Frida Kahlo...",
  "Cerca arte simbolista...",
  "Cerca ritratti rinascimentali...",
  "Cerca surrealismo...",
  "Cerca Hokusai...",
];

export function useRotatingPlaceholder(interval = 3000) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      // Fade out
      setVisible(false);
      // Cambia testo a metà transizione
      setTimeout(() => {
        setIndex((i) => (i + 1) % PLACEHOLDERS.length);
        setVisible(true);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return { placeholder: PLACEHOLDERS[index], visible };
}
