# Contributing

Thanks for helping keep the trivia fresh. This game is played out loud at community events
run by KW AccessAbility, with players of all ages and abilities in the room. Please keep that
audience in mind with every change.

## Content guidelines for questions

Every question, every answer and every wrong option must be:

- **Family friendly.** Nothing rude, scary, gory or suggestive. If you would not want a
  ten-year-old to read it aloud to their grandparent, leave it out.
- **Free of politics and religion.** No elections, politicians, parties, protests, royalty,
  religious figures or religious events, even as "just a fact".
- **Free of alcohol, drugs, gambling, weapons, crime, war and death.** This includes shows,
  songs and films that are mainly about those things, and idioms that reference them.
- **Respectful about disability and health.** Avoid idioms about bodies or injuries (for
  example "costs an arm and a leg"), jokes about illness, and anything that treats a
  disability as a punchline. Disability sport and achievement questions are very welcome.
- **Accurate and verifiable.** No internet myths, urban legends or "weird laws" you cannot
  confirm from a reliable source. If unsure, pick something else.
- **Easy to medium.** The goal is a fun evening, not a stumper. A local or Canadian angle is
  a bonus.
- **Fair.** Four distinct options, exactly one correct answer, and no trick wording.

The **Current Events** category dates quickly. Retire anything more than a few years old
when you add to it.

## Making a change

1. Edit `data/questions.js`. Each question looks like this:

   ```js
   {
     "q": "What is the official capital city of Canada?",
     "options": ["Vancouver", "Toronto", "Ottawa", "Montreal"],
     "answer": 2   // position of the correct option, starting at 0
   }
   ```

2. Open `index.html` in a browser and play a round to make sure it still works.
3. Commit and push to `main`. The site republishes itself within a minute or two.

## Accessibility

The app is built to WCAG 2.2 AA. If you change the interface, keep:

- keyboard access and visible focus for every control,
- text and symbols alongside any colour cue,
- the screen-reader announcements (the `announce` calls in `js/app.js`),
- contrast in both light and dark mode,
- the reduced-motion behaviour for the dice roll and confetti.

## Questions

Open an issue on GitHub, or contact KW AccessAbility through kwaccessability.ca.
