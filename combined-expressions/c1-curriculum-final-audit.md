# C1 语法专项训练 · 35 模块最终审计

审计日期：2026-10-04

## 结论

- 35 / 35 课程模块均已建立，无缺号。
- 四阶段课程地图完整：第一阶段高频扣分底盘、第二阶段复杂句控制、第三阶段稳定 C1、第四阶段低成本补齐。
- A+ / A 模块按完整母版建设；B / B+ 模块已补充到考试实用深度；C / D 模块保持低成本覆盖。
- 原有 8 个专项没有删除，可继续从新课程模块进入旧专项词条库。
- 课程脚本静态语法检查通过，加载顺序正确。
- 首页入口显示为“C1 语法专项训练 · 35 个模块”。

## 171 条口语错题本核对

源文件统计：
- 审核练习：171 条
- 明确语言错误发生次数：1431
- 去重错误模式：1127
- 涉及错误的练习：170
- 高优先级错误模式：22
- 固定搭配模式：168
- 171 / 171 已审核

高优先级模式中，语法/结构相关模式已映射到课程模块；纯词汇问题不强行塞入语法课。

已确认覆盖的核心个人错误包括：
- 主谓一致：复数主语 / 单数主语
- 情态动词 + infinitif
- savoir + infinitif
- sur le marché du travail
- rendre quelqu’un + adjectif
- beaucoup de / beaucoup d’
- faire connaissance avec
- aider quelqu’un à faire
- permettre à quelqu’un de faire
- À mes yeux
- avoir tendance à
- Comme nous le savons
- jeux de hasard
- participer à + nom
- apprendre à quelqu’un à faire
- encourager quelqu’un à faire
- en ligne / sur Internet
- 修饰动词用副词
- certaines personnes
- vie quotidienne

纯词汇型高频错误（例如 celebrity → célébrité）继续保留在词汇/错题体系，不重复塞入语法课程。

## 最终补漏

最终审计新增或加强：
- #2 rendre quelqu’un + adjectif
- #3 beaucoup d’argent
- #6 d’autres
- #8 apprendre à quelqu’un à faire / encourager quelqu’un à faire / prendre conscience / faire la sieste / rester en bonne santé / être confronté à / assumer sa responsabilité
- #10 outil / informations / personnes 的性数与一致
- #13 il ne faut pas oublier que
- #16 il serait + adjectif
- #20 participer à / à la télévision / à l’étranger / sur notre planète / de seconde main
- #23 il ne faut pas oublier 的否定语序
- #27 Comme nous le savons

## 网页 QA

静态检查：
- c1-curriculum.js：OK
- c1-curriculum-rest.js：OK
- c1-curriculum-enrich.js：OK
- c1-curriculum-polish.js：OK
- c1-curriculum-audit-fixes.js：OK

加载顺序：
1. c1-curriculum.js
2. c1-curriculum-rest.js
3. c1-curriculum-enrich.js
4. c1-curriculum-polish.js
5. c1-curriculum-audit-fixes.js

现有功能保留：
- 35 模块课程地图
- 四阶段分组
- A+/A/B/C/D 优先级
- 法语朗读
- 我的真实错题
- Tâche 2 / Tâche 3 语料
- 可迁移句型骨架
- 分层训练
- 掌握度勾选
- “开始 / 继续本阶段”
- 阶段掌握进度
- 原有专项词条库衔接

## 封版判断

课程结构与内容层面：可以封版。

后续如继续修改，建议只做：
1. 用户实际学习中发现的具体错误修正；
2. 个别例句替换为更合适的个人语料；
3. UI 小调整；
4. 新错题增量同步。

不建议再扩展新的语法主模块。
