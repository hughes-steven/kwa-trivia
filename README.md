# KW AccessAbility Trivia

A friendly, accessible multiple-choice trivia game for [KW AccessAbility](https://www.kwaccessability.ca/) events.
Ten categories with a bank of 500 questions. Each game draws a fresh random 10 per category (100 in play). One host runs it for the room: roll the dice for a category, pick a question, reveal the answer. Runs entirely in the browser with no
build step, no accounts and no tracking.

**Play it:** https://hughes-steven.github.io/kwa-trivia/

## How to play

1. Press **Start game**.
2. Roll the dice to pick a category at random (or expand "Choose a category yourself"), then pick a question number.
   As soon as a question is opened it is marked as played (checkmark, dashed outline) and stays that way.
3. Read the question aloud. Press the answer people call out to check it, or press **Reveal answer**.
4. Press **Roll the dice** to go straight to the next roll, or **Back to questions** for another from the same category.
5. Press **End game** whenever you like to wrap up.
6. **Reset game** (top corner) draws a brand-new random set of 100 questions from the bank of 500, after a confirmation.

Played questions are remembered in the browser, so refreshing the page or coming back days later keeps your progress.
Use **Help** in the top corner for keyboard shortcuts.

## Editing the questions

All questions live in one file: [`data/questions.js`](data/questions.js). Open it in any text editor.

```js
{
  "q": "What is the official capital city of Canada?",
  "options": ["Vancouver", "Toronto", "Ottawa", "Montreal"],
  "answer": 2        // position of the correct option, starting at 0 (A=0, B=1, C=2, D=3)
}
```

- Add, remove or reorder questions and categories freely. Each game draws 10 per category at random, so a category can hold as many as you like (the bank ships with 50 each).
- Keep four options per question.
- Commit and push; the site republishes automatically within a minute or two (see the Actions tab).
  Visitors who already had the page open may need a refresh; the browser cache can hold the old version for up to ten minutes.

The **Current Events** category goes stale quickly. Refresh it before each event.

### Importing from the Excel workbook

If you maintain the questions in the `KWA Trivia Game.xlsm` workbook, you can regenerate the file
from its `Database` sheet:

```bash
pip install openpyxl
python3 scripts/import_xlsx.py "KWA Trivia Game.xlsm"
```

The script reports any row where it could not work out which option is the correct answer.

## Running locally

Just open `index.html` in a browser. Nothing to install.

## Accessibility

Built to WCAG 2.2 AA. In particular:

- Works fully with keyboard, mouse, touch and screen readers; focus moves to the new heading on every screen change.
- Live announcements for the dice result, each question and each answer.
- No time limits anywhere: the host sets the pace.
- Colour is never the only signal: correct and incorrect answers also get a symbol and text.
- Every text and background pairing meets AA contrast in both light and dark mode.
- Every button and control is at least 44×44 px.
- Respects the system's reduced-motion (the dice roll then shows its result instantly), dark-mode and high-contrast (forced colours) settings.
- In-app text size control (Normal / Large / Extra large), plus normal browser zoom up to 400%.

If you find something that does not work well with your assistive technology, please
[open an issue](https://github.com/hughes-steven/kwa-trivia/issues).

## Project layout

```
index.html          the whole app (one page, several screens)
css/styles.css      styles and brand colours
js/app.js           game logic
data/questions.js   the question bank — edit this
scripts/            helper to import questions from the Excel workbook
assets/             logo and icons
```

## Licence

MIT. See [LICENSE](LICENSE).
