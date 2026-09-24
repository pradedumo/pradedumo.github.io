(function () {
  const modal = document.getElementById("qaCaseModal");
  const body = document.getElementById("qaCaseModalBody");
  const title = document.getElementById("qaCaseModalTitle");
  const closeBtn = document.getElementById("qaCaseModalClose");

  if (!modal || !body || !title) return;

  function openCase(el) {
    const templateId = el.dataset.qaCaseDetail;
    const template = templateId ? document.getElementById(templateId) : null;
    if (!template) return;

    body.replaceChildren(template.content.cloneNode(true));
    title.textContent = el.dataset.qaCaseTitle || "QA case study";

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("qa-case-modal-open");
  }

  function closeCase() {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("qa-case-modal-open");
    body.replaceChildren();
  }

  document.querySelectorAll("[data-qa-case-detail]").forEach((el) => {
    el.addEventListener("click", function () {
      openCase(this);
    });
  });

  closeBtn.addEventListener("click", closeCase);

  document.querySelectorAll('[data-close-qa-case="true"]').forEach((el) => {
    el.addEventListener("click", closeCase);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) {
      closeCase();
    }
  });
})();
