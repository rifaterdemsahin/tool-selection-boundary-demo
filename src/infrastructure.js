import { TOOLS } from './domain.js';

export class MockLLM {
  constructor(systemPrompt, fewShotExamples, options = {}) {
    this.systemPrompt = systemPrompt;
    this.fewShotExamples = fewShotExamples;
    this.totalTokensUsed = 0;
    this.callCount = 0;
    this.promptStyleFactor = options.promptStyleFactor || 1.0;
    this.redundantContextOverhead = options.redundantContextOverhead || 0;
  }

  estimateTokens(text) {
    return Math.ceil(text.length / 4);
  }

  buildPrompt(request) {
    let prompt = this.systemPrompt + '\n\n';
    prompt += 'Available tools:\n';
    for (const tool of Object.values(TOOLS)) {
      prompt += `  - ${tool.name}: ${tool.description}\n`;
    }

    if (this.redundantContextOverhead > 0) {
      prompt += '\n' + 'IMPORTANT: '.repeat(10) + 'Read all examples carefully before selecting.\n';
      prompt += 'Each example demonstrates a valid user-to-tool mapping.\n';
      prompt += 'The examples cover common scenarios. Study them.\n';
      prompt += 'Remember: the tool must match the user intent.\n';
      prompt += 'Always double-check your selection.\n';
      prompt += 'Do not guess — use the examples as reference.\n';
      prompt += 'If unsure, select the most common tool.\n';
      prompt += '\n';
    }

    prompt += '\nFew-shot examples:\n';
    for (const ex of this.fewShotExamples) {
      const altText = ex.plausibleAlternatives.length > 0
        ? ` (rejected alternatives: ${ex.plausibleAlternatives.join(', ')})`
        : '';
      prompt += `  User: "${ex.utterance}"\n  Reasoning: ${ex.reasoning}\n  Tool: ${ex.correctTool}${altText}\n\n`;
    }

    prompt += `\nUser request: "${request.utterance}"\n`;
    prompt += `Select the most appropriate tool from the list above.\n`;
    return prompt;
  }

  applyPromptStyleFactor(promptTokens) {
    return Math.round(promptTokens * this.promptStyleFactor);
  }

  async selectTool(request) {
    this.callCount++;
    const prompt = this.buildPrompt(request);
    const rawPromptTokens = this.estimateTokens(prompt);
    const adjustedPromptTokens = this.applyPromptStyleFactor(rawPromptTokens);
    const responseTokens = this.estimateTokens(JSON.stringify({ tool: request.expectedTool }));
    const totalTokens = adjustedPromptTokens + responseTokens;
    this.totalTokensUsed += totalTokens;

    const selectionAccuracy = this.simulateSelection(request);
    return {
      tool: selectionAccuracy.tool,
      reasoning: selectionAccuracy.reasoning,
      tokensUsed: totalTokens,
      promptTokens: adjustedPromptTokens,
      responseTokens,
      confidence: selectionAccuracy.confidence,
    };
  }

  simulateSelection(request) {
    const hasBoundaryReasoning = this.fewShotExamples.some(
      ex => ex.plausibleAlternatives && ex.plausibleAlternatives.length > 0
    );

    if (hasBoundaryReasoning) {
      return this.boundaryGuidedSelection(request);
    }
    return this.naiveSelection(request);
  }

  naiveSelection(request) {
    const confidence = request.ambiguityLevel === 'high' ? 0.35 + Math.random() * 0.25 : 0.6 + Math.random() * 0.25;
    const isCorrect = Math.random() < confidence;
    return {
      tool: isCorrect ? request.expectedTool : this.getPlausibleWrongTool(request),
      reasoning: isCorrect
        ? `Matched keyword "${request.utterance.split(' ').slice(0, 3).join(' ')}" to ${request.expectedTool}`
        : `Request mentions "${request.utterance.split(' ').slice(0, 3).join(' ')}"—selecting best match from examples`,
      confidence,
    };
  }

  boundaryGuidedSelection(request) {
    const confidence = request.ambiguityLevel === 'high' ? 0.80 + Math.random() * 0.18 : 0.92 + Math.random() * 0.07;
    const isCorrect = Math.random() < confidence;
    const plausibleWrong = this.getPlausibleWrongTool(request);
    return {
      tool: isCorrect ? request.expectedTool : plausibleWrong,
      reasoning: isCorrect
        ? `Primary entity is order/purchase context. ${plausibleWrong} rejected — it addresses a different concern. LOOKUP_ORDER correctly identifies the order first.`
        : `Overlapping cues detected. ${request.expectedTool} is related but ${plausibleWrong} better matches the action verb analysis.`,
      confidence,
    };
  }

  getPlausibleWrongTool(request) {
    const wrongOptions = Object.values(TOOLS)
      .filter(t => t.name !== request.expectedTool)
      .map(t => t.name);
    return wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
  }

  getStats() {
    return {
      totalTokensUsed: this.totalTokensUsed,
      callCount: this.callCount,
      averageTokensPerCall: this.callCount > 0 ? Math.round(this.totalTokensUsed / this.callCount) : 0,
    };
  }
}
