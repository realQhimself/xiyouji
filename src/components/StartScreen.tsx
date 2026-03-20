import { hasSave } from '../engine/gameState.ts';
import { storyNodeMap } from '../data/story/index.ts';
import { getActTitle } from './StatusBar.tsx';

interface StartScreenProps {
  onStart: () => void;
  onContinue?: () => void;
}

/**
 * Start/title screen.
 * Dark, atmospheric, minimal.
 */
export default function StartScreen({ onStart, onContinue }: StartScreenProps) {
  const savedGame = hasSave();

  // 获取存档进度描述
  const getSaveHint = (): string | null => {
    if (!savedGame) return null;
    try {
      const raw = localStorage.getItem('xiyouji-save');
      if (!raw) return null;
      const save = JSON.parse(raw);
      const node = storyNodeMap.get(save.currentNodeId);
      if (!node) return null;
      return `${getActTitle(node.actId)} · ${node.title}`;
    } catch {
      return null;
    }
  };

  const saveHint = getSaveHint();

  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-6 bg-gradient-to-b from-ink-dark via-ink-black to-ink-dark">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Game title */}
        <h1 className="text-5xl md:text-7xl text-dao-gold tracking-[0.4em] font-normal leading-tight">
          西游·心猿
        </h1>

        {/* Subtitle */}
        <p className="text-paper-dim/70 text-lg md:text-xl tracking-widest leading-relaxed">
          你不是孙悟空。你是他的心。
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="w-12 h-px bg-dao-gold/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-dao-gold/30" />
          <div className="w-12 h-px bg-dao-gold/20" />
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-4">
          {/* Continue button (only if save exists) */}
          {savedGame && onContinue && (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={onContinue}
                className="
                  px-12 py-4 rounded-lg
                  border border-dao-gold/50
                  text-dao-gold text-xl tracking-[0.5em]
                  bg-dao-gold/5
                  hover:bg-dao-gold/15 hover:border-dao-gold/70
                  hover:shadow-[0_0_30px_rgba(212,168,83,0.2)]
                  active:scale-[0.98]
                  transition-all duration-500
                "
              >
                继续
              </button>
              {saveHint && (
                <p className="text-paper-dim/40 text-xs tracking-wider">
                  {saveHint}
                </p>
              )}
            </div>
          )}

          {/* New game button */}
          <button
            onClick={onStart}
            className={`
              px-12 py-4 rounded-lg
              border border-dao-gold/30
              text-dao-gold tracking-[0.5em]
              hover:bg-dao-gold/10 hover:border-dao-gold/50
              hover:shadow-[0_0_30px_rgba(212,168,83,0.15)]
              active:scale-[0.98]
              transition-all duration-500
              ${savedGame ? 'text-base' : 'text-xl'}
            `}
          >
            {savedGame ? '重新开始' : '开始'}
          </button>
        </div>
      </div>

      {/* Bottom hint */}
      <p className="absolute bottom-8 text-paper-dim/30 text-xs tracking-wider">
        一个关于心性的互动故事
      </p>
    </div>
  );
}
