#!/usr/bin/env node
/* ===================== contact-sheet rater =====================
   Turns taste into data. Renders twelve frames at a time, you mark each one
   love / okay / nope, and the verdicts land in tune/ratings.json as a list of
   seeds. That file is the thing everything downstream needs: a judge has to be
   told what good looks like, and the only source for that is you.

   Two things it is careful about, both learned the hard way in this repo:

   1. A RATING BELONGS TO A BUILD. The seed is not the drawing — the generator
      is. Change the geometry and the same seed renders a different machine, so
      a rating made against an older build is describing something that no
      longer exists. Every verdict records the build it was made against, and
      the tool warns when it loads ratings from a build that is not the current
      one. Without that the pool rots silently, which is the worst way for it
      to rot.

   2. RATE WHAT YOU CAN COMPARE. Twelve to a sheet, because a mech is judged
      against its siblings rather than in isolation — the same reason the judge
      downstream is pairwise rather than absolute.

     node tune/rate.js            open http://127.0.0.1:8732
     node tune/rate.js --export   print the love-tier seeds and exit
     node tune/rate.js --stats    counts by verdict, chassis and drive
*/
"use strict";
const fs = require("fs");
const path = require("path");
const http = require("http");
const crypto = require("crypto");
const { execSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "index.html");
const DATA = path.join(__dirname, "ratings.json");
const BUILD_JS = path.join(__dirname, ".build.js");
const PORT = 8732;
const PER_SHEET = 12;

/* ---- the generator, sliced out of the page ----
   Everything above the app banner is geometry and rendering with no DOM
   dependency. The markers move as the file is edited, so they are searched for
   rather than assumed. */
function loadGenerator() {
  const html = fs.readFileSync(SRC, "utf8");
  const m = html.match(/<script>([\s\S]*)<\/script>/);
  if (!m) throw new Error("no <script> block in index.html");
  const body = m[1];
  const cut = body.indexOf("/* ===================== app =====================");
  if (cut < 0) throw new Error("app banner not found — has the file been restructured?");
  fs.writeFileSync(BUILD_JS,
    body.slice(0, cut) +
    "\nmodule.exports={buildMech,SvgTarget,renderSheet};\n");
  delete require.cache[require.resolve(BUILD_JS)];
  return require(BUILD_JS);
}

/* A rating is only meaningful against the geometry that produced it, so stamp
   both the commit and a hash of the file itself — the working tree is usually
   ahead of the last commit while any of this is being tuned. */
function buildId() {
  let sha = "nogit";
  try { sha = execSync("git rev-parse --short HEAD", { cwd: ROOT }).toString().trim(); } catch {}
  const hash = crypto.createHash("sha256")
    .update(fs.readFileSync(SRC)).digest("hex").slice(0, 10);
  return `${sha}:${hash}`;
}

function load() {
  if (!fs.existsSync(DATA)) return { version: 1, ratings: [] };
  try { return JSON.parse(fs.readFileSync(DATA, "utf8")); }
  catch (e) { throw new Error(`ratings.json is not valid JSON (${e.message}) — refusing to overwrite it`); }
}
function save(db) {
  fs.writeFileSync(DATA, JSON.stringify(db, null, 1));
}

const PAL = { bg: "#0E2E52", ink: "#D9E6F2" };
const P = { fuse: 0.5, detail: 0.55, line: 0.8 };
const VIEWS = {
  iso:   { yaw: 0.95,   pitch: 0.16 },
  front: { yaw: 1.5708, pitch: 0.03 }
};

function renderOne(G, seed, view) {
  const W = 430, H = 560;
  const m = G.buildMech(seed, P, {});
  const t = G.SvgTarget(W, H);
  const v = VIEWS[view] || VIEWS.iso;
  G.renderSheet(t, W, H, m, P, PAL,
    { reveal: 1, k: 1, block: false, env: false, tone: true, solo: true, yaw: v.yaw, pitch: v.pitch });
  return {
    seed,
    svg: t.serialize(),
    desig: m.meta.desig,
    chassis: m.chosen.topo.n,
    drive: m.chosen.drive ? m.chosen.drive.n : "—",
    yokes: `${m.chosen.shoulder ? m.chosen.shoulder.n : "—"} / ${m.chosen.shoulderL ? m.chosen.shoulderL.n : "—"}`,
    arms: `${m.chosen.fore ? m.chosen.fore.n : "—"} / ${m.chosen.foreL ? m.chosen.foreL.n : "—"}`,
    hw: +(m.meta.beam / m.meta.length).toFixed(2),
    parts: m.parts.length
  };
}

function batch(G, db, n, view) {
  const seen = new Set(db.ratings.map(r => r.seed));
  const out = [];
  let guard = 0;
  while (out.length < n && guard++ < n * 40) {
    const seed = Math.floor(Math.random() * 4294967296);
    if (seen.has(seed)) continue;
    seen.add(seed);
    try { out.push(renderOne(G, seed, view)); }
    catch (e) { /* a seed that will not build is not a taste question — skip it */ }
  }
  return out;
}

/* ---------------------------------------------------------------- cli ---- */
const argv = process.argv.slice(2);
if (argv.includes("--export") || argv.includes("--stats")) {
  const db = load();
  const cur = buildId();
  const stale = db.ratings.filter(r => r.build !== cur).length;
  if (argv.includes("--export")) {
    const love = db.ratings.filter(r => r.rating === "love" && r.build === cur);
    console.error(`# ${love.length} love-tier seeds at build ${cur}` +
      (stale ? `  (${stale} ratings from other builds excluded)` : ""));
    love.forEach(r => console.log(r.seed));
  } else {
    const by = k => db.ratings.reduce((a, r) => (a[r[k]] = (a[r[k]] || 0) + 1, a), {});
    console.log("build          ", cur);
    console.log("total ratings  ", db.ratings.length, stale ? `(${stale} from other builds)` : "");
    console.log("by verdict     ", JSON.stringify(by("rating")));
    console.log("by chassis     ", JSON.stringify(by("chassis")));
    console.log("by drive       ", JSON.stringify(by("drive")));
    const love = db.ratings.filter(r => r.rating === "love");
    if (love.length) {
      const lc = love.reduce((a, r) => (a[r.chassis] = (a[r.chassis] || 0) + 1, a), {});
      console.log("love by chassis", JSON.stringify(lc));
    }
  }
  process.exit(0);
}

/* --------------------------------------------------------------- serve ---- */
const G = loadGenerator();
const BUILD = buildId();
{
  const db = load();
  const stale = db.ratings.filter(r => r.build !== BUILD).length;
  console.log(`build ${BUILD}`);
  console.log(`${db.ratings.length} ratings on file${stale ? `, ${stale} against a different build` : ""}`);
  if (stale) console.log("  those describe machines this generator no longer makes — see --stats");
}

const PAGE = fs.readFileSync(path.join(__dirname, "rate.html"), "utf8");

http.createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  const send = (code, type, body) => {
    res.writeHead(code, { "content-type": type, "cache-control": "no-store" });
    res.end(body);
  };
  try {
    if (url.pathname === "/") return send(200, "text/html; charset=utf-8", PAGE);

    if (url.pathname === "/batch") {
      const db = load();
      const n = Math.max(1, Math.min(24, +url.searchParams.get("n") || PER_SHEET));
      const view = url.searchParams.get("view") === "front" ? "front" : "iso";
      const items = batch(G, db, n, view);
      const done = db.ratings.filter(r => r.build === BUILD).length;
      const love = db.ratings.filter(r => r.build === BUILD && r.rating === "love").length;
      return send(200, "application/json", JSON.stringify({ items, done, love, build: BUILD }));
    }

    if (url.pathname === "/rate" && req.method === "POST") {
      let raw = "";
      req.on("data", c => (raw += c));
      req.on("end", () => {
        try {
          const r = JSON.parse(raw);
          if (!["love", "okay", "nope"].includes(r.rating)) throw new Error("bad rating");
          const db = load();
          /* a re-rate replaces the old verdict for that seed on this build
             rather than stacking a second one beside it */
          const i = db.ratings.findIndex(x => x.seed === r.seed && x.build === BUILD);
          const row = {
            seed: r.seed, rating: r.rating, build: BUILD,
            at: new Date().toISOString(),
            chassis: r.chassis, drive: r.drive, hw: r.hw
          };
          if (i >= 0) db.ratings[i] = row; else db.ratings.push(row);
          save(db);
          const done = db.ratings.filter(x => x.build === BUILD).length;
          const love = db.ratings.filter(x => x.build === BUILD && x.rating === "love").length;
          send(200, "application/json", JSON.stringify({ ok: true, done, love }));
        } catch (e) { send(400, "application/json", JSON.stringify({ error: e.message })); }
      });
      return;
    }
    send(404, "text/plain", "not found");
  } catch (e) {
    send(500, "text/plain", e.stack || String(e));
  }
}).listen(PORT, "127.0.0.1", () => {
  console.log(`\n  rate at  http://127.0.0.1:${PORT}\n`);
  console.log("  1 nope   2 okay   3 love   ·   click a cell to move   ·   N next sheet\n");
});
