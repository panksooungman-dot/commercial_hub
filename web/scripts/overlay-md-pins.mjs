/**
 * MD Plan 전체층 핀 오버레이 생성 (검증용)
 * Usage: node scripts/overlay-md-pins.mjs
 */
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Use sharp if available, else skip with message
let sharp;
try {
  sharp = require("sharp");
} catch {
  console.error("sharp required");
  process.exit(1);
}

const units = JSON.parse(fs.readFileSync("data/units.json", "utf8"));
const src = fs.readFileSync("src/lib/unit-pins.ts", "utf8");

/** Parse MD_PINS from TS source into nested object */
function parsePins() {
  const start = src.indexOf("const MD_PINS");
  const end = src.indexOf("const MD_PANELS");
  const block = src.slice(start, end);
  const pins = { "1F": { A: {}, B: {} }, "2F": { A: {}, B: {} }, B1: { A: {}, B: {} } };
  let floor = null;
  let building = null;
  for (const line of block.split("\n")) {
    const f = line.match(/^\s*"(1F|2F|B1)"\s*:|^\s*(B1)\s*:/);
    if (f) {
      floor = f[1] || f[2];
      continue;
    }
    const b = line.match(/^\s*([AB])\s*:/);
    if (b && floor) {
      building = b[1];
      continue;
    }
    const p = line.match(/^\s*"([^"]+)"\s*:\s*\{\s*x:\s*([\d.]+),\s*y:\s*([\d.]+)/);
    if (p && floor && building) {
      pins[floor][building][p[1]] = { x: +p[2], y: +p[3] };
    }
  }
  return pins;
}

function lookup(pins, floor, building, unitNo) {
  const map = pins[floor]?.[building] || {};
  if (map[unitNo]) return map[unitNo];
  const bare = unitNo.replace(/^B-/i, "");
  if (map[bare]) return map[bare];
  if (map[`B-${bare}`]) return map[`B-${bare}`];
  return null;
}

const pins = parsePins();
const floors = [
  { floor: "1F", file: "public/images/plans/md-1f.jpg", out: "public/images/plans/_verify-1f.png" },
  { floor: "2F", file: "public/images/plans/md-2f.jpg", out: "public/images/plans/_verify-2f.png" },
  { floor: "B1", file: "public/images/plans/md-b1.jpg", out: "public/images/plans/_verify-b1.png" },
];

for (const { floor, file, out } of floors) {
  const img = sharp(file);
  const meta = await img.metadata();
  const w = meta.width;
  const h = meta.height;
  const sale = units.filter((u) => u.floor === floor && u.status !== "hidden");
  const circles = [];
  const missing = [];
  for (const u of sale) {
    const pos = lookup(pins, floor, u.building, u.unitNo);
    if (!pos) {
      missing.push(`${u.building}-${u.unitNo}`);
      continue;
    }
    const cx = (pos.x / 100) * w;
    const cy = (pos.y / 100) * h;
    const label = u.unitNo.replace(/^B-/, "");
    const color = u.building === "A" ? "rgba(220,80,40,0.92)" : "rgba(40,100,200,0.92)";
    circles.push(`
      <circle cx="${cx}" cy="${cy}" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="${cx}" y="${cy + 3.5}" text-anchor="middle" font-size="9" font-family="Arial" font-weight="bold" fill="white">${label}</text>
    `);
  }
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${circles.join("")}</svg>`;
  await sharp(file)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toFile(out);
  console.log(
    `${floor}: ${sale.length - missing.length}/${sale.length} pins → ${out}` +
      (missing.length ? ` MISSING ${missing.join(",")}` : ""),
  );
}
