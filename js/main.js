// ============================================================
// TestLab 29119 — Main Game Controller
// ============================================================

const GameState = {
  currentScreen: 'welcome',
  tutorialSlide: 0,
  phase1Score: 0,
  phase2Score: 0,
  phase3Score: 0,
  phase2Current: 0,
  phase3Current: 0,
  phase3Selections: [],
  misconceptionsEncountered: [],
  phase1Placed: 0,
  phase1Total: PHASE1_CARDS.length,
  soundMuted: false,
  hintsUsed: 0,
  hintPenalty: 0,
  phase3Insights: [],
  phase4Score: 0,
  phase4Current: 0,
  playerName: '',
  playerSchool: ''
};

// --- DOM Helpers ---
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================
// CLAUSE 4 MAPPING — constraints → ISO 29119-4 Clause 4 categories
// ============================================================
const CLAUSE4_MAP = {
  risk:          { label: 'Risk Assessment',        clause: '4.3', icon: '⚠️', color: 'var(--red)' },
  budget:        { label: 'Organizational Context', clause: '4.5', icon: '🏢', color: 'var(--cyan)' },
  timeline:      { label: 'Organizational Context', clause: '4.5', icon: '🏢', color: 'var(--cyan)' },
  team:          { label: 'Organizational Context', clause: '4.5', icon: '🏢', color: 'var(--cyan)' },
  documentation: { label: 'Organizational Context', clause: '4.5', icon: '🏢', color: 'var(--cyan)' },
};

// ============================================================
// SOUND ENGINE (Web Audio API — zero dependencies)
// ============================================================
function playSound(type) {
  if (GameState.soundMuted) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (type === 'correct') {
      [523, 659, 784].forEach((freq, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.35);
        o.start(ctx.currentTime + i * 0.12);
        o.stop(ctx.currentTime + i * 0.12 + 0.35);
      });
    } else if (type === 'wrong') {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sawtooth'; o.connect(g); g.connect(ctx.destination);
      o.frequency.setValueAtTime(280, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.3);
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.3);
    } else if (type === 'drop') {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 660;
      g.gain.setValueAtTime(0.08, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.12);
    } else if (type === 'complete') {
      [523, 659, 784, 1047].forEach((freq, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.15);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.5);
        o.start(ctx.currentTime + i * 0.15);
        o.stop(ctx.currentTime + i * 0.15 + 0.5);
      });
    }
  } catch(e) {}
}

function toggleMute() {
  GameState.soundMuted = !GameState.soundMuted;
  $('#mute-btn').textContent = GameState.soundMuted ? '🔇' : '🔊';
}

// ============================================================
// SCORE POPUP ANIMATION
// ============================================================
function showScorePopup(points, isPositive = true) {
  const popup = $('#score-popup');
  popup.textContent = (isPositive ? '+' : '') + points;
  popup.className = 'score-popup ' + (isPositive ? 'popup-correct' : 'popup-wrong') + ' popup-visible';
  setTimeout(() => { popup.className = 'score-popup'; }, 1100);
}

// ============================================================
// TECH MODAL (click a card to see ISO details)
// ============================================================
function getTechDetails(techId) {
  for (const cat of Object.values(TECHNIQUES)) {
    const tech = cat.techniques.find(t => t.id === techId);
    if (tech) return { ...tech, catLabel: cat.label, catColor: cat.color };
  }
  return null;
}

function openTechModal(techId) {
  const t = getTechDetails(techId);
  if (!t) return;
  const catClass = t.catLabel.toLowerCase().includes('spec') ? 'spec' :
                   t.catLabel.toLowerCase().includes('struct') ? 'struct' : 'exp';
  $('#modal-category').innerHTML = `<span class="cat-dot ${catClass}"></span> ${t.catLabel}`;
  $('#modal-clause').textContent = t.isoClause || '';
  $('#modal-title').textContent = t.name;
  $('#modal-desc').textContent = t.desc;
  $('#modal-best').textContent = t.bestFor || '—';
  $('#modal-pair').textContent = t.pairsWith ? `${t.pairsWith} — see ISO 29119-4` : '—';
  $('#modal-overlay').classList.remove('hidden');
  $('#tech-modal').classList.remove('hidden');
  $('#tech-modal').classList.add('modal-open');
}

function closeTechModal() {
  $('#modal-overlay').classList.add('hidden');
  $('#tech-modal').classList.add('hidden');
  $('#tech-modal').classList.remove('modal-open');
}

function showScreen(screenId) {
  $$('.screen').forEach(s => s.classList.add('hidden'));
  const el = $(`#${screenId}`);
  if (el) { el.classList.remove('hidden'); }
  GameState.currentScreen = screenId;
  updatePhaseProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updatePhaseProgress() {
  const dots = $$('.phase-dot');
  const connectors = $$('.phase-connector');
  const phases = ['phase1', 'phase2', 'phase3'];
  const screenPhaseMap = {
    'welcome': -1, 'tutorial': -1,
    'phase1': 0, 'phase2': 1, 'phase3': 2, 'phase4': 3, 'results': 4
  };
  const current = screenPhaseMap[GameState.currentScreen] ?? -1;

  dots.forEach((dot, i) => {
    dot.classList.remove('active', 'completed');
    if (i < current) dot.classList.add('completed');
    else if (i === current) dot.classList.add('active');
  });
  connectors.forEach((c, i) => {
    c.classList.toggle('completed', i < current);
  });
}

function updateScore() {
  const total = GameState.phase1Score + GameState.phase2Score + GameState.phase3Score + GameState.phase4Score;
  const scoreEl = $('#score-value');
  if (scoreEl) scoreEl.textContent = total;
  // Update best score
  const best = parseInt(localStorage.getItem('testlab-best') || '0');
  if (total > best) {
    localStorage.setItem('testlab-best', total);
    const bestEl = $('#best-value');
    if (bestEl) bestEl.textContent = total;
  }
}

// ============================================================
// WELCOME SCREEN
// ============================================================
function startGame() {
  const nameInput = $('#player-name');
  const schoolInput = $('#player-school');
  GameState.playerName = (nameInput && nameInput.value.trim() !== '') ? nameInput.value.trim() : 'Anonymous';
  GameState.playerSchool = (schoolInput && schoolInput.value.trim() !== '') ? schoolInput.value.trim() : 'Unknown School';
  showScreen('tutorial');
  renderTutorial();
}

function skipTutorial() {
  showScreen('phase1');
  initPhase1();
}

// ============================================================
// TUTORIAL
// ============================================================
function renderTutorial() {
  const slide = TUTORIAL_SLIDES[GameState.tutorialSlide];
  $('#tutorial-icon').textContent = slide.icon;
  $('#tutorial-title').textContent = slide.title;
  $('#tutorial-content').innerHTML = slide.content;

  // Update dots
  const dotsContainer = $('#slide-dots');
  dotsContainer.innerHTML = TUTORIAL_SLIDES.map((_, i) =>
    `<div class="slide-dot ${i === GameState.tutorialSlide ? 'active' : ''}"></div>`
  ).join('');

  // Button states
  $('#btn-prev-slide').disabled = GameState.tutorialSlide === 0;
  const isLast = GameState.tutorialSlide === TUTORIAL_SLIDES.length - 1;
  $('#btn-next-slide').textContent = isLast ? 'Start Phase 1 →' : 'Next →';
}

function nextSlide() {
  if (GameState.tutorialSlide < TUTORIAL_SLIDES.length - 1) {
    GameState.tutorialSlide++;
    renderTutorial();
  } else {
    showScreen('phase1');
    initPhase1();
  }
}

function prevSlide() {
  if (GameState.tutorialSlide > 0) {
    GameState.tutorialSlide--;
    renderTutorial();
  }
}

// ============================================================
// PHASE 1: CLASSIFY (Drag & Drop)
// ============================================================
function initPhase1() {
  GameState.phase1Score = 0;
  GameState.phase1Placed = 0;

  const pool = $('#card-pool');
  const shuffled = [...PHASE1_CARDS].sort(() => Math.random() - 0.5);

  pool.innerHTML = shuffled.map(card => `
    <div class="tech-card" draggable="true" data-id="${card.id}" data-category="${card.category}" id="card-${card.id}">
      <span class="card-grip">⦿</span>
      <span class="card-name">${card.name}</span>
      <div class="card-actions">
        <button class="card-hint-btn" onclick="event.stopPropagation(); showHint('${card.id}')" title="Hint (-5 pts)">💡</button>
        <button class="card-info-btn" onclick="event.stopPropagation(); openTechModal('${card.id}')" title="ISO details">i</button>
      </div>
      <div class="card-hint-text hidden" id="hint-${card.id}">${card.hint}</div>
    </div>
  `).join('');

  // Clear drop zones
  $$('.zone-cards').forEach(z => z.innerHTML = '');

  // Setup drag events
  setupDragAndDrop();

  // Update counter
  updatePhase1Counter();

  // Hide check button initially
  $('#phase1-check-btn').classList.add('hidden');
  $('#phase1-result').classList.add('hidden');
}

function updatePhase1Counter() {
  $('#phase1-counter').textContent = `${GameState.phase1Placed} / ${GameState.phase1Total}`;
}

// ============================================================
// PHASE 1: HINT SYSTEM
// ============================================================
function showHint(cardId) {
  const hintEl = document.getElementById(`hint-${cardId}`);
  if (!hintEl) return;

  const alreadyVisible = !hintEl.classList.contains('hidden');
  if (alreadyVisible) {
    hintEl.classList.add('hidden');
    return;
  }

  // Apply penalty only first time
  const wasHidden = hintEl.dataset.used !== 'true';
  if (wasHidden) {
    hintEl.dataset.used = 'true';
    GameState.hintsUsed++;
    GameState.hintPenalty += SCORING.phase1.hintPenalty;
    // Deduct from phase1Score (floor at 0) — will finalize in checkPhase1
    playSound('wrong');
    showScorePopup(-SCORING.phase1.hintPenalty, false);
  }

  hintEl.classList.remove('hidden');
}

let dragDropInitialized = false;

function setupDragAndDrop() {
  if (dragDropInitialized) return;
  dragDropInitialized = true;

  // Card drag start
  document.addEventListener('dragstart', (e) => {
    const card = e.target.closest('.tech-card');
    if (!card) return;
    card.classList.add('dragging');
    e.dataTransfer.setData('text/plain', card.dataset.id);
    e.dataTransfer.effectAllowed = 'move';
  });

  document.addEventListener('dragend', (e) => {
    const card = e.target.closest('.tech-card');
    if (card) card.classList.remove('dragging');
  });

  // Drop zones — use event delegation on the phase1 container
  document.addEventListener('dragover', (e) => {
    const zone = e.target.closest('.drop-zone');
    const pool = e.target.closest('#card-pool');
    if (zone || pool) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (zone) zone.classList.add('drag-over');
    }
  });

  document.addEventListener('dragleave', (e) => {
    const zone = e.target.closest('.drop-zone');
    if (zone) zone.classList.remove('drag-over');
  });

  document.addEventListener('drop', (e) => {
    const zone = e.target.closest('.drop-zone');
    const pool = e.target.closest('#card-pool');

    if (!zone && !pool) return;
    e.preventDefault();

    const cardId = e.dataTransfer.getData('text/plain');
    const card = document.getElementById(`card-${cardId}`);
    if (!card) return;

    if (zone) {
      zone.classList.remove('drag-over');
      const zoneCards = zone.querySelector('.zone-cards');
      const wasInPool = card.parentElement.id === 'card-pool';

      zoneCards.appendChild(card);

      if (wasInPool) {
        GameState.phase1Placed++;
        updatePhase1Counter();
        playSound('drop');
      }

      if (GameState.phase1Placed >= GameState.phase1Total) {
        $('#phase1-check-btn').classList.remove('hidden');
      }
    } else if (pool) {
      const wasInZone = card.parentElement.closest('.drop-zone') !== null;
      pool.appendChild(card);
      if (wasInZone) {
        GameState.phase1Placed = Math.max(0, GameState.phase1Placed - 1);
        updatePhase1Counter();
        $('#phase1-check-btn').classList.add('hidden');
      }
      // Clear any feedback badges and visual state when returning to pool
      card.classList.remove('correct', 'wrong');
      card.querySelectorAll('.card-feedback-badge').forEach(el => el.remove());
    }
  });
}

function checkPhase1() {
  let correct = 0;
  const total = PHASE1_CARDS.length;

  // Build a lookup: cardId -> correct category info
  const cardLookup = {};
  PHASE1_CARDS.forEach(c => { cardLookup[c.id] = c; });

  // Build technique detail lookup from TECHNIQUES for ISO clause
  const techDetail = {};
  Object.values(TECHNIQUES).forEach(cat => {
    cat.techniques.forEach(t => {
      techDetail[t.id] = { clause: t.isoClause, categoryLabel: cat.label, categoryId: cat.id, desc: t.desc };
    });
  });

  const wrongCards = [];

  $$('.drop-zone').forEach(zone => {
    const zoneCategory = zone.dataset.category;
    zone.querySelectorAll('.tech-card').forEach(card => {
      const cardId = card.dataset.id;
      const isCorrect = card.dataset.category === zoneCategory;

      // Remove any previous feedback
      card.querySelectorAll('.card-feedback-badge').forEach(el => el.remove());

      if (isCorrect) {
        card.classList.add('correct');
        card.classList.remove('wrong');
        correct++;
      } else {
        card.classList.add('wrong');
        card.classList.remove('correct');

        // Build per-card feedback badge
        const detail = techDetail[cardId];
        const correctCard = cardLookup[cardId];
        if (detail && correctCard) {
          const catColors = {
            'specification-based': 'var(--cyan)',
            'structure-based': 'var(--green)',
            'experience-based': 'var(--red)'
          };
          const catIcons = {
            'specification-based': '📋',
            'structure-based': '🔩',
            'experience-based': '🧠'
          };
          const badge = document.createElement('div');
          badge.className = 'card-feedback-badge';
          badge.style.cssText = `
            width:100%; margin-top:0.35rem; padding:0.3rem 0.5rem;
            background:rgba(255,107,107,0.12); border:1px solid rgba(255,107,107,0.3);
            border-radius:5px; font-size:0.65rem; line-height:1.45;
          `;
          badge.innerHTML = `
            <div style="color:var(--red);font-weight:700;margin-bottom:0.2rem">❌ Wrong category</div>
            <div style="color:${catColors[correctCard.category]};font-weight:600">
              ${catIcons[correctCard.category]} Correct: ${detail.categoryLabel}
            </div>
            <div style="color:var(--text-muted);margin-top:0.15rem">${detail.clause} &mdash; ${detail.desc.split('.')[0]}.</div>
          `;
          card.appendChild(badge);
          wrongCards.push(card.querySelector('.card-name')?.textContent || cardId);
        }
      }
    });
  });

  const rawScore = correct * SCORING.phase1.correctClassification +
    (correct === total ? SCORING.phase1.perfectBonus : 0);
  GameState.phase1Score = Math.max(0, rawScore - GameState.hintPenalty);

  if (correct === total) {
    playSound('complete');
  } else {
    playSound(correct > total / 2 ? 'correct' : 'wrong');
  }
  showScorePopup(GameState.phase1Score);

  const hintNote = GameState.hintsUsed > 0
    ? `<br><span style="color:var(--amber)">⚠️ ${GameState.hintsUsed} hint(s) used &mdash; &minus;${GameState.hintPenalty} pts penalty</span>`
    : '';

  const resultEl = $('#phase1-result');
  resultEl.classList.remove('hidden');
  resultEl.innerHTML = `
    <div class="feedback-box ${correct === total ? 'correct' : 'wrong'}">
      <strong>${correct}/${total} correct!</strong>
      ${correct === total
        ? ' Perfect classification! You clearly understand the three technique categories.'
        : ` ${total - correct} card(s) in the wrong category &mdash; check the red badges below each card for the correct placement and ISO clause reference.`
      }
      ${hintNote}
      <br><strong>Score: +${GameState.phase1Score} points</strong>
    </div>
  `;

  if (correct < total) {
    GameState.misconceptionsEncountered.push(
      'Spec ≠ Black-Box, Structure ≠ White-Box — categorization is by knowledge source (requirements / code / experience).'
    );
  }

  updateScore();
  $('#phase1-check-btn').classList.add('hidden');
  $('#phase1-next-btn').classList.remove('hidden');
}

function goToPhase2() {
  showScreen('phase2');
  GameState.phase2Current = 0;
  renderPhase2Scenario();
}

// ============================================================
// PHASE 2: APPLY (Scenario Questions)
// ============================================================
function renderPhase2Scenario() {
  const scenario = PHASE2_SCENARIOS[GameState.phase2Current];
  if (!scenario) { goToPhase3(); return; }

  $('#phase2-progress').textContent = `${GameState.phase2Current + 1} / ${PHASE2_SCENARIOS.length}`;

  const container = $('#phase2-content');
  container.innerHTML = `
    <div class="scenario-card glass-card">
      <div class="scenario-header">
        <span class="scenario-icon">${scenario.image}</span>
        <div>
          <div class="scenario-title">${scenario.title}</div>
          ${scenario.isoQuality ? `
            <div class="iso-quality-badge" style="border-color:${scenario.isoQuality.color}33; color:${scenario.isoQuality.color}">
              <span>${scenario.isoQuality.icon}</span>
              <span>ISO 25010 • ${scenario.isoQuality.label}</span>
              <span class="iso-quality-sub">${scenario.isoQuality.sub}</span>
              ${scenario.isoClause ? `<span class="iso-clause-tag">${scenario.isoClause}</span>` : ''}
            </div>
          ` : ''}
        </div>
      </div>
      <div class="scenario-desc">${scenario.description}</div>
      ${scenario.comparisonMode && scenario.comparison ? `
        <div class="comparison-panel">
          <div class="compare-side compare-left">
            <div class="compare-name">${scenario.comparison.left.name}</div>
            <div class="compare-key">${scenario.comparison.left.key}</div>
          </div>
          <div class="compare-vs">VS</div>
          <div class="compare-side compare-right">
            <div class="compare-name">${scenario.comparison.right.name}</div>
            <div class="compare-key">${scenario.comparison.right.key}</div>
          </div>
        </div>
      ` : ''}
      <div class="scenario-question">${scenario.question}</div>
      <div class="options-list">
        ${scenario.options.map(opt => `
          <button class="option-btn" data-id="${opt.id}" data-correct="${opt.correct}" onclick="selectOption(this, '${scenario.id}')">
            <span class="option-letter">${opt.id.toUpperCase()}</span>
            <span>${opt.text}</span>
          </button>
        `).join('')}
      </div>
      <div id="scenario-feedback" class="hidden"></div>
    </div>
  `;
}

function selectOption(btn, scenarioId) {
  const scenario = PHASE2_SCENARIOS.find(s => s.id === scenarioId);
  if (!scenario) return;

  // Disable all options
  const allBtns = btn.parentElement.querySelectorAll('.option-btn');
  allBtns.forEach(b => {
    b.disabled = true;
    b.style.pointerEvents = 'none';
    if (b.dataset.correct === 'true') b.classList.add('correct-answer');
  });

  const isCorrect = btn.dataset.correct === 'true';
  if (!isCorrect) btn.classList.add('wrong-answer');

  if (isCorrect) {
    GameState.phase2Score += scenario.points;
    updateScore();
    playSound('correct');
    showScorePopup(scenario.points);
  } else {
    playSound('wrong');
  }

  const feedbackEl = $('#scenario-feedback');
  feedbackEl.classList.remove('hidden');
  feedbackEl.innerHTML = `
    <div class="feedback-box ${isCorrect ? 'correct' : 'wrong'}">
      ${isCorrect ? scenario.correctFeedback : scenario.wrongFeedback}
      ${!isCorrect ? `<br><br><em>Correct answer: ${scenario.correctFeedback}</em>` : ''}
      <br><strong>${isCorrect ? `+${scenario.points} points` : '+0 points'}</strong>
    </div>
    ${scenario.misconception ? `
      <div class="key-insight-box">
        <div class="key-insight-header">
          <span class="key-insight-icon">⚠️</span>
          <span class="key-insight-title">KEY INSIGHT</span>
          ${scenario.isoClause ? `<span class="key-insight-clause">${scenario.isoClause}</span>` : ''}
        </div>
        <p class="key-insight-text">${scenario.misconception}</p>
        ${!isCorrect ? `<p class="key-insight-note">📌 This misconception has been added to your learning log.</p>` : ''}
      </div>
    ` : ''}
    <div style="text-align:center; margin-top:1rem;">
      <button class="btn btn-primary" onclick="nextPhase2Scenario()">
        ${GameState.phase2Current < PHASE2_SCENARIOS.length - 1 ? 'Next Scenario →' : 'Continue to Phase 3 →'}
      </button>
    </div>
  `;

  if (scenario.misconception && !isCorrect) {
    GameState.misconceptionsEncountered.push(scenario.misconception);
  }
}

function nextPhase2Scenario() {
  GameState.phase2Current++;
  if (GameState.phase2Current < PHASE2_SCENARIOS.length) {
    renderPhase2Scenario();
  } else {
    goToPhase3();
  }
}

function goToPhase3() {
  showScreen('phase3');
  GameState.phase3Current = 0;
  GameState.phase3Selections = [];
  renderPhase3Scenario();
}

// ============================================================
// PHASE 3: STRATEGIZE (Project Simulation)
// ============================================================
function renderPhase3Scenario() {
  const project = PHASE3_SCENARIOS[GameState.phase3Current];
  if (!project) { showResults(); return; }

  $('#phase3-progress').textContent = `${GameState.phase3Current + 1} / ${PHASE3_SCENARIOS.length}`;
  GameState.phase3Selections = [];

  const container = $('#phase3-content');
  container.innerHTML = `
    <div class="strategy-layout">
      <div class="project-brief glass-card">
        <div class="project-title">
          <span class="project-icon">${project.icon}</span>
          <span>${project.title}</span>
        </div>
        <p style="color:var(--text-secondary);font-size:0.95rem;line-height:1.7">${project.description}</p>
        <div class="constraints-grid">
          ${Object.entries(project.constraints).map(([key, val]) => {
            const c4 = CLAUSE4_MAP[key];
            const c4Tag = c4 ? `<div class="constraint-clause4" style="color:${c4.color}">${c4.icon} ${c4.label} <span class="constraint-clause-num">Cl. ${c4.clause}</span></div>` : '';
            const label = key.replace(/([A-Z])/g, ' $1').trim();
            return `
              <div class="constraint-item">
                ${c4Tag}
                <div class="constraint-label">${label}</div>
                <div class="constraint-value">${val}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      <div class="technique-selection-panel glass-card">
        <h3>🧰 Available Techniques</h3>
        <div class="tech-select-list" id="tech-select-list">
          ${project.techniques.map(t => {
            const catClass = t.category === 'specification-based' ? 'spec' :
                             t.category === 'structure-based' ? 'struct' : 'exp';
            const dots = '●'.repeat(t.value) + '○'.repeat(3 - t.value);
            const label = t.value === 3 ? 'Highly Appropriate' : t.value === 2 ? 'Appropriate' : t.value === 1 ? 'Low Value' : 'Not Recommended';
            const hoverColor = t.value === 3 ? '#06d6a0' : t.value === 2 ? '#00b4d8' : t.value === 1 ? '#f59e0b' : '#ff6b6b';
            return `
              <div class="tech-select-item" data-id="${t.id}" data-value="${t.value}"
                   data-dots="${dots}" data-label="${label}" data-hover-color="${hoverColor}"
                   onclick="toggleTechSelection(this, '${t.id}')"
                   onmouseenter="showTechHoverPreview(this)"
                   onmouseleave="hideTechHoverPreview(this)">
                <span class="cat-dot ${catClass}"></span>
                <span>${t.name}</span>
              </div>
            `;
          }).join('')}
        </div>
        <div class="selection-count">Selected: <strong id="sel-count">0</strong> / ${project.selectionLimit}</div>
      </div>
      <div class="selection-summary-panel glass-card">
        <h3>📋 Your Strategy</h3>
        <div class="selected-list" id="selected-list">
          <p style="color:var(--text-muted);font-size:0.85rem;text-align:center;padding:2rem 0">Select ${project.selectionLimit} techniques from the left panel</p>
        </div>
        <button class="btn btn-success" style="width:100%" id="submit-strategy-btn" disabled onclick="submitStrategy()">
          Submit Strategy
        </button>
      </div>
    </div>
    <div id="strategy-result"></div>
  `;
}

function toggleTechSelection(el, techId) {
  const project = PHASE3_SCENARIOS[GameState.phase3Current];
  const isSelected = GameState.phase3Selections.includes(techId);

  if (isSelected) {
    GameState.phase3Selections = GameState.phase3Selections.filter(id => id !== techId);
    el.classList.remove('selected');
    // Remove inline fitness indicator
    const badge = el.querySelector('.fitness-badge');
    if (badge) badge.remove();
  } else {
    if (GameState.phase3Selections.length >= project.selectionLimit) return;
    GameState.phase3Selections.push(techId);
    el.classList.add('selected');
    el.querySelectorAll('.fitness-hover-preview').forEach((p) => p.remove());
    // Show live fitness badge
    const tech = project.techniques.find(t => t.id === techId);
    if (tech) {
      const val = tech.value;
      const dots = '●'.repeat(val) + '○'.repeat(3 - val);
      const label = val === 3 ? 'Highly Appropriate' : val === 2 ? 'Appropriate' : val === 1 ? 'Low Value' : 'Not Recommended';
      const color = val === 3 ? 'var(--green)' : val === 2 ? 'var(--cyan)' : val === 1 ? 'var(--amber)' : 'var(--red)';
      const badge = document.createElement('span');
      badge.className = 'fitness-badge';
      badge.style.cssText = `color:${color};font-family:'JetBrains Mono',monospace;font-size:0.7rem;margin-left:auto;white-space:nowrap`;
      badge.innerHTML = `${dots} <span style="font-family:'Inter',sans-serif;opacity:0.85">${label}</span>`;
      el.appendChild(badge);
    }
  }

  updateSelectionSummary();
}

function showTechHoverPreview(el) {
  if (el.classList.contains('selected')) return; // already shows fitness badge
  const existing = el.querySelector('.fitness-hover-preview');
  if (existing) return;
  const dots  = el.dataset.dots;
  const label = el.dataset.label;
  const color = el.dataset.hoverColor;
  const preview = document.createElement('span');
  preview.className = 'fitness-hover-preview';
  preview.style.cssText = `color:${color};font-size:0.68rem;margin-left:auto;white-space:nowrap;opacity:0.6;font-style:italic;`;
  preview.textContent = `${dots} ${label}`;
  el.appendChild(preview);
}

function hideTechHoverPreview(el) {
  el.querySelectorAll('.fitness-hover-preview').forEach(p => p.remove());
}

function updateSelectionSummary() {
  const project = PHASE3_SCENARIOS[GameState.phase3Current];
  const listEl = $('#selected-list');
  const countEl = $('#sel-count');
  const submitBtn = $('#submit-strategy-btn');

  countEl.textContent = GameState.phase3Selections.length;

  if (GameState.phase3Selections.length === 0) {
    listEl.innerHTML = `<p style="color:var(--text-muted);font-size:0.85rem;text-align:center;padding:2rem 0">Select ${project.selectionLimit} techniques</p>`;
    submitBtn.disabled = true;
    return;
  }

  listEl.innerHTML = GameState.phase3Selections.map(id => {
    const tech = project.techniques.find(t => t.id === id);
    return `
      <div class="selected-tag">
        <span>${tech.name}</span>
        <button class="remove-btn" onclick="removeTechSelection('${id}')">✕</button>
      </div>
    `;
  }).join('');

  submitBtn.disabled = GameState.phase3Selections.length !== project.selectionLimit;
}

function removeTechSelection(techId) {
  GameState.phase3Selections = GameState.phase3Selections.filter(id => id !== techId);
  const item = document.querySelector(`.tech-select-item[data-id="${techId}"]`);
  if (item) item.classList.remove('selected');
  updateSelectionSummary();
}

function submitStrategy() {
  const project = PHASE3_SCENARIOS[GameState.phase3Current];
  let score = 0;
  const maxScore = project.maxPoints;

  GameState.phase3Selections.forEach(id => {
    const tech = project.techniques.find(t => t.id === id);
    if (tech) score += tech.value * (maxScore / (project.selectionLimit * 3));
  });

  score = Math.round(Math.min(score, maxScore));
  GameState.phase3Score += score;
  updateScore();
  playSound(score >= maxScore * 0.7 ? 'correct' : 'wrong');
  showScorePopup(score, score > 0);

  const percentage = Math.round((score / maxScore) * 100);
  const isGood = percentage >= 70;

  const idealNames = project.idealSelection
    .map(id => project.techniques.find(t => t.id === id)?.name)
    .filter(Boolean).join(', ');

  const resultEl = $('#strategy-result');
  resultEl.innerHTML = `
    <div class="strategy-result glass-card" style="margin-top:1.5rem">
      <h3>${isGood ? '✅' : '⚠️'} Strategy Assessment — ${percentage}%</h3>
      <div class="result-bar">
        <div class="result-bar-fill" style="width:${percentage}%;background:${isGood ? 'var(--green)' : 'var(--amber)'}"></div>
      </div>
      <p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.7;margin:0.75rem 0">
        <strong>Your selection:</strong> ${GameState.phase3Selections.map(id => project.techniques.find(t => t.id === id)?.name).join(', ')}
      </p>
      <p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.7;margin:0.25rem 0">
        <strong>Optimal selection:</strong> <span style="color:var(--green)">${idealNames}</span>
      </p>
      <div class="feedback-box ${isGood ? 'correct' : 'wrong'}" style="margin-top:0.75rem">
        <strong>Expert analysis:</strong> ${project.explanation}
      </div>
      <div class="misconception-alert" style="margin-top:0.75rem">
        <strong>💡 Key Insight:</strong> ${project.keyInsight}
      </div>
      <!-- Per-technique score breakdown -->
      <div class="tech-score-breakdown" style="margin-top:0.75rem">
        <div class="tech-score-title">📊 Technique Scores</div>
        ${GameState.phase3Selections.map(id => {
          const tech = project.techniques.find(t => t.id === id);
          const val = tech ? tech.value : 0;
          const dots = '●'.repeat(val) + '○'.repeat(3 - val);
          const col = val === 3 ? 'var(--green)' : val === 2 ? 'var(--cyan)' : val === 1 ? 'var(--amber)' : 'var(--red)';
          return `<div class="tech-score-row"><span>${tech?.name}</span><span style="color:${col};font-family:monospace">${dots} ${val}/3</span></div>`;
        }).join('')}
      </div>
      <p style="margin-top:0.75rem"><strong>+${score} points</strong></p>
      <div style="text-align:center;margin-top:1.5rem">
        <button class="btn btn-primary" onclick="nextPhase3Scenario()">
          ${GameState.phase3Current < PHASE3_SCENARIOS.length - 1 ? 'Next Project →' : 'Continue to Phase 4 →'}
        </button>
      </div>
    </div>
  `;

  // Always log key insight for educational value (regardless of score)
  GameState.phase3Insights.push(project.keyInsight);

  // Also log to misconceptions if performance was poor
  if (!isGood) {
    GameState.misconceptionsEncountered.push(project.keyInsight);
  }

  // Disable selection
  $$('.tech-select-item').forEach(el => { el.style.pointerEvents = 'none'; el.style.opacity = '0.5'; });
  $('#submit-strategy-btn').disabled = true;
}

function nextPhase3Scenario() {
  GameState.phase3Current++;
  GameState.phase3Selections = [];
  if (GameState.phase3Current < PHASE3_SCENARIOS.length) {
    renderPhase3Scenario();
  } else {
    goToPhase4();
  }
}

// ============================================================
// RESULTS SCREEN
// ============================================================
function showResults() {
  showScreen('results');
  const total = GameState.phase1Score + GameState.phase2Score + GameState.phase3Score + GameState.phase4Score;
  const maxTotal = SCORING.totalMax;
  const pct = Math.round((total / maxTotal) * 100);

  const grade = SCORING.grades.find(g => pct >= g.min);

  playSound('complete');

  $('#result-emoji').textContent = grade.emoji;
  $('#result-title').textContent = grade.label;
  $('#result-label').textContent = `${total} / ${maxTotal} points (${pct}%)`;

  $('#score-p1').textContent = `${GameState.phase1Score} / ${SCORING.phase1.maxScore}`;
  $('#score-p2').textContent = `${GameState.phase2Score} / ${SCORING.phase2.maxScore}`;
  $('#score-p3').textContent = `${GameState.phase3Score} / ${SCORING.phase3.maxScore}`;
  $('#score-p4').textContent = `${GameState.phase4Score} / ${SCORING.phase4.maxScore}`;

  $('#result-message').textContent = grade.message;

  // Animate bar with tier-based gradient
  const barColor = pct >= 90 ? '#06d6a0' : pct >= 75 ? '#00b4d8' : pct >= 60 ? '#f4c430' : pct >= 40 ? '#ff9f43' : '#ff6b6b';
  const barGradient = pct >= 90
    ? 'linear-gradient(90deg, #06d6a0, #00b4d8)'
    : pct >= 75 ? 'linear-gradient(90deg, #00b4d8, #06d6a0)'
    : pct >= 60 ? 'linear-gradient(90deg, #f4c430, #ff9f43)'
    : pct >= 40 ? 'linear-gradient(90deg, #ff9f43, #ff6b6b)'
    : 'linear-gradient(90deg, #ff6b6b, #ff4444)';
  setTimeout(() => {
    const fill = $('#total-score-fill');
    fill.style.width = `${pct}%`;
    fill.style.background = barGradient;
    fill.style.transition = 'width 1.2s cubic-bezier(0.22,1,0.36,1), background 0.6s ease';
  }, 300);

  // Misconceptions
  const miscEl = $('#misconceptions-list');
  if (GameState.misconceptionsEncountered.length > 0) {
    const unique = [...new Set(GameState.misconceptionsEncountered)];
    miscEl.innerHTML = unique.map(m => `<div class="misconception-item">⚠️ ${m}</div>`).join('');
  } else {
    miscEl.innerHTML = '<p style="color:var(--green);font-size:0.9rem">🎉 No misconceptions encountered — excellent understanding!</p>';
  }

  // Phase 3 Strategy Insights (always shown)
  const insightsEl = $('#phase3-insights-list');
  if (insightsEl && GameState.phase3Insights.length > 0) {
    insightsEl.innerHTML = GameState.phase3Insights.map((ins, i) => `
      <div class="insight-item">
        <span class="insight-num">${i + 1}</span>
        <span>${ins}</span>
      </div>
    `).join('');
    const container = $('#phase3-insights-container');
    if (container) container.classList.remove('hidden');
  }

  // Hints summary
  const hintSummaryEl = $('#hints-summary');
  if (hintSummaryEl) {
    if (GameState.hintsUsed > 0) {
      hintSummaryEl.innerHTML = `<div class="hint-summary-box">💡 ${GameState.hintsUsed} hint(s) used in Phase 1 — ${GameState.hintPenalty} pts penalty applied</div>`;
      hintSummaryEl.classList.remove('hidden');
    } else {
      hintSummaryEl.innerHTML = `<div class="hint-summary-box hint-summary-perfect">💡 No hints used — perfect independence!</div>`;
      hintSummaryEl.classList.remove('hidden');
    }
  }

  // Certificate button
  const actionsEl = $('.results-actions');
  if (actionsEl && !$('#cert-btn')) {
    const certBtn = document.createElement('button');
    certBtn.id = 'cert-btn';
    certBtn.className = 'btn btn-outline';
    certBtn.innerHTML = '📜 Download Certificate';
    certBtn.onclick = downloadCertificate;
    actionsEl.appendChild(certBtn);
  }

  const finalTotal = GameState.phase1Score + GameState.phase2Score + GameState.phase3Score + GameState.phase4Score;
  const runId = saveScoreToLeaderboard(finalTotal);
  renderLeaderboard(runId);
}

function saveScoreToLeaderboard(score) {
  let lb = JSON.parse(localStorage.getItem('testlab_leaderboard') || '[]');
  
  const existingIndex = lb.findIndex(entry => 
    entry.name === GameState.playerName && 
    entry.school === GameState.playerSchool
  );

  let runId;
  
  if (existingIndex !== -1) {
    runId = lb[existingIndex].id;
    if (score > lb[existingIndex].score) {
      lb[existingIndex].score = score;
      lb[existingIndex].date = new Date().toLocaleDateString();
    }
  } else {
    runId = Date.now().toString() + Math.random().toString().substring(2,5);
    lb.push({
      id: runId,
      name: GameState.playerName,
      school: GameState.playerSchool,
      score: score,
      date: new Date().toLocaleDateString()
    });
  }

  lb.sort((a, b) => b.score - a.score);
  lb = lb.slice(0, 1000); // Keep up to 1000 scores to find rank
  localStorage.setItem('testlab_leaderboard', JSON.stringify(lb));
  return runId;
}

function renderLeaderboard(currentRunId = null) {
  const lb = JSON.parse(localStorage.getItem('testlab_leaderboard') || '[]');
  
  const generateHTML = (list) => {
    if (list.length === 0) {
      return '<p style="color:var(--text-muted);text-align:center;">No scores yet! Be the first to play.</p>';
    }
    
    const top10 = list.slice(0, 10);
    let html = top10.map((entry, i) => {
      const isMe = entry.id === currentRunId;
      const bg = isMe ? 'background: rgba(6, 214, 160, 0.15);' : '';
      return `
        <div style="display: flex; justify-content: space-between; padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); ${bg}">
          <span><strong>${i + 1}. ${escapeHtml(entry.name)}</strong> <span style="font-size: 0.85em; opacity: 0.7;">(${escapeHtml(entry.school)})</span></span>
          <span style="font-weight: bold; color: var(--green);">${entry.score} pts</span>
        </div>
      `;
    }).join('');

    if (currentRunId) {
      const myIndex = list.findIndex(e => e.id === currentRunId);
      if (myIndex >= 10) {
        const myEntry = list[myIndex];
        html += `<div style="text-align: center; padding: 0.25rem; color: var(--text-muted); font-size: 0.8rem;">...</div>`;
        html += `
          <div style="display: flex; justify-content: space-between; padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(6, 214, 160, 0.15);">
            <span><strong>${myIndex + 1}. ${escapeHtml(myEntry.name)}</strong> <span style="font-size: 0.85em; opacity: 0.7;">(${escapeHtml(myEntry.school)})</span></span>
            <span style="font-weight: bold; color: var(--green);">${myEntry.score} pts</span>
          </div>
        `;
      }
    }
    return html;
  };

  const html = generateHTML(lb);

  const listEl = $('#leaderboard-list');
  if (listEl) listEl.innerHTML = html;

  const navListEl = $('#nav-leaderboard-list');
  if (navListEl) navListEl.innerHTML = html;
}

function toggleNavLeaderboard() {
  const dropdown = $('#nav-leaderboard-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
  }
}

function restartGame() {
  GameState.phase1Score = 0;
  GameState.phase2Score = 0;
  GameState.phase3Score = 0;
  GameState.phase2Current = 0;
  GameState.phase3Current = 0;
  GameState.phase3Selections = [];
  GameState.misconceptionsEncountered = [];
  GameState.phase1Placed = 0;
  GameState.tutorialSlide = 0;
  GameState.hintsUsed = 0;
  GameState.hintPenalty = 0;
  GameState.phase3Insights = [];
  GameState.phase4Score = 0;
  GameState.phase4Current = 0;
  dragDropInitialized = false;
  updateScore();
  showScreen('welcome');
}

// ============================================================
// CERTIFICATE (Canvas API)
// ============================================================
function downloadCertificate() {
  const canvas = document.createElement('canvas');
  canvas.width = 800; canvas.height = 520;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0a0e17';
  ctx.fillRect(0, 0, 800, 520);

  const grad = ctx.createLinearGradient(0, 0, 800, 520);
  grad.addColorStop(0, '#00b4d8'); grad.addColorStop(0.5, '#e040fb'); grad.addColorStop(1, '#06d6a0');
  ctx.strokeStyle = grad; ctx.lineWidth = 4;
  ctx.strokeRect(8, 8, 784, 504);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
  ctx.strokeRect(18, 18, 764, 484);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#00b4d8'; ctx.font = 'bold 12px sans-serif';
  ctx.fillText('ISO/IEC 29119-4  ·  TEST TECHNIQUES', 400, 55);

  ctx.fillStyle = '#f0f4f8'; ctx.font = 'bold 46px sans-serif';
  ctx.fillText('TestLab 29119', 400, 120);
  ctx.fillStyle = '#94a3b8'; ctx.font = '16px sans-serif';
  ctx.fillText('Certificate of Completion', 400, 155);

  ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 175); ctx.lineTo(720, 175); ctx.stroke();

  const total = GameState.phase1Score + GameState.phase2Score + GameState.phase3Score + GameState.phase4Score;
  const pct = Math.round((total / SCORING.totalMax) * 100);
  const grade = SCORING.grades.find(g => pct >= g.min);

  ctx.fillStyle = '#f0f4f8'; ctx.font = '15px sans-serif';
  ctx.fillText('This certifies mastery of ISO/IEC 29119-4 Test Techniques', 400, 215);

  ctx.font = '56px sans-serif';
  ctx.fillText(grade.emoji, 400, 290);

  ctx.fillStyle = '#00b4d8'; ctx.font = 'bold 28px sans-serif';
  ctx.fillText(grade.label, 400, 340);

  ctx.fillStyle = '#06d6a0'; ctx.font = 'bold 20px sans-serif';
  ctx.fillText(`${total} / ${SCORING.totalMax} points  (${pct}%)`, 400, 378);

  ctx.fillStyle = '#64748b'; ctx.font = '13px sans-serif';
  ctx.fillText(
    `P1: ${GameState.phase1Score}/${SCORING.phase1.maxScore}  ·  P2: ${GameState.phase2Score}/${SCORING.phase2.maxScore}  ·  P3: ${GameState.phase3Score}/${SCORING.phase3.maxScore}  ·  P4: ${GameState.phase4Score}/${SCORING.phase4.maxScore}`,
    400, 412
  );

  const dateStr = new Date().toLocaleDateString('en-GB', {day:'2-digit', month:'long', year:'numeric'});
  ctx.fillText(`Completed on ${dateStr}`, 400, 445);

  ctx.fillStyle = '#475569'; ctx.font = '11px sans-serif';
  ctx.fillText('SENG 436  ·  Çankaya University  ·  Learner-as-Designer Project', 400, 482);

  const link = document.createElement('a');
  link.download = 'TestLab-29119-Certificate.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ============================================================
// THEME
// ============================================================
let isDarkMode = true;
function initTheme() {
  const savedTheme = localStorage.getItem('testlab_theme');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (savedTheme === 'light') {
    isDarkMode = false;
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeToggleBtn) themeToggleBtn.innerText = '🌙';
  } else {
    isDarkMode = true;
    document.documentElement.removeAttribute('data-theme');
    if (themeToggleBtn) themeToggleBtn.innerText = '☀️';
  }
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (isDarkMode) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('testlab_theme', 'dark');
    if (themeToggleBtn) themeToggleBtn.innerText = '☀️';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('testlab_theme', 'light');
    if (themeToggleBtn) themeToggleBtn.innerText = '🌙';
  }
}

// ============================================================
// PHASE 4: WRITE YOUR TEST CASES
// ============================================================
function goToPhase4() {
  GameState.phase4Score = 0;
  GameState.phase4Current = 0;
  showScreen('phase4');
  renderPhase4Exercise();
}

function renderPhase4Exercise() {
  const ex = PHASE4_EXERCISES[GameState.phase4Current];
  if (!ex) { showResults(); return; }

  $('#phase4-progress').textContent = `${GameState.phase4Current + 1} / ${PHASE4_EXERCISES.length}`;

  const container = $('#phase4-content');
  container.innerHTML = `
    <div class="glass-card p4-exercise-card">
      <div class="p4-header">
        <span class="phase-tag p4" style="font-size:0.72rem">${ex.technique}</span>
        <h3 class="p4-title">${ex.title}</h3>
        <p class="p4-desc">${ex.description}</p>
      </div>
      <div class="p4-legend">
        <span class="cov-badge cat-EP">EP</span> Equivalence Partitioning &nbsp;|&nbsp;
        <span class="cov-badge cat-BVA">BVA</span> Boundary Value Analysis &nbsp;|&nbsp;
        <span class="cov-badge cat-EXTRA">EXTRA</span> Out of scope for EP/BVA
      </div>
      <div class="coverage-items-grid" id="coverage-items">
        ${ex.coverageItems.map(item => `
          <div class="coverage-item" data-id="${item.id}" data-required="${item.required}" onclick="toggleCoverageItem(this)">
            <span class="cov-checkbox">☐</span>
            <span class="cov-badge cat-${item.category}">${item.category}</span>
            <span class="cov-label">${item.label}</span>
          </div>
        `).join('')}
      </div>
      <div class="p4-actions">
        <button class="btn btn-success btn-lg" id="p4-submit-btn" onclick="submitPhase4()">✓ Submit Test Plan</button>
      </div>
      <div id="phase4-result"></div>
    </div>
  `;
}

function toggleCoverageItem(el) {
  if (el.style.pointerEvents === 'none') return;
  el.classList.toggle('selected');
  el.querySelector('.cov-checkbox').textContent = el.classList.contains('selected') ? '☑' : '☐';
}

function submitPhase4() {
  const ex = PHASE4_EXERCISES[GameState.phase4Current];
  const selectedIds = [...document.querySelectorAll('.coverage-item.selected')].map(el => el.dataset.id);

  let score = 0;
  let requiredHit = 0;
  const requiredItems = ex.coverageItems.filter(i => i.required);
  const extraSelected = ex.coverageItems.filter(i => !i.required && selectedIds.includes(i.id)).length;

  requiredItems.forEach(item => {
    if (selectedIds.includes(item.id)) { score += SCORING.phase4.pointsPerRequired; requiredHit++; }
  });
  score = Math.max(0, score - extraSelected * SCORING.phase4.extraPenalty);
  score = Math.min(score, ex.maxPoints);

  GameState.phase4Score += score;
  updateScore();
  playSound(score >= ex.maxPoints * 0.7 ? 'correct' : 'wrong');
  showScorePopup(score, score > 0);

  const pct = Math.round((requiredHit / requiredItems.length) * 100);

  // Visual feedback on items
  document.querySelectorAll('.coverage-item').forEach(el => {
    el.style.pointerEvents = 'none';
    const isRequired = el.dataset.required === 'true';
    const isSelected = el.classList.contains('selected');
    if (isRequired && isSelected)  el.classList.add('cov-correct');
    if (isRequired && !isSelected) el.classList.add('cov-missed');
    if (!isRequired && isSelected) el.classList.add('cov-wrong');
  });

  $('#p4-submit-btn').disabled = true;

  const resultEl = $('#phase4-result');
  resultEl.innerHTML = `
    <div class="feedback-box ${score >= ex.maxPoints * 0.7 ? 'correct' : 'wrong'}" style="margin-top:1.25rem">
      <strong>Coverage: ${requiredHit} / ${requiredItems.length} required test cases selected (${pct}%)</strong><br>
      ${pct === 100
        ? '✅ Perfect! You identified all required EP and BVA test cases.'
        : `⚠️ You missed ${requiredItems.length - requiredHit} required test case(s). Check the red-highlighted items above — EP needs one value per partition; BVA needs all 4 boundary values.`
      }
      ${extraSelected > 0 ? `<br><span style="color:var(--amber)">⚠️ ${extraSelected} out-of-scope item(s) selected — small penalty applied.</span>` : ''}
      <br><strong>+${score} points</strong>
    </div>
    <div style="text-align:center;margin-top:1rem">
      <button class="btn btn-primary btn-lg" onclick="nextPhase4Exercise()">
        ${GameState.phase4Current < PHASE4_EXERCISES.length - 1 ? 'Next Exercise →' : 'See Final Results →'}
      </button>
    </div>
  `;
}

function nextPhase4Exercise() {
  GameState.phase4Current++;
  if (GameState.phase4Current < PHASE4_EXERCISES.length) {
    renderPhase4Exercise();
  } else {
    showResults();
  }
}

// ============================================================
// REFERENCE PANEL (Glossary)
// ============================================================
let refPanelOpen = false;

function toggleReferencePanel() {
  refPanelOpen = !refPanelOpen;
  const panel = $('#reference-panel');
  const overlay = $('#ref-overlay');
  if (refPanelOpen) {
    panel.classList.remove('hidden');
    overlay.classList.remove('hidden');
    renderReferenceList('');
    setTimeout(() => { const inp = $('#ref-search'); if (inp) inp.focus(); }, 150);
  } else {
    panel.classList.add('hidden');
    overlay.classList.add('hidden');
  }
}

function filterReference(val) {
  renderReferenceList(val);
}

function renderReferenceList(filter) {
  const items = [];

  // All techniques from TECHNIQUES object
  Object.values(TECHNIQUES).forEach(cat => {
    cat.techniques.forEach(t => {
      items.push({
        name: t.name,
        clause: t.isoClause,
        desc: t.desc,
        catLabel: cat.label,
        catId: cat.id
      });
    });
  });

  // Extra ISO terms
  GLOSSARY_EXTRAS.forEach(e => {
    items.push({ name: e.name, clause: e.clause, desc: e.desc, catLabel: e.clause, catId: 'extra' });
  });

  items.sort((a, b) => a.name.localeCompare(b.name));

  const f = filter.toLowerCase();
  const filtered = f
    ? items.filter(i => i.name.toLowerCase().includes(f) || i.desc.toLowerCase().includes(f))
    : items;

  const catDotClass = (id) => {
    if (id === 'specification-based') return 'spec';
    if (id === 'structure-based')     return 'struct';
    if (id === 'experience-based')    return 'exp';
    return '';
  };

  const listEl = $('#ref-list');
  if (!listEl) return;

  if (filtered.length === 0) {
    listEl.innerHTML = '<p class="ref-empty">No results found.</p>';
    return;
  }

  listEl.innerHTML = filtered.map(i => `
    <div class="ref-item">
      <div class="ref-item-header">
        ${catDotClass(i.catId) ? `<span class="cat-dot ${catDotClass(i.catId)}"></span>` : ''}
        <span class="ref-name">${i.name}</span>
        <span class="ref-clause">${i.clause}</span>
      </div>
      <p class="ref-desc">${i.desc}</p>
    </div>
  `).join('');
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  showScreen('welcome');
  renderLeaderboard();
  
  // Close nav leaderboard on outside click
  document.addEventListener('click', e => {
    const container = e.target.closest('.nav-leaderboard-container');
    const dropdown = $('#nav-leaderboard-dropdown');
    if (!container && dropdown && !dropdown.classList.contains('hidden')) {
      dropdown.classList.add('hidden');
    }
  });

  // Load best score from localStorage
  const best = localStorage.getItem('testlab-best');
  if (best) { const el = $('#best-value'); if (el) el.textContent = best; }
  // Keyboard shortcut: Escape closes modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeTechModal();
    if (e.key === 'Escape' && refPanelOpen) toggleReferencePanel();
    // Phase 2: A/B/C/D keyboard shortcuts
    if (GameState.currentScreen === 'phase2' && !$('#scenario-feedback:not(.hidden)')) {
      const map = { 'a':'a','b':'b','c':'c','d':'d' };
      const key = e.key.toLowerCase();
      if (map[key]) {
        const btn = $(`.option-btn[data-id="${key}"]`);
        if (btn && !btn.disabled) btn.click();
      }
    }
  });
});

