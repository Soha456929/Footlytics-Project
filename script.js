const initialTeams = [{ id: 1, name: 'Real Madrid', code: '86', country: 'Spain' }, { id: 2, name: 'Barcelona', code: '81', country: 'Spain' }, { id: 3, name: 'Manchester United', code: '33', country: 'England' }, { id: 4, name: 'Manchester City', code: '65', country: 'England' }, { id: 5, name: 'Liverpool', code: '34', country: 'England' }, { id: 6, name: 'Arsenal', code: '42', country: 'England' }, { id: 7, name: 'PSG', code: '85', country: 'France' }, { id: 8, name: 'Bayern Munich', code: '40', country: 'Germany' }];
const initialMatches = [{ id: 1, home: 1, away: 2, homeScore: 2, awayScore: 1, status: 'played', date: '2026-10-10', time: '20:00' }, { id: 2, home: 3, away: 4, homeScore: 1, awayScore: 3, status: 'played', date: '2026-10-11', time: '19:00' }, { id: 3, home: 5, away: 6, homeScore: 2, awayScore: 2, status: 'played', date: '2026-10-12', time: '20:00' }, { id: 4, home: 7, away: 8, homeScore: 1, awayScore: 0, status: 'played', date: '2026-10-13', time: '21:00' }, { id: 5, home: 1, away: 4, status: 'scheduled', date: '2026-11-03', time: '20:00' }, { id: 6, home: 2, away: 6, status: 'scheduled', date: '2026-11-05', time: '19:30' }];
const initialPlayers = [{ id: 1, name: 'Cristiano Ronaldo', team: 1, position: 'Forward', goals: 7, assists: 4 }, { id: 2, name: 'Lionel Messi', team: 2, position: 'Forward', goals: 5, assists: 6 }, { id: 3, name: 'Erling Haaland', team: 4, position: 'Forward', goals: 10, assists: 2 }, { id: 4, name: 'Mohamed Salah', team: 5, position: 'Forward', goals: 8, assists: 5 }, { id: 5, name: 'Bukayo Saka', team: 6, position: 'Winger', goals: 4, assists: 5 }, { id: 6, name: 'Harry Kane', team: 8, position: 'Forward', goals: 9, assists: 3 }];
function load(key, fallback) { try {
    let x = JSON.parse(localStorage.getItem(key));
    return Array.isArray(x) ? x : fallback.map(o => ({ ...o }));
}
catch {
    return fallback.map(o => ({ ...o }));
} }
let teams = load('fl_teams', initialTeams), matches = load('fl_matches', initialMatches), players = load('fl_players', initialPlayers);
function save() { localStorage.setItem('fl_teams', JSON.stringify(teams)); localStorage.setItem('fl_matches', JSON.stringify(matches)); localStorage.setItem('fl_players', JSON.stringify(players)); }
const $ = id => document.getElementById(id);
function club(id) { return teams.find(t => t.id === Number(id)) || { name: 'Unknown', code: '', country: '' }; }
const CLUB_LOGOS = {
    'Real Madrid': 541,
    'Barcelona': 529,
    'Manchester United': 33,
    'Manchester City': 50,
    'Liverpool': 40,
    'Arsenal': 42,
    'PSG': 85,
    'Bayern Munich': 157
};
function logo(t) {
    const id = CLUB_LOGOS[t.name] || t.code;
    return id ? `images/${id}.png` : '';
}
function crest(t) {
    const img = document.createElement('img');
    const id = CLUB_LOGOS[t.name] || t.code;
    img.src = logo(t);
    img.alt = t.name + ' crest';
    img.loading = 'lazy';
    img.onerror = () => {
        if (id && !img.dataset.fallback) {
            img.dataset.fallback = 'true';
            img.src = `https://media.api-sports.io/football/teams/${id}.png`;
        }
        else {
            img.style.display = 'none';
        }
    };
    return img;
}
function notify(s) { $('toast').textContent = s; $('toast').style.display = 'block'; clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => $('toast').style.display = 'none', 2600); }
function showPage(page) { document.querySelectorAll('.page').forEach(x => x.classList.toggle('active', x.id === page)); document.querySelectorAll('.nav-link[data-page]').forEach(x => x.classList.toggle('active', x.dataset.page === page)); $('pageTitle').textContent = page[0].toUpperCase() + page.slice(1); $('sidebar').classList.remove('open'); window.scrollTo(0, 0); }
document.querySelectorAll('[data-page],[data-go]').forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.page || btn.dataset.go)));
$('menuBtn').onclick = () => $('sidebar').classList.toggle('open');
let theme = localStorage.getItem('fl_theme') || 'dark';
function setTheme() { document.body.className = theme + '-theme'; }
setTheme();
$('themeBtn').onclick = () => { theme = theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('fl_theme', theme); setTheme(); };
function node(tag, className, text) { let e = document.createElement(tag); if (className)
    e.className = className; if (text !== undefined)
    e.textContent = text; return e; }
function matchRow(m, allowActions = false) { const row = node('div', 'match-row'); const home = club(m.home), away = club(m.away); const a = node('div', 'club-side'); a.append(crest(home), node('span', '', home.name)); const mid = node('span', 'score-pill', m.status === 'played' ? `${m.homeScore} - ${m.awayScore}` : `${m.date} · ${m.time}`); const b = node('div', 'club-side away'); b.append(node('span', '', away.name), crest(away)); row.append(a, mid, b); if (allowActions) {
    const actions = node('div', 'flex gap-2 flex-wrap');
    if (m.status === 'scheduled') {
        const btn = node('button', 'small-btn', 'Enter score');
        btn.onclick = () => openScore(m.id);
        actions.append(btn);
    }
    const del = node('button', 'small-btn danger', 'Delete');
    del.onclick = () => { if (confirm('Delete this match?')) {
        matches = matches.filter(x => x.id !== m.id);
        save();
        render();
        notify('Match deleted');
    } };
    actions.append(del);
    row.append(actions);
} return row; }
function standings() { const arr = teams.map(t => ({ id: t.id, name: t.name, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 })); matches.filter(m => m.status === 'played').forEach(m => { const h = arr.find(x => x.id === m.home), a = arr.find(x => x.id === m.away); if (!h || !a)
    return; h.p++; a.p++; h.gf += m.homeScore; h.ga += m.awayScore; a.gf += m.awayScore; a.ga += m.homeScore; if (m.homeScore > m.awayScore) {
    h.w++;
    a.l++;
    h.pts += 3;
}
else if (m.homeScore < m.awayScore) {
    a.w++;
    h.l++;
    a.pts += 3;
}
else {
    h.d++;
    a.d++;
    h.pts++;
    a.pts++;
} }); arr.forEach(x => x.gd = x.gf - x.ga); return arr.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.name.localeCompare(b.name)); }
function fillSelect(id) { const sel = $(id), old = sel.value; sel.replaceChildren(); teams.forEach(t => { const opt = node('option', '', t.name); opt.value = t.id; sel.append(opt); }); if (teams.some(t => String(t.id) === old))
    sel.value = old; }
function render() {
    ['fixtureHome', 'fixtureAway', 'resultHome', 'resultAway'].forEach(fillSelect);
    $('statTeams').textContent = teams.length;
    $('statFixtures').textContent = matches.filter(m => m.status === 'scheduled').length;
    $('statPlayed').textContent = matches.filter(m => m.status === 'played').length;
    $('statGoals').textContent = matches.filter(m => m.status === 'played').reduce((sum, m) => sum + m.homeScore + m.awayScore, 0);
    const recent = matches.filter(m => m.status === 'played').slice().reverse();
    $('dashboardResults').replaceChildren(...(recent.length ? recent.slice(0, 4).map(m => matchRow(m)) : [node('p', 'empty', 'No results yet')]));
    const leaders = standings().slice(0, 5);
    $('dashboardLeaders').replaceChildren(...leaders.map((t, i) => { const r = node('div', 'mini-rank'); const label = node('div', 'table-club'); label.append(node('span', '', String(i + 1)), crest(club(t.id)), node('span', '', t.name)); r.append(label, node('strong', '', t.pts + ' pts')); return r; }));
    $('teamGrid').replaceChildren(...teams.map(t => { const tile = node('div', 'team-tile'); tile.append(crest(t), node('h3', '', t.name), node('p', '', t.country)); const btn = node('button', 'small-btn danger', 'Remove'); btn.onclick = () => { if (matches.some(m => m.home === t.id || m.away === t.id) || players.some(p => p.team === t.id)) {
        notify('Remove team matches and players first');
        return;
    } if (confirm('Remove ' + t.name + '?')) {
        teams = teams.filter(x => x.id !== t.id);
        save();
        render();
    } }; tile.append(btn); return tile; }));
    const upcoming = matches.filter(m => m.status === 'scheduled').sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    $('fixtureList').replaceChildren(...(upcoming.length ? upcoming.map(m => matchRow(m, true)) : [node('p', 'empty', 'No upcoming fixtures')]));
    $('resultList').replaceChildren(...(recent.length ? recent.map(m => matchRow(m, true)) : [node('p', 'empty', 'No completed matches')]));
    $('standingsBody').replaceChildren(...standings().map((t, i) => { const tr = node('tr'); const rank = node('td', '', String(i + 1)); const teamCell = node('td'); const c = node('div', 'table-club'); c.append(crest(club(t.id)), node('span', '', t.name)); teamCell.append(c); tr.append(rank, teamCell); [t.p, t.w, t.d, t.l, t.gf, t.ga, t.gd, t.pts].forEach(n => tr.append(node('td', '', String(n)))); return tr; }));
    $('playerBody').replaceChildren(...players.map(p => { const tr = node('tr'); [p.name, club(p.team).name, p.position, p.goals, p.assists].forEach(v => tr.append(node('td', '', String(v)))); const action = node('td'); const edit = node('button', 'small-btn', 'Edit'); edit.onclick = () => openPlayer(p.id); const del = node('button', 'small-btn danger ml-2', 'Delete'); del.onclick = () => { if (confirm('Delete player?')) {
        players = players.filter(x => x.id !== p.id);
        save();
        render();
    } }; action.append(edit, del); tr.append(action); return tr; }));
}
function validTeams(h, a) { if (!teams.some(t => t.id === h) || !teams.some(t => t.id === a)) {
    notify('Select valid teams');
    return false;
} if (h === a) {
    notify('Choose two different teams');
    return false;
} return true; }
$('fixtureForm').onsubmit = e => { e.preventDefault(); const h = Number($('fixtureHome').value), a = Number($('fixtureAway').value); if (!validTeams(h, a))
    return; matches.push({ id: Date.now(), home: h, away: a, date: $('fixtureDate').value, time: $('fixtureTime').value, status: 'scheduled' }); save(); render(); e.target.reset(); notify('Fixture scheduled'); };
$('resultForm').onsubmit = e => { e.preventDefault(); const h = Number($('resultHome').value), a = Number($('resultAway').value), hs = Number($('homeGoals').value), as = Number($('awayGoals').value); if (!validTeams(h, a))
    return; if (!Number.isInteger(hs) || !Number.isInteger(as) || hs < 0 || as < 0 || hs > 99 || as > 99) {
    notify('Enter valid goals (0–99)');
    return;
} matches.push({ id: Date.now(), home: h, away: a, homeScore: hs, awayScore: as, status: 'played', date: new Date().toISOString().slice(0, 10), time: '00:00' }); save(); render(); e.target.reset(); notify('Result saved and standings updated'); };
function openModal(title, fields, onSubmit) { $('modalTitle').textContent = title; const form = $('modalForm'); form.replaceChildren(); fields.forEach(f => { const label = node('label', '', f.label); let input; if (f.type === 'select') {
    input = node('select');
    f.options.forEach(o => { const opt = node('option', '', o.label); opt.value = o.value; input.append(opt); });
}
else {
    input = node('input');
    input.type = f.type || 'text';
    if (f.min !== undefined)
        input.min = f.min;
    if (f.max !== undefined)
        input.max = f.max;
} input.name = f.name; input.required = true; if (f.value !== undefined)
    input.value = f.value; label.append(input); form.append(label); }); const submit = node('button', 'primary-btn', 'Save'); submit.type = 'submit'; form.append(submit); form.onsubmit = e => { e.preventDefault(); const values = Object.fromEntries(new FormData(form).entries()); if (onSubmit(values) !== false) {
    $('modalBackdrop').classList.add('hidden');
    render();
} }; $('modalBackdrop').classList.remove('hidden'); }
$('closeModal').onclick = () => $('modalBackdrop').classList.add('hidden');
$('modalBackdrop').onclick = e => { if (e.target === $('modalBackdrop'))
    $('modalBackdrop').classList.add('hidden'); };
$('addTeamBtn').onclick = () => openModal('Add a Team', [{ name: 'name', label: 'Team name' }, { name: 'country', label: 'Country' }, { name: 'code', label: 'Team logo ID (optional)', value: '' }], v => { if (teams.some(t => t.name.toLowerCase() === v.name.trim().toLowerCase())) {
    notify('Team already exists');
    return false;
} teams.push({ id: Date.now(), name: v.name.trim(), country: v.country.trim(), code: v.code.trim() }); save(); notify('Team added'); });
function playerFields(p = {}) { return [{ name: 'name', label: 'Player name', value: p.name || '' }, { name: 'team', label: 'Team', type: 'select', value: p.team || teams[0]?.id, options: teams.map(t => ({ label: t.name, value: t.id })) }, { name: 'position', label: 'Position', type: 'select', value: p.position || 'Forward', options: ['Goalkeeper', 'Defender', 'Midfielder', 'Winger', 'Forward'].map(x => ({ label: x, value: x })) }, { name: 'goals', label: 'Goals', type: 'number', min: 0, max: 999, value: p.goals ?? 0 }, { name: 'assists', label: 'Assists', type: 'number', min: 0, max: 999, value: p.assists ?? 0 }]; }
function openPlayer(id) { const p = players.find(x => x.id === id); if (!teams.length) {
    notify('Add a team first');
    return;
} openModal(p ? 'Edit Player' : 'Add Player', playerFields(p), v => { if (!v.name.trim())
    return false; const obj = { id: p?.id || Date.now(), name: v.name.trim(), team: Number(v.team), position: v.position, goals: Number(v.goals), assists: Number(v.assists) }; if (p)
    Object.assign(p, obj);
else
    players.push(obj); save(); notify('Player saved'); }); }
$('addPlayerBtn').onclick = () => openPlayer();
function openScore(id) { const m = matches.find(x => x.id === id); if (!m)
    return; openModal('Enter Match Score', [{ name: 'homeScore', label: club(m.home).name + ' goals', type: 'number', min: 0, max: 99, value: 0 }, { name: 'awayScore', label: club(m.away).name + ' goals', type: 'number', min: 0, max: 99, value: 0 }], v => { m.homeScore = Number(v.homeScore); m.awayScore = Number(v.awayScore); m.status = 'played'; save(); notify('Result saved'); }); }
render();

