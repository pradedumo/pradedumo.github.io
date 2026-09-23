(function () {
  const modal = document.getElementById("portfolioVideoModal");
  const frame = document.getElementById("portfolioVideoFrame");
  const title = document.getElementById("portfolioVideoTitle");
  const original = document.getElementById("portfolioVideoOriginal");
  const closeBtn = document.getElementById("portfolioVideoClose");

  if (!modal || !frame || !title || !original) return;

  function openVideo(el) {
    frame.src = el.dataset.videoEmbed;
    title.textContent = el.dataset.videoTitle || "Portfolio video";
    original.href = el.dataset.videoLink || el.href;

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("video-modal-open");
  }

  function closeVideo() {
    frame.src = "about:blank";
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("video-modal-open");
  }

  document.querySelectorAll('[data-portfolio-video="true"]').forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      openVideo(this);
    });
  });

  closeBtn.addEventListener("click", closeVideo);

  document.querySelectorAll('[data-close-video="true"]').forEach((el) => {
    el.addEventListener("click", closeVideo);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) {
      closeVideo();
    }
  });
})();
