import React, { useState, useEffect, useCallback } from 'react';
import { GroupData, Employee } from '../types';
import { getNextFridays, formatDate, generateId, getRandomColor, getAnonymousUserId } from '../utils/helpers';
import { IdeaWidget } from 'idea-widget';
import 'idea-widget/style.css';
import { IdeaService } from '../utils/IdeaService';

interface DashboardProps {
  data: GroupData;
  onUpdate: (employees: Employee[]) => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onUpdate, onLogout }) => {
  const [newName, setNewName] = useState('');
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [localEmployees, setLocalEmployees] = useState<Employee[]>(data.employees);
  const [anonId] = useState(() => getAnonymousUserId());
  const fridays = getNextFridays(data.employees.length || 12);
  const attendeesCount = data.employees.filter(employee => employee.isAttendingBreakfast).length;

  useEffect(() => {
    if (draggedIdx === null) {
      setLocalEmployees(data.employees);
    }
  }, [data.employees, draggedIdx]);

  const addEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onUpdate([
        ...data.employees,
        {
          id: generateId(),
          name: newName.trim(),
          color: getRandomColor(),
          order: data.employees.length,
          isAttendingBreakfast: false,
        },
      ]);
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

  const handleDeleteEmployee = (employee: Employee) => {
    const confirmed = window.confirm(`Vil du fjerne ${employee.name} fra morgenmadsrotationen? Dette kan ikke fortrydes.`);
    if (!confirmed) return;

    onUpdate(data.employees.filter(e => e.id !== employee.id));
  };

  const toggleBreakfastAttendance = (employeeId: string) => {
    onUpdate(
      data.employees.map(employee =>
        employee.id === employeeId
          ? { ...employee, isAttendingBreakfast: !employee.isAttendingBreakfast }
          : employee
      )
    );
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
              Synkroniseret i skyen
            </div>
          </div>
          <p className="text-amber-900/60 font-medium text-lg">Jeres fredagsrotation gemmes automatisk i linket nedenfor.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onLogout} className="bg-white border-2 border-amber-950 text-amber-950 hover:bg-red-700 hover:border-red-700 hover:text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95">Log ud</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white rounded-[2.5rem] border border-amber-100 shadow-2xl shadow-amber-900/5 p-8 md:p-10 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-black text-amber-950 mb-8 flex items-center gap-3">
                <span className="text-3xl">🥯</span> Morgenmadsholdet
              </h2>

              <form onSubmit={addEmployee} className="mb-10 group">
                <div className="relative">
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Tilføj kollega..."
                    className="w-full pl-6 pr-20 py-5 rounded-2xl bg-amber-50/50 border-2 border-transparent focus:border-amber-900 focus:bg-white transition-all outline-none font-bold text-amber-950 placeholder-amber-900/30"
                  />
                  <button type="submit" className="absolute right-3 top-3 bottom-3 bg-amber-950 text-white px-5 rounded-xl font-black text-[10px] uppercase hover:bg-black active:scale-90 transition-all">Tilføj</button>
                </div>
              </form>

              <p className="mb-4 text-[11px] font-black uppercase tracking-[0.24em] text-amber-900/45">
                Marker om du kommer i listen
              </p>

              <div className="space-y-3">
                {localEmployees.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-amber-100 rounded-3xl">
                    <p className="text-amber-900/30 font-black italic text-sm">Tilføj nogle kolleger for at starte rotationen.</p>
                  </div>
                ) : (
                  localEmployees.map((emp, idx) => {
                    const isAttending = Boolean(emp.isAttendingBreakfast);

                    return (
                      <div
                        key={emp.id}
                        draggable
                        onDragStart={() => {
                          setLocalEmployees(data.employees);
                          setDraggedIdx(idx);
                        }}
                        onDragOver={e => handleDragOver(e, idx)}
                        onDragEnd={handleDragEnd}
                        className={`group flex items-center justify-between gap-4 p-5 bg-white rounded-2xl border-2 transition-all cursor-grab active:cursor-grabbing ${
                          draggedIdx === idx
                            ? 'opacity-20 border-amber-900 border-dashed scale-95'
                            : 'border-amber-50 hover:border-amber-950 shadow-sm hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="text-amber-200 group-hover:text-amber-950 transition-colors">⠿</div>
                          <span className="block font-black text-amber-950 text-lg truncate">{emp.name}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              toggleBreakfastAttendance(emp.id);
                            }}
                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                              isAttending
                                ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-200'
                                : 'border-amber-200 bg-white text-transparent hover:border-emerald-400 hover:bg-emerald-50'
                            }`}
                            aria-pressed={isAttending}
                            aria-label={isAttending ? `${emp.name} kommer` : `${emp.name} kommer ikke`}
                            title={isAttending ? 'Kommer' : 'Kommer ikke'}
                          >
                            <span className="text-base font-black">✓</span>
                          </button>
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              handleDeleteEmployee(emp);
                            }}
                            className="text-amber-100 hover:text-red-600 font-bold p-1 transition-all"
                            aria-label={`Fjern ${emp.name}`}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {data.employees.length > 1 && (
                <p className="mt-8 text-[10px] text-amber-900/40 text-center font-black uppercase tracking-[0.3em]">Træk navnene for at bytte uger</p>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-8">
          <section className="bg-white rounded-[3rem] border border-amber-100 shadow-2xl shadow-amber-900/5 overflow-hidden">
            <div className="px-12 py-10 border-b-8 border-amber-50 bg-amber-50/30 flex items-center gap-5">
              <span className="text-4xl">📅</span>
              <div className="flex-1">
                <h2 className="text-3xl font-black text-amber-950 tracking-tight">Morgenmadsplan</h2>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.24em] text-amber-900/50">
                  {attendeesCount} {attendeesCount === 1 ? 'person kommer' : 'personer kommer'} til næste morgenmad
                </p>
              </div>
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
                          {isToday ? 'DENNE FREDAG' : 'KOMMENDE'}
                        </p>
                        <p className="text-2xl font-black text-amber-950 tracking-tight">{formatDate(date)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-3">
                      {employee ? (
                        <div className={`px-10 py-5 rounded-[2rem] font-black shadow-lg border-2 border-black/5 text-2xl ${employee.color} transform hover:scale-105 transition-all cursor-default`}>
                          {employee.name}
                        </div>
                      ) : (
                        <div className="px-8 py-4 rounded-2xl bg-amber-50 text-amber-900/20 font-black text-xs uppercase tracking-widest border border-amber-100">Tom plads</div>
                      )}
                      {isToday && (
                        <div className="px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-black uppercase tracking-[0.18em]">
                          Køb brød til {attendeesCount}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
      <IdeaWidget
        buttonLabel="Har du en idé?"
        userId={anonId}
        isAdmin={true}
        onFetchIdeas={() =>
          IdeaService.fetchIdeas().then(ideas =>
            ideas.map(idea => ({ ...idea, createdAt: idea.createdAt.toDate() }))
          )
        }
        onSubmitIdea={idea => IdeaService.submitIdea(idea)}
        onVote={(ideaId, voteType, userId) => IdeaService.vote(ideaId, voteType, userId)}
        onFetchUserVotes={userId => IdeaService.fetchUserVotes(userId)}
        onChangeStatus={IdeaService.changeStatus}
        onDeleteIdea={IdeaService.deleteIdea}
      />
    </div>
  );
};
