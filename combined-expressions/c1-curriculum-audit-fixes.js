'use strict';
(()=>{
 const C=window.C1_COURSE;if(!C)return;
 const L=C.LESSONS;
 const push=(arr,item,key)=>{if(!arr.some(x=>key(x)===key(item)))arr.push(item);};
 const addErr=(n,bad,good,why)=>L[n]&&push(L[n].errors,{bad,good,why},x=>x.bad+'|'+x.good);
 const addLesson=(n,h,b,ex)=>L[n]&&push(L[n].lessons,{h,b,ex},x=>x.h);
 const addFrame=(n,a,b)=>L[n]&&push(L[n].frames,[a,b],x=>x[0]+'|'+x[1]);
 const addPractice=(n,level,q,a,note)=>L[n]&&push(L[n].practice,{level,q,a,note},x=>x.level+'|'+x.q);

 // High-frequency patterns from the 171-entry oral error notebook that were still underrepresented.
 addLesson(2,'8. rendre quelqu’un + adjectif：形容词与宾语配合','rendre + COD + adjectif 中，形容词描述宾语，因此要与宾语性数配合。','Cela peut rendre les jeunes plus motivés et plus autonomes.');
 addErr(2,'nous rendre plus motivant','nous rendre plus motivés','rendre quelqu’un + adjectif；形容词描述 nous，对应复数。');
 addFrame(2,'rendre + quelqu’un + adjectif','rendre les jeunes plus motivés');
 addPractice(2,'Level 2 · 改错','Cela peut nous rendre plus motivant.','Cela peut nous rendre plus motivés.','形容词与 nous 的复数意义配合。');

 addLesson(8,'7. apprendre / encourager + personne + à + infinitif','这两个高频动词都要保留“人 + à + 动词原形”的结构。','apprendre aux jeunes à devenir autonomes · encourager les personnes à participer');
 addLesson(8,'8. prendre conscience de 是固定结构','不能说 prendre la conscience；后面通常接 de + nom 或 que + proposition。','prendre conscience du problème · prendre conscience que…');
 addFrame(8,'apprendre à quelqu’un à + infinitif','apprendre aux jeunes à devenir autonomes');
 addFrame(8,'encourager quelqu’un à + infinitif','encourager les personnes à participer');
 addFrame(8,'prendre conscience de + nom','prendre conscience du problème');
 addErr(8,'éduquer les jeunes de devenir','apprendre aux jeunes à devenir','若表达“教某人学会做……”，使用 apprendre à quelqu’un à faire。');
 addErr(8,'encouragent aux personnes de…','encouragent les personnes à…','encourager quelqu’un à + infinitif。');
 addErr(8,'prendre la conscience','prendre conscience','固定表达不加冠词 la。');

 addLesson(20,'7. 一组你反复错的地点 / 媒体 / 时间介词块','这些表达最适合整块自动化，不值得每次临场推导。','à la télévision · à l’étranger · sur notre planète · au bureau · dans une salle de sport · à long terme · de seconde main');
 addFrame(20,'participer à + nom','participer à des activités bénévoles');
 addFrame(20,'à la télévision','regarder une émission à la télévision');
 addFrame(20,'à l’étranger','vivre / étudier à l’étranger');
 addFrame(20,'sur notre planète','protéger la vie sur notre planète');
 addFrame(20,'de seconde main','acheter des vêtements de seconde main');
 addErr(20,'participent de bénévolat','participent à des activités bénévoles','participer à + nom。');
 addErr(20,'sur les télévisions / sur télévision','à la télévision','固定表达 à la télévision。');
 addErr(20,'vivre à étranger',"vivre à l’étranger","固定表达 à l’étranger。");
 addErr(20,'dans notre planète','sur notre planète','在“地球上”使用 sur。');
 addErr(20,'en seconde main','de seconde main','固定表达 de seconde main。');
 addPractice(20,'Level 2 · 语块','参加志愿活动','participer à des activités bénévoles','participer à + nom。');

 addLesson(27,'6. Comme nous le savons：代词顺序固定','这一表达要整体记忆，不能说 Comme le nous savons。','Comme nous le savons, la technologie joue un rôle important dans notre vie quotidienne.');
 addErr(27,'Comme le nous savons','Comme nous le savons','COD le 放在动词 savons 前，但主语 nous 必须先出现。');
 addFrame(27,'Comme nous le savons, + proposition','Comme nous le savons, cette question est complexe.');
 addPractice(27,'Level 2 · 改错','Comme le nous savons…','Comme nous le savons…','固定语序。');

 addErr(3,"beaucoup de l’argent","beaucoup d’argent","数量表达 beaucoup de 后直接接名词。");
 addPractice(3,'Level 2 · 改错',"beaucoup de l’argent","beaucoup d’argent","数量表达后去掉冠词。");

 addLesson(6,'7. d’autres 已经包含 de + autres','不能再在前面重复一个 de。','d’autres personnes · d’autres solutions');
 addErr(6,"de d’autres personnes","d’autres personnes","d’autres 已经是完整形式。");

 addLesson(10,'7. 名词性别和数也会连锁影响主谓一致','工具、信息、人物等词一旦性数判断错误，会同时带错冠词、形容词和动词。','un outil indispensable et crucial · les informations officielles · deux personnes qui sont très différentes');
 addErr(10,'une outil indispensable et cruciale','un outil indispensable et crucial','outil 为阳性单数。');
 addErr(10,'deux personnes qui est très différente','deux personnes qui sont très différentes','先行词 personnes 为复数。');

 addLesson(23,'7. il ne faut pas oublier：否定词位置固定','ne 在 faut 前，pas 紧跟 faut；后面的 oublier 保持不定式。','Il ne faut pas oublier que…');
 addErr(23,'il ne faut oublier pas','il ne faut pas oublier','否定围绕变位动词 faut。');
 addFrame(23,'Il ne faut pas oublier que + proposition','Il ne faut pas oublier que chaque situation est différente.');

 addLesson(13,'7. il ne faut pas oublier que：高频论证提醒结构','用于补充一个不能忽略的限制或事实，适合 Tâche 3。','Il ne faut pas oublier que cette solution présente aussi certaines limites.');
 addFrame(13,'Il ne faut pas oublier que + indicatif','Il ne faut pas oublier que…');

 addLesson(16,'7. il serait + adjectif：条件式表达较柔和判断','表达“会很难 / 会更好”等假设判断时，serait 要和假设框架一致。','Il serait difficile de trouver une solution parfaite.');
 addErr(16,'il sera difficile（假设语境）','il serait difficile','假设/委婉判断中使用 conditionnel présent。');

 addLesson(8,'9. 一批值得整体记忆的固定表达','这些都是错题本里重复出现的语块，建议直接按完整表达存储。','faire la sieste · rester en bonne santé · être confronté à · assumer sa responsabilité');
 addFrame(8,'faire la sieste','faire une courte sieste');
 addFrame(8,'rester en bonne santé','faire du sport pour rester en bonne santé');
 addFrame(8,'être confronté à + nom','être confronté à des difficultés');
 addFrame(8,'assumer sa responsabilité','chacun doit assumer sa responsabilité');

 setTimeout(()=>C.injectMap(),0);
})();