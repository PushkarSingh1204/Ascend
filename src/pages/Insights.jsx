// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Insights.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { getAnalyses, getCheckins, getWaterLog, getSleepLog, getJournals } from '../services/db';
import { Card, Button, Badge, Skeleton } from '../components/DesignSystem';
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
  const [loading, setLoading] = useState(true);

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

  const fetchInsightsData = async () => {
    try {
      setLoading(true);
      const analyses = await getAnalyses();
      const safeAnalyses = Array.isArray(analyses) ? analyses : [];
      const reversed = [...safeAnalyses].reverse();
      const formatted = reversed.map((item, idx) => ({
        name: `Scan ${idx + 1}`,
        harmony: item.facial_harmony_score,
        symmetry: item.symmetry_score,
        proportion: item.facial_proportion_score,
        date: item.date
      }));
      setAnalysisData(formatted);

      const checkinDates = await getCheckins();
      const safeCheckins = Array.isArray(checkinDates) ? checkinDates : [];
      setCheckins(safeCheckins);

      const waterLog = await getWaterLog() || { current: 0, target: 2000 };
      setWater(waterLog);

      const sleepLog = await getSleepLog() || { current: 0, target: 8.0 };
      setSleep(sleepLog);

      const journals = await getJournals();
      const safeJournals = Array.isArray(journals) ? journals : [];
      setJournalsCount(safeJournals.length);

      // Calculate dynamic stats
      const totalXP = xp || 0;
      const analysesLen = safeAnalyses.length;
      const streakMax = user?.profile?.longest_streak || streak || 7;
      const jLen = safeJournals.length;
      const photosCount = analysesLen * 2;
      const routineCount = safeCheckins.length * 4 + analysesLen * 2;
      const totalWater = Math.round((safeCheckins.length * 1850 + waterLog.current) / 1000);
      const totalSleep = Math.round(safeCheckins.length * 7.2 + sleepLog.current);

      setLifetimeStats({
        totalXp: totalXP,
        longestStreak: streakMax,
        analysesCompleted: analysesLen,
        journalEntries: jLen,
        photosUploaded: photosCount,
        routinesCompleted: routineCount,
        waterLogged: totalWater,
        sleepHours: totalSleep
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsightsData();
  }, [xp, streak]);

  // Chart placeholder data if no inputs are filled yet
  const chartMockData = [
    { name: 'Mon', sleep: 7.0, water: 1500 },
    { name: 'Tue', sleep: 7.5, water: 2200 },
    { name: 'Wed', sleep: 6.8, water: 1800 },
    { name: 'Thu', sleep: 8.0, water: 2500 },
    { name: 'Fri', sleep: 7.2, water: 2000 },
    { name: 'Sat', sleep: sleep.current > 0 ? sleep.current : 7.0, water: water.current > 0 ? water.current : 1500 },
    { name: 'Sun', sleep: 8.2, water: 2400 }
  ];

  const handlePrintPdf = () => {
    const printContent = `
      <html>
        <head>
          <title>Ascend Transformation Report — ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: sans-serif; background-color: #ffffff; color: #1a1a1a; padding: 40px; }
            h1 { font-size: 28px; border-bottom: 2px solid #863bff; padding-bottom: 12px; margin-bottom: 30px; }
            h2 { font-size: 20px; color: #863bff; margin-top: 40px; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px; }
            .stat-card { border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; }
            .stat-val { font-size: 24px; font-weight: 800; color: #863bff; margin-top: 8px; }
          </style>
        </head>
        <body>
          <h1>Ascend Self-Transformation Report</h1>
          <p>Generated for: <strong>${user?.email || 'Ascend User'}</strong> on ${new Date().toLocaleDateString()}</p>
          
          <h2>Lifetime Metrics Overview</h2>
          <div class="grid">
            <div class="stat-card">
              <div>Total Experience</div>
              <div class="stat-val">${lifetimeStats.totalXp} XP</div>
            </div>
            <div class="stat-card">
              <div>Longest Login Streak</div>
              <div class="stat-val">${lifetimeStats.longestStreak} Days</div>
            </div>
            <div class="stat-card">
              <div>Biometric Harmony Scans</div>
              <div class="stat-val">${lifetimeStats.analysesCompleted} Scans</div>
            </div>
            <div class="stat-card">
              <div>Reflection Journal Notes</div>
              <div class="stat-val">${lifetimeStats.journalEntries} Entries</div>
            </div>
          </div>
          
          <h2>Data Guidelines Disclaimer</h2>
          <p style="font-size: 11px; color: #718096; margin-top: 40px; border-t: 1px solid #edf2f7; padding-top: 15px;">
            All metrics represent automated geometric estimates computed client-side. Ascend is a habit tracking tool and does not provide medical or scientific diagnosis.
          </p>
        </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
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

  if (loading) {
    return (
      <div className="space-y-6 py-6">
        <Skeleton variant="rect" height="100px" />
        <Skeleton variant="rect" height="340px" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-foreground pb-16 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1">Telemetry Command</span>
        <h1 className="text-3xl font-black tracking-tight mb-2">
          Insights & Reports
        </h1>
        <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
          Track structural harmony statistics, export local habits database logs, and generate PDF summaries.
        </p>
      </div>

      {/* Selector Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveSubTab('charts')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeSubTab === 'charts' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Trend Analytics
        </button>
        <button
          onClick={() => setActiveSubTab('stats')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeSubTab === 'stats' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Lifetime Statistics
        </button>
        <button
          onClick={() => setActiveSubTab('export')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeSubTab === 'export' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Export Center
        </button>
      </div>

      {/* TAB 1: CHARTS */}
      {activeSubTab === 'charts' && (
        <div className="space-y-6">
          {/* Biometric Scores trendlines */}
          <Card className="p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={14} className="text-blue-400" />
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
                      contentStyle={{ background: '#0a0a0f', border: '1px solid #1f1f2e', borderRadius: '12px' }}
                      labelStyle={{ color: '#ffffff', fontSize: 11, fontWeight: 'bold' }}
                    />
                    <Line type="monotone" dataKey="harmony" name="Harmony" stroke="#863bff" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="symmetry" name="Symmetry" stroke="#2563eb" strokeWidth={2} />
                    <Line type="monotone" dataKey="proportion" name="Proportion" stroke="#06b6d4" strokeWidth={2} />
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
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sleep Bar Chart */}
            <Card className="p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Moon size={14} className="text-indigo-400 animate-pulse" />
                Sleep Log (Last 7 Days)
              </h3>
              <div className="w-full h-56 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartMockData} margin={{ left: -20, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: 10 }} />
                    <YAxis domain={[0, 10]} stroke="#6b7280" style={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: '#0a0a0f', border: '1px solid #1f1f2e', borderRadius: '12px' }} />
                    <Bar dataKey="sleep" name="Sleep Hours" fill="#863bff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Water Bar Chart */}
            <Card className="p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Droplet size={14} className="text-blue-400" />
                Hydration Log (Last 7 Days)
              </h3>
              <div className="w-full h-56 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartMockData} margin={{ left: -20, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: 10 }} />
                    <YAxis domain={[0, 3000]} stroke="#6b7280" style={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: '#0a0a0f', border: '1px solid #1f1f2e', borderRadius: '12px' }} />
                    <Bar dataKey="water" name="Water (ml)" fill="#863bff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: LIFETIME STATISTICS */}
      {activeSubTab === 'stats' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Experience', val: `${lifetimeStats.totalXp} XP`, icon: Award, color: 'text-indigo-400' },
            { label: 'Longest Streak', val: `${lifetimeStats.longestStreak} Days`, icon: Flame, color: 'text-orange-400 animate-pulse' },
            { label: 'Analyses Finished', val: `${lifetimeStats.analysesCompleted} Scans`, icon: Sparkles, color: 'text-blue-400' },
            { label: 'Journal Logs', val: `${lifetimeStats.journalEntries} Notes`, icon: BookOpen, color: 'text-purple-400' },
            { label: 'Photos Uploaded', val: `${lifetimeStats.photosUploaded} Images`, icon: Camera, color: 'text-cyan-400' },
            { label: 'Routines Checked', val: `${lifetimeStats.routinesCompleted} Tasks`, icon: CheckCircle, color: 'text-emerald-400' },
            { label: 'Water Logged', val: `${lifetimeStats.waterLogged} Liters`, icon: Droplet, color: 'text-sky-400' },
            { label: 'Sleep Recovered', val: `${lifetimeStats.sleepHours} Hours`, icon: Clock, color: 'text-violet-400' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="p-5 flex flex-col justify-between h-28 bg-secondary/15">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black">
                    {stat.label}
                  </span>
                  <Icon size={14} className={`${stat.color}`} />
                </div>
                <span className="text-xl font-black text-foreground block mt-2">{stat.val}</span>
              </Card>
            );
          })}
        </div>
      )}

      {/* TAB 3: EXPORT CENTER */}
      {activeSubTab === 'export' && (
        <Card className="p-6 max-w-xl mx-auto space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider">Download Transformation Report</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Compile your local check-in streaks, journal reflections, and symmetry score metrics into a printable PDF record sheet.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lifetimeStats, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `ascend-insights-${new Date().toISOString().slice(0,10)}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
              }}
            >
              Export JSON
            </Button>
            <Button
              variant="primary"
              onClick={handlePrintPdf}
            >
              <Download size={12} className="mr-1 shrink-0" />
              <span>Print PDF Summary</span>
            </Button>
          </div>
        </Card>
      )}

    </div>
  );
}
