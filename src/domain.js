export class Tool {
  constructor(name, description, parameters, category) {
    this.name = name;
    this.description = description;
    this.parameters = parameters;
    this.category = category;
  }
}

export class AgentRequest {
  constructor(id, utterance, expectedTool, contextWindow, ambiguityLevel) {
    this.id = id;
    this.utterance = utterance;
    this.expectedTool = expectedTool;
    this.contextWindow = contextWindow;
    this.ambiguityLevel = ambiguityLevel;
  }
}

export class ToolSelectionResult {
  constructor(requestId, selectedTool, expectedTool, tokensUsed, reasoning, success) {
    this.requestId = requestId;
    this.selectedTool = selectedTool;
    this.expectedTool = expectedTool;
    this.tokensUsed = tokensUsed;
    this.reasoning = reasoning;
    this.success = success;
    this.timestamp = Date.now();
  }
}

export class FewShotExample {
  constructor(utterance, correctTool, reasoning, plausibleAlternatives) {
    this.utterance = utterance;
    this.correctTool = correctTool;
    this.reasoning = reasoning;
    this.plausibleAlternatives = plausibleAlternatives;
  }
}

export const TOOLS = {
  LOOKUP_ORDER: new Tool(
    'lookup_order',
    'Retrieve order details by order ID or recent purchase context',
    { order_id: 'string (optional)', customer_context: 'string' },
    'order_management'
  ),
  GET_CUSTOMER: new Tool(
    'get_customer',
    'Retrieve customer profile, address, and account info by customer ID or email',
    { customer_id: 'string', email: 'string (optional)' },
    'customer_management'
  ),
  CANCEL_ORDER: new Tool(
    'cancel_order',
    'Cancel an existing order by order ID. Requires explicit user confirmation.',
    { order_id: 'string', reason: 'string' },
    'order_management'
  ),
  GET_INVENTORY: new Tool(
    'get_inventory',
    'Check current stock levels for a specific SKU or product category',
    { sku: 'string', category: 'string (optional)' },
    'inventory'
  ),
  PROCESS_REFUND: new Tool(
    'process_refund',
    'Initiate a refund for a completed order. Requires order ID and reason.',
    { order_id: 'string', amount: 'number', reason: 'string' },
    'payments'
  ),
  TRACK_SHIPMENT: new Tool(
    'track_shipment',
    'Track shipping status and delivery ETA for an order by order ID or tracking number',
    { order_id: 'string', tracking_number: 'string (optional)' },
    'shipping'
  ),
};

export const AMBIGUOUS_REQUESTS = [
  new AgentRequest('req-001', 'I need help with my recent purchase', 'lookup_order', 2048, 'high'),
  new AgentRequest('req-002', 'What did I order last time?', 'lookup_order', 1536, 'high'),
  new AgentRequest('req-003', 'Can you check my account for issues?', 'get_customer', 1024, 'medium'),
  new AgentRequest('req-004', 'Where is my package?', 'track_shipment', 512, 'medium'),
  new AgentRequest('req-005', 'I want to return something I bought', 'lookup_order', 2048, 'high'),
  new AgentRequest('req-006', 'Something is wrong with my recent order', 'lookup_order', 3072, 'high'),
  new AgentRequest('req-007', 'Can you help me with billing?', 'get_customer', 1024, 'medium'),
  new AgentRequest('req-008', 'My order never arrived', 'track_shipment', 512, 'low'),
  new AgentRequest('req-009', 'I need to change my shipping address', 'get_customer', 768, 'medium'),
  new AgentRequest('req-010', 'Show me what I bought', 'lookup_order', 1024, 'high'),
];

export const NAIVE_FEW_SHOT_EXAMPLES = [
  new FewShotExample('Show my orders', 'lookup_order', 'User wants to see orders', []),
  new FewShotExample('Get customer info', 'get_customer', 'User wants customer data', []),
  new FewShotExample('Track my package', 'track_shipment', 'User wants tracking info', []),
  new FewShotExample('Cancel my order', 'cancel_order', 'User wants to cancel', []),
  new FewShotExample('Process a refund', 'process_refund', 'User wants refund', []),
  new FewShotExample('Check my balance', 'get_customer', 'User wants balance info', []),
  new FewShotExample('View order history', 'lookup_order', 'User wants history', []),
  new FewShotExample('Update address', 'get_customer', 'User wants address update', []),
  new FewShotExample('Check shipping status', 'track_shipment', 'User wants shipping status', []),
  new FewShotExample('Change payment method', 'get_customer', 'User wants payment change', []),
  new FewShotExample('Report missing item', 'track_shipment', 'User wants to report missing', []),
  new FewShotExample('Apply discount code', 'lookup_order', 'User wants discount', []),
  new FewShotExample('View invoice', 'lookup_order', 'User wants invoice', []),
  new FewShotExample('Check return policy', 'process_refund', 'User wants return policy', []),
  new FewShotExample('Update email preferences', 'get_customer', 'User wants email update', []),
  new FewShotExample('Check gift card balance', 'get_customer', 'User wants gift card info', []),
  new FewShotExample('Schedule delivery', 'track_shipment', 'User wants delivery schedule', []),
  new FewShotExample('Request replacement', 'process_refund', 'User wants replacement', []),
];

export const BOUNDARY_FEW_SHOT_EXAMPLES = [
  new FewShotExample(
    'I need help with my recent purchase',
    'lookup_order',
    'The phrase "recent purchase" implies an order context. While "help" is vague, the primary entity is a purchase/order. GET_CUSTOMER is plausible but would only return profile data without order context. Start with LOOKUP_ORDER to identify the order first, then determine next steps.',
    ['get_customer']
  ),
  new FewShotExample(
    'What did I order last time?',
    'lookup_order',
    '"What did I order" explicitly references an order. GET_CUSTOMER would show account info but not order history. LOOKUP_ORDER provides order details including items, status, and date.',
    ['get_customer']
  ),
  new FewShotExample(
    'Something is wrong with my recent order',
    'lookup_order',
    'The user explicitly says "my recent order" — this is an order-level inquiry, not a customer profile issue. CANCEL_ORDER or PROCESS_REFUND are premature without first identifying the order via LOOKUP_ORDER.',
    ['cancel_order', 'process_refund', 'get_customer']
  ),
  new FewShotExample(
    'I want to return something I bought',
    'lookup_order',
    'To process a return, we first need to identify the purchase/order. PROCESS_REFUND cannot proceed without order context. LOOKUP_ORDER retrieves the order details needed to validate return eligibility.',
    ['process_refund', 'get_customer']
  ),
  new FewShotExample(
    'Can you check my account for issues?',
    'get_customer',
    '"Account" and "issues" together suggest profile/billing problems. LOOKUP_ORDER would show orders but not account status. GET_CUSTOMER retrieves account state, payment methods, and contact info needed to diagnose account issues.',
    ['lookup_order']
  ),
  new FewShotExample(
    'Where is my recent order?',
    'track_shipment',
    '"Where is" explicitly asks for location/status. LOOKUP_ORDER shows order details but not shipping progress. TRACK_SHIPMENT provides live tracking. Only use LOOKUP_ORDER first if we lack an order ID.',
    ['lookup_order']
  ),
];

export function getToolByName(name) {
  return Object.values(TOOLS).find(t => t.name === name);
}
