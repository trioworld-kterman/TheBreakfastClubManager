import React, { useState, useEffect, useCallback } from 'react';
import { GroupData, Employee } from './types';
import { LoginView } from './components/LoginView';
import { Dashboard } from './components/Dashboard';
import { StorageService, LAST_KEY_STORAGE_KEY } from './utils/StorageService';
import { FirebaseService } from './utils/FirebaseService';

const App: React.FC = () => {
  const [groupKey, setGroupKey] = useState<string | null>(null);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const init = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);
    const urlDataEncoded = params.get('data');

    if (urlDataEncoded) {
      const sharedData = StorageService.decodeState(urlDataEncoded);
      if (sharedData) {
        await FirebaseService.migrateFromLocalStorage(sharedData.key, sharedData);
        window.history.replaceState(null, '', `/#${encodeURIComponent(sharedData.key)}`);
        setGroupKey(sharedData.key);
        return;
      }
    }

    const hash = window.location.hash.replace('#', '');
    const activeKey = hash || StorageService.getLastKey();

    if (activeKey) {
      const decodedKey = decodeURIComponent(activeKey);
      setGroupKey(decodedKey);

      const local = StorageService.loadLocal(decodedKey);
      if (local) {
        await FirebaseService.migrateFromLocalStorage(decodedKey, local);
      } else {
        const name = decodedKey.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        await FirebaseService.createGroup(decodedKey, `${name} Bread Board`);
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    init();
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setGroupKey(decodeURIComponent(hash));
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [init]);

  useEffect(() => {
    if (!groupKey) {
      setGroupData(null);
      return;
    }

    setIsLoading(true);
    StorageService.setLastKey(groupKey);

    const unsubscribe = FirebaseService.subscribeToGroup(groupKey, async data => {
      setGroupData(data);
      setIsLoading(false);

      if (data && data.employees.length > 0) {
        if (!data.lastRotatedAt) {
          await FirebaseService.initializeRotation(groupKey);
        } else {
          await FirebaseService.checkAndRotate(groupKey, data);
        }
      }
    });

    return () => unsubscribe();
  }, [groupKey]);

  const updateEmployees = async (newEmployees: Employee[]) => {
    if (!groupKey) return;
    await FirebaseService.updateEmployees(groupKey, newEmployees);
  };

  const handleLogin = (key: string) => {
    const sanitized = key.trim().toLowerCase().replace(/\s+/g, '-');
    window.location.hash = encodeURIComponent(sanitized);
  };

  const handleLogout = () => {
    setGroupKey(null);
    setGroupData(null);
    localStorage.removeItem(LAST_KEY_STORAGE_KEY);
    window.location.hash = '';
  };

  if (isLoading && !groupData) {
    return (
      <div className="min-h-screen bg-[#fdfaf6] flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl animate-bounce mb-6">🥨</div>
          <h2 className="text-2xl font-serif font-black text-amber-950">Henter frisk morgenbrød...</h2>
        </div>
      </div>
    );
  }

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
