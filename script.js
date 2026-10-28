
/* ==========================================
   XTREMETOY — MAIN JAVASCRIPT
   Intro • Music • Mobile Menu • Navigation
   ========================================== */

"use strict";

const SITE_LINKS = {
  discord: "https://discord.com/users/1315545130199027782",
  roblox: "https://www.roblox.com/users/1682110959/profile"
};

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const intro = document.getElementById("intro");
  const enterButton = document.getElementById("enterButton");
  const siteContent = document.getElementById("siteContent");

  const music = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");
  const musicIcon = document.getElementById("musicIcon");
  const musicText = document.getElementById("musicText");
  const introMusicToggle = document.getElementById("introMusicToggle");

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  // ------------------------------------------
  // 1. PROFILE LINKS
  // ------------------------------------------

  document.querySelectorAll("#discordLink, #discordTextLink").forEach(link => {
    link.href = SITE_LINKS.discord;
  });

  const robloxLink = document.getElementById("robloxLink");
  if (robloxLink) {
    robloxLink.href = SITE_LINKS.roblox;
  }

  // ------------------------------------------
  // 2. BACKGROUND PARTICLES
  // ------------------------------------------

  const particleLayer = document.getElementById("particles");

  if (particleLayer && particleLayer.children.length === 0) {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 34; i++) {
      const particle = document.createElement("span");
      const size = 2 + Math.random() * 2.5;

      particle.className = "particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${9 + Math.random() * 17}s`;
      particle.style.animationDelay = `${-Math.random() * 22}s`;
      particle.style.opacity = `${0.2 + Math.random() * 0.6}`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      fragment.appendChild(particle);
    }

    particleLayer.appendChild(fragment);
  }

  // ------------------------------------------
  // 3. ENTER WEBSITE — ROBUST HANDLING
  // ------------------------------------------

  let introExited = false;

  function enterWebsite() {
    if (introExited) return;

    introExited = true;

    // Unlock the main page immediately.
    body.classList.remove("locked");

    if (siteContent) {
      siteContent.style.visibility = "visible";
      siteContent.style.pointerEvents = "auto";
      siteContent.removeAttribute("aria-hidden");
    }

    if (intro) {
      intro.setAttribute("aria-hidden", "true");
      intro.classList.add("intro-exit", "hide");

      // Prevent the intro from blocking homepage clicks.
      intro.style.pointerEvents = "none";
    }

    if (enterButton) {
      enterButton.disabled = true;
      enterButton.setAttribute("aria-busy", "true");
    }

    // Remove the intro after its exit animation.
    window.setTimeout(() => {
      if (intro) {
        intro.style.display = "none";
      }

      if (enterButton) {
        enterButton.disabled = false;
        enterButton.removeAttribute("aria-busy");
      }
    }, 1000);
  }

  if (enterButton) {
    // Keep the button above decorative intro elements.
    enterButton.style.position = "relative";
    enterButton.style.zIndex = "9999";
    enterButton.style.pointerEvents = "auto";

    // Normal mouse, touch, and keyboard activation.
    enterButton.addEventListener("click", event => {
      event.preventDefault();
      enterWebsite();
    });

    // Backup for pointer activation if another listener
    // interferes with the normal click event.
    enterButton.addEventListener("pointerup", event => {
      if (event.pointerType === "touch" || event.pointerType === "pen") {
        return;
      }

      if (!introExited) {
        event.preventDefault();
        enterWebsite();
      }
    });
  } else {
    console.error(
      "XTREMETOY: Cannot find #enterButton. Check the button ID in index.html."
    );
  }

  // Allow Enter or Space to open the website when focus
  // is not already inside an interactive element.
  document.addEventListener("keydown", event => {
    const target = event.target;

    if (
      !introExited &&
      intro &&
      !event.repeat &&
      (event.key === "Enter" || event.key === " ") &&
      target instanceof Element &&
      !target.closest("button, a, input, textarea, select")
    ) {
      event.preventDefault();
      enterWebsite();
    }
  });

  // ------------------------------------------
  // 4. MUSIC CONTROLS
  // ------------------------------------------

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
      musicIcon.textContent = "♫";
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

      const label = introMusicToggle.querySelector(".intro-music-label");
      if (label) {
        label.textContent = musicOn ? "SOUND ON" : "SOUND OFF";
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
        "XTREMETOY: Music could not play. Check that music.mp3 exists.",
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

  if (music) {
    music.addEventListener("play", () => {
      musicOn = true;
      updateMusicControls();
    });

    music.addEventListener("pause", () => {
      musicOn = false;
      updateMusicControls();
    });

    music.addEventListener("error", () => {
      musicOn = false;
      updateMusicControls();
    });
  }

  updateMusicControls();

  // ------------------------------------------
  // 5. MOBILE NAVIGATION
  // ------------------------------------------

  function closeMobileMenu() {
    if (!navLinks || !menuToggle) return;

    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", event => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMobileMenu();
      }
    });
  }

  // ------------------------------------------
  // 6. ACTIVE SECTION NAVIGATION
  // ------------------------------------------

  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window && navLinks) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        navLinks.querySelectorAll("a").forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    }, {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0
    });

    sections.forEach(section => observer.observe(section));
  }

  // ------------------------------------------
  // 7. DISCORD AVATAR FALLBACK
  // ------------------------------------------

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

  console.log("XTREMETOY website initialized successfully.");
});

/* ==========================================
   XTREMETOY ACHIEVEMENT POPUPS
   ========================================== */
(() => {
  const modal = document.getElementById("achievementModal");

  if (!modal || modal.dataset.initialized === "true") return;
  modal.dataset.initialized = "true";

  const title = document.getElementById("achievementModalTitle");
  const description = document.getElementById(
    "achievementModalDescription"
  );
  const icon = document.getElementById("achievementModalIcon");
  const closeButton = modal.querySelector(".achievement-close");

  const achievements = {
    admin: {
      title: "Administrator",
      icon: "♛",
      description:
        "Managing communities, servers, and overall operations. Your existing role information lists 5 servers and 40,000 members."
    },
    manager: {
      title: "Staff Manager",
      icon: "✦",
      description:
        "Coordinating staff teams and supporting community management. Your existing role information lists 3 servers and 10,000 members."
    },
    moderator: {
      title: "Moderator",
      icon: "◈",
      description:
        "Helping maintain community rules and a positive environment. Your existing role information lists 10 servers and 40,000 members."
    },
    gambler: {
      title: "Gambler",
      icon: "🎲",
      description:
        "A part of your gaming identity and online community."
    }
  };

  let previousFocus = null;

  function openAchievement(key, trigger) {
    const item = achievements[key];
    if (!item) return;

    previousFocus = trigger;
    title.textContent = item.title;
    description.textContent = item.description;
    icon.textContent = item.icon;

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeAchievement() {
    if (modal.hidden) return;

    modal.hidden = true;
    document.body.style.overflow = "";

    if (previousFocus && previousFocus.isConnected) {
      previousFocus.focus();
    }
  }

  document.querySelectorAll("[data-achievement]").forEach(button => {
    button.addEventListener("click", () => {
      openAchievement(button.dataset.achievement, button);
    });
  });

  modal.querySelectorAll("[data-close-achievement]").forEach(button => {
    button.addEventListener("click", closeAchievement);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeAchievement();
  });
})();

/* =========================================
   XTREMETOY STATISTICS COUNTER ANIMATION
========================================= */

(() => {
  const dashboard = document.querySelector(".stats-dashboard");

  if (!dashboard || dashboard.dataset.countersInitialized === "true") {
    return;
  }

  dashboard.dataset.countersInitialized = "true";

  const counters = dashboard.querySelectorAll(".stats-counter");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const formatter = new Intl.NumberFormat("en-US");

  function formatValue(value, counter) {
    if (counter.dataset.format === "compact" && value >= 1000) {
      return formatter.format(value);
    }

    return formatter.format(value);
  }

  function setCounter(counter, value) {
    counter.textContent = formatValue(value, counter);
  }

  function animateCounter(counter) {
    const target = Number(counter.dataset.target);

    if (!Number.isFinite(target) || target < 0) {
      return;
    }

    if (reducedMotion) {
      setCounter(counter, target);
      return;
    }

    const duration = 1500;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      // Ease-out effect: fast at first, smooth near the end.
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(target * easedProgress);

      setCounter(counter, currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCounter(counter, target);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  let hasAnimated = false;

  function startDashboardAnimation() {
    if (hasAnimated) return;
    hasAnimated = true;

    counters.forEach(animateCounter);
  }

  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startDashboardAnimation();
          observer.disconnect();
        }
      });
    }, {
      threshold: 0.2
    });

    observer.observe(dashboard);
  } else {
    startDashboardAnimation();
  }
})();
/* =========================================
   XTREMETOY - GAME STATISTICS DEMO
========================================= */

document.addEventListener("DOMContentLoaded", function () {
  const gameCards = document.querySelectorAll(".game-stat-card");

  gameCards.forEach(function (card) {
    const statFields = card.querySelectorAll(".editable-stat");
    const statusLabel = card.querySelector(".game-profile-status");

    function updateStatus() {
      const hasEnteredValue = Array.from(statFields).some(function (field) {
        const value = field.textContent.trim();

        return value !== "" && value !== "—" && value !== "-";
      });

      if (statusLabel) {
        statusLabel.textContent = hasEnteredValue
          ? "DATA ENTERED"
          : "AWAITING DATA";
      }
    }

    statFields.forEach(function (field) {
      // Allow Enter to finish editing without adding another line.
      field.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          field.blur();
        }
      });

      // Update the card status as the value changes.
      field.addEventListener("input", updateStatus);

      // Remove surrounding whitespace after editing.
      field.addEventListener("blur", function () {
        field.textContent = field.textContent.trim();
        updateStatus();
      });
    });

    updateStatus();
  });

  // Demo animation: reveal the cards when the section enters view.
  const gameStatsSection = document.querySelector("#game-stats");

  if (gameStatsSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            gameCards.forEach(function (card, index) {
              card.animate(
                [
                  {
                    opacity: 0.4,
                    transform: "translateY(18px)"
                  },
                  {
                    opacity: 1,
                    transform: "translateY(0)"
                  }
                ],
                {
                  duration: 450,
                  delay: index * 120,
                  easing: "ease-out",
                  fill: "both"
                }
              );
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(gameStatsSection);
  }
});
