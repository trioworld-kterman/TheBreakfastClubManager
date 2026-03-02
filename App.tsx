
import React, { useState, useEffect, useCallback } from 'react';
import { GroupData, Employee } from './types';
import { LoginView } from './components/LoginView';
import { Dashboard } from './components/Dashboard';
import { StorageService } from './utils/StorageService';
import { FirebaseService } from './utils/FirebaseService';

const App: React.FC = () => {
  const [groupKey, setGroupKey] = useState<string | null>(null);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initialize from URL or LocalStorage
  const init = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);
    const urlDataEncoded = params.get('data');

    // A. Handle Legacy Shared Link (Base64 data)
    if (urlDataEncoded) {
      const sharedData = StorageService.decodeState(urlDataEncoded);
      if (sharedData) {
        // Migrate legacy data to Firebase immediately
        await FirebaseService.migrateFromLocalStorage(sharedData.key, sharedData);
        // Clean URL
        window.history.replaceState(null, '', `/#${encodeURIComponent(sharedData.key)}`);
        setGroupKey(sharedData.key);
        return;
        // Subscribing will happen in the other useEffect
      }
    }

    // B. Handle Standard Link (Hash Key)
    const hash = window.location.hash.replace('#', '');
    const activeKey = hash || StorageService.getLastKey();

    if (activeKey) {
      const decodedKey = decodeURIComponent(activeKey);
      setGroupKey(decodedKey);

      // Check if we have local data to migrate (if not already on Firebase)
      const local = StorageService.loadLocal(decodedKey);
      if (local) {
        await FirebaseService.migrateFromLocalStorage(decodedKey, local);
      } else {
        // Ensure group exists or will be created with default data
        const name = decodedKey.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        await FirebaseService.createGroup(decodedKey, `${name} Bread Board`);
      }
    }

    setIsLoading(false);
  }, []);

  // 2. Initial Setup
  useEffect(() => {
    init();
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setGroupKey(decodeURIComponent(hash));
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [init]);

  // 3. Real-time Subscription
  useEffect(() => {
    if (!groupKey) {
      setGroupData(null);
      return;
    }

    setIsLoading(true);
    // Remember the key for next visit
    StorageService.setLastKey(groupKey);

    const unsubscribe = FirebaseService.subscribeToGroup(groupKey, async (data) => {
      setGroupData(data);
      setIsLoading(false);

      if (data && data.employees.length > 0) {
        if (!data.lastRotatedAt) {
          // First visit after feature deploy — set the anchor, no retroactive rotation
          await FirebaseService.initializeRotation(groupKey);
        } else {
          // Rotate if one or more Fridays have passed since last rotation
          await FirebaseService.checkAndRotate(groupKey, data);
        }
      }
    });

    return () => unsubscribe();
  }, [groupKey]);

  const updateEmployees = async (newEmployees: Employee[]) => {
    if (!groupKey) return;
    // Optimistic update (optional, but Firestore is fast enough usually)
    // setGroupData(prev => prev ? { ...prev, employees: newEmployees } : null);

    await FirebaseService.updateEmployees(groupKey, newEmployees);
  };

  const handleLogin = (key: string) => {
    const sanitized = key.trim().toLowerCase().replace(/\s+/g, '-');
    window.location.hash = encodeURIComponent(sanitized);
    // Hash change listener will pick this up
  };

  const handleLogout = () => {
    setGroupKey(null);
    setGroupData(null);
    localStorage.removeItem('bread_last_key');
    window.location.hash = '';
  };

  if (isLoading && !groupData) return (
    <div className="min-h-screen bg-[#fdfaf6] flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl animate-bounce mb-6">🥨</div>
        <h2 className="text-2xl font-serif font-black text-amber-950">Fetching fresh bread...</h2>
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
