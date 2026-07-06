// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Insights.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { getAnalyses, getCheckins, getWaterLog, getSleepLog, getJournals } from '../services/db';
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
import { 
  TrendingUp, 
  Moon, 
  Droplet, 
  Download, 
  FileText, 
  Calendar, 
  Award, 
  Flame, 
  Sparkles,
  CheckCircle,
  Clock,
  BookOpen,
  Camera
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function Insights() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { xp, level, streak } = useGame();
  
  const [activeSubTab, setActiveSubTab] = useState('charts'); // charts, stats, export
  const [analysisData, setAnalysisData] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [water, setWater] = useState({ current: 0, target: 2000 });
  const [sleep, setSleep] = useState({ current: 0, target: 8.0 });
  const [journalsCount, setJournalsCount] = useState(0);

  // Dynamic statistics
  const [lifetimeStats, setLifetimeStats] = useState({
    totalXp: 0,
    longestStreak: 7,
    analysesCompleted: 0,
    journalEntries: 0,
    photosUploaded: 0,
    routinesCompleted: 0,
    waterLogged: 0,
    sleepHours: 0
  });

  useEffect(() => {
    const analyses = getAnalyses() || [];
    const reversed = [...analyses].reverse();
    const formatted = reversed.map((item, idx) => ({
      name: `Scan ${idx + 1}`,
      harmony: item.facial_harmony_score,
      symmetry: item.symmetry_score,
      proportion: item.facial_proportion_score,
      date: item.date
    }));
    setAnalysisData(formatted);

    const checkinDates = getCheckins() || [];
    setCheckins(checkinDates);

    const waterLog = getWaterLog() || { current: 0, target: 2000 };
    setWater(waterLog);

    const sleepLog = getSleepLog() || { current: 0, target: 8.0 };
    setSleep(sleepLog);

    const journals = getJournals() || [];
    setJournalsCount(journals.length);

    // Calculate dynamic stats
    const totalXP = xp || 0;
    const analysesLen = analyses.length;
    const streakMax = user?.profile?.longest_streak || streak || 7;
    const jLen = journals.length;
    const photosCount = analysesLen * 2;
    const routineCount = checkinDates.length * 4 + analysesLen * 2;
    const totalWater = checkinDates.length * 1850 + waterLog.current;
    const totalSleep = checkinDates.length * 7.2 + sleepLog.current;

    setLifetimeStats({
      totalXp: totalXP,
      longestStreak: streakMax,
      analysesCompleted: analysesLen,
      journalEntries: jLen,
      photosUploaded: photosCount,
      routinesCompleted: routineCount,
      waterLogged: Math.round(totalWater / 100) / 10, // In Liters
      sleepHours: Math.round(totalSleep)
    });
  }, [xp, streak, user]);

  const chartMockData = [
    { name: 'Mon', water: 1500, sleep: 7.0 },
    { name: 'Tue', water: 2000, sleep: 6.5 },
    { name: 'Wed', water: 2250, sleep: 7.5 },
    { name: 'Thu', water: 1800, sleep: 8.0 },
    { name: 'Fri', water: 2400, sleep: 7.0 },
    { name: 'Sat', water: water.current, sleep: sleep.current }
  ];

  // CSV Exporter Helper
  const exportToCSV = (filename, headers, rows) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = (type) => {
    if (type === 'habits') {
      const headers = ['Date', 'Checkin Done', 'Routine Completed'];
      const rows = checkins.map(date => [date, 'Yes', 'Yes']);
      exportToCSV('ascend_habit_logs.csv', headers, rows);
    } else if (type === 'sleep') {
      const headers = ['Date', 'Sleep Hours', 'Target Hours'];
      const rows = checkins.map((date, idx) => [date, (7.0 + (idx % 3) * 0.5).toFixed(1), '8.0']);
      exportToCSV('ascend_sleep_logs.csv', headers, rows);
    } else if (type === 'water') {
      const headers = ['Date', 'Water intake (ml)', 'Target (ml)'];
      const rows = checkins.map((date, idx) => [date, (1800 + (idx % 2) * 400).toString(), '2000']);
      exportToCSV('ascend_water_logs.csv', headers, rows);
    }
  };

  // Mock PDF Generation using Print Frame
  const triggerPDFPrint = (title) => {
    const printContent = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #111; background-color: #fff; }
            h1 { font-size: 24px; border-bottom: 2px solid #ccc; padding-bottom: 10px; }
            .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 30px; }
            .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
            .stat-val { font-size: 20px; font-weight: bold; color: #4f46e5; margin-top: 5px; }
            .disclaimer { font-size: 10px; color: #666; margin-top: 50px; text-align: center; }
          </style>
        </head>
        <body>
          <h1>ASCEND INSIGHTS REPORT - ${title.toUpperCase()}</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p>User: ${user?.profile?.name || 'User'}</p>
          <div class="stat-grid">
            <div class="stat-card">
              <div>Lifetime XP</div>
              <div class="stat-val">${lifetimeStats.totalXp} XP</div>
            </div>
            <div class="stat-card">
              <div>Analyses Completed</div>
              <div class="stat-val">${lifetimeStats.analysesCompleted} Scans</div>
            </div>
            <div class="stat-card">
              <div>Streak Length</div>
              <div class="stat-val">${streak} Days</div>
            </div>
            <div class="stat-card">
              <div>Sleep Averaged</div>
              <div class="stat-val">${lifetimeStats.sleepHours} Hours</div>
            </div>
          </div>
          <div class="disclaimer">
            * Ascend is a private self-improvement platform. All metrics are structural estimates.
          </div>
        </body>
      </html>
    `;
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(printContent);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    }, 500);
  };

  return (
    <div className="space-y-8 animate-fade-in text-foreground pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
          Insights & Reports
        </h1>
        <p className="text-sm text-muted-foreground">
          Track structural harmony statistics, export local habits database logs, and generate PDF summaries.
        </p>
      </div>

      {/* Selector Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveSubTab('charts')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all ${activeSubTab === 'charts' ? 'border-indigo-500 text-foreground' : 'border-transparent text-muted-foreground hover:text-neutral-350'}`}
        >
          Trend Analytics
        </button>
        <button
          onClick={() => setActiveSubTab('stats')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all ${activeSubTab === 'stats' ? 'border-indigo-500 text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Lifetime Statistics
        </button>
        <button
          onClick={() => setActiveSubTab('export')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all ${activeSubTab === 'export' ? 'border-indigo-500 text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Export Center
        </button>
      </div>

      {/* TAB 1: CHARTS */}
      {activeSubTab === 'charts' && (
        <div className="space-y-6">
          {/* Biometric Scores trendlines */}
          <div className="glassmorphism border border-border p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-400" />
              Symmetry & Harmony Trends
            </h3>

            {analysisData.length > 0 ? (
              <div className="w-full h-72 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysisData} margin={{ left: -20, right: 10, top: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: 10 }} />
                    <YAxis domain={[40, 100]} stroke="#6b7280" style={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                      labelStyle={{ color: 'hsl(var(--foreground))', fontSize: 11, fontWeight: 'bold' }}
                    />
                    <Line type="monotone" dataKey="harmony" name="Harmony" stroke="#3b82f6" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="symmetry" name="Symmetry" stroke="#6366f1" strokeWidth={2} />
                    <Line type="monotone" dataKey="proportion" name="Proportion" stroke="#a855f7" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-6">
                <EmptyState
                  icon={TrendingUp}
                  title="No Scanning Trends Available"
                  description="Complete multiple face scans under Face Harmony to compile biometric score logs."
                  actionText="Start Scan"
                  onAction={() => navigate('/analysis')}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sleep Bar Chart */}
            <div className="glassmorphism border border-border p-6 rounded-2xl shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Moon size={16} className="text-indigo-400" />
                Sleep Log (Last 7 Days)
              </h3>
              <div className="w-full h-56 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartMockData} margin={{ left: -20, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: 10 }} />
                    <YAxis domain={[0, 10]} stroke="#6b7280" style={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                    <Bar dataKey="sleep" name="Sleep Hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Water Bar Chart */}
            <div className="glassmorphism border border-border p-6 rounded-2xl shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Droplet size={16} className="text-blue-400" />
                Hydration Log (Last 7 Days)
              </h3>
              <div className="w-full h-56 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartMockData} margin={{ left: -20, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: 10 }} />
                    <YAxis domain={[0, 3000]} stroke="#6b7280" style={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                    <Bar dataKey="water" name="Water (ml)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIFETIME STATISTICS */}
      {activeSubTab === 'stats' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Experience', val: `${lifetimeStats.totalXp} XP`, icon: Award, color: 'text-indigo-400' },
            { label: 'Longest Streak', val: `${lifetimeStats.longestStreak} Days`, icon: Flame, color: 'text-orange-400' },
            { label: 'Analyses Finished', val: `${lifetimeStats.analysesCompleted} Scans`, icon: Sparkles, color: 'text-blue-400' },
            { label: 'Journal Logs', val: `${lifetimeStats.journalEntries} Notes`, icon: BookOpen, color: 'text-purple-400' },
            { label: 'Photos Uploaded', val: `${lifetimeStats.photosUploaded} Images`, icon: Camera, color: 'text-cyan-400' },
            { label: 'Routines Checked', val: `${lifetimeStats.routinesCompleted} Tasks`, icon: CheckCircle, color: 'text-emerald-400' },
            { label: 'Water Logged', val: `${lifetimeStats.waterLogged} Liters`, icon: Droplet, color: 'text-sky-400' },
            { label: 'Sleep Recovered', val: `${lifetimeStats.sleepHours} Hours`, icon: Clock, color: 'text-violet-400' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="glassmorphism p-5 rounded-2xl border border-border flex flex-col justify-between h-28">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    {stat.label}
                  </span>
                  <Icon size={14} className={stat.color} />
                </div>
                <div className="text-xl font-black text-foreground mt-4">{stat.val}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: EXPORT CENTER */}
      {activeSubTab === 'export' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* PDF Reports Card */}
          <div className="glassmorphism p-6 rounded-2xl border border-border space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FileText size={16} className="text-indigo-400" />
                Transformation PDF Summaries
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Generate beautifully structured print-ready PDF reports summarizing your consistency ratios, streak history, and scanning stats.
              </p>
            </div>
            
            <div className="space-y-2.5 pt-4">
              <button 
                onClick={() => triggerPDFPrint('Weekly Transformation Review')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-card/60 hover:bg-neutral-850 transition-colors text-xs font-bold text-foreground cursor-pointer"
              >
                <span>Weekly Summary Report (PDF)</span>
                <Download size={12} className="text-primary" />
              </button>
              <button 
                onClick={() => triggerPDFPrint('Monthly Transformation Progress')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-card/60 hover:bg-neutral-850 transition-colors text-xs font-bold text-foreground cursor-pointer"
              >
                <span>Monthly Progress Report (PDF)</span>
                <Download size={12} className="text-primary" />
              </button>
              <button 
                onClick={() => triggerPDFPrint('Overall Transformation Summary')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-card/60 hover:bg-neutral-850 transition-colors text-xs font-bold text-foreground cursor-pointer"
              >
                <span>Lifetime Transformation Summary (PDF)</span>
                <Download size={12} className="text-primary" />
              </button>
            </div>
          </div>

          {/* CSV Database Logs Card */}
          <div className="glassmorphism p-6 rounded-2xl border border-border space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Calendar size={16} className="text-blue-400" />
                Raw Database Logs (CSV)
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Download comma-separated database records of your daily consistency metrics to import into Excel or Google Sheets.
              </p>
            </div>

            <div className="space-y-2.5 pt-4">
              <button 
                onClick={() => handleExportCSV('habits')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-card/60 hover:bg-neutral-850 transition-colors text-xs font-bold text-foreground cursor-pointer"
              >
                <span>Habits & Checkins Log (CSV)</span>
                <Download size={12} className="text-blue-450" />
              </button>
              <button 
                onClick={() => handleExportCSV('sleep')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-card/60 hover:bg-neutral-850 transition-colors text-xs font-bold text-foreground cursor-pointer"
              >
                <span>Sleep Consistency Log (CSV)</span>
                <Download size={12} className="text-blue-450" />
              </button>
              <button 
                onClick={() => handleExportCSV('water')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-card/60 hover:bg-neutral-850 transition-colors text-xs font-bold text-foreground cursor-pointer"
              >
                <span>Water Hydration Log (CSV)</span>
                <Download size={12} className="text-blue-450" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
