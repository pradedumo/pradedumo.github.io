(function () {
  // --- Filter chips -------------------------------------------------------
  const buttons = document.querySelectorAll("[data-gallery-filter]");
  const items = document.querySelectorAll("[data-gallery-type]");

  function applyFilter(filter) {
    items.forEach((item) => {
      const types = (item.dataset.galleryType || "").split(/\s+/);
      const show =
        filter === "all" || types.includes("all") || types.includes(filter);
      item.classList.toggle("is-filtered-out", !show);
    });
    buttons.forEach((b) =>
      b.classList.toggle("is-active", b.dataset.galleryFilter === filter),
    );
  }

  buttons.forEach((b) =>
    b.addEventListener("click", () => applyFilter(b.dataset.galleryFilter)),
  );

  // --- Image lightbox (spec work before/after) ----------------------------
  const modal = document.getElementById("portfolioImageModal");
  const frame = document.getElementById("portfolioImageFrame");
  const title = document.getElementById("portfolioImageTitle");
  const brief = document.getElementById("portfolioImageBrief");
  const closeBtn = document.getElementById("portfolioImageClose");

  if (!modal || !frame || !title || !brief) return;

  function openImage(el) {
    frame.src = el.dataset.imageSrc || el.href;
    frame.alt = el.dataset.imageTitle || "";
    title.textContent = el.dataset.imageTitle || "Spec creative";
    brief.textContent = el.dataset.imageBrief || "";
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("image-modal-open");
  }

  function closeImage() {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("image-modal-open");
    frame.removeAttribute("src");
  }

  document.querySelectorAll('[data-portfolio-image="true"]').forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      openImage(this);
    });
  });

  closeBtn.addEventListener("click", closeImage);
  document
    .querySelectorAll('[data-close-image="true"]')
    .forEach((el) => el.addEventListener("click", closeImage));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeImage();
  });
})();
