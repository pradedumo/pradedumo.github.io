(function () {
  const carousel = document.getElementById("qaCaseCarousel");
  const track = document.getElementById("qaCaseCarouselTrack");
  const dotsWrap = document.getElementById("qaCaseCarouselDots");
  const prevBtn = document.getElementById("qaCasePrev");
  const nextBtn = document.getElementById("qaCaseNext");

  if (!carousel || !track || !dotsWrap || !prevBtn || !nextBtn) return;

  const slides = Array.from(track.querySelectorAll(".qa-case-slide"));
  const dots = Array.from(dotsWrap.querySelectorAll("button"));
  const total = slides.length;
  if (!total) return;

  let current = 0;
  let timer = null;

  function positionFor(index) {
    const diff = (index - current + total) % total;
    if (diff === 0) return "active";
    if (diff === 1) return "next";
    if (diff === total - 1) return "prev";
    return "hidden";
  }

  function render() {
    slides.forEach((slide, index) => {
      slide.setAttribute("data-position", positionFor(index));
    });

    dots.forEach((dot, index) => {
      dot.setAttribute("aria-selected", index === current ? "true" : "false");
    });

    const active = slides[current];
    if (active) {
      track.style.height = active.offsetHeight + "px";
    }
  }

  function goTo(index) {
    current = ((index % total) + total) % total;
    render();
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function startAuto() {
    stopAuto();
    timer = setInterval(next, 6000);
  }

  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  prevBtn.addEventListener("click", () => {
    prev();
    startAuto();
  });

  nextBtn.addEventListener("click", () => {
    next();
    startAuto();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goTo(parseInt(dot.dataset.slideIndex, 10));
      startAuto();
    });
  });

  slides.forEach((slide, index) => {
    slide.addEventListener("click", (e) => {
      if (slide.getAttribute("data-position") === "active") return;
      e.preventDefault();
      goTo(index);
      startAuto();
    });
  });

  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prev();
      startAuto();
    } else if (e.key === "ArrowRight") {
      next();
      startAuto();
    }
  });

  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);

  let resizeTimer = null;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(render, 150);
  });

  render();
  startAuto();
})();
