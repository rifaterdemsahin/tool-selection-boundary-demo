import { ToolSelectionResult } from './domain.js';
import { calculateAccuracy } from './utils.js';

export class Coordinator {
  constructor(llm) {
    this.llm = llm;
    this.interventions = 0;
    this.results = [];
    this.errors = [];
  }

  async processRequest(request) {
    try {
      const selection = await this.llm.selectTool(request);
      const success = selection.tool === request.expectedTool;

      if (!success) {
        this.interventions++;
      }

      const result = new ToolSelectionResult(
        request.id,
        selection.tool,
        request.expectedTool,
        selection.tokensUsed,
        selection.reasoning,
        success
      );

      this.results.push(result);
      return result;
    } catch (err) {
      this.errors.push({ requestId: request.id, error: err.message });
      throw err;
    }
  }

  getStats() {
    const totalTokens = this.llm.totalTokensUsed;
    const avgTokens = this.results.length > 0
      ? Math.round(totalTokens / this.results.length)
      : 0;
    const accuracy = calculateAccuracy(this.results);
    const avgConfidence = this.results.length > 0
      ? this.results.reduce((sum, r) => {
          return sum + (r.success ? 0.85 : 0.45);
        }, 0) / this.results.length
      : 0;

    return {
      totalRequests: this.results.length,
      successful: this.results.filter(r => r.success).length,
      failed: this.results.filter(r => !r.success).length,
      accuracy,
      coordinatorInterventions: this.interventions,
      totalTokensUsed: totalTokens,
      averageTokensPerRequest: avgTokens,
      averageConfidence: avgConfidence,
      errorCount: this.errors.length,
    };
  }
}
