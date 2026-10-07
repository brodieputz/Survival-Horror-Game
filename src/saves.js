// Save slots. Each slot holds one run: the run state, plus a snapshot of the
// scene when it was saved in the middle of a building search or a night
// attack, so loading puts you back exactly where you were. Slots live in
// localStorage; a save can also be exported to a file and imported again,
// for example to carry a run from a computer to a phone.
import { migrateRun, loadLegacyRun, clearLegacyRun, BIOMES } from './run.js';

export const SLOTS = 3;
export const SAVE_FORMAT = 1;
const KEY = (i) => `dreaddepths.save.${i}`;
const LAST_KEY = 'dreaddepths.lastSlot';

function check(save) {
  if (!save || typeof save !== 'object') return null;
  // a bare run object (no wrapper) is accepted too
  if (!save.run && (save.version === 2 || save.version === 3)) save = { format: SAVE_FORMAT, savedAt: Date.now(), run: save, scene: null };
  const run = save.run;
  if (!run || (run.version !== 2 && run.version !== 3) || !run.locality || !Array.isArray(run.survivors)) return null;
  save.run = migrateRun(run);
  save.scene = save.scene || null;
  save.savedAt = save.savedAt || Date.now();
  return save;
}

export function readSlot(i) {
  try {
    const s = localStorage.getItem(KEY(i));
    return s ? check(JSON.parse(s)) : null;
  } catch (e) {
    return null;
  }
}

// Returns null on success, or a reason it failed.
export function writeSlot(i, save) {
  try {
    localStorage.setItem(KEY(i), JSON.stringify(save));
    localStorage.setItem(LAST_KEY, String(i));
    return null;
  } catch (e) {
    return e && e.name === 'QuotaExceededError' ? 'Storage is full.' : 'Saving is blocked in this browser.';
  }
}

export function deleteSlot(i) {
  try {
    localStorage.removeItem(KEY(i));
  } catch (e) {
    /* ignore */
  }
}

export function listSlots() {
  const out = [];
  for (let i = 0; i < SLOTS; i++) out.push(readSlot(i));
  return out;
}

export function firstEmptySlot() {
  for (let i = 0; i < SLOTS; i++) if (!readSlot(i)) return i;
  return -1;
}

// The slot played most recently, if it still holds a save.
export function lastSlot() {
  let i = -1;
  try {
    i = parseInt(localStorage.getItem(LAST_KEY) ?? '-1', 10);
  } catch (e) {
    /* ignore */
  }
  if (i >= 0 && i < SLOTS && readSlot(i)) return i;
  for (let k = 0; k < SLOTS; k++) if (readSlot(k)) return k;
  return -1;
}

// The game used to keep a single save; move it into the first slot.
export function migrateLegacySave() {
  const run = loadLegacyRun();
  if (!run) return;
  const i = firstEmptySlot();
  if (i >= 0 && !writeSlot(i, { format: SAVE_FORMAT, savedAt: Date.now(), run, scene: null })) clearLegacyRun();
}

const ago = (t) => {
  const s = Math.max(0, (Date.now() - t) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  const d = Math.floor(s / 86400);
  return d === 1 ? 'yesterday' : `${d} days ago`;
};

// A short description of a save for the load screen.
export function describeSave(save) {
  const run = save.run;
  const alive = run.survivors.filter((s) => s.status !== 'dead').length;
  const nights = run.day - 1;
  let where = run.phase === 'night' ? `Night ${run.day}` : run.phase === 'dusk' ? 'Dusk at camp' : `In camp, ${run.hours} h of daylight left`;
  const sc = save.scene;
  if (sc?.kind === 'building') {
    const loc = run.locality.locations.find((l) => l.id === sc.locId);
    if (loc) where = `Searching ${loc.name}`;
  } else if (sc?.kind === 'night') where = sc.level?.wave?.active ? `Night ${run.day}, under attack` : `Night ${run.day}`;
  return {
    title: `Day ${run.day} · ${run.locality.name}`,
    detail: [
      BIOMES[run.locality.biome]?.name || '',
      `${alive} ${alive === 1 ? 'survivor' : 'survivors'}`,
      `${nights} ${nights === 1 ? 'night' : 'nights'} survived`,
      `level ${run.player.level}`,
    ].join(' · '),
    where,
    saved: `Saved ${ago(save.savedAt)}`,
    permadeath: run.permadeath !== false,
  };
}

// Offer a save as a .json file download.
export function exportSave(save, i) {
  const blob = new Blob([JSON.stringify(save)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dread-depths-slot${i + 1}-day${save.run.day}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// Parse an exported file. Returns the save or null if it isn't one.
export function parseSave(text) {
  try {
    return check(JSON.parse(text));
  } catch (e) {
    return null;
  }
}
