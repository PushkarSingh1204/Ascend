// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Landing.jsx
import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import StorytellingSection from '../components/landing/StorytellingSection';
import StatsSection from '../components/landing/StatsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
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

      {/* Global Fixed Glass Navbar */}
      <Navbar />

      {/* Main Content Sections */}
      <main id="main-content" className="w-full flex flex-col items-center">
        {/* 1. Immersive AI Hero Section */}
        <HeroSection />

        {/* 2. Interactive 5-Step Storytelling Section */}
        <StorytellingSection />

        {/* 3. Transformation Statistics Section */}
        <StatsSection />

        {/* 4. Alternating & Bento Features Grid */}
        <FeaturesSection />

        {/* 5. Simple Pricing Tiers */}
        <PricingSection />

        {/* 6. FAQ Accordion */}
        <FAQSection />
      </main>

      {/* 7. Large CTA & Footer */}
      <FooterSection />

    </div>
  );
}
