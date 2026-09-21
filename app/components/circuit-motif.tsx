/// A decorative circuit-board corner motif — staircase traces with dots at
/// the joints — purely atmospheric background texture behind the hero copy.
export function CircuitMotif({ className, flip = false }: { className?: string; flip?: boolean }) {
  const path = "M0 60 H40 V30 H90 V0 H150";
  const joints: [number, number][] = [
    [0, 60],
    [40, 60],
    [40, 30],
    [90, 30],
    [90, 0],
    [150, 0],
  ];
  return (
    <svg
      aria-hidden
      viewBox="0 0 240 120"
      className={className}
      style={flip ? { transform: "scale(-1, -1)" } : undefined}
    >
      {[0, 1, 2].map((row) => (
        <path key={row} d={path} transform={`translate(${row * 30} ${row * 20})`} fill="none" stroke="currentColor" strokeWidth="1" />
      ))}
      {joints.map(([x, y], i) => (
        <circle key={i} cx={x + 10} cy={y + 6} r="2.5" fill="currentColor" />
      ))}
    </svg>
  );
}
