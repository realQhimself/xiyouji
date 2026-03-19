import { useState, useCallback } from 'react';
import type { GameState, EndingResult } from '../data/types.ts';
import { EndingType } from '../data/types.ts';
import { ENDING_DISPLAY_NAMES, ENDING_SUBTITLES } from '../engine/endings.ts';
import TypewriterText from './TypewriterText.tsx';

interface EndingScreenProps {
  ending: EndingResult;
  state: GameState;
  onRestart: () => void;
}

/** Poetic stat descriptions */
function getStatDescription(stat: 'daoXin' | 'yaoXing' | 'yiQi', value: number): string {
  if (stat === 'daoXin') {
    if (value >= 80) return '你的道心如皓月当空，清辉万里';
    if (value >= 60) return '你的道心如明月，虽有云遮，终见光明';
    if (value >= 40) return '你的道心如弦月，半明半暗';
    if (value >= 20) return '你的道心如残月，隐约可见';
    return '你的道心如新月，隐匿在黑暗中';
  }
  if (stat === 'yaoXing') {
    if (value >= 80) return '你的妖性如山火燎原，不可遏制';
    if (value >= 60) return '你的妖性如山火，烧过之处寸草不生';
    if (value >= 40) return '你的妖性如篝火，忽明忽暗';
    if (value >= 20) return '你的妖性如烛火，摇曳不定';
    return '你的妖性如余烬，几近熄灭';
  }
  // yiQi
  if (value >= 80) return '你的义气比铁坚，比山重';
  if (value >= 60) return '你的义气如铁，淬火之后更硬';
  if (value >= 40) return '你的义气如铜，有分量但会弯';
  if (value >= 20) return '你的义气如竹，中空但不折';
  return '你的义气如丝，纤细却未断';
}

/** Short poetic stat label for sharing */
function getStatShareLabel(stat: 'daoXin' | 'yaoXing' | 'yiQi', value: number): string {
  if (stat === 'daoXin') {
    if (value >= 60) return '明月';
    if (value >= 30) return '弦月';
    return '残月';
  }
  if (stat === 'yaoXing') {
    if (value >= 60) return '山火';
    if (value >= 30) return '篝火';
    return '余烬';
  }
  if (value >= 60) return '铁石';
  if (value >= 30) return '铜铸';
  return '竹丝';
}

/** Get the most memorable moment based on key choices */
function getMostMemorableMoment(state: GameState): string {
  if (state.flags.FLAG_sixEar_acknowledge) {
    return '面对六耳猕猴说出"你是我，但我不走你那条路"的那一刻';
  }
  if (state.flags.FLAG_whiteBone_rupture) {
    return '三打白骨精后撕碎贬书的那一刻';
  }
  if (state.flags.FLAG_band_acceptance) {
    return '紧箍初罚时选择接受约束的那一刻';
  }
  if (state.flags.FLAG_mountain_reflection) {
    return '五行山下开始反思的那五百年';
  }
  if (state.flags.FLAG_subodhi_gratitude) {
    return '离开菩提祖师时磕下的三个头';
  }
  if (state.flags.FLAG_bullKing_peace) {
    return '与牛魔王重逢时选择和解的那一刻';
  }
  return '从石头缝里睁开眼看见天地的那一瞬';
}

export default function EndingScreen({ ending, state, onRestart }: EndingScreenProps) {
  const [textComplete, setTextComplete] = useState(false);
  const [copied, setCopied] = useState(false);

  const endingName = ENDING_DISPLAY_NAMES[ending.ending];
  const endingSubtitle = ENDING_SUBTITLES[ending.ending];

  const handleShare = useCallback(() => {
    const daoLabel = getStatShareLabel('daoXin', state.stats.daoXin);
    const yaoLabel = getStatShareLabel('yaoXing', state.stats.yaoXing);
    const yiLabel = getStatShareLabel('yiQi', state.stats.yiQi);
    const memorable = getMostMemorableMoment(state);

    const shareText = `西游·心猿 | 我走完了这条取经路。
结局：${endingName}
道心如${daoLabel}，妖性似${yaoLabel}，义气比${yiLabel}。
善业${state.stats.shanYe}笔，恶业${state.stats.eYe}笔。
这一路，我最难忘的是——${memorable}
你也来试试？`;

    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [state, endingName]);

  // Background gradient based on ending
  const bgGradient = (() => {
    switch (ending.ending) {
      case EndingType.DouZhanShengFo:
        return 'from-amber-900/20 via-ink-black to-amber-950/10';
      case EndingType.QiTianDaSheng:
        return 'from-green-950/30 via-ink-black to-ink-dark';
      case EndingType.XinYuanGuiZheng:
        return 'from-blue-950/20 via-ink-black to-amber-950/10';
      case EndingType.DaShengYunLuo:
        return 'from-gray-900/30 via-ink-black to-ink-dark';
      case EndingType.HunShiMoWang:
        return 'from-red-950/30 via-ink-black to-purple-950/20';
      default:
        return 'from-ink-dark via-ink-black to-ink-dark';
    }
  })();

  return (
    <div className={`min-h-svh bg-gradient-to-b ${bgGradient} flex flex-col items-center justify-center px-6 py-12`}>
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Ending title */}
        <div className="animate-fade-in space-y-2">
          <h1 className="text-4xl md:text-5xl text-dao-gold tracking-[0.3em] font-normal">
            {endingName}
          </h1>
          <p className="text-paper-dim/60 text-lg tracking-widest">
            {endingSubtitle}
          </p>
        </div>

        {/* Divider */}
        <div className="animate-fade-in">
          <div className="w-16 h-px bg-dao-gold/30 mx-auto" />
        </div>

        {/* Main ending text */}
        <div className="text-left animate-fade-in">
          <TypewriterText
            text={ending.mainText}
            speed={40}
            onComplete={() => setTextComplete(true)}
            className="text-paper leading-loose text-base md:text-lg whitespace-pre-line"
          />
        </div>

        {/* Karma variant paragraphs */}
        {textComplete && ending.karmaVariants.length > 0 && (
          <div className="text-left space-y-4 animate-fade-in">
            {ending.karmaVariants.map((text, i) => (
              <div key={i} className="border-l-2 border-echo-border pl-4">
                <p className="text-paper-dim/80 italic leading-loose text-base">
                  {text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Stat descriptions */}
        {textComplete && (
          <div className="space-y-3 animate-fade-in pt-4">
            <div className="w-8 h-px bg-paper-dim/20 mx-auto mb-6" />
            <p className="text-dao-gold/80 text-sm leading-relaxed">
              {getStatDescription('daoXin', state.stats.daoXin)}
            </p>
            <p className="text-yao-red-bright/80 text-sm leading-relaxed">
              {getStatDescription('yaoXing', state.stats.yaoXing)}
            </p>
            <p className="text-yi-blue-bright/80 text-sm leading-relaxed">
              {getStatDescription('yiQi', state.stats.yiQi)}
            </p>
          </div>
        )}

        {/* Action buttons */}
        {textComplete && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-fade-in">
            <button
              onClick={onRestart}
              className="
                px-8 py-3 rounded-lg
                border border-dao-gold/40
                text-dao-gold hover:bg-dao-gold/10
                transition-all duration-300
                text-base tracking-widest
              "
            >
              再来一次
            </button>
            <button
              onClick={handleShare}
              className="
                px-8 py-3 rounded-lg
                border border-paper-dim/30
                text-paper-dim hover:bg-paper-dim/10
                transition-all duration-300
                text-base tracking-widest
              "
            >
              {copied ? '已复制' : '分享结果'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
