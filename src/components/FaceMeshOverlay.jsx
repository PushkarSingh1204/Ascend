// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\FaceMeshOverlay.jsx
import React, { useEffect, useRef } from 'react';

export default function FaceMeshOverlay({ landmarks, width, height }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (!landmarks || landmarks.length === 0) return;

    // Draw mesh connection lines for a biometric feel
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)'; // Semitransparent blue

    // Connect some key facial outlines (approximate indices)
    // Jaw outline
    ctx.beginPath();
    for (let i = 0; i <= 16; i++) {
      if (landmarks[i]) {
        const pt = landmarks[i];
        if (i === 0) ctx.moveTo(pt.x * width, pt.y * height);
        else ctx.lineTo(pt.x * width, pt.y * height);
      }
    }
    ctx.stroke();

    // Left Eye outline
    const leftEyeIndices = [33, 160, 158, 133, 153, 144, 33];
    ctx.beginPath();
    leftEyeIndices.forEach((idx, i) => {
      const pt = landmarks[idx];
      if (pt) {
        if (i === 0) ctx.moveTo(pt.x * width, pt.y * height);
        else ctx.lineTo(pt.x * width, pt.y * height);
      }
    });
    ctx.stroke();

    // Right Eye outline
    const rightEyeIndices = [263, 387, 385, 362, 380, 373, 263];
    ctx.beginPath();
    rightEyeIndices.forEach((idx, i) => {
      const pt = landmarks[idx];
      if (pt) {
        if (i === 0) ctx.moveTo(pt.x * width, pt.y * height);
        else ctx.lineTo(pt.x * width, pt.y * height);
      }
    });
    ctx.stroke();

    // Lips outline
    const lipsIndices = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 78];
    ctx.beginPath();
    lipsIndices.forEach((idx, i) => {
      const pt = landmarks[idx];
      if (pt) {
        if (i === 0) ctx.moveTo(pt.x * width, pt.y * height);
        else ctx.lineTo(pt.x * width, pt.y * height);
      }
    });
    ctx.stroke();

    // Draw all points as glowing dots
    ctx.fillStyle = 'rgba(56, 189, 248, 0.85)'; // Glowing cyan
    landmarks.forEach((point) => {
      ctx.beginPath();
      // Draw tiny dot
      ctx.arc(point.x * width, point.y * height, 1.2, 0, 2 * Math.PI);
      ctx.fill();
    });

  }, [landmarks, width, height]);

  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height} 
      className="absolute inset-0 pointer-events-none w-full h-full"
    />
  );
}
