/* ════════════════════════════════════════════════════
   analytics.js — anonimno logovanje izbora za istraživanje

   Sve je fire-and-forget: greške u mreži nikad ne blokiraju
   ni ne menjaju ponašanje igre.

   KONFIGURACIJA: zameni dve vrednosti ispod sa svojim Supabase
   podacima (Settings → API u Supabase Studio).

   QR / radionica: dodaj `?w=novi-sad-2026-05` na URL u QR kodu
   da bi se sve sesije sa te radionice grupisale pod istim
   workshop_id-om.
   ════════════════════════════════════════════════════ */

const ANALYTICS = {
  url:     "https://xahvkqtmguflkzixxysz.supabase.co",
  key:     "sb_publishable_XtWSITf0P0a1LvJAFBs_qw_5qTKjAfS",
  enabled: true
};

const ANALYTICS_SID_KEY = "ondk_sid_v1";
const ANALYTICS_CONSENT_KEY = "ondk_analytics_consent_v1";

function _consentDeclined(){
  try{return localStorage.getItem(ANALYTICS_CONSENT_KEY)==="declined"}
  catch(e){return false}
}

function setAnalyticsConsent(accepted){
  try{
    if(accepted){
      localStorage.removeItem(ANALYTICS_CONSENT_KEY);
    }else{
      // Pošalji marker pre nego što flag bude postavljen,
      // da istraživač može da obriše vezane redove ako odluči
      track("consent_revoked",{});
      localStorage.setItem(ANALYTICS_CONSENT_KEY,"declined");
      // Update the privacy notice in place (matches role.privacy data-i18n)
      const el=document.querySelector('[data-i18n="role.privacy"]');
      if(el){
        // Use t() ako je dostupno, else fallback SR tekst
        if(typeof t==="function"){
          el.setAttribute("data-i18n","role.privacy.declined");
          el.innerHTML=t("role.privacy.declined");
        }else{
          el.innerHTML='<strong>Privatnost:</strong> Odjavljeni ste iz beleženja. Vaši budući klikovi se ne šalju.';
        }
      }
    }
  }catch(e){}
}

function _analyticsSessionId(){
  let id=localStorage.getItem(ANALYTICS_SID_KEY);
  if(!id){
    id=(crypto.randomUUID?crypto.randomUUID():_uuidFallback());
    localStorage.setItem(ANALYTICS_SID_KEY,id)
  }
  return id
}

function _uuidFallback(){
  // RFC4122 v4, za starije brauzere bez crypto.randomUUID
  return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,c=>{
    const r=Math.random()*16|0,v=c==="x"?r:(r&0x3|0x8);
    return v.toString(16)
  })
}

function _analyticsWorkshopId(){
  try{return new URLSearchParams(location.search).get("w")||null}
  catch(e){return null}
}

function _gameVersion(){
  try{
    const m=document.querySelector('meta[name="game-version"]');
    return m?m.getAttribute("content"):null
  }catch(e){return null}
}

function _gameMode(){
  try{
    const m=new URLSearchParams(location.search).get("mode");
    return (m==="sim"||m==="retry")?m:"retry"
  }catch(e){return "retry"}
}

function _gameLang(){
  // URL ?lang= dominant — to je ono što je QR fiksirao za radionicu.
  // Fallback na S.lang (kad je dostupan), pa na "sr".
  try{
    const l=new URLSearchParams(location.search).get("lang");
    if(l==="sr"||l==="en")return l;
    if(typeof S!=="undefined"&&S&&(S.lang==="sr"||S.lang==="en"))return S.lang;
    return "sr"
  }catch(e){return "sr"}
}

const ANALYTICS_SID=_analyticsSessionId();
const ANALYTICS_WID=_analyticsWorkshopId();
const ANALYTICS_VER=_gameVersion();
const ANALYTICS_MODE=_gameMode();
const ANALYTICS_T0=Date.now();

function _isConfigured(){
  return ANALYTICS.enabled
    && !ANALYTICS.url.includes("YOUR_PROJECT")
    && !ANALYTICS.key.includes("YOUR_ANON_KEY")
}

function track(eventType,payload){
  if(!_isConfigured())return;
  if(_consentDeclined())return;
  try{
    fetch(ANALYTICS.url+"/rest/v1/events",{
      method:"POST",
      headers:{
        "apikey":ANALYTICS.key,
        "Authorization":"Bearer "+ANALYTICS.key,
        "Content-Type":"application/json",
        "Prefer":"return=minimal"
      },
      body:JSON.stringify({
        session_id:ANALYTICS_SID,
        workshop_id:ANALYTICS_WID,
        event_type:eventType,
        payload:Object.assign({t_ms:Date.now()-ANALYTICS_T0,ver:ANALYTICS_VER,mode:ANALYTICS_MODE,lang:_gameLang()},payload||{})
      }),
      keepalive:true
    }).catch(()=>{})
  }catch(e){}
}

// Skraćivač teksta — da payload ne bude prevelik
function _short(s,n){
  if(s==null)return null;
  s=String(s);
  return s.length>n?s.slice(0,n)+"…":s
}

// Page load (svaki put kad se otvori; session_id ostaje isti za istog korisnika)
window.addEventListener("DOMContentLoaded",()=>{
  track("page_load",{
    ua:_short(navigator.userAgent,200),
    lang:navigator.language,
    screen:screen.width+"x"+screen.height,
    referrer:_short(document.referrer,200)||null,
    returning:localStorage.getItem("ondk_v2")?1:0
  })
});

// Trajanje sesije: šalje se pri zatvaranju taba/prozora ili navigaciji dalje.
// pagehide je pouzdaniji od beforeunload na iOS Safari; sa keepalive:true u track()
// fetch završi i nakon što se page ugasi.
function _lastScreen(){
  try{return typeof S!=="undefined"&&S&&S.screen?S.screen:null}
  catch(e){return null}
}
let _SESSION_END_SENT=false;
window.addEventListener("pagehide",()=>{
  if(_SESSION_END_SENT)return;
  _SESSION_END_SENT=true;
  track("session_end",{
    duration_ms:Date.now()-ANALYTICS_T0,
    last_screen:_lastScreen(),
    path:location.pathname
  })
});
