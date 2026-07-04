import { MockLLM } from './infrastructure.js';
import { BOUNDARY_FEW_SHOT_EXAMPLES } from './domain.js';

const RESILIENT_SYSTEM_PROMPT = `You are a customer support AI agent with access to various tools.
For each request:
1. Identify the PRIMARY ENTITY (order, customer, shipment, payment, inventory)
2. Evaluate which tool addresses the user's CORE INTENT
3. Consider why PLAUSIBLE ALTERNATIVES are less appropriate
4. Select the BEST tool with explicit reasoning

Use the boundary-contrast few-shot examples below to guide your decision logic.`;

export function createResilientLLM() {
  return new MockLLM(RESILIENT_SYSTEM_PROMPT, BOUNDARY_FEW_SHOT_EXAMPLES);
}
