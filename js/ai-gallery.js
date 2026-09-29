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
  const kicker = document.getElementById("portfolioImageKicker");
  const title = document.getElementById("portfolioImageTitle");
  const brief = document.getElementById("portfolioImageBrief");
  const closeBtn = document.getElementById("portfolioImageClose");

  if (!modal || !frame || !title || !brief) return;

  function openImage(el) {
    frame.src = el.dataset.imageSrc || el.href;
    frame.alt = el.dataset.imageTitle || "";
    title.textContent = el.dataset.imageTitle || "Spec creative";
    brief.textContent = el.dataset.imageBrief || "";
    if (kicker) kicker.textContent = el.dataset.imageKicker || "Spec work";
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("image-modal-open");
  }

  function closeImage() {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("image-modal-open");
    frame.removeAttribute("src");
    // Clear a deep-link hash (e.g. #lean) so closing doesn't leave it stuck.
    const linked = document.getElementById(location.hash.slice(1));
    if (linked && linked.dataset.portfolioImage === "true") {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }

  // Deep links: https://pradedumo.github.io/#lean opens that spec tile's
  // lightbox directly. Any [data-portfolio-image] tile with an id works.
  function openFromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const el = document.getElementById(id);
    if (!el || el.dataset.portfolioImage !== "true") return;
    el.scrollIntoView({ block: "center" });
    openImage(el);
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

  addEventListener("hashchange", openFromHash);
  openFromHash();
})();
