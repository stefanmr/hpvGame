-- ════════════════════════════════════════════════════
-- queries.sql — gotovi upiti za istraživanje
-- Paste u Supabase SQL editor (https://app.supabase.com → SQL Editor)
--
-- Tabela: public.events
-- Kolone: id, created_at, session_id (uuid), workshop_id (text|null),
--         event_type (text), payload (jsonb)
--
-- Iz payload-a (v3.0+) uvek dostupno: t_ms, ver, mode (retry|sim).
-- Stari v1/v2 događaji nemaju mode → NULL.
-- ════════════════════════════════════════════════════


-- ┌─────────────────────────────────────────┐
-- │ 1. OVERVIEW                              │
-- └─────────────────────────────────────────┘

-- 1.1 Ukupan broj sesija, page loads, završetaka po danu (poslednjih 30)
SELECT
  date_trunc('day', created_at)::date AS dan,
  COUNT(DISTINCT session_id) AS sesija,
  COUNT(*) FILTER (WHERE event_type = 'page_load') AS otvaranja,
  COUNT(*) FILTER (WHERE event_type = 'hcp_scenario_end') AS hcp_zavrseno,
  COUNT(*) FILTER (WHERE event_type = 'parent_ending_shown') AS parent_zavrseno
FROM events
WHERE created_at >= now() - interval '30 days'
GROUP BY dan ORDER BY dan DESC;

-- 1.2 Sesije po radionici (workshop_id)
SELECT
  COALESCE(workshop_id, '—bez ID—') AS radionica,
  COUNT(DISTINCT session_id) AS sesija,
  COUNT(*) FILTER (WHERE event_type = 'hcp_scenario_end') AS hcp_zavrseno,
  COUNT(*) FILTER (WHERE event_type = 'parent_ending_shown') AS parent_zavrseno,
  MIN(created_at)::date AS prvi_dan,
  MAX(created_at)::date AS poslednji_dan
FROM events
GROUP BY workshop_id
ORDER BY sesija DESC;

-- 1.3 Mode breakdown (retry vs sim) — broj sesija i događaja
SELECT
  COALESCE(payload->>'mode', '—nepoznat—') AS mode,
  COUNT(DISTINCT session_id) AS sesija,
  COUNT(*) AS dogadjaja
FROM events
GROUP BY mode ORDER BY sesija DESC;


-- ┌─────────────────────────────────────────┐
-- │ 2. HCP IGRA                              │
-- └─────────────────────────────────────────┘

-- 2.1 Ishod po scenariju (good/mid/bad) + prosečno poverenje/spremnost
SELECT
  (payload->>'scenarioIdx')::int + 1 AS scenario,
  payload->>'title' AS naslov,
  COUNT(*) AS zavrseno,
  COUNT(*) FILTER (WHERE payload->>'outcome' = 'good') AS dobro,
  COUNT(*) FILTER (WHERE payload->>'outcome' = 'mid') AS srednje,
  COUNT(*) FILTER (WHERE payload->>'outcome' = 'bad') AS lose,
  ROUND(AVG((payload->>'trust')::numeric), 1) AS avg_poverenje,
  ROUND(AVG((payload->>'will')::numeric), 1) AS avg_spremnost
FROM events
WHERE event_type = 'hcp_scenario_end'
GROUP BY scenario, naslov
ORDER BY scenario;

-- 2.2 Kvalitet izbora po ERI koraku (% dobro/neutral/lose)
SELECT
  (payload->>'stepIdx')::int + 1 AS korak,
  CASE (payload->>'stepIdx')::int
    WHEN 0 THEN 'Eliciraj' WHEN 1 THEN 'Afirmiši'
    WHEN 2 THEN 'Opovrgni' WHEN 3 THEN 'Činjenice' END AS naziv,
  COUNT(*) AS klikova,
  COUNT(*) FILTER (WHERE payload->>'quality' = 'good') AS dobro,
  COUNT(*) FILTER (WHERE payload->>'quality' = 'neutral') AS neutralno,
  COUNT(*) FILTER (WHERE payload->>'quality' = 'bad') AS lose,
  ROUND(100.0 * COUNT(*) FILTER (WHERE payload->>'quality' = 'good') / COUNT(*), 1) AS pct_dobro
FROM events
WHERE event_type = 'hcp_choice'
GROUP BY korak, naziv ORDER BY korak;

-- 2.3 Distribucija opcija po scenariju + koraku
-- "Koja opcija u koraku X scenarija Y najviše zavarava"
-- (Filtriraj WHERE scenario = N za jedan scenario.)
SELECT
  (payload->>'scenarioIdx')::int + 1 AS scenario,
  (payload->>'stepIdx')::int + 1 AS korak,
  payload->>'optionIdx' AS opcija_idx,
  payload->>'quality' AS kvalitet,
  payload->>'optionText' AS tekst,
  COUNT(*) AS klikova
FROM events
WHERE event_type = 'hcp_choice'
GROUP BY scenario, korak, opcija_idx, kvalitet, tekst
ORDER BY scenario, korak, klikova DESC;

-- 2.4 Prosečno pokušaja do tačnog odgovora po koraku
-- (Manje = lakše. Veće = opcije su nejasne/zavaravajuće.)
SELECT
  (payload->>'stepIdx')::int + 1 AS korak,
  COUNT(*) AS zavrsenih_koraka,
  ROUND(AVG((payload->>'attemptIdx')::numeric), 2) AS avg_pokusaja
FROM events
WHERE event_type = 'hcp_choice'
  AND (payload->>'isCorrect')::boolean
GROUP BY korak ORDER BY korak;

-- 2.5 Funnel — drop-off po scenariju
-- Procenat sesija koje su dosegle svaku fazu od onih koje su pokrenule.
WITH s AS (
  SELECT
    (payload->>'scenarioIdx')::int AS sc,
    session_id,
    bool_or(event_type = 'hcp_scenario_start') AS started,
    bool_or(event_type = 'hcp_scenario_end') AS ended,
    MAX((payload->>'stepIdx')::int) FILTER (WHERE event_type = 'hcp_choice') AS max_step
  FROM events
  WHERE payload->>'scenarioIdx' IS NOT NULL
  GROUP BY sc, session_id
)
SELECT
  sc + 1 AS scenario,
  COUNT(*) FILTER (WHERE started) AS pokrenulo,
  COUNT(*) FILTER (WHERE max_step >= 0) AS k1,
  COUNT(*) FILTER (WHERE max_step >= 1) AS k2,
  COUNT(*) FILTER (WHERE max_step >= 2) AS k3,
  COUNT(*) FILTER (WHERE max_step >= 3) AS k4,
  COUNT(*) FILTER (WHERE ended) AS zavrsilo
FROM s GROUP BY sc ORDER BY sc;


-- ┌─────────────────────────────────────────┐
-- │ 3. PARENT IGRA                           │
-- └─────────────────────────────────────────┘

-- 3.1 Ishod po liku (best/rushed/delayed/mid/closed) + avg odluka
SELECT
  (payload->>'personaIdx')::int + 1 AS lik,
  payload->>'name' AS ime,
  COUNT(*) AS zavrseno,
  COUNT(*) FILTER (WHERE payload->>'ending' = 'best') AS najbolji,
  COUNT(*) FILTER (WHERE payload->>'ending' = 'rushed') AS zuran,
  COUNT(*) FILTER (WHERE payload->>'ending' = 'delayed') AS odlozen,
  COUNT(*) FILTER (WHERE payload->>'ending' = 'mid') AS srednji,
  COUNT(*) FILTER (WHERE payload->>'ending' = 'closed') AS zatvoren,
  ROUND(AVG((payload->>'odluka')::numeric), 1) AS avg_odluka
FROM events
WHERE event_type = 'parent_ending_shown'
GROUP BY lik, ime ORDER BY lik;

-- 3.2 Funnel — drop-off po liku
WITH s AS (
  SELECT
    (payload->>'personaIdx')::int AS persona,
    session_id,
    bool_or(event_type = 'parent_persona_start') AS started,
    bool_or(event_type = 'parent_ending_shown') AS ended,
    bool_or(event_type = 'parent_final_reflection') AS reflected,
    MAX((payload->>'sceneIdx')::int) FILTER (WHERE event_type = 'parent_choice') AS max_scene
  FROM events
  WHERE payload->>'personaIdx' IS NOT NULL
  GROUP BY persona, session_id
)
SELECT
  persona + 1 AS lik,
  COUNT(*) FILTER (WHERE started) AS pokrenulo,
  COUNT(*) FILTER (WHERE max_scene >= 0) AS s1,
  COUNT(*) FILTER (WHERE max_scene >= 1) AS s2,
  COUNT(*) FILTER (WHERE max_scene >= 2) AS s3,
  COUNT(*) FILTER (WHERE max_scene >= 3) AS s4,
  COUNT(*) FILTER (WHERE ended) AS kraj,
  COUNT(*) FILTER (WHERE reflected) AS refleksija
FROM s GROUP BY persona ORDER BY persona;

-- 3.3 Prosečne finalne mere po liku
SELECT
  (payload->>'personaIdx')::int + 1 AS lik,
  COUNT(*) AS zavrseno,
  ROUND(AVG((payload->>'anks')::numeric), 1) AS avg_anks,
  ROUND(AVG((payload->>'sas')::numeric), 1) AS avg_sas,
  ROUND(AVG((payload->>'otv')::numeric), 1) AS avg_otv,
  ROUND(AVG((payload->>'odluka')::numeric), 1) AS avg_odluka
FROM events
WHERE event_type = 'parent_ending_shown'
GROUP BY lik ORDER BY lik;


-- ┌─────────────────────────────────────────┐
-- │ 4. SESIJE — dubina, trajanje, povraci    │
-- └─────────────────────────────────────────┘

-- 4.1 Dubina sesije — koliko različitih igara prosečan korisnik proba
-- (Distinct scenariji + likovi po sesiji. Retry istog = 1.)
WITH per_session AS (
  SELECT
    session_id,
    COUNT(DISTINCT payload->>'scenarioIdx')
      FILTER (WHERE event_type = 'hcp_scenario_start') AS hcp_n,
    COUNT(DISTINCT payload->>'personaIdx')
      FILTER (WHERE event_type = 'parent_persona_start') AS parent_n
  FROM events
  GROUP BY session_id
)
SELECT
  COUNT(*) AS ukupno_sesija,
  ROUND(AVG(hcp_n), 2) AS avg_hcp_po_sesiji,
  ROUND(AVG(parent_n), 2) AS avg_parent_po_sesiji,
  ROUND(AVG(hcp_n + parent_n), 2) AS avg_ukupno_po_sesiji
FROM per_session;

-- 4.2 Distribucija sesija po broju odigranih igara (bucketing)
WITH per_session AS (
  SELECT
    session_id,
    COUNT(DISTINCT payload->>'scenarioIdx')
      FILTER (WHERE event_type = 'hcp_scenario_start') +
    COUNT(DISTINCT payload->>'personaIdx')
      FILTER (WHERE event_type = 'parent_persona_start') AS ukupno
  FROM events GROUP BY session_id
)
SELECT
  CASE WHEN ukupno >= 4 THEN '4+' ELSE ukupno::text END AS odigrano,
  COUNT(*) AS sesija,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct
FROM per_session
GROUP BY odigrano
ORDER BY MIN(ukupno);

-- 4.3 Trajanje sesije (iz session_end event-a; samo v3.0+)
-- p50 = median, p90 = donja granica 10% najdužih.
SELECT
  COUNT(*) AS sesija_sa_krajem,
  ROUND(AVG((payload->>'duration_ms')::numeric) / 1000) AS avg_sec,
  ROUND((PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (payload->>'duration_ms')::numeric)) / 1000) AS p50_sec,
  ROUND((PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY (payload->>'duration_ms')::numeric)) / 1000) AS p90_sec
FROM events
WHERE event_type = 'session_end';

-- 4.4 Last screen — gde se sesije završavaju (iz session_end)
SELECT
  payload->>'last_screen' AS ekran,
  COUNT(*) AS sesija
FROM events
WHERE event_type = 'session_end'
GROUP BY ekran ORDER BY sesija DESC;

-- 4.5 Returning korisnici — sesije sa više od jedne posete
WITH visits AS (
  SELECT session_id, COUNT(*) FILTER (WHERE event_type = 'page_load') AS posete
  FROM events GROUP BY session_id
)
SELECT
  posete,
  COUNT(*) AS sesija
FROM visits GROUP BY posete ORDER BY posete;


-- ┌─────────────────────────────────────────┐
-- │ 5. POREĐENJA (retry vs sim, A vs B)      │
-- └─────────────────────────────────────────┘

-- 5.1 Kvalitet izbora po koraku, RAZDVOJENO po modu
-- (Hipoteza: u sim modu prvi izbor je iskreniji jer nema retry.)
SELECT
  COALESCE(payload->>'mode', 'nepoznato') AS mode,
  (payload->>'stepIdx')::int + 1 AS korak,
  COUNT(*) AS klikova,
  ROUND(100.0 * COUNT(*) FILTER (WHERE payload->>'quality' = 'good') / COUNT(*), 1) AS pct_dobro,
  ROUND(100.0 * COUNT(*) FILTER (WHERE payload->>'quality' = 'neutral') / COUNT(*), 1) AS pct_neutral,
  ROUND(100.0 * COUNT(*) FILTER (WHERE payload->>'quality' = 'bad') / COUNT(*), 1) AS pct_lose
FROM events
WHERE event_type = 'hcp_choice'
GROUP BY mode, korak
ORDER BY korak, mode;

-- 5.2 Završetak HCP scenarija po modu — % dobrih ishoda
SELECT
  COALESCE(payload->>'mode', 'nepoznato') AS mode,
  COUNT(*) AS zavrseno,
  ROUND(100.0 * COUNT(*) FILTER (WHERE payload->>'outcome' = 'good') / COUNT(*), 1) AS pct_dobro,
  ROUND(AVG((payload->>'trust')::numeric), 1) AS avg_poverenje,
  ROUND(AVG((payload->>'will')::numeric), 1) AS avg_spremnost
FROM events
WHERE event_type = 'hcp_scenario_end'
GROUP BY mode ORDER BY mode;

-- 5.3 Poređenje dve radionice (zameni 'A' i 'B' workshop_id-jima)
-- WITH a AS (SELECT * FROM events WHERE workshop_id = 'A'),
--      b AS (SELECT * FROM events WHERE workshop_id = 'B')
-- ...


-- ┌─────────────────────────────────────────┐
-- │ 6. TIME SERIES                           │
-- └─────────────────────────────────────────┘

-- 6.1 Završetaka HCP-a po nedelji
SELECT
  date_trunc('week', created_at)::date AS nedelja,
  COUNT(*) AS zavrseno,
  ROUND(100.0 * COUNT(*) FILTER (WHERE payload->>'outcome' = 'good') / COUNT(*), 1) AS pct_dobro
FROM events
WHERE event_type = 'hcp_scenario_end'
GROUP BY nedelja ORDER BY nedelja;

-- 6.2 Sesije po satu — kad ljudi igraju
SELECT
  EXTRACT(hour FROM created_at AT TIME ZONE 'Europe/Belgrade')::int AS sat,
  COUNT(DISTINCT session_id) AS sesija
FROM events
WHERE event_type = 'page_load'
GROUP BY sat ORDER BY sat;
