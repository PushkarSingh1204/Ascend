// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\CalendarView.jsx
import React, { useState, useEffect } from 'react';
import { getCheckins, getJournals, getAnalyses } from '../services/db';
import { Card, Button, Badge, Skeleton } from '../components/DesignSystem';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const checkinsData = await getCheckins();
        setCheckins(Array.isArray(checkinsData) ? checkinsData : []);
        
        const journalsData = await getJournals();
        setJournals(Array.isArray(journalsData) ? journalsData : []);
        
        const analysesData = await getAnalyses();
        setAnalyses(Array.isArray(analysesData) ? analysesData : []);
      } catch (err) {
        console.error("CalendarView logs fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
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

  const safeCheckins = Array.isArray(checkins) ? checkins : [];
  const safeJournals = Array.isArray(journals) ? journals : [];
  const safeAnalyses = Array.isArray(analyses) ? analyses : [];

  // Check data for specific day
  const getDayData = (dayNum) => {
    const dString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    
    const dayCheckins = safeCheckins.includes(dString);
    const dayJournals = safeJournals.filter(j => j.date === dString);
    const dayAnalyses = safeAnalyses.filter(a => a.date === dString);

    return {
      dateString: dString,
      dayNumber: dayNum,
      hasCheckin: dayCheckins,
      journalsList: dayJournals,
      analysesList: dayAnalyses,
      hasActivity: dayCheckins || dayJournals.length > 0 || dayAnalyses.length > 0
    };
  };

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
      empty: false,
      checkin: dayData.hasCheckin,
      journals: dayData.journalsList,
      analyses: dayData.analysesList
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 py-6">
        <Skeleton variant="rect" height="100px" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2" variant="rect" height="340px" />
          <Skeleton variant="rect" height="340px" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-foreground pb-16 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1">Time Machine</span>
        <h1 className="text-3xl font-black tracking-tight mb-2">
          Transformation Calendar
        </h1>
        <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
          Track consistency metrics, trace reflection history checkins, and review biometric scans over past calendars.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Calendar Core (Left 2 Columns) */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
              <CalendarDays size={16} className="text-primary" />
              {monthNames[month]} {year}
            </span>
            
            <div className="flex gap-2">
              <button 
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-lg border border-border bg-secondary/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/20 transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-lg border border-border bg-secondary/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/20 transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-7 gap-2.5 text-center text-[9px] font-black text-muted-foreground uppercase mb-3 tracking-wider">
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
                className="aspect-square rounded-xl border border-border bg-secondary/5 flex items-center justify-center text-[10px] text-muted-foreground/30 font-medium select-none"
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
                      ? 'border-primary/20 bg-primary/5 hover:border-primary/40 text-foreground' 
                      : 'border-border bg-secondary/15 text-muted-foreground hover:border-primary/20'
                    }
                    ${isSelected ? 'ring-2 ring-primary border-primary' : ''}
                  `}
                >
                  <span className="text-[10px] font-bold">{dayNum}</span>
                  
                  {/* Indicators shelf */}
                  {dayData.hasActivity && (
                    <div className="flex gap-0.5 justify-center w-full mt-1 shrink-0">
                      {dayData.hasCheckin && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Check-in"></span>
                      )}
                      {dayData.journalsList.length > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" title="Journal"></span>
                      )}
                      {dayData.analysesList.length > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" title="Analysis scan"></span>
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
                className="aspect-square rounded-xl border border-border bg-secondary/5 flex items-center justify-center text-[10px] text-muted-foreground/30 font-medium select-none"
              >
                {day}
              </div>
            ))}

          </div>
        </Card>

        {/* Selected Day Details Panel (Right 1 Column) */}
        <Card className="p-6 h-fit lg:col-span-1">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4 border-b border-border pb-3 flex items-center gap-2">
            <Clock size={14} className="text-primary" />
            Activity Review
          </h3>

          {selectedDayDetails ? (
            selectedDayDetails.empty ? (
              <div className="py-8 text-center text-xs text-muted-foreground italic">
                No transformation logs saved for: <span className="font-bold text-foreground">{selectedDayDetails.date}</span>.
              </div>
            ) : (
              <div className="space-y-5">
                <Badge variant="primary" className="text-[9px] tracking-wider uppercase">
                  {selectedDayDetails.date}
                </Badge>

                {/* Checkin Status */}
                {selectedDayDetails.checkin && (
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-2">
                    <CheckCircle className="text-emerald-400 shrink-0" size={16} />
                    <span className="text-xs font-bold text-emerald-400">Daily Login Completed (+150 XP)</span>
                  </div>
                )}

                {/* Journals logged */}
                {Array.isArray(selectedDayDetails?.journals) && selectedDayDetails.journals.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider block">Reflections Logged</span>
                    {selectedDayDetails.journals.map((j) => (
                      <div key={j.id} className="p-3 bg-secondary/40 border border-border rounded-xl space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                            <BookOpen size={10} />
                            Journal log
                          </span>
                          <span className="text-[9px] text-muted-foreground font-semibold">Mood value: {j.mood}/5</span>
                        </div>
                        <p className="text-xs text-foreground leading-normal">{j.notes}</p>
                        {j.reflections && (
                          <p className="text-[10px] text-muted-foreground italic border-t border-border/50 pt-1.5 mt-1.5">"{j.reflections}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Scan reports */}
                {Array.isArray(selectedDayDetails?.analyses) && selectedDayDetails.analyses.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider block">Biometric Scan Reports</span>
                    {selectedDayDetails.analyses.map((a) => (
                      <div key={a.id} className="p-3 bg-secondary/40 border border-border rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                          <Sparkles size={10} />
                          Harmony Scan
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                          <div>
                            <span className="text-muted-foreground block">Harmony Score:</span>
                            <span className="text-foreground font-bold">{a.facial_harmony_score}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Symmetry score:</span>
                            <span className="text-foreground font-bold">{a.symmetry_score}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="py-12 text-center text-xs text-muted-foreground italic">
              Select any highlighted cell from the calendar view to audit log metrics.
            </div>
          )}
        </Card>

      </div>

    </div>
  );
}
