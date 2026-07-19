# Ascend Layered Intelligence System Specification

This document defines the architecture, data structures, and developer standards for the Ascend Intelligence Layer. It acts as the definitive system blueprint for the application's reasoning, planning, and recommendation pipeline.

---

## 1. Overall System Architecture & Data Flow

The Ascend Intelligence Layer separates user interface rendering from logic processing. All decisions, recommendations, timelines, and daily tasks are managed by a centralized cognitive stack.

### Pipeline Execution Flow

When a user interaction triggers a data refresh, the `pipelineManager` orchestrates the following execution pipeline:

```
[Profile, Photos, Logs, Feedback]  <-- Raw Inputs
               │
               ▼
      [environmentEngine]          <-- Climate, Season, Weather offsets
               │
               ▼
      [userContextEngine]          <-- Age, Budget, Goals, Lifestyle constraints
               │
               ▼
       [decisionEngine]            <-- Bottleneck Analysis & Urgency Steering
               │
               ▼
       [planningEngine]            <-- 30/60/90 Day Phase Mapping & Locks
               │
               ▼
     [specializedEngines]          <-- Domain Heuristics (Skincare, Fitness, etc.)
               │
               ▼
       [learningEngine]            <-- Compliance & Interaction History adjustments
               │
               ▼
      [confidenceEngine]           <-- Telemetry and data freshness weights
               │
               ▼
   [recommendationScoringEngine]   <-- Weighted scoring matrix calculation
               │
               ▼
     [recommendationMemory]        <-- Active vs. Habituated filters
               │
               ▼
     [recommendationEngine]        <-- Unified Recommendation Output
               │
               ▼
        [aiCoachEngine]            <-- Consistent explanations generator
```

---

## 2. Shared Engine Contracts & Interfaces

Every engine inside the `src/services/engines/` directory must subclass `BaseEngine`. This standardizes execution structures, input/output validation, error fallbacks, and execution metrics telemetry.

### Engine Base Contract (`BaseEngine.js`)

```javascript
export class BaseEngine {
  constructor(name) {
    if (this.constructor === BaseEngine) {
      throw new Error("BaseEngine is abstract and cannot be instantiated directly.");
    }
    
    this.name = name;
    this.telemetry = {
      engineName: name,
      executionTimeMs: 0,
      confidence: 1.0,
      dataSourcesUsed: [],
      recsGenerated: 0,
      error: null,
      fallbackUsed: false
    };
  }

  /**
   * Initializes any prerequisite datasets (e.g. loading JSON knowledge files).
   */
  async initialize() {
    return Promise.resolve();
  }

  /**
   * Validates inputs before running execution rules.
   * @param {Object} input - User and system input state.
   * @returns {{isValid: boolean, errors: string[]}}
   */
  validate(input) {
    return { isValid: true, errors: [] };
  }

  /**
   * Main logic execution.
   * @param {Object} input - Validated input state.
   * @returns {Promise<Object>} Processed output recommendations/observations.
   */
  async execute(input) {
    throw new Error(`Execute method not implemented in engine: ${this.name}`);
  }

  /**
   * Resets and returns the telemetry state for debugging and execution logging.
   */
  getTelemetry() {
    return { ...this.telemetry };
  }

  /**
   * Internal wrapper to track execution metrics and catch runtime errors.
   */
  async run(input) {
    const start = performance.now();
    this.telemetry.error = null;
    this.telemetry.fallbackUsed = false;

    try {
      const validation = this.validate(input);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }
      
      const output = await this.execute(input);
      this.telemetry.executionTimeMs = Math.round(performance.now() - start);
      return output;
    } catch (err) {
      this.telemetry.error = err.message;
      this.telemetry.fallbackUsed = true;
      this.telemetry.executionTimeMs = Math.round(performance.now() - start);
      return this.fallback(input, err);
    }
  }

  /**
   * Safe fallback behavior in the event of database/runtime errors.
   */
  fallback(input, error) {
    console.error(`[Engine Fallback] ${this.name} failed:`, error);
    return [];
  }
}
```

---

## 3. Specialized Engine Responsibilities

The execution stack is divided into distinct execution layers:

### Layer A: Context & Environment Prep
* **`environmentEngine.js`**
  - *Purpose*: Infers location-based variables.
  - *Inputs*: User profile location country/region.
  - *Outputs*: Season, Temperature profile, Humidity level.
* **`userContextEngine.js`**
  - *Purpose*: Standardizes user goals, gym/equipment access, age groups, and budget category (Low, Medium, High).
  - *Inputs*: User profile onboarding details.
  - *Outputs*: Standardized Context object.

### Layer B: Core Reasoning & Sequencing
* **`decisionEngine.js`**
  - *Purpose*: Scans user metrics to identify bottlenecks (e.g. hydration levels or sleep hours falling below safety thresholds) and adjusts priorities accordingly.
  - *Inputs*: Sleep logs, water logs, checklist completion ratios.
  - *Outputs*: Array of focus focus areas and steering constraints.
* **`planningEngine.js`**
  - *Purpose*: Sequences recommendations into actionable timeline blocks (30/60/90 days) based on category dependencies.
  - *Inputs*: Active focus area, days elapsed since onboarding.
  - *Outputs*: Current active phase and week goals.

### Layer C: Domain Specialists
* **`faceInsightEngine.js`**
  - *Purpose*: Analyzes facial geometry coordinates (facial thirds, eye balance, jaw angle, symmetry).
  - *Inputs*: MediaPipe face landmarker points.
  - *Outputs*: Detailed structural thirds and symmetry observations.
* **`skincareEngine.js`**
  - *Purpose*: Formulates ingredient-focused skincare routines matching skin type and local humidity conditions.
* **`hairEngine.js`**, **`beardEngine.js`**, **`glassesEngine.js`**
  - *Purpose*: Analyzes head proportions to suggest hair shapes, grooming tips, and frame parameters.
* **`fashionEngine.js`**
  - *Purpose*: Recommends wardrobe combinations and contrast-matched color palettes.
* **`nutritionEngine.js`**, **`sleepEngine.js`**, **`fitnessEngine.js`**, **`postureEngine.js`**
  - *Purpose*: Suggests daily nutrition, recovery, and stretching targets.
* **`routineEngine.js`**, **`roadmapEngine.js`**, **`missionEngine.js`**
  - *Purpose*: Dynamically builds the user's checklist routines, milestone tracks, and daily missions.
* **`weeklyReviewEngine.js`**, **`progressEngine.js`**
  - *Purpose*: Generates weekly insights and tracks streak accomplishments.
* **`productRecommendationEngine.js`**
  - *Purpose*: Maps user context to product offerings with reasoning.

### Layer D: Filtering & Memory
* **`learningEngine.js`**
  - *Purpose*: Adjusts recommendation scores based on user habit completion history (e.g., lowering priority of a habit the user is consistently completing).
* **`recommendationMemory.js`**
  - *Purpose*: Tracks shown/dismissed/completed recommendations to prevent repetition.
* **`recommendationFeedbackEngine.js`**
  - *Purpose*: Adjusts engine weights based on helpfulness ratings (e.g. thumbs up/down).

---

## 4. Standardized Recommendation Schema

To ensure consistency, every recommendation generated by any engine must conform to this schema:

```typescript
interface Recommendation {
  id: string;                      // Unique recommendation identifier
  category: string;                // e.g., 'skincare', 'fitness', 'posture'
  title: string;                   // Concise summary of the advice
  description: string;             // Short instructions on what to do
  reason: string;                  // Direct explanation ("Because your sleep is low...")
  priority: 'low' | 'medium' | 'high' | 'critical';
  impact: 1 | 2 | 3 | 4 | 5;       // Estimated transformation impact
  confidence: number;              // Percentage (0.0 to 1.0)
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;           // e.g., '10 mins', '5 mins daily'
  relatedHabits: string[];         // e.g., ['sleep_log', 'water_intake']
  relatedMetrics: string[];        // e.g., ['symmetry_score', 'sleep_current']
  roadmapStage: number;            // target week (1 to 4)
  supportingAnalysis: string;      // Supporting biometric observation
  recommendedProducts: string[];   // Linked product IDs from products.json
  completed: boolean;              // Completion status flag
  dismissed: boolean;              // Ignored status flag
  lastUpdated: string;             // ISO Date string
}
```

---

## 5. Recommendation Lifecycle

Recommendations follow a strict lifecycle to prevent static lists and ensure the application evolves along with the user:

```
[Created] ────> [Scored] ────> [Active Feed] ────> [Completed (Daily Logs)]
                                    │                     │
                                    ▼                     ▼
                               [Dismissed] ────> [Habituated (Maintained)]
                                                          │
                                                          ▼
                                                      [Archived]
```

1. **Created**: Generated by specialized engines using versioned knowledge templates.
2. **Scored**: Prioritized by the scoring engine based on goals and progress.
3. **Active Feed**: Rendered on the Dashboard checklist and category panels.
4. **Completed**: Checked off by logging water, sleep, or finishing routine tasks.
5. **Dismissed**: Marked by the user as "Not Relevant" or "Don't Show Again."
6. **Habituated**: Completed consistently for 10+ days. Moved out of the daily active feed and added to "Maintained Habits" memory.
7. **Archived**: Saved in historical analytics logs to preserve performance records.

---

## 6. Versioned Knowledge Base (`knowledge/v1/`)

Curated knowledge is stored as static JSON files in `src/services/knowledge/v1/` to separate domain data from logic:

```
src/services/knowledge/v1/
├── categories/
│   ├── skincare.json
│   ├── fitness.json
│   └── ... (domain parameters)
├── products/
│   └── products.json
├── routines/
│   ├── morning.json
│   └── night.json
├── research/
│   └── citations.json
└── rules/
    ├── priority.json
    └── difficulty.json
```

---

## 7. Developer Standards

1. **Single Responsibility**: Every engine must do exactly one thing (e.g. `skincareEngine` only generates skin tips; it does not write to the database or render UI).
2. **No Direct React Imports**: Engines must remain pure JavaScript modules. Never import React, hooks, or context directly inside engines.
3. **No UI Logic**: UI styling class names, icons, or component markups must never be returned by engines.
4. **State Immutability**: Engines must return new recommendation collections and never modify input states in-place.

---

## 8. Performance Strategy

* **In-Memory Cache**: All recommendations are stored in `recommendationCache.js` for the duration of the browser session.
* **Pipeline Refresh Triggers**: The pipeline is re-run only when key events alter user state:
  1. A new facial scan is completed.
  2. Sleep or hydration logs are updated.
  3. Routine tasks are toggled.
  4. Budget preferences or goals are changed in the Profile settings.
* **Lazy Module Initialization**: Engine files are imported on-demand to keep initial bundle load times low.

---

## 9. Future AI Provider Integration Strategy

To upgrade the rule-based system to an LLM provider (Gemini, Claude, or OpenAI) in the future, the UI remains unchanged. Only the engine implementation shifts from rule parsing to prompt compilation:

```javascript
// Example of future LLM engine implementation:
import { callGeminiAPI } from '../aiProvider';
import skincareKnowledge from '../knowledge/v1/categories/skincare.json';

export class AICoachEngine extends BaseEngine {
  async execute(input) {
    const prompt = this.compilePrompt(input, skincareKnowledge);
    const response = await callGeminiAPI(prompt);
    return this.parseStructuredOutput(response);
  }
}
```

The application's interfaces remain identical, keeping the upgrade clean and risk-free.
