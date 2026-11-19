
/* =========================================
   SALMAN & AMINA WEDDING WEBSITE
   EDIT WEDDING INFORMATION HERE
========================================= */

const weddingConfig = {
  groom: "Salman",
  bride: "Amina",
  date: "Saturday, 12 December 2026",
  event: "Nikah",
  time: "5:00 PM",
  venue: "Groom's Residence",
  location: "Mettammal East, Trikaripur",
  timeZone: "Asia/Kolkata",

  // 12 December 2026 at 5 PM IST.
  targetDate: Date.UTC(2026, 11, 12, 11, 30, 0)
};

/* OPEN INVITATION */

const opening = document.getElementById("opening");
const website = document.getElementById("website");

document.getElementById("openBtn").addEventListener("click", () => {
  opening.classList.add("closed");
  opening.style.opacity = "0";
  opening.style.visibility = "hidden";

  website.hidden = false;

  document.getElementById("musicBtn").hidden = false;

  setTimeout(() => {
    opening.style.display = "none";
  }, 1100);
});

/* COUNTDOWN */

function updateCountdown() {
  const remaining = weddingConfig.targetDate - Date.now();

  const ids = ["days", "hours", "minutes", "seconds"];

  if (remaining <= 0) {
    ids.forEach(id => {
      document.getElementById(id).textContent = "00";
    });
    return;
  }

  const values = [
    Math.floor(remaining / 86400000),
    Math.floor((remaining % 86400000) / 3600000),
    Math.floor((remaining % 3600000) / 60000),
    Math.floor((remaining % 60000) / 1000)
  ];

  values.forEach((value, index) => {
    document.getElementById(ids[index]).textContent =
      String(value).padStart(index === 0 ? 3 : 2, "0");
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* SCROLL ANIMATIONS */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(element => observer.observe(element));
} else {
  revealElements.forEach(element => {
    element.classList.add("visible");
  });
}

/* GALLERY LIGHTBOX */

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");

document.querySelectorAll(".gallery-image").forEach(item => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.image;
    lightbox.classList.add("active");
  });
});

function closeLightbox() {
  lightbox.classList.remove("active");
  lightboxImage.src = "";
}

document.getElementById("closeLightbox")
  .addEventListener("click", closeLightbox);

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeLightbox();
});

/* BACKGROUND MUSIC */

const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");

let isPlaying = false;

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
      console.warn("Please add assets/wedding-music.mp3");
    }
  } else {
    music.pause();
    isPlaying = false;
    musicBtn.classList.remove("playing");
    musicBtn.textContent = "♫";
    musicBtn.setAttribute("aria-label", "Play music");
    musicBtn.setAttribute("aria-pressed", "false");
  }
});

/* NAVIGATION */

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    const nav = document.getElementById("navigation");

    if (nav.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(nav).hide();
    }
  });
});
