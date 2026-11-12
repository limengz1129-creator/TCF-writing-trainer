#!/usr/bin/env python3
"""Generate and verify exact-text Piper audio for all 11 Tâche 2 compact pages.

The original 2624-entry theme manifest is read-only. Existing recordings are
reused by exact match; unmatched lines use the same SIWIS medium model and
publish into an additional static manifest/pack directory.
"""
import argparse
import base64
import hashlib
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[2]
PAGES = ROOT / "tache2/real-exams"
EXISTING = PAGES / "piper-audio/themes"
OUT = PAGES / "piper-audio/compact"
SLUGS = ("travel", "housing", "social", "education", "consumption",
         "transport", "family", "sport", "health", "culture", "work")
COUNTS = (110, 181, 142, 59, 123, 119, 41, 53, 94, 99, 107)


class FrenchQuestions(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.active = False
        self.buffer = []
        self.questions = []

    def handle_starttag(self, tag, attrs):
        at = dict(attrs)
        if tag == "div" and "fr" in at.get("class", "").split():
            assert not self.active, "Nested French div"
            self.active = True
            self.buffer = []

    def handle_data(self, data):
        if self.active:
            self.buffer.append(data)

    def handle_endtag(self, tag):
        if tag == "div" and self.active:
            self.questions.append("".join(self.buffer).strip())
            self.active = False


def utterance(text):
    """† indicates a Word editing note and must not be synthesized."""
    return text.removesuffix(" †").strip()


def pages():
    result = {}
    for slug, count in zip(SLUGS, COUNTS):
        parser = FrenchQuestions()
        parser.feed((PAGES / f"{slug}-compact.html").read_text(encoding="utf-8"))
        assert len(parser.questions) == count, (slug, len(parser.questions), count)
        result[slug] = [utterance(s) for s in parser.questions]
        assert all(result[slug]), slug
    return result


def mp3_valid(encoded):
    data = base64.b64decode(encoded, validate=True)
    return len(data) > 200 and (data.startswith(b"ID3") or data[:2] in
                                  (b"\xff\xfb", b"\xff\xf3", b"\xff\xf2"))


def existing_index():
    old = json.loads((EXISTING / "manifest.json").read_text(encoding="utf-8"))
    assert old["voice"] == "fr_FR-siwis-medium"
    return old


def missing_phrases(question_pages, existing):
    return list(dict.fromkeys(text for rows in question_pages.values() for text in rows
                              if text not in existing["targets"]))


def generate(model):
    from piper import PiperVoice
    question_pages, original = pages(), existing_index()
    missing = missing_phrases(question_pages, original)
    OUT.mkdir(parents=True, exist_ok=True)
    print(f"T2 compact: {sum(map(len, question_pages.values()))} questions, "
          f"{len(missing)} distinct new utterances", flush=True)
    # Do not keep stale audio files after source text changes.
    voice = PiperVoice.load(str(model)) if missing else None
    entries = {}
    batch = {}
    size = 0
    batch_number = 0

    def flush():
        nonlocal batch, size, batch_number
        if not batch:
            return
        body = json.dumps(batch, ensure_ascii=False, separators=(",", ":"))
        fingerprint = hashlib.sha256(body.encode("utf-8")).hexdigest()[:12]
        name = f"pack-{batch_number:03d}-{fingerprint}.json"
        (OUT / name).write_text(body, encoding="utf-8")
        for key, row in batch.items():
            entries[row["text"]] = {"pack": name, "id": key}
        batch, size = {}, 0
        batch_number += 1

    for i, phrase in enumerate(missing):
        pcm = b"".join(ch.audio_int16_bytes for ch in voice.synthesize(phrase))
        if not pcm:
            raise RuntimeError(f"Empty Piper synthesis: {phrase}")
        result = subprocess.run(
            ["ffmpeg", "-hide_banner", "-loglevel", "error", "-f", "s16le",
             "-ar", str(voice.config.sample_rate), "-ac", "1", "-i", "pipe:0",
             "-codec:a", "libmp3lame", "-b:a", "48k", "-f", "mp3", "pipe:1"],
            input=pcm, capture_output=True, check=True)
        if not result.stdout:
            raise RuntimeError(f"Empty MP3 for: {phrase}")
        audio = base64.b64encode(result.stdout).decode("ascii")
        if not mp3_valid(audio):
            raise RuntimeError(f"Invalid MP3 for: {phrase}")
        row = {"text": phrase, "audio": audio}
        if size + len(audio) > 750000:
            flush()
        batch[f"compact-{i:04d}"] = row
        size += len(audio)
        if (i + 1) % 25 == 0:
            print(f"Generated {i+1}/{len(missing)} compact clips", flush=True)
    flush()
    (OUT / "manifest.json").write_text(
        json.dumps({"voice": "fr_FR-siwis-medium",
                    "version": 1, "entries": entries}, ensure_ascii=False,
                   separators=(",", ":")), encoding="utf-8")
    verify()


def verify():
    question_pages, original = pages(), existing_index()
    extra = json.loads((OUT / "manifest.json").read_text(encoding="utf-8"))
    assert extra["voice"] == "fr_FR-siwis-medium"
    pool = {}
    old_packs = {}

    def pack(path):
        if path not in pool:
            assert path.is_file(), f"Missing Piper pack: {path}"
            pool[path] = json.loads(path.read_text(encoding="utf-8"))
        return pool[path]

    checked = set()
    for slug, utterances in question_pages.items():
        for phrase in utterances:
            if phrase in checked:
                continue
            checked.add(phrase)
            if phrase in original["targets"]:
                links = original["targets"][phrase]
                assert len(links) == 1, f"Compact phrase unexpectedly spans clips: {phrase}"
                rec = original["records"][links[0]["id"]]
                path = EXISTING / rec["pack"]
                clip = pack(path)[rec["id"]]
            else:
                ref = extra["entries"].get(phrase)
                assert ref, f"Missing Piper audio target: {slug}: {phrase}"
                clip = pack(OUT / ref["pack"])[ref["id"]]
            assert clip["text"] == phrase, f"Audio/text mismatch: {slug}: {phrase}"
            assert mp3_valid(clip["audio"]), f"Invalid audio: {slug}: {phrase}"
    print(f"PASS: all 11 compact themes, {sum(map(len, question_pages.values()))} "
          f"questions, {len(checked)} unique Piper clips, "
          f"{len(extra['entries'])} newly synthesized, "
          f"{len(pool)} packs checked", flush=True)


def main():
    cli = argparse.ArgumentParser()
    cli.add_argument("command", choices=["generate", "verify", "audit"])
    cli.add_argument("--model", type=Path)
    args = cli.parse_args()
    if args.command == "audit":
        questions = pages()
        existing = existing_index()
        for slug, rows in questions.items():
            print(f"{slug}: {len(rows)} questions; "
                  f"{sum(s in existing['targets'] for s in rows)} reusable")
        print(f"Unique missing: {len(missing_phrases(questions, existing))}")
    elif args.command == "generate":
        assert args.model and args.model.is_file(), "Piper model missing"
        generate(args.model)
    else:
        verify()


if __name__ == "__main__":
    main()
