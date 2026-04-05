# Clima

A minimal weather app that visualizes temperature through color-gradient stripes.

## Description

Clima displays current weather conditions using the browser's geolocation API. The interface is built around 11 vertical stripes representing temperature bands — warm tones (orange to yellow) on one side, cool tones (light to dark blue) on the other, and white in the middle for comfortable temperatures. The stripe matching the current "feels-like" temperature collapses to reveal weather details while the remaining stripes expand to fill the viewport.

## Tech Stack

- Vanilla JavaScript — no framework, no build step
- Modern CSS — `@layer` cascade layers, `color-mix()` gradients, custom properties
- [Open-Meteo](https://open-meteo.com/) — weather data (free, no API key)
- [Nominatim / OpenStreetMap](https://nominatim.openstreetmap.org/) — reverse geocoding (free, no API key)
- [Weather Icons](https://erikflowers.github.io/weather-icons/) — condition icons via CDN
- pnpm

## Getting Started

```bash
git clone <repo-url>
cd clima-web
```

> Geolocation requires the page to be served over HTTPS or localhost.

## How It Works

The UI consists of 11 temperature stripes: 5 hot, 1 normal, and 5 cold.

| Band | Range (°F) |
|------|-----------|
| Hot 5 | > 95 |
| Hot 4 | 88 – 95 |
| Hot 3 | 81 – 88 |
| Hot 2 | 77 – 81 |
| Hot 1 | 73 – 77 |
| Normal | 66 – 73 |
| Cold 1 | 59 – 66 |
| Cold 2 | 52 – 59 |
| Cold 3 | 45 – 52 |
| Cold 4 | 38 – 45 |
| Cold 5 | < 38 |

The apparent (feels-like) temperature determines which stripe is active. Each stripe's background color is computed with CSS `color-mix()` using a `--index` custom property, creating a smooth gradient across the warm and cold bands.

## APIs

| API | Purpose |
|-----|---------|
| [Open-Meteo](https://open-meteo.com/) | Current temperature, apparent temperature, weather code |
| [Nominatim](https://nominatim.openstreetmap.org/) | Reverse geocoding — coordinates to city and state |

Both APIs are free and require no authentication.

## Project Structure

```
clima-web/
├── index.html          # Entry point with 11 stripe divs
├── manifest.json       # PWA manifest
├── package.json
└── src/
    ├── js/
    │   └── clima.js    # All application logic (geolocation, API calls, UI updates)
    └── css/
        ├── clima.css       # Layer declarations + imports
        ├── reset.css       # CSS reset
        ├── theme.css       # Color variables and typography
        ├── layout.css      # Layout rules
        ├── utilities.css   # Utility classes
        └── components.css  # Component styles
```

## License

MIT
