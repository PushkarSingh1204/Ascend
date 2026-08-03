// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\App.jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Preloader from './components/Preloader';

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
const Premium = lazy(() => import('./pages/Premium'));
const Profile = lazy(() => import('./pages/Profile'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const WeeklyReview = lazy(() => import('./pages/WeeklyReview'));
const PremiumTools = lazy(() => import('./pages/PremiumTools'));
const CalendarView = lazy(() => import('./pages/CalendarView'));
const Resources = lazy(() => import('./pages/Resources'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Page Loader with Uiverse.io Speeder Preloader
const PageLoader = () => <Preloader label="Ascending God..." />;

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

const PremiumRoute = ({ children }) => {
  const { isPremium, loading } = useSubscription();
  if (loading) return <PageLoader />;
  return isPremium ? children : <Navigate to="/premium" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <SubscriptionProvider>
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

                  {/* Protected Application Routes inside Shared App Shell */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <OnboardedRoute>
                        <ErrorBoundary><Dashboard /></ErrorBoundary>
                      </OnboardedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/roadmap" 
                    element={
                      <OnboardedRoute>
                        <PremiumRoute><ErrorBoundary><Roadmap /></ErrorBoundary></PremiumRoute>
                      </OnboardedRoute>
                    } 
                  />

                  <Route 
                    path="/analysis" 
                    element={
                      <OnboardedRoute>
                        <ErrorBoundary><Analysis /></ErrorBoundary>
                      </OnboardedRoute>
                    } 
                  />

                  <Route 
                    path="/progress" 
                    element={
                      <OnboardedRoute>
                        <ErrorBoundary><Progress /></ErrorBoundary>
                      </OnboardedRoute>
                    } 
                  />

                  <Route 
                    path="/routine" 
                    element={
                      <OnboardedRoute>
                        <ErrorBoundary><Routine /></ErrorBoundary>
                      </OnboardedRoute>
                    } 
                  />

                  <Route 
                    path="/journal" 
                    element={
                      <OnboardedRoute>
                        <ErrorBoundary><Journal /></ErrorBoundary>
                      </OnboardedRoute>
                    } 
                  />

                  <Route 
                    path="/weekly-review" 
                    element={
                      <OnboardedRoute>
                        <PremiumRoute><ErrorBoundary><WeeklyReview /></ErrorBoundary></PremiumRoute>
                      </OnboardedRoute>
                    } 
                  />

                  <Route 
                    path="/premium-tools" 
                    element={
                      <OnboardedRoute>
                        <PremiumRoute><ErrorBoundary><PremiumTools /></ErrorBoundary></PremiumRoute>
                      </OnboardedRoute>
                    } 
                  />

                  <Route path="/premium" element={<OnboardedRoute><ErrorBoundary><Premium /></ErrorBoundary></OnboardedRoute>} />

                  <Route 
                    path="/insights" 
                    element={
                      <OnboardedRoute>
                        <PremiumRoute><ErrorBoundary><Insights /></ErrorBoundary></PremiumRoute>
                      </OnboardedRoute>
                    } 
                  />

                  <Route 
                    path="/calendar" 
                    element={
                      <OnboardedRoute>
                        <ErrorBoundary><CalendarView /></ErrorBoundary>
                      </OnboardedRoute>
                    } 
                  />

                  <Route 
                    path="/resources" 
                    element={
                      <OnboardedRoute>
                        <ErrorBoundary><Resources /></ErrorBoundary>
                      </OnboardedRoute>
                    } 
                  />

                  <Route 
                    path="/profile" 
                    element={
                      <OnboardedRoute>
                        <ErrorBoundary><Profile /></ErrorBoundary>
                      </OnboardedRoute>
                    } 
                  />

                  <Route 
                    path="/payments" 
                    element={
                      <OnboardedRoute>
                        <ErrorBoundary><Premium /></ErrorBoundary>
                      </OnboardedRoute>
                    } 
                  />

                  {/* Fallback 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Router>
          </GameProvider>
          </SubscriptionProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
