// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\CalendarView.jsx
import React, { useState, useEffect } from 'react';
import { getCheckins, getJournals, getAnalyses } from '../services/db';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  BookOpen, 
  CalendarDays, 
  ClipboardCheck, 
  Flame, 
  CheckCircle,
  Clock
} from 'lucide-react';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Database logs state
  const [checkins, setCheckins] = useState([]);
  const [journals, setJournals] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  
  // Selected day details state
  const [selectedDayDetails, setSelectedDayDetails] = useState(null);

  useEffect(() => {
    setCheckins(getCheckins() || []);
    setJournals(getJournals() || []);
    setAnalyses(getAnalyses() || []);
  }, []);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // First day of month index
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Days in month
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Prev month padding days
  const prevMonthTotalDays = new Date(year, month, 0).getDate();
  const prevDays = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    prevDays.push(prevMonthTotalDays - i);
  }

  // Next month padding days
  const nextDays = [];
  const remainingCells = 42 - (prevDays.length + totalDays);
  for (let i = 1; i <= remainingCells; i++) {
    nextDays.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayDetails(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayDetails(null);
  };

  // Check data for specific day
  const getDayData = (dayNum) => {
    const dString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    
    const dayCheckins = checkins.includes(dString);
    const dayJournals = journals.filter(j => j.date === dString);
    const dayAnalyses = analyses.filter(a => a.date === dString);

    return {
      dateString: dString,
      dayNumber: dayNum,
      hasCheckin: dayCheckins,
      journalsList: dayJournals,
      analysesList: dayAnalyses,
      hasActivity: dayCheckins || dayJournals.length > 0 || dayAnalyses.length > 0
    };
  };

  // Open Details Modal/Widget
  const handleDayClick = (dayData) => {
    if (!dayData.hasActivity) {
      setSelectedDayDetails({
        date: dayData.dateString,
        empty: true
      });
      return;
    }
    setSelectedDayDetails({
      date: dayData.dateString,
      ...dayData,
      empty: false
    });
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-100 pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Transformation Calendar
        </h1>
        <p className="text-sm text-neutral-400">
          A monthly visual overview of your completed routines, journal entries, and biometric scans.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar Grid Section */}
        <div className="lg:col-span-2 glassmorphism p-5 rounded-2xl border border-neutral-800/80 space-y-4">
          
          {/* Calendar Header Toggles */}
          <div className="flex justify-between items-center pb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {monthNames[month]} {year}
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={handlePrevMonth}
                className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-850 hover:border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button 
                onClick={handleNextMonth}
                className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-850 hover:border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-neutral-500 uppercase tracking-widest pb-1 border-b border-neutral-900/60">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-1">{day}</div>
            ))}
          </div>

          {/* Day Cells Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Prev month pad */}
            {prevDays.map((day, i) => (
              <div 
                key={`prev-${i}`} 
                className="aspect-square p-1 text-[10px] text-neutral-600 bg-transparent rounded-lg flex items-start justify-end"
              >
                {day}
              </div>
            ))}

            {/* Current month days */}
            {Array.from({ length: totalDays }).map((_, idx) => {
              const dayNum = idx + 1;
              const dayData = getDayData(dayNum);
              const isSelected = selectedDayDetails?.date === dayData.dateString;
              const todayStr = new Date().toISOString().split('T')[0];
              const isToday = dayData.dateString === todayStr;

              return (
                <button
                  key={dayNum}
                  onClick={() => handleDayClick(dayData)}
                  className={`aspect-square p-1 bg-neutral-950/20 border text-xs font-bold rounded-lg flex flex-col justify-between items-end relative transition-all cursor-pointer ${isSelected ? 'border-indigo-500 bg-indigo-500/5 shadow-md shadow-indigo-500/5' : isToday ? 'border-blue-500/50 bg-blue-500/5' : 'border-neutral-900 hover:border-neutral-700'}`}
                >
                  <span className={isToday ? 'text-blue-400' : 'text-neutral-350'}>{dayNum}</span>
                  
                  {/* Completion indicator dots */}
                  <div className="flex gap-0.5 justify-center w-full pb-1">
                    {dayData.hasCheckin && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Routine Checked"></span>
                    )}
                    {dayData.journalsList.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" title="Journal logged"></span>
                    )}
                    {dayData.analysesList.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Scan logged"></span>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Next month pad */}
            {nextDays.map((day, i) => (
              <div 
                key={`next-${i}`} 
                className="aspect-square p-1 text-[10px] text-neutral-600 bg-transparent rounded-lg flex items-start justify-end"
              >
                {day}
              </div>
            ))}
          </div>

        </div>

        {/* Selected Day Details Panel */}
        <div className="lg:col-span-1 glassmorphism p-5 rounded-2xl border border-neutral-800/80 h-fit space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-neutral-900 pb-2">
            <Clock size={16} className="text-indigo-400" />
            Activity Log
          </h3>

          {selectedDayDetails ? (
            selectedDayDetails.empty ? (
              <div className="py-12 text-center text-xs text-neutral-500 italic">
                No transformation metrics logged on {selectedDayDetails.date}.
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="bg-neutral-950/40 p-2.5 rounded-xl border border-neutral-900">
                  <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold block">Logged Date</span>
                  <span className="text-white font-bold block mt-0.5">{selectedDayDetails.date}</span>
                </div>

                <div className="space-y-2">
                  {selectedDayDetails.hasCheckin && (
                    <div className="flex items-start gap-2.5 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                      <CheckCircle size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-white font-bold block">Routine completed</span>
                        <span className="text-[10px] text-neutral-450 block mt-0.5">Morning & night checklists successfully logged</span>
                      </div>
                    </div>
                  )}

                  {selectedDayDetails.journalsList.map((j, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-purple-500/5 border border-purple-500/10">
                      <BookOpen size={14} className="text-purple-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-white font-bold block">Journal Note Logged</span>
                        <span className="text-[10px] text-neutral-450 block mt-0.5">Mood: {j.mood}</span>
                        <p className="text-[10px] text-neutral-400 leading-normal mt-1">"{j.notes}"</p>
                      </div>
                    </div>
                  ))}

                  {selectedDayDetails.analysesList.map((a, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
                      <Sparkles size={14} className="text-blue-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-white font-bold block">Harmony Analysis Report</span>
                        <span className="text-[10px] text-neutral-450 block mt-0.5">Score: {a.facial_harmony_score}% | Symmetry: {a.symmetry_score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="py-16 text-center text-xs text-neutral-500 italic">
              Select any highlighted day from the calendar to inspect completed activities.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
