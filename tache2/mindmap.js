(()=>{
"use strict";
const KEY="tcf-tache2-mindmaps-v1";
let modal,stage,svg,titleEl,saveEl,backdrop,workspace,selectedId=null,currentTheme="",drag=null;
const $=(s,r=document)=>r.querySelector(s);
const uid=()=>("n"+Date.now().toString(36)+Math.random().toString(36).slice(2,7));
function readAll(){try{const v=JSON.parse(localStorage.getItem(KEY)||"{}");return v&&typeof v==="object"?v:{};}catch{return{};}}
function writeAll(all){localStorage.setItem(KEY,JSON.stringify(all));if(saveEl)saveEl.textContent="已自动保存 · "+new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",second:"2-digit"});}
function initialMap(theme){
  const all=window.TCF_T2_TRAINER?.all||[];
  const subs=[...new Set(all.filter(x=>x.theme===theme).map(x=>x.subcategory).filter(Boolean))];
  const cx=1120,cy=700,nodes=[{id:"root",text:theme,x:cx,y:cy,parent:null,collapsed:false}],count=Math.max(1,subs.length);
  subs.forEach((text,i)=>{const a=(Math.PI*2*i/count)-Math.PI/2,rx=count>8?470:390,ry=count>8?360:310;nodes.push({id:uid(),text,x:Math.round(cx+Math.cos(a)*rx),y:Math.round(cy+Math.sin(a)*ry),parent:"root",collapsed:false});});
  return {nodes,updatedAt:Date.now()};
}
function ensureMap(theme){const all=readAll();if(!all[theme]){all[theme]=initialMap(theme);writeAll(all);}return all[theme];}
function saveMap(m){const all=readAll();m.updatedAt=Date.now();all[currentTheme]=m;writeAll(all);}
function map(){return ensureMap(currentTheme);}
function nodeBy(id,m=map()){return m.nodes.find(n=>n.id===id);}
function childrenOf(id,m=map()){return m.nodes.filter(n=>n.parent===id);}
function hiddenIds(m){const hidden=new Set();function hide(id){for(const c of childrenOf(id,m)){hidden.add(c.id);hide(c.id);}}for(const n of m.nodes)if(n.collapsed)hide(n.id);return hidden;}
function curve(x1,y1,x2,y2){const dx=Math.max(50,Math.abs(x2-x1)*.48),dir=x2>=x1?1:-1;return "M "+x1+" "+y1+" C "+(x1+dx*dir)+" "+y1+", "+(x2-dx*dir)+" "+y2+", "+x2+" "+y2;}
function drawLines(){
  const m=map(),hidden=hiddenIds(m);svg.innerHTML="";
  for(const n of m.nodes){
    if(hidden.has(n.id)||!n.parent)continue;
    const a=stage.querySelector('[data-mm-id="'+CSS.escape(n.parent)+'"]'),b=stage.querySelector('[data-mm-id="'+CSS.escape(n.id)+'"]');
    if(!a||!b)continue;
    const x1=a.offsetLeft+a.offsetWidth/2,y1=a.offsetTop+a.offsetHeight/2,x2=b.offsetLeft+b.offsetWidth/2,y2=b.offsetTop+b.offsetHeight/2;
    const e=document.createElementNS("http://www.w3.org/2000/svg","path");e.setAttribute("class","t2-mm-edge");e.setAttribute("d",curve(x1,y1,x2,y2));svg.appendChild(e);
  }
}
function render(){
  const m=map(),hidden=hiddenIds(m);stage.querySelectorAll(".t2-mm-node").forEach(n=>n.remove());
  for(const n of m.nodes){
    if(hidden.has(n.id))continue;
    const el=document.createElement("div");
    el.className="t2-mm-node"+(n.id==="root"?" root":"")+(n.id===selectedId?" selected":"")+(n.collapsed&&childrenOf(n.id,m).length?" collapsed":"");
    el.dataset.mmId=n.id;el.style.left=n.x+"px";el.style.top=n.y+"px";el.textContent=n.text;stage.appendChild(el);
  }
  requestAnimationFrame(drawLines);
}
function pickTheme(){return $("#themeFilter")?.value||window.TCF_T2_TRAINER?.current()?.theme||"我的主题";}
function open(theme){currentTheme=theme||pickTheme();selectedId="root";titleEl.textContent=currentTheme+" · 思维导图";ensureMap(currentTheme);backdrop.classList.add("open");document.body.style.overflow="hidden";render();setTimeout(centerRoot,30);}
function close(){backdrop.classList.remove("open");document.body.style.overflow="";selectedId=null;}
function centerRoot(){const r=nodeBy("root");if(!r)return;workspace.scrollLeft=Math.max(0,r.x-workspace.clientWidth/2+90);workspace.scrollTop=Math.max(0,r.y-workspace.clientHeight/2+40);}
function toast(t){const x=$(".t2-mm-toast");x.textContent=t;x.classList.add("show");clearTimeout(x._t);x._t=setTimeout(()=>x.classList.remove("show"),1400);}
function addChild(){
  const m=map(),p=nodeBy(selectedId||"root",m)||nodeBy("root",m),kids=childrenOf(p.id,m),i=kids.length,side=i%2===0?1:-1,ring=Math.floor(i/2);
  const n={id:uid(),text:"新节点",x:Math.max(40,p.x+side*(250+ring*28)),y:Math.max(40,p.y+(ring%5-2)*90),parent:p.id,collapsed:false};
  m.nodes.push(n);selectedId=n.id;saveMap(m);render();setTimeout(()=>editNode(n.id),20);
}
function editNode(id){
  const el=stage.querySelector('[data-mm-id="'+CSS.escape(id)+'"]');if(!el)return;
  const m=map(),n=nodeBy(id,m),input=document.createElement("input");input.className="t2-mm-node-editor";input.value=n.text;input.style.left=n.x+"px";input.style.top=n.y+"px";stage.appendChild(input);input.focus();input.select();
  let done=false;const finish=(save=true)=>{if(done)return;done=true;if(save&&input.value.trim()){n.text=input.value.trim();saveMap(m);}input.remove();render();};
  input.onkeydown=e=>{if(e.key==="Enter")finish(true);if(e.key==="Escape")finish(false)};input.onblur=()=>finish(true);
}
function deleteSelected(){
  if(!selectedId||selectedId==="root"){toast("中心主题不能删除");return;}
  const m=map(),ids=new Set([selectedId]);let changed=true;while(changed){changed=false;for(const n of m.nodes)if(n.parent&&ids.has(n.parent)&&!ids.has(n.id)){ids.add(n.id);changed=true;}}
  m.nodes=m.nodes.filter(n=>!ids.has(n.id));selectedId="root";saveMap(m);render();
}
function toggleCollapse(){const m=map(),n=nodeBy(selectedId||"root",m);if(!n)return;n.collapsed=!n.collapsed;saveMap(m);render();}
function layoutDesc(parent,m,angle){const kids=childrenOf(parent.id,m);kids.forEach((n,i)=>{const spread=(i-(kids.length-1)/2)*70,dist=230;n.x=Math.round(parent.x+Math.cos(angle)*dist-Math.sin(angle)*spread);n.y=Math.round(parent.y+Math.sin(angle)*dist+Math.cos(angle)*spread);layoutDesc(n,m,angle);});}
function autoLayout(){
  const m=map(),root=nodeBy("root",m),first=childrenOf("root",m),cx=1120,cy=700;root.x=cx;root.y=cy;const count=Math.max(1,first.length);
  first.forEach((n,i)=>{const a=Math.PI*2*i/count-Math.PI/2;n.x=Math.round(cx+Math.cos(a)*430);n.y=Math.round(cy+Math.sin(a)*330);layoutDesc(n,m,a);});saveMap(m);render();centerRoot();
}
function exportData(){const blob=new Blob([JSON.stringify(readAll(),null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="TCF_Tache2_思维导图备份_"+new Date().toISOString().slice(0,10)+".json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
function importData(file){const r=new FileReader();r.onload=()=>{try{const v=JSON.parse(r.result);if(!v||typeof v!=="object")throw 0;localStorage.setItem(KEY,JSON.stringify(v));render();toast("备份已导入");}catch{alert("这个备份文件无法读取。");}};r.readAsText(file);}
function resetTheme(){if(!confirm("只重置当前大主题的思维导图？你自己添加和修改的节点会被删除。建议先导出备份。"))return;const all=readAll();all[currentTheme]=initialMap(currentTheme);writeAll(all);selectedId="root";render();centerRoot();}
function build(){
  const launch=document.createElement("button");launch.type="button";launch.className="btn secondary t2-mm-launch";launch.innerHTML="🧠 当前大主题思维导图";
  const head=$(".topic-head>div:first-child");if(head)head.appendChild(launch);else $(".practice")?.prepend(launch);launch.onclick=()=>open();
  backdrop=document.createElement("div");backdrop.className="t2-mm-backdrop";backdrop.innerHTML='<div class="t2-mm-modal" role="dialog" aria-modal="true"><div class="t2-mm-head"><div class="t2-mm-title-wrap"><div class="t2-mm-kicker">TCF Canada · Tâche 2 · 可互动实时保存</div><h2 class="t2-mm-title"></h2></div><div style="display:flex;align-items:center;gap:12px"><span class="t2-mm-save">已自动保存</span><button class="t2-mm-close" type="button">✕ 关闭</button></div></div><div class="t2-mm-toolbar"><button class="primary" data-a="add" type="button">＋ 添加子节点</button><button data-a="edit" type="button">✎ 编辑文字</button><button data-a="collapse" type="button">折叠 / 展开</button><button class="danger" data-a="delete" type="button">删除节点</button><button data-a="layout" type="button">整理布局</button><button data-a="center" type="button">回到中心</button><span class="spacer"></span><button data-a="export" type="button">↓ 导出备份</button><label class="t2-mm-filelabel">↑ 导入备份<input type="file" accept="application/json,.json"></label><button class="danger" data-a="reset" type="button">重置本主题</button><span class="t2-mm-help">单击选择 · 双击改文字 · 拖动节点改位置</span></div><div class="t2-mm-workspace"><div class="t2-mm-stage"><svg class="t2-mm-lines"></svg></div></div></div>';
  document.body.appendChild(backdrop);modal=$(".t2-mm-modal",backdrop);stage=$(".t2-mm-stage",backdrop);svg=$(".t2-mm-lines",backdrop);workspace=$(".t2-mm-workspace",backdrop);titleEl=$(".t2-mm-title",backdrop);saveEl=$(".t2-mm-save",backdrop);
  const toastEl=document.createElement("div");toastEl.className="t2-mm-toast";document.body.appendChild(toastEl);
  $(".t2-mm-close",backdrop).onclick=close;backdrop.addEventListener("click",e=>{if(e.target===backdrop)close();});
  $(".t2-mm-toolbar",backdrop).addEventListener("click",e=>{const a=e.target.closest("button")?.dataset.a;if(!a)return;({add:addChild,edit:()=>editNode(selectedId||"root"),collapse:toggleCollapse,delete:deleteSelected,layout:autoLayout,center:centerRoot,export:exportData,reset:resetTheme}[a]||(()=>{}))();});
  $(".t2-mm-filelabel input",backdrop).onchange=e=>{const f=e.target.files?.[0];if(f)importData(f);e.target.value="";};
  stage.addEventListener("dblclick",e=>{const el=e.target.closest(".t2-mm-node");if(el)editNode(el.dataset.mmId);});
  stage.addEventListener("pointerdown",e=>{const el=e.target.closest(".t2-mm-node");if(!el)return;selectedId=el.dataset.mmId;render();const m=map(),n=nodeBy(selectedId,m);drag={id:selectedId,startX:e.clientX,startY:e.clientY,x:n.x,y:n.y,lastX:n.x,lastY:n.y,moved:false};e.preventDefault();});
  window.addEventListener("pointermove",e=>{if(!drag)return;const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;if(Math.abs(dx)+Math.abs(dy)>3)drag.moved=true;drag.lastX=Math.max(8,Math.min(2200,drag.x+dx));drag.lastY=Math.max(8,Math.min(1420,drag.y+dy));const el=stage.querySelector('[data-mm-id="'+CSS.escape(drag.id)+'"]');if(el){el.style.left=drag.lastX+"px";el.style.top=drag.lastY+"px";}drawLines();});
  window.addEventListener("pointerup",()=>{if(!drag)return;if(drag.moved){const m=map(),n=nodeBy(drag.id,m);if(n){n.x=drag.lastX;n.y=drag.lastY;saveMap(m);}}drag=null;});
  window.addEventListener("keydown",e=>{if(!backdrop.classList.contains("open"))return;if(e.key==="Escape"&&!$(".t2-mm-node-editor",stage))close();if((e.key==="Delete"||e.key==="Backspace")&&document.activeElement?.tagName!=="INPUT")deleteSelected();});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",build);else build();
window.TCF_T2_MINDMAP={open};
})();