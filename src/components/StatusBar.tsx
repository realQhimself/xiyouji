import { useState } from 'react';
import type { Stats } from '../data/types.ts';

interface StatusBarProps {
  actTitle: string;
  stats: Stats;
}

const ACT_TITLES: Record<number, string> = {
  1: '第一幕：石中生',
  2: '第二幕：天不收',
  3: '第三幕：金与环',
  4: '第四幕：火与心',
  5: '第五幕：灵山',
};

export function getActTitle(actId: number): string {
  return ACT_TITLES[actId] ?? '西游·心猿';
}

/**
 * Top status bar showing current act title and three progress bars.
 * On mobile, can be collapsed to icon-only mode.
 */
export default function StatusBar({ actTitle, stats }: StatusBarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const bars = [
    {
      label: '道心',
      emoji: '🪷',
      value: stats.daoXin,
      color: 'bg-dao-gold',
      trackColor: 'bg-dao-gold/20',
    },
    {
      label: '妖性',
      emoji: '🔥',
      value: stats.yaoXing,
      color: 'bg-yao-red',
      trackColor: 'bg-yao-red/20',
    },
    {
      label: '义气',
      emoji: '⚔️',
      value: stats.yiQi,
      color: 'bg-yi-blue',
      trackColor: 'bg-yi-blue/20',
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink-dark/90 backdrop-blur-sm border-b border-ink-light/50">
      <div className="max-w-2xl mx-auto px-4 py-2">
        {/* Act title + collapse toggle */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm text-paper-dim tracking-widest">{actTitle}</h2>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-paper-dim/60 text-xs md:hidden p-1"
            aria-label={collapsed ? '展开状态栏' : '收起状态栏'}
          >
            {collapsed ? '展开' : '收起'}
          </button>
        </div>

        {/* Progress bars */}
        {collapsed ? (
          // Collapsed: icon-only row
          <div className="flex items-center gap-3">
            {bars.map((bar) => (
              <div key={bar.label} className="flex items-center gap-1">
                <span className="text-xs">{bar.emoji}</span>
                <div className={`w-8 h-1 rounded-full ${bar.trackColor} overflow-hidden`}>
                  <div
                    className={`h-full rounded-full ${bar.color} transition-all duration-700 ease-out`}
                    style={{ width: `${bar.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Expanded: full bars
          <div className="flex flex-col gap-1.5">
            {bars.map((bar) => (
              <div key={bar.label} className="flex items-center gap-2">
                <span className="text-xs w-5 text-center shrink-0">{bar.emoji}</span>
                <div className={`flex-1 h-1.5 rounded-full ${bar.trackColor} overflow-hidden`}>
                  <div
                    className={`h-full rounded-full ${bar.color} transition-all duration-700 ease-out`}
                    style={{ width: `${bar.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
