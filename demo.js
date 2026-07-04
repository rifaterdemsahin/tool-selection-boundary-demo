#!/usr/bin/env node

import { AMBIGUOUS_REQUESTS } from './src/domain.js';
import { createNaiveLLM } from './src/subagent-naive.js';
import { createResilientLLM } from './src/subagent-resilient.js';
import { Coordinator } from './src/coordinator.js';
import {
  formatTokens,
  formatPercentage,
  calculateSavings,
  generateComparisonBar,
  padRight,
} from './src/utils.js';

const DIVIDER = '═'.repeat(78);
const HEADER_DIVIDER = '━'.repeat(78);

function printBanner() {
  console.log(`
${HEADER_DIVIDER}
  ⚡ Tool Selection Boundary-Contrast Demo ⚡
  🤖 Built with DeepSeek V4 Flash
  📋 Claude AI Architect Exam — Few-Shot Tool Selection
${HEADER_DIVIDER}
  📝 Question: Production logs show the agent sometimes selects
  get_customer when lookup_order would be more appropriate for
  ambiguous requests. How do you fix tool selection?

  💡 Answer: Add 4-6 boundary-contrast few-shot examples that
  explicitly explain WHY one tool was chosen over alternatives.
${HEADER_DIVIDER}
`);
}

function printInputTokenScoreboard(naiveStats, resilientStats) {
  const savings = calculateSavings(naiveStats.totalTokensUsed, resilientStats.totalTokensUsed);
  const maxTokens = Math.max(naiveStats.totalTokensUsed, resilientStats.totalTokensUsed, 1);

  console.log(`\n${'═'.repeat(78)}`);
  console.log('  📊 INPUT TOKEN STATS & EFFICIENCY SCOREBOARD');
  console.log(`${'═'.repeat(78)}`);
  console.log(`  ${padRight('Metric', 42)} ${padRight('❌ Naive', 16)} ${padRight('✅ Resilient', 16)}`);
  console.log(`  ${'─'.repeat(78)}`);
  console.log(`  ${padRight('Total Input Tokens Consumed', 42)} ${padRight(formatTokens(naiveStats.totalTokensUsed), 16)} ${padRight(formatTokens(resilientStats.totalTokensUsed), 16)}`);
  console.log(`  ${padRight('Avg Tokens Per Request', 42)} ${padRight(String(naiveStats.averageTokensPerRequest), 16)} ${padRight(String(resilientStats.averageTokensPerRequest), 16)}`);
  console.log(`  ${padRight('Few-Shot Examples in Prompt', 42)} ${padRight('18 (bulk)', 16)} ${padRight('6 (targeted)', 16)}`);
  console.log(`  ${padRight('Examples with Boundary Reasoning', 42)} ${padRight('0', 16)} ${padRight('6', 16)}`);
  console.log(`  ${padRight('Token Bloat Factor (redundant context)', 42)} ${padRight('2.5x', 16)} ${padRight('1.0x', 16)}`);
  console.log(`  ${'─'.repeat(78)}`);
  console.log(`  💰 Token Savings: ${formatTokens(Math.abs(savings.saved))} fewer tokens (${Math.abs(savings.percentage)}% less with targeted)`);
  console.log(`  📉 Per-request efficiency: ${resilientStats.averageTokensPerRequest > 0 ? ((1 - naiveStats.averageTokensPerRequest / resilientStats.averageTokensPerRequest) * 100).toFixed(1) : '0.0'}% fewer tokens per call`);
  console.log(`\n  Bar comparison (tokens per request):`);
  console.log(generateComparisonBar(naiveStats.averageTokensPerRequest, resilientStats.averageTokensPerRequest, Math.max(naiveStats.averageTokensPerRequest, resilientStats.averageTokensPerRequest) * 1.2));
  console.log(`${'═'.repeat(78)}`);
}

function printPerformanceScoreboard(naiveStats, resilientStats) {
  const maxAccuracy = Math.max(naiveStats.accuracy, resilientStats.accuracy, 0.1);

  console.log(`\n${'═'.repeat(78)}`);
  console.log('  📈 PERFORMANCE METRICS COMPARISON');
  console.log(`${'═'.repeat(78)}`);
  console.log(`  ${padRight('Metric', 42)} ${padRight('❌ Naive', 16)} ${padRight('✅ Resilient', 16)}`);
  console.log(`  ${'─'.repeat(78)}`);
  console.log(`  ${padRight('Total Requests Processed', 42)} ${padRight(String(naiveStats.totalRequests), 16)} ${padRight(String(resilientStats.totalRequests), 16)}`);
  console.log(`  ${padRight('Successful Selections', 42)} ${padRight(String(naiveStats.successful), 16)} ${padRight(String(resilientStats.successful), 16)}`);
  console.log(`  ${padRight('Failed Selections', 42)} ${padRight(String(naiveStats.failed), 16)} ${padRight(String(resilientStats.failed), 16)}`);
  console.log(`  ${padRight('Tool Selection Accuracy', 42)} ${padRight(formatPercentage(naiveStats.accuracy), 16)} ${padRight(formatPercentage(resilientStats.accuracy), 16)}`);
  console.log(`  ${padRight('Avg Confidence Score', 42)} ${padRight(formatPercentage(naiveStats.averageConfidence), 16)} ${padRight(formatPercentage(resilientStats.averageConfidence), 16)}`);
  console.log(`  ${padRight('Coordinator Interventions', 42)} ${padRight(String(naiveStats.coordinatorInterventions), 16)} ${padRight(String(resilientStats.coordinatorInterventions), 16)}`);
  console.log(`  ${'─'.repeat(78)}`);

  console.log(`\n  📊 Accuracy Bar:`);
  console.log(generateComparisonBar(naiveStats.accuracy, resilientStats.accuracy, 1.0));
  console.log(`\n  🛡️  Coordinator Interventions Bar:`);
  console.log(generateComparisonBar(naiveStats.coordinatorInterventions, resilientStats.coordinatorInterventions, Math.max(naiveStats.coordinatorInterventions, resilientStats.coordinatorInterventions, 1), 20, '█', '░'));
  console.log(`\n  💰 Token Efficiency Bar:`);
  console.log(generateComparisonBar(naiveStats.averageTokensPerRequest, resilientStats.averageTokensPerRequest, Math.max(naiveStats.averageTokensPerRequest, resilientStats.averageTokensPerRequest, 1) * 1.2));
}

function printDetailedResults(naiveResults, resilientResults) {
  console.log(`\n${'═'.repeat(78)}`);
  console.log('  📋 DETAILED REQUEST-BY-REQUEST RESULTS');
  console.log(`${'═'.repeat(78)}`);

  for (let i = 0; i < naiveResults.length; i++) {
    const n = naiveResults[i];
    const r = resilientResults[i];
    const nIcon = n.success ? '✅' : '❌';
    const rIcon = r.success ? '✅' : '❌';

    console.log(`\n  Request #${i + 1}: "${n.requestId}"`);
    console.log(`  ${'─'.repeat(60)}`);
    console.log(`  ${nIcon} Naive:     selected "${n.selectedTool}" (expected "${n.expectedTool}") — ${n.success ? 'CORRECT' : 'WRONG'}`);
    console.log(`     Tokens: ${n.tokensUsed} | Reasoning: ${n.reasoning}`);
    console.log(`  ${rIcon} Resilient: selected "${r.selectedTool}" (expected "${r.expectedTool}") — ${r.success ? 'CORRECT' : 'WRONG'}`);
    console.log(`     Tokens: ${r.tokensUsed} | Reasoning: ${r.reasoning}`);
  }
}

async function runScenario(requests, scenarioName, createLLM) {
  console.log(`\n${DIVIDER}`);
  console.log(`  🔄 Running Scenario: ${scenarioName}`);
  console.log(`  ${'─'.repeat(50)}`);

  const llm = createLLM();
  const coordinator = new Coordinator(llm);

  for (const request of requests) {
    const result = await coordinator.processRequest(request);
    const icon = result.success ? '  ✅' : '  ❌';
    console.log(`${icon} [${result.requestId}] selected "${result.selectedTool}" → expected "${result.expectedTool}" (${result.tokensUsed} tokens)`);
  }

  return coordinator;
}

async function main() {
  const args = process.argv.slice(2);
  const runNaive = args.length === 0 || args.includes('--naive') || args.includes('--benchmark');
  const runResilient = args.length === 0 || args.includes('--resilient') || args.includes('--benchmark');

  printBanner();

  let naiveCoordinator = null;
  let resilientCoordinator = null;

  if (runNaive) {
    console.log(`\n  🚀 Launching Naive Approach (simple examples, no boundary reasoning)...`);
    naiveCoordinator = await runScenario(AMBIGUOUS_REQUESTS, '❌ NAIVE APPROACH', createNaiveLLM);
  }

  if (runResilient) {
    console.log(`\n  🚀 Launching Resilient Approach (boundary-contrast examples)...`);
    resilientCoordinator = await runScenario(AMBIGUOUS_REQUESTS, '✅ RESILIENT APPROACH', createResilientLLM);
  }

  if (naiveCoordinator && resilientCoordinator) {
    const naiveStats = naiveCoordinator.getStats();
    const resilientStats = resilientCoordinator.getStats();

    printPerformanceScoreboard(naiveStats, resilientStats);
    printInputTokenScoreboard(naiveStats, resilientStats);
    printDetailedResults(naiveCoordinator.results, resilientCoordinator.results);

    const savings = calculateSavings(naiveStats.totalTokensUsed, resilientStats.totalTokensUsed);

    const effectiveSavings = naiveStats.totalTokensUsed - resilientStats.totalTokensUsed;
    const effectiveSavingsPct = naiveStats.totalTokensUsed > 0
      ? ((effectiveSavings / naiveStats.totalTokensUsed) * 100).toFixed(1)
      : '0.0';

    console.log(`\n${'═'.repeat(78)}`);
    console.log('  🏆 VERDICT');
    console.log(`${'═'.repeat(78)}`);
    console.log(`  📌 Boundary-contrast few-shot examples improve tool selection`);
    console.log(`     accuracy from ${formatPercentage(naiveStats.accuracy)} to ${formatPercentage(resilientStats.accuracy)}`);
    console.log(`  📌 Coordinator interventions reduced from ${naiveStats.coordinatorInterventions} to ${resilientStats.coordinatorInterventions}`);
    console.log(`  📌 Input tokens reduced from ${formatTokens(naiveStats.totalTokensUsed)} to ${formatTokens(resilientStats.totalTokensUsed)}`);
    console.log(`     (${effectiveSavingsPct}% savings — ${formatTokens(effectiveSavings)} fewer tokens)`);
    console.log(`  📌 Recommendation: Use 4-6 boundary-contrast examples targeting`);
    console.log(`     ambiguous scenarios with explicit WHY/WHY-NOT reasoning.`);
    console.log(`${'═'.repeat(78)}`);
    console.log(`\n  ⚡ Built with DeepSeek V4 Flash — 1M Token Context Window\n`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
