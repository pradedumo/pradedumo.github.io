// Shared keyboard-focus handling for the site's modal dialogs:
// move focus in on open, keep Tab inside while open, restore focus on close.
window.dialogFocus = (function () {
  const FOCUSABLE =
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const sessions = new WeakMap();

  function visibleFocusables(modal) {
    return Array.from(modal.querySelectorAll(FOCUSABLE)).filter(
      (el) => el.getClientRects().length > 0,
    );
  }

  function open(modal, initialFocus) {
    const opener = document.activeElement;

    function onKeydown(e) {
      if (e.key !== "Tab") return;
      const items = visibleFocusables(modal);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (!modal.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    modal.addEventListener("keydown", onKeydown);
    sessions.set(modal, { opener, onKeydown });
    (initialFocus || visibleFocusables(modal)[0] || modal).focus();
  }

  function close(modal) {
    const session = sessions.get(modal);
    if (!session) return;
    modal.removeEventListener("keydown", session.onKeydown);
    sessions.delete(modal);
    const { opener } = session;
    if (opener && opener !== document.body && document.contains(opener)) {
      opener.focus();
    }
  }

  return { open, close };
})();
