# Josh Lisco - Terminal Portfolio

An interactive, terminal-themed single-page portfolio inspired by CARRD. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step.

## Features

- **Terminal UI** — macOS-style window with title bar, scrollable output, and command input
- **Boot sequence** — Animated welcome message with clickable quick links on page load
- **Command system** — `about`, `projects`, `skills`, `contact`, `links`, `help`, `clear`, plus easter eggs
- **Click-to-execute** — All command names are clickable; typing animation plays before execution
- **Command history** — Up/Down arrows navigate previous commands
- **Tab completion** — Press Tab to auto-complete partial command names
- **Responsive** — Floats as a card on desktop, goes full-viewport on mobile
- **Accessible** — `aria-label` on input, `role="button"` + keyboard support on command links, `<noscript>` fallback
- **No dependencies** — Pure HTML/CSS/JS, loads JetBrains Mono from Google Fonts

## Getting Started

Open `index.html` in your browser. No build tools required.

For local development with live reload:
- VS Code: Use the Live Server extension
- Python: `python -m http.server 8000`
- Node.js: `npx serve`

## Customization

1. **Personal info** — Edit the `about`, `contact`, and `links` command handlers in `script.js`
2. **Projects** — Update the `projects` array in the `COMMANDS.projects` handler
3. **Skills** — Update the `categories` array in the `COMMANDS.skills` handler
4. **Colors** — Modify CSS variables in `:root` in `styles.css`
5. **Boot message** — Edit the `lines` array in the `boot()` function in `script.js`

## File Structure

```
index.html   — Terminal structure + noscript fallback
styles.css   — Terminal styling, cursor animation, responsive breakpoints
script.js    — Command engine, boot sequence, input handling
```

## License

MIT
