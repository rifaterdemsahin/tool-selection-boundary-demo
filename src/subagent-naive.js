import { MockLLM } from './infrastructure.js';
import { NAIVE_FEW_SHOT_EXAMPLES } from './domain.js';

const NAIVE_SYSTEM_PROMPT = `You are a customer support AI agent.
Available tools are listed below with descriptions.
Study the examples carefully before responding.`;

export function createNaiveLLM() {
  return new MockLLM(NAIVE_SYSTEM_PROMPT, NAIVE_FEW_SHOT_EXAMPLES, {
    promptStyleFactor: 2.5,
    redundantContextOverhead: 300,
  });
}
