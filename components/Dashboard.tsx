
import React, { useState, useEffect, useCallback } from 'react';
import { GroupData, Employee } from '../types';
import { getNextFridays, formatDate, generateId, getRandomColor } from '../utils/helpers';
import { StorageService } from '../utils/StorageService';

interface DashboardProps {
  data: GroupData;
  onUpdate: (employees: Employee[]) => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onUpdate, onLogout }) => {
  const [newName, setNewName] = useState('');
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [localEmployees, setLocalEmployees] = useState<Employee[]>(data.employees);
  const [copied, setCopied] = useState(false);
  const fridays = getNextFridays(data.employees.length || 12);

  useEffect(() => {
    if (draggedIdx === null) {
      setLocalEmployees(data.employees);
    }
  }, [data.employees, draggedIdx]);

  const addEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onUpdate([...data.employees, { id: generateId(), name: newName.trim(), color: getRandomColor(), order: data.employees.length }]);
      setNewName('');
    }
  };

  const handleDragEnd = useCallback(() => {
    setDraggedIdx(null);
    onUpdate(localEmployees);
  }, [localEmployees, onUpdate]);

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const items = [...localEmployees];
    const item = items.splice(draggedIdx, 1)[0];
    items.splice(idx, 0, item);
    setDraggedIdx(idx);
    setLocalEmployees(items);
  };

  const copyInviteLink = async () => {
    const shareUrl = `${window.location.origin}/#${encodeURIComponent(data.key)}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      prompt("Copy this link manually:", shareUrl);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div className="space-y-2">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-5xl md:text-7xl font-serif font-black text-amber-950 tracking-tight leading-none">
              {data.name}
            </h1>
            <div className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border bg-emerald-50 text-emerald-800 border-emerald-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Cloud Sync Active
            </div>
          </div>
          <p className="text-amber-900/60 font-medium text-lg">Your Friday rotation, preserved in the link below.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={copyInviteLink}
            className="bg-amber-950 hover:bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-950/20 active:scale-95 flex items-center gap-2"
          >
            <span>🔗</span> Share Smart Link
          </button>
          <button onClick={onLogout} className="text-amber-900 hover:text-red-700 font-black text-xs uppercase tracking-widest p-4">Logout</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white rounded-[2.5rem] border border-amber-100 shadow-2xl shadow-amber-900/5 p-8 md:p-10 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-black text-amber-950 mb-8 flex items-center gap-3">
                <span className="text-3xl">🥯</span> The Loop
              </h2>

              <form onSubmit={addEmployee} className="mb-10 group">
                <div className="relative">
                  <input
                    type="text" value={newName} onChange={e => setNewName(e.target.value)}
                    placeholder="Add team member..."
                    className="w-full pl-6 pr-20 py-5 rounded-2xl bg-amber-50/50 border-2 border-transparent focus:border-amber-900 focus:bg-white transition-all outline-none font-bold text-amber-950 placeholder-amber-900/30"
                  />
                  <button type="submit" className="absolute right-3 top-3 bottom-3 bg-amber-950 text-white px-5 rounded-xl font-black text-[10px] uppercase hover:bg-black active:scale-90 transition-all">Add</button>
                </div>
              </form>

              <div className="space-y-3">
                {localEmployees.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-amber-100 rounded-3xl">
                    <p className="text-amber-900/30 font-black italic text-sm">Add some bakers to start the loop.</p>
                  </div>
                ) : (
                  localEmployees.map((emp, idx) => (
                    <div
                      key={emp.id}
                      draggable
                      onDragStart={() => { setLocalEmployees(data.employees); setDraggedIdx(idx); }}
                      onDragOver={e => handleDragOver(e, idx)}
                      onDragEnd={handleDragEnd}
                      className={`group flex items-center justify-between p-5 bg-white rounded-2xl border-2 transition-all cursor-grab active:cursor-grabbing ${draggedIdx === idx ? 'opacity-20 border-amber-900 border-dashed scale-95' : 'border-amber-50 hover:border-amber-950 shadow-sm hover:shadow-md'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-amber-200 group-hover:text-amber-950 transition-colors">⠿</div>
                        <span className="font-black text-amber-950 text-lg">{emp.name}</span>
                      </div>
                      <button onClick={() => onUpdate(data.employees.filter(e => e.id !== emp.id))} className="text-amber-100 hover:text-red-600 font-bold p-1 transition-all">✕</button>
                    </div>
                  ))
                )}
              </div>
              {data.employees.length > 1 && (
                <p className="mt-8 text-[10px] text-amber-900/40 text-center font-black uppercase tracking-[0.3em]">Drag names to swap weeks</p>
              )}
            </div>
          </section>

        </div>

        <div className="lg:col-span-8">
          <section className="bg-white rounded-[3rem] border border-amber-100 shadow-2xl shadow-amber-900/5 overflow-hidden">
            <div className="px-12 py-10 border-b-8 border-amber-50 bg-amber-50/30 flex items-center gap-5">
              <span className="text-4xl">📅</span>
              <h2 className="text-3xl font-black text-amber-950 tracking-tight">Breakfast Schedule</h2>
            </div>

            <div className="divide-y divide-amber-50">
              {fridays.map((date, idx) => {
                const employee = data.employees.length > 0 ? data.employees[idx % data.employees.length] : null;
                const isToday = idx === 0;

                return (
                  <div key={date.toISOString()} className={`flex flex-col sm:flex-row sm:items-center justify-between p-10 transition-all gap-8 ${isToday ? 'bg-amber-50/60 border-l-[12px] border-l-amber-900' : ''}`}>
                    <div className="flex items-center gap-10">
                      <div className="text-center w-24">
                        <span className="block text-[11px] font-black text-amber-950/40 uppercase tracking-[0.25em] mb-2">{date.toLocaleString('default', { month: 'short' })}</span>
                        <span className="block text-6xl font-serif font-black text-amber-950 leading-none">{date.getDate()}</span>
                      </div>
                      <div className="h-20 w-1 bg-amber-100 rounded-full hidden sm:block"></div>
                      <div>
                        <p className={`text-[11px] font-black uppercase tracking-[0.3em] mb-3 ${isToday ? 'text-amber-700' : 'text-amber-900/20'}`}>
                          {isToday ? '🍞 THIS FRIDAY' : 'FUTURE'}
                        </p>
                        <p className="text-2xl font-black text-amber-950 tracking-tight">{formatDate(date)}</p>
                      </div>
                    </div>
                    {employee ? (
                      <div className={`px-10 py-5 rounded-[2rem] font-black shadow-lg border-2 border-black/5 text-2xl ${employee.color} transform hover:scale-105 transition-all cursor-default`}>
                        {employee.name}
                      </div>
                    ) : (
                      <div className="px-8 py-4 rounded-2xl bg-amber-50 text-amber-900/20 font-black text-xs uppercase tracking-widest border border-amber-100">Empty Slot</div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-4 py-2 rounded-full shadow-lg transition-opacity">
          Smart Link copied! Share it with your team.
        </div>
      )}
    </div>
  );
};
