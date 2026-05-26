export default function LoadingDots({ label = "AI 思考中" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-gray-400 text-sm py-4">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-purple-500 inline-block"
            style={{
              animation: `pulse-glow 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <span>{label}</span>
    </div>
  );
}
