#!/usr/bin/env python3
"""Generate offline Piper siwis audio for the six example cards."""
import base64, json, subprocess, tempfile, wave
from piper import PiperVoice
from pathlib import Path

root = Path(__file__).resolve().parents[2]
dest = root / "combined-expressions" / "example-six"
sentences = [
"Par exemple, apprendre le français peut faciliter l'intégration des immigrants.",
"Prenons l'exemple du Canada, où plusieurs langues coexistent.",
"On peut citer les transports en commun, qui réduisent la pollution.",
"C'est le cas des jeunes qui cherchent un emploi à l'étranger.",
"Les activités culturelles favorisent les échanges, notamment entre les générations.",
"À titre d'exemple, le télétravail permet de mieux concilier vie professionnelle et vie privée.",
]
model = Path("/tmp/fr_FR-siwis-medium.onnx")
if not model.exists():
    raise SystemExit("Missing Piper model: " + str(model))
entries = {}
pack = {}
voice = PiperVoice.load(str(model))
with tempfile.TemporaryDirectory() as tmp:
    for i, sentence in enumerate(sentences):
        wav = Path(tmp) / f"{i}.wav"
        mp3 = Path(tmp) / f"{i}.mp3"
        with wave.open(str(wav), "wb") as wav_file:
            voice.synthesize_wav(sentence, wav_file)
        subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav), "-codec:a", "libmp3lame", "-q:a", "4", str(mp3)], check=True)
        key = str(i)
        entries[sentence] = {"pack": "audio-pack.json", "id": key}
        pack[key] = {"text": sentence, "audio": base64.b64encode(mp3.read_bytes()).decode("ascii"), "timing": []}
(dest / "audio-manifest.json").write_text(json.dumps({"voice":"fr_FR-siwis-medium","entries":entries},ensure_ascii=False),encoding="utf-8")
(dest / "audio-pack.json").write_text(json.dumps(pack,ensure_ascii=False),encoding="utf-8")
print("Generated",len(entries),"Piper MP3 recordings")
