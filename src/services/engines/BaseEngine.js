// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\BaseEngine.js

/**
 * Abstract Base Class for all Ascend Layered Intelligence System Engines.
 * Enforces standard interfaces, validation hooks, fallbacks, and telemetry.
 */
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
   * Initializes prerequisite datasets (e.g. loading JSON knowledge files).
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
   * Returns a copy of the telemetry state for logging.
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
      if (Array.isArray(output)) {
        this.telemetry.recsGenerated = output.length;
      } else if (output && typeof output === 'object') {
        // For non-array outputs, count key-value pairs or set to 1
        this.telemetry.recsGenerated = Object.keys(output).length;
      }
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
