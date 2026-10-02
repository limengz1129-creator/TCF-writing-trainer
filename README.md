# TCF Canada 练习入口

点击下方链接即可进入练习网页，无需手动输入网址。

## 五任务表达 · 综合默写

[打开综合练习网页](https://limengz1129-creator.github.io/TCF-writing-trainer/combined-expressions/)

动词搭配 1,042 条、固定句型 322 条、动词固定用法 330 条，共 1,694 条练习。固定句型支持“全部来源”混合练习，也可从下拉菜单选择写作 T1 / T2 / T3、口语 T2 / T3；已合并 49 条重复写法。另含错题本和可导出 Excel 的单词本。

[查看来源与去重对应清单](https://limengz1129-creator.github.io/TCF-writing-trainer/combined-expressions/audit.json)

## EE 写作 · 文章默写

| 练习 | 网页入口 |
| --- | --- |
| 写作 Tâche 1 | [打开段落 / 全文默写](https://limengz1129-creator.github.io/TCF-writing-trainer/tache1/) |
| 写作 Tâche 2 | [打开段落 / 全文默写](https://limengz1129-creator.github.io/TCF-writing-trainer/tache2-ee/) |
| 写作 Tâche 3 | [打开段落 / 全文默写](https://limengz1129-creator.github.io/TCF-writing-trainer/) |

## EE 写作 · 表达默写

每个网页包含动词搭配、固定句型、动词固定用法三个模块，以及错题本。

| 练习 | 网页入口 |
| --- | --- |
| 写作 Tâche 1 | [打开表达默写](https://limengz1129-creator.github.io/TCF-writing-trainer/tache1-expressions/) |
| 写作 Tâche 2 | [打开表达默写](https://limengz1129-creator.github.io/TCF-writing-trainer/tache2-expressions/) |
| 写作 Tâche 3 | [打开表达默写](https://limengz1129-creator.github.io/TCF-writing-trainer/tache3-expressions/) |

## EO 口语 · 稿子 / 提问默写

| 练习 | 网页入口 |
| --- | --- |
| 口语 Tâche 2 | [打开口语提问默写](https://limengz1129-creator.github.io/TCF-writing-trainer/tache2/) |
| 口语 Tâche 3 | [打开九大话题语料默写](https://limengz1129-creator.github.io/TCF-writing-trainer/eo-tache3-corpus/) |

口语 T2 按大主题、子分类和 C 层级题目筛选；看中文，默写法语问题。

口语 T3 汇总 9 份原始语料：9 个大话题、98 个论据子话题、507 个主体论段、169 道原题。可逐论段默写或合练同题三个主体段，包含错题本、选词单词本与 Excel 导出、动词变位提示和差异高亮。

## EO 口语 · 表达默写

看中文，输入法语表达；固定句型与动词固定用法按核心表达核对。

| 练习 | 网页入口 |
| --- | --- |
| 口语 Tâche 2 | [打开表达默写](https://limengz1129-creator.github.io/TCF-writing-trainer/eo-tache2-expressions/) |
| 口语 Tâche 3 | [打开表达默写](https://limengz1129-creator.github.io/TCF-writing-trainer/eo-tache3-expressions/) |

## Piper 法语朗读 · 以后新网页复用

目前 11 个练习网页使用 **Piper · fr_FR-siwis-medium（siwis 法语声音）**。

**这是预先生成音频、网页播放的方案，没有在线 TTS API 接口。下面的播放器和音频索引是静态资源地址，不能把任意新文字传进去直接生成语音。** 以后新网页已有的相同原文可复用音频；新的法语原文需先用 Piper 生成音频并登记索引。

| 资源 | 地址 |
| --- | --- |
| Piper 引擎与 Python API 文档 | https://github.com/OHF-Voice/piper1-gpl |
| 咱们使用的法语模型（含模型、配置和模型说明） | https://huggingface.co/rhasspy/piper-voices/tree/main/fr/fr_FR/siwis/medium |
| 通用网页播放器 | https://limengz1129-creator.github.io/TCF-writing-trainer/piper-player.js |
| 通用音频索引 | https://limengz1129-creator.github.io/TCF-writing-trainer/piper-audio/manifest.json |
| 音频方案、来源授权及重新生成说明 | [piper-audio/README.md](piper-audio/README.md) |
| 批量提取、生成及高亮对齐脚本 | [tools/piper/all/](tools/piper/all/) |
| 综合练习页的原播放器 | [combined-expressions/piper-player.js](combined-expressions/piper-player.js) |
| 综合练习页音频索引 | https://limengz1129-creator.github.io/TCF-writing-trainer/combined-expressions/piper-audio/manifest.json |

以后继续开发时，可直接告诉开发者：“复用本仓库的 Piper 法语 siwis 朗读方案，参考上面这些地址与生成说明。”

通用播放器需要默写框 `#answer` 或 `#answerBox`，并通过 `window.TCF_GRAMMAR_TARGET = () => ({ fr: 当前法语原文 })` 提供朗读内容。引用播放器前先准备这个函数；原文必须与音频索引里的文字完全对应。切换练习时也要通知播放器停止旧音频。综合页使用自己的播放器及索引格式，请参照对应文件。

网页播放不调用付费语音 API，也不需要 API key。模型与数据来源、授权说明见上面的音频 README。

## 进度保存

草稿和练习进度保存在当前浏览器。表达默写网页的进度相互独立；换设备或浏览器前，可使用「导出进度」，再在对应网页「导入进度」。

---

## 原写作 Tâche 3 项目说明

Personal memorization trainer for TCF Canada Expression écrite — Tâche 3.

- 62 final essays from the user's final source document
- paragraph-by-paragraph and full-text recall
- Chinese structural prompts, opening-word prompts, and no-prompt mode
- token-level comparison and similarity score
- local progress markers

The French answers are kept from the final source document without rewriting.
