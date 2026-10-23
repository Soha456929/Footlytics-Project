# Footlytics — Football League Management System

## Project files
- `index.html` — HTML layout and Tailwind CSS browser CDN
- `style.css` — custom responsive styling and dark/light theme
- `script.js` — navigation, teams, fixtures, results, standings, players and LocalStorage
- `download_logos.ps1` — one-time Windows logo downloader
- `images/` — downloaded club PNG files

## Known behaviors
- Team IDs from the old version were incorrect for several clubs. The updated `script.js` maps club names to the correct API-Sports logo IDs, including previously saved teams in LocalStorage.
- Existing matches, players, and teams stored in your browser are preserved.
- Tailwind CSS is loaded from a CDN and requires internet connectivity.

## Live Demo Link
https://soha456929.github.io/Footlytics-Project/
