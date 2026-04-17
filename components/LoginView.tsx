import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: (key: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
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
        <div className="text-center mb-8">
          <h1
            className="text-[40px] font-[600] leading-[1.10] text-[#1d1d1f] mb-2"
            style={{ fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif', letterSpacing: 'normal' }}
          >
            Brødtavlen
          </h1>
          <p className="text-[17px] leading-[1.47] text-[rgba(0,0,0,0.48)]" style={{ letterSpacing: '-0.374px' }}>
            Indtast jeres hemmelige nøgle for at styre fredagsrotationen.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="groupKey"
              className="block text-[14px] font-[600] text-[#1d1d1f] mb-1.5 leading-[1.29]"
              style={{ letterSpacing: '-0.224px' }}
            >
              Gruppe-nøgle
            </label>
            <input
              id="groupKey"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="f.eks. marketing-team-123"
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
            Gå til oversigten
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[rgba(0,0,0,0.06)]">
          <p
            className="text-[14px] text-center text-[rgba(0,0,0,0.48)] leading-[1.47]"
            style={{ letterSpacing: '-0.224px' }}
          >
            Del nøglen med dine kolleger, så alle kan se, hvem der er næste.
          </p>
        </div>
      </div>
    </div>
  );
};
