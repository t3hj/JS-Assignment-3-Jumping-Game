# Jump Runner

JavaScript practicum group assignment, implemented with plain HTML, CSS and JavaScript.

## Run locally

Open `index.html` in a modern browser. No installation, build step or account is required.
Alternatively, use VS Code Live Server to open the project folder.

## Assignment coverage

- Separate HTML structure, CSS styling and JavaScript game logic; no external assets.
- A DOM game area contains the character, ground and moving obstacles.
- Space, Arrow Up, the Jump button and tapping the game area trigger jumps.
- Gravity controls height and landing; midair jumps are blocked.
- Random obstacle heights (30–54px) and intervals (1.45–2 seconds).
- Obstacles move at a constant 240 pixels per second.
- Axis-aligned rectangle collision detection ends the game and announces the final score.
- One point is awarded for each obstacle successfully cleared, never twice.
- Restart clears the score, obstacles and motion state; hiding the tab pauses play.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Semantic page structure and controls |
| `style.css` | Responsive layout, colours and focus styles |
| `script.js` | Application state and event handlers |
| `test.cjs` | Dependency-free Node regression tests |
| `PRESENTATION.md` | Demo outline and teammate handover |

## Automated checks

Install Node.js 22 or newer, then run `npm test`. No `npm install` is needed.
The tests execute the actual script in an isolated DOM stub. They cover logic and
state transitions; visual layout and real browser behaviour require the manual checklist.

## Manual checks

- Start; verify obstacles move toward the character.
- Jump with Space, Arrow Up, the Jump button and a tap on the game area.
- Try jumping again while airborne; confirm there is no double jump.
- Clear an obstacle; confirm the score increases exactly once.
- Hit an obstacle; confirm motion stops and the final score appears.
- Restart repeatedly; confirm no duplicate animation loops or leftover obstacles.
- Switch tabs during play; return and confirm no large time jump occurs.
- Test a narrow phone window and a desktop window, including resizing midgame.

## Working together

Pull the latest `main` before starting. Create a branch for your change, use a clear
commit message, and open a pull request describing what changed and how you checked it.
Keep styling changes in `style.css` and behaviour changes in `script.js` where practical.

See `PRESENTATION.md` for suggested preparation before Saturday, 31 October 2026.
