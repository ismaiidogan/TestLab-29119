// ============================================================
// TestLab 29119 — Game Data
// All techniques, questions, scenarios, and misconception traps
// ============================================================

const TECHNIQUES = {
  specificationBased: {
    id: 'specification-based',
    label: 'Specification-Based',
    color: '#00b4d8',
    description: 'Derived from requirements & functional specifications',
    techniques: [
      { id: 'ep',  name: 'Equivalence Partitioning',   abbr: 'EP',    isoClause: 'Clause 5.4', desc: 'Divides input domain into equivalence classes where each member is expected to be treated the same.', bestFor: 'Input validation, login forms, numeric ranges', pairsWith: 'BVA' },
      { id: 'bva', name: 'Boundary Value Analysis',     abbr: 'BVA',   isoClause: 'Clause 5.5', desc: 'Tests at the boundaries of equivalence partitions where defects are most likely.', bestFor: 'Numeric boundaries — e.g. 4, 5, 20, 21 for a 5–20 char field', pairsWith: 'EP' },
      { id: 'dt',  name: 'Decision Table Testing',      abbr: 'DT',    isoClause: 'Clause 5.7', desc: 'Uses a table of input combinations and expected outputs to derive test cases.', bestFor: 'Business rules with multiple independent conditions', pairsWith: 'ST' },
      { id: 'st',  name: 'State Transition Testing',    abbr: 'ST',    isoClause: 'Clause 5.8', desc: 'Tests sequences of events that cause state changes in the system.', bestFor: 'Order flows, account states, any system with identifiable states & transitions', pairsWith: 'DT' },
      { id: 'uct', name: 'Use Case Testing',            abbr: 'UCT',   isoClause: 'Clause 5.9', desc: 'Derives test cases from use case scenarios describing user-system interactions.', bestFor: 'End-to-end user journey verification', pairsWith: 'ET' },
      { id: 'cet', name: 'Classification Tree Method',  abbr: 'CTM',   isoClause: 'Clause 5.6', desc: 'Systematically identifies test-relevant aspects and their values using a tree structure.', bestFor: 'Complex configuration & parameter-space coverage', pairsWith: 'PW' },
      { id: 'pw',  name: 'Pairwise Testing',            abbr: 'PW',    isoClause: 'Clause 5.3', desc: 'Tests all possible pairs of input parameter combinations to reduce test cases.', bestFor: 'Configuration testing, multi-parameter systems', pairsWith: 'CTM' }
    ]
  },
  structureBased: {
    id: 'structure-based',
    label: 'Structure-Based',
    color: '#06d6a0',
    description: 'Based on internal code or system architecture',
    techniques: [
      { id: 'sc',   name: 'Statement Coverage', abbr: 'SC',    isoClause: 'Clause 6.2', desc: 'Ensures every executable statement in the code is executed at least once.', bestFor: 'Basic code quality, unit testing foundations', pairsWith: 'BC' },
      { id: 'bc',   name: 'Branch Coverage',    abbr: 'BC',    isoClause: 'Clause 6.3', desc: 'Ensures every branch (decision outcome) in the code is executed at least once.', bestFor: 'Decision logic, if/else verification', pairsWith: 'SC' },
      { id: 'pc',   name: 'Path Coverage',      abbr: 'PC',    isoClause: 'Clause 6.4', desc: 'Ensures every possible execution path through the code is tested.', bestFor: 'Critical systems requiring exhaustive path verification', pairsWith: 'MCDC' },
      { id: 'mcdc', name: 'MC/DC Coverage',     abbr: 'MC/DC', isoClause: 'Clause 6.5', desc: 'Modified Condition/Decision Coverage — each condition independently affects the decision outcome.', bestFor: 'Safety-critical systems (aviation DO-178C, medical devices)', pairsWith: 'BC' }
    ]
  },
  experienceBased: {
    id: 'experience-based',
    label: 'Experience-Based',
    color: '#ff6b6b',
    description: 'Leverages tester expertise, intuition & domain knowledge',
    techniques: [
      { id: 'eg',  name: 'Error Guessing',         abbr: 'EG',  isoClause: 'Clause 7.2', desc: 'Uses tester experience to anticipate where defects are likely to occur.', bestFor: 'Areas with historical defect clusters, payment flows, edge cases', pairsWith: 'ET' },
      { id: 'cbt', name: 'Checklist-Based Testing', abbr: 'CBT', isoClause: 'Clause 7.4', desc: 'Tests against a predefined list of items derived from experience and standards.', bestFor: 'Regression testing, compliance & standards verification', pairsWith: 'EG' },
      { id: 'et',  name: 'Exploratory Testing',     abbr: 'ET',  isoClause: 'Clause 7.3', desc: 'Simultaneous learning, test design, and test execution guided by a test charter.', bestFor: 'Undocumented legacy systems, new features, time-constrained testing', pairsWith: 'EG' },
      { id: 'aht', name: 'Ad Hoc Testing',          abbr: 'AHT', isoClause: 'Clause 7.5', desc: 'Informal testing without predefined test cases, relying purely on tester intuition.', bestFor: 'Quick smoke tests, rapid sanity checks', pairsWith: 'ET' }
    ]
  }
};

// ============================================================
// PHASE 1: Classification Challenge — Drag & Drop Data
// ============================================================

const PHASE1_CARDS = [
  // Specification-Based
  { id: 'ep', name: 'Equivalence Partitioning', category: 'specification-based', hint: 'Input domain → equivalent classes' },
  { id: 'bva', name: 'Boundary Value Analysis', category: 'specification-based', hint: 'Tests boundaries of partitions' },
  { id: 'dt', name: 'Decision Table Testing', category: 'specification-based', hint: 'Combinations of inputs → outputs' },
  { id: 'st', name: 'State Transition Testing', category: 'specification-based', hint: 'Events cause state changes' },
  { id: 'uct', name: 'Use Case Testing', category: 'specification-based', hint: 'User-system interaction scenarios' },
  { id: 'pw', name: 'Pairwise Testing', category: 'specification-based', hint: 'All pairs of input combinations' },
  { id: 'cet', name: 'Classification Tree Method', category: 'specification-based', hint: 'Tree structure for parameter-space coverage' },
  // Structure-Based
  { id: 'sc', name: 'Statement Coverage', category: 'structure-based', hint: 'Execute every code statement' },
  { id: 'bc', name: 'Branch Coverage', category: 'structure-based', hint: 'Execute every decision branch' },
  { id: 'pc', name: 'Path Coverage', category: 'structure-based', hint: 'Test every execution path' },
  { id: 'mcdc', name: 'MC/DC Coverage', category: 'structure-based', hint: 'Each condition independently affects decision' },
  // Experience-Based
  { id: 'eg', name: 'Error Guessing', category: 'experience-based', hint: 'Anticipate likely defect locations' },
  { id: 'cbt', name: 'Checklist-Based Testing', category: 'experience-based', hint: 'Test against predefined experience list' },
  { id: 'et', name: 'Exploratory Testing', category: 'experience-based', hint: 'Simultaneous learning & testing' },
  { id: 'aht', name: 'Ad Hoc Testing', category: 'experience-based', hint: 'Informal, intuition-based testing' }
];

// ============================================================
// PHASE 2: Apply — Scenario-Based Questions
// ============================================================

const PHASE2_SCENARIOS = [
  {
    id: 'scenario1',
    title: 'Login Form Validation',
    isoQuality: { label: 'Functional Suitability', sub: 'Functional Correctness', icon: '🎯', color: '#00b4d8' },
    isoClause: 'Clauses 5.4 & 5.5',
    description: 'You are testing a login form that accepts a username (5-20 characters) and password (8-30 characters). The system should reject inputs outside these ranges and accept valid ones.',
    image: '🔐',
    question: 'Which TWO techniques should you apply together for maximum effectiveness?',
    options: [
      { id: 'a', text: 'Equivalence Partitioning + Boundary Value Analysis', correct: true },
      { id: 'b', text: 'Statement Coverage + Branch Coverage', correct: false },
      { id: 'c', text: 'Error Guessing + Ad Hoc Testing', correct: false },
      { id: 'd', text: 'Path Coverage + MC/DC Coverage', correct: false }
    ],
    correctFeedback: '✅ Excellent! EP divides the input domain into valid/invalid partitions (e.g., <5, 5-20, >20 chars). BVA then focuses on boundaries (4, 5, 20, 21 chars). They are designed to work TOGETHER — EP ensures domain coverage, BVA catches boundary defects.',
    wrongFeedback: '❌ Think about it: you have input ranges with clear boundaries. Which techniques are specifically designed for input domain analysis?',
    misconception: 'EP and BVA are NOT mutually exclusive — they are complementary techniques designed to be used together.',
    points: 20
  },
  {
    id: 'scenario2',
    title: 'E-Commerce Order Flow',
    isoQuality: { label: 'Reliability', sub: 'Fault Tolerance', icon: '🛡️', color: '#06d6a0' },
    isoClause: 'Clause 5.8',
    description: 'An online store has the following order lifecycle: Pending → Confirmed → Processing → Shipped → Delivered. Orders can also be Cancelled from Pending or Confirmed states. A Delivered order can become Returned.',
    image: '🛒',
    question: 'Which technique is MOST appropriate to test this system?',
    options: [
      { id: 'a', text: 'Equivalence Partitioning', correct: false },
      { id: 'b', text: 'State Transition Testing', correct: true },
      { id: 'c', text: 'Statement Coverage', correct: false },
      { id: 'd', text: 'Checklist-Based Testing', correct: false }
    ],
    correctFeedback: '✅ Correct! State Transition Testing applies here even though this is NOT a formal finite state machine. Many business processes (orders, accounts, workflows) exhibit state behavior with transitions triggered by events.',
    wrongFeedback: '❌ Look at the system description — it describes states and transitions between them. Which technique specifically targets this?',
    misconception: 'State Transition Testing is NOT limited to formal FSMs — it applies to any system with identifiable states and transitions, including business workflows.',
    points: 20
  },
  {
    id: 'scenario3',
    title: 'Insurance Discount Calculator',
    isoQuality: { label: 'Functional Suitability', sub: 'Functional Appropriateness', icon: '🎯', color: '#00b4d8' },
    isoClause: 'Clause 5.7',
    description: 'An insurance system calculates discounts based on: Age (≤25 / >25), Driving History (Clean / Accident), Car Type (Economy / Luxury). Each combination produces a different discount percentage.',
    image: '🚗',
    question: 'Which technique best handles this multi-condition logic?',
    options: [
      { id: 'a', text: 'Decision Table Testing', correct: true },
      { id: 'b', text: 'Boundary Value Analysis', correct: false },
      { id: 'c', text: 'Path Coverage', correct: false },
      { id: 'd', text: 'Exploratory Testing', correct: false }
    ],
    correctFeedback: '✅ Correct! Decision Table Testing systematically enumerates all combinations of conditions (2×2×2 = 8 rules) and their expected actions. This ensures complete coverage of the business logic.',
    wrongFeedback: '❌ Consider: you have multiple input conditions with distinct combinations leading to different outputs. Which technique creates a systematic matrix of all combinations?',
    misconception: 'Decision Table Testing, not Boundary Value Analysis, is the right tool for multi-condition business logic. BVA targets numeric boundaries; DT systematically covers all condition combinations.',
    points: 20
  },
  {
    id: 'scenario4',
    title: 'Code Coverage Trap',
    isoQuality: { label: 'Maintainability', sub: 'Testability', icon: '🔧', color: '#f59e0b' },
    isoClause: 'Clause 6.3',
    description: 'Your team achieved 100% branch coverage on a calculator module. The manager says: "We have 100% coverage, so the module is fully tested and we can ship." Do you agree?',
    image: '📊',
    question: 'What is the CORRECT interpretation of 100% branch coverage?',
    options: [
      { id: 'a', text: 'The module is fully tested — all defects have been found', correct: false },
      { id: 'b', text: 'Every branch has been executed, but functional defects may still exist', correct: true },
      { id: 'c', text: 'Branch coverage is meaningless — only path coverage matters', correct: false },
      { id: 'd', text: '100% coverage means we tested all possible input combinations', correct: false }
    ],
    correctFeedback: '✅ Correct! Coverage is a test design HEURISTIC and completeness criterion, NOT a quality measure. 100% branch coverage means every decision branch was executed, but tests may have used trivial assertions that miss actual functional defects.',
    wrongFeedback: '❌ Be careful! ISO/IEC 29119-4 clarifies that coverage metrics measure test design completeness, not test quality or defect detection capability.',
    misconception: '100% coverage ≠ quality. Coverage is a design heuristic, not a guarantee that all functional defects are detected.',
    points: 25
  },
  {
    id: 'scenario5',
    title: 'Legacy Banking System',
    isoQuality: { label: 'Security', sub: 'Confidentiality & Integrity', icon: '🔒', color: '#e040fb' },
    isoClause: 'Clause 7.2 & 7.3',
    description: 'You are testing a 15-year-old banking transaction system. There is limited documentation, the original developers have left, and the system has many undocumented edge cases. Time is limited.',
    image: '🏦',
    question: 'Which technique category is MOST valuable as a starting point?',
    options: [
      { id: 'a', text: 'Structure-Based — analyze the code for coverage', correct: false },
      { id: 'b', text: 'Specification-Based — use the requirements document', correct: false },
      { id: 'c', text: 'Experience-Based — leverage domain expertise', correct: true },
      { id: 'd', text: 'All three equally — technique selection doesn\'t depend on context', correct: false }
    ],
    correctFeedback: '✅ Correct! With limited documentation and time, Experience-Based techniques (Exploratory Testing, Error Guessing) are the most effective starting point. Experienced testers can quickly identify high-risk areas based on domain knowledge.',
    wrongFeedback: '❌ Consider the constraints: limited documentation (hard to use specification-based), limited time, undocumented edge cases. Which approach thrives in uncertain conditions?',
    misconception: 'Technique selection depends on context — documentation availability, time, team expertise all influence the choice.',
    points: 20
  },
  {
    id: 'scenario6',
    title: 'Technique Categories Quiz',
    isoQuality: { label: 'Functional Suitability', sub: 'Functional Completeness', icon: '📚', color: '#00b4d8' },
    isoClause: 'Clause 4 (Selection Criteria)',
    description: 'A junior tester says: "Specification-based testing is the same as black-box testing, and structure-based testing is the same as white-box testing. It\'s simply about whether you can see the code or not."',
    image: '🎓',
    question: 'What is WRONG with this statement?',
    options: [
      { id: 'a', text: 'Nothing — this is the standard definition', correct: false },
      { id: 'b', text: 'The categorization is based on the SOURCE of test design knowledge, not code access', correct: true },
      { id: 'c', text: 'Black-box and white-box are outdated terms that ISO doesn\'t use', correct: false },
      { id: 'd', text: 'Structure-based techniques don\'t require code access', correct: false }
    ],
    correctFeedback: '✅ Correct! ISO/IEC 29119-4 categorizes techniques by their KNOWLEDGE SOURCE: specification-based uses requirements, structure-based uses code/architecture, experience-based uses tester expertise. This is NOT a simple binary about code visibility — experience-based techniques exist outside that dichotomy entirely.',
    wrongFeedback: '❌ Think deeper: the standard defines THREE categories, not two. The categorization is about where test design knowledge comes from.',
    misconception: 'Spec ≠ Black-Box, Structure ≠ White-Box. The categorization is based on the SOURCE of test design knowledge (requirements / code / experience).',
    points: 25
  }
,{
  id: 'compare1',
  comparisonMode: true,
  comparison: {
    left:  { name: 'Equivalence Partitioning', key: 'Tests ONE representative value per equivalence class' },
    right: { name: 'Boundary Value Analysis',  key: 'Tests EDGE values of each class — catches off-by-one defects' }
  },
  title: 'EP vs BVA — What\'s the Difference?',
  isoQuality: { label: 'Functional Suitability', sub: 'Functional Correctness', icon: '🎯', color: '#00b4d8' },
  isoClause: 'Clauses 5.4 & 5.5',
  description: 'A username field accepts 5–20 characters. Your team lead says "EP is enough — we already have three partitions covered." A colleague disagrees. Who is right?',
  image: '⚖️',
  question: 'What does BVA add that EP alone misses?',
  options: [
    { id: 'a', text: 'Nothing — EP already covers boundaries since boundaries are part of partitions', correct: false },
    { id: 'b', text: 'BVA tests values 4, 5, 20, 21 chars — catching off-by-one defects EP would miss', correct: true },
    { id: 'c', text: 'BVA replaces EP entirely — you only need one of them', correct: false },
    { id: 'd', text: 'BVA is only needed for security testing', correct: false }
  ],
  correctFeedback: '✅ Exactly! EP selects ONE representative per partition (e.g. 10 chars for the valid class). BVA then specifically targets the risky edges: 4 (just below min), 5 (min valid), 20 (max valid), 21 (just above max). Together they give complete coverage.',
  wrongFeedback: '❌ Developers often code > instead of >=, causing off-by-one bugs. Only testing at the exact boundary value catches this — which is precisely what BVA adds.',
  misconception: 'EP identifies partitions; BVA tests their boundaries. They are complementary — not alternatives.',
  points: 20
},{
  id: 'compare2',
  comparisonMode: true,
  comparison: {
    left:  { name: 'Exploratory Testing', key: 'Structured: charter + time-box + documented findings' },
    right: { name: 'Ad Hoc Testing',      key: 'Unstructured: pure intuition, no plan, no documentation' }
  },
  title: 'Exploratory Testing vs Ad Hoc Testing',
  isoQuality: { label: 'Reliability', sub: 'Fault Tolerance', icon: '🛡️', color: '#06d6a0' },
  isoClause: 'Clauses 7.3 & 7.5',
  description: 'You have exactly 2 hours to test a new payment feature before tomorrow\'s release. Documentation is minimal. A junior tester says "let\'s just test whatever feels risky." You suggest Exploratory Testing instead.',
  image: '🧭',
  question: 'Why is Exploratory Testing preferable to Ad Hoc Testing here?',
  options: [
    { id: 'a', text: 'Ad Hoc is faster — no charter writing needed', correct: false },
    { id: 'b', text: 'ET structures the session with a charter and documents findings the team can act on', correct: true },
    { id: 'c', text: 'They are identical — both rely on tester intuition', correct: false },
    { id: 'd', text: 'Neither is appropriate — only spec-based testing should be used', correct: false }
  ],
  correctFeedback: '✅ Correct! ET uses a charter (e.g. "Explore payment failure and edge-case scenarios, 2 hours"). This structures the intuition, time-boxes the session, and produces shareable observations — giving the team something to act on.',
  wrongFeedback: '❌ ET and AHT both leverage expertise, but ET adds structure: a charter defines scope, time-boxing prevents scope creep, and notes create a reusable artifact.',
  misconception: 'ET ≠ Ad Hoc. Exploratory Testing is disciplined and produces documented observations; Ad Hoc is entirely informal with no reusable output.',
  points: 20
},{
  id: 'compare3',
  comparisonMode: true,
  comparison: {
    left:  { name: 'Statement Coverage', key: 'Every LINE executed at least once. Weaker criterion.' },
    right: { name: 'Branch Coverage',    key: 'Every IF/ELSE outcome executed. Strictly STRONGER than SC.' }
  },
  title: 'Statement Coverage vs Branch Coverage',
  isoQuality: { label: 'Maintainability', sub: 'Testability', icon: '🔧', color: '#f59e0b' },
  isoClause: 'Clauses 6.2 & 6.3',
  description: 'Your CI pipeline reports 100% statement coverage on a critical module. The manager says: "Statement coverage is at 100% — branch coverage is redundant. We can skip it." Is this correct?',
  image: '🔀',
  question: 'Can you achieve 100% statement coverage while still missing branch coverage?',
  options: [
    { id: 'a', text: 'No — 100% statement coverage always implies 100% branch coverage', correct: false },
    { id: 'b', text: 'Yes — a single test taking only the "true" branch covers all statements but misses the "false" branch', correct: true },
    { id: 'c', text: 'Yes — but only for functions with more than 10 branches', correct: false },
    { id: 'd', text: 'Branch coverage is always redundant once statement coverage is at 100%', correct: false }
  ],
  correctFeedback: '✅ Correct! Classic example: if (x > 0) { doA(); } doB(); — one test with x=5 hits every statement (doA + doB) but never exercises the x≤0 path. Branch coverage requires a second test with x=0.',
  wrongFeedback: '❌ Consider: if(x>0){ doA(); } doB(); — a single test with x=5 reaches every statement, but the false branch (x≤0) is never tested. SC is weaker than BC.',
  misconception: '100% Statement Coverage does NOT imply 100% Branch Coverage. BC subsumes SC — not the other way around.',
  points: 25
}
];

// ============================================================
// PHASE 3: Strategize — Project Simulation Scenarios
// ============================================================

const PHASE3_SCENARIOS = [
  {
    id: 'project1',
    title: 'MedSafe — Healthcare Patient Management System',
    icon: '🏥',
    description: 'A hospital is deploying a new patient management system that handles medication dosages, patient records, and appointment scheduling. The system is safety-critical — incorrect dosage calculations could harm patients.',
    constraints: {
      risk: 'Very High (safety-critical, lives at stake)',
      budget: 'High (hospital budget allocated)',
      timeline: '12 weeks for testing',
      team: '5 experienced testers, 2 with medical domain knowledge',
      documentation: 'Complete requirements specification available'
    },
    techniques: [
      { id: 'ep', name: 'Equivalence Partitioning', category: 'specification-based', value: 3 },
      { id: 'bva', name: 'Boundary Value Analysis', category: 'specification-based', value: 3 },
      { id: 'dt', name: 'Decision Table Testing', category: 'specification-based', value: 2 },
      { id: 'st', name: 'State Transition Testing', category: 'specification-based', value: 2 },
      { id: 'sc', name: 'Statement Coverage', category: 'structure-based', value: 1 },
      { id: 'bc', name: 'Branch Coverage', category: 'structure-based', value: 2 },
      { id: 'mcdc', name: 'MC/DC Coverage', category: 'structure-based', value: 3 },
      { id: 'eg', name: 'Error Guessing', category: 'experience-based', value: 2 },
      { id: 'et', name: 'Exploratory Testing', category: 'experience-based', value: 1 }
    ],
    idealSelection: ['ep', 'bva', 'dt', 'mcdc', 'eg'],
    explanation: 'For safety-critical systems, you need RIGOROUS testing. EP+BVA for dosage input ranges, Decision Tables for complex medication interaction rules, MC/DC for critical code paths (required by safety standards like DO-178C), and Error Guessing to leverage the medical domain expertise on your team.',
    maxPoints: 37,
    selectionLimit: 5,
    keyInsight: 'Safety-critical systems demand the most rigorous techniques. MC/DC is often REQUIRED by safety standards, not optional.'
  },
  {
    id: 'project2',
    title: 'QuickMVP — Startup Food Delivery App',
    icon: '🍕',
    description: 'A startup is launching a food delivery app MVP. They need to ship within 3 weeks to secure funding. The app handles ordering, payment, and delivery tracking. Speed to market is the top priority.',
    constraints: {
      risk: 'Medium (financial transactions, but not safety-critical)',
      budget: 'Very Low (startup with limited runway)',
      timeline: '1 week for testing only',
      team: '1 senior tester, 1 junior tester',
      documentation: 'Minimal — user stories only, no formal specs'
    },
    techniques: [
      { id: 'ep', name: 'Equivalence Partitioning', category: 'specification-based', value: 2 },
      { id: 'bva', name: 'Boundary Value Analysis', category: 'specification-based', value: 1 },
      { id: 'st', name: 'State Transition Testing', category: 'specification-based', value: 2 },
      { id: 'sc', name: 'Statement Coverage', category: 'structure-based', value: 0 },
      { id: 'bc', name: 'Branch Coverage', category: 'structure-based', value: 1 },
      { id: 'mcdc', name: 'MC/DC Coverage', category: 'structure-based', value: 0 },
      { id: 'eg', name: 'Error Guessing', category: 'experience-based', value: 3 },
      { id: 'et', name: 'Exploratory Testing', category: 'experience-based', value: 3 },
      { id: 'cbt', name: 'Checklist-Based Testing', category: 'experience-based', value: 2 }
    ],
    idealSelection: ['ep', 'st', 'eg', 'et', 'cbt'],
    explanation: 'With minimal time and documentation, Experience-Based techniques shine. Exploratory Testing allows rapid discovery, Error Guessing leverages senior expertise for payment-critical paths, and Checklist-Based Testing ensures nothing major is missed. EP covers basic input validation, and State Transition Testing verifies the order flow.',
    maxPoints: 37,
    selectionLimit: 5,
    keyInsight: 'Low budget + limited time + minimal docs = Experience-Based techniques become primary. This is NOT a rule — it\'s contextual judgment.'
  },
  {
    id: 'project3',
    title: 'MigrateX — Legacy ERP System Migration',
    icon: '🔄',
    description: 'A manufacturing company is migrating their 20-year-old ERP system to a new platform. The legacy system has extensive undocumented business rules. Both old and new systems will run in parallel for 3 months.',
    constraints: {
      risk: 'High (business continuity, data integrity)',
      budget: 'Medium',
      timeline: '8 weeks for testing',
      team: '3 testers — 1 senior with legacy system knowledge, 2 juniors new to the domain',
      documentation: 'Legacy system: almost none. New system: API documentation available'
    },
    techniques: [
      { id: 'ep', name: 'Equivalence Partitioning', category: 'specification-based', value: 1 },
      { id: 'bva', name: 'Boundary Value Analysis', category: 'specification-based', value: 1 },
      { id: 'dt', name: 'Decision Table Testing', category: 'specification-based', value: 2 },
      { id: 'st', name: 'State Transition Testing', category: 'specification-based', value: 2 },
      { id: 'sc', name: 'Statement Coverage', category: 'structure-based', value: 1 },
      { id: 'bc', name: 'Branch Coverage', category: 'structure-based', value: 2 },
      { id: 'eg', name: 'Error Guessing', category: 'experience-based', value: 3 },
      { id: 'et', name: 'Exploratory Testing', category: 'experience-based', value: 3 },
      { id: 'cbt', name: 'Checklist-Based Testing', category: 'experience-based', value: 2 }
    ],
    idealSelection: ['dt', 'st', 'bc', 'eg', 'et'],
    explanation: 'Migration testing requires a MIX of all three categories. The senior tester uses Exploratory Testing + Error Guessing to discover undocumented business rules in the legacy system. Decision Tables capture complex business logic, State Transition tests the workflow migrations, and Branch Coverage ensures new code paths are exercised.',
    maxPoints: 36,
    selectionLimit: 5,
    keyInsight: 'The same risk level can require DIFFERENT technique mixes depending on documentation availability, team expertise, and system characteristics. Risk-based selection is judgment-based, NOT algorithmic.'
  }
];

// ============================================================
// SELECTION CRITERIA (Clause 4)
// ============================================================

const SELECTION_CRITERIA = {
  riskAssessment: {
    label: 'Risk Assessment',
    icon: '⚠️',
    description: 'Product risk (safety, financial) and project risk (timeline, resources)',
    factors: ['Safety criticality', 'Financial impact', 'Regulatory requirements', 'Reputation damage']
  },
  testObjectives: {
    label: 'Test Objectives',
    icon: '🎯',
    description: 'What the testing aims to verify: functional, safety, performance',
    factors: ['Functional verification', 'Safety validation', 'Performance assessment', 'Security testing']
  },
  testLevels: {
    label: 'Test Levels',
    icon: '📊',
    description: 'Unit, Integration, System, or Acceptance testing',
    factors: ['Unit testing', 'Integration testing', 'System testing', 'Acceptance testing']
  },
  organizationalContext: {
    label: 'Organizational Context',
    icon: '🏢',
    description: 'Available resources: tester capability, time, and budget',
    factors: ['Tester expertise', 'Time constraints', 'Budget limitations', 'Documentation availability']
  }
};

// ============================================================
// TUTORIAL CONTENT
// ============================================================

const TUTORIAL_SLIDES = [
  {
    title: 'Welcome to TestLab 29119',
    content: 'You are a <strong>Test Manager</strong> responsible for selecting the right test techniques for different software projects. Your decisions will determine whether critical defects are found — or missed.',
    icon: '🧪'
  },
  {
    title: 'ISO/IEC 29119-4: Test Techniques',
    content: 'This standard defines <strong>three categories</strong> of test design techniques, each based on a different source of knowledge for creating test cases.',
    icon: '📋'
  },
  {
    title: 'The Three Categories',
    content: `
      <div class="tutorial-categories">
        <div class="tutorial-cat spec"><strong>Specification-Based</strong><br>Uses requirements & specs<br><small>EP, BVA, Decision Table, State Transition...</small></div>
        <div class="tutorial-cat struct"><strong>Structure-Based</strong><br>Uses code & architecture<br><small>Statement, Branch, Path, MC/DC Coverage...</small></div>
        <div class="tutorial-cat exp"><strong>Experience-Based</strong><br>Uses tester expertise<br><small>Error Guessing, Exploratory, Checklist, Ad Hoc...</small></div>
      </div>
    `,
    icon: '📚'
  },
  {
    title: 'Selection Criteria (Clause 4)',
    content: `<p>Choosing the right technique depends on four criteria from <strong>Clause 4</strong>:</p>
      <div class="tutorial-clause4-grid">
        <div class="clause4-item"><span class="c4-icon">⚠️</span><span><strong>Risk Assessment</strong><br><small>Product &amp; project risk level</small></span></div>
        <div class="clause4-item"><span class="c4-icon">🎯</span><span><strong>Test Objectives</strong><br><small>Functional, safety, performance</small></span></div>
        <div class="clause4-item"><span class="c4-icon">📊</span><span><strong>Test Levels</strong><br><small>Unit, integration, system, acceptance</small></span></div>
        <div class="clause4-item"><span class="c4-icon">🏢</span><span><strong>Organizational Context</strong><br><small>Time, budget, team expertise, docs</small></span></div>
      </div>
      <p style="margin-top:0.75rem;font-size:0.85rem;color:var(--amber)">⚠️ There is NO fixed algorithm — technique selection is professional judgment.</p>`,
    icon: '⚙️'
  },
  {
    title: 'ISO/IEC 25010 Connection',
    content: `<p>Each Phase 2 scenario is tagged with an <strong>ISO/IEC 25010</strong> quality characteristic — the property that the test technique is designed to verify.</p>
      <div class="tutorial-categories" style="margin-top:1rem;flex-wrap:wrap">
        <div class="tutorial-cat spec" style="flex:0 0 calc(50% - 0.4rem)">🎯 <strong>Functional Suitability</strong><br><small>→ EP + BVA</small></div>
        <div class="tutorial-cat struct" style="flex:0 0 calc(50% - 0.4rem)">🛡️ <strong>Reliability</strong><br><small>→ State Transition Testing</small></div>
        <div class="tutorial-cat exp" style="flex:0 0 calc(50% - 0.4rem)">🔒 <strong>Security</strong><br><small>→ Error Guessing + ET</small></div>
        <div class="tutorial-cat spec" style="flex:0 0 calc(50% - 0.4rem);border-color:rgba(245,158,11,0.3);color:var(--amber)">🔧 <strong>Maintainability</strong><br><small>→ Branch + MC/DC</small></div>
      </div>
      <p style="margin-top:0.75rem;font-size:0.8rem;opacity:0.7">Look for the <strong>🏷️ ISO 25010 badge</strong> on each Phase 2 scenario header.</p>`,
    icon: '🏷️'
  },
  {
    title: 'Your Mission',
    content: 'Complete <strong>4 phases</strong> to prove your mastery:<br><br>🔵 <strong>Phase 1:</strong> Classify techniques into correct categories<br>🟢 <strong>Phase 2:</strong> Apply techniques to real scenarios — watch for ISO 25010 quality badges<br>🟠 <strong>Phase 3:</strong> Build a test strategy using Clause 4 selection criteria<br>🟣 <strong>Phase 4:</strong> Select required EP and BVA test cases for input fields',
    icon: '🚀'
  }
];

// ============================================================
// SCORING
// ============================================================

// ============================================================
// PHASE 4: Write Your Test Cases
// ============================================================
const PHASE4_EXERCISES = [
  {
    id: 'ex1',
    title: 'Login Form — Username Field',
    technique: 'EP + BVA',
    description: 'A username field accepts 5–20 characters. The system must reject values outside this range. Select ALL test cases you would include using Equivalence Partitioning and Boundary Value Analysis.',
    coverageItems: [
      { id: 'ep-valid', label: 'EP — Valid partition: 10 chars (e.g. "testuser1")',    required: true,  category: 'EP'    },
      { id: 'ep-below', label: 'EP — Invalid partition: 2 chars (below minimum)',       required: true,  category: 'EP'    },
      { id: 'ep-above', label: 'EP — Invalid partition: 25 chars (above maximum)',      required: true,  category: 'EP'    },
      { id: 'bva-4',   label: 'BVA — Boundary: 4 chars (just below min — expect FAIL)', required: true,  category: 'BVA'   },
      { id: 'bva-5',   label: 'BVA — Boundary: 5 chars (minimum valid — expect PASS)', required: true,  category: 'BVA'   },
      { id: 'bva-20',  label: 'BVA — Boundary: 20 chars (maximum valid — expect PASS)', required: true,  category: 'BVA'   },
      { id: 'bva-21',  label: 'BVA — Boundary: 21 chars (just above max — expect FAIL)', required: true,  category: 'BVA'   },
      { id: 'irr-1',   label: 'Security: SQL injection input " OR 1=1"',               required: false, category: 'EXTRA' },
      { id: 'irr-2',   label: 'UX: special characters only "!@#$%^"',                  required: false, category: 'EXTRA' }
    ],
    maxPoints: 42
  },
  {
    id: 'ex2',
    title: 'Age Field — Insurance Discount Calculator',
    technique: 'EP + BVA',
    description: 'An age input field must accept values between 18 and 65 (inclusive). Values outside this range should be rejected. Select ALL test cases you would include.',
    coverageItems: [
      { id: 'ep-valid', label: 'EP — Valid partition: age 35 (within 18–65)',           required: true,  category: 'EP'    },
      { id: 'ep-below', label: 'EP — Invalid partition: age 10 (below 18)',             required: true,  category: 'EP'    },
      { id: 'ep-above', label: 'EP — Invalid partition: age 70 (above 65)',             required: true,  category: 'EP'    },
      { id: 'bva-17',  label: 'BVA — Boundary: age 17 (just below min — expect FAIL)', required: true,  category: 'BVA'   },
      { id: 'bva-18',  label: 'BVA — Boundary: age 18 (minimum valid — expect PASS)',  required: true,  category: 'BVA'   },
      { id: 'bva-65',  label: 'BVA — Boundary: age 65 (maximum valid — expect PASS)',  required: true,  category: 'BVA'   },
      { id: 'bva-66',  label: 'BVA — Boundary: age 66 (just above max — expect FAIL)', required: true,  category: 'BVA'   },
      { id: 'irr-1',   label: 'Negative value: age -5',                                required: false, category: 'EXTRA' },
      { id: 'irr-2',   label: 'Non-numeric input: "twenty"',                           required: false, category: 'EXTRA' }
    ],
    maxPoints: 43
  }
];

// ============================================================
// GLOSSARY / REFERENCE DATA
// ============================================================
const GLOSSARY_EXTRAS = [
  { name: 'ISO/IEC 29119-4',             clause: 'Standard',   desc: 'International standard defining software test design techniques across three categories.' },
  { name: 'Clause 4 — Selection Criteria', clause: 'Cl. 4',   desc: 'Four factors for choosing techniques: Risk Assessment, Test Objectives, Test Levels, Organizational Context.' },
  { name: 'ISO/IEC 25010',               clause: 'Quality',    desc: 'Product quality model defining characteristics such as reliability, security, and maintainability.' },
  { name: 'MC/DC',                        clause: 'Cl. 6.5',   desc: 'Modified Condition/Decision Coverage — each condition independently affects the decision outcome. Required by aviation DO-178C.' },
  { name: 'Test Charter',                 clause: 'Cl. 7.3',   desc: 'A brief statement of purpose for an Exploratory Testing session, defining scope and mission.' },
  { name: 'Knowledge Source',             clause: 'Cl. 4',     desc: 'The basis from which test cases are derived: requirements, code structure, or tester experience.' },
  { name: 'Equivalence Class',            clause: 'Cl. 5.4',   desc: 'A set of input values expected to be treated identically by the system under test.' },
  { name: 'Boundary Value',              clause: 'Cl. 5.5',   desc: 'A value at the edge of an equivalence partition — where defects are statistically most likely to occur.' },
  { name: 'Risk-Based Testing',           clause: 'Cl. 4.3',   desc: 'Prioritising test effort based on the likelihood and impact of potential failures.' },
  { name: 'Test Level',                   clause: 'Cl. 4.4',   desc: 'The scope of testing: unit, integration, system, or acceptance level.' }
];

const SCORING = {
  phase1: {
    correctClassification: 6,
    wrongClassification: 0,
    perfectBonus: 20,
    hintPenalty: 4,
    maxScore: 110 // 15 cards × 6 + 20 bonus
  },
  phase2: {
    maxScore: 195 // sum of scenario points
  },
  phase3: {
    maxScore: 110 // 37 + 37 + 36
  },
  phase4: {
    maxScore: 85, // 42 + 43
    pointsPerRequired: 6,
    extraPenalty: 2
  },
  totalMax: 500,
  grades: [
    { min: 90, label: 'ISO Master', emoji: '🏆', message: 'Outstanding! You have mastered ISO/IEC 29119-4 Test Techniques.' },
    { min: 75, label: 'Senior Tester', emoji: '🥇', message: 'Great work! You have a strong understanding of test technique selection.' },
    { min: 60, label: 'Test Engineer', emoji: '🥈', message: 'Good job! You understand the basics but could improve on technique selection strategy.' },
    { min: 40, label: 'Junior Tester', emoji: '🥉', message: 'You\'re learning! Review the misconceptions and try again.' },
    { min: 0, label: 'Trainee', emoji: '📚', message: 'Keep studying! Focus on understanding the three categories and their differences.' }
  ]
};
