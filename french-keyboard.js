/* Shared French typing controls. Keeps existing grading and draft listeners. */
(() => {
  'use strict';
  function init() {
    const answer = document.getElementById('answer') || document.getElementById('answerBox');
    const clear = document.getElementById('clear') || document.getElementById('clearBtn');
    if (!answer || !clear || document.querySelector('.fr-keyboard')) return;
    const navigation = ['prev', 'prevBtn', 'prevTopic', 'nextSegmentBtn', 'next', 'nextBtn', 'nextTopic']
      .map(id => document.getElementById(id)).filter(Boolean);
    const oldRows = [...new Set(navigation.map(button => button.parentElement))];
    clear.after(...navigation);
    clear.parentElement.classList.add('fr-answer-actions');
    oldRows.forEach(row => {
      if (row !== clear.parentElement && !row.children.length && !row.textContent.trim()) row.remove();
    });
    const style = document.createElement('style');
    style.textContent = `.fr-answer-actions{display:flex;flex-wrap:wrap;align-items:center;gap:9px}.fr-keyboard{box-sizing:border-box;width:100%;margin:10px 0 14px;padding:10px;border:1px solid #d8dce7;border-radius:12px;background:#f7f8fc}.fr-keyboard-label{font-size:13px;color:#526078;margin-bottom:7px}.fr-keyboard-keys{display:flex;flex-wrap:wrap;gap:6px}.fr-keyboard button{box-sizing:border-box;min-width:38px;min-height:38px;padding:5px 10px;margin:0;border:1px solid #cbd2df;border-radius:8px;background:#fff;color:#24324b;font-size:17px;line-height:1.4;cursor:pointer}.fr-keyboard button:hover{background:#eef0ff;border-color:#7f85ce}.fr-keyboard button:focus-visible{outline:3px solid #797ed5;outline-offset:2px}.fr-keyboard .fr-case{font-size:13px}.fr-keyboard .fr-case[aria-pressed=true]{background:#e6e8ff}@media(max-width:480px){.fr-keyboard{padding:8px}.fr-keyboard-keys{gap:5px}.fr-keyboard button{min-width:36px;padding:5px 8px}.fr-answer-actions>button{max-width:100%}}`;
    document.head.appendChild(style);
    const keyboard = document.createElement('div');
    keyboard.className = 'fr-keyboard';
    keyboard.setAttribute('role', 'group');
    keyboard.setAttribute('aria-label', '法语特殊字符键盘');
    const label = document.createElement('div');
    label.className = 'fr-keyboard-label';
    label.textContent = '法语特殊字符 · 点击插入光标位置';
    const keys = document.createElement('div');
    keys.className = 'fr-keyboard-keys';
    keyboard.append(label, keys);
    let uppercase = false;
    const letters = Array.from('àâæçéèêëîïôœùûüÿ’');
    const buttons = letters.map(letter => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = letter;
      button.title = '插入 ' + letter;
      button.addEventListener('pointerdown', event => event.preventDefault());
      button.addEventListener('click', () => {
        if (answer.disabled || answer.readOnly) return;
        const character = uppercase ? letter.toUpperCase() : letter;
        const start = answer.selectionStart, end = answer.selectionEnd;
        if (answer.maxLength >= 0 && answer.value.length - (end - start) + character.length > answer.maxLength) return;
        answer.setRangeText(character, start, end, 'end');
        answer.focus({preventScroll: true});
        answer.dispatchEvent(new Event('input', {bubbles: true}));
      });
      keys.appendChild(button);
      return button;
    });
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'fr-case';
    toggle.textContent = '大写';
    toggle.setAttribute('aria-pressed', 'false');
    toggle.addEventListener('pointerdown', event => event.preventDefault());
    toggle.addEventListener('click', () => {
      uppercase = !uppercase;
      toggle.setAttribute('aria-pressed', String(uppercase));
      toggle.textContent = uppercase ? '小写' : '大写';
      buttons.forEach((button, i) => {
        button.textContent = uppercase ? letters[i].toUpperCase() : letters[i];
        button.title = '插入 ' + button.textContent;
      });
    });
    keys.appendChild(toggle);
    answer.after(keyboard);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true});
  else init();
})();
