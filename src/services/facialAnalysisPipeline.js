/*
 * Local, non-diagnostic appearance analysis built from MediaPipe face landmarks.
 * Metrics are explicitly confidence-scored; unsupported signals are never stated
 * as facts. This keeps the report useful without claiming medical assessment.
 */
const clamp = (value, min = 0, max = 100) => Math.round(Math.max(min, Math.min(max, value)));
const point = (landmarks, index) => landmarks[index] || { x: 0.5, y: 0.5, z: 0 };
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));
const ratioScore = (value, ideal, tolerance) => clamp(100 - (Math.abs(value - ideal) / tolerance) * 100);

function imageSignal(image) {
  try {
    const canvas = document.createElement('canvas');
    const edge = 96;
    canvas.width = edge; canvas.height = edge;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0, edge, edge);
    const pixels = context.getImageData(0, 0, edge, edge).data;
    let luminance = 0; let luminanceSquared = 0; let redBias = 0; let detail = 0;
    const values = [];
    for (let y = 0; y < edge; y += 1) for (let x = 0; x < edge; x += 1) {
      const offset = (y * edge + x) * 4;
      const l = 0.2126 * pixels[offset] + 0.7152 * pixels[offset + 1] + 0.0722 * pixels[offset + 2];
      luminance += l; luminanceSquared += l * l; redBias += pixels[offset] - ((pixels[offset + 1] + pixels[offset + 2]) / 2);
      values.push(l);
      if (x > 0) detail += Math.abs(l - values[values.length - 2]);
    }
    const count = edge * edge; const mean = luminance / count;
    return { brightness: mean, contrast: Math.sqrt(Math.max(0, luminanceSquared / count - mean * mean)), detail: detail / count, redBias: redBias / count };
  } catch { return { brightness: 128, contrast: 30, detail: 12, redBias: 0 }; }
}

export function assessScanQuality(landmarks, image) {
  if (!landmarks?.length) return { accepted: false, reason: 'No face was detected. Center one face in the frame and try again.' };
  const xs = landmarks.map(p => p.x); const ys = landmarks.map(p => p.y);
  const width = Math.max(...xs) - Math.min(...xs); const height = Math.max(...ys) - Math.min(...ys);
  const leftEye = point(landmarks, 33); const rightEye = point(landmarks, 263); const nose = point(landmarks, 1);
  const roll = Math.abs(Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * 180 / Math.PI);
  const yaw = Math.abs(distance(nose, leftEye) - distance(nose, rightEye)) / Math.max(distance(leftEye, rightEye), 0.001);
  const signal = imageSignal(image);
  const faceSize = clamp((width * height) * 520, 0, 100);
  const lighting = clamp(100 - Math.abs(signal.brightness - 128) * 0.9 - Math.max(0, 13 - signal.contrast) * 2);
  const sharpness = clamp(signal.detail * 5.5);
  const pose = clamp(100 - roll * 5 - yaw * 100);
  const confidence = clamp((faceSize * 0.30) + (lighting * 0.25) + (sharpness * 0.20) + (pose * 0.25));
  const issues = [];
  if (faceSize < 45) issues.push('Move closer so your face fills more of the frame.');
  if (lighting < 55) issues.push('Use even, front-facing light and avoid strong shadows.');
  if (sharpness < 45) issues.push('Hold the camera steady and use a sharper photo.');
  if (pose < 55) issues.push('Face the camera directly and keep your head level.');
  return { accepted: issues.length === 0, confidence, faceSize, lighting, sharpness, pose, roll: Math.round(roll), yaw: Math.round(yaw * 100), occlusion: 'No reliable occlusion estimate is available from face landmarks alone.', issues, signal };
}

function metric(score, confidence, reason, observation, resourceTags = []) {
  return { score: clamp(score), confidence: clamp(confidence), reason, observation, resourceTags, lowConfidence: confidence < 70 };
}

export function buildFacialAnalysisReport(landmarks, image, quality) {
  const leftEyeOuter = point(landmarks, 33); const rightEyeOuter = point(landmarks, 263); const leftEyeInner = point(landmarks, 133); const rightEyeInner = point(landmarks, 362);
  const nose = point(landmarks, 1); const mouthLeft = point(landmarks, 61); const mouthRight = point(landmarks, 291); const chin = point(landmarks, 152); const forehead = point(landmarks, 10); const brow = point(landmarks, 168);
  const jawLeft = point(landmarks, 172); const jawRight = point(landmarks, 397); const cheekLeft = point(landmarks, 234); const cheekRight = point(landmarks, 454);
  const eyeWidth = distance(leftEyeOuter, leftEyeInner); const rightEyeWidth = distance(rightEyeOuter, rightEyeInner); const eyeSpan = distance(leftEyeOuter, rightEyeOuter); const jawWidth = distance(jawLeft, jawRight); const cheekWidth = distance(cheekLeft, cheekRight); const faceHeight = distance(forehead, chin);
  const eyeSymmetry = ratioScore(eyeWidth / Math.max(rightEyeWidth, .001), 1, .18);
  const noseDeviation = clamp(100 - (Math.abs(nose.x - ((leftEyeInner.x + rightEyeInner.x) / 2)) / Math.max(eyeSpan, .001)) * 420);
  const lipAlignment = clamp(100 - (Math.abs(mouthLeft.y - mouthRight.y) / Math.max(eyeSpan, .001)) * 260);
  const jawSymmetry = clamp(100 - (Math.abs(distance(jawLeft, chin) - distance(jawRight, chin)) / Math.max(jawWidth, .001)) * 250);
  const symmetry = clamp((eyeSymmetry + noseDeviation + lipAlignment + jawSymmetry) / 4);
  const upper = distance(forehead, brow); const middle = distance(brow, nose); const lower = distance(nose, chin); const avgThird = (upper + middle + lower) / 3;
  const thirds = clamp(100 - ((Math.abs(upper - avgThird) + Math.abs(middle - avgThird) + Math.abs(lower - avgThird)) / Math.max(avgThird, .001)) * 60);
  const eyeSpacing = ratioScore(distance(leftEyeInner, rightEyeInner) / Math.max(eyeWidth, .001), 1, .65);
  const facialRatio = ratioScore(cheekWidth / Math.max(faceHeight, .001), .72, .30);
  const proportions = clamp((thirds + eyeSpacing + facialRatio) / 3);
  const lowerFace = ratioScore(lower / Math.max(faceHeight, .001), .34, .16);
  const jawDefinition = ratioScore(jawWidth / Math.max(cheekWidth, .001), .83, .28);
  const facialFullness = clamp(100 - jawDefinition + 18);
  const eyeOpenness = ratioScore((distance(point(landmarks, 159), point(landmarks, 145)) + distance(point(landmarks, 386), point(landmarks, 374))) / Math.max(eyeWidth + rightEyeWidth, .001), .23, .16);
  const canthalBalance = clamp(100 - Math.abs((leftEyeOuter.y - leftEyeInner.y) - (rightEyeOuter.y - rightEyeInner.y)) * 500);
  const reportConfidence = quality.confidence || 60;
  const metrics = {
    symmetry: metric(symmetry, reportConfidence, 'Compared paired eye, nose, lip, and jaw landmarks around the facial midline.', symmetry >= 80 ? 'Paired landmarks are closely balanced in this image.' : 'A mild left/right landmark difference is visible in this image.', ['facial symmetry', 'photo posture']),
    proportions: metric(proportions, reportConfidence, 'Compared facial thirds, eye spacing, and face width-to-height ratio to broad reference ranges.', thirds >= 75 ? 'Vertical facial thirds appear broadly balanced.' : 'Vertical facial thirds show a visible variance in this image.', ['hairstyle', 'glasses']),
    eyes: metric((eyeSymmetry + eyeOpenness + canthalBalance) / 3, reportConfidence, 'Measured eyelid opening, paired eye width, and eye-corner alignment from landmarks.', eyeOpenness < 65 ? 'Eye openness is less clear in this capture.' : 'Eye landmarks are clearly visible in this capture.', ['sleep', 'eye care']),
    jawChin: metric((jawDefinition + jawSymmetry + lowerFace) / 3, reportConfidence, 'Used jaw contour landmarks and lower-face proportions; this is an appearance estimate, not a structural diagnosis.', jawDefinition < 65 ? 'The jaw contour appears less distinct relative to cheek width in this image.' : 'The lower-face contour appears clearly defined in this image.', ['neck posture', 'fitness', 'grooming']),
    visibleFullness: metric(100 - facialFullness, Math.min(reportConfidence, 78), 'Estimated only visible cheek and jaw contour fullness from image geometry; it does not estimate body-fat percentage.', facialFullness > 65 ? 'Visible cheek fullness may soften jaw contour in this photo.' : 'Visible facial fullness does not substantially obscure the jaw contour.', ['nutrition', 'neck posture']),
    skin: metric(quality.signal ? clamp(72 - Math.abs(quality.signal.redBias) * 2) : 0, Math.min(reportConfidence, 58), 'Skin texture, acne, pores, and pigmentation cannot be reliably assessed from this landmark model and lighting-dependent image signal.', 'Skin observations are low confidence; use an evenly lit close-up for a better appearance check.', ['skincare']),
    hair: metric(0, 0, 'Hair density, hairline recession, and beard coverage require a dedicated hair/skin model and are not inferred from face landmarks.', 'Not assessed from this scan.', ['hairstyle', 'grooming'])
  };
  const recommendations = [];
  const add = (id, when, recommendation) => { if (when) recommendations.push({ id, ...recommendation }); };
  add('jaw-visibility', metrics.jawChin.score < 65 && facialFullness > 65, { category: 'fitness', observation: metrics.jawChin.observation, reasoning: 'Visible fullness can reduce the contrast of the mandibular contour in photos.', recommendation: 'Prioritize neck posture, regular movement, and sustainable healthy habits; avoid crash dieting.', expectedBenefit: 'May improve jaw and neck definition over time.', resourceTags: ['neck posture', 'nutrition', 'fitness'] });
  add('eye-recovery', metrics.eyes.score < 68, { category: 'sleep', observation: metrics.eyes.observation, reasoning: 'Lighting, sleep, and hydration can affect the under-eye appearance in photos.', recommendation: 'Use a consistent sleep routine and retake scans under even front lighting.', expectedBenefit: 'A clearer, more consistent eye-area appearance.', resourceTags: ['sleep', 'hydration'] });
  add('proportion-styling', metrics.proportions.score < 70, { category: 'hairstyle', observation: metrics.proportions.observation, reasoning: 'Styling can frame perceived vertical and horizontal facial balance without changing anatomy.', recommendation: 'Explore hairstyles and frames that add balance to the visible facial proportions.', expectedBenefit: 'A more intentional visual frame around the face.', resourceTags: ['hairstyle', 'glasses'] });
  add('skin-uncertain', metrics.skin.confidence < 70, { category: 'skincare', observation: metrics.skin.observation, reasoning: 'The available image signal is not reliable enough for a skin conclusion.', recommendation: 'Use a gentle basic routine and seek professional advice for persistent skin concerns.', expectedBenefit: 'Better consistency without treating an uncertain observation as a diagnosis.', resourceTags: ['skincare'] });
  if (!recommendations.length) recommendations.push({ id: 'maintain', category: 'grooming', observation: 'Core facial observations are within the report’s broad reference ranges.', reasoning: 'No single high-priority appearance signal was detected with sufficient confidence.', recommendation: 'Maintain your current grooming, sleep, and posture habits; track changes with consistent scans.', expectedBenefit: 'More reliable progress tracking over time.', resourceTags: ['grooming', 'sleep'] });
  const strengths = Object.entries(metrics).filter(([, value]) => value.score >= 78 && value.confidence >= 70).map(([key, value]) => ({ key, text: value.observation }));
  const improvementAreas = Object.entries(metrics).filter(([, value]) => value.score < 70 && value.confidence >= 70).map(([key, value]) => ({ key, text: value.observation }));
  return { version: 2, quality, metrics, recommendations, strengths, improvementAreas, topPriorities: recommendations.slice(0, 3), routine: recommendations.map(item => item.recommendation), resourceTags: [...new Set(recommendations.flatMap(item => item.resourceTags))], ethicsNotice: 'Appearance-focused, non-diagnostic guidance. This report does not assess health conditions, age, ethnicity, or attractiveness.' };
}

export function scoreSummary(report) {
  const m = report.metrics;
  const harmony = clamp((m.symmetry.score * .4) + (m.proportions.score * .4) + (m.jawChin.score * .2));
  return { facial_harmony_score: harmony, symmetry_score: m.symmetry.score, facial_proportion_score: m.proportions.score, improvement_potential_score: clamp(100 - harmony + 70, 70, 96), confidence_score: report.quality.confidence, features: Object.fromEntries(Object.entries(m).map(([key, value]) => [key, { score: value.score, confidence: value.confidence, reason: value.reason }])) };
}
