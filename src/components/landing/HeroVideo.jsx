// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\landing\HeroVideo.jsx
import React, { useEffect, useRef } from 'react';

const DEFAULT_VIDEO_SRC = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4";

export default function HeroVideo({ videoSrc = DEFAULT_VIDEO_SRC }) {
  const videoRef = useRef(null);
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const animFrameRef = useRef(null);
  const isDesktopRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check device type and initialize video state
    const checkDevice = () => {
      isDesktopRef.current = window.innerWidth >= 1024;
      if (!isDesktopRef.current) {
        // Mobile Behavior: Autoplay, Loop, Muted
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.play().catch(() => {});
      } else {
        // Desktop Behavior: Paused, No Autoplay, No Loop
        video.pause();
        video.autoplay = false;
        video.loop = false;
      }
    };

    checkDevice();

    // Mouse Move Listener to calculate normalized target time
    const handleMouseMove = (e) => {
      if (!isDesktopRef.current || !video || !video.duration || isNaN(video.duration)) return;

      // Normalized X ratio across screen (0 -> 1)
      const ratio = Math.max(0, Math.min(1, e.clientX / window.innerWidth));
      targetTimeRef.current = ratio * video.duration;
    };

    // 60fps RequestAnimationFrame Loop with LERP Interpolation
    const updateScrub = () => {
      if (isDesktopRef.current && video && video.duration && !isNaN(video.duration)) {
        const diff = targetTimeRef.current - currentTimeRef.current;

        // Apply LERP (Linear Interpolation) with 0.12 factor for ultra-smooth movement
        if (Math.abs(diff) > 0.001) {
          currentTimeRef.current += diff * 0.12;
          
          // Clamp time safety boundary
          const clamped = Math.max(0, Math.min(video.duration, currentTimeRef.current));
          
          // Apply to video currentTime safely without triggering React re-renders
          try {
            video.currentTime = clamped;
          } catch (err) {
            // Browser seeking safety
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(updateScrub);
    };

    // Start rAF Loop
    animFrameRef.current = requestAnimationFrame(updateScrub);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', checkDevice);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkDevice);
    };
  }, [videoSrc]);

  return (
    <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-background/50">
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover object-right lg:object-right-bottom opacity-40 mix-blend-luminosity filter contrast-125"
      />
      {/* Gradient Masking Overlays for High Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 pointer-events-none" />
    </div>
  );
}
