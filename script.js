
/* ==========================================
   XTREMETOY — MAIN JAVASCRIPT
   Intro • Music • Navigation • Stats • Effects
   ========================================== */

"use strict";

const SITE_LINKS = {
  discord: "https://discord.com/users/1315545130199027782",
  roblox: "https://www.roblox.com/users/1682110959/profile"
};

/* ==========================================
   1. MAIN WEBSITE INITIALIZATION
   ========================================== */

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

  /* Profile links */

  document.querySelectorAll("#discordLink, #discordTextLink").forEach(link => {
    link.href = SITE_LINKS.discord;
  });

  const robloxLink = document.getElementById("robloxLink");

  if (robloxLink) {
    robloxLink.href = SITE_LINKS.roblox;
  }

  /* Background particles */

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

  /* Enter website */

  let introExited = false;

  function enterWebsite() {
    if (introExited) return;

    introExited = true;

    body.classList.remove("locked");

    if (siteContent) {
      siteContent.style.visibility = "visible";
      siteContent.style.pointerEvents = "auto";
      siteContent.removeAttribute("aria-hidden");
    }

    if (intro) {
      intro.setAttribute("aria-hidden", "true");
      intro.classList.add("intro-exit", "hide");
      intro.style.pointerEvents = "none";
    }

    if (enterButton) {
      enterButton.disabled = true;
      enterButton.setAttribute("aria-busy", "true");
    }

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
    enterButton.style.position = "relative";
    enterButton.style.zIndex = "9999";
    enterButton.style.pointerEvents = "auto";

    enterButton.addEventListener("click", event => {
      event.preventDefault();
      enterWebsite();
    });

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
      "XTREMETOY: Cannot find #enterButton. Check the ID in index.html."
    );
  }

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

  /* Music controls */

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

  /* Mobile navigation */

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

  /* Active section navigation */

  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window && navLinks) {
    const sectionObserver = new IntersectionObserver(entries => {
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

    sections.forEach(section => sectionObserver.observe(section));
  }

  /* Discord avatar fallback */

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
   2. ACHIEVEMENT POPUPS
   ========================================== */

(() => {
  const modal = document.getElementById("achievementModal");

  if (!modal || modal.dataset.initialized === "true") return;
  modal.dataset.initialized = "true";

  const title = document.getElementById("achievementModalTitle");
  const description = document.getElementById("achievementModalDescription");
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
      description: "A part of your gaming identity and online community."
    }
  };

  let previousFocus = null;

  function openAchievement(key, trigger) {
    const item = achievements[key];
    if (!item) return;

    previousFocus = trigger;

    if (title) title.textContent = item.title;
    if (description) description.textContent = item.description;
    if (icon) icon.textContent = item.icon;

    modal.hidden = false;
    document.body.style.overflow = "hidden";

    if (closeButton) closeButton.focus();
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


/* ==========================================
   3. STATISTICS COUNTER ANIMATION
   ========================================== */

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
    return formatter.format(value);
  }

  function setCounter(counter, value) {
    counter.textContent = formatValue(value, counter);
  }

  function animateCounter(counter) {
    const target = Number(counter.dataset.target);

    if (!Number.isFinite(target) || target < 0) return;

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
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
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


/* ==========================================
   4. GAME STATISTICS DEMO
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const gameCards = document.querySelectorAll(".game-stat-card");

  gameCards.forEach(card => {
    const statFields = card.querySelectorAll(".editable-stat");
    const statusLabel = card.querySelector(".game-profile-status");

    function updateStatus() {
      const hasEnteredValue = Array.from(statFields).some(field => {
        const value = field.textContent.trim();
        return value !== "" && value !== "—" && value !== "-";
      });

      if (statusLabel) {
        statusLabel.textContent = hasEnteredValue
          ? "DATA ENTERED"
          : "AWAITING DATA";
      }
    }

    statFields.forEach(field => {
      field.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          event.preventDefault();
          field.blur();
        }
      });

      field.addEventListener("input", updateStatus);

      field.addEventListener("blur", () => {
        field.textContent = field.textContent.trim();
        updateStatus();
      });
    });

    updateStatus();
  });

  /* Reveal game cards with a gentle animation */

  const gameStatsSection = document.querySelector("#game-stats");

  if (gameStatsSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        gameCards.forEach((card, index) => {
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
      });
    }, {
      threshold: 0.15
    });

    observer.observe(gameStatsSection);
  }
});


/* ==========================================
   5. XTREMETOY CYBERPUNK EFFECTS ENGINE
   ========================================== */

(() => {
  "use strict";

  function startXTEffects() {
    if (document.documentElement.dataset.xtEffects === "ready") return;

    document.documentElement.dataset.xtEffects = "ready";

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const mouseDevice = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    /* Neon cursor */

    if (mouseDevice && !reduceMotion) {
      const glow = document.createElement("div");
      glow.id = "xt-cursor-glow";
      glow.setAttribute("aria-hidden", "true");

      const dot = document.createElement("div");
      dot.id = "xt-cursor-dot";
      dot.setAttribute("aria-hidden", "true");

      const trail = document.createElement("div");
      trail.id = "xt-cursor-trail";
      trail.setAttribute("aria-hidden", "true");

      document.body.append(glow, trail, dot);

      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let trailX = mouseX;
      let trailY = mouseY;
      let glowX = mouseX;
      let glowY = mouseY;
      let frameRequested = false;

      function renderCursor() {
        trailX += (mouseX - trailX) * 0.16;
        trailY += (mouseY - trailY) * 0.16;
        glowX += (mouseX - glowX) * 0.09;
        glowY += (mouseY - glowY) * 0.09;

        dot.style.left = mouseX + "px";
        dot.style.top = mouseY + "px";

        trail.style.left = trailX + "px";
        trail.style.top = trailY + "px";

        glow.style.left = glowX + "px";
        glow.style.top = glowY + "px";

        frameRequested = false;
      }

      document.addEventListener("mousemove", event => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        if (!frameRequested) {
          frameRequested = true;
          requestAnimationFrame(renderCursor);
        }
      }, { passive: true });

      document.addEventListener("mouseover", event => {
        const target = event.target;

        if (
          target instanceof Element &&
          target.closest("a, button, [role='button']")
        ) {
          trail.classList.add("xt-cursor-hover");
        } else {
          trail.classList.remove("xt-cursor-hover");
        }
      });

      document.addEventListener("mouseleave", () => {
        document.body.classList.remove("xt-effects-ready");
      });

      document.addEventListener("mouseenter", () => {
        document.body.classList.add("xt-effects-ready");
      });

      document.body.classList.add("xt-effects-ready");
    }

    /* Neon click ripple */

    if (!reduceMotion) {
      document.addEventListener("click", event => {
        if (!(event.target instanceof Element)) return;

        const target = event.target.closest(
          "a, button, .button, .music-toggle"
        );

        if (!target) return;

        const rect = target.getBoundingClientRect();
        const ripple = document.createElement("span");

        ripple.className = "xt-click-ripple";
        ripple.setAttribute("aria-hidden", "true");

        ripple.style.left = (event.clientX - rect.left) + "px";
        ripple.style.top = (event.clientY - rect.top) + "px";

        const previousPosition = target.style.position;

        if (getComputedStyle(target).position === "static") {
          target.style.position = "relative";
        }

        target.appendChild(ripple);

        window.setTimeout(() => {
          ripple.remove();

          if (
            previousPosition === "" &&
            target.style.position === "relative"
          ) {
            target.style.removeProperty("position");
          }
        }, 700);
      });
    }

    /* Gentle 3D card tilt */

    if (mouseDevice && !reduceMotion) {
      const cardSelectors = [
        ".role-card",
        ".gaming-card",
        ".social-card",
        ".achievement-card",
        ".profile-card",
        ".game-card",
        ".stat-card"
      ].join(",");

      document.querySelectorAll(cardSelectors).forEach(card => {
        card.classList.add("xt-tilt-card");

        card.addEventListener("mousemove", event => {
          const rect = card.getBoundingClientRect();

          if (!rect.width || !rect.height) return;

          const x = (event.clientX - rect.left) / rect.width;
          const y = (event.clientY - rect.top) / rect.height;

          const rotateY = (x - 0.5) * 5;
          const rotateX = (0.5 - y) * 5;

          card.style.transform =
            "perspective(900px) rotateX(" + rotateX + "deg) " +
            "rotateY(" + rotateY + "deg) translateY(-2px)";
        });

        card.addEventListener("mouseleave", () => {
          card.style.transform = "";
        });
      });
    }

    /* Scroll reveal */

    const revealSelectors = [
      "#about",
      "#roles",
      "#gaming",
      "#statistics",
      "#game-stats",
      "#achievements",
      "#connect"
    ];

    const revealItems = [];

    revealSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        if (!element.classList.contains("hero")) {
          revealItems.push(element);
        }
      });
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach(element => {
        element.classList.add("xt-revealed");
      });
    } else {
      revealItems.forEach(element => {
        element.classList.add("xt-reveal");
      });

      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("xt-revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );

      revealItems.forEach(element => {
        revealObserver.observe(element);
      });
    }

    /* Subtle card scan effect */

    if (!reduceMotion) {
      const scanSelectors = [
        ".role-card",
        ".gaming-card",
        ".social-card",
        ".achievement-card",
        ".profile-card"
      ].join(",");

      document.querySelectorAll(scanSelectors).forEach(card => {
        card.classList.add("xt-scan-target");

        card.addEventListener("mouseenter", () => {
          card.classList.remove("xt-scan-active");

          // Restart the scan animation.
          void card.offsetWidth;

          card.classList.add("xt-scan-active");
        });

        card.addEventListener("animationend", event => {
          if (event.animationName === "xtScanSweep") {
            card.classList.remove("xt-scan-active");
          }
        });
      });
    }

    console.info("XTREMETOY cyberpunk effects initialized.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startXTEffects, {
      once: true
    });
  } else {
    startXTEffects();
  }
})();
