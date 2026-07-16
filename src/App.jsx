// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\App.jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy Loaded Pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analysis = lazy(() => import('./pages/Analysis'));
const Progress = lazy(() => import('./pages/Progress'));
const Routine = lazy(() => import('./pages/Routine'));
const Journal = lazy(() => import('./pages/Journal'));
const Insights = lazy(() => import('./pages/Insights'));
const Payments = lazy(() => import('./pages/Payments'));
const Profile = lazy(() => import('./pages/Profile'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const WeeklyReview = lazy(() => import('./pages/WeeklyReview'));
const PremiumTools = lazy(() => import('./pages/PremiumTools'));
const CalendarView = lazy(() => import('./pages/CalendarView'));

// Skeleton Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center text-neutral-400">
    <div className="flex flex-col items-center gap-3">
      <span className="w-8 h-8 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></span>
      <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Loading Ascend...</span>
    </div>
  </div>
);

// Route Guard for Protected Pages
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

// Route Guard for Pages that require Onboarding completion
const OnboardedRoute = ({ children }) => {
  const { user, loading, isOnboarded } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <Layout>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </Layout>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <GameProvider>
            <Router>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Pages */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />

                  {/* Onboarding Wizard */}
                  <Route 
                    path="/onboarding" 
                    element={
                      <ProtectedRoute>
                        <Onboarding />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Protected Pages */}
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
                    path="/premium-tools" 
                    element={
                      <OnboardedRoute>
                        <PremiumTools />
                      </OnboardedRoute>
                    } 
                  />

                  <Route 
                    path="/insights" 
                    element={
                      <OnboardedRoute>
                        <Insights />
                      </OnboardedRoute>
                    } 
                  />

                  <Route 
                    path="/calendar" 
                    element={
                      <OnboardedRoute>
                        <CalendarView />
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
              </Suspense>
            </Router>
          </GameProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
