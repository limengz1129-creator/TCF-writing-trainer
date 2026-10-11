(()=>{'use strict';
 let active=null,timer=null,seq=0,cachedVoice=null,voicesReady=false;
 const synth=window.speechSynthesis||null;
 function setStatus(status,text){if(status)status.textContent=text;}
 function pickVoice(){
  if(!synth)return null;
  const voices=synth.getVoices()||[];
  if(cachedVoice&&voices.some(v=>v.name===cachedVoice.name&&v.lang===cachedVoice.lang))return cachedVoice;
  const french=voices.filter(v=>/^fr(?:[-_]|$)/i.test(v.lang));
  cachedVoice=
    french.find(v=>/^fr[-_]FR$/i.test(v.lang)&&/microsoft|google|apple|audrey|thomas|hortense|am[eé]lie/i.test(v.name))||
    french.find(v=>/^fr[-_]FR$/i.test(v.lang)&&v.localService)||
    french.find(v=>/^fr[-_]FR$/i.test(v.lang))||
    french.find(v=>v.localService)||
    french[0]||null;
  voicesReady=voices.length>0;
  return cachedVoice;
 }
 function prime(){pickVoice();}
 if(synth){
  prime();
  synth.addEventListener?.('voiceschanged',()=>{if(!voicesReady||!cachedVoice)prime();});
 }
 function stop(){
  seq++;
  if(timer){clearTimeout(timer);timer=null;}
  if(active){active.onstart=null;active.onend=null;active.onerror=null;active=null;}
  try{synth?.cancel();}catch(_){}
 }
 function edited(text){return window.TCF_T2_TRAINER?.all.some(q=>q.fr===text&&q.edited===true)||false;}
 function speak(text,status,rate=1){
  if(!synth||!window.SpeechSynthesisUtterance){setStatus(status,'当前浏览器不支持朗读，请使用 Chrome 或 Edge。');return false;}
  const clean=String(text||'').trim();if(!clean)return false;
  stop();
  const request=++seq;
  const voice=pickVoice();
  setStatus(status,'正在准备法语朗读…');
  // Chrome/Windows can produce distorted replay audio when cancel() and speak()
  // happen in the same task. A short quiet gap lets the engine fully release
  // the previous utterance before the next one starts.
  timer=setTimeout(()=>{
    timer=null;if(request!==seq)return;
    const u=new SpeechSynthesisUtterance(clean);
    u.lang=voice?.lang||'fr-FR';
    if(voice)u.voice=voice;
    u.rate=Math.min(1.25,Math.max(.7,Number(rate)||1));
    u.pitch=1;u.volume=1;active=u;
    u.onstart=()=>{if(active===u&&request===seq)setStatus(status,'正在使用稳定法语语音朗读…');};
    u.onend=()=>{if(active===u&&request===seq){active=null;setStatus(status,'朗读完成，可以重听。');}};
    u.onerror=e=>{if(active===u&&request===seq){active=null;
      // "canceled"/"interrupted" are expected when the user starts another clip.
      if(!/canceled|interrupted/i.test(e?.error||''))setStatus(status,'浏览器朗读失败，请稍后重试。');
    }};
    try{
      synth.speak(u);
      // Some Chromium builds occasionally remain paused after a prior cancel.
      setTimeout(()=>{if(request===seq&&active===u&&synth.paused)try{synth.resume()}catch(_){}},40);
    }catch(_){if(request===seq)setStatus(status,'浏览器朗读失败，请稍后重试。');}
  },140);
  return true;
 }
 function voiceInfo(){const v=pickVoice();return v?{name:v.name,lang:v.lang,localService:!!v.localService}:null;}
 window.TCF_T2_SPEECH={speak,stop,edited,voiceInfo};
 window.addEventListener('pagehide',stop);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
})();