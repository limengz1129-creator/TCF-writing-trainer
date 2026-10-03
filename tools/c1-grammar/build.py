"""Lossless source ingestion and canonical grammar catalog. Run with upload directory."""
import sys, json, re, hashlib, unicodedata
from pathlib import Path
from docx import Document
from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'combined-expressions'
CATS = ['虚拟式 Subjonctif','条件式与 Si 假设','逻辑关系句型','否定与限制','关系从句与强调','代词 en','Gérondif','形容词与状态表达']
entries, sources, occurrences, refs = {}, [], [], []
def norm(s):
    s = unicodedata.normalize('NFC', s).lower().replace('’', "'").replace('…','...')
    s = re.sub(r'\binf\.?\b', 'infinitif', s)
    s = s.replace('sujet + ', '').replace('qn','quelqu’un')
    return re.sub(r'\s+', '', s).strip('.;:')
ALIASES = {
    norm('Afin que / pour que + subjonctif'): 'purpose-que',
    norm('Pour que + subjonctif'): 'purpose-que',
    norm('Afin que + subjonctif'): 'purpose-que',
    norm('Si + imparfait, ... conditionnel présent'): 'si-imparfait',
    norm('Si + imparfait → conditionnel présent'): 'si-imparfait',
    norm('être conscient de'): 'être-conscient-de',
    norm('Si + imparfait, sujet + conditionnel présent'): 'si-imparfait',
}
def membership(cat, sub): return {'category': cat, 'subcategory': sub}
def add(fr, zh, cat, sub, kind, src, loc, **extra):
    fr, zh = fr.strip(), zh.strip()
    if not fr: return None
    # Grouped lists in one source and individual collocations in another refer to
    # the same knowledge. Expand only these explicit lists, preserving the group.
    expanded = {
        'savoir distinguer / gérer / choisir / utiliser / trouver un équilibre': [('savoir distinguer','懂得区分'),('savoir gérer','懂得管理 / 应对'),('savoir choisir','懂得选择'),('savoir utiliser','懂得使用'),('savoir trouver un équilibre','懂得找到平衡')],
        'être responsable / prudent': [('être responsable','负责任'),('être prudent','谨慎')],
        'encourager la participation / la pratique / l’autonomie': [('encourager la participation','鼓励参与'),('encourager la pratique','鼓励开展 / 进行活动'),('encourager l’autonomie','鼓励自主性')],
        "encourager la participation / la pratique / l'autonomie": [('encourager la participation','鼓励参与'),('encourager la pratique','鼓励开展 / 进行活动'),("encourager l'autonomie",'鼓励自主性')],
    }
    if fr in expanded:
        values=[add(a,b,cat,sub,kind,src,loc,**extra) for a,b in expanded[fr]]
        for v in values:
            if fr not in v['variants']:v['variants'].append(fr)
        return values[0]
    key = ALIASES.get(norm(fr), norm(fr))
    eid = 'c1-' + hashlib.sha256(key.encode()).hexdigest()[:16]
    new = eid not in entries
    if new:
        entries[eid] = dict(id=eid, category=cat, subcategory=sub, chinese=zh, french=fr,
            kind=kind, function=[], rule=[], examples=[], translations=[], commonErrors=[],
            notes=[], priority=None, priorityLabels=[], tags=['C1','oral','writing','Tache3'],
            sourceFiles=[], sourceRefs=[], memberships=[], variants=[], practiceTypes=[],
            masteryStatus='new', favorite=False, userNote='', userEditedContent=None)
    e = entries[eid]
    if src not in e['sourceFiles']: e['sourceFiles'].append(src)
    ref = {'file': src, 'location': loc}
    if ref not in e['sourceRefs']: e['sourceRefs'].append(ref)
    m = membership(cat, sub)
    if m not in e['memberships']: e['memberships'].append(m)
    if fr != e['french'] and fr not in e['variants']: e['variants'].append(fr)
    if zh and zh != e['chinese'] and zh not in e['function']: e['function'].append(zh)
    for name,value in extra.items():
        if name == 'priority':
            if value: e[name] = max(value, e[name] or 0)
        else:
            vals = value if isinstance(value,list) else [value]
            for v in vals:
                if v and v not in e[name]: e[name].append(v)
    occurrences.append({'id':eid,'file':src,'location':loc,'merged':not new})
    return e
def ex(e, fr, zh='', src=''):
    if not e or not fr: return
    x={'french':fr.strip(), 'chinese':zh.strip(), 'sourceFile':src}
    old=next((v for v in e['examples'] if norm(v['french'])==norm(fr)),None)
    if old:
        if zh and not old['chinese']: old['chinese']=zh.strip()
        elif zh and norm(old['chinese'])!=norm(zh):
            old.setdefault('translationVariants',[])
            if zh not in old['translationVariants']:old['translationVariants'].append(zh)
    else:e['examples'].append(x)
    if zh and zh not in e['translations']:e['translations'].append(zh)
def cat_for(name):
    if '条件' in name:return 1,'核心结构'
    if '原因' in name:return 2,'原因 / 结果'
    if '目的' in name:return 2,'目的'
    if '让步' in name:return 2,'让步 / 对立'
    if '否定' in name:return 3,'核心结构'
    if '关系' in name:return 4,'关系从句'
    if '强调' in name:return 4,'强调句'
    if '_en' in name:return 5,'高频结构'
    if 'Gerondif' in name:return 6,'高频动词与形式'
    if '形容词' in name:return 7,'形容词前置规律' if '前置' in name else '动词 + 形容词'
    return 0,'核心结构'
def paragraph_examples(ps):
    result=[]
    for i,p in enumerate(ps):
        p=p.strip()
        if p.startswith('• '):p=p[2:]
        if p.startswith('例句：'):p=p[3:]
        if re.match(r'^(Il |Il\b|Bien |À |Les |Le |La |En |Si |On |Cela |Cette |Pour |Je |Afin |Quoi |Sans |Certaines |De |Aucune |Internet |Travailler |Vivre |Nous |Beaucoup |Lorsque |L\’|L\')',p) and ('。' not in p and re.search(r'[.!?]$',p)):
            zh=ps[i+1].strip().removeprefix('中文：').strip() if i+1<len(ps) and ps[i+1].strip().startswith('中文：') else ''
            result.append((p,zh))
    return result

for f in sorted(Path(sys.argv[1]).glob('*')):
    if f.suffix not in ('.docx','.xlsx'):continue
    name=f.name; cat,sub=cat_for(name); src={'name':name,'categories':[cat],'paragraphs':[],'tables':[],'worksheets':[]}
    sources.append(src)
    if f.suffix=='.xlsx':
        for sheet in load_workbook(f,data_only=False):
            rows=[[str(v) if v is not None else '' for v in row] for row in sheet.iter_rows(values_only=True)]
            src['worksheets'].append({'name':sheet.title,'rows':rows,'rowCount':sheet.max_row,'columnCount':sheet.max_column})
            header=next(i for i,r in enumerate(rows) if r[0] in ['类别','形容词','编号','要点'])
            for i,r in enumerate(rows[header+1:],header+2):
                if not any(r):continue
                loc=f'{sheet.title}!{i}'
                if rows[header][0]=='类别':
                    e=add(r[1],r[2],cat,'形容词前置规律','adjective',name,loc,rule=r[3],commonErrors=r[6],tags=r[0])
                    ex(e,r[4],r[5],name)
                elif rows[header][0]=='形容词':
                    e=add(r[0],r[1],cat,'非固定前置与常见搭配','adjective',name,loc,rule=r[2],commonErrors=r[5])
                    ex(e,r[3],r[4],name);ex(e,r[6],r[7],name)
                elif rows[header][0]=='编号':
                    e=add(r[1],r[2],cat,'动词 + 形容词 · '+sheet.title,'collocation',name,loc,tags=r[3],rule=r[7],notes=r[4]);ex(e,r[5],r[6],name)
                else:
                    e=add(r[1],r[0],cat,'状态表达规则','rule',name,loc,rule=r[1],notes=r[2])
        continue
    d=Document(f); ps=[p.text.strip() for p in d.paragraphs if p.text.strip()];src['paragraphs']=ps
    global_notes=[p for p in ps if re.match(r'^(考试提醒|口语提醒|口语提示|备考重点|记忆重点|使用原则|重要规则|核心结构|目标：|备考策略|固定结尾骨架)',p)]
    if cat==6:
        global_notes += [p for p in ps if p.startswith(('优先把','不要强行','主语检查示例'))]
    if '条件式' in name:
        global_notes += [p for p in ps if p.startswith(('第一优先：','第二优先：','第三优先：','Si 句第一优先：','不要为了','规则：'))]
        for i,p in enumerate(ps):
            if re.match(r'^(il / elle|ils / elles|nous|on|cela / ça)：',p):
                fr,zh=p.split('：',1)
                add(fr,zh,1,'高频主语','subject',name,f'paragraph-{i}',rule='主语范围：只练 Tâche 3 的高频社会议题主语。')
    if cat==6:
        add('en + participe présent','通过…… / 在……的同时',cat,'核心结构','structure',name,'gérondif-rule',rule=global_notes)
    for ti,t in enumerate(d.tables):
        rows=[[c.text.strip() for c in r.cells] for r in t.rows];src['tables'].append(rows)
        for ri,r in enumerate(rows[1:],2):
            loc=f'table-{ti+1}/row-{ri}'
            if 'Gerondif' in name:
                e=add(r[1],r[2],cat,sub,'verb',name,loc,rule=global_notes,notes='原形：'+r[0]);ex(e,r[3],src=name)
            elif '条件式' in name:
                tense='高频条件式动词' if ti==0 else 'Si + imparfait 高频动词'
                e=add(r[0]+' → '+' / '.join(v for v in r[1:4] if v!='—'),r[4],cat,tense,'verb',name,loc,rule=global_notes,notes='顺序：il / elle / on；ils / elles；nous')
                fr,_,zh=r[5].partition('中文：');ex(e,fr,zh,name)
            elif '结尾' in name:
                e=add(r[0].lower()+' → '+' / '.join(r[2:5]),r[1],cat,'高频虚拟式动词','verb',name,loc,rule=global_notes,notes=['顺序：il / elle / on；ils / elles；nous',r[5]])
            elif '法语口语否定' in name:
                e=add(r[0],r[1],cat,sub,'structure',name,loc,rule=[r[2],*global_notes],commonErrors=r[4]);fr,_,zh=r[3].partition('\n');ex(e,fr,zh,name)
            elif '强调' in name:
                label=re.sub(r'^\d+\.\s*','',r[0]);e=add(label,r[3] if len(r)>3 else '强调：'+('重点内容' if ri<4 else '主语' if ri==4 else '宾语 / 成分'),cat,sub,'structure',name,loc,rule=[r[1],*global_notes]);ex(e,r[2],src=name)
            else:
                stars=r[0].count('★');e=add(r[1],r[2],cat,sub,'structure',name,loc,priority=stars if stars>1 or ('★★★' in '\n'.join(ps)) else None,priorityLabels=[r[0] if '★' in r[0] else '',*([ps[1]] if '★' in ps[1] else [])],rule=global_notes)
                if len(r)>3:ex(e,r[3],src=name)
    # Numbered prose blocks: virtual constructions, en, conditionals, gerund examples.
    starts=[i for i,p in enumerate(ps) if re.match(r'^\d+\.\s',p)]
    for j,start in enumerate(starts):
        end=starts[j+1] if j+1<len(starts) else len(ps)
        # stop at a section heading / verb header
        for k in range(start+1,end):
            if re.match(r'^(第[一二三四]部分|[一二三四五六七八]、|[A-ZÊÉÀ]+ —)',ps[k]):end=k;break
        head=re.sub(r'^\d+\.\s*','',ps[start]);body=ps[start+1:end]
        if ' — ' in head:continue  # verb blocks handled below
        if '_en' in name:
            zh=(next((p for p in body if p.startswith('中文：')),'中文：'+head))[3:]
            # Use the concise verb meaning from the de→en explanation if possible.
            meaning={'en avoir besoin':'需要它 / 这些','en profiter':'充分利用 / 享受','en parler':'谈论它','en tenir compte':'考虑到它','en prendre conscience':'意识到它','en être conscient(e)':'意识到它','s\'en rendre compte':'意识到它','en bénéficier':'从中受益','s\'en occuper':'照顾 / 处理它','s\'en servir':'使用它','en tirer profit':'从中获益','en tirer des avantages / des bénéfices':'从中获得好处','il y en a':'其中有','en + quantité':'数量回指','en économiser':'节省它','en gaspiller':'浪费它','en vouloir':'想要它','en faire une généralité':'以偏概全','en sous-estimer les conséquences':'低估它的后果','en faire partie':'是其中一部分'}
            e=add(head,meaning.get(head,zh),cat,sub,'structure',name,f'paragraph-{start}',rule=[p for p in body if p.startswith('结构：')]+global_notes)
            for i,p in enumerate(body):
                if p.startswith('TCF Tâche 3：'):ex(e,p.split('：',1)[1],body[i+1][3:] if i+1<len(body) and body[i+1].startswith('中文：') else '',name)
        elif 'Gerondif' in name:
            e=next((e for e in entries.values() if norm(e['french'])==norm(head)),None)
            for fr,zh in paragraph_examples(body):ex(e,fr,zh,name)
        else:
            zh=next((p.split('：',1)[1] for p in body if p.startswith(('功能：','中文：'))),head)
            e=add(head,zh,cat,'核心结构','structure',name,f'paragraph-{start}',rule=[p for p in body if p.startswith(('用法：','结构：'))]+global_notes)
            for fr,zh in paragraph_examples(body):ex(e,fr,zh,name)
    # Verb sections preserve conjugations, collocations and all examples from both sources.
    verb_starts=[i for i,p in enumerate(ps) if re.match(r'^(\d+\.\s*)?[A-ZÊÉÀ]+ — ',p)]
    for j,start in enumerate(verb_starts):
        end=verb_starts[j+1] if j+1<len(verb_starts) else len(ps)
        for k in range(start+1,end):
            if re.match(r'^(第[一二三四]部分|[一二三四五六七八]、)',ps[k]):end=k;break
        head=re.sub(r'^\d+\.\s*','',ps[start]);lemma,zh=head.split(' — ',1);body=ps[start+1:end]
        forms=next((p for p in body if p.startswith('虚拟式：')),'')
        vals=re.findall(r'→\s*([^｜]+)',forms)
        e=add(lemma.lower()+' → '+' / '.join(v.strip() for v in vals),zh,cat,'高频虚拟式动词','verb',name,f'paragraph-{start}',notes='顺序：il / elle / on；ils / elles；nous',rule=global_notes)
        if '结尾' in name:
            labels={'faire':'A级（必须条件反射）','prendre':'A级（必须条件反射）','mettre':'A级（必须条件反射）','savoir':'A级（必须条件反射）','pouvoir':'A级（必须条件反射）','être':'A级（必须条件反射）','avoir':'A级（必须条件反射）','favoriser':'B级（C1 主题扩展）','encourager':'B级（C1 主题扩展）','protéger':'B级（C1 主题扩展）','garantir':'B级（C1 主题扩展）','proposer':'C级（增加表达灵活性）','permettre':'C级（增加表达灵活性）','veiller':'C级（增加表达灵活性）','devoir':'特殊用途：可能需要 / 不得不'}
            label=labels.get(lemma.lower())
            if label and label not in e['priorityLabels']:e['priorityLabels'].append(label)
        for fr,z in paragraph_examples(body):ex(e,fr,z,name)
        iscoll=False
        for i,p in enumerate(body):
            if p=='固定搭配：':iscoll=True;continue
            if p=='例句：':iscoll=False
            if iscoll and p.startswith('• '):
                line=p[2:];a,b,c=line.partition(' —— ')
                if not b:
                    match=re.match(r'^(.*?)（(.*)）$',line)
                    if match:a,c=match.groups()
                ce=add(a,c or zh,cat,'高频固定搭配','collocation',name,f'paragraph-{start+i+1}',notes='关联动词：'+lemma.lower())
                ce['examples']=list(e['examples'])
    # Si skeletons and conclusion combinations.
    for i,p in enumerate(ps):
        m=re.match(r'^[A-E]\.\s*(.*)',p)
        if m:
            body=ps[i+1:i+4];zh=next((v[3:] for v in body if v.startswith('中文：')),'Si 假设骨架')
            e=add(m[1],zh,cat,'高频 Si 假设骨架','structure',name,f'paragraph-{i}',rule=global_notes)
            for fr,z in paragraph_examples(body):ex(e,fr,z,name)
        if '结尾' in name and re.match(r'^(最稳建议|双方并行|措施 → 目的|避免陌生变位|更正式建议|强调必要性)：',p):
            zh,fr=p.split('：',1);add(fr,zh,cat,'结尾组合','structure',name,f'paragraph-{i}')
    # Attach topical examples to their existing constructions/verbs, avoiding sentence entries.
    file_entries=[e for e in entries.values() if name in e['sourceFiles']]
    for fr,zh in paragraph_examples(ps):
        candidates=[];n=norm(fr)
        for e in file_entries:
            core=e['french'].split(' + ')[0].split(' → ')[0]
            if len(core)>3 and norm(core) in n:candidates.append(e)
            elif e['kind']=='verb':
                for form in e['french'].split(' → ')[-1].split(' / '):
                    if re.search(r'\b'+re.escape(form)+r'\b',fr,re.I):candidates.append(e);break
        if not candidates and cat==1:candidates=[next((e for e in file_entries if ALIASES.get(norm(e['french']))=='si-imparfait'),file_entries[0])]
        for e in candidates:ex(e,fr,zh,name)
    # Every paragraph remains visible as source reference material (including priorities, errors,
    # subject scope and paragraph headings). This is separate from practice-entry counts.
    src['referenceNotes']=[p for p in ps if p not in global_notes]

# Cross-category memberships based on the canonical grammatical function.
for e in entries.values():
    n=norm(e['french'])
    if ALIASES.get(n)=='purpose-que':
        e['variants'].append(e['french'])
        e['french']='Pour que / Afin que + subjonctif'
    links=[]
    if 'subjonctif' in n:links.append((0,'核心结构'))
    if any(n.startswith(norm(v)) for v in ['Bien que','Même si','Malgré','Certes','Quel que soit']):links.append((2,'让步 / 对立'))
    if any(n.startswith(norm(v)) for v in ['Pour que','Afin que','Afin que / pour que','pour +','afin de +']):links.append((2,'目的'))
    if any(n.startswith(norm(v)) for v in ['À condition que','À moins que','Pourvu que']):links.append((1,'核心结构'))
    if n.startswith('sansque'):links.append((3,'核心结构'))
    if 'subjonctif' in n:e['tags'].append('subjonctif')
    if e['category']==0 and e['kind']=='structure' and 'indicatif' in n and not n.startswith('pourconclure'):
        e['subcategory']='第三人称判断 · 直陈式'
        e['memberships']=[membership(0,'第三人称判断 · 直陈式') if m['category']==0 else m for m in e['memberships']]
    for cat,sub in links:
        m=membership(cat,sub)
        if m not in e['memberships']:e['memberships'].append(m)
    if e['priority']:e['tags'].append('priority-'+str(e['priority']))
    e['tags']=list(dict.fromkeys(e['tags']+[CATS[m['category']] for m in e['memberships']]))
    e['practiceTypes']=['zh-fr','fr-zh'] if e['kind']!='rule' else []
    if e['examples']:e['practiceTypes'].append('oral')

catalog=list(entries.values())
audit={'files':[], 'fileCount':len(sources),'canonicalEntries':len(catalog), 'sourceOccurrences':len(occurrences),
       'duplicatesMerged':sum(o['merged'] for o in occurrences),'categories':[], 'unclassified':[],
       'preservation':'All nonempty source paragraphs, table cells and worksheet cells are archived and accessible in source reference panels. Sentence examples enrich canonical structures instead of creating duplicate practice cards.',
       'priorityPolicy':'Stars are copied only when source explicitly defines the 3/2/1 system. Single stars used to mark first-priority lists are kept as native priority labels, not reinterpreted as supplementary content.',
       'occurrences':occurrences}
for src in sources:
    items=[e for e in catalog if src['name'] in e['sourceFiles']]
    cats=sorted({m['category'] for e in items for m in e['memberships']})
    src['categories']=cats
    audit['files'].append({'name':src['name'],'categories':[CATS[c] for c in cats], 'entries':len(items),
        'paragraphCount':len(src['paragraphs']),'tableCount':len(src['tables']),
        'worksheets':[{'name':s['name'],'rows':s['rowCount'],'columns':s['columnCount']} for s in src['worksheets']],
        'referenceMaterial':len(src.get('referenceNotes',[]))})
for i,c in enumerate(CATS):
    items=[e for e in catalog if any(m['category']==i for m in e['memberships'])]
    audit['categories'].append({'name':c,'count':len(items),**{k:sum(e['kind']==v for e in items) for k,v in [('structures','structure'),('verbs','verb'),('collocations','collocation'),('adjectives','adjective'),('rules','rule'),('subjects','subject')]}})
payload={'categories':CATS,'entries':catalog,'sources':sources,'audit':audit}
OUT.mkdir(exist_ok=True)
(OUT/'c1-grammar-data.js').write_text('const C1_GRAMMAR_DATA='+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+';\n'+
    "DATA.push(...C1_GRAMMAR_DATA.entries.map(e=>({id:e.id,module:9,fr:e.french,zh:e.chinese,origins:[4],members:[{fr:e.french,sourceIndex:4,category:C1_GRAMMAR_DATA.categories[e.category],row:0,zh:e.chinese,example:e.examples[0]?.french||'',usage:e.rule.join('\\n'),source:e.sourceFiles.join(' / ')}]})));\n",encoding='utf-8')
(OUT/'c1-grammar-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({k:audit[k] for k in ['fileCount','canonicalEntries','sourceOccurrences','duplicatesMerged','categories']},ensure_ascii=False,indent=2))
