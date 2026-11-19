/* ==========================================================================
   SALMAN & AMINA WEDDING WEBSITE
   Interactive Features, Countdown, Lightbox & Audio Controls
   ========================================================================== */

const weddingConfig = {
  groom: "Salman",
  bride: "Amina",
  date: "Saturday, 12 December 2026",
  event: "Nikah",
  time: "5:00 PM",
  venue: "Groom's Residence",
  location: "Mettammal East, Trikaripur",
  timeZone: "Asia/Kolkata",

  // 12 December 2026 at 5:00 PM IST (11:30 AM UTC)
  targetDate: Date.UTC(2026, 11, 12, 11, 30, 0)
};

/* --------------------------------------------------------------------------
   1. OPEN INVITATION SCREEN
   -------------------------------------------------------------------------- */
const opening = document.getElementById("opening");
const website = document.getElementById("website");
const openBtn = document.getElementById("openBtn");
const musicBtn = document.getElementById("musicBtn");

if (openBtn) {
  openBtn.addEventListener("click", () => {
    opening.classList.add("closed");
    opening.style.opacity = "0";
    opening.style.visibility = "hidden";

    // Reveal main website
    website.hidden = false;
    musicBtn.hidden = false;

    // Trigger reveal for hero & initial visible elements
    setTimeout(() => {
      triggerRevealCheck();
      window.dispatchEvent(new Event("resize"));
    }, 100);

    setTimeout(() => {
      opening.style.display = "none";
    }, 950);
  });
}

/* --------------------------------------------------------------------------
   2. COUNTDOWN TIMER
   -------------------------------------------------------------------------- */
function updateCountdown() {
  const remaining = weddingConfig.targetDate - Date.now();
  const ids = ["days", "hours", "minutes", "seconds"];

  if (remaining <= 0) {
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = "00";
    });
    return;
  }

  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  const values = [days, hours, minutes, seconds];

  values.forEach((value, index) => {
    const el = document.getElementById(ids[index]);
    if (el) {
      el.textContent = String(value).padStart(index === 0 ? (value > 99 ? 3 : 2) : 2, "0");
    }
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* --------------------------------------------------------------------------
   3. SCROLL REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
const revealElements = document.querySelectorAll(".reveal");

function triggerRevealCheck() {
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  revealElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    if (rect.top <= windowHeight * 0.92 && rect.bottom >= 0) {
      element.classList.add("visible");
    }
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach(element => observer.observe(element));
} else {
  window.addEventListener("scroll", triggerRevealCheck, { passive: true });
  triggerRevealCheck();
}

/* --------------------------------------------------------------------------
   4. GALLERY LIGHTBOX
   -------------------------------------------------------------------------- */
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightboxBtn = document.getElementById("closeLightbox");

document.querySelectorAll(".gallery-image").forEach(item => {
  item.addEventListener("click", () => {
    const imageSrc = item.dataset.image;
    if (imageSrc && lightbox && lightboxImage) {
      lightboxImage.src = imageSrc;
      lightbox.classList.add("active");
      document.body.classList.add("lightbox-open");
    }
  });
});

function closeLightbox() {
  if (lightbox && lightboxImage) {
    lightbox.classList.remove("active");
    lightboxImage.src = "";
    document.body.classList.remove("lightbox-open");
  }
}

if (closeLightboxBtn) {
  closeLightboxBtn.addEventListener("click", closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && lightbox && lightbox.classList.contains("active")) {
    closeLightbox();
  }
});

/* --------------------------------------------------------------------------
   5. BACKGROUND MUSIC CONTROLS
   -------------------------------------------------------------------------- */
const music = document.getElementById("music");
let isPlaying = false;

if (musicBtn && music) {
  musicBtn.addEventListener("click", async () => {
    if (!isPlaying) {
      try {
        await music.play();
        isPlaying = true;
        musicBtn.textContent = "♫";
        musicBtn.classList.add("playing");
        musicBtn.setAttribute("aria-label", "Pause music");
        musicBtn.setAttribute("aria-pressed", "true");
      } catch (error) {
        musicBtn.textContent = "×";
        musicBtn.setAttribute("aria-label", "Music unavailable");
        console.warn("Could not autoplay audio file:", error);
      }
    } else {
      music.pause();
      isPlaying = false;
      musicBtn.classList.remove("playing");
      musicBtn.textContent = "♫";
      musicBtn.setAttribute("aria-label", "Play background music");
      musicBtn.setAttribute("aria-pressed", "false");
    }
  });
}

/* --------------------------------------------------------------------------
   6. RESPONSIVE MOBILE NAVIGATION
   -------------------------------------------------------------------------- */
const navLinks = document.querySelectorAll(".nav-link");
const navCollapse = document.getElementById("navigation");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    if (navCollapse && navCollapse.classList.contains("show") && window.bootstrap) {
      const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(navCollapse);
      bsCollapse.hide();
    }
  });
});

// Close mobile navbar on clicking outside
document.addEventListener("click", event => {
  const navbar = document.querySelector(".navbar");
  if (
    navbar &&
    navCollapse &&
    navCollapse.classList.contains("show") &&
    !navbar.contains(event.target) &&
    window.bootstrap
  ) {
    const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(navCollapse);
    bsCollapse.hide();
  }
});

/* --------------------------------------------------------------------------
   7. FIXED CONTENT SCROLL & PARALLAX ANIMATION (NEW MODEL WEBSITES)
   -------------------------------------------------------------------------- */
const scrollProgressBar = document.getElementById("scrollProgress");
const heroContent = document.querySelector(".hero .container");
const heroScrollLabel = document.querySelector(".scroll-label");

let ticking = false;

function updateScrollAnimations() {
  const scrollY = window.scrollY || window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  // 1. Top Scroll Progress Bar
  if (scrollProgressBar && docHeight > 0) {
    const progress = (scrollY / docHeight) * 100;
    scrollProgressBar.style.width = Math.min(100, Math.max(0, progress)) + "%";
  }

  // 2. Fixed Hero Content Fade & Scale on Scroll (Respect reduced motion)
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduced && heroContent) {
    if (scrollY <= 650) {
      const fade = Math.max(0, 1 - scrollY / 380);
      const scale = Math.max(0.92, 1 - scrollY / 2800);
      const translateY = scrollY * 0.32;
      heroContent.style.opacity = fade;
      heroContent.style.transform = `translateY(${translateY}px) scale(${scale})`;

      if (heroScrollLabel) {
        heroScrollLabel.style.opacity = Math.max(0, 1 - scrollY / 90);
      }
    } else {
      heroContent.style.opacity = "0";
    }
  }

  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollAnimations);
    ticking = true;
  }
}, { passive: true });

