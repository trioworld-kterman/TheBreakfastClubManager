
import React, { useState, useEffect, useCallback } from 'react';
import { GroupData, Employee } from './types';
import { LoginView } from './components/LoginView';
import { Dashboard } from './components/Dashboard';
import { StorageService } from './utils/StorageService';

const App: React.FC = () => {
  const [groupKey, setGroupKey] = useState<string | null>(null);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const init = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const urlDataEncoded = params.get('data');
    
    // 1. If we have data in the URL, this is a shared link
    if (urlDataEncoded) {
      const sharedData = StorageService.decodeState(urlDataEncoded);
      if (sharedData) {
        setGroupData(sharedData);
        setGroupKey(sharedData.key);
        StorageService.saveLocal(sharedData.key, sharedData);
        StorageService.setLastKey(sharedData.key);
        setIsLoading(false);
        return;
      }
    }

    // 2. Otherwise, check for a key in the hash (Login path)
    const hash = window.location.hash.replace('#', '');
    const activeKey = hash || StorageService.getLastKey();

    if (activeKey) {
      const decodedKey = decodeURIComponent(activeKey);
      setGroupKey(decodedKey);
      const local = StorageService.loadLocal(decodedKey);
      if (local) {
        setGroupData(local);
      } else {
        const name = decodedKey.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        setGroupData({ key: decodedKey, name: `${name} Bread Board`, employees: [] });
      }
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    init();
    const handleHash = () => init();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [init]);

  const updateEmployees = (newEmployees: Employee[]) => {
    if (!groupKey || !groupData) return;
    const updated = { ...groupData, employees: newEmployees };
    
    setGroupData(updated);
    StorageService.saveLocal(groupKey, updated);
    StorageService.setLastKey(groupKey);

    // Update URL hash silently
    if (window.location.hash !== `#${groupKey}`) {
      window.history.replaceState(null, '', `#${encodeURIComponent(groupKey)}`);
    }
  };

  const handleLogin = (key: string) => {
    const sanitized = key.trim().toLowerCase().replace(/\s+/g, '-');
    window.location.hash = encodeURIComponent(sanitized);
    // init() is called via hashchange
  };

  const handleLogout = () => {
    setGroupKey(null);
    setGroupData(null);
    localStorage.removeItem('bread_last_key');
    window.location.href = window.location.pathname;
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#fdfaf6] flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl animate-bounce mb-6">🥨</div>
        <h2 className="text-2xl font-serif font-black text-amber-950">Warming up...</h2>
      </div>
    </div>
  );

  if (!groupKey) return <LoginView onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#fdfaf6]">
      {groupData && (
        <Dashboard 
          data={groupData} 
          onUpdate={updateEmployees} 
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
