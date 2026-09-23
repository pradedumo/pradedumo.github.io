(function () {
  const slides = [...document.querySelectorAll(".testimonial-slide")];
  const progress = document.getElementById("testimonialProgress");
  const current = document.getElementById("testimonialCurrent");
  const prev = document.getElementById("testimonialPrev");
  const next = document.getElementById("testimonialNext");
  const section = document.getElementById("testimonials");
  if (!slides.length || !progress || !current) return;

  let index = 0;
  let timer = null;
  const duration = 8000;

  function setProgress() {
    progress.style.transition = "none";
    if (window.matchMedia("(max-width:650px)").matches) {
      progress.style.width = "0%";
      progress.style.height = "100%";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          progress.style.transition = `width ${duration}ms linear`;
          progress.style.width = "100%";
        });
      });
    } else {
      progress.style.height = "0%";
      progress.style.width = "100%";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          progress.style.transition = `height ${duration}ms linear`;
          progress.style.height = "100%";
        });
      });
    }
  }

  function show(i, restart = true) {
    index = (i + slides.length) % slides.length;
    slides.forEach((slide, n) => {
      const active = n === index;
      slide.classList.toggle("active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
    });
    current.textContent = String(index + 1).padStart(2, "0");
    setProgress();
    if (restart) start();
  }

  function start() {
    clearInterval(timer);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer = setInterval(() => show(index + 1, false), duration);
  }

  prev?.addEventListener("click", () => show(index - 1));
  next?.addEventListener("click", () => show(index + 1));

  section?.addEventListener("mouseenter", () => clearInterval(timer));
  section?.addEventListener("mouseleave", start);
  section?.addEventListener("focusin", () => clearInterval(timer));
  section?.addEventListener("focusout", start);

  window.addEventListener("resize", setProgress);
  show(0);
})();
