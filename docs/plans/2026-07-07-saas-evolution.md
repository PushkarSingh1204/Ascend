# Evolve Ascend to Premium SaaS - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Evolve the Ascend self-transformation platform into a premium-quality SaaS application featuring theme switching, universal command search, activity timelines, calendar views, advanced filters, notifications, an AI Coach, and polished UX.

**Architecture:** Create modular React context providers for Theme and Notifications, build helper classes for data filtering/exports, and design layout overlays for the Command Palette and AI Coach, ensuring zero horizontal scrolling and seamless responsive layouts.

**Tech Stack:** React, Lucide React, HSL Tailored Tailwind colors (v4 compatible), standard browser APIs.

---

### Task 1: Clean Up Community Navigation
Remove all references to the Community page from App routing and sidebar.
**Files:**
- Modify: [App.jsx](file:///C:/Users/pushk/.gemini/antigravity/scratch/ascend/src/App.jsx)
- Modify: [Sidebar.jsx](file:///C:/Users/pushk/.gemini/antigravity/scratch/ascend/src/components/Sidebar.jsx)

### Task 2: Create Theme Context
Build a context manager supporting Dark, Light, and System theme synchronization.
**Files:**
- Create: `src/context/ThemeContext.jsx`
- Modify: [index.css](file:///C:/Users/pushk/.gemini/antigravity/scratch/ascend/src/index.css)
- Modify: [App.jsx](file:///C:/Users/pushk/.gemini/antigravity/scratch/ascend/src/App.jsx)

### Task 3: Notification Center Context & Sidebar Bell
Create a context for client-side notifications and integrate a bell dropdown into the main header.
**Files:**
- Create: `src/context/NotificationContext.jsx`
- Modify: [Layout.jsx](file:///C:/Users/pushk/.gemini/antigravity/scratch/ascend/src/components/Layout.jsx)

### Task 4: Global Search / Command Palette (Ctrl+K)
Develop a Ctrl+K modal overlay that lists pages, routines, journal entries, and triggers quick actions.
**Files:**
- Create: `src/components/CommandPalette.jsx`
- Modify: [Layout.jsx](file:///C:/Users/pushk/.gemini/antigravity/scratch/ascend/src/components/Layout.jsx)

### Task 5: Redesign KPI Dashboard
Upgrade the main dashboard view into a clean analytical hub showing consistency indexes, streaks, sleep charts, and activity streams.
**Files:**
- Modify: [Dashboard.jsx](file:///C:/Users/pushk/.gemini/antigravity/scratch/ascend/src/pages/Dashboard.jsx)

### Task 6: Calendar View Page
Implement a dedicated page mapping routines, journal entries, scans, and reviews onto a monthly grid.
**Files:**
- Create: `src/pages/CalendarView.jsx`
- Modify: [App.jsx](file:///C:/Users/pushk/.gemini/antigravity/scratch/ascend/src/App.jsx)
- Modify: [Sidebar.jsx](file:///C:/Users/pushk/.gemini/antigravity/scratch/ascend/src/components/Sidebar.jsx)

### Task 7: AI coach Overlay Drawer
Build an interactive chat interface overlay that analyzes and explains scans, habits, and progress.
**Files:**
- Create: `src/components/AICoach.jsx`
- Modify: [Layout.jsx](file:///C:/Users/pushk/.gemini/antigravity/scratch/ascend/src/components/Layout.jsx)

### Task 8: Advanced Filters
Add dynamic queries (date range, moods, tags, roadmap status) to journal and progress pages.
**Files:**
- Modify: [Journal.jsx](file:///C:/Users/pushk/.gemini/antigravity/scratch/ascend/src/pages/Journal.jsx)
- Modify: [Progress.jsx](file:///C:/Users/pushk/.gemini/antigravity/scratch/ascend/src/pages/Progress.jsx)
- Modify: [Roadmap.jsx](file:///C:/Users/pushk/.gemini/antigravity/scratch/ascend/src/pages/Roadmap.jsx)

### Task 9: Export and Reports Center
Allow downloading PDF summaries and CSV logs of water, sleep, and habits.
**Files:**
- Create: `src/pages/Reports.jsx`
- Modify: [App.jsx](file:///C:/Users/pushk/.gemini/antigravity/scratch/ascend/src/App.jsx)
- Modify: [Sidebar.jsx](file:///C:/Users/pushk/.gemini/antigravity/scratch/ascend/src/components/Sidebar.jsx)
- Modify: [Analytics.jsx](file:///C:/Users/pushk/.gemini/antigravity/scratch/ascend/src/pages/Analytics.jsx)

### Task 10: Onboarding & Responsive Polish
Refine capture instructions, skeletons, error handlers, accessibility contrast ratios, and mobile page heights.
**Files:**
- Modify: [Onboarding.jsx](file:///C:/Users/pushk/.gemini/antigravity/scratch/ascend/src/pages/Onboarding.jsx)
- Modify: [Sidebar.jsx](file:///C:/Users/pushk/.gemini/antigravity/scratch/ascend/src/components/Sidebar.jsx)
- Modify: [Layout.jsx](file:///C:/Users/pushk/.gemini/antigravity/scratch/ascend/src/components/Layout.jsx)
