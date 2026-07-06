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
    <div className="space-y-8 animate-fade-in text-foreground pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
          Transformation Calendar
        </h1>
        <p className="text-sm text-muted-foreground">
          View your monthly consistency tracking map. Click active dates to review logged biometric scans, journal drafts, and checklist activities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Calendar View Panel (Left 2 Columns) */}
        <div className="lg:col-span-2 glassmorphism border border-border p-6 rounded-2xl shadow-xl bg-card">
          
          {/* Calendar Header controls */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <CalendarDays size={16} className="text-primary" />
              {monthNames[month]} {year}
            </h3>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-7 gap-2.5 text-center text-[10px] font-bold text-muted-foreground uppercase mb-3">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            
            {/* Prev month pad */}
            {prevDays.map((day, idx) => (
              <div 
                key={`prev-${idx}`} 
                className="aspect-square rounded-xl border border-border bg-background/25 flex items-center justify-center text-[10px] text-muted-foreground/30 font-medium select-none"
              >
                {day}
              </div>
            ))}

            {/* Current month days */}
            {Array.from({ length: totalDays }).map((_, idx) => {
              const dayNum = idx + 1;
              const dayData = getDayData(dayNum);
              const isSelected = selectedDayDetails?.date === dayData.dateString;
              
              return (
                <button
                  key={`day-${dayNum}`}
                  onClick={() => handleDayClick(dayData)}
                  className={`
                    aspect-square rounded-xl border flex flex-col justify-between p-1.5 transition-all relative cursor-pointer
                    ${dayData.hasActivity 
                      ? 'border-indigo-500/20 bg-indigo-500/5 hover:border-indigo-500/40 text-foreground' 
                      : 'border-border bg-background/50 text-muted-foreground hover:border-neutral-500'
                    }
                    ${isSelected ? 'ring-2 ring-primary border-primary' : ''}
                  `}
                >
                  <span className="text-[10px] font-extrabold">{dayNum}</span>
                  
                  {/* Indicators shelf */}
                  {dayData.hasActivity && (
                    <div className="flex gap-0.5 justify-center w-full mt-1 shrink-0">
                      {dayData.hasCheckin && (
                        <span className="w-1 h-1 rounded-full bg-emerald-400" title="Check-in"></span>
                      )}
                      {dayData.journalsList.length > 0 && (
                        <span className="w-1 h-1 rounded-full bg-purple-400" title="Journal"></span>
                      )}
                      {dayData.analysesList.length > 0 && (
                        <span className="w-1 h-1 rounded-full bg-blue-400" title="Analysis scan"></span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}

            {/* Next month pad */}
            {nextDays.map((day, idx) => (
              <div 
                key={`next-${idx}`} 
                className="aspect-square rounded-xl border border-border bg-background/25 flex items-center justify-center text-[10px] text-muted-foreground/30 font-medium select-none"
              >
                {day}
              </div>
            ))}

          </div>
        </div>

        {/* Selected Day Details Panel (Right 1 Column) */}
        <div className="lg:col-span-1 glassmorphism border border-border p-6 rounded-2xl shadow-xl h-fit bg-card">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 border-b border-border pb-3 flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            Activity Review
          </h3>

          {selectedDayDetails ? (
            selectedDayDetails.empty ? (
              <div className="py-8 text-center text-xs text-muted-foreground italic">
                No transformation logs saved for: <span className="font-bold text-foreground">{selectedDayDetails.date}</span>.
              </div>
            ) : (
              <div className="space-y-5">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest bg-background border border-border px-3 py-1 rounded-full block w-fit">
                  {selectedDayDetails.date}
                </span>

                {/* Habits checkin status */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Habits Check-in</span>
                  {selectedDayDetails.hasCheckin ? (
                    <div className="flex items-center gap-2 text-xs text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl font-bold">
                      <CheckCircle size={13} />
                      Morning & Night Routines completed
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground italic pl-1">
                      No checkins recorded.
                    </div>
                  )}
                </div>

                {/* Journal entries */}
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Journal Entries</span>
                  {selectedDayDetails.journalsList.length > 0 ? (
                    selectedDayDetails.journalsList.map((journal, idx) => (
                      <div key={idx} className="p-3 bg-background border border-border rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold">
                          <span>Reflections Entry #{idx + 1}</span>
                          <span className="text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                            Mood: {journal.mood}/5
                          </span>
                        </div>
                        <p className="text-foreground leading-relaxed">{journal.notes}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-muted-foreground italic pl-1">
                      No journal entries logged.
                    </div>
                  )}
                </div>

                {/* Face analysis scans */}
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Biometric Scan Harmony</span>
                  {selectedDayDetails.analysesList.length > 0 ? (
                    selectedDayDetails.analysesList.map((analysis, idx) => (
                      <div key={idx} className="p-3 bg-background border border-border rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold">
                          <span>Scan #{idx + 1}</span>
                          <span className="text-blue-400 bg-blue-500/10 border border-blue-500/25 px-2 py-0.5 rounded-lg">
                            {analysis.potential_label || 'MTN'}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs pt-1">
                          <span className="text-muted-foreground">Harmony Score:</span>
                          <strong className="text-foreground">{analysis.facial_harmony_score}%</strong>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-muted-foreground italic pl-1">
                      No biometric scans run.
                    </div>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="py-12 text-center text-xs text-muted-foreground italic">
              Select an active date cell from the calendar map to view matching transformation logs.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
