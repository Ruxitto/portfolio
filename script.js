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

// ---------- Hero: wavy cursor lens reveals the painting ----------
const hero = document.getElementById("hero");
const flood = hero && hero.querySelector(".hero__flood");
if (hero && flood) {
  // Organic wavy blob used as the reveal mask.
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>" +
    "<path fill='white' d='M84.5,29.15 Q100,12 115.5,29.15 Q131,46.3 153.6,51.15 " +
    "Q176.2,56 169.1,78 Q162,100 169.1,122 Q176.2,144 153.6,148.85 " +
    "Q131,153.7 115.5,170.85 Q100,188 84.5,170.85 Q69,153.7 46.4,148.85 " +
    "Q23.8,144 30.9,122 Q38,100 30.9,78 Q23.8,56 46.4,51.15 Q69,46.3 84.5,29.15 Z'/></svg>";
  const uri = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  flood.style.webkitMaskImage = uri;
  flood.style.maskImage = uri;

  let tx = 0, ty = 0, cx = 0, cy = 0, loop = null, inside = false;
  const follow = () => {
    cx += (tx - cx) * 0.2;
    cy += (ty - cy) * 0.2;
    hero.style.setProperty("--mx", cx + "px");
    hero.style.setProperty("--my", cy + "px");
    if (Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4) {
      loop = requestAnimationFrame(follow);
    } else {
      loop = null;
    }
  };
  hero.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    const r = hero.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
    if (!inside) {
      inside = true;
      cx = tx; cy = ty;
      hero.classList.add("is-hovering");
    }
    if (!loop) loop = requestAnimationFrame(follow);
  });
  hero.addEventListener("pointerleave", () => {
    inside = false;
    hero.classList.remove("is-hovering");
  });
}

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
