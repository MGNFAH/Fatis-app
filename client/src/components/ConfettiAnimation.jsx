import confetti from "canvas-confetti";

export function launchLevelUpConfetti(ref) {
  if (!ref?.current) return;

  const rect = ref.current.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  // Burst centrale
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { x, y },
    colors: ["#E8000D", "#ff4d4d", "#ffffff", "#facc15", "#fb923c"],
    startVelocity: 30,
    scalar: 0.9,
    zIndex: 9999,
  });

  // Burst sinistro
  setTimeout(() => {
    confetti({
      particleCount: 30,
      angle: 60,
      spread: 50,
      origin: { x: x - 0.05, y },
      colors: ["#E8000D", "#ffffff", "#facc15"],
      startVelocity: 25,
      scalar: 0.8,
      zIndex: 9999,
    });
  }, 150);

  // Burst destro
  setTimeout(() => {
    confetti({
      particleCount: 30,
      angle: 120,
      spread: 50,
      origin: { x: x + 0.05, y },
      colors: ["#E8000D", "#ffffff", "#fb923c"],
      startVelocity: 25,
      scalar: 0.8,
      zIndex: 9999,
    });
  }, 250);
}
