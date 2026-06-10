// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Analytics.jsx
import React, { useState, useEffect } from 'react';
import { getAnalyses, getCheckins, getWaterLog, getSleepLog } from '../services/db';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, CheckCircle, Droplet, Moon, Calendar } from 'lucide-react';

export default function Analytics() {
  const [analysisData, setAnalysisData] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [water, setWater] = useState({ current: 0, target: 2000 });
  const [sleep, setSleep] = useState({ current: 0, target: 8.0 });

  useEffect(() => {
    // Fetch data
    const analyses = getAnalyses();
    const reversed = analyses ? [...analyses].reverse() : [];
    
    // Format dates for chart
    const formattedAnalyses = reversed.map((item, idx) => ({
      name: `Scan ${idx + 1}`,
      harmony: item.facial_harmony_score,
      symmetry: item.symmetry_score,
      proportion: item.facial_proportion_score,
      date: item.date
    }));
    
    setAnalysisData(formattedAnalyses);
    setCheckins(getCheckins() || []);
    setWater(getWaterLog());
    setSleep(getSleepLog());
  }, []);

  // Custom 12-week GitHub style heatmap calendar calculator
  const renderHeatmap = () => {
    const totalDays = 84; // 12 weeks
    const days = [];
    const today = new Date();
    
    // Create dates from 83 days ago up to today
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const hasCheckedIn = checkins.includes(dateStr);
      days.push({ date: dateStr, active: hasCheckedIn });
    }

    return (
      <div className="grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto p-2 border border-neutral-900 bg-neutral-950/40 rounded-xl max-w-full">
        {days.map((day, i) => (
          <div
            key={i}
            title={day.date}
            className={`w-3 h-3 rounded-[2px] transition-all duration-300 ${day.active ? 'bg-blue-500 shadow-sm shadow-blue-500/20' : 'bg-neutral-800'}`}
          />
        ))}
      </div>
    );
  };

  const chartMockData = [
    { name: 'Monday', water: 1500, sleep: 7.0 },
    { name: 'Tuesday', water: 2000, sleep: 6.5 },
    { name: 'Wednesday', water: 2200, sleep: 7.5 },
    { name: 'Thursday', water: 1750, sleep: 8.0 },
    { name: 'Friday', water: 2500, sleep: 7.2 },
    { name: 'Saturday', water: water.current, sleep: sleep.current }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-neutral-100 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Transformation Analytics
        </h1>
        <p className="text-sm text-neutral-400">
          Monitor your consistency metrics, sleep statistics, and biometric symmetry developments over time.
        </p>
      </div>

      {/* Row 1: Structural Score Progression Chart */}
      <section className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingUp size={18} className="text-blue-400" />
          Biometric Score Trend Lines
        </h3>

        {analysisData.length > 0 ? (
          <div className="w-full h-80 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analysisData} margin={{ left: -20, right: 10, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: 10 }} />
                <YAxis domain={[40, 100]} stroke="#6b7280" style={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ background: '#0d0d12', border: '1px solid #2e303a', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="harmony" name="Harmony" stroke="#3b82f6" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="symmetry" name="Symmetry" stroke="#6366f1" strokeWidth={2} />
                <Line type="monotone" dataKey="proportion" name="Proportion" stroke="#a855f7" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-20 border border-neutral-900 border-dashed rounded-2xl text-center text-xs text-neutral-500 italic">
            Complete multiple Face Harmony scans to visualize progression trend lines.
          </div>
        )}
      </section>

      {/* Row 2: Double Grid (Habit Trackers) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sleep chart */}
        <div className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Moon size={18} className="text-indigo-400" />
            Sleep Consistency Log
          </h3>

          <div className="w-full h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartMockData} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: 10 }} />
                <YAxis domain={[0, 10]} stroke="#6b7280" style={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ background: '#0d0d12', border: '1px solid #2e303a', borderRadius: '12px' }}
                />
                <Bar dataKey="sleep" name="Hours Slept" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Water chart */}
        <div className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Droplet size={18} className="text-blue-400" />
            Hydration Intake Log
          </h3>

          <div className="w-full h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartMockData} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: 10 }} />
                <YAxis stroke="#6b7280" style={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ background: '#0d0d12', border: '1px solid #2e303a', borderRadius: '12px' }}
                />
                <Bar dataKey="water" name="Fluid Logged (ml)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

      {/* Row 3: GitHub Heatmap Grid */}
      <section className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-6">
        <div>
          <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
            <Calendar size={18} className="text-emerald-400" />
            Daily Logging Heatmap
          </h3>
          <p className="text-xs text-neutral-400">
            Visual map of check-ins during the last 12 weeks. Maintain your streak to fill the grid.
          </p>
        </div>

        <div className="flex flex-col items-center sm:items-start space-y-3">
          {renderHeatmap()}
          
          <div className="flex items-center gap-6 text-[10px] text-neutral-500 font-semibold uppercase tracking-wider pt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-neutral-800 rounded-[2px]" />
              <span>Skipped Day</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-[2px]" />
              <span>Checked-in Day</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
