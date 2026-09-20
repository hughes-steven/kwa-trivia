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

  let game = null;        // { used:{"c-q":true}, started:ISO }
  let current = null;     // { c, q, chosen:Number|null, revealed:Boolean }
  let currentCategory = null;
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

  setupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    game = {
      used: {},
      started: new Date().toISOString(),
    };
    save();
    renderBoard();
    show("board");
    announce("Game started. Roll the dice to pick a category.");
  });

  /* ---------------------------------------------------------------------
     Persistence
     --------------------------------------------------------------------- */
  function save() { if (game) safeSet(STORAGE_KEY, game); }

  function loadSaved() {
    const saved = safeGet(STORAGE_KEY);
    if (saved && saved.used && typeof saved.used === "object") {
      game = saved;
      return true;
    }
    return false;
  }

  /* Global reset: clears every played question. Confirmed first. */
  async function resetGame() {
    const ok = await confirm("Reset the game? Every question will be available again. This cannot be undone.");
    if (!ok) return false;
    game = { used: {}, started: new Date().toISOString() };
    save();
    current = null;
    renderBoard();
    show("board");
    announce("Game reset. All " + totalQuestions + " questions are available again.", true);
    return true;
  }
  $("btn-reset").addEventListener("click", resetGame);

  /* ---------------------------------------------------------------------
     Board (categories)
     --------------------------------------------------------------------- */
  function renderBoard() {
    const grid = $("category-grid");
    grid.innerHTML = "";
    DATA.categories.forEach((cat, c) => {
      const remaining = cat.questions.filter((_, q) => !isUsed(c, q)).length;
      const done = remaining === 0;
      const played = cat.questions.length - remaining;
      const meta = done
        ? "All " + cat.questions.length + " played"
        : (played ? played + " played, " + remaining + " left" : cat.questions.length + " questions");
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
    resetRoller();
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

  /* ---------------------------------------------------------------------
     Dice roll: picks a random category that still has questions left.
     Respects prefers-reduced-motion (result shown instantly, no cycling).
     Only the final result is announced to screen readers.
     --------------------------------------------------------------------- */
  const PIPS = {
    1: [[50, 50]],
    2: [[28, 28], [72, 72]],
    3: [[28, 28], [50, 50], [72, 72]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
    6: [[28, 26], [72, 26], [28, 50], [72, 50], [28, 74], [72, 74]],
  };
  const dieEl = $("die");
  const rollResult = $("roll-result");
  const btnRoll = $("btn-roll");
  const btnRollGo = $("btn-roll-go");
  let rolling = false;
  let rolledCategory = null;
  let rollTimer = null;

  function drawPips(n) {
    const g = $("die-pips");
    g.innerHTML = "";
    for (const [cx, cy] of PIPS[n]) {
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", cx); c.setAttribute("cy", cy); c.setAttribute("r", 8);
      g.append(c);
    }
  }
  drawPips(5);

  function resetRoller() {
    clearTimeout(rollTimer);
    rolling = false;
    rolledCategory = null;
    dieEl.classList.remove("rolling");
    rollResult.classList.remove("rolling", "landed");
    rollResult.textContent = "Press the button and let the dice choose.";
    btnRoll.disabled = false;
    btnRoll.textContent = "Roll the dice";
    btnRollGo.hidden = true;
  }

  function rollDice() {
    if (rolling) return;
    const available = DATA.categories
      .map((cat, c) => ({ c, left: cat.questions.filter((_, q) => !isUsed(c, q)).length }))
      .filter((x) => x.left > 0)
      .map((x) => x.c);
    if (!available.length) {
      announce("Every question has been used. Press End game to wrap up.", true);
      return;
    }
    const target = available[Math.floor(Math.random() * available.length)];
    const names = DATA.categories.map((cat) => cat.name);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    rolling = true;
    rolledCategory = null;
    btnRoll.disabled = true;
    btnRollGo.hidden = true;
    rollResult.classList.remove("landed");

    const finish = () => {
      rolling = false;
      rolledCategory = target;
      const name = names[target];
      dieEl.classList.remove("rolling");
      drawPips(1 + Math.floor(Math.random() * 6));
      rollResult.classList.remove("rolling");
      rollResult.classList.add("landed");
      rollResult.textContent = name + "!";
      btnRoll.disabled = false;
      btnRoll.textContent = "Roll again";
      btnRollGo.hidden = false;
      btnRollGo.textContent = "Open " + name;
      announce("The dice picked " + name + ".", true);
      requestAnimationFrame(() => btnRollGo.focus());
    };

    if (reduceMotion) { finish(); return; }

    dieEl.classList.add("rolling");
    rollResult.classList.add("rolling");
    rollResult.setAttribute("aria-hidden", "true");
    let step = 0;
    const totalSteps = 12;
    let delay = 60;
    const tick = () => {
      let idx;
      do { idx = Math.floor(Math.random() * names.length); } while (names.length > 1 && names[idx] === rollResult.textContent);
      rollResult.textContent = names[idx];
      drawPips(1 + Math.floor(Math.random() * 6));
      step++;
      if (step < totalSteps) {
        delay = Math.round(delay * 1.16);
        rollTimer = setTimeout(tick, delay);
      } else {
        rollResult.removeAttribute("aria-hidden");
        finish();
      }
    };
    tick();
  }

  btnRoll.addEventListener("click", rollDice);
  btnRollGo.addEventListener("click", () => {
    if (rolledCategory == null) return;
    openCategory(rolledCategory, btnRoll);
  });

  $("btn-random").addEventListener("click", (e) => {
    const pick = pickRandom(null);
    if (!pick) { announce("Every question has been used. Press End game to wrap up.", true); return; }
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
    const ok = await confirm("End the game now?");
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
      : "Every question in this category has been played. Press Reset game to play them again.";
    const grid = $("tile-grid");
    grid.innerHTML = "";
    cat.questions.forEach((_, q) => {
      const used = isUsed(c, q);
      const tile = el("button", {
        type: "button",
        class: "tile" + (used ? " used" : ""),
        "aria-label": "Question " + (q + 1) + (used ? ", already played" : ""),
        onclick: () => { lastFocus = tile; openQuestion(c, q); },
      }, [
        el("span", { class: "num", "aria-hidden": "true", text: (used ? "\u2713 " : "") + (q + 1) }),
        el("span", { class: "label", "aria-hidden": "true", text: used ? "Played" : "Question" }),
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
    const replay = isUsed(c, q);
    current = { c, q, chosen: null, revealed: false };
    currentCategory = c;
    // Selecting a question marks it as played immediately, and it stays that
    // way until the host presses Reset game.
    game.used[c + "-" + q] = true;
    save();
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
    show("question");
    announce((replay ? "This question was already played. " : "") + cat.name + ", question " + (q + 1) + ". " + item.q + " Choices: " +
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

    $("reveal").hidden = false;
    $("btn-reveal").hidden = true;
    $("btn-cancel").hidden = true;
    $("btn-next").hidden = false;
    announce(message, true);
    requestAnimationFrame(() => $("btn-next").focus());
  }

  $("btn-reveal").addEventListener("click", reveal);

  function leaveQuestion() {
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

  $("btn-cancel").addEventListener("click", leaveQuestion);

  /* ---------------------------------------------------------------------
     Results
     --------------------------------------------------------------------- */
  function showResults() {
    const list = $("results-categories");
    list.innerHTML = "";
    const used = usedCount();
    $("results-summary").textContent = used >= totalQuestions
      ? "Every one of the " + totalQuestions + " questions has been played. Thanks for playing!"
      : "Thanks for playing! You went through " + used + " of " + totalQuestions + " questions.";
    DATA.categories.forEach((cat, c) => {
      const done = cat.questions.filter((_, q) => isUsed(c, q)).length;
      list.append(el("li", { text: cat.name + ": " + done + " of " + cat.questions.length + " played" }));
    });
    show("results");
    announce("Game over. " + $("results-summary").textContent);
  }

  $("btn-new-game").addEventListener("click", resetGame);

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
  if (loadSaved()) {
    // Played questions persist across visits: go straight to the board.
    renderBoard();
    show("board");
  } else {
    show("setup", null);
  }
})();
