#!/usr/bin/env python3
"""Repository-wide audit: reject browser/system/online TTS fallbacks in practice pages.
Run: python tools/piper/audit_all_pronunciation.py
"""
from pathlib import Path
import re,sys,json
root=Path(__file__).resolve().parents[2]
excluded={".git","node_modules","dist","build",".venv","venv"}
patterns={
 "browser speech synthesis":re.compile(r"\bspeechSynthesis\b|\bSpeechSynthesisUtterance\b",re.I),
 "browser voice enumeration":re.compile(r"\bgetVoices\s*\(",re.I),
 "external TTS API":re.compile(r"responsiveVoice|translate\.google\.[^/]+/translate_tts|api\.streamelements\.com/kappa/v2/speech|tts\.voicetech",re.I),
}
results=[]
for p in root.rglob("*"):
 if not p.is_file() or p.suffix.lower() not in {".js",".html",".ts",".tsx",".jsx"} or any(x in excluded for x in p.parts):continue
 if p.name=="audit_all_pronunciation.py":continue
 try:s=p.read_text(encoding="utf-8")
 except UnicodeError:continue
 for kind,pattern in patterns.items():
  for m in pattern.finditer(s):
   line=s.count("\n",0,m.start())+1
   results.append({"path":str(p.relative_to(root)),"line":line,"kind":kind})
# Check that newly migrated Piper modules have complete exact-text audio indexes.
argument=root/"eo-tache3-corpus"/"argument-map.js"
manifest=root/"eo-tache3-corpus"/"argument-audio"/"manifest.json"
if argument.exists():
    src=argument.read_text(encoding="utf-8")
    token="const TOPICS="
    if token in src:
        topics,_=json.JSONDecoder().raw_decode(src[src.index(token)+len(token):])
        expected=set()
        def walk(obj):
            if isinstance(obj,dict):
                for k,v in obj.items():
                    if k=="words" and isinstance(v,list):
                        for item in v:
                            if isinstance(item,list) and item and isinstance(item[0],str):expected.add(item[0])
                    else:walk(v)
            elif isinstance(obj,list):
                for v in obj:walk(v)
        walk(topics)
        if not manifest.exists():
            results.append({"path":str(manifest.relative_to(root)),"kind":"missing Piper manifest","expected":len(expected)})
        else:
            recorded=json.loads(manifest.read_text(encoding="utf-8")).get("entries",{})
            missing=expected-set(recorded)
            if missing:results.append({"path":str(manifest.relative_to(root)),"kind":"missing Piper entries","count":len(missing),"samples":sorted(missing)[:10]})
six=root/"combined-expressions"/"example-six"
six_manifest=six/"audio-manifest.json"
if (six/"index.html").exists():
    if not six_manifest.exists():
        results.append({"path":str(six_manifest.relative_to(root)),"kind":"missing six-example Piper manifest"})
    else:
        data=json.loads(six_manifest.read_text(encoding="utf-8"))
        if len(data.get("entries",{}))<6:results.append({"path":str(six_manifest.relative_to(root)),"kind":"incomplete six-example Piper audio"})
print(json.dumps({"total":len(results),"findings":results},ensure_ascii=False,indent=2))
sys.exit(1 if results else 0)
