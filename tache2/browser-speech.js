(()=>{'use strict';
 let active=null;
 function stop(){if(active){active.onend=null;active.onerror=null;active=null;}window.speechSynthesis?.cancel();}
 function edited(text){return window.TCF_T2_TRAINER?.all.some(q=>q.fr===text&&q.edited===true)||false;}
 function speak(text,status,rate=1){
  stop();
  if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){status.textContent='当前浏览器不支持朗读，请使用 Chrome 或 Edge。';return false;}
  const synth=window.speechSynthesis,u=new SpeechSynthesisUtterance(text),voices=synth.getVoices();
  u.lang='fr-FR';u.voice=voices.find(v=>/^fr[-_]FR$/i.test(v.lang))||voices.find(v=>/^fr\b/i.test(v.lang))||null;u.rate=Number(rate)||1;active=u;
  status.textContent='正在使用浏览器法语朗读：'+text;
  u.onstart=()=>{if(active===u)status.textContent='正在使用浏览器法语朗读：'+text;};
  u.onend=()=>{if(active===u){active=null;status.textContent='朗读完成，可以重听。';}};
  u.onerror=e=>{if(active===u){active=null;status.textContent='浏览器朗读失败，请重试，并确认系统已安装法语语音。';}};
  synth.speak(u);synth.resume();return true;
 }
 window.TCF_T2_SPEECH={speak,stop,edited};window.addEventListener('pagehide',stop);
})();
