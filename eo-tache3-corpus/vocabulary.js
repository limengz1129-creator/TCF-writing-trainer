(() => {
  'use strict';
  const key = 'tcf-vocabulary-v1:' + location.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
  let words = [], editing = null, selected = '';
  try { words = JSON.parse(localStorage.getItem(key) || '[]'); if (!Array.isArray(words)) words = []; } catch (_) {}
  const style = document.createElement('style');
  style.textContent = `.vb-launch{position:fixed;right:16px;bottom:18px;z-index:9000;background:#17624e;color:white;border:0;border-radius:24px;padding:13px 20px;box-shadow:0 3px 16px #0003;cursor:pointer}.vb-dialog{border:0;border-radius:16px;position:fixed;inset:0;margin:auto;width:min(760px,calc(100vw - 24px));max-width:calc(100vw - 24px);max-height:calc(100vh - 24px);max-height:calc(100dvh - 24px);overflow:auto;overscroll-behavior:contain;padding:clamp(12px,3vw,24px);color:#18312d;background:#fff;box-sizing:border-box}.vb-dialog::backdrop{background:#0007}.vb-dialog button{cursor:pointer;padding:8px 12px;border:1px solid #b8cec6;border-radius:8px;background:#eef7f2;color:#18312d}.vb-dialog input,.vb-dialog textarea{display:block;width:100%;box-sizing:border-box;padding:9px;border:1px solid #a9bdb4;border-radius:7px;margin:5px 0 12px;font:inherit}.vb-dialog h2{margin:0}.vb-head,.vb-actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px}.vb-head{position:sticky;top:-1px;background:#fff;z-index:1;padding:8px 0}.vb-head h2{flex:1;min-width:0}.vb-dialog textarea{min-height:70px;font-size:16px;max-width:100%}.vb-dialog form,.vb-dialog label{min-width:0}.vb-dialog button{max-width:100%;white-space:normal}.vb-list{list-style:none;padding:0}.vb-list li{border-top:1px solid #dce8e2;padding:14px 0}.vb-word{font-weight:bold;overflow-wrap:anywhere}.vb-meaning,.vb-note{white-space:pre-wrap;overflow-wrap:anywhere;margin:5px 0}.vb-note,.vb-help{font-size:14px;color:#52685e}.vb-select{position:fixed;z-index:9100;border:0;border-radius:20px;padding:10px 16px;background:#17624e;color:white;cursor:pointer;box-shadow:0 2px 12px #0003}.vb-status{min-height:22px;color:#17624e}.vb-list button{margin:5px 8px 0 0}@media(max-width:500px){.vb-dialog{padding:16px}.vb-launch{right:10px;bottom:10px}}`;
  document.head.append(style);
  const launch = document.createElement('button'); launch.className = 'vb-launch'; document.body.append(launch);
  const dialog = document.createElement('dialog'); dialog.className = 'vb-dialog';
  dialog.innerHTML = `<div class="vb-head"><h2>我的单词本</h2><button type="button" data-close>关闭</button></div><p class="vb-help">本页单词独立保存于当前浏览器。选中稿子中的词语后点击“加入单词本”，也可以手动添加。中文可以留空，导出 Excel 后可统一翻译；请定期导出备份。</p><form><label>法语词汇<input name="french" required maxlength="500" autocomplete="off"></label><label>中文意思<input name="chinese" maxlength="1000" autocomplete="off"></label><label>例句／备注<textarea name="note" rows="2" maxlength="3000"></textarea></label><div class="vb-actions"><button type="submit">保存单词</button><button type="button" data-new>取消编辑／新建</button></div></form><p class="vb-status" role="status"></p><div class="vb-actions"><button type="button" data-export>导出 Excel（全部单词）</button></div><label>搜索单词<input data-search placeholder="搜索法语、中文或备注"></label><ul class="vb-list"></ul>`;
  document.body.append(dialog);
  const form = dialog.querySelector('form'), list = dialog.querySelector('ul'), status = dialog.querySelector('[role=status]');
  const field = name => form.elements.namedItem(name);
  const norm = s => s.trim().replace(/\s+/g, ' ').replace(/’/g, "'").toLocaleLowerCase('fr');
  const reset = () => { editing = null; form.reset(); };
  function persist(next) { try { localStorage.setItem(key, JSON.stringify(next)); words = next; render(); return true; } catch (_) { status.textContent = '保存失败：浏览器存储不可用或已满，请导出备份。'; return false; } }
  function render() {
    launch.textContent = `单词本 (${words.length})`; const tab=document.getElementById("vocabTab");if(tab)tab.textContent=launch.textContent; list.replaceChildren();
    const query = norm(dialog.querySelector('[data-search]').value);
    for (const w of words.filter(w => norm([w.french,w.chinese,w.note].join(' ')).includes(query))) {
      const li = document.createElement('li');
      for (const [cls,value] of [['vb-word',w.french],['vb-meaning',w.chinese],['vb-note',w.note]]) { const p = document.createElement('div'); p.className = cls; p.textContent = value; li.append(p); }
      const edit = document.createElement('button'); edit.textContent = '编辑'; edit.onclick = () => { editing = w.id; field('french').value = w.french; field('chinese').value = w.chinese; field('note').value = w.note; field('french').focus(); };
      const del = document.createElement('button'); del.textContent = '删除已背熟单词'; del.onclick = () => { if (persist(words.filter(x => x.id !== w.id))) { if (editing === w.id) reset(); status.textContent = '已删除：' + w.french; } };
      li.append(edit, del); list.append(li);
    }
    if (!list.children.length) { const li = document.createElement('li'); li.textContent = words.length ? '没有匹配的单词。' : '还没有单词，开始添加吧。'; list.append(li); }
  }
  launch.onclick = () => { dialog.showModal(); render(); };
  dialog.querySelector('[data-close]').onclick = () => dialog.close();
  dialog.querySelector('[data-new]').onclick = reset;
  dialog.querySelector('[data-search]').oninput = render;
  form.onsubmit = e => {
    e.preventDefault(); const french = field('french').value.trim(); if (!french) return;
    if (words.some(w => w.id !== editing && norm(w.french) === norm(french))) { status.textContent = '这个词已经在单词本中，请编辑已有条目。'; return; }
    const old = words.find(w => w.id === editing);
    const entry = {id: editing || String(Date.now()) + Math.random().toString(16).slice(2), french, chinese: field('chinese').value.trim(), note: field('note').value.trim(), source: old?.source || window.CORPUS_CONTEXT?.() || document.title, date: old?.date || new Date().toISOString().slice(0,10)};
    if (persist(old ? words.map(w => w.id === editing ? entry : w) : [...words,entry])) { reset(); status.textContent = '已保存：' + french; }
  };
  const add = document.createElement('button'); add.className = 'vb-select'; add.textContent = '加入单词本'; add.hidden = true; document.body.append(add);
  document.addEventListener('mouseup', e => {
    if (dialog.contains(e.target) || e.target === add || e.target === launch) return;
    const target = e.target; const text = (target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement) ? target.value.slice(target.selectionStart || 0,target.selectionEnd || 0) : window.getSelection()?.toString();
    selected = (text || '').trim(); add.hidden = !selected || selected.length > 500;
    if (!add.hidden) { add.style.left = Math.max(8,Math.min(e.clientX,innerWidth-155)) + 'px'; add.style.top = Math.max(8,Math.min(e.clientY+12,innerHeight-50)) + 'px'; }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') add.hidden = true; });
  document.addEventListener('scroll', () => { add.hidden = true; }, true);
  add.onmousedown = e => e.preventDefault();
  add.onclick = () => { const text = selected; add.hidden = true; reset(); field('french').value = text; dialog.showModal(); status.textContent = '中文可以留空，保存后可导出统一翻译。'; field('chinese').focus(); render(); };
  function xml(s) { return String(s ?? '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function workbook(rows) {
    const enc = new TextEncoder();
    const data = [['法语词汇','中文意思','例句／备注','来源','添加日期'], ...rows.map(w => [w.french,w.chinese,w.note,w.source,w.date])];
    const sheet = `<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="1" width="30" customWidth="1"/><col min="2" max="2" width="28" customWidth="1"/><col min="3" max="3" width="42" customWidth="1"/><col min="4" max="4" width="26" customWidth="1"/><col min="5" max="5" width="14" customWidth="1"/></cols><sheetData>${data.map((r,i)=>`<row r="${i+1}">${r.map((v,j)=>`<c r="${String.fromCharCode(65+j)}${i+1}" s="${i===0?1:0}" t="inlineStr"><is><t xml:space="preserve">${xml(v)}</t></is></c>`).join('')}</row>`).join('')}</sheetData><autoFilter ref="A1:E${data.length}"/><printOptions horizontalCentered="1"/><pageMargins left="0.3" right="0.3" top="0.5" bottom="0.5" header="0.2" footer="0.2"/><pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/></worksheet>`;
    const files = {
      '[Content_Types].xml':'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
      '_rels/.rels':'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
      'xl/workbook.xml':'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="单词本" sheetId="1" r:id="rId1"/></sheets><definedNames><definedName name="_xlnm.Print_Titles" localSheetId="0">单词本!$1:$1</definedName></definedNames></workbook>',
      'xl/_rels/workbook.xml.rels':'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',
      'xl/styles.xml':'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="2"><xf fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf fontId="1" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>',
      'xl/worksheets/sheet1.xml':sheet
    };
    const chunks=[], central=[]; let offset=0;
    const header = n => { const a=new Uint8Array(n); return [a,new DataView(a.buffer)]; };
    const crc = bytes => { let c=0xffffffff; for(const b of bytes){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);} return (c^0xffffffff)>>>0; };
    for(const [path,content] of Object.entries(files)){
      const name=enc.encode(path), bytes=enc.encode(content), checksum=crc(bytes); const [h,v]=header(30);
      v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint32(14,checksum,true);v.setUint32(18,bytes.length,true);v.setUint32(22,bytes.length,true);v.setUint16(26,name.length,true);
      chunks.push(h,name,bytes);const [c,d]=header(46);d.setUint32(0,0x02014b50,true);d.setUint16(4,20,true);d.setUint16(6,20,true);d.setUint32(16,checksum,true);d.setUint32(20,bytes.length,true);d.setUint32(24,bytes.length,true);d.setUint16(28,name.length,true);d.setUint32(42,offset,true);central.push(c,name);offset+=30+name.length+bytes.length;
    }
    const size=central.reduce((s,b)=>s+b.length,0),[end,v]=header(22);v.setUint32(0,0x06054b50,true);v.setUint16(8,Object.keys(files).length,true);v.setUint16(10,Object.keys(files).length,true);v.setUint32(12,size,true);v.setUint32(16,offset,true);
    return new Blob([...chunks,...central,end],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  }
  dialog.querySelector('[data-export]').onclick = () => {
    if(!words.length){status.textContent='请先添加单词再导出。';return;}
    const url=URL.createObjectURL(workbook(words)), a=document.createElement('a');a.href=url;a.download='单词本-'+document.title.replace(/[\\/:*?"<>|]/g,'-')+'-'+new Date().toISOString().slice(0,10)+'.xlsx';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);status.textContent=`已导出全部 ${words.length} 个单词。`;
  };
  window.CORPUS_VOCAB = {
    open:()=>{if(!dialog.open)dialog.showModal();render();},
    getWords:()=>words.map(w=>({...w})),
    validate:x=>Array.isArray(x)&&x.length<=10000&&x.every(w=>w&&['id','french','chinese','note','source','date'].every(k=>typeof w[k]==='string')&&w.french.trim()&&w.french.length<=500&&w.chinese.length<=1000&&w.note.length<=3000&&w.source.length<=2000),
    importWords:x=>{if(!window.CORPUS_VOCAB.validate(x))return false;const next=words.map(w=>({...w}));for(const w of x){const at=next.findIndex(z=>norm(z.french)===norm(w.french));if(at<0)next.push({...w,id:crypto.randomUUID()});else next[at]={...w,id:next[at].id};}return persist(next);},
    workbook
  };
  render();
})();

