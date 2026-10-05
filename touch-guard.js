'use strict';
(() => {
  const app = document.getElementById('app');
  const clearGameSelection = () => {
    const selection = window.getSelection?.();
    if (selection && !selection.isCollapsed &&
        (app.contains(selection.anchorNode) || app.contains(selection.focusNode))) {
      selection.removeAllRanges();
    }
  };
  for (const name of ['selectstart', 'contextmenu', 'dragstart']) {
    app.addEventListener(name, event => event.preventDefault());
  }
  app.addEventListener('pointerdown', clearGameSelection, {passive: true});
  document.addEventListener('selectionchange', clearGameSelection);
  clearGameSelection();
})();
