/* ════════════════════════════════════════════════════
   engine.js — logika igre, state, render funkcije

   Ovaj fajl se ne edituje u radu dan-za-dan.
   Sav sadržaj (tekst, scenariji, persone) ide u:
     scenarios.js  — Igra 01 (HCP)
     personas.js   — Igra 02 (Roditelj)
   ════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════
   STATE
   ════════════════════════════════════════════════════ */
const STORAGE_KEY="ondk_v2";
let S={
  screen:"role",
  game:null,        // 'hcp' or 'parent'
  mode:"retry",     // 'retry' (default) or 'sim' (no retry, locked-in choices)
  hcpProfile:null,
  hcpScenarioIdx:null,
  hcpCompletedScenarios:[],
  hcpStepIdx:0,
  trust:50,will:30,
  hcpResults:[],
  hcpScenarioLog:[],
  totalRoots:0,totalGood:0,
  personaIdx:null,
  pSceneIdx:0,
  pPath:[],         // unlocks
  pChoices:[],
  anks:50,sas:0,otv:15,odluka:20,
  pEnding:null
};

function loadState(){try{const x=localStorage.getItem(STORAGE_KEY);if(x){Object.assign(S,JSON.parse(x));if(S.hcpProfile==="skolski")S.hcpProfile="specijalista";return 1}}catch(e){}return 0}
function saveState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(S))}catch(e){}}
function resetState(){if(!confirm("Resetuj sve i počni iznova?"))return;try{localStorage.removeItem(STORAGE_KEY)}catch(e){}location.reload()}

function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

function goHome(){if(S.screen!=="role"&&!confirm("Vratiti se na početak? Trenutni napredak se čuva."))return;showScreen("role");S.screen="role";saveState()}

function showScreen(id){["s-role","s-hcp-profile","s-hcp-pick","s-hcp-game","s-hcp-summary","s-parent-pick","s-parent-game"].forEach(x=>document.getElementById(x).classList.add("hidden"));document.getElementById("s-"+id).classList.remove("hidden");updateCrumb(id);window.scrollTo({top:0,behavior:"smooth"})}

function updateCrumb(id){
  const c=document.getElementById("crumb");
  let parts=[];
  if(id==="role"){c.classList.add("hidden");return}
  c.classList.remove("hidden");
  parts.push('<a onclick="goHome()">Početak</a>');
  if(id==="hcp-profile"||id==="hcp-pick"||id==="hcp-game"||id==="hcp-summary"){parts.push('<span class="crumb-sep">·</span><a onclick="showScreen(\'hcp-profile\')">Lekar</a>')}
  if(id==="hcp-pick"||id==="hcp-game"||id==="hcp-summary"){parts.push('<span class="crumb-sep">·</span><a onclick="showScreen(\'hcp-pick\')">Scenariji</a>')}
  if(id==="parent-pick"||id==="parent-game"){parts.push('<span class="crumb-sep">·</span><a onclick="showScreen(\'parent-pick\')">Roditelj</a>')}
  c.innerHTML=parts.join("")
}

/* ════════════════════════════════════════════════════
   ENTRY POINTS
   ════════════════════════════════════════════════════ */
function enterGame(g){
  S.game=g;
  track("game_enter",{game:g});
  if(g==="hcp"){
    if(!S.hcpProfile)showHcpProfiles();
    else showScreen("hcp-pick"),renderHcpScenarios();
  }else{
    showScreen("parent-pick");
    renderPersonas();
  }
  saveState()
}

function showHcpProfiles(){
  showScreen("hcp-profile");
  const g=document.getElementById("hcpProfiles");
  g.innerHTML=HCP_PROFILES.map(p=>`<button class="profile-card${S.hcpProfile===p.id?' selected':''}" onclick="pickHcp('${p.id}')"><div class="profile-name">${p.name}</div><div class="profile-desc">${p.desc}</div></button>`).join("")
}

function pickHcp(id){
  S.hcpProfile=id;
  track("hcp_profile_pick",{profile:id});
  saveState();
  showScreen("hcp-pick");
  renderHcpScenarios()
}

function renderHcpScenarios(){
  const g=document.getElementById("hcpScenarios");
  g.innerHTML=HCP_SCENARIOS.map((s,i)=>{
    const done=S.hcpCompletedScenarios.includes(i);
    return `<button class="profile-card${done?' selected':''}" onclick="startHcpScenario(${i})"><div style="font-family:'Fraunces',serif;font-style:italic;color:var(--coral);font-size:12px;margin-bottom:4px;font-weight:500">Scenario ${String(i+1).padStart(2,'0')}${done?' · završen':''}</div><div class="profile-name" style="font-size:17px">${s.title}</div><div class="profile-desc" style="font-size:13px;margin-top:6px">${s.parent.l}</div></button>`
  }).join("");
  document.getElementById("hcpFinish").style.display=S.hcpCompletedScenarios.length>0?"inline-flex":"none"
}

/* ════════════════════════════════════════════════════
   HCP GAME
   ════════════════════════════════════════════════════ */
const HCP_IMPACT={
  root:{correct:{trust:5},incorrect:{trust:-3}},
  affirm:{good:{trust:15},neutral:{trust:0},bad:{trust:-15}},
  refute:{good:{trust:10,will:20},neutral:{will:5},bad:{trust:-10,will:-10}},
  facts:{good:{trust:5,will:20},neutral:{will:5}}
};

function clamp(v){return Math.max(0,Math.min(100,v))}

function startHcpScenario(idx){
  const sc=HCP_SCENARIOS[idx];
  S.hcpScenarioIdx=idx;
  S.hcpStepIdx=0;
  S.trust=sc.startTrust??50;
  S.will=sc.startWill??30;
  S.hcpScenarioLog=[];
  track("hcp_scenario_start",{
    scenarioIdx:idx,
    title:sc.title,
    profile:S.hcpProfile,
    startTrust:S.trust,
    startWill:S.will
  });
  showScreen("hcp-game");
  renderHcpPips();
  renderHcpMeters(0);
  renderHcpScenarioCard();
  saveState()
}

function renderHcpPips(){
  const sc=HCP_SCENARIOS[S.hcpScenarioIdx];
  const w=document.getElementById("hcpPips");
  w.innerHTML="";
  for(let i=0;i<sc.steps.length;i++){
    const p=document.createElement("div");
    p.className="pip";
    if(i<S.hcpStepIdx)p.classList.add("done");
    else if(i===S.hcpStepIdx)p.classList.add("current");
    w.appendChild(p)
  }
}

function renderHcpMeters(animate,dt,dw){
  document.getElementById("trustFill").style.width=S.trust+"%";
  document.getElementById("willFill").style.width=S.will+"%";
  document.getElementById("trustVal").textContent=Math.round(S.trust);
  document.getElementById("willVal").textContent=Math.round(S.will);
  if(animate){showDelta("trustDel",dt);showDelta("willDel",dw)}
}

function showDelta(id,v){
  if(!v)return;
  const e=document.getElementById(id);
  e.textContent=(v>0?"+":"")+v;
  e.classList.remove("pos","neg");
  e.classList.add(v>0?"pos":"neg");
  e.classList.add("show");
  setTimeout(()=>e.classList.remove("show"),2400)
}

function impactPills(deltas){
  const pills=deltas.filter(([_,v])=>v).map(([lbl,v])=>{
    const sign=v>0?"+":"";
    const cls=v>0?"pos":"neg";
    return `<span class="fb-pill ${cls}">${sign}${v} ${lbl}</span>`
  });
  return pills.length?`<div class="fb-impact">${pills.join("")}</div>`:""
}

function renderHcpScenarioCard(){
  const sc=HCP_SCENARIOS[S.hcpScenarioIdx];
  document.getElementById("hcpScnLbl").innerHTML=`Scenario · <strong>${String(S.hcpScenarioIdx+1).padStart(2,'0')} / ${String(HCP_SCENARIOS.length).padStart(2,'0')}</strong>`;
  const card=document.getElementById("hcpCard");
  const startNote=sc.startWhy?`<div class="start-note fade-in"><div class="start-note-lbl">Polazna pozicija</div><div class="start-note-vals">Poverenje <strong>${sc.startTrust??50}</strong> &nbsp;·&nbsp; Spremnost <strong>${sc.startWill??30}</strong></div><div class="start-note-why">${sc.startWhy}</div></div>`:"";
  card.innerHTML=`<div class="scn-hdr fade-in"><div class="scn-num">Scenario ${String(S.hcpScenarioIdx+1).padStart(2,'0')}</div><h2 class="scn-title">${sc.title}</h2></div><div class="bubble parent fade-in"><div class="bubble-meta"><div class="avatar parent">${sc.parent.i}</div><div class="bubble-label">${sc.parent.l}</div></div><div class="speech">${sc.open}</div></div>${startNote}<div id="hcpStepWrap"></div>`;
  renderHcpStep()
}

const ERI_LABELS=["Eliciraj","Afirmišite","Opovrgnite","Činjenice"];
const ERI_PHASE_KEYS=["eli","aff","ref","fac"];

function renderHcpStep(){
  const sc=HCP_SCENARIOS[S.hcpScenarioIdx];
  const step=sc.steps[S.hcpStepIdx];
  const phase=ERI_PHASE_KEYS[S.hcpStepIdx];
  document.getElementById("hcpStepHint").innerHTML=`Korak ${S.hcpStepIdx+1}/4 · <span class="bar-step-phase phase-${phase}">${ERI_LABELS[S.hcpStepIdx]}</span>`;
  renderHcpPips();
  const wrap=document.getElementById("hcpStepWrap");
  const div=document.createElement("div");
  div.className="fade-in";
  div.id=`hcp-step-${S.hcpStepIdx}`;
  S.hcpAttempts=0;
  const shuffledOpts=shuffle(step.o.map((opt,i)=>({...opt,_i:i})));
  div.innerHTML=`<div class="step-eb phase-${phase}"><span class="step-num">Korak ${String(S.hcpStepIdx+1).padStart(2,'0')}</span><span class="step-tag">${ERI_LABELS[S.hcpStepIdx]}</span></div><div class="prompt">${step.p}</div><div class="choices">${shuffledOpts.map(opt=>`<button class="choice" onclick="pickHcpChoice(${opt._i},this)">${opt.x}</button>`).join("")}</div><div id="hcpFb-${S.hcpStepIdx}"></div>`;
  wrap.appendChild(div);
  setTimeout(()=>div.scrollIntoView({behavior:"smooth",block:"start"}),60)
}

function pickHcpChoice(idx,btn){
  const sc=HCP_SCENARIOS[S.hcpScenarioIdx];
  const step=sc.steps[S.hcpStepIdx];
  const opt=step.o[idx];
  let imp,q;
  if(step.t==="root"){imp=opt.ok?HCP_IMPACT.root.correct:HCP_IMPACT.root.incorrect;q=opt.ok?"good":"bad";if(opt.ok)S.totalRoots++}
  else{imp=HCP_IMPACT[step.t][opt.q];q=opt.q;if(opt.q==="good")S.totalGood++}

  const prevT=S.trust,prevW=S.will;
  if(imp.trust)S.trust=clamp(S.trust+imp.trust);
  if(imp.will)S.will=clamp(S.will+imp.will);
  const dt=S.trust-prevT,dw=S.will-prevW;

  const isCorrect=q==="good";
  const isSimMode=S.mode==="sim";
  if(isSimMode||isCorrect){
    btn.closest(".choices").querySelectorAll(".choice").forEach(b=>b.disabled=true);
    btn.classList.add("sel",q);
  }else{
    btn.disabled=true;
    btn.classList.add("sel",q);
  }

  S.hcpAttempts=(S.hcpAttempts||0)+1;

  if(!S.hcpScenarioLog)S.hcpScenarioLog=[];
  S.hcpScenarioLog.push({
    stepIdx:S.hcpStepIdx,
    stepType:step.t,
    choiceIdx:idx,
    quality:q,
    dt:dt,dw:dw,
    attemptIdx:S.hcpAttempts
  });

  const lblRetry={good:"Odlično",neutral:"Funkcionalno — probajte da pronađete bolji odgovor",bad:"Rizično — pokušajte drugi odgovor"};
  const lblSim={good:"Odlično",neutral:"Funkcionalno — ali nije optimalno",bad:"Rizično — razgovor nastavlja sa posledicama"};
  const lblMap=isSimMode?lblSim:lblRetry;
  const rootLbl=isSimMode?(opt.ok?"Tačno":"Nije tačno — razgovor ide dalje"):(opt.ok?"Tačno":"Nije tačno — pokušajte ponovo");
  const fLbl=step.t==="root"?rootLbl:lblMap[opt.q];
  const showAdvance=isSimMode||isCorrect;
  const nextBtn=showAdvance?`<div class="next-wrap"><button class="btn btn-primary" onclick="nextHcpStep()">${S.hcpStepIdx<sc.steps.length-1?"Sledeći korak":"Završi razgovor"} <span class="arrow">→</span></button></div>`:"";
  const impactBlock=impactPills([["Poverenje",dt],["Spremnost",dw]]);
  document.getElementById(`hcpFb-${S.hcpStepIdx}`).innerHTML=`<div class="fb ${q}"><div class="fb-lbl ${q}">${fLbl}</div>${impactBlock}<div class="fb-text">${opt.fb}</div></div>${nextBtn}`;
  renderHcpMeters(1,dt,dw);
  track("hcp_choice",{
    scenarioIdx:S.hcpScenarioIdx,
    stepIdx:S.hcpStepIdx,
    stepType:step.t,
    optionIdx:idx,
    optionText:_short(opt.x,140),
    quality:q,
    isCorrect:isCorrect,
    attemptIdx:S.hcpAttempts,
    trust:S.trust,will:S.will,
    dTrust:dt,dWill:dw
  });
  setTimeout(()=>window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"}),150);
  saveState()
}

function nextHcpStep(){
  const sc=HCP_SCENARIOS[S.hcpScenarioIdx];
  if(S.hcpStepIdx<sc.steps.length-1){S.hcpStepIdx++;renderHcpStep()}
  else finishHcpScenario()
}

function computeHcpMax(sc){
  // best deltas per step: root +5, affirm +15, refute +10t +20w, facts +5t +20w
  const startT=sc.startTrust??50;
  const startW=sc.startWill??30;
  return {maxTrust:Math.min(100,startT+35),maxWill:Math.min(100,startW+40)}
}

function capPairCls(achieved,max){
  if(achieved>=max)return "pos";
  if(max>0&&achieved<max*0.5)return "neg";
  return "neu"
}

function renderHcpReview(){
  const sc=HCP_SCENARIOS[S.hcpScenarioIdx];
  const labels=ERI_LABELS;
  const log=S.hcpScenarioLog||[];
  if(!log.length)return "";
  const byStep=[[],[],[],[]];
  log.forEach(e=>{if(byStep[e.stepIdx])byStep[e.stepIdx].push(e)});
  const {maxTrust,maxWill}=computeHcpMax(sc);
  const finalT=Math.round(S.trust);
  const finalW=Math.round(S.will);
  const tCls=capPairCls(finalT,maxTrust);
  const wCls=capPairCls(finalW,maxWill);
  const maxWhyHtml=sc.maxWhy?`<div class="review-cap-why"><strong>Zašto plafon nije 100?</strong> ${sc.maxWhy}</div>`:"";
  const capHtml=`<div class="review-cap"><div class="review-cap-lbl">Krajnji rezultat</div><div class="review-cap-vals"><span class="cap-pair ${tCls}">Poverenje <strong>${finalT}</strong> / ${maxTrust}</span><span class="cap-pair ${wCls}">Spremnost <strong>${finalW}</strong> / ${maxWill}</span></div>${maxWhyHtml}</div>`;
  let html='<div class="review fade-in"><h3 class="review-title">Pregled tvojih izbora</h3>'+capHtml;
  for(let i=0;i<sc.steps.length;i++){
    const step=sc.steps[i];
    const attempts=byStep[i];
    if(!attempts.length)continue;
    const multi=attempts.length>1;
    const phase=ERI_PHASE_KEYS[i];
    html+=`<div class="review-step phase-${phase}"><div class="review-step-hdr"><span class="step-num">Korak ${String(i+1).padStart(2,'0')}</span><span class="step-tag">${labels[i]}</span>${multi?`<span class="review-attempts">${attempts.length} pokušaja</span>`:''}</div>`;
    attempts.forEach((a,j)=>{
      const ok=a.quality==="good";
      const cls=ok?"pos":"neg";
      const opt=step.o[a.choiceIdx];
      if(!opt)return;
      const pills=impactPills([["Poverenje",a.dt],["Spremnost",a.dw]]);
      html+=`<div class="review-attempt ${cls}">${multi?`<div class="review-attempt-num">Pokušaj ${j+1}</div>`:''}<div class="review-attempt-hdr"><span class="review-icon ${cls}">${ok?'✓':'✗'}</span><span class="review-opt">«${opt.x}»</span></div>${pills}<div class="review-fb">${opt.fb}</div></div>`;
    });
    if(attempts.length){
      const last=attempts[attempts.length-1];
      if(last.quality!=="good"){
        if(i===0){
          const correctOpt=step.o.find(o=>o.ok);
          if(correctOpt)html+=`<div class="review-correct"><strong>Tačan koren je bio:</strong> «${correctOpt.x}»</div>`;
        }else{
          const goodOpt=step.o.find(o=>o.q==="good");
          if(goodOpt)html+=`<div class="review-correct"><strong>Bolji odgovor bi bio:</strong> «${goodOpt.x}»<div style="margin-top:8px;color:var(--ink-soft);font-size:13px;font-weight:400">${goodOpt.fb}</div></div>`;
        }
      }
    }
    html+='</div>';
  }
  html+='</div>';
  return html
}

function renderPParentReview(){
  const p=PERSONAS[S.personaIdx];
  const choices=S.pChoices||[];
  if(!choices.length)return "";
  let html='<div class="review fade-in"><h3 class="review-title">Pregled tvojih izbora</h3>';
  choices.forEach(ch=>{
    const scene=p.scenes[ch.sceneIdx];
    if(!scene)return;
    const imp=ch.imp||{};
    const pills=impactPills([
      ["Anksioznost",imp.anks||0],
      ["Saslušanost",imp.sas||0],
      ["Otvorenost",imp.otv||0],
      ["Prihvatanje",imp.dec||0]
    ]);
    const inner=ch.inner||"";
    const re=ch.re||"";
    html+=`<div class="review-step"><div class="review-step-hdr"><span class="step-num">Scena ${String(ch.sceneIdx+1).padStart(2,'0')}</span><span class="step-tag">${scene.title}</span></div><div class="review-opt-em">${ch.em||""}</div>${inner?`<div class="review-opt-in">«${inner}»</div>`:''}${pills}${re?`<div class="review-fb"><em>${re}</em></div>`:''}</div>`;
  });
  html+='</div>';
  return html
}

function finishHcpScenario(){
  const sc=HCP_SCENARIOS[S.hcpScenarioIdx];
  let ending,tone,outcome;
  if(S.trust>=70){ending=sc.eGood;tone="Roditelj odlazi sa otvorenim umom.";outcome="good"}
  else if(S.trust>=40){ending=sc.eMid;tone="Roditelj nije ubeđen, ali nije ni zatvoren.";outcome="mid"}
  else{ending=sc.eBad;tone="Razgovor je zatvoren — odlazi sa istom pozicijom.";outcome="bad"}

  S.hcpResults.push({title:sc.title,finalTrust:Math.round(S.trust),finalWill:Math.round(S.will)});
  if(!S.hcpCompletedScenarios.includes(S.hcpScenarioIdx))S.hcpCompletedScenarios.push(S.hcpScenarioIdx);

  track("hcp_scenario_end",{
    scenarioIdx:S.hcpScenarioIdx,
    outcome:outcome,
    trust:Math.round(S.trust),
    will:Math.round(S.will)
  });

  const wrap=document.getElementById("hcpStepWrap");
  const div=document.createElement("div");
  div.className="fade-in";
  div.innerHTML=`<div style="background:var(--cream-warm);padding:28px 26px;margin-top:20px;border-left:3px solid var(--teal)"><div style="font-family:'Fraunces',serif;font-style:italic;color:var(--coral);font-size:13px;margin-bottom:8px">Kraj razgovora</div><h3 style="font-family:'Fraunces',serif;font-size:24px;color:var(--teal-deep);line-height:1.2;margin-bottom:14px;font-weight:500">${tone}</h3><div class="bubble parent" style="margin-top:14px"><div class="bubble-meta"><div class="avatar parent">${sc.parent.i}</div><div class="bubble-label">${sc.parent.l}</div></div><div class="speech">${ending}</div></div><div style="margin-top:18px;font-size:15px;color:var(--ink-soft);line-height:1.55"><strong style="color:var(--teal)">Pouka:</strong> ${sc.take}</div>${renderHcpReview()}<div class="next-wrap"><button class="btn btn-primary" onclick="returnToHcpPick()">Nazad na scenarije <span class="arrow">→</span></button></div></div>`;
  wrap.appendChild(div);
  setTimeout(()=>div.scrollIntoView({behavior:"smooth",block:"start"}),150);
  saveState()
}

function returnToHcpPick(){
  showScreen("hcp-pick");
  renderHcpScenarios()
}

function showHcpSummary(){
  showScreen("hcp-summary");
  const n=S.hcpResults.length;
  const avgT=n?Math.round(S.hcpResults.reduce((a,r)=>a+r.finalTrust,0)/n):0;
  const avgW=n?Math.round(S.hcpResults.reduce((a,r)=>a+r.finalWill,0)/n):0;
  document.getElementById("s-hcp-summary").innerHTML=`<div class="summary fade-in"><div class="eyebrow">Završili ste sesiju</div><h2>${n} razgovor${n===1?'':'a'}.<br><em>Šta sad?</em></h2><p style="font-size:16.5px;color:var(--ink-soft);line-height:1.55">Empatičko opovrgavanje nije veština koja se nauči odjednom — ali je <strong style="color:var(--teal)">moguće je naučiti</strong>. Ključ je da slušate <em>zašto</em> pre nego što odgovorite <em>šta</em>.</p><div class="sum-score"><div class="sum-stat"><div class="sum-stat-lbl">Prosečno poverenje</div><div class="sum-stat-val">${avgT}<em>/100</em></div></div><div class="sum-stat"><div class="sum-stat-lbl">Prosečna spremnost</div><div class="sum-stat-val">${avgW}<em>/100</em></div></div><div class="sum-stat"><div class="sum-stat-lbl">Tačni korenovi</div><div class="sum-stat-val">${S.totalRoots}<em>/${n}</em></div></div><div class="sum-stat"><div class="sum-stat-lbl">Optimalni izbori</div><div class="sum-stat-val">${S.totalGood}<em>/${n*3}</em></div></div></div><div class="sum-takes"><h3>Pet stvari koje treba zapamtiti</h3><div class="take"><div class="take-num">01</div><div class="take-text"><strong>Prvo prepoznajte koren, pa onda govorite.</strong> Argumenti se ponavljaju, ali se motivi razlikuju. Isti odgovor neće raditi za sva tri.</div></div><div class="take"><div class="take-num">02</div><div class="take-text"><strong>Afirmacija pre opovrgavanja.</strong> Holford et al. (2024) — afirmacija je imala najveći efekat, veći od dodavanja činjenica.</div></div><div class="take"><div class="take-num">03</div><div class="take-text"><strong>Konkretno, ne uopšteno.</strong> "Vakcina je bezbedna" radi gotovo nikad. "Aluminijuma u svim vakcinama ima manje nego u mleku za 6 meseci" radi često.</div></div><div class="take"><div class="take-num">04</div><div class="take-text"><strong>Nikad ne osporavajte autonomiju.</strong> Pritisak garantuje suprotan ishod. Pojačajte njihov osećaj kontrole, ne svoje autoritete.</div></div><div class="take"><div class="take-num">05</div><div class="take-text"><strong>Ne morate ubediti danas.</strong> Cilj nije konverzija u jednom razgovoru — cilj je <em>otvoriti vrata</em> za sledeći.</div></div></div><div class="sum-cta"><button class="btn btn-primary" onclick="showScreen('hcp-pick');renderHcpScenarios()">Još jedan scenario <span class="arrow">→</span></button><button class="btn btn-ghost" onclick="goHome()">Početak <span class="arrow">↺</span></button></div><div class="cite"><strong>Reference:</strong> Fasce, A. et al. (2023). Nature Human Behaviour, 7, 1462–1480. · Holford, D. et al. (2024). Health Psychology, 43(6), 426–437. · Alat: <a href="https://jitsuvax.info" target="_blank">jitsuvax.info</a></div></div>`;
  saveState()
}

/* ════════════════════════════════════════════════════
   PARENT GAME
   ════════════════════════════════════════════════════ */
function stubClick(){alert("Ovaj lik je u izradi. Biće dostupan u sledećoj verziji.")}

function renderPersonas(){
  const g=document.getElementById("personas");
  g.innerHTML=PERSONAS.map((p,i)=>{
    const dis=!p.active;
    const onclick=dis?"stubClick()":"startPersona("+i+")";
    const badge=dis?'<div class="persona-badge">Uskoro</div>':'';
    return '<button class="persona-card'+(dis?' disabled':'')+'" onclick="'+onclick+'">'+badge+'<div class="persona-meta">Lik '+String(i+1).padStart(2,'0')+'</div><div class="persona-name">'+p.name+'</div><div class="persona-tag">«'+p.tag+'»</div><div class="persona-hook">'+p.hook+'</div></button>'
  }).join("")
}

function startPersona(idx){
  S.personaIdx=idx;
  S.pSceneIdx=-1; // -1 = intro screen
  S.pPath=[];
  S.pChoices=[];
  S.pEnding=null;
  const p=PERSONAS[idx];
  S.anks=p.start.anks;
  S.sas=p.start.sas;
  S.otv=p.start.otv;
  S.odluka=p.start.dec!=null?p.start.dec:20;
  track("parent_persona_start",{
    personaIdx:idx,
    name:p.name,
    start:{anks:S.anks,sas:S.sas,otv:S.otv,odluka:S.odluka}
  });
  showScreen("parent-game");
  renderPParentMeters(0);
  document.getElementById("pPersonaLbl").innerHTML=`Lik · <strong>${p.name}</strong>`;
  renderPersonaIntro();
  saveState()
}

function renderPParentMeters(animate,da,ds,doo,dd){
  document.getElementById("anksFill").style.width=S.anks+"%";
  document.getElementById("sasFill").style.width=S.sas+"%";
  document.getElementById("otvFill").style.width=S.otv+"%";
  document.getElementById("decFill").style.width=S.odluka+"%";
  document.getElementById("anksVal").textContent=Math.round(S.anks);
  document.getElementById("sasVal").textContent=Math.round(S.sas);
  document.getElementById("otvVal").textContent=Math.round(S.otv);
  document.getElementById("decVal").textContent=Math.round(S.odluka);
  if(animate){
    showDelta("anksDel",da);
    showDelta("sasDel",ds);
    showDelta("otvDel",doo);
    showDelta("decDel",dd);
  }
}

function renderPPips(){
  const p=PERSONAS[S.personaIdx];
  const w=document.getElementById("pPips");
  w.innerHTML="";
  const total=p.scenes.length+1; // +1 for ending
  for(let i=0;i<total;i++){
    const d=document.createElement("div");
    d.className="pip";
    if(S.pSceneIdx>i-1)d.classList.add("done");
    else if(S.pSceneIdx===i-1)d.classList.add("current");
    w.appendChild(d)
  }
}

function renderPersonaIntro(){
  const p=PERSONAS[S.personaIdx];
  document.getElementById("pSceneHint").textContent="Pre razgovora";
  renderPPips();
  const why=p.startWhy?`<div class="intro-state-why"><em>${p.startWhy}</em></div>`:"";
  document.getElementById("pCard").innerHTML=`<div class="intro-card fade-in"><div class="intro-eb">Lik ${String(S.personaIdx+1).padStart(2,'0')}</div><h2 class="intro-name">${p.name}</h2><div class="intro-tag">«${p.tag}»</div><div class="intro-text">${p.intro.map(par=>'<p>'+par+'</p>').join("")}</div><div class="intro-state"><strong>Tvoje stanje sad:</strong> Anksioznost ${p.start.anks} · Saslušanost ${p.start.sas} · Otvorenost ${p.start.otv} · Prihvatanje vakcinacije ${p.start.dec!=null?p.start.dec:20}${why}<br><small style="color:var(--ink-muted)">Tvoji izbori menjaju ove mere. Cilj nije «pobeda» — već iskreni odgovor onome šta lik oseća.</small></div><div class="next-wrap"><button class="btn btn-coral" onclick="startPScene(0)">Ulazak u ordinaciju <span class="arrow">→</span></button></div></div>`
}

function scrollToCard(){
  requestAnimationFrame(()=>{
    const side=document.querySelector(".game-side");
    const sideH=side&&window.innerWidth<=820?side.offsetHeight+4:0;
    document.documentElement.style.scrollPaddingTop=sideH+"px";
    document.getElementById("pCard").scrollIntoView({behavior:"smooth",block:"start"});
  });
}

function startPScene(idx){
  S.pSceneIdx=idx;
  renderPScene();
  saveState();
  scrollToCard()
}

function getDocLine(scene){
  if(scene.docLine)return scene.docLine;
  if(scene.docVariants){
    // pick variant based on unlocks
    for(const tag of S.pPath){
      if(scene.docVariants[tag])return scene.docVariants[tag];
    }
    // fallback by combined state
    const combined=S.sas+S.otv;
    if(scene.docVariants.high&&combined>=40)return scene.docVariants.high;
    return scene.docVariants.low||scene.docVariants.high||Object.values(scene.docVariants)[0];
  }
  // simple high/low
  const combined=S.sas+S.otv;
  if(scene.docHigh&&combined>=30)return scene.docHigh;
  return scene.docLow||scene.docHigh;
}

function renderPScene(){
  const p=PERSONAS[S.personaIdx];
  const scene=p.scenes[S.pSceneIdx];
  document.getElementById("pSceneHint").textContent=`Scena ${S.pSceneIdx+1}/${p.scenes.length}`;
  renderPPips();

  const docLine=getDocLine(scene);

  // filter choices by requirements
  const availChoices=shuffle(scene.choices.filter(c=>!c.req||S.pPath.includes(c.req)));

  document.getElementById("pCard").innerHTML=`<div class="card fade-in"><div class="scn-hdr"><div class="scn-num">Scena ${String(S.pSceneIdx+1).padStart(2,'0')} · ${scene.title}</div></div><div class="bubble doctor"><div class="bubble-meta"><div class="avatar doctor">${p.doc.i}</div><div class="bubble-label">${p.doc.l}</div></div><div class="speech">${docLine}</div></div><div class="prompt">${scene.prompt}</div><div class="choices">${availChoices.map((c,i)=>`<button class="choice-f" onclick="pickPChoice(${scene.choices.indexOf(c)})"><div class="feel-em">${c.em}</div><div class="feel-in">«${c.in}»</div></button>`).join("")}</div><div id="pFb"></div></div>`;
}

function pickPChoice(idx){
  const p=PERSONAS[S.personaIdx];
  const scene=p.scenes[S.pSceneIdx];
  const c=scene.choices[idx];

  const prevA=S.anks,prevS=S.sas,prevO=S.otv,prevD=S.odluka;
  if(c.imp.anks)S.anks=clamp(S.anks+c.imp.anks);
  if(c.imp.sas)S.sas=clamp(S.sas+c.imp.sas);
  if(c.imp.otv)S.otv=clamp(S.otv+c.imp.otv);
  if(c.imp.dec)S.odluka=clamp(S.odluka+c.imp.dec);

  if(c.unlock)S.pPath.push(c.unlock);
  const dA=S.anks-prevA,dS=S.sas-prevS,dO=S.otv-prevO,dD=S.odluka-prevD;
  S.pChoices.push({sceneIdx:S.pSceneIdx,choiceIdx:idx,em:c.em,inner:c.in,re:c.re,imp:{anks:dA,sas:dS,otv:dO,dec:dD}});

  if(c.end)S.pEnding=c.end;

  // disable buttons & mark selected
  document.querySelectorAll(".choice-f").forEach((b,i)=>{
    b.disabled=true;
    const cText=b.querySelector(".feel-em").textContent;
    if(cText===c.em)b.classList.add("sel")
  });

  const impactBlock=impactPills([["Anksioznost",dA],["Saslušanost",dS],["Otvorenost",dO],["Prihvatanje",dD]]);

  // show reaction
  document.getElementById("pFb").innerHTML=`<div class="fb"><div class="fb-lbl" style="color:var(--coral)">U tebi se događa</div>${impactBlock}<div class="fb-text"><em>${c.re}</em></div></div><div class="next-wrap"><button class="btn btn-coral" onclick="nextPScene()">${S.pSceneIdx<p.scenes.length-1?'Sledeća scena':'Izlazak iz ordinacije'} <span class="arrow">→</span></button></div>`;

  renderPParentMeters(1,dA,dS,dO,dD);
  track("parent_choice",{
    personaIdx:S.personaIdx,
    sceneIdx:S.pSceneIdx,
    sceneTitle:_short(scene.title,80),
    choiceIdx:idx,
    em:_short(c.em,60),
    inner:_short(c.in,140),
    imp:c.imp||{},
    unlock:c.unlock||null,
    endTrigger:c.end||null,
    anks:S.anks,sas:S.sas,otv:S.otv,odluka:S.odluka,
    dAnks:dA,dSas:dS,dOtv:dO,dOdluka:dD
  });
  setTimeout(()=>window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"}),150);
  saveState()
}

function nextPScene(){
  const p=PERSONAS[S.personaIdx];
  if(S.pSceneIdx<p.scenes.length-1){
    S.pSceneIdx++;
    renderPScene();
    saveState();
    scrollToCard()
  }else{
    showPEnding()
  }
}

function showPEnding(){
  const p=PERSONAS[S.personaIdx];
  const endingKey=S.pEnding||'closed';
  const e=p.endings[endingKey];
  document.getElementById("pSceneHint").textContent="Kraj";
  S.pSceneIdx=p.scenes.length;
  renderPPips();
  track("parent_ending_shown",{
    personaIdx:S.personaIdx,
    ending:endingKey,
    anks:S.anks,sas:S.sas,otv:S.otv,odluka:S.odluka,
    path:[...S.pPath],
    nChoices:S.pChoices.length
  });

  document.getElementById("pCard").innerHTML=`<div class="end-card fade-in"><div class="end-eb">Posle razgovora</div><div class="scene-narr" style="margin-bottom:24px">${e.phone}</div><div style="margin-bottom:8px;font-size:14px;color:var(--ink-muted);letter-spacing:.04em;text-transform:uppercase;font-weight:500">Šta joj/mu kažeš?</div><div class="choices">${e.opts.map((o,i)=>`<button class="choice-f" onclick="finishPGame(${i})"><div class="feel-em">${o}</div></button>`).join("")}</div></div>`;
  scrollToCard();
  saveState()
}

function finishPGame(selectedIdx){
  const p=PERSONAS[S.personaIdx];
  const endingKey=S.pEnding||'closed';
  const e=p.endings[endingKey];

  track("parent_final_reflection",{
    personaIdx:S.personaIdx,
    ending:endingKey,
    optionIdx:selectedIdx,
    optionText:_short(e.opts[selectedIdx],140)
  });

  document.querySelectorAll(".choice-f").forEach((b,i)=>{
    b.disabled=true;
    if(i===selectedIdx)b.classList.add("sel")
  });

  // append final reflection
  const card=document.querySelector(".end-card");
  const div=document.createElement("div");
  div.className="end-divider fade-in";
  div.innerHTML=`<div class="end-narr">${e.close.map(line=>'<p>'+line+'</p>').join("")}</div><div class="end-final">${p.finalLine}</div>${renderPParentReview()}<div class="next-wrap" style="margin-top:30px"><button class="btn btn-ghost" onclick="returnToPersonaPick()">Probaj drugog lika <span class="arrow">↻</span></button> <button class="btn btn-primary" onclick="goHome()">Početak <span class="arrow">→</span></button></div>`;
  card.appendChild(div);
  setTimeout(()=>div.scrollIntoView({behavior:"smooth",block:"start"}),150);

  // record completion
  if(!S.hcpCompletedScenarios)S.hcpCompletedScenarios=[]; // safety
  saveState()
}

function returnToPersonaPick(){
  showScreen("parent-pick");
  renderPersonas()
}

/* ════════════════════════════════════════════════════
   ON LOAD
   ════════════════════════════════════════════════════ */
window.addEventListener("DOMContentLoaded",()=>{
  loadState();
  // mode: URL param wins over localStorage; fallback default 'retry'
  try{
    const urlMode=new URLSearchParams(location.search).get("mode");
    if(urlMode==="sim"||urlMode==="retry")S.mode=urlMode;
    else if(!S.mode)S.mode="retry";
  }catch(e){if(!S.mode)S.mode="retry"}
  saveState();
  showScreen(S.screen||"role")
});
