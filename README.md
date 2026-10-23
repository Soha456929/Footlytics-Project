# Footlytics — Football League Management System

## Project files
- `index.html` — HTML layout and Tailwind CSS browser CDN
- `style.css` — custom responsive styling and dark/light theme
- `script.js` — navigation, teams, fixtures, results, standings, players and LocalStorage
- `download_logos.ps1` — one-time Windows logo downloader
- `images/` — downloaded club PNG files

## First-time setup (Windows)
1. Extract the entire ZIP to a folder, for example Desktop\footlytics_logo_fixed.
2. Double-click `download_logos.bat` to download the club logos. If Windows blocks scripts, open PowerShell in this folder and run `powershell -ExecutionPolicy Bypass -File .\download_logos.ps1` only after reviewing the script.
3. Verify the `images` folder now contains eight PNG images: `541.png`, `529.png`, `33.png`, `50.png`, `40.png`, `42.png`, `85.png`, `157.png`.
4. Open `index.html` with VS Code Live Server.

**Important:** This ZIP includes a downloader rather than the actual crest image binaries because they could not be retrieved in the packaging environment. The project uses corrected API-Sports team ID mappings, and if local images are absent it attempts the same online image URLs. The logos are club trademarks; use them for your classroom demonstration and respect applicable rights.

## Known behaviors
- Team IDs from the old version were incorrect for several clubs. The updated `script.js` maps club names to the correct API-Sports logo IDs, including previously saved teams in LocalStorage.
- Existing matches, players, and teams stored in your browser are preserved.
- Tailwind CSS is loaded from a CDN and requires internet connectivity.
