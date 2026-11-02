// tile-watcher.js
// Finds buildings whose status changed and remakes only their MapCache tiles.

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const sql = require('mssql');

// Database login is read from the backend .env (nothing is typed here)
const BACKEND_ENV = 'D:\\NTCPWC-GIS-App\\lms\\LMS-Quarters_Backend\\.env';
require('dotenv').config({ path: BACKEND_ENV });

// Settings
const CHECK_EVERY_SECONDS = 60;     // how often to look for changes
const MAX_BUILDINGS_PER_RUN = 50;   // above this, use refresh_tiles.bat instead
const MARGIN_METERS = 5;            // small extra area around a building
const MAPCACHE_XML = 'C:\\ms4w\\apps\\mapcache\\mapcache.xml';
const STATE_FILE = path.join(__dirname, 'state.json');
const LOG_FILE = path.join(__dirname, 'watcher.log');

// Database connection settings
const dbConfig = {
  server: process.env.DB_SERVER || 'localhost',
  port: Number(process.env.DB_PORT || 1433),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: String(process.env.DB_ENCRYPT).toLowerCase() === 'true',
    trustServerCertificate: String(process.env.DB_TRUST_SERVER_CERT).toLowerCase() === 'true',
  },
};

// One row per building (buildings are found by their identical shape)
const QUERY = `
  SELECT
    MIN(Shape.STEnvelope().STPointN(1).STX) AS minx,
    MIN(Shape.STEnvelope().STPointN(1).STY) AS miny,
    MAX(Shape.STEnvelope().STPointN(3).STX) AS maxx,
    MAX(Shape.STEnvelope().STPointN(3).STY) AS maxy,
    SUM(CASE WHEN UPPER(LTRIM(RTRIM(STATUS1))) = 'VACANT' THEN 1 ELSE 0 END) AS vac,
    SUM(CASE WHEN UPPER(LTRIM(RTRIM(STATUS1))) = 'OCCUPIED' THEN 1 ELSE 0 END) AS occ,
    SUM(CASE WHEN UPPER(LTRIM(RTRIM(STATUS1))) = 'BEYOND REPAIR' THEN 1 ELSE 0 END) AS br,
    COUNT(*) AS total
  FROM dbo.Estate_Quarters
  WHERE Shape IS NOT NULL
  GROUP BY CONVERT(VARBINARY(MAX), Shape)
`;

// Write a line to the screen and to watcher.log
function log(message) {
  const line = new Date().toISOString() + '  ' + message;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

// Latitude and longitude to map meters (EPSG:3857, used by our tile grid)
function toMeters(lon, lat) {
  const R = 20037508.342789244;
  const x = (lon * R) / 180;
  const y = (Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180)) * (R / 180);
  return [x, y];
}

// Read all buildings with their status counts
async function readBuildings(pool) {
  const result = await pool.request().query(QUERY);
  const buildings = {};
  result.recordset.forEach((r) => {
    if (r.minx === null || r.miny === null) { return; }
    const maxx = r.maxx === null ? r.minx : r.maxx; // point shapes have no corner 3
    const maxy = r.maxy === null ? r.miny : r.maxy;
    const id = [r.minx, r.miny, maxx, maxy].map((v) => v.toFixed(7)).join(',');
    buildings[id] = {
      sig: [r.vac, r.occ, r.br, r.total].join('|'),
      minx: r.minx, miny: r.miny, maxx, maxy,
    };
  });
  return buildings;
}

// Remake the tiles (zoom 10 to 21) around one building
function reseed(b) {
  const [x1, y1] = toMeters(b.minx, b.miny);
  const [x2, y2] = toMeters(b.maxx, b.maxy);
  const ext = [x1 - MARGIN_METERS, y1 - MARGIN_METERS, x2 + MARGIN_METERS, y2 + MARGIN_METERS]
    .map((v) => v.toFixed(2)).join(',');
  const cmd =
    'cd /d C:\\ms4w && call setenv.bat && ' +
    'mapcache_seed -c "' + MAPCACHE_XML + '" -t quarters -g GM21 -z 10,21 -e ' + ext + ' -n 2 -f';
  const r = spawnSync(cmd, { shell: true, encoding: 'utf8', windowsHide: true });
  const ok = r.status === 0 && /seeded/i.test(r.stdout || '');
  if (!ok) { log('Seeding problem: ' + ((r.stderr || r.stdout || '').trim().slice(0, 300))); }
  return ok;
}

// One check
async function runOnce(pool) {
  const now = await readBuildings(pool);

  // First run: remember the current state and stop (tiles are assumed up to date)
  if (!fs.existsSync(STATE_FILE)) {
    const baseline = {};
    Object.keys(now).forEach((id) => { baseline[id] = now[id].sig; });
    fs.writeFileSync(STATE_FILE, JSON.stringify(baseline));
    log('First run: saved ' + Object.keys(now).length + ' buildings as the starting point.');
    return;
  }

  const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  const changed = Object.keys(now).filter((id) => state[id] !== now[id].sig);
  if (changed.length === 0) { return; }

  if (changed.length > MAX_BUILDINGS_PER_RUN) {
    log('Too many changed buildings (' + changed.length + '). Run refresh_tiles.bat, then delete state.json.');
    return;
  }

  log('Changed buildings: ' + changed.length);
  changed.forEach((id) => {
    if (reseed(now[id])) {
      state[id] = now[id].sig;
      log('Tiles remade for building ' + id);
    }
  });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state));
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Keep checking forever
(async () => {
  const pool = await sql.connect(dbConfig);
  log('Watcher started. Checking every ' + CHECK_EVERY_SECONDS + ' seconds.');
  while (true) {
    try {
      await runOnce(pool);
    } catch (err) {
      log('Error: ' + err.message);
    }
    await sleep(CHECK_EVERY_SECONDS * 1000);
  }
})();