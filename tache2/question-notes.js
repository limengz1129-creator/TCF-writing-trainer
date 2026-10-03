(()=>{'use strict';
 const api=window.TCF_T2_TRAINER;if(!api)return;
 const KEY='tcf-tache2-question-notes-v1';let notes={};
 try{const saved=JSON.parse(localStorage.getItem(KEY)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))notes=saved;}catch{}
 const css=document.createElement('style');css.textContent='.t2-question-note{margin-top:14px;padding:12px;border:1px solid #dce5e2;border-radius:10px;background:#fff}.t2-question-note label{display:block;font-weight:600;font-size:.9rem;margin-bottom:8px}.t2-question-note textarea{display:block;width:100%;min-height:80px;padding:10px;border:1px solid #cbd5d0;border-radius:8px;box-sizing:border-box;resize:vertical;font:inherit;line-height:1.6}.t2-question-note p{margin:6px 0 0;font-size:.8rem;color:#60706b;line-height:1.5}';document.head.append(css);
 let serial=0;
 function create(q){const box=document.createElement('div'),label=document.createElement('label'),input=document.createElement('textarea'),status=document.createElement('p');box.className='t2-question-note';input.id='t2-note-'+(++serial);input.dataset.noteQuestion=q.id;input.setAttribute('aria-label',q.zh+'：我的笔记');input.placeholder='记下句型用法、易错点或记忆提示……';input.value=typeof notes[q.id]==='string'?notes[q.id]:'';label.htmlFor=input.id;label.textContent='📝 我的笔记';status.textContent='自动保存 · 同一道题跨模式共用 · 保存在当前浏览器';status.setAttribute('role','status');input.addEventListener('input',()=>{notes[q.id]=input.value;try{localStorage.setItem(KEY,JSON.stringify(notes));status.textContent='已保存 · 同一道题跨模式共用';}catch{status.textContent='保存失败，请复制笔记后再试。';}document.querySelectorAll('[data-note-question]').forEach(other=>{if(other!==input&&other.dataset.noteQuestion===q.id)other.value=input.value;});});box.append(label,input,status);return box;}
 const single=document.createElement('div');single.id='t2SingleNote';document.querySelector('.prompt-card').after(single);
 let currentId=null;
 function renderSingle(q){if(!q||q.id===currentId)return;currentId=q.id;single.replaceChildren(create(q));}
 window.TCF_T2_NOTES={create,renderSingle};renderSingle(api.current());
})();
