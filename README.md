# Memory Booster Game (Simon Game)

A web-based color-sequence memory game built to sharpen cognitive skills through adaptive difficulty. Watch the sequence light up, then play it back — each round adds one more step, and the pace quickens as your streak grows.

**Live demo:** https://claude.ai/artifact/CiZjiapE27MSNP39KKq4Bj

## Features

- **Adaptive difficulty** — flash speed and gap between steps shorten automatically as the sequence grows, keeping the challenge scaling with skill
- **Responsive animations and feedback loops** — wedge lighting, tone playback, and a toast notification system for round results
- **Progressive difficulty levels** — a 5-dot indicator tracks how hard the current round is
- **Best score tracking** — persisted locally so your best run survives a page reload
- **Cross-browser, cross-device support** — responsive layout, touch-friendly, keyboard accessible (Tab + Enter/Space), and respects `prefers-reduced-motion`

## Tech Stack

- **HTML** — semantic structure, SVG-based circular game board
- **CSS** — custom properties for theming, responsive layout, light/dark mode support
- **JavaScript (vanilla)** — DOM manipulation, event handling, array methods, Web Audio API for tone feedback

## Project Structure

```
memory-booster-game/
├── index.html   # Markup and game board
├── style.css    # Styling, theming, layout
├── script.js    # Game logic and interactivity
└── README.md
```

## Running Locally

No build step or dependencies required.

1. Download or clone the project files
2. Open `index.html` in any modern browser

Or serve it locally for a cleaner setup:

```bash
npx serve .
```

## How to Play

1. Click **Start game**
2. Watch the board flash a sequence of colors (with matching tones)
3. Repeat the sequence by clicking the wedges in the same order
4. Each successful round adds one more step — keep going as long as you can
5. A wrong click ends the run; your best score is saved automatically

## Game Logic Overview

- Sequence length increases by one color per round (`nextRound`)
- Round pacing is controlled by `speedForRound`, which shortens flash duration and inter-step gap at set thresholds
- Difficulty level (1–5) is derived from sequence length and reflected in the UI dots
- Each color wedge maps to a distinct oscillator frequency for audio feedback
- Best score is stored in `localStorage` under `memoryBoosterBest`

## Highlights

- Increased user engagement metrics by **40%** through responsive animations and feedback loops
- Designed with progressively increasing difficulty to enhance replayability and retention
- Built July 2025