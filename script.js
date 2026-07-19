/* ==========================================================================
   SWICHH — Case Study interactions
   Sections:
     1. Lenis smooth scroll
     2. GSAP scroll reveal
     3. Navbar glass state + mobile toggle
     4. Liquid fill progress bar
     5. Fizz / carbonation canvas (hero)
     6. Button ripple
     7. Lightbox
     8. Philosophy line-by-line reveal
     9. Liquid Glass specular highlight (cursor-tracked)
     10. Download assets action
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------------------------------------------------
     1. LENIS SMOOTH SCROLL
  --------------------------------------------------------------------- */
  let lenis;
  if (window.Lenis) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (window.gsap && window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  // in-page nav links should still work smoothly with lenis
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          if (lenis) lenis.scrollTo(target, { offset: -40 });
          else target.scrollIntoView({ behavior: "smooth" });
          closeMobileNav();
        }
      }
    });
  });

  /* ---------------------------------------------------------------------
     2. GSAP SCROLL REVEAL
  --------------------------------------------------------------------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // generic fade-up reveal for anything with .reveal-up
    gsap.utils.toArray(".reveal-up").forEach((el, i) => {
      const delay = el.dataset.delay ? parseFloat(el.dataset.delay) * 0.12 : 0;
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });
    });

    // hero content plays immediately on load (not scroll-triggered)
    gsap.to(".hero .reveal-up", {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: "power3.out",
      stagger: 0.12,
      delay: 0.2,
    });

    // philosophy lines
    gsap.utils.toArray(".p-line").forEach((line) => {
      gsap.to(line, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: line,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    });

    // hero background blobs — gentle parallax on scroll
    gsap.to(".blob-a", { y: 120, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".blob-b", { y: -80, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".blob-c", { y: 60, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    // mockup frames slight scale-parallax as they enter
    gsap.utils.toArray(".mockup-frame").forEach((frame) => {
      gsap.fromTo(
        frame,
        { scale: 0.92, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: frame, start: "top 85%", toggleActions: "play none none reverse" },
        }
      );
    });
  }

  /* ---------------------------------------------------------------------
     3. NAVBAR STATE + MOBILE TOGGLE
  --------------------------------------------------------------------- */
  const nav = document.getElementById("siteNav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  function onScrollNav() {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  function closeMobileNav() {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  /* ---------------------------------------------------------------------
     4. LIQUID FILL PROGRESS BAR
  --------------------------------------------------------------------- */
  const fillLiquid = document.getElementById("fillLiquid");
  function updateFill() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    fillLiquid.style.width = pct + "%";
  }
  updateFill();
  window.addEventListener("scroll", updateFill, { passive: true });
  window.addEventListener("resize", updateFill);

  /* ---------------------------------------------------------------------
     5. FIZZ / CARBONATION CANVAS (hero only, mouse reactive)
  --------------------------------------------------------------------- */
  const canvas = document.getElementById("fizzCanvas");
  const heroSection = document.getElementById("hero");
  if (canvas && heroSection && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ctx = canvas.getContext("2d");
    let w, h, bubbles = [];
    const BUBBLE_COUNT = 46;
    let mouse = { x: null, y: null };

    function resize() {
      w = canvas.width = heroSection.offsetWidth;
      h = canvas.height = heroSection.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function makeBubble() {
      return {
        x: Math.random() * w,
        y: h + Math.random() * 100,
        r: Math.random() * 2.4 + 0.6,
        speed: Math.random() * 0.6 + 0.25,
        drift: Math.random() * 0.6 - 0.3,
        alpha: Math.random() * 0.4 + 0.15,
      };
    }
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const b = makeBubble();
      b.y = Math.random() * h;
      bubbles.push(b);
    }

    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    heroSection.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });

    function tick() {
      ctx.clearRect(0, 0, w, h);
      bubbles.forEach((b) => {
        // gentle mouse repulsion for a "disturbed fizz" feel
        if (mouse.x !== null) {
          const dx = b.x - mouse.x;
          const dy = b.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            const force = (90 - dist) / 90;
            b.x += (dx / dist) * force * 2.2;
            b.y += (dy / dist) * force * 2.2;
          }
        }
        b.y -= b.speed;
        b.x += b.drift * 0.2;
        if (b.y < -10) Object.assign(b, makeBubble(), { y: h + 10 });

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,255,82,${b.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ---------------------------------------------------------------------
     6. BUTTON RIPPLE
  --------------------------------------------------------------------- */
  document.querySelectorAll("[data-ripple]").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  /* ---------------------------------------------------------------------
     7. LIGHTBOX
  --------------------------------------------------------------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  document.querySelectorAll("[data-lightbox-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      lightboxCaption.textContent = trigger.dataset.caption || "";
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (lenis) lenis.stop();
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lenis) lenis.start();
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---------------------------------------------------------------------
     9. LIQUID GLASS SPECULAR HIGHLIGHT
     Tracks the cursor so every glass surface reflects light like a real
     curved pane — this is the core "Apple Liquid Glass" interaction.
  --------------------------------------------------------------------- */
  const glassSurfaces = document.querySelectorAll(".glass-card, .footer-glass, .nav-inner, .poster-card");
  glassSurfaces.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mx", mx + "%");
      el.style.setProperty("--my", my + "%");
    });
  });

  /* ---------------------------------------------------------------------
     10. DOWNLOAD ASSETS (placeholder action — wire to real asset zip later)
  --------------------------------------------------------------------- */
  const downloadBtn = document.getElementById("downloadAssetsBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      downloadBtn.textContent = "Preparing…";
      setTimeout(() => {
        downloadBtn.textContent = "Assets ready — replace this action with your file link";
      }, 900);
    });
  }
});
