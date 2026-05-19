import React, { useState } from 'react';
import { Language, getT } from '../utils/i18n';

interface LoginViewProps {
  onLogin: (key: string) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, lang, onLangChange }) => {
  const t = getT(lang);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onLogin(input.trim().toLowerCase());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-md w-full bg-white rounded-[12px] shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px] p-8">
        <div className="flex justify-end mb-4">
          <div className="flex items-center rounded-[8px] border-2 border-[rgba(0,0,0,0.10)] overflow-hidden text-[12px] font-[600]">
            <button
              type="button"
              onClick={() => onLangChange('da')}
              aria-pressed={lang === 'da'}
              className={`px-3 py-1 transition-all ${lang === 'da' ? 'bg-amber-950 text-white' : 'bg-white text-[rgba(0,0,0,0.48)] hover:bg-amber-50'}`}
            >
              DA
            </button>
            <button
              type="button"
              onClick={() => onLangChange('en')}
              aria-pressed={lang === 'en'}
              className={`px-3 py-1 transition-all ${lang === 'en' ? 'bg-amber-950 text-white' : 'bg-white text-[rgba(0,0,0,0.48)] hover:bg-amber-50'}`}
            >
              EN
            </button>
          </div>
        </div>
        <div className="text-center mb-8">
          <h1
            className="text-[40px] font-[600] leading-[1.10] text-[#1d1d1f] mb-2"
            style={{ fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif', letterSpacing: 'normal' }}
          >
            {t.appTitle}
          </h1>
          <p className="text-[17px] leading-[1.47] text-[rgba(0,0,0,0.48)]" style={{ letterSpacing: '-0.374px' }}>
            {t.loginSubtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="groupKey"
              className="block text-[14px] font-[600] text-[#1d1d1f] mb-1.5 leading-[1.29]"
              style={{ letterSpacing: '-0.224px' }}
            >
              {t.groupKeyLabel}
            </label>
            <input
              id="groupKey"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t.groupKeyPlaceholder}
              className="w-full px-4 py-3 rounded-[11px] border-[3px] border-[rgba(0,0,0,0.04)] focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none bg-white text-[#1d1d1f] text-[17px] placeholder-[rgba(0,0,0,0.3)]"
              style={{ letterSpacing: '-0.374px' }}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-amber-700 hover:bg-amber-800 text-white font-[400] text-[17px] py-3 px-6 rounded-[8px] transition-all active:scale-[0.98]"
            style={{ letterSpacing: '-0.374px' }}
          >
            {t.loginButton}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[rgba(0,0,0,0.06)]">
          <p
            className="text-[14px] text-center text-[rgba(0,0,0,0.48)] leading-[1.47]"
            style={{ letterSpacing: '-0.224px' }}
          >
            {t.loginFooter}
          </p>
        </div>
      </div>
    </div>
  );
};
