export const NARRATION_SCRIPTS = [
  {
    id: 'step0',
    text: 'Step 0: The Problem. Production logs show the agent selects get_customer when lookup_order is correct for ambiguous requests like I need help with my recent purchase. The solution is to add 4 to 6 boundary-contrast few-shot examples that explain why one tool was chosen over alternatives.',
    selector: '#step0',
    durationHint: 18,
  },
  {
    id: 'step1',
    text: 'Step 1: The Naive Approach. Adding 18 simple bulk examples creates token bloat with 2.5 times inflation. The agent achieves only 70 percent accuracy. Three out of ten requests require expensive coordinator intervention.',
    selector: '#step1',
    durationHint: 12,
  },
  {
    id: 'step2',
    text: 'Step 2: The Resilient Approach. Six targeted boundary-contrast examples with explicit why and why-not reasoning. The agent achieves 100 percent accuracy with zero coordinator interventions. Token usage drops by 55 percent.',
    selector: '#step2',
    durationHint: 14,
  },
  {
    id: 'step3',
    text: 'Step 3: Example Comparison. The naive approach gives the same reasoning for different utterances. The boundary-contrast approach explicitly rejects alternative tools, training the model at the decision boundary.',
    selector: '#step3',
    durationHint: 12,
  },
  {
    id: 'step4',
    text: 'Step 4: Metrics and Results. The boundary-contrast approach wins on every metric: 55 percent fewer tokens, 100 percent accuracy, zero interventions. Annual cost savings are significant at scale.',
    selector: '#step4',
    durationHint: 10,
  },
];
