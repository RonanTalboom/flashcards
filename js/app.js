import { CARDS } from "./cards.js";
import { sm2, today, yesterday } from "./sm2.js";
import { initState, saveState, resetState } from "./storage.js";

const MAX_NEW_PER_SESSION = 10;

let state;
let queue = [];
let currentIndex = 0;
let isFlipped = false;

function getDueCards() {
  const t = today();
  return CARDS.filter((card) => {
    const s = state.cards[card.id];
    return s.nextReviewDate <= t;
  });
}

function getNewCards() {
  return CARDS.filter((card) => {
    const s = state.cards[card.id];
    return s.repetitions === 0 && s.interval === 0;
  });
}

function getLearnedCount() {
  return CARDS.filter((card) => {
    const s = state.cards[card.id];
    return s.repetitions > 0;
  }).length;
}

function updateStreak() {
  const t = today();
  const y = yesterday();

  if (state.stats.lastReviewDate === t) return;
  if (state.stats.lastReviewDate === y) {
    state.stats.streak++;
  } else {
    state.stats.streak = 1;
  }
  state.stats.lastReviewDate = t;
  saveState(state);
}

function buildQueue() {
  const due = getDueCards();
  const newCards = due.filter((c) => {
    const s = state.cards[c.id];
    return s.repetitions === 0 && s.interval === 0;
  });
  const reviewCards = due.filter((c) => {
    const s = state.cards[c.id];
    return !(s.repetitions === 0 && s.interval === 0);
  });

  // Cap new cards, include all review cards
  const cappedNew = newCards.slice(0, MAX_NEW_PER_SESSION);
  queue = [...reviewCards, ...cappedNew];
  currentIndex = 0;
}

// --- Rendering ---

const app = document.getElementById("app");

function render() {
  if (queue.length === 0 || currentIndex >= queue.length) {
    renderDone();
  } else {
    renderCard();
  }
}

function renderDashboard() {
  const due = getDueCards();
  const newCount = getNewCards().length;
  const learned = getLearnedCount();

  app.innerHTML = `
    <div class="container">
      <header>
        <h1>Flashcards</h1>
        <div class="streak">${state.stats.streak > 0 ? state.stats.streak + "d streak" : ""}</div>
      </header>
      <div class="stats-row">
        <div class="stat">
          <span class="stat-value">${due.length}</span>
          <span class="stat-label">Due today</span>
        </div>
        <div class="stat">
          <span class="stat-value">${learned}</span>
          <span class="stat-label">Learned</span>
        </div>
        <div class="stat">
          <span class="stat-value">${CARDS.length}</span>
          <span class="stat-label">Total</span>
        </div>
      </div>
      ${
        due.length > 0
          ? `<button class="btn-start" id="start-btn">Study ${Math.min(due.length, MAX_NEW_PER_SESSION + getDueCards().filter(c => state.cards[c.id].repetitions > 0).length)} cards</button>`
          : `<div class="done-message">
              <p class="done-icon">&#10003;</p>
              <p>All caught up! Come back tomorrow.</p>
            </div>`
      }
      <div class="category-list">
        ${getCategoryBreakdown()}
      </div>
    </div>
  `;

  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      buildQueue();
      if (queue.length > 0) {
        updateStreak();
        render();
      }
    });
  }
}

function getCategoryBreakdown() {
  const cats = {};
  for (const card of CARDS) {
    if (!cats[card.category]) cats[card.category] = { total: 0, learned: 0 };
    cats[card.category].total++;
    if (state.cards[card.id].repetitions > 0) cats[card.category].learned++;
  }
  return Object.entries(cats)
    .map(
      ([name, { total, learned }]) =>
        `<div class="category-item">
          <span class="category-name">${name}</span>
          <span class="category-progress">${learned}/${total}</span>
        </div>`
    )
    .join("");
}

function renderCard() {
  const card = queue[currentIndex];
  const progress = `${currentIndex + 1} / ${queue.length}`;
  isFlipped = false;

  app.innerHTML = `
    <div class="container">
      <header>
        <span class="progress">${progress}</span>
        <span class="category-badge">${card.category}</span>
      </header>
      <div class="card-container" id="card">
        <div class="card-inner">
          <div class="card-front">
            <p class="card-text">${card.front}</p>
          </div>
          <div class="card-back">
            <p class="card-answer">${card.back}</p>
            <ul class="key-points">
              ${card.keyPoints.map((p) => `<li>${p}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
      <div id="controls">
        <p class="hint" id="flip-hint">Tap to reveal</p>
      </div>
    </div>
  `;

  document.getElementById("card").addEventListener("click", flipCard);
}

function flipCard() {
  if (isFlipped) return;
  isFlipped = true;

  const inner = document.querySelector(".card-inner");
  inner.classList.add("flipped");

  document.getElementById("controls").innerHTML = `
    <div class="rating-buttons">
      <button class="rate-btn rate-again" data-grade="0">
        <span class="rate-label">Again</span>
      </button>
      <button class="rate-btn rate-hard" data-grade="2">
        <span class="rate-label">Hard</span>
      </button>
      <button class="rate-btn rate-good" data-grade="4">
        <span class="rate-label">Good</span>
      </button>
      <button class="rate-btn rate-easy" data-grade="5">
        <span class="rate-label">Easy</span>
      </button>
    </div>
  `;

  document.querySelectorAll(".rate-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const grade = parseInt(e.currentTarget.dataset.grade);
      rateCard(grade);
    });
  });
}

function rateCard(grade) {
  const card = queue[currentIndex];
  const cardState = state.cards[card.id];
  const updated = sm2(cardState, grade);
  state.cards[card.id] = updated;
  state.stats.totalReviews++;
  saveState(state);

  // If failed, add card back to end of queue
  if (grade < 3) {
    queue.push(card);
  }

  currentIndex++;
  render();
}

function renderDone() {
  const learned = getLearnedCount();

  app.innerHTML = `
    <div class="container">
      <header>
        <h1>Flashcards</h1>
      </header>
      <div class="done-screen">
        <p class="done-icon">&#10003;</p>
        <h2>Session complete</h2>
        <div class="stats-row">
          <div class="stat">
            <span class="stat-value">${state.stats.streak}</span>
            <span class="stat-label">Day streak</span>
          </div>
          <div class="stat">
            <span class="stat-value">${learned}</span>
            <span class="stat-label">Learned</span>
          </div>
          <div class="stat">
            <span class="stat-value">${state.stats.totalReviews}</span>
            <span class="stat-label">Total reviews</span>
          </div>
        </div>
        <button class="btn-start" id="back-btn">Back to dashboard</button>
      </div>
    </div>
  `;

  document.getElementById("back-btn").addEventListener("click", renderDashboard);
}

// --- Init ---

state = initState();
renderDashboard();
