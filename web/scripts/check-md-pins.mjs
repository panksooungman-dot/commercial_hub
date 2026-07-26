import fs from "fs";

const src = fs.readFileSync("src/lib/unit-pins.ts", "utf8");
const units = JSON.parse(fs.readFileSync("data/units.json", "utf8"));

function floorSection(floor) {
  // "1F": | "2F": | "B1": | B1:
  const patterns = [`"${floor}":`, floor === "B1" ? "B1:" : null].filter(Boolean);
  let idx = -1;
  for (const p of patterns) {
    const i = src.indexOf(p);
    if (i >= 0 && (idx < 0 || i < idx)) idx = i;
  }
  if (idx < 0) return "";
  let end = src.indexOf("MD_PANELS", idx);
  for (const f of ["1F", "2F", "B1"]) {
    for (const p of [`"${f}":`, f === "B1" ? "\n  B1:" : null].filter(Boolean)) {
      const j = src.indexOf(p, idx + 4);
      if (j > idx && j < end) end = j;
    }
  }
  return src.slice(idx, end);
}

function buildingSection(floorSec, building) {
  const re = new RegExp(`\\n\\s*${building}\\s*:`);
  const m = re.exec(floorSec);
  if (!m) return "";
  const rest = floorSec.slice(m.index + m[0].length);
  const next = /\n\s*[AB]\s*:/.exec(rest);
  return rest.slice(0, next ? next.index : rest.length);
}

function hasKey(sec, unitNo) {
  const bare = unitNo.replace(/^B-/i, "");
  return [`"${unitNo}"`, `"${bare}"`, `"B-${bare}"`].some((k) => sec.includes(k));
}

console.log("=== MD Plan 분양호실 핀 커버리지 ===\n");
let total = 0;
let missTotal = 0;
for (const floor of ["1F", "2F", "B1"]) {
  for (const b of ["A", "B"]) {
    const list = units.filter(
      (u) => u.floor === floor && u.building === b && u.status !== "hidden",
    );
    const fSec = floorSection(floor);
    const bSec = buildingSection(fSec, b);
    const miss = list.filter((u) => !hasKey(bSec, u.unitNo)).map((u) => u.unitNo);
    total += list.length;
    missTotal += miss.length;
    console.log(
      `${floor}-${b}: ${list.length - miss.length}/${list.length}` +
        (miss.length ? `  ✗ MISSING: ${miss.join(", ")}` : "  ✓"),
    );
  }
}
console.log(`\n합계: ${total - missTotal}/${total} 매핑` + (missTotal ? ` (미매핑 ${missTotal})` : " (완료)"));
