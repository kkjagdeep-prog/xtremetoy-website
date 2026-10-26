
/* ==========================================
   XTREMETOY — MAIN JAVASCRIPT
   Intro • Music • Mobile Menu • Navigation
   ========================================== */

"use strict";

// ==========================================
// 1. PROFILE LINKS
// ==========================================

const SITE_LINKS = {
  discord: "https://discord.com/users/1315545130199027782",
  roblox: "https://www.roblox.com/users/1682110959/profile"
};

// ==========================================
// 2. INITIALIZE THE WEBSITE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Intro elements
  const intro = document.getElementById("intro");
  const enterButton = document.getElementById("enterButton");

  // Music elements
  const music = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");
  const musicIcon = document.getElementById("musicIcon");
  const musicText = document.getElementById("musicText");
  const introMusicToggle = document.getElementById("introMusicToggle");

  // Navigation elements
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  // ========================================
  // 3. KEEP PROFILE LINKS CONSISTENT
  // ========================================

  document.querySelectorAll("#discordLink, #discordTextLink").forEach(link => {
    link.href = SITE_LINKS.discord;
  });

  const robloxLink = document.getElementById("robloxLink");

  if (robloxLink) {
    robloxLink.href = SITE_LINKS.roblox;
  }

  // ========================================
  // 4. BACKGROUND PARTICLES
  // ========================================

  const particleLayer = document.getElementById("particles");

  if (particleLayer && !particleLayer.children.length) {
    const particleFragment = document.createDocumentFragment();

    for (let i = 0; i < 34; i++) {
      const particle = document.createElement("span");

      particle.className = "particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${9 + Math.random() * 17}s`;
      particle.style.animationDelay = `${-Math.random() * 22}s`;
      particle.style.opacity = `${0.2 + Math.random() * 0.6}`;

      const size = 2 + Math.random() * 2.5;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      particleFragment.appendChild(particle);
    }

    particleLayer.appendChild(particleFragment);
  }

  // ========================================
  // 5. CINEMATIC INTRO / ENTER BUTTON
  // ========================================

  let introExited = false;

  function enterWebsite() {
    if (introExited) return;

    introExited = true;

    if (enterButton) {
      enterButton.disabled = true;
    }

    // Start the exit animation.
    if (intro) {
      intro.classList.add("intro-exit", "hide");
      intro.setAttribute("aria-hidden", "true");
    }

    // Unlock scrolling immediately.
    body.classList.remove("locked");

    // Hide the intro after the animation completes.
    window.setTimeout(() => {
      if (intro) {
        intro.style.display = "none";
      }

      // Restore keyboard and screen-reader access to the page.
      const siteContent = document.getElementById("siteContent");

      if (siteContent) {
        siteContent.style.visibility = "visible";
        siteContent.style.pointerEvents = "auto";
      }

      if (enterButton) {
        enterButton.disabled = false;
      }
    }, 950);
  }

  if (enterButton) {
    enterButton.addEventListener("click", enterWebsite);
  } else {
    console.warn("XTREMETOY: #enterButton was not found.");
  }

  // Allow the Enter key to dismiss the intro.
  document.addEventListener("keydown", event => {
    if (
      event.key === "Enter" &&
      intro &&
      !introExited &&
      !event.repeat &&
      !event.target.closest("button, a, input, textarea, select")
    ) {
      enterWebsite();
    }
  });

  // ========================================
  // 6. SYNCHRONIZED MUSIC CONTROLS
  // ========================================

  let musicOn = false;

  function updateMusicControls() {
    if (musicToggle) {
      musicToggle.setAttribute("aria-pressed", String(musicOn));
      musicToggle.setAttribute(
        "aria-label",
        musicOn ? "Turn background music off" : "Turn background music on"
      );
    }

    if (musicIcon) {
      musicIcon.textContent = musicOn ? "♫" : "♫";
    }

    if (musicText) {
      musicText.textContent = musicOn ? "MUSIC ON" : "MUSIC OFF";
    }

    if (introMusicToggle) {
      introMusicToggle.setAttribute("aria-pressed", String(musicOn));
      introMusicToggle.setAttribute(
        "aria-label",
        musicOn ? "Turn background music off" : "Turn background music on"
      );

      const introLabel = introMusicToggle.querySelector(".intro-music-label");

      if (introLabel) {
        introLabel.textContent = musicOn ? "SOUND ON" : "SOUND OFF";
      }
    }

    body.classList.toggle("music-playing", musicOn);
  }

  async function toggleMusic() {
    if (!music) {
      console.warn("XTREMETOY: The #bgMusic audio element was not found.");
      return;
    }

    if (musicOn) {
      music.pause();
      musicOn = false;
      updateMusicControls();
      return;
    }

    try {
      await music.play();
      musicOn = true;
      updateMusicControls();
    } catch (error) {
      musicOn = false;
      updateMusicControls();

      if (musicText) {
        musicText.textContent = "AUDIO UNAVAILABLE";
      }

      console.warn(
        "XTREMETOY: Music could not play. Check that music.mp3 exists and is a valid audio file.",
        error
      );
    }
  }

  if (musicToggle) {
    musicToggle.addEventListener("click", toggleMusic);
  }

  if (introMusicToggle) {
    introMusicToggle.addEventListener("click", toggleMusic);
  }

  // Keep controls synchronized if audio is paused or ends unexpectedly.
  if (music) {
    music.addEventListener("pause", () => {
      if (musicOn) {
        musicOn = false;
        updateMusicControls();
      }
    });

    music.addEventListener("play", () => {
      musicOn = true;
      updateMusicControls();
    });

    music.addEventListener("error", () => {
      musicOn = false;
      updateMusicControls();
    });
  }

  updateMusicControls();

  // ========================================
  // 7. MOBILE NAVIGATION MENU
  // ========================================

  function closeMobileMenu() {
    if (!navLinks || !menuToggle) return;

    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const opened = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(opened));
      menuToggle.setAttribute(
        "aria-label",
        opened ? "Close navigation" : "Open navigation"
      );

      menuToggle.textContent = opened ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMobileMenu);
    });

    // Close the menu when the user clicks elsewhere.
    document.addEventListener("click", event => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMobileMenu();
      }
    });

    // Escape closes the mobile menu.
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });

    // Avoid leaving the mobile menu open after resizing to desktop.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMobileMenu();
      }
    });
  }

  // ========================================
  // 8. ACTIVE NAVIGATION WHILE SCROLLING
  // ========================================

  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window && navLinks) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          navLinks.querySelectorAll("a").forEach(link => {
            const isActive =
              link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("active", isActive);
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach(section => observer.observe(section));
  }

  // ========================================
  // 9. PROFILE IMAGE FALLBACK
  // ========================================

  const avatarImage = document.querySelector(".xt-player-avatar-image");
  const avatarFallback = document.querySelector(".xt-player-avatar-fallback");

  function showAvatarFallback() {
    if (avatarImage) {
      avatarImage.style.display = "none";
    }

    if (avatarFallback) {
      avatarFallback.style.display = "grid";
    }
  }

  if (avatarImage) {
    avatarImage.addEventListener("error", showAvatarFallback);

    if (avatarImage.complete && avatarImage.naturalWidth === 0) {
      showAvatarFallback();
    }
  }

  // ========================================
  // 10. INITIAL PAGE STATE
  // ========================================

  updateMusicControls();

  console.log("XTREMETOY website initialized successfully.");
});
