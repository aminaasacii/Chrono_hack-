// If an exported asset is unavailable locally, try its temporary Figma URL.
const FIGMA = "https://www.figma.com/api/mcp/asset/7ae6d712-7554-427d-9b85-e61357c356dd/";
document.querySelectorAll("img[data-fb]").forEach((img) => {
  const swap = () => {
    if (!img.src.startsWith(FIGMA)) img.src = FIGMA + img.dataset.fb;
  };
  img.addEventListener("error", swap, { once: true });
  if (img.complete && img.naturalWidth === 0) swap();
});

const toggle = document.querySelector(".nav__toggle");
const links = document.querySelector(".nav__links");
if (toggle && links) {
  const setMenuOpen = (open) => {
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => {
    setMenuOpen(toggle.getAttribute("aria-expanded") !== "true");
  });
  links.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  const navLinks = [...links.querySelectorAll("a:not(.btn)")];
  if ("IntersectionObserver" in window) {
    const observedSections = [
      document.querySelector(".hero"),
      ...["hero","about", "stages", "faq"].map((id) => document.getElementById(id)),
    ].filter(Boolean);
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id || "top";
        navLinks.forEach((link) => {
          const current = link.getAttribute("href") === `#${id}`;
          link.classList.toggle("active", current);
          if (current) link.setAttribute("aria-current", "page");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    observedSections.forEach((section) => spy.observe(section));
  }
}

const targets = document.querySelectorAll(".card, .outcome, .steps li, .mission, details, .facts div");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if ("IntersectionObserver" in window && !reduceMotion) {
  targets.forEach((target) => target.classList.add("reveal"));
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  targets.forEach((target) => revealObserver.observe(target));
}