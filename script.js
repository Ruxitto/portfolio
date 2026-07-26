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
  const isMobile = window.matchMedia("(max-width: 720px), (pointer: coarse)").matches;

  if (isMobile) {
    // Mobile: no hover — gently fade the whole hero to the art photo after 2s.
    setTimeout(() => hero.classList.add("is-art"), 4000);
  } else {
    // Desktop: wavy cursor lens reveals the painting.
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
}

// ---------- Works modal: coverflow slider ----------
const WORKS = {
  illustration: {
    title: "Illustration",
    files: ["57334","52045","94389","23467","83042","37875","21294","39594","60132","71817","14444","32793","99269"],
  },
  photo: {
    title: "Photo Manipulation",
    files: ["60256","49100","45713","71541","75614","95770","8833","93802","12297","84899"],
  },
  graphic: {
    title: "Graphic Design",
    files: ["25622","22489","16710","88666","48219","37102","45973","53341","57136","60873"],
  },
};

const modal = document.getElementById("worksModal");
if (modal) {
  const stage = modal.querySelector(".flow__stage");
  const titleEl = modal.querySelector(".modal__title");
  const countEl = modal.querySelector(".flow__count");
  const flow = modal.querySelector(".flow");
  let slides = [], active = 0, lastFocus = null;

  const layout = () => {
    slides.forEach((s, i) => {
      const off = i - active;
      const abs = Math.min(Math.abs(off), 4);
      const sign = Math.sign(off);
      const tx = off * 40;
      const tz = -abs * 155;
      const ry = -sign * (off === 0 ? 0 : 44);
      s.style.transform =
        `translate(-50%, -50%) translateX(${tx}%) translateZ(${tz}px) rotateY(${ry}deg)`;
      s.style.zIndex = String(120 - Math.abs(off));
      s.style.opacity = Math.abs(off) > 4 ? "0" : "1";
      s.style.pointerEvents = Math.abs(off) > 4 ? "none" : "auto";
      s.classList.toggle("is-active", off === 0);
    });
    if (slides.length) countEl.textContent = `${active + 1} / ${slides.length}`;
  };
  const go = (dir) => {
    active = Math.max(0, Math.min(slides.length - 1, active + dir));
    layout();
  };
  const openModal = (cat) => {
    const data = WORKS[cat];
    if (!data) return;
    lastFocus = document.activeElement;
    active = 0;
    titleEl.textContent = data.title;
    stage.innerHTML = "";
    slides = data.files.map((f, i) => {
      const slide = document.createElement("div");
      slide.className = "flow__slide";
      const img = document.createElement("img");
      img.src = `works/${f}.jpg`;
      img.alt = `${data.title} — work ${i + 1}`;
      img.loading = "lazy";
      slide.appendChild(img);
      slide.addEventListener("click", () => {
        if (i !== active) { active = i; layout(); }
      });
      stage.appendChild(slide);
      return slide;
    });
    layout();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal__close").focus();
  };
  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };

  document.querySelectorAll(".cat[data-cat]").forEach((cat) => {
    const trigger = () => openModal(cat.getAttribute("data-cat"));
    cat.addEventListener("click", trigger);
    cat.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); trigger(); }
    });
  });
  modal.querySelectorAll("[data-close]").forEach((el) =>
    el.addEventListener("click", closeModal)
  );
  modal.querySelectorAll(".flow__arrow").forEach((b) =>
    b.addEventListener("click", () => go(parseInt(b.dataset.dir, 10)))
  );
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("is-open")) return;
    if (e.key === "Escape") closeModal();
    else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
  });

  // drag / swipe
  let sx = 0, dragging = false;
  flow.addEventListener("pointerdown", (e) => { dragging = true; sx = e.clientX; });
  window.addEventListener("pointerup", (e) => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
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
