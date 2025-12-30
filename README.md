# Connections

A browser-based NY Times Connections game clone that generates fresh 4x4 boards from a Gemini-powered API.

## Overview

Connections is a lightweight, static web game where players group 16 words into four themed categories. It is built for quick puzzle sessions and targets people who enjoy word-association challenges.

Key code differentiators:

- AI-generated boards with a strict response schema to keep the puzzle format consistent.
- Category difficulty implied by ordering, with distinct color styling per solved group.
- Smooth tile movement and feedback animations powered by GSAP.

## Features

### Core Gameplay

- 16-word grid and four hidden categories with four words each.
- Select up to four tiles; the Submit button activates only at four selections.
- Duplicate-guess detection to prevent re-submitting the same set.
- Mistake counter with four strikes before the board is fully revealed.
- Shuffle and Deselect All controls to explore alternate groupings.
- Win and loss flows with a Play again restart button.

### Feedback and Presentation

- Tile lift, shake, and fade-in animations for selection, errors, and reveals.
- Auto-resizing text to keep long words readable in tiles.
- Category rows rendered with distinct colors by category order.
- Responsive layout for mobile and desktop.

### API Integration

- Serverless endpoint that calls the Gemini API with a strict JSON schema.
- Structured response with `mixedWords` and `categories`, used directly by the UI.

## Typical User Workflow

1. The player opens the page and sees a short loading message while the word set is generated.
2. The 4x4 grid appears; they scan the words for obvious connections.
3. They click or tap four words they believe belong together. Selected tiles darken, and the Submit button activates once four are selected.
4. If they change their mind, they tap Deselect All to clear the selection and start over.
5. They submit the guess. If correct, the tiles animate into a solved row and the category name appears. If incorrect, the tiles shake, a mistake indicator fades out, and the guess is cleared.
6. If they feel stuck, they use Shuffle (only available when nothing is selected) to reorder the grid and look for new patterns.
7. The cycle repeats until all four categories are solved or all mistakes are used.
8. On a win or loss, the board reveals the final state and offers a Play again button that reloads the puzzle.

## Tech Stack

### Frontend

- HTML, CSS, and vanilla JavaScript in `index.html`, `style.css`, and `main.js`.
- ES modules: `main.js` imports a fetch helper from `server.js`.
- CSS Grid for the board layout and Flexbox for controls.
- GSAP (CDN) for tile movement animations.
- Font Awesome (CDN) for mistake indicators.
- Google Fonts (CDN) for the Open Sans typeface.
- State management: in-memory JS variables in `main.js`.

### Backend (Serverless API)

- Node-style serverless handler in `api/generate-words.js`.
- Gemini REST API (`gemini-2.5-flash`) to generate category data.
- REST-style POST endpoint at `/api/generate-words`.
- Schema-driven JSON output with `mixedWords` and `categories`.

How it fits together: the browser loads static assets, fetches a new word set from the API, and then runs all gameplay locally. The API only generates puzzle data and returns it in a fixed shape.

## Architecture / Project Structure

```
.
|-- api/
|   |-- generate-words.js      # Serverless function to fetch from Gemini API. Defines the prompt and JSON schema for puzzle generation.
|-- index.html                 # UI shell and CDN includes
|-- main.js                    # Sets gameplay rules like mistake limits, selection logic, and animations.
|-- server.js                  # Client helper for calling /api/generate-words
|-- style.css                  # Controls layout, sizing, and responsive behavior.
|-- test.js                    # Legacy or experimental snippets
|-- favicon.ico
`-- .env                       # Local-only environment variables
```

## Live Demo

[Open the app](https://game-connections.vercel.app/)
