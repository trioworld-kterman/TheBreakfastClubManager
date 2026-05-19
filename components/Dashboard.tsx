import React, { useState, useEffect, useCallback } from 'react';
import { GroupData, Employee } from '../types';
import { getNextFridays, formatDate, generateId, getRandomColor, getAnonymousUserId } from '../utils/helpers';
import { IdeaWidget } from 'idea-widget';
import 'idea-widget/style.css';
import { IdeaService } from '../utils/IdeaService';
import { Language, getT } from '../utils/i18n';

interface DashboardProps {
  data: GroupData;
  onUpdate: (employees: Employee[]) => void;
  onLogout: () => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onUpdate, onLogout, lang, onLangChange }) => {
  const t = getT(lang);
  const [newName, setNewName] = useState('');
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [localEmployees, setLocalEmployees] = useState<Employee[]>(data.employees);
  const [anonId] = useState(() => getAnonymousUserId());
  const fridays = getNextFridays(data.employees.length || 12);
  const attendeesCount = data.employees.filter(e => e.isAttendingBreakfast).length;
  const totalRolls = data.employees
    .filter(e => e.isAttendingBreakfast)
    .reduce((sum, e) => sum + (e.breadRolls ?? 1), 0);

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
    const confirmed = window.confirm(t.deleteConfirm(employee.name));
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

  const setBreadRolls = (employeeId: string, rolls: 1 | 2) => {
    onUpdate(
      data.employees.map(employee =>
        employee.id === employeeId ? { ...employee, breadRolls: rolls } : employee
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-4 flex-wrap">
            <h1
              className="text-[40px] md:text-[56px] font-[600] leading-[1.07] text-[#1d1d1f]"
              style={{ fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif', letterSpacing: '-0.28px' }}
            >
              {data.name}
            </h1>
            <div
              className="px-3 py-1 rounded-[5px] text-[12px] font-[600] bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2"
              style={{ letterSpacing: '-0.12px' }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {t.syncBadge}
            </div>
          </div>

        </div>
        <div className="flex items-center gap-4">
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
          <button
            onClick={onLogout}
            className="bg-amber-950 text-white hover:bg-red-700 px-6 py-3 rounded-[8px] text-[14px] font-[400] transition-all active:scale-95"
            style={{ letterSpacing: '-0.224px' }}
          >
            {t.logout}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white rounded-[12px] shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px] p-8 relative overflow-hidden">
            <div className="relative z-10">
              <h2
                className="text-[28px] font-[600] leading-[1.10] text-[#1d1d1f] mb-8"
                style={{ fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}
              >
                {t.teamHeader}
              </h2>

              <form onSubmit={addEmployee} className="mb-10 group">
                <div className="relative">
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder={t.addPlaceholder}
                    className="w-full pl-6 pr-20 py-4 rounded-[11px] bg-white border-[3px] border-[rgba(0,0,0,0.04)] focus:border-amber-700 transition-all outline-none text-[17px] font-[400] text-[#1d1d1f] placeholder-[rgba(0,0,0,0.3)]"
                    style={{ letterSpacing: '-0.374px' }}
                  />
                  <button type="submit" className="absolute right-3 top-3 bottom-3 bg-amber-950 text-white px-5 rounded-[8px] text-[14px] font-[600] hover:bg-black active:scale-90 transition-all">{t.addButton}</button>
                </div>
              </form>

              <p className="mb-4 text-[14px] font-[600] leading-[1.29] text-[rgba(0,0,0,0.48)]" style={{ letterSpacing: '-0.224px' }}>
                {t.attendanceHint}
              </p>

              <div className="space-y-3">
                {localEmployees.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-[rgba(0,0,0,0.1)] rounded-[12px]">
                    <p className="text-[rgba(0,0,0,0.3)] text-[14px] italic" style={{ letterSpacing: '-0.224px' }}>{t.emptyTeam}</p>
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
                        className={`group flex items-center justify-between gap-4 p-4 bg-white rounded-[8px] transition-all cursor-grab active:cursor-grabbing ${
                          draggedIdx === idx
                            ? 'opacity-20 outline outline-2 outline-dashed outline-amber-700 scale-95'
                            : 'shadow-none hover:shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px]'
                        }`}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="text-[rgba(0,0,0,0.2)] group-hover:text-[#1d1d1f] transition-colors">⠿</div>
                          <span className="block text-[17px] font-[600] text-[#1d1d1f] truncate" style={{ letterSpacing: '-0.374px' }}>{emp.name}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center rounded-[8px] border-2 border-[rgba(0,0,0,0.10)] overflow-hidden text-[13px] font-[600]">
                            <button
                              type="button"
                              onClick={e => { e.stopPropagation(); setBreadRolls(emp.id, 1); }}
                              aria-pressed={(emp.breadRolls ?? 1) === 1}
                              aria-label={`${emp.name}: ${t.oneRoll}`}
                              className={`px-3 py-1 transition-all ${
                                (emp.breadRolls ?? 1) === 1
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white text-[rgba(0,0,0,0.48)] hover:bg-emerald-50'
                              }`}
                            >
                              1
                            </button>
                            <button
                              type="button"
                              onClick={e => { e.stopPropagation(); setBreadRolls(emp.id, 2); }}
                              aria-pressed={emp.breadRolls === 2}
                              aria-label={`${emp.name}: ${t.twoRolls}`}
                              className={`px-3 py-1 transition-all ${
                                emp.breadRolls === 2
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white text-[rgba(0,0,0,0.48)] hover:bg-emerald-50'
                              }`}
                            >
                              2
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              toggleBreakfastAttendance(emp.id);
                            }}
                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                              isAttending
                                ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-200'
                                : 'border-[rgba(0,0,0,0.12)] bg-white text-transparent hover:border-emerald-400 hover:bg-emerald-50'
                            }`}
                            aria-pressed={isAttending}
                            aria-label={isAttending ? `${emp.name} ${t.comingLabel.toLowerCase()}` : `${emp.name} ${t.notComingLabel.toLowerCase()}`}
                            title={isAttending ? t.comingLabel : t.notComingLabel}
                          >
                            <span className="text-base font-black">✓</span>
                          </button>
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              handleDeleteEmployee(emp);
                            }}
                            className="text-[rgba(0,0,0,0.2)] hover:text-red-600 font-bold p-1 transition-all"
                            aria-label={t.removeLabel(emp.name)}
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
                <p className="mt-8 text-[12px] text-[rgba(0,0,0,0.3)] text-center font-[400]" style={{ letterSpacing: '-0.12px' }}>{t.dragHint}</p>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-8">
          <section className="bg-white rounded-[12px] shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px] overflow-hidden">
            <div className="px-8 py-7 border-b border-[rgba(0,0,0,0.06)] bg-white flex items-center gap-5">
              <div className="flex-1">
                <h2
                  className="text-[28px] font-[600] leading-[1.10] text-[#1d1d1f]"
                  style={{ fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}
                >
                  {t.planHeader}
                </h2>
                <p className="mt-1 text-[14px] font-[400] text-[rgba(0,0,0,0.48)]" style={{ letterSpacing: '-0.224px' }}>
                  {attendeesCount === 0 ? t.noAttendees : t.attendeeSummary(attendeesCount, totalRolls)}
                </p>
              </div>
            </div>

            <div className="divide-y divide-[rgba(0,0,0,0.06)]">
              {fridays.map((date, idx) => {
                const employee = data.employees.length > 0 ? data.employees[idx % data.employees.length] : null;
                const isToday = idx === 0;

                return (
                  <div key={date.toISOString()} className={`flex flex-col sm:flex-row sm:items-center justify-between p-8 transition-all gap-8 ${isToday ? 'bg-amber-50/30 border-l-4 border-l-amber-700' : ''}`}>
                    <div className="flex items-center gap-10">
                      <div className="text-center w-24">
                        <span className="block text-[12px] font-[400] text-[rgba(0,0,0,0.48)] mb-2" style={{ letterSpacing: '-0.12px' }}>{date.toLocaleString(lang === 'da' ? 'da-DK' : 'en-GB', { month: 'short' })}</span>
                        <span
                          className="block text-[56px] font-[600] leading-[1.07] text-[#1d1d1f]"
                          style={{ fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif', letterSpacing: '-0.28px' }}
                        >{date.getDate()}</span>
                      </div>
                      <div className="h-20 w-px bg-[rgba(0,0,0,0.08)] hidden sm:block"></div>
                      <div>
                        <p
                          className={`text-[12px] font-[600] mb-3 ${isToday ? 'text-amber-700' : 'text-[rgba(0,0,0,0.2)]'}`}
                          style={{ letterSpacing: '-0.12px' }}
                        >
                          {isToday ? t.thisFriday : t.upcoming}
                        </p>
                        <p
                          className="text-[21px] font-[600] leading-[1.19] text-[#1d1d1f]"
                          style={{ fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif', letterSpacing: '0.231px' }}
                        >{formatDate(date)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-3">
                      {employee ? (
                        <div className={`px-8 py-4 rounded-[12px] font-[600] text-[21px] shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px] ${employee.color} transition-all cursor-default`}>
                          {employee.name}
                        </div>
                      ) : (
                        <div className="px-6 py-3 rounded-[8px] bg-[rgba(0,0,0,0.04)] text-[rgba(0,0,0,0.3)] text-[14px]" style={{ letterSpacing: '-0.224px' }}>{t.emptySlot}</div>
                      )}
                      {isToday && (
                        <div className="px-4 py-2 rounded-[8px] bg-emerald-50 border border-emerald-200 text-emerald-900 text-[14px] font-[600]" style={{ letterSpacing: '-0.224px' }}>
                          {t.buyRolls(totalRolls)}
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
