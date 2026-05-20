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
  lang:"sr",        // 'sr' (default) or 'en' — kontrolisano kroz ?lang= ili lang toggle
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

/* ════════════════════════════════════════════════════
   i18n getters — data dispatch po S.lang.
   Padajuće: ako EN nije popunjen za pojedinačnu personu/scenario,
   fall-back na SR.
   ════════════════════════════════════════════════════ */
function getScenarios(){
  const en=HCP_SCENARIOS&&HCP_SCENARIOS.en;
  const sr=HCP_SCENARIOS&&HCP_SCENARIOS.sr;
  if(S.lang==="en"&&en&&en.length)return en;
  return sr||[];
}
function getProfiles(){
  const en=HCP_PROFILES&&HCP_PROFILES.en;
  const sr=HCP_PROFILES&&HCP_PROFILES.sr;
  if(S.lang==="en"&&en&&en.length)return en;
  return sr||[];
}
function getPersonas(){
  const en=PERSONAS&&PERSONAS.en;
  const sr=PERSONAS&&PERSONAS.sr;
  if(S.lang==="en"&&en&&en.length)return en;
  return sr||[];
}

function loadState(){try{const x=localStorage.getItem(STORAGE_KEY);if(x){Object.assign(S,JSON.parse(x));if(S.hcpProfile==="skolski")S.hcpProfile="specijalista";return 1}}catch(e){}return 0}
function saveState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(S))}catch(e){}}
function resetState(){if(!confirm(t("dialog.resetConfirm")))return;try{localStorage.removeItem(STORAGE_KEY)}catch(e){}location.reload()}

function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

function goHome(){if(S.screen!=="role"&&!confirm(t("dialog.homeConfirm")))return;showScreen("role");S.screen="role";saveState()}

function showScreen(id){["s-role","s-hcp-profile","s-hcp-pick","s-hcp-game","s-hcp-summary","s-parent-pick","s-parent-game"].forEach(x=>document.getElementById(x).classList.add("hidden"));document.getElementById("s-"+id).classList.remove("hidden");updateCrumb(id);window.scrollTo({top:0,behavior:"smooth"})}

function updateCrumb(id){
  const c=document.getElementById("crumb");
  let parts=[];
  if(id==="role"){c.classList.add("hidden");return}
  c.classList.remove("hidden");
  parts.push('<a onclick="goHome()">'+t("crumb.home")+'</a>');
  if(id==="hcp-profile"||id==="hcp-pick"||id==="hcp-game"||id==="hcp-summary"){parts.push('<span class="crumb-sep">·</span><a onclick="showScreen(\'hcp-profile\')">'+t("crumb.doctor")+'</a>')}
  if(id==="hcp-pick"||id==="hcp-game"||id==="hcp-summary"){parts.push('<span class="crumb-sep">·</span><a onclick="showScreen(\'hcp-pick\')">'+t("crumb.scenarios")+'</a>')}
  if(id==="parent-pick"||id==="parent-game"){parts.push('<span class="crumb-sep">·</span><a onclick="showScreen(\'parent-pick\')">'+t("crumb.parent")+'</a>')}
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
  g.innerHTML=getProfiles().map(p=>`<button class="profile-card${S.hcpProfile===p.id?' selected':''}" onclick="pickHcp('${p.id}')"><div class="profile-name">${p.name}</div><div class="profile-desc">${p.desc}</div></button>`).join("")
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
  g.innerHTML=getScenarios().map((s,i)=>{
    const done=S.hcpCompletedScenarios.includes(i);
    const nn=String(i+1).padStart(2,'0');
    const label=done?t("hcpPick.scenarioDone",{nn:nn}):t("hcpPick.scenarioNum",{nn:nn});
    return `<button class="profile-card${done?' selected':''}" onclick="startHcpScenario(${i})"><div style="font-family:'Fraunces',serif;font-style:italic;color:var(--coral);font-size:12px;margin-bottom:4px;font-weight:500">${label}</div><div class="profile-name" style="font-size:17px">${s.title}</div><div class="profile-desc" style="font-size:13px;margin-top:6px">${s.parent.l}</div></button>`
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
  const sc=getScenarios()[idx];
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
  const sc=getScenarios()[S.hcpScenarioIdx];
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
  const sc=getScenarios()[S.hcpScenarioIdx];
  const nn=String(S.hcpScenarioIdx+1).padStart(2,'0');
  const total=String(getScenarios().length).padStart(2,'0');
  document.getElementById("hcpScnLbl").innerHTML=t("hcpGame.scenarioFull",{nn:nn,total:total});
  const card=document.getElementById("hcpCard");
  const startNote=sc.startWhy?`<div class="start-note fade-in"><div class="start-note-lbl">${t("startNote.label")}</div><div class="start-note-vals">${t("startNote.trust")} <strong>${sc.startTrust??50}</strong> &nbsp;·&nbsp; ${t("startNote.will")} <strong>${sc.startWill??30}</strong></div><div class="start-note-why">${sc.startWhy}</div></div>`:"";
  card.innerHTML=`<div class="scn-hdr fade-in"><div class="scn-num">${t("hcpGame.scnNum",{nn:nn})}</div><h2 class="scn-title">${sc.title}</h2></div><div class="bubble parent fade-in"><div class="bubble-meta"><div class="avatar parent">${sc.parent.i}</div><div class="bubble-label">${sc.parent.l}</div></div><div class="speech">${sc.open}</div></div>${startNote}<div id="hcpStepWrap"></div>`;
  renderHcpStep()
}

const ERI_PHASE_KEYS=["eli","aff","ref","fac"];
function eriLabel(i){return t("step.eri."+i)}

function renderHcpStep(){
  const sc=getScenarios()[S.hcpScenarioIdx];
  const step=sc.steps[S.hcpStepIdx];
  const phase=ERI_PHASE_KEYS[S.hcpStepIdx];
  document.getElementById("hcpStepHint").innerHTML=t("step.counter",{n:S.hcpStepIdx+1})+`<span class="bar-step-phase phase-${phase}">${eriLabel(S.hcpStepIdx)}</span>`;
  renderHcpPips();
  const wrap=document.getElementById("hcpStepWrap");
  const div=document.createElement("div");
  div.className="fade-in";
  div.id=`hcp-step-${S.hcpStepIdx}`;
  S.hcpAttempts=0;
  const shuffledOpts=shuffle(step.o.map((opt,i)=>({...opt,_i:i})));
  const stepNum=t("step.numberPadded",{nn:String(S.hcpStepIdx+1).padStart(2,'0')});
  div.innerHTML=`<div class="step-eb phase-${phase}"><span class="step-num">${stepNum}</span><span class="step-tag">${eriLabel(S.hcpStepIdx)}</span></div><div class="prompt">${step.p}</div><div class="choices">${shuffledOpts.map(opt=>`<button class="choice" onclick="pickHcpChoice(${opt._i},this)">${opt.x}</button>`).join("")}</div><div id="hcpFb-${S.hcpStepIdx}"></div>`;
  wrap.appendChild(div);
  setTimeout(()=>div.scrollIntoView({behavior:"smooth",block:"start"}),60)
}

function pickHcpChoice(idx,btn){
  const sc=getScenarios()[S.hcpScenarioIdx];
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

  const lblRetry={good:t("fb.retry.good"),neutral:t("fb.retry.neutral"),bad:t("fb.retry.bad")};
  const lblSim={good:t("fb.sim.good"),neutral:t("fb.sim.neutral"),bad:t("fb.sim.bad")};
  const lblMap=isSimMode?lblSim:lblRetry;
  const rootLbl=isSimMode?(opt.ok?t("fb.root.correct"):t("fb.root.incorrectSim")):(opt.ok?t("fb.root.correct"):t("fb.root.incorrectRetry"));
  const fLbl=step.t==="root"?rootLbl:lblMap[opt.q];
  const showAdvance=isSimMode||isCorrect;
  const nextBtnLbl=S.hcpStepIdx<sc.steps.length-1?t("btn.nextStep"):t("btn.finishConv");
  const nextBtn=showAdvance?`<div class="next-wrap"><button class="btn btn-primary" onclick="nextHcpStep()">${nextBtnLbl} <span class="arrow">→</span></button></div>`:"";
  const impactBlock=impactPills([[t("impact.trust"),dt],[t("impact.will"),dw]]);
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
  const sc=getScenarios()[S.hcpScenarioIdx];
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
  const sc=getScenarios()[S.hcpScenarioIdx];
  const log=S.hcpScenarioLog||[];
  if(!log.length)return "";
  const byStep=[[],[],[],[]];
  log.forEach(e=>{if(byStep[e.stepIdx])byStep[e.stepIdx].push(e)});
  const {maxTrust,maxWill}=computeHcpMax(sc);
  const finalT=Math.round(S.trust);
  const finalW=Math.round(S.will);
  const tCls=capPairCls(finalT,maxTrust);
  const wCls=capPairCls(finalW,maxWill);
  const maxWhyHtml=sc.maxWhy?`<div class="review-cap-why"><strong>${t("review.cap.why")}</strong> ${sc.maxWhy}</div>`:"";
  const capHtml=`<div class="review-cap"><div class="review-cap-lbl">${t("review.cap.label")}</div><div class="review-cap-vals"><span class="cap-pair ${tCls}">${t("review.cap.trust")} <strong>${finalT}</strong> / ${maxTrust}</span><span class="cap-pair ${wCls}">${t("review.cap.will")} <strong>${finalW}</strong> / ${maxWill}</span></div>${maxWhyHtml}</div>`;
  let html=`<div class="review fade-in"><h3 class="review-title">${t("review.title")}</h3>`+capHtml;
  for(let i=0;i<sc.steps.length;i++){
    const step=sc.steps[i];
    const attempts=byStep[i];
    if(!attempts.length)continue;
    const multi=attempts.length>1;
    const phase=ERI_PHASE_KEYS[i];
    const stepNum=t("step.numberPadded",{nn:String(i+1).padStart(2,'0')});
    html+=`<div class="review-step phase-${phase}"><div class="review-step-hdr"><span class="step-num">${stepNum}</span><span class="step-tag">${eriLabel(i)}</span>${multi?`<span class="review-attempts">${t("review.attempts",{n:attempts.length})}</span>`:''}</div>`;
    attempts.forEach((a,j)=>{
      const ok=a.quality==="good";
      const cls=ok?"pos":"neg";
      const opt=step.o[a.choiceIdx];
      if(!opt)return;
      const pills=impactPills([[t("impact.trust"),a.dt],[t("impact.will"),a.dw]]);
      html+=`<div class="review-attempt ${cls}">${multi?`<div class="review-attempt-num">${t("review.attempt",{n:j+1})}</div>`:''}<div class="review-attempt-hdr"><span class="review-icon ${cls}">${ok?'✓':'✗'}</span><span class="review-opt">«${opt.x}»</span></div>${pills}<div class="review-fb">${opt.fb}</div></div>`;
    });
    if(attempts.length){
      const last=attempts[attempts.length-1];
      if(last.quality!=="good"){
        if(i===0){
          const correctOpt=step.o.find(o=>o.ok);
          if(correctOpt)html+=`<div class="review-correct"><strong>${t("review.correctRoot")}</strong> «${correctOpt.x}»</div>`;
        }else{
          const goodOpt=step.o.find(o=>o.q==="good");
          if(goodOpt)html+=`<div class="review-correct"><strong>${t("review.betterAnswer")}</strong> «${goodOpt.x}»<div style="margin-top:8px;color:var(--ink-soft);font-size:13px;font-weight:400">${goodOpt.fb}</div></div>`;
        }
      }
    }
    html+='</div>';
  }
  html+='</div>';
  return html
}

function renderPParentReview(){
  const p=getPersonas()[S.personaIdx];
  const choices=S.pChoices||[];
  if(!choices.length)return "";
  let html=`<div class="review fade-in"><h3 class="review-title">${t("review.title")}</h3>`;
  choices.forEach(ch=>{
    const scene=p.scenes[ch.sceneIdx];
    if(!scene)return;
    const imp=ch.imp||{};
    const pills=impactPills([
      [t("impact.anks"),imp.anks||0],
      [t("impact.sas"),imp.sas||0],
      [t("impact.otv"),imp.otv||0],
      [t("impact.dec"),imp.dec||0]
    ]);
    const inner=ch.inner||"";
    const re=ch.re||"";
    const sceneNum=t("persona.scene.numPadded",{nn:String(ch.sceneIdx+1).padStart(2,'0')});
    html+=`<div class="review-step"><div class="review-step-hdr"><span class="step-num">${sceneNum}</span><span class="step-tag">${scene.title}</span></div><div class="review-opt-em">${ch.em||""}</div>${inner?`<div class="review-opt-in">«${inner}»</div>`:''}${pills}${re?`<div class="review-fb"><em>${re}</em></div>`:''}</div>`;
  });
  html+='</div>';
  return html
}

function finishHcpScenario(){
  const sc=getScenarios()[S.hcpScenarioIdx];
  let ending,tone,outcome;
  if(S.trust>=70){ending=sc.eGood;tone=t("outcome.good");outcome="good"}
  else if(S.trust>=40){ending=sc.eMid;tone=t("outcome.mid");outcome="mid"}
  else{ending=sc.eBad;tone=t("outcome.bad");outcome="bad"}

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
  div.innerHTML=`<div style="background:var(--cream-warm);padding:28px 26px;margin-top:20px;border-left:3px solid var(--teal)"><div style="font-family:'Fraunces',serif;font-style:italic;color:var(--coral);font-size:13px;margin-bottom:8px">${t("endCard.eyebrow")}</div><h3 style="font-family:'Fraunces',serif;font-size:24px;color:var(--teal-deep);line-height:1.2;margin-bottom:14px;font-weight:500">${tone}</h3><div class="bubble parent" style="margin-top:14px"><div class="bubble-meta"><div class="avatar parent">${sc.parent.i}</div><div class="bubble-label">${sc.parent.l}</div></div><div class="speech">${ending}</div></div><div style="margin-top:18px;font-size:15px;color:var(--ink-soft);line-height:1.55"><strong style="color:var(--teal)">${t("endCard.lesson")}</strong> ${sc.take}</div>${renderHcpReview()}<div class="next-wrap"><button class="btn btn-primary" onclick="returnToHcpPick()">${t("btn.backToScenarios")} <span class="arrow">→</span></button></div></div>`;
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
  const summaryTitle=tn("summary.title",n,{n:n});
  const takes=[1,2,3,4,5].map(k=>`<div class="take"><div class="take-num">0${k}</div><div class="take-text"><strong>${t("summary.takes."+k+".title")}</strong> ${t("summary.takes."+k+".body")}</div></div>`).join("");
  document.getElementById("s-hcp-summary").innerHTML=`<div class="summary fade-in"><div class="eyebrow">${t("summary.eyebrow")}</div><h2>${summaryTitle}</h2><p style="font-size:16.5px;color:var(--ink-soft);line-height:1.55">${t("summary.intro")}</p><div class="sum-score"><div class="sum-stat"><div class="sum-stat-lbl">${t("summary.stat.avgTrust")}</div><div class="sum-stat-val">${avgT}<em>/100</em></div></div><div class="sum-stat"><div class="sum-stat-lbl">${t("summary.stat.avgWill")}</div><div class="sum-stat-val">${avgW}<em>/100</em></div></div><div class="sum-stat"><div class="sum-stat-lbl">${t("summary.stat.roots")}</div><div class="sum-stat-val">${S.totalRoots}<em>/${n}</em></div></div><div class="sum-stat"><div class="sum-stat-lbl">${t("summary.stat.good")}</div><div class="sum-stat-val">${S.totalGood}<em>/${n*3}</em></div></div></div><div class="sum-takes"><h3>${t("summary.takes.head")}</h3>${takes}</div><div class="sum-cta"><button class="btn btn-primary" onclick="showScreen('hcp-pick');renderHcpScenarios()">${t("btn.anotherScenario")} <span class="arrow">→</span></button><button class="btn btn-ghost" onclick="goHome()">${t("btn.home")} <span class="arrow">↺</span></button></div><div class="cite">${t("summary.cite")}</div></div>`;
  saveState()
}

/* ════════════════════════════════════════════════════
   PARENT GAME
   ════════════════════════════════════════════════════ */
function stubClick(){alert(t("dialog.stubClick"))}

function renderPersonas(){
  const g=document.getElementById("personas");
  g.innerHTML=getPersonas().map((p,i)=>{
    const dis=!p.active;
    const onclick=dis?"stubClick()":"startPersona("+i+")";
    const badge=dis?'<div class="persona-badge">'+t("persona.stubBadge")+'</div>':'';
    const personaLbl=t("persona.intro.prefix",{nn:String(i+1).padStart(2,'0')});
    return '<button class="persona-card'+(dis?' disabled':'')+'" onclick="'+onclick+'">'+badge+'<div class="persona-meta">'+personaLbl+'</div><div class="persona-name">'+p.name+'</div><div class="persona-tag">«'+p.tag+'»</div><div class="persona-hook">'+p.hook+'</div></button>'
  }).join("")
}

function startPersona(idx){
  S.personaIdx=idx;
  S.pSceneIdx=-1; // -1 = intro screen
  S.pPath=[];
  S.pChoices=[];
  S.pEnding=null;
  const p=getPersonas()[idx];
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
  document.getElementById("pPersonaLbl").innerHTML=t("parent.bar.personaLbl",{name:p.name});
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
  const p=getPersonas()[S.personaIdx];
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
  const p=getPersonas()[S.personaIdx];
  document.getElementById("pSceneHint").textContent=t("persona.scene.beforeChat");
  renderPPips();
  const dec=p.start.dec!=null?p.start.dec:20;
  const stateHd=`<strong>${t("persona.intro.stateHd")}</strong>`;
  const lblAnks=t("parentGame.meter.anks"),lblSas=t("parentGame.meter.sas"),lblOtv=t("parentGame.meter.otv"),lblDec=t("parentGame.meter.dec");
  let stateBlock;
  if(p.startWhyBy){
    const row=(name,val,why)=>`<li><span class="sb-name">${name}</span><span class="sb-val">${val}</span><span class="sb-why">${why}</span></li>`;
    stateBlock=`${stateHd}<ul class="state-breakdown">${row(lblAnks,p.start.anks,p.startWhyBy.anks)}${row(lblSas,p.start.sas,p.startWhyBy.sas)}${row(lblOtv,p.start.otv,p.startWhyBy.otv)}${row(lblDec,dec,p.startWhyBy.dec)}</ul>`;
  }else{
    const why=p.startWhy?`<div class="intro-state-why"><em>${p.startWhy}</em></div>`:"";
    stateBlock=`${stateHd} ${lblAnks} ${p.start.anks} · ${lblSas} ${p.start.sas} · ${lblOtv} ${p.start.otv} · ${lblDec} ${dec}${why}<br>`;
  }
  const personaLbl=t("persona.intro.prefix",{nn:String(S.personaIdx+1).padStart(2,'0')});
  document.getElementById("pCard").innerHTML=`<div class="intro-card fade-in"><div class="intro-eb">${personaLbl}</div><h2 class="intro-name">${p.name}</h2><div class="intro-tag">«${p.tag}»</div><div class="intro-text">${p.intro.map(par=>'<p>'+par+'</p>').join("")}</div><div class="intro-state">${stateBlock}<small style="color:var(--ink-muted)">${t("persona.intro.footer")}</small></div><div class="next-wrap"><button class="btn btn-coral" onclick="startPScene(0)">${t("btn.enterOffice")} <span class="arrow">→</span></button></div></div>`
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
  const p=getPersonas()[S.personaIdx];
  const scene=p.scenes[S.pSceneIdx];
  document.getElementById("pSceneHint").textContent=t("persona.scene.counter",{n:S.pSceneIdx+1,total:p.scenes.length});
  renderPPips();

  const docLine=getDocLine(scene);

  // filter choices by requirements
  const availChoices=shuffle(scene.choices.filter(c=>!c.req||S.pPath.includes(c.req)));

  const sceneHdr=t("persona.scene.numTitle",{nn:String(S.pSceneIdx+1).padStart(2,'0'),title:scene.title});
  document.getElementById("pCard").innerHTML=`<div class="card fade-in"><div class="scn-hdr"><div class="scn-num">${sceneHdr}</div></div><div class="bubble doctor"><div class="bubble-meta"><div class="avatar doctor">${p.doc.i}</div><div class="bubble-label">${p.doc.l}</div></div><div class="speech">${docLine}</div></div><div class="prompt">${scene.prompt}</div><div class="choices">${availChoices.map((c,i)=>`<button class="choice-f" onclick="pickPChoice(${scene.choices.indexOf(c)})"><div class="feel-em">${c.em}</div><div class="feel-in">«${c.in}»</div></button>`).join("")}</div><div id="pFb"></div></div>`;
}

function pickPChoice(idx){
  const p=getPersonas()[S.personaIdx];
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

  const impactBlock=impactPills([[t("impact.anks"),dA],[t("impact.sas"),dS],[t("impact.otv"),dO],[t("impact.dec"),dD]]);

  // show reaction
  const nextBtnLbl=S.pSceneIdx<p.scenes.length-1?t("btn.nextScene"):t("btn.exitOffice");
  document.getElementById("pFb").innerHTML=`<div class="fb"><div class="fb-lbl" style="color:var(--coral)">${t("parent.feel.label")}</div>${impactBlock}<div class="fb-text"><em>${c.re}</em></div></div><div class="next-wrap"><button class="btn btn-coral" onclick="nextPScene()">${nextBtnLbl} <span class="arrow">→</span></button></div>`;

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
  const p=getPersonas()[S.personaIdx];
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
  const p=getPersonas()[S.personaIdx];
  const endingKey=S.pEnding||'closed';
  const e=p.endings[endingKey];
  document.getElementById("pSceneHint").textContent=t("persona.scene.endLbl");
  S.pSceneIdx=p.scenes.length;
  renderPPips();
  track("parent_ending_shown",{
    personaIdx:S.personaIdx,
    ending:endingKey,
    anks:S.anks,sas:S.sas,otv:S.otv,odluka:S.odluka,
    path:[...S.pPath],
    nChoices:S.pChoices.length
  });

  document.getElementById("pCard").innerHTML=`<div class="end-card fade-in"><div class="end-eb">${t("parent.ending.eyebrow")}</div><div class="scene-narr" style="margin-bottom:24px">${e.phone}</div><div style="margin-bottom:8px;font-size:14px;color:var(--ink-muted);letter-spacing:.04em;text-transform:uppercase;font-weight:500">${t("parent.ending.prompt")}</div><div class="choices">${e.opts.map((o,i)=>`<button class="choice-f" onclick="finishPGame(${i})"><div class="feel-em">${o}</div></button>`).join("")}</div></div>`;
  scrollToCard();
  saveState()
}

function finishPGame(selectedIdx){
  const p=getPersonas()[S.personaIdx];
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
  div.innerHTML=`<div class="end-narr">${e.close.map(line=>'<p>'+line+'</p>').join("")}</div><div class="end-final">${p.finalLine}</div>${renderPParentReview()}<div class="next-wrap" style="margin-top:30px"><button class="btn btn-ghost" onclick="returnToPersonaPick()">${t("btn.tryAnother")} <span class="arrow">↻</span></button> <button class="btn btn-primary" onclick="goHome()">${t("btn.home")} <span class="arrow">→</span></button></div>`;
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
  // lang: URL param wins over localStorage; fallback default 'sr'
  try{
    const urlLang=new URLSearchParams(location.search).get("lang");
    if(urlLang==="sr"||urlLang==="en")S.lang=urlLang;
    else if(!S.lang)S.lang="sr";
  }catch(e){if(!S.lang)S.lang="sr"}
  saveState();
  applyI18n();
  updateLangToggleUI();
  showScreen(S.screen||"role")
});

/* ════════════════════════════════════════════════════
   LANGUAGE TOGGLE
   ════════════════════════════════════════════════════ */
function setLang(lang){
  if(lang!=="sr"&&lang!=="en")return;
  if(S.lang===lang)return;
  S.lang=lang;
  saveState();
  applyI18n();
  updateLangToggleUI();
  // Re-render current screen so dynamic content (cards, scenarios, personas) refreshes
  rerenderCurrentScreen();
}

function updateLangToggleUI(){
  document.querySelectorAll(".lang-pill").forEach(el=>{
    el.classList.toggle("active",el.getAttribute("data-lang")===S.lang);
  });
}

function rerenderCurrentScreen(){
  // Discover what's currently visible and re-render its dynamic content
  const visible=document.querySelector("section:not(.hidden)");
  if(!visible)return;
  const id=visible.id;
  if(id==="s-hcp-profile")showHcpProfiles();
  else if(id==="s-hcp-pick")renderHcpScenarios();
  else if(id==="s-hcp-game"&&S.hcpScenarioIdx!=null){
    renderHcpScenarioCard();
    // step is re-rendered inside renderHcpScenarioCard
  }
  else if(id==="s-hcp-summary")showHcpSummary();
  else if(id==="s-parent-pick")renderPersonas();
  else if(id==="s-parent-game"&&S.personaIdx!=null){
    const p=getPersonas()[S.personaIdx];
    if(!p)return;
    document.getElementById("pPersonaLbl").innerHTML=t("parent.bar.personaLbl",{name:p.name});
    if(S.pSceneIdx<0||S.pSceneIdx===-1)renderPersonaIntro();
    else if(S.pSceneIdx<p.scenes.length)renderPScene();
    else showPEnding();
  }
  updateCrumb(id.replace(/^s-/,""));
}
