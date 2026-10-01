# Piper French audio

All 1,743 combined practice records have pre-generated MP3 audio using fr_FR-siwis-medium (22,050 Hz). Original text, grading, and progress are unchanged. Playback requires no TTS key or service.

Model: https://huggingface.co/rhasspy/piper-voices/tree/main/fr/fr_FR/siwis/medium
SIWIS dataset: https://datashare.is.ed.ac.uk/handle/10283/2353 (CC BY 4.0, per voice model card).
Engine: https://github.com/OHF-Voice/piper1-gpl

The existing ONNX /Ceil_output_0 duration tensor was exposed as a second output, preserving synthesis weights. Phoneme durations multiplied by hop length provide timings. Word highlighting is used when whitespace-separated phoneme groups match text words (1,469 records). Otherwise the expression is highlighted as a whole (274 records). MP3/browser playback may introduce a small timing offset.

Rebuild script: tools/piper/generate.py. Requires Linux libseccomp, piper-tts 1.8.0, onnxruntime 1.30.0, ONNX and FFmpeg. Network syscalls are denied before runtime imports. Place combined-expressions/data.js beside the script and the downloaded siwis model as aligned.onnx with its JSON configuration. Append FLOAT [1,1,None] graph output /Ceil_output_0 using ONNX first. Run the generator and publish the validated packs and manifest. Completed packs resume; remove old packs when modifying text or voice. Weights are not committed.
