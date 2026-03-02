
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
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-amber-900/10 p-8 border border-amber-100">
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">🥖</span>
          <h1 className="text-3xl font-serif font-bold text-amber-950 mb-2">The Bread Board</h1>
          <p className="text-amber-800 font-medium">Enter your team's secret key to manage the Friday bread rotation.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="groupKey" className="block text-sm font-bold text-amber-950 mb-1.5 uppercase tracking-wide">
              Group Secret Key
            </label>
            <input
              id="groupKey"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. engineering-team-123"
              className="w-full px-4 py-3 rounded-xl border-2 border-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none bg-amber-50/50 text-amber-950 placeholder-amber-900/40"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-amber-900/20 active:transform active:scale-[0.98]"
          >
            Enter Dashboard
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-amber-50">
          <p className="text-sm text-center text-amber-900/60 leading-relaxed">
            Share this key with your colleagues so everyone can see who's next.
          </p>
        </div>
      </div>
    </div>
  );
};
