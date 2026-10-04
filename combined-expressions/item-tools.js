'use strict';
// One record per original item ID; both views read and write the same DATA object.
(()=>{
 const bases=new Map();
 for(const x of DATA){bases.set(x.id,{fr:x.fr,zh:x.zh,acceptedFr:x.acceptedFr});const custom=state.records[x.id]?.custom;if(custom){x.fr=custom.fr??x.fr;if(x.module!==3)x.zh=custom.zh??x.zh;if(custom.fr)x.acceptedFr=[custom.fr];}}
 const baseMeaning=conjugationMeaning;
 conjugationMeaning=function(x){return state.records[x.id]?.custom?.zh??baseMeaning(x);};
 const baseTopicMeaning=topicMeaning;
 topicMeaning=function(x){return state.records[x.id]?.custom?.zh??baseTopicMeaning(x);};
 function refresh(){if(current)show(current);else list();window.TCF_COMPACT_STUDY?.render();}
 function mount(node,x,onSave=refresh){
  if(node.querySelector('[data-item-tools="'+x.id+'"]'))return;
  const box=document.createElement('div');box.className='item-tools';box.dataset.itemTools=x.id;
  const note=document.createElement('button'),edit=document.createElement('button'),content=document.createElement('div'),panel=document.createElement('div');
  note.type=edit.type='button';note.textContent='笔记';edit.textContent='✎ 编辑';content.className='item-note';content.textContent=rec(x.id).note||'';panel.className='item-tools-panel hidden';
  box.append(note,edit,content,panel);node.append(box);
  const button=(label,handler)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=handler;return b;};
  function field(label,value,area=false){const l=document.createElement('label');l.textContent=label;const input=document.createElement(area?'textarea':'input');input.value=value;input.setAttribute('aria-label',label);if(area)input.rows=2;l.append(input);panel.append(l);return input;}
  function open(){panel.replaceChildren();panel.classList.remove('hidden');}
  note.onclick=()=>{open();const text=field('词条笔记',rec(x.id).note||'',true);panel.append(button('保存笔记',()=>{rec(x.id).note=text.value;persist();onSave();}),button('取消',()=>panel.classList.add('hidden')));text.focus();};
  edit.onclick=()=>{open();const zh=field('中文',x.module===3?conjugationMeaning(x):topicMeaning(x)),fr=field(x.module===3?'法语变位（不含主语）':'法语',x.fr);panel.append(button('保存修改',()=>{if(!fr.value.trim()){fr.setCustomValidity('法语不能为空');fr.reportValidity();return;}rec(x.id).custom={...(rec(x.id).custom||{}),fr:fr.value.trim(),zh:zh.value.trim()};x.fr=fr.value.trim();if(x.module!==3)x.zh=zh.value.trim();x.acceptedFr=[x.fr];persist();onSave();}),button('取消',()=>panel.classList.add('hidden')));zh.focus();};
 }
 function singleTools(){if(![3,5,6].includes(mode)||!current)return;if(mode===3){for(const row of document.querySelectorAll('#verbCards [data-form-id]')){const x=DATA.find(x=>x.id===row.dataset.formId);if(x)mount(row,x);}}else{let box=$('singleItemTools');if(!box){box=document.createElement('div');box.id='singleItemTools';$('prompt').after(box);}box.replaceChildren();mount(box,current);}}
 const baseShow=show;show=function(x){baseShow(x);singleTools();};
 const baseModule=setModule;setModule=function(m,fresh=false){baseModule(m,fresh);$('singleItemTools')?.classList.toggle('hidden',![5,6].includes(m));singleTools();};
 window.TCF_ITEM_TOOLS={mount};singleTools();
})();
