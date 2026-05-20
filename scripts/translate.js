#!/usr/bin/env node
/* ════════════════════════════════════════════════════
   translate.js — prevod sadržaja igre SR → EN preko Gemini API

   KORIŠĆENJE:
     node scripts/translate.js ui                 # Sve UI stringove
     node scripts/translate.js profiles           # 4 HCP profila
     node scripts/translate.js scenarios          # Svih 8 HCP scenarija
     node scripts/translate.js scenario <idx>     # Pojedinačan scenario (0-7)
     node scripts/translate.js personas           # Sve 4 aktivne persone + 4 stub-a
     node scripts/translate.js persona <idx>      # Pojedinačan lik (0-7)

   OPCIJE:
     --dry-run         Ispisuje JSON, ne piše u fajl
     --model <name>    Override Gemini model (default iz .env)

   Učitava ključ iz .env (GEMINI_API_KEY).
   Bez ikakvih npm paketa — koristi Node 18+ built-in fetch.
   ════════════════════════════════════════════════════ */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const ENV_PATH = path.join(ROOT, ".env");

// ─── .env parser (bez dotenv paketa) ───
function loadEnv() {
  const env = {};
  if (!fs.existsSync(ENV_PATH)) return env;
  const txt = fs.readFileSync(ENV_PATH, "utf8");
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    env[m[1]] = v;
  }
  return env;
}

const ENV = loadEnv();
const API_KEY = ENV.GEMINI_API_KEY;
const DEFAULT_MODEL = ENV.GEMINI_MODEL || "gemini-2.5-pro";

// ─── Args parser ───
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const modelIdx = args.indexOf("--model");
const MODEL = modelIdx >= 0 ? args[modelIdx + 1] : DEFAULT_MODEL;
const positional = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--model");
const CMD = positional[0];
const SUB_IDX = positional[1] != null ? parseInt(positional[1], 10) : null;

if (!API_KEY) {
  console.error("ERROR: GEMINI_API_KEY nije postavljen u .env");
  process.exit(1);
}

// ─── Style guide — sistemski deo prompta ───
const STYLE_GUIDE = `You are translating a Serbian healthcare communication training game into English.

Context: The game trains healthcare workers in evidence-based dialogue with vaccine-hesitant parents. It uses the ERI framework (Elicit → Affirm → Refute → Facts) from Holford et al. (2024) and the attitude root taxonomy from Fasce et al. (2023).

CRITICAL RULES:

1. **Output ONLY valid JSON** matching the input structure exactly. No prose before or after. No markdown fences. No trailing commas. No comments.

2. **Translate VALUES only.** Keep all KEYS identical character-for-character (including \`t\`, \`q\`, \`o\`, \`x\`, \`fb\`, \`i\`, \`l\`, \`em\`, \`in\`, \`re\`, \`imp\`, \`anks\`, \`sas\`, \`otv\`, \`dec\`, \`unlock\`, \`req\`, etc.).

3. **Preserve HTML tags exactly:** \`<em>...</em>\`, \`<strong>...</strong>\`, \`<br>\`, \`<a href="..." onclick="...">...</a>\`, etc. Tag names, attributes and structure must stay identical. Only translate the visible text content inside tags.

4. **DO NOT TRANSLATE these values — keep them verbatim:**
   - Persona names: Marija, Jelena, Sanja, Petar, Goran, Dragan, Tijana, Maja, Lana, Iva, Stefan, Lazar, Mila, Olja
   - Doctor names: Dr Marija Janković, Dr Vesna Lazarević, Dr Aleksandar Petrović, Dr Milica Stević
   - Doctor avatar initials (the \`i\` field — typically 1-2 letters like "MJ", "VL"): keep as-is
   - \`id\` field values (e.g. "pedijatar", "marija") — keep lowercase Serbian
   - Quality flag values: \`q\` stays as "good" / "neutral" / "bad" (already English)
   - Step type values: \`t\` stays as "root" / "affirm" / "refute" / "facts"
   - Ending keys: "best", "rushed", "delayed", "mid", "closed", "pending"
   - Path/unlock tags: "shared", "family", "deep", "weak", "high", "low"
   - URLs, citation references (e.g. "Fasce, A. et al. (2023). Nature Human Behaviour, 7, 1462–1480.")
   - Numeric values

5. **English tone:**
   - Natural, professional, empathic — for healthcare audiences
   - Second-person ("you", "your") when Serbian uses second-person
   - Avoid stilted "translationese" — write what an English-speaking author would write
   - Keep emotional weight intact (grief, fear, defensiveness)

6. **Specific terminology:**
   - "HPV vakcina" → "HPV vaccine"
   - "rak grlića (materice)" → "cervical cancer"
   - "vakcinisati" → "to vaccinate"
   - "lekar/lekarka" → "doctor"
   - "roditelj" → "parent"
   - "saslušanost" → "feeling heard" (the meter measuring whether the parent feels listened to)
   - "spremnost (za vakcinaciju)" → "willingness (to vaccinate)"
   - "poverenje" → "trust"
   - "anksioznost" → "anxiety"
   - "otvorenost" → "openness"
   - "prihvatanje vakcinacije" → "vaccination acceptance"
   - "Eliciraj" → "Elicit"
   - "Afirmišite" → "Affirm"
   - "Opovrgnite" → "Refute"
   - "Činjenice" → "Facts"
   - "attitude root" → "attitude root" (keep technical term)
   - "tetka" → "aunt"
   - "ćerka" → "daughter", "sin" → "son", "deca" → "children"
   - "Pedijatar/Lekar opšte medicine/Ginekolog/Specijalista" → "Pediatrician/General Practitioner/Gynecologist/Specialist"

7. **Cultural references:**
   - Religious/traditional family contexts (e.g. Sanja's Orthodox values): translate respectfully and factually, no editorializing
   - Specific locations (Novi Sad, Beograd): keep names
   - "Big Pharma" → "Big Pharma" (already English)
   - References to Serbian healthcare system: keep as-is contextually ("u Srbiji" → "in Serbia")

8. **Plural and number forms:**
   - English has simpler plural rules. Convert Serbian's 3-form plural (1 / 2-4 / 5+) into appropriate English (singular / plural).
   - "1 razgovor / 2 razgovora / 5 razgovora" → "1 conversation / 2 conversations / 5 conversations"

9. **Quoting style:**
   - Serbian uses «...» and „..." — convert to standard English "..." (double curly or straight quotes)
   - Single quotes inside double: 'word'

Output ONLY the translated JSON below. No commentary.`;

// ─── Gemini API call ───
async function callGemini(content, label = "") {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { text: STYLE_GUIDE + "\n\nINPUT JSON:\n" + JSON.stringify(content, null, 2) + "\n\nOutput the translated JSON now:" }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.4,
      topP: 0.95,
      maxOutputTokens: 32768,
      responseMimeType: "application/json"
    }
  };
  console.error(`  → Gemini (${MODEL}): translating ${label}...`);
  // Retry sa eksponencijalnim backoff-om za transient errore (429, 503, 504)
  let res, json, ms, attempt = 0;
  const maxAttempts = 5;
  while (true) {
    attempt++;
    const t0 = Date.now();
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    ms = Date.now() - t0;
    json = await res.json();
    if (res.ok) break;
    const isTransient = res.status === 429 || res.status === 503 || res.status === 504 || res.status === 500;
    if (!isTransient || attempt >= maxAttempts) {
      console.error("  ✗ HTTP " + res.status, JSON.stringify(json, null, 2));
      throw new Error("Gemini API error " + res.status);
    }
    // Use API-suggested retry delay if present (429)
    let delaySec = Math.min(60, Math.pow(2, attempt) * 2); // 4s, 8s, 16s, 32s, 60s
    const retryInfo = json?.error?.details?.find(d => d["@type"]?.includes("RetryInfo"));
    if (retryInfo?.retryDelay) {
      const m = retryInfo.retryDelay.match(/^(\d+(?:\.\d+)?)s$/);
      if (m) delaySec = Math.min(120, parseFloat(m[1]) + 1);
    }
    console.error(`  ⏳ HTTP ${res.status} — retrying in ${delaySec}s (attempt ${attempt}/${maxAttempts})...`);
    await new Promise(r => setTimeout(r, delaySec * 1000));
  }
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    console.error("  ✗ Empty response:", JSON.stringify(json, null, 2));
    throw new Error("Gemini returned empty content");
  }
  // Some models wrap output in ```json ... ``` even with responseMimeType — strip it
  const stripped = text.trim().replace(/^```(?:json)?\s*/, "").replace(/\s*```\s*$/, "");
  let parsed;
  try {
    parsed = JSON.parse(stripped);
  } catch (e) {
    console.error("  ✗ JSON parse failed. Raw output:\n", text);
    throw e;
  }
  console.error(`  ✓ ${ms}ms`);
  return parsed;
}

// ─── Structure validators (sanity check) ───
function validateSameKeys(orig, trans, path = "") {
  if (Array.isArray(orig)) {
    if (!Array.isArray(trans)) throw new Error(`At ${path}: expected array, got ${typeof trans}`);
    if (orig.length !== trans.length) throw new Error(`At ${path}: array length ${orig.length} != ${trans.length}`);
    orig.forEach((v, i) => validateSameKeys(v, trans[i], `${path}[${i}]`));
  } else if (orig && typeof orig === "object") {
    if (!trans || typeof trans !== "object") throw new Error(`At ${path}: expected object, got ${typeof trans}`);
    const origKeys = Object.keys(orig).sort();
    const transKeys = Object.keys(trans).sort();
    if (JSON.stringify(origKeys) !== JSON.stringify(transKeys)) {
      throw new Error(`At ${path}: keys differ\n  orig: ${origKeys.join(",")}\n  trans: ${transKeys.join(",")}`);
    }
    origKeys.forEach(k => validateSameKeys(orig[k], trans[k], `${path}.${k}`));
  }
  // primitives: don't compare values (those should be different — translated)
}

// ─── File patchers ───
// Replace en:[ ... ] block in scenarios.js / personas.js
function replaceEnArray(filePath, enContent, varName) {
  const src = fs.readFileSync(filePath, "utf8");
  // Match the en:[...] block. We use bracket-counting to find the matching ].
  // Pattern starts at `],en:[` (separator from sr to en) and ends with `]};`
  const startIdx = src.indexOf(",en:[");
  if (startIdx < 0) throw new Error(`Cannot find ,en:[ in ${filePath}`);
  // Find the matching ]} after this
  let i = startIdx + ",en:[".length;
  let depth = 1;
  while (i < src.length && depth > 0) {
    const c = src[i];
    if (c === "[") depth++;
    else if (c === "]") depth--;
    if (depth === 0) break;
    i++;
  }
  if (depth !== 0) throw new Error(`Unbalanced brackets in ${filePath}`);
  // i is at the closing ] of en array
  const closingIdx = i + 1; // points at the closing ]
  const before = src.slice(0, startIdx);
  const after = src.slice(closingIdx); // starts with `]` then `};`
  // Wait — i is the closing ], so src.slice(i) starts with `]`. Hmm rework:
  // Actually let me redo: startIdx points at `,`. start of `,en:[` is `,`.
  // Let me just replace from `,en:[` start up to the closing `]` (inclusive).
  const enBlockStart = startIdx; // points at ,
  const enBlockEnd = i + 1; // one past the ]
  const newEnBlock = `,en:${JSON.stringify(enContent, null, 0)}`;
  const out = src.slice(0, enBlockStart) + newEnBlock + src.slice(enBlockEnd);
  fs.writeFileSync(filePath, out);
  console.error(`  ✓ wrote ${enContent.length} items to ${path.basename(filePath)} (${varName}.en)`);
}

// Replace en: { ... } block in ui.js.
// Skipping comments: traži samo `en: {` koje DIREKTNO sledi posle `},` (kraj sr bloka).
// Time se ne hvataju primeri u JSDoc komentarima.
function replaceEnObject(filePath, enContent) {
  const src = fs.readFileSync(filePath, "utf8");
  const m = src.match(/\},\s*(?:\/\/[^\n]*\n\s*)*en:\s*\{/);
  if (!m) throw new Error(`Cannot find "},\\nen: {" pattern in ${filePath}`);
  const startOfEn = m.index + m[0].lastIndexOf("en:");
  const openBrace = m.index + m[0].length - 1; // index of "{" we just matched
  let i = openBrace + 1;
  let depth = 1;
  while (i < src.length && depth > 0) {
    const c = src[i];
    if (c === "{") depth++;
    else if (c === "}") depth--;
    if (depth === 0) break;
    i++;
  }
  if (depth !== 0) throw new Error(`Unbalanced braces in ${filePath}`);
  const enBlockEnd = i + 1;
  const newEnBlock = "en: " + JSON.stringify(enContent, null, 0);
  const out = src.slice(0, startOfEn) + newEnBlock + src.slice(enBlockEnd);
  fs.writeFileSync(filePath, out);
  console.error(`  ✓ wrote ${Object.keys(enContent).length} keys to ${path.basename(filePath)} (UI.en)`);
}

// ─── Data loaders (load SR content from current files) ───
function loadDataFile(filePath, varName) {
  // Run the file in a sandbox and extract the named variable
  const src = fs.readFileSync(filePath, "utf8");
  const vm = require("vm");
  const ctx = vm.createContext({});
  vm.runInContext(src + `\nthis.__OUT__ = ${varName};`, ctx);
  return ctx.__OUT__;
}

// ─── Commands ───
async function cmdUi() {
  const UI = loadDataFile(path.join(ROOT, "ui.js"), "UI");
  const sr = UI.sr;
  console.error(`Translating ${Object.keys(sr).length} UI strings...`);
  const en = await callGemini(sr, "UI strings");
  validateSameKeys(sr, en, "UI");
  if (DRY_RUN) {
    console.log(JSON.stringify(en, null, 2));
    return;
  }
  replaceEnObject(path.join(ROOT, "ui.js"), en);
}

async function cmdProfiles() {
  const HCP_PROFILES = loadDataFile(path.join(ROOT, "scenarios.js"), "HCP_PROFILES");
  const sr = HCP_PROFILES.sr;
  console.error(`Translating ${sr.length} HCP profiles...`);
  const en = await callGemini(sr, "HCP profiles");
  validateSameKeys(sr, en, "HCP_PROFILES");
  if (DRY_RUN) {
    console.log(JSON.stringify(en, null, 2));
    return;
  }
  // For scenarios.js we have BOTH HCP_PROFILES and HCP_SCENARIOS in same file.
  // We need to replace only HCP_PROFILES.en. Find the FIRST `,en:[]` (or `,en:[...]`)
  // since profiles come first. But replaceEnArray uses indexOf which finds first.
  replaceEnArray(path.join(ROOT, "scenarios.js"), en, "HCP_PROFILES");
}

async function cmdScenario(idx) {
  const HCP_SCENARIOS = loadDataFile(path.join(ROOT, "scenarios.js"), "HCP_SCENARIOS");
  const srAll = HCP_SCENARIOS.sr;
  if (idx < 0 || idx >= srAll.length) throw new Error(`Scenario index ${idx} out of range [0, ${srAll.length - 1}]`);
  const sr = srAll[idx];
  console.error(`Translating scenario ${idx}: "${sr.title}"...`);
  const en = await callGemini(sr, `scenario ${idx} "${sr.title}"`);
  validateSameKeys(sr, en, `HCP_SCENARIOS[${idx}]`);
  if (DRY_RUN) {
    console.log(JSON.stringify(en, null, 2));
    return;
  }
  // Read current EN array, splice in the translated scenario at idx, write back
  const currentEn = HCP_SCENARIOS.en || [];
  // Pad with nulls if needed
  while (currentEn.length < idx) currentEn.push(null);
  currentEn[idx] = en;
  // Write back: replace the SECOND `,en:[` (since profiles come first)
  patchScenariosEn(currentEn);
}

async function cmdScenarios() {
  const HCP_SCENARIOS = loadDataFile(path.join(ROOT, "scenarios.js"), "HCP_SCENARIOS");
  const sr = HCP_SCENARIOS.sr;
  console.error(`Translating ${sr.length} HCP scenarios one by one (incremental write)...`);
  // Učitaj postojeći en, dopuni gde fali
  const en = (HCP_SCENARIOS.en && HCP_SCENARIOS.en.length) ? [...HCP_SCENARIOS.en] : [];
  while (en.length < sr.length) en.push(null);
  for (let i = 0; i < sr.length; i++) {
    if (en[i] && !DRY_RUN) {
      console.error(`\n[${i + 1}/${sr.length}] "${sr[i].title}" — već prevedeno, preskačem`);
      continue;
    }
    console.error(`\n[${i + 1}/${sr.length}] "${sr[i].title}"`);
    const t = await callGemini(sr[i], `scenario ${i}`);
    validateSameKeys(sr[i], t, `HCP_SCENARIOS[${i}]`);
    en[i] = t;
    if (!DRY_RUN) patchScenariosEn(en);
  }
  if (DRY_RUN) console.log(JSON.stringify(en, null, 2));
}

// scenarios.js has HCP_PROFILES first, then HCP_SCENARIOS. We need to replace
// the SECOND `,en:[]` block.
function patchScenariosEn(enContent) {
  const filePath = path.join(ROOT, "scenarios.js");
  const src = fs.readFileSync(filePath, "utf8");
  // Find the second occurrence of `,en:[`
  const first = src.indexOf(",en:[");
  if (first < 0) throw new Error("No ,en:[ in scenarios.js");
  const second = src.indexOf(",en:[", first + 1);
  if (second < 0) throw new Error("Only one ,en:[ found in scenarios.js — expected two");
  // Find matching ] for second occurrence
  let i = second + ",en:[".length;
  let depth = 1;
  while (i < src.length && depth > 0) {
    const c = src[i];
    if (c === "[") depth++;
    else if (c === "]") depth--;
    if (depth === 0) break;
    i++;
  }
  if (depth !== 0) throw new Error("Unbalanced brackets in scenarios.js");
  const enBlockEnd = i + 1;
  const newBlock = `,en:${JSON.stringify(enContent, null, 0)}`;
  const out = src.slice(0, second) + newBlock + src.slice(enBlockEnd);
  fs.writeFileSync(filePath, out);
  console.error(`  ✓ wrote ${enContent.length} items to scenarios.js (HCP_SCENARIOS.en)`);
}

async function cmdPersona(idx) {
  const PERSONAS = loadDataFile(path.join(ROOT, "personas.js"), "PERSONAS");
  const srAll = PERSONAS.sr;
  if (idx < 0 || idx >= srAll.length) throw new Error(`Persona index ${idx} out of range [0, ${srAll.length - 1}]`);
  const sr = srAll[idx];
  console.error(`Translating persona ${idx}: "${sr.name}"...`);
  const en = await callGemini(sr, `persona ${idx} "${sr.name}"`);
  validateSameKeys(sr, en, `PERSONAS[${idx}]`);
  if (DRY_RUN) {
    console.log(JSON.stringify(en, null, 2));
    return;
  }
  const currentEn = PERSONAS.en || [];
  while (currentEn.length < idx) currentEn.push(null);
  currentEn[idx] = en;
  replaceEnArray(path.join(ROOT, "personas.js"), currentEn, "PERSONAS");
}

async function cmdPersonas() {
  const PERSONAS = loadDataFile(path.join(ROOT, "personas.js"), "PERSONAS");
  const sr = PERSONAS.sr;
  console.error(`Translating ${sr.length} personas one by one (incremental write)...`);
  const en = (PERSONAS.en && PERSONAS.en.length) ? [...PERSONAS.en] : [];
  while (en.length < sr.length) en.push(null);
  for (let i = 0; i < sr.length; i++) {
    if (en[i] && !DRY_RUN) {
      console.error(`\n[${i + 1}/${sr.length}] "${sr[i].name}" — već prevedeno, preskačem`);
      continue;
    }
    console.error(`\n[${i + 1}/${sr.length}] "${sr[i].name}" (active: ${sr[i].active})`);
    const t = await callGemini(sr[i], `persona ${i} "${sr[i].name}"`);
    validateSameKeys(sr[i], t, `PERSONAS[${i}]`);
    en[i] = t;
    if (!DRY_RUN) replaceEnArray(path.join(ROOT, "personas.js"), en, "PERSONAS");
  }
  if (DRY_RUN) console.log(JSON.stringify(en, null, 2));
}

// ─── Main dispatch ───
async function main() {
  if (!CMD) {
    console.error("Usage: node scripts/translate.js <command> [args]");
    console.error("Commands: ui | profiles | scenarios | scenario <idx> | personas | persona <idx>");
    console.error("Options:  --dry-run, --model <name>");
    process.exit(1);
  }
  try {
    switch (CMD) {
      case "ui": await cmdUi(); break;
      case "profiles": await cmdProfiles(); break;
      case "scenarios": await cmdScenarios(); break;
      case "scenario":
        if (SUB_IDX == null) throw new Error("scenario command needs an index");
        await cmdScenario(SUB_IDX);
        break;
      case "personas": await cmdPersonas(); break;
      case "persona":
        if (SUB_IDX == null) throw new Error("persona command needs an index");
        await cmdPersona(SUB_IDX);
        break;
      default:
        throw new Error(`Unknown command: ${CMD}`);
    }
    console.error("\nDONE.");
  } catch (e) {
    console.error("\nFAIL:", e.message);
    process.exit(1);
  }
}

main();
