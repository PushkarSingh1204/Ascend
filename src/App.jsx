// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import Layout from './components/Layout';

// Page Imports
import Landing from './pages/Landing';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Progress from './pages/Progress';
import Routine from './pages/Routine';
import Journal from './pages/Journal';
import Analytics from './pages/Analytics';
import Payments from './pages/Payments';
import Profile from './pages/Profile';
import Roadmap from './pages/Roadmap';
import WeeklyReview from './pages/WeeklyReview';

// Route Guard for Protected Pages
const ProtectedRoute = ({ children }) => {
  const { user, loading, isOnboarded } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070b] flex items-center justify-center text-neutral-400">
        <span className="w-8 h-8 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></span>
      </div>
    );
  }

  // Redirect to login if unauthenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Route Guard for Pages that require Onboarding completion
const OnboardedRoute = ({ children }) => {
  const { user, loading, isOnboarded } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070b] flex items-center justify-center text-neutral-400">
        <span className="w-8 h-8 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to onboarding if not done
  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <Router>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Onboarding Wizard (Auth required, but onboarding not completed yet) */}
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } 
            />

            {/* Protected Pages (Auth required + Onboarded required) */}
            <Route 
              path="/dashboard" 
              element={
                <OnboardedRoute>
                  <Dashboard />
                </OnboardedRoute>
              } 
            />
            
            <Route 
              path="/roadmap" 
              element={
                <OnboardedRoute>
                  <Roadmap />
                </OnboardedRoute>
              } 
            />

            <Route 
              path="/analysis" 
              element={
                <OnboardedRoute>
                  <Analysis />
                </OnboardedRoute>
              } 
            />

            <Route 
              path="/progress" 
              element={
                <OnboardedRoute>
                  <Progress />
                </OnboardedRoute>
              } 
            />

            <Route 
              path="/routine" 
              element={
                <OnboardedRoute>
                  <Routine />
                </OnboardedRoute>
              } 
            />

            <Route 
              path="/journal" 
              element={
                <OnboardedRoute>
                  <Journal />
                </OnboardedRoute>
              } 
            />

            <Route 
              path="/weekly-review" 
              element={
                <OnboardedRoute>
                  <WeeklyReview />
                </OnboardedRoute>
              } 
            />

            <Route 
              path="/analytics" 
              element={
                <OnboardedRoute>
                  <Analytics />
                </OnboardedRoute>
              } 
            />

            <Route 
              path="/profile" 
              element={
                <OnboardedRoute>
                  <Profile />
                </OnboardedRoute>
              } 
            />

            <Route 
              path="/payments" 
              element={
                <OnboardedRoute>
                  <Payments />
                </OnboardedRoute>
              } 
            />

            {/* Fallback redirection */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
