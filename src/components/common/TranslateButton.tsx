import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { translateEnglishToHindi } from '../../utils/translationService';

interface Props {
  englishText: string;
  onTranslated: (hindiText: string) => void;
  className?: string;
  size?: 'sm' | 'xs';
}

export const TranslateButton: React.FC<Props> = ({
  englishText,
  onTranslated,
  className = '',
  size = 'xs'
}) => {
  const [loading, setLoading] = useState(false);

  const handleTranslate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!englishText || !englishText.trim()) return;

    setLoading(true);
    try {
      const translated = await translateEnglishToHindi(englishText);
      if (translated) {
        onTranslated(translated);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const isSmall = size === 'xs';

  return (
    <button
      type="button"
      onClick={handleTranslate}
      disabled={loading || !englishText.trim()}
      title="Auto-translate English text to Hindi (अंग्रेज़ी से हिंदी में अनुवाद करें)"
      className={`inline-flex items-center gap-1 font-semibold rounded-md border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
        isSmall ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      } bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 ${className}`}
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin text-emerald-700" />
      ) : (
        <Sparkles className="w-3 h-3 text-emerald-600" />
      )}
      <span>{loading ? 'अनुवाद...' : 'Translate to हिंदी'}</span>
    </button>
  );
};
