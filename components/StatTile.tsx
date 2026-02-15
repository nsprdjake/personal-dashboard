'use client';

interface StatTileProps {
  emoji: string;
  label: string;
  value: number | string;
  subtitle: string;
  onClick: () => void;
}

export default function StatTile({ emoji, label, value, subtitle, onClick }: StatTileProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all hover:scale-105 cursor-pointer text-left border border-white/20"
    >
      <div className="text-4xl mb-2">{emoji}</div>
      <div className="text-purple-200 text-sm font-medium uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-4xl font-bold text-white mb-2">{value}</div>
      <div className="text-purple-200 text-sm">{subtitle}</div>
    </button>
  );
}
