#!/usr/bin/env python3
import base64, json, re, subprocess, tempfile, wave
from pathlib import Path
from piper import PiperVoice

ROOT=Path(__file__).resolve().parents[3]
COMBINED=ROOT/"combined-expressions"
PERSON=COMBINED/"conjugation-person-data.js"
AUDIO=COMBINED/"piper-audio"
MANIFEST=AUDIO/"manifest.json"
AUDIT=COMBINED/"conjugation-audio-audit.json"

def load_rows():
    raw=PERSON.read_text(encoding="utf-8")
    start=raw.index("[")
    end=raw.index("];\nconst ",start)
    return json.loads(raw[start:end+1])

def display_form(x):
    form=x["fr"]
    tense=x["tense"]
    person=x["person"]
    if "命令式" in tense:
        return form+" !"
    if person=="无主语人称变化":
        return ("en "+form) if ("副动词" in tense and not re.match(r"^en\b",form)) else form
    if person=="je" and re.match(r"^[aàâäeéèêëiîïoôöuùûüyÿœæh]",form,re.I) and not re.match(r"^handicap",form,re.I):
        text="j’"+form
    else:
        text=person+" "+form
    if "虚拟式" in tense:
        text=("qu’"+text) if re.match(r"^(il|ils|elle|elles|on)\b",text) else ("que "+text)
    return text

def synthesize(voice,text):
    with tempfile.TemporaryDirectory() as td:
        wav=Path(td)/"a.wav"; mp3=Path(td)/"a.mp3"
        with wave.open(str(wav),"wb") as wf:
            voice.synthesize_wav(text,wf)
        with wave.open(str(wav),"rb") as wf:
            duration=wf.getnframes()/wf.getframerate()
        subprocess.run(
            ["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(wav),
             "-codec:a","libmp3lame","-b:a","48k",str(mp3)],
            check=True
        )
        audio=base64.b64encode(mp3.read_bytes()).decode("ascii")
    return {
        "text":text,
        "audio":audio,
        "duration":round(duration,4),
        "timing":[{"start":0,"end":round(duration,4),"from":0,"to":len(text)}],
        "alignment":"phrase"
    }

def main():
    import argparse
    ap=argparse.ArgumentParser()
    ap.add_argument("--model",required=True)
    args=ap.parse_args()

    rows=load_rows()
    manifest=json.loads(MANIFEST.read_text(encoding="utf-8"))
    entries=manifest.setdefault("entries",{})

    targets=[]
    seen=set()
    row_targets=[]
    for row in rows:
        text=display_form(row)
        row_targets.append((row,text))
        if text not in seen:
            seen.add(text); targets.append(text)

    # A manifest key alone is not enough: the mapped pack/id can be missing,
    # stale, mismatched, or contain an empty audio payload. Validate the full
    # playback chain exactly as the browser does before deciding coverage.
    pack_cache={}
    invalid_reasons={}

    def valid_entry(text):
        link=entries.get(text)
        if not link:
            invalid_reasons[text]="missing-manifest-entry"
            return False
        pack_name=link.get("pack")
        item_id=link.get("id")
        if not pack_name or not item_id:
            invalid_reasons[text]="invalid-manifest-link"
            return False
        path=AUDIO/pack_name
        if not path.exists():
            invalid_reasons[text]="missing-pack"
            return False
        try:
            if pack_name not in pack_cache:
                pack_cache[pack_name]=json.loads(path.read_text(encoding="utf-8"))
            data=pack_cache[pack_name].get(item_id)
        except Exception:
            invalid_reasons[text]="invalid-pack-json"
            return False
        if not data:
            invalid_reasons[text]="missing-pack-id"
            return False
        if data.get("text")!=text:
            invalid_reasons[text]="text-mismatch"
            return False
        audio=data.get("audio")
        if not isinstance(audio,str) or not audio:
            invalid_reasons[text]="missing-audio"
            return False
        try:
            if len(base64.b64decode(audio,validate=True))<128:
                invalid_reasons[text]="invalid-audio"
                return False
        except Exception:
            invalid_reasons[text]="invalid-audio"
            return False
        return True

    missing=[t for t in targets if not valid_entry(t)]
    missing_set=set(missing)
    missing_rows=[r for r,t in row_targets if t in missing_set]
    reason_counts={}
    for t in missing:
        reason=invalid_reasons.get(t,"unknown")
        reason_counts[reason]=reason_counts.get(reason,0)+1

    print(f"Conjugation rows={len(rows)} lemmas={len(set(r['lemma'] for r in rows))} unique targets={len(targets)}",flush=True)
    print(f"Piper playable coverage before: {len(targets)-len(missing)}/{len(targets)}; broken={len(missing)} reasons={reason_counts}",flush=True)

    # Regenerate only broken targets. Never overwrite previous repair packs:
    # old manifest links may still point into them for otherwise valid entries.
    existing_numbers=[]
    for old in AUDIO.glob("conj-repair-*.json"):
        m=re.fullmatch(r"conj-repair-(\d+)\.json",old.name)
        if m:
            existing_numbers.append(int(m.group(1)))
    voice=PiperVoice.load(args.model) if missing else None
    pack={}; size=0; number=(max(existing_numbers)+1 if existing_numbers else 0); created=[]

    def flush():
        nonlocal pack,size,number
        if not pack:return
        name=f"conj-repair-{number:02}.json"
        path=AUDIO/name
        path.write_text(json.dumps(pack,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
        created.append(name)
        print("wrote",name,len(pack),flush=True)
        pack={};size=0;number+=1

    for i,text in enumerate(missing,1):
        rid=f"cr{i:04}"
        data=synthesize(voice,text)
        raw=json.dumps(data,ensure_ascii=False,separators=(",",":"))
        if pack and size+len(raw)>1500000:
            flush()
        pack[rid]=data
        size+=len(raw)
        entries[text]={"id":rid,"pack":f"conj-repair-{number:02}.json"}
        if i%50==0 or i==len(missing):
            print(f"generated {i}/{len(missing)}",flush=True)
    flush()

    # The last pack number in entries was assigned before flush increments, so mappings are correct.
    MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,separators=(",",":")),encoding="utf-8")

    # Revalidate the exact saved output, including pack/id/text/audio integrity.
    pack_cache.clear()
    invalid_reasons.clear()
    after=[t for t in targets if not valid_entry(t)]
    manifest["count"]=len(entries)
    MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
    audit={
        "voice":"fr_FR-siwis-medium",
        "rows":len(rows),
        "lemmas":len(set(r["lemma"] for r in rows)),
        "uniqueTargets":len(targets),
        "coveredBefore":len(targets)-len(missing),
        "missingBefore":len(missing),
        "brokenBefore":len(missing),
        "brokenReasonsBefore":reason_counts,
        "generated":len(missing),
        "missingAfter":len(after),
        "repairPacks":created,
        "missingLemmasBefore":len(set(r["lemma"] for r in missing_rows)),
        "status":"ok" if not after else "incomplete"
    }
    AUDIT.write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding="utf-8")
    if after:
        raise SystemExit(f"Still missing {len(after)} conjugation targets")
    print(json.dumps(audit,ensure_ascii=False),flush=True)

if __name__=="__main__":
    main()
