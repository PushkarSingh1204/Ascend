// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\landing\HeroVideo.jsx
import React, { useEffect, useRef } from 'react';

const DEFAULT_VIDEO_SRC = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4";

export default function HeroVideo({ videoSrc = DEFAULT_VIDEO_SRC }) {
  const videoRef = useRef(null);
  const prevXRef = useRef(null);
  const isSeekingRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleResizeAndInit = () => {
      const isDesktop = window.innerWidth >= 1024;
      if (!isDesktop) {
        // Mobile Autoplay
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.play().catch(() => {});
      } else {
        // Desktop Scrubbing
        video.pause();
      }
    };

    handleResizeAndInit();

    const handleMouseMove = (e) => {
      if (window.innerWidth < 1024 || !video || isNaN(video.duration) || video.duration <= 0) return;

      const currentX = e.clientX;
      if (prevXRef.current === null) {
        prevXRef.current = currentX;
        return;
      }

      const deltaX = currentX - prevXRef.current;
      prevXRef.current = currentX;

      // Sensitivity factor
      const timeDelta = (deltaX / window.innerWidth) * 0.8 * video.duration;
      let targetTime = video.currentTime + timeDelta;
      
      // Clamp between 0 and duration
      targetTime = Math.max(0, Math.min(video.duration, targetTime));

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        video.currentTime = targetTime;
      }
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
    };

    video.addEventListener('seeked', handleSeeked);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResizeAndInit);

    return () => {
      video.removeEventListener('seeked', handleSeeked);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResizeAndInit);
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
