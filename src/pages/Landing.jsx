// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Landing.jsx
import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import WorkflowSection from '../components/landing/WorkflowSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import PricingSection from '../components/landing/PricingSection';
import FAQSection from '../components/landing/FAQSection';
import FooterSection from '../components/landing/FooterSection';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center overflow-x-hidden relative bg-mesh-slow selection:bg-primary/30 selection:text-accent font-sans">
      
      {/* Skip to Main Content Accessibility Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] px-4 py-2 bg-primary text-white font-bold rounded-lg shadow-lg"
      >
        Skip to main content
      </a>

      {/* Global Fixed Navbar */}
      <Navbar />

      {/* Main Content Sections */}
      <main id="main-content" className="w-full flex flex-col items-center">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Transformation Statistics Section */}
        <StatsSection />

        {/* 3. Alternating & Bento Features Grid */}
        <FeaturesSection />

        {/* 4. AI Transformation Workflow */}
        <WorkflowSection />

        {/* 5. Member Testimonials Marquee */}
        <TestimonialsSection />

        {/* 6. Simple Pricing Tiers */}
        <PricingSection />

        {/* 7. FAQ Accordion */}
        <FAQSection />
      </main>

      {/* 8. Large CTA & Footer */}
      <FooterSection />

    </div>
  );
}
