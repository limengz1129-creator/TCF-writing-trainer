"""Import all nine supplied documents without changing source classifications."""
import json,re,hashlib,collections,argparse
from docx import Document
from openpyxl import load_workbook
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--input',type=Path,default=ROOT.parent/'upload',help='Directory with the 8 Word files and master Excel')
args=parser.parse_args()
sources={}
for file in sorted(args.input.iterdir()):
 if file.suffix=='.xlsx':
  workbook=load_workbook(file,data_only=True)
  sources[file.name]={sheet.title:list(sheet.values) for sheet in workbook}
 elif file.suffix=='.docx':
  document=Document(file)
  sources[file.name]={'paragraphs':[p.text for p in document.paragraphs],'tables':[[[cell.text for cell in row.cells] for row in table.rows] for table in document.tables]}
assert len(sources)==9, 'Expected exactly 8 Word files and one Excel'
w=next(v for k,v in sources.items() if k.endswith('.xlsx'))
categories=['主谓一致与动词变位','基础句型框架','否定句结构','冠词缩合与高频介词','动词固定搭配','阴阳性与单复数配合','复杂句控制','词汇选择、词形与副词']
entries=[];byrank={};docs=[];teaching={};links=[]
for r in w['去重错误模式（主表）'][5:]:
 rank,pattern,wrong,correct,category,explanation,recommended,count,priority,origins=r
 e=dict(id=f'oral-error-{rank:04}',rank=rank,pattern=pattern,wrong=wrong,correct=correct,category=category,explanation=explanation,recommended=recommended,frequency=count,priority=priority,originalIds=sorted(set(map(int,re.findall(r'\[(\d+)\]',origins)))),sourceType='real_error',source=['Excel 主表 '+str(rank)],specialties=[],occurrences=[],tags=[])
 entries.append(e);byrank[rank]=e
norm=lambda s:re.sub(r'\s+',' ',str(s or '').replace('’',"'").lower()).strip()
# Exact original/correction pairs map detail occurrences onto canonical master IDs.
pairs=collections.defaultdict(list)
for e in entries:pairs[(norm(e['wrong']),norm(e['correct']))].append(e)
excluded=[];unmatched=[]
for r in w['完整错误明细'][5:]:
 num,oid,title,wrong,sentence,correct,cat,explain,recommend,status=r
 d=dict(detailId=num,originalId=oid,title=title,wrong=wrong,sentence=sentence,correct=correct,category=cat,explanation=explain,recommended=recommend,status=status)
 if status in ['待核音','表达优化（不计错误）']:excluded.append(d);continue
 candidates=[e for e in pairs[(norm(wrong),norm(correct))] if oid in e['originalIds']]
 if not candidates:
  # Master groups generic patterns; Word source ranks remain authoritative.
  candidates=[e for e in entries if oid in e['originalIds'] and norm(correct)==norm(e['correct'])]
 if not candidates:
  candidates=[e for e in entries if oid in e['originalIds'] and norm(wrong)==norm(e['wrong'])]
 if not candidates:
  hints=[(r'savoir|sachions|sachent',4),(r'consacrer du temps',55),(r'rendre.*形容词|rendre.*adjectif|rendre 后',6),(r'être confront',46),(r'encourager',18),(r'apprendre à quelqu',17),(r'faire connaissance',8),(r'avoir tendance',12),(r'participer à',16),(r'faire face à',39),(r'capable de',90),(r'permettre de',28),(r'permettre à|permettre.*qqn',10),(r'aider.*(?:quelqu|qqn|无 à)',9),(r'情态动词|条件式后',2),(r'à long terme',32),(r'vie 阴性',22),(r'personne.*阴性',21),(r'information 阴性',47),(r'outil 阳性',34),(r'Corée 阴性',91),(r'manière 阴性',96),(r'temps.*阳性',100),(r'effet 阳性',95),(r'égalité 阴性',103),(r'accorder.*importance',49),(r'副词',20),(r'不定式.*主语|主语.*不定式',1057),(r'复数主语|复数先行词|并列主语|复数.*对应',1),(r'主语.*单数|单数主语',3)]
  for hint,rank in hints:
   e=byrank[rank]
   if re.search(hint,explain,re.I) and oid in e['originalIds']:
    candidates=[e];break
 reviewed={166:1,179:97,234:48,340:2,774:48,786:1,810:1,1119:101,1187:2,1198:89,1437:2,1562:1,1572:6,1646:78,1733:98,1876:81}
 if not candidates and num in reviewed:
  e=byrank[reviewed[num]]
  assert oid in e['originalIds']
  candidates=[e]
 if candidates:
  exact=[e for e in candidates if e['wrong']==wrong and e['correct']==correct]
  e=(exact or candidates)[0];d['errorId']=e['id'];e['occurrences'].append(d)
 else:unmatched.append(d)
# Map every Word latest-error row to the Excel rank. Teaching is never relabeled real.
for filename,v in sources.items():
 if not filename.endswith('.docx'):continue
 cat=int(re.search(r'错题本_(\d)',filename)[1])-1
 paragraphs=v['paragraphs'];doc=dict(category=cat,file=filename,paragraphs=paragraphs,tables=[])
 for ti,t in enumerate(v['tables']):
  if '主表与追溯' in t[0]:
   for row in t[1:]:
    rank=int(re.search(r'主表\s*(\d+)',row[0])[1]);e=byrank[rank]
    if cat not in e['specialties']:e['specialties'].append(cat)
    e['source'].append(f'{filename} · 表 {ti+1}')
    links.append(dict(file=filename,rank=rank,id=e['id']))
  else:
   doc['tables'].append(t)
   error_table=any(any(k in c for k in ['错','原片段','原意']) for c in t[0])
   for ri,row in enumerate(t[1:]):
    french='\n'.join(c for c in row if re.search('[A-Za-zÀ-ÿ]',c))
    if not french:continue
    wrong=row[0] if error_table else ''
    correct=row[1] if error_table else '\n'.join(row[1:])
    # Tables whose French is in first cell need that complete sentence.
    if not re.search('[A-Za-zÀ-ÿ]',correct):correct=row[0]
    label=row[0] if re.search('[\u4e00-\u9fff]',row[0]) else ' / '.join(t[0])+': '+row[0]
    kind='training_example' if error_table else 'rule_example'
    key=(kind,norm(wrong),norm(correct),norm(label))
    if key not in teaching:
     teaching[key]=dict(id='oral-teaching-'+hashlib.sha256('|'.join(key).encode()).hexdigest()[:16],sourceType=kind,wrong=wrong,correct=correct,explanation=label,pattern=label,recommended='',frequency=0,priority='',category=categories[cat],specialties=[],originalIds=[],source=[],tags=['教学补充'],occurrences=[])
    te=teaching[key];te['specialties']=sorted(set(te['specialties']+[cat]));te['source'].append(f'{filename} · 表 {ti+1} 行 {ri+2}')
 # Preserve every paragraph; extract bilingual examples and inline correction pairs for practice.
 for pi,p in enumerate(paragraphs):
  match=re.search(r'(?:错题：|延伸练习：|错误：)?(.+?)\s*→\s*(?:正确：)?\s*(.+)',p)
  if match and re.search('[A-Za-zÀ-ÿ]',match[2]):
   wrong,correct=match.groups();kind='training_example';label=p
  elif re.match(r'^[A-ZÀ-Ý][A-Za-zÀ-ÿ’\s]',p) and pi+1<len(paragraphs) and re.search('[\u4e00-\u9fff]',paragraphs[pi+1]) and not re.search('[A-Za-zÀ-ÿ]',paragraphs[pi+1]):
   wrong='';correct=p;kind='rule_example';label=paragraphs[pi+1]
  else:continue
  key=(kind,norm(wrong),norm(correct),norm(label))
  if key not in teaching:teaching[key]=dict(id='oral-teaching-'+hashlib.sha256('|'.join(key).encode()).hexdigest()[:16],sourceType=kind,wrong=wrong,correct=correct,explanation=label,pattern=label,recommended='',frequency=0,priority='',category=categories[cat],specialties=[],originalIds=[],source=[],tags=['教学补充'],occurrences=[])
  te=teaching[key];te['specialties']=sorted(set(te['specialties']+[cat]));te['source'].append(f'{filename} · 段 {pi+1}')
 docs.append(doc)
assert not unmatched
assert all(len(e['occurrences'])==e['frequency'] for e in entries),[(e['rank'],e['frequency'],len(e['occurrences'])) for e in entries if e['frequency']!=len(e['occurrences'])]
assert len(entries)==1127 and all(len(e['specialties'])==1 for e in entries)
# Aggregate groups contain different occurrences: link details by exact pair first,
# then preserve any remaining detail independently under its original instead of guessing.
# Reuse the same canonical ID whenever an additional Word teaching fragment
# exactly matches a confirmed Excel occurrence. No new real-error claim is inferred.
occurrencePairs={(norm(d['wrong']),norm(d['correct'])):e for e in entries for d in e['occurrences']}
supplementLinks=[]
for key,example in list(teaching.items()):
 target=occurrencePairs.get((norm(example['wrong']),norm(example['correct']))) if example['wrong'] else None
 if target:
  target['source'].extend(example['source'])
  for cat in example['specialties']:
   doc=next(d for d in docs if d['category']==cat)
   doc.setdefault('linkedTeachingIds',[]).append(target['id'])
  supplementLinks.append({'teachingId':example['id'],'canonicalId':target['id'],'source':example['source']})
  del teaching[key]
originals=[];checklists={r[0]:r for r in w['171条审核清单'][5:]}
for r in w['171条原稿'][5:]:
 oid,group,sub,title,zh,transcript,date=r
 originals.append(dict(id=oid,group=group,subcategory=sub,title=title,zh=zh,transcript=transcript,date=date,errorIds=[e['id'] for e in entries if oid in e['originalIds']],unmappedDetails=[d for d in unmatched if d['originalId']==oid],audit=checklists[oid],excludedIds=[d['detailId'] for d in excluded if d['originalId']==oid]))
assert [o['id'] for o in originals]==list(range(1,172))
for e in entries:
 e['tags']=[e['category'],e['priority']+'优先级']+list(set(d['status'] for d in e['occurrences']))
 e['frequencyBand']='high' if e['frequency']>=5 else 'medium' if e['frequency']>=2 else 'low'
data=dict(categories=categories,entries=entries,teaching=list(teaching.values()),documents=sorted(docs,key=lambda d:d['category']),originals=originals,excluded=excluded,rawWorkbook=w)
audit=dict(uniqueRealErrors=len(entries),specialties=[sum(i in e['specialties'] for e in entries) for i in range(8)],originals=len(originals),originalsWithErrors=sum(bool(o['errorIds']) for o in originals),teaching=len(teaching),teachingByType=dict(collections.Counter(e['sourceType'] for e in teaching.values())),excluded=dict(collections.Counter(d['status'] for d in excluded)),detailLinks=sum(len(e['occurrences']) for e in entries),unmappedDetails=len(unmatched),wordCanonicalLinks=len(links),wordDuplicateErrorsAvoided=len(links)+len(supplementLinks),wordSupplementLinks=supplementLinks,allWorksheetRows={k:len(v) for k,v in w.items()},wordParagraphs=sum(len(d['paragraphs']) for d in docs))
data['audit']=audit
(ROOT/'combined-expressions/oral-errors-data.js').write_text('const ORAL_ERRORS_DATA='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\nconst ORAL_ERRORS_RESTORE=(()=>{try{return JSON.parse(localStorage.getItem("TCF-COMBINED-EXPRESSIONS-v1"))?.module===10;}catch{return false;}})();\n')
(ROOT/'combined-expressions/oral-errors-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2))
print(json.dumps(audit,ensure_ascii=False,indent=2))
