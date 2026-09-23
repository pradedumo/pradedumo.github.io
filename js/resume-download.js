document.addEventListener("click", function (e) {
  document.querySelectorAll(".resume-download[open]").forEach(function (menu) {
    if (!menu.contains(e.target)) menu.removeAttribute("open");
  });
});
document.querySelectorAll(".resume-menu-panel a").forEach(function (link) {
  link.addEventListener("click", function () {
    const menu = this.closest(".resume-download");
    if (menu) setTimeout(() => menu.removeAttribute("open"), 120);
  });
});
