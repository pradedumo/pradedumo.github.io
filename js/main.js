const reveals = document.querySelectorAll(".reveal");
const ro = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        ro.unobserve(e.target);
      }
    }),
  { threshold: 0.12 },
);
reveals.forEach((e) => ro.observe(e));
const track = document.getElementById("wordTrack");
let wi = 0;
setInterval(() => {
  wi = (wi + 1) % 3;
  track.style.transform = `translateY(-${wi * 1.02}em)`;
}, 2400);
const nav = document.getElementById("navPill"),
  toggle = document.getElementById("navToggle");
function setMobileNav(open) {
  nav.classList.toggle("mobile-open", open);
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  toggle.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
}
function updNav() {
  if (innerWidth > 900) {
    setMobileNav(false);
    nav.classList.toggle("compact", scrollY > 180);
  } else {
    nav.classList.remove("compact");
  }
}
addEventListener("scroll", updNav, { passive: true });
addEventListener("resize", updNav);
updNav();
toggle.addEventListener("click", () => {
  if (innerWidth <= 900) setMobileNav(!nav.classList.contains("mobile-open"));
  else nav.classList.toggle("compact");
});
nav.querySelectorAll(".nav-links a,.nav-cta,.brand").forEach((link) =>
  link.addEventListener("click", () => {
    if (innerWidth <= 900) setMobileNav(false);
  }),
);
document.addEventListener("click", (e) => {
  if (
    innerWidth <= 900 &&
    nav.classList.contains("mobile-open") &&
    !nav.contains(e.target)
  )
    setMobileNav(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMobileNav(false);
});
nav.addEventListener("mouseenter", () => {
  if (innerWidth > 900) nav.classList.remove("compact");
});
nav.addEventListener("mouseleave", () => {
  if (innerWidth > 900 && scrollY > 180) nav.classList.add("compact");
});
const workOptions = [...document.querySelectorAll(".work-option")];
const workScenes = [...document.querySelectorAll(".work-scene")];

function activateWork(index) {
  workOptions.forEach((option, i) => {
    const active = i === index;
    option.classList.toggle("active", active);
    option.setAttribute("aria-pressed", active ? "true" : "false");
  });
  workScenes.forEach((scene, i) => {
    scene.classList.toggle("active", i === index);
  });
}
workOptions.forEach((option, i) => {
  option.setAttribute("aria-pressed", i === 0 ? "true" : "false");
  option.addEventListener("click", () => activateWork(i));
});
activateWork(0);
const vs = document.querySelector(".video-section"),
  vf = document.getElementById("videoFrame");
function updateVideo() {
  if (!vf) return;
  vf.style.removeProperty("width");
  vf.style.removeProperty("border-radius");
}
addEventListener("resize", updateVideo);
updateVideo();
const tw = document.getElementById("timelineWrap"),
  tp = document.getElementById("timelineProgress");
function updateTimeline() {
  const r = tw.getBoundingClientRect(),
    start = innerHeight * 0.45,
    p = Math.min(
      Math.max((start - r.top) / (r.height + start - innerHeight * 0.35), 0),
      1,
    );
  tp.style.height = p * 100 + "%";
}
addEventListener("scroll", updateTimeline, { passive: true });
updateTimeline();
