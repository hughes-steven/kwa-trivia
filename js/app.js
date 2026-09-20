/* KW AccessAbility Trivia — game logic (no build step, no dependencies) */
(function () {
  "use strict";

  const DATA = window.KWA_TRIVIA;
  const STORAGE_KEY = "kwa-trivia-game-v1";
  const PREFS_KEY = "kwa-trivia-prefs-v1";
  const LETTERS = ["A", "B", "C", "D", "E", "F"];

  if (!DATA || !Array.isArray(DATA.categories) || !DATA.categories.length) {
    document.getElementById("main").innerHTML =
      '<p role="alert">Sorry, the question file could not be loaded. Check <code>data/questions.js</code>.</p>';
    return;
  }

  /* ---------------------------------------------------------------------
     DOM helpers
     --------------------------------------------------------------------- */
  const $ = (id) => document.getElementById(id);
  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    for (const c of [].concat(children)) if (c != null) node.append(c);
    return node;
  };

  let announceTimer;
  function announce(message, assertive) {
    const region = $(assertive ? "announcer-assertive" : "announcer");
    clearTimeout(announceTimer);
    region.textContent = "";
    // Small delay so identical consecutive messages are re-announced.
    announceTimer = setTimeout(() => { region.textContent = message; }, 50);
  }

  function safeGet(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function safeSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode etc. */ }
  }
  function safeRemove(key) {
    try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
  }

  /* ---------------------------------------------------------------------
     State
     --------------------------------------------------------------------- */
  const screens = {
    setup: $("screen-setup"),
    board: $("screen-board"),
    category: $("screen-category"),
    question: $("screen-question"),
    results: $("screen-results"),
  };

  let game = null;        // { teams:[{name,score}], timer:Number, used:{"c-q":true}, started:ISO }
  let current = null;     // { c, q, chosen:Number|null, revealed:Boolean }
  let currentCategory = null;
  let timer = { total: 0, left: 0, id: null, running: false };
  let lastFocus = null;   // element to return focus to when going back

  const totalQuestions = DATA.categories.reduce((n, c) => n + c.questions.length, 0);
  const usedCount = () => Object.keys(game.used).length;
  const isUsed = (c, q) => Boolean(game.used[c + "-" + q]);

  /* ---------------------------------------------------------------------
     Screens & focus management
     --------------------------------------------------------------------- */
  function show(name, focusEl) {
    for (const [key, node] of Object.entries(screens)) node.hidden = key !== name;
    const target = focusEl || screens[name].querySelector("h1");
    if (target) {
      // Let the browser paint first so screen readers pick up the new heading.
      requestAnimationFrame(() => target.focus({ preventScroll: false }));
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  /* ---------------------------------------------------------------------
     Preferences (text size)
     --------------------------------------------------------------------- */
  function applyTextSize(size) {
    document.documentElement.setAttribute("data-textsize", size);
    document.querySelectorAll("[data-textsize]").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.textsize === size));
    });
    safeSet(PREFS_KEY, { textsize: size });
  }
  document.querySelectorAll("[data-textsize]").forEach((b) => {
    b.addEventListener("click", () => {
      applyTextSize(b.dataset.textsize);
      announce("Text size: " + b.textContent.trim());
    });
  });
  applyTextSize((safeGet(PREFS_KEY) || {}).textsize || "normal");

  /* ---------------------------------------------------------------------
     Setup screen
     --------------------------------------------------------------------- */
  const setupForm = $("setup-form");
  const teamNames = $("team-names");

  function renderTeamNameInputs() {
    const count = Number(setupForm.teamCount.value);
    const existing = [...teamNames.querySelectorAll("input")].map((i) => i.value);
    teamNames.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const id = "team-name-" + i;
      teamNames.append(
        el("label", { for: id }, [
          "Team " + (i + 1) + " name",
          el("input", { id, type: "text", maxlength: "30", autocomplete: "off", value: existing[i] || "" }),
        ])
      );
    }
  }
  setupForm.addEventListener("change", (e) => {
    if (e.target.name === "teamCount") renderTeamNameInputs();
  });
  renderTeamNameInputs();

  setupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const count = Number(setupForm.teamCount.value);
    const inputs = [...teamNames.querySelectorAll("input")];
    const teams = inputs.map((input, i) => ({
      name: input.value.trim() || "Team " + (i + 1),
      score: 0,
    })).slice(0, count);
    game = {
      teams,
      timer: Number(setupForm.timer.value),
      used: {},
      started: new Date().toISOString(),
    };
    save();
    renderBoard();
    show("board");
    announce("Game started. " + (teams.length ? teams.length + " teams. " : "") + "Choose a category.");
  });

  $("btn-resume").addEventListener("click", () => {
    renderBoard();
    show("board");
    announce("Saved game loaded. " + usedCount() + " of " + totalQuestions + " questions already used.");
  });

  /* ---------------------------------------------------------------------
     Persistence
     --------------------------------------------------------------------- */
  function save() { if (game) safeSet(STORAGE_KEY, game); }

  function loadSaved() {
    const saved = safeGet(STORAGE_KEY);
    if (saved && saved.used && Array.isArray(saved.teams)) {
      game = saved;
      $("btn-resume").hidden = false;
      $("btn-resume").textContent = "Continue saved game (" + usedCount() + " of " + totalQuestions + " used)";
    }
  }

  /* ---------------------------------------------------------------------
     Board (categories)
     --------------------------------------------------------------------- */
  function renderBoard() {
    const grid = $("category-grid");
    grid.innerHTML = "";
    DATA.categories.forEach((cat, c) => {
      const remaining = cat.questions.filter((_, q) => !isUsed(c, q)).length;
      const done = remaining === 0;
      const meta = done ? "All " + cat.questions.length + " answered" : remaining + " of " + cat.questions.length + " left";
      const btn = el("button", {
        type: "button",
        class: "category-card" + (done ? " done" : ""),
        "data-cat": c,
        "aria-label": cat.name + ", " + meta,
        onclick: () => openCategory(c, btn),
      }, [
        el("span", { class: "name", "aria-hidden": "true", text: cat.name }),
        el("span", { class: "meta", "aria-hidden": "true", text: meta }),
      ]);
      grid.append(el("div", { role: "listitem" }, btn));
    });
    $("board-progress").textContent = usedCount() + " of " + totalQuestions + " questions used.";
    renderScores();
  }

  function renderScores() {
    const lists = [$("score-list"), $("score-list-q")];
    const hasTeams = game.teams.length > 0;
    $("scoreboard").hidden = false;
    document.querySelector(".scoreboard-compact").hidden = !hasTeams;
    lists.forEach((list, idx) => {
      list.innerHTML = "";
      if (!hasTeams) {
        list.append(el("li", { class: "hint", text: "Playing just for fun. No scores this game." }));
        return;
      }
      game.teams.forEach((team, t) => {
        const item = el("li", { class: "score-item" }, [
          el("span", { class: "team", text: team.name }),
          el("span", { class: "score", "aria-label": team.name + " score: " + team.score, text: String(team.score) }),
        ]);
        if (idx === 0) {
          // Full scoreboard on the board screen gets +/- controls for corrections.
          item.append(el("span", { class: "score-ctl" }, [
            el("button", { type: "button", class: "btn btn-ghost btn-small", "aria-label": "Remove one point from " + team.name, text: "−1", onclick: () => adjust(t, -1) }),
            el("button", { type: "button", class: "btn btn-ghost btn-small", "aria-label": "Add one point to " + team.name, text: "+1", onclick: () => adjust(t, 1) }),
          ]));
        }
        list.append(item);
      });
    });
  }

  function adjust(t, delta) {
    game.teams[t].score = Math.max(0, game.teams[t].score + delta);
    save();
    renderScores();
    announce(game.teams[t].name + ": " + game.teams[t].score + " points.");
  }

  function pickRandom(catIndex) {
    const pool = [];
    DATA.categories.forEach((cat, c) => {
      if (catIndex != null && c !== catIndex) return;
      cat.questions.forEach((_, q) => { if (!isUsed(c, q)) pool.push([c, q]); });
    });
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  $("btn-random").addEventListener("click", (e) => {
    const pick = pickRandom(null);
    if (!pick) { announce("Every question has been used. Press End game to see the scores.", true); return; }
    lastFocus = e.currentTarget;
    openQuestion(pick[0], pick[1]);
  });

  $("btn-random-category").addEventListener("click", (e) => {
    const pick = pickRandom(currentCategory);
    if (!pick) { announce("Every question in this category has been used.", true); return; }
    lastFocus = e.currentTarget;
    openQuestion(pick[0], pick[1]);
  });

  $("btn-end").addEventListener("click", async () => {
    const ok = await confirm("End the game now and show the final scores?");
    if (ok) showResults();
  });

  /* ---------------------------------------------------------------------
     Category screen (question tiles)
     --------------------------------------------------------------------- */
  function openCategory(c, fromEl) {
    currentCategory = c;
    lastFocus = fromEl || null;
    renderCategory();
    show("category");
  }

  function renderCategory() {
    const c = currentCategory;
    const cat = DATA.categories[c];
    $("category-heading").textContent = cat.name;
    const remaining = cat.questions.filter((_, q) => !isUsed(c, q)).length;
    $("category-progress").textContent = remaining
      ? "Choose a question. " + remaining + " of " + cat.questions.length + " left."
      : "All questions in this category have been answered.";
    const grid = $("tile-grid");
    grid.innerHTML = "";
    cat.questions.forEach((_, q) => {
      const used = isUsed(c, q);
      const tile = el("button", {
        type: "button",
        class: "tile" + (used ? " used" : ""),
        "aria-label": "Question " + (q + 1) + (used ? ", already answered" : ""),
        onclick: () => { lastFocus = tile; openQuestion(c, q); },
      }, [
        el("span", { "aria-hidden": "true", text: String(q + 1) }),
        el("span", { class: "label", "aria-hidden": "true", text: used ? "Answered" : "Question" }),
      ]);
      if (used) tile.setAttribute("aria-disabled", "true");
      grid.append(el("div", { role: "listitem" }, tile));
    });
    $("btn-random-category").disabled = remaining === 0;
  }

  $("btn-back-board").addEventListener("click", () => {
    renderBoard();
    const target = $("category-grid").querySelector('[data-cat="' + currentCategory + '"]');
    show("board", target);
  });

  /* ---------------------------------------------------------------------
     Question screen
     --------------------------------------------------------------------- */
  function openQuestion(c, q) {
    if (isUsed(c, q)) {
      // Allow re-viewing an answered question, but make it clear it's been used.
      announce("This question was already answered. Showing it again for review.");
    }
    current = { c, q, chosen: null, revealed: false };
    currentCategory = c;
    const cat = DATA.categories[c];
    const item = cat.questions[q];

    $("question-eyebrow").textContent = cat.name + " · Question " + (q + 1) + " of " + cat.questions.length;
    $("question-heading").textContent = item.q;

    const options = $("options");
    options.innerHTML = "";
    item.options.forEach((text, i) => {
      const letter = LETTERS[i];
      const btn = el("button", {
        type: "button",
        class: "option",
        "data-index": i,
        "aria-pressed": "false",
        onclick: () => choose(i),
      }, [
        el("span", { class: "letter", "aria-hidden": "true", text: letter }),
        el("span", { class: "sr-only", text: letter + ". " }),
        el("span", { class: "text", text: text }),
        el("span", { class: "status", "aria-hidden": "true" }),
      ]);
      options.append(btn);
    });

    $("reveal").hidden = true;
    $("btn-reveal").hidden = false;
    $("btn-cancel").hidden = false;
    $("btn-next").hidden = true;
    btnTimerStart.disabled = false;
    $("btn-timer-reset").disabled = false;
    setupTimer();
    renderScores();
    show("question");
    announce(cat.name + ", question " + (q + 1) + ". " + item.q + " Choices: " +
      item.options.map((t, i) => LETTERS[i] + ", " + t).join(". "));
  }

  function choose(i) {
    if (!current || current.revealed) return;
    current.chosen = i;
    document.querySelectorAll("#options .option").forEach((b) => {
      b.setAttribute("aria-pressed", String(Number(b.dataset.index) === i));
    });
    reveal();
  }

  function reveal() {
    if (!current || current.revealed) return;
    current.revealed = true;
    stopTimer(true);
    const item = DATA.categories[current.c].questions[current.q];
    const correct = item.answer;
    const chosen = current.chosen;

    document.querySelectorAll("#options .option").forEach((b) => {
      const i = Number(b.dataset.index);
      b.classList.add("revealed");
      b.disabled = true;
      const status = b.querySelector(".status");
      if (i === correct) {
        b.classList.add("correct");
        status.textContent = "✓ Correct answer";
      } else if (i === chosen) {
        b.classList.add("wrong");
        status.textContent = "✗ Not this one";
      }
    });

    let message;
    if (chosen == null) {
      message = "The answer is " + LETTERS[correct] + ": " + item.options[correct] + ".";
    } else if (chosen === correct) {
      message = "Correct! The answer is " + LETTERS[correct] + ": " + item.options[correct] + ".";
    } else {
      message = "Not quite. " + LETTERS[chosen] + " was chosen. The correct answer is " +
        LETTERS[correct] + ": " + item.options[correct] + ".";
    }
    $("reveal-text").textContent = message;

    // Award buttons
    const award = $("award");
    const buttons = $("award-buttons");
    buttons.innerHTML = "";
    if (game.teams.length) {
      award.hidden = false;
      game.teams.forEach((team, t) => {
        buttons.append(el("button", {
          type: "button", class: "btn btn-secondary",
          "aria-label": "Give a point to " + team.name,
          text: team.name + " +1",
          onclick: (e) => {
            adjust(t, 1);
            e.currentTarget.textContent = team.name + " ✓ (" + team.score + ")";
            e.currentTarget.setAttribute("aria-label", "Point given to " + team.name + ". Score " + team.score + ". Press again to add another.");
          },
        }));
      });
    } else {
      award.hidden = true;
    }

    game.used[current.c + "-" + current.q] = true;
    save();

    $("reveal").hidden = false;
    $("btn-reveal").hidden = true;
    $("btn-cancel").hidden = true;
    $("btn-next").hidden = false;
    btnTimerStart.disabled = true;
    $("btn-timer-reset").disabled = true;
    announce(message, true);
    requestAnimationFrame(() => $("btn-next").focus());
  }

  $("btn-reveal").addEventListener("click", reveal);

  function leaveQuestion() {
    stopTimer(true);
    current = null;
    renderCategory();
    // Return to the category tiles, focusing the tile we came from (or the first unused).
    const tiles = [...$("tile-grid").querySelectorAll(".tile")];
    const target = tiles.find((t) => !t.classList.contains("used")) || $("btn-back-board");
    show("category", target);
  }

  $("btn-next").addEventListener("click", () => {
    const allDone = usedCount() >= totalQuestions;
    if (allDone) { showResults(); return; }
    leaveQuestion();
  });

  $("btn-cancel").addEventListener("click", () => {
    // Cancelling before reveal does not mark the question as used.
    leaveQuestion();
  });

  /* ---------------------------------------------------------------------
     Timer — host-controlled, never auto-starts (WCAG 2.2.1 Timing Adjustable)
     --------------------------------------------------------------------- */
  const timerBox = $("timer");
  const timerValue = $("timer-value");
  const timerFill = $("timer-fill");
  const btnTimerStart = $("btn-timer-start");

  function setupTimer() {
    stopTimer(true);
    timer.total = game.timer;
    timer.left = game.timer;
    timerBox.hidden = !game.timer;
    timerBox.classList.remove("low", "done");
    renderTimer();
  }

  function renderTimer() {
    timerValue.textContent = timer.left + " s";
    timerFill.style.width = timer.total ? (timer.left / timer.total) * 100 + "%" : "0%";
    btnTimerStart.textContent = timer.running ? "Pause timer" : (timer.left === timer.total ? "Start timer" : "Resume timer");
    timerBox.setAttribute("aria-label", "Timer, " + timer.left + " seconds remaining");
  }

  function tick() {
    timer.left -= 1;
    if (timer.left <= 10) timerBox.classList.add("low");
    if (timer.left === Math.ceil(timer.total / 2) && timer.total >= 20) announce(timer.left + " seconds left.");
    if (timer.left === 10 && timer.total > 15) announce("10 seconds left.");
    if (timer.left === 5) announce("5 seconds left.");
    if (timer.left <= 0) {
      timer.left = 0;
      stopTimer(false);
      timerBox.classList.add("done");
      announce("Time's up.", true);
    }
    renderTimer();
  }

  function startTimer() {
    if (timer.running || timer.left <= 0) return;
    timer.running = true;
    timer.id = setInterval(tick, 1000);
    renderTimer();
    announce("Timer started. " + timer.left + " seconds.");
  }

  function stopTimer(silent) {
    if (timer.id) clearInterval(timer.id);
    timer.id = null;
    const wasRunning = timer.running;
    timer.running = false;
    renderTimer();
    if (wasRunning && !silent) announce("Timer paused at " + timer.left + " seconds.");
  }

  btnTimerStart.addEventListener("click", () => {
    if (timer.running) stopTimer(false);
    else startTimer();
  });

  $("btn-timer-reset").addEventListener("click", () => {
    stopTimer(true);
    timer.left = timer.total;
    timerBox.classList.remove("low", "done");
    renderTimer();
    announce("Timer reset to " + timer.total + " seconds.");
  });

  /* ---------------------------------------------------------------------
     Results
     --------------------------------------------------------------------- */
  function showResults() {
    stopTimer(true);
    const list = $("final-scores");
    list.innerHTML = "";
    const summary = $("results-summary");
    if (!game.teams.length) {
      summary.textContent = "Thanks for playing! You went through " + usedCount() + " of " + totalQuestions + " questions.";
      list.append(el("li", { text: "No scores were kept this game." }));
    } else {
      const ranked = game.teams.map((t) => ({ ...t })).sort((a, b) => b.score - a.score);
      const top = ranked[0].score;
      const winners = ranked.filter((t) => t.score === top);
      summary.textContent = winners.length > 1
        ? "It's a tie between " + winners.map((w) => w.name).join(" and ") + " with " + top + " points each!"
        : winners[0].name + " wins with " + top + " point" + (top === 1 ? "" : "s") + "!";
      ranked.forEach((t) => {
        list.append(el("li", {
          class: t.score === top ? "winner" : "",
          text: t.name + ": " + t.score + " point" + (t.score === 1 ? "" : "s") + (t.score === top ? " (winner)" : ""),
        }));
      });
    }
    show("results");
    announce("Game over. " + summary.textContent);
  }

  $("btn-new-game").addEventListener("click", async () => {
    const ok = await confirm("Start a brand new game? The current scores and used questions will be cleared.");
    if (!ok) return;
    safeRemove(STORAGE_KEY);
    game = null;
    $("btn-resume").hidden = true;
    show("setup");
  });

  $("btn-results-back").addEventListener("click", () => {
    renderBoard();
    show("board");
  });

  /* ---------------------------------------------------------------------
     Dialogs
     --------------------------------------------------------------------- */
  const helpDialog = $("help-dialog");
  $("btn-help").addEventListener("click", () => helpDialog.showModal());

  const confirmDialog = $("confirm-dialog");
  function confirm(text) {
    return new Promise((resolve) => {
      $("confirm-text").textContent = text;
      const onClose = () => {
        confirmDialog.removeEventListener("close", onClose);
        resolve(confirmDialog.returnValue === "yes");
      };
      confirmDialog.addEventListener("close", onClose);
      confirmDialog.returnValue = "no";
      confirmDialog.showModal();
    });
  }

  /* ---------------------------------------------------------------------
     Keyboard shortcuts (never intercept typing in a field or a dialog)
     --------------------------------------------------------------------- */
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable) return;
    if (document.querySelector("dialog[open]")) return;

    if (!screens.question.hidden && current) {
      const key = e.key.toUpperCase();
      const idx = LETTERS.indexOf(key);
      const item = DATA.categories[current.c].questions[current.q];
      if (idx > -1 && idx < item.options.length && !current.revealed) { e.preventDefault(); choose(idx); return; }
      if (key === "R" && !current.revealed) { e.preventDefault(); reveal(); return; }
      if (e.key === "Escape") { e.preventDefault(); (current.revealed ? $("btn-next") : $("btn-cancel")).click(); return; }
    } else if (!screens.category.hidden && e.key === "Escape") {
      e.preventDefault(); $("btn-back-board").click();
    }
  });

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */
  document.title = DATA.title || document.title;
  loadSaved();
  show("setup", null);
})();
