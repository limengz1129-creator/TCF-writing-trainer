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
print(json.dumps({"total":len(results),"findings":results},ensure_ascii=False,indent=2))
sys.exit(1 if results else 0)
