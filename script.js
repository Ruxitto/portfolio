// ---------- Reveal on scroll ----------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  // slight stagger for elements that share a parent
  el.style.transitionDelay = `${(i % 4) * 0.06}s`;
  io.observe(el);
});

// ---------- Nav background on scroll ----------
const nav = document.getElementById("nav");
const onScroll = () => {
  nav.classList.toggle("is-scrolled", window.scrollY > window.innerHeight * 0.6);
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// ---------- Spotlight follows cursor ----------
const spot = document.querySelector(".spotlight");
let raf = null;
window.addEventListener("pointermove", (e) => {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    spot.style.setProperty("--mx", e.clientX + "px");
    spot.style.setProperty("--my", e.clientY + "px");
    raf = null;
  });
});

// ---------- Smooth anchor scroll (respects reduced motion) ----------
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
});
