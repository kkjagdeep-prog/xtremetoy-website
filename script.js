// Change these links to your own profile URLs if needed.
const SITE_LINKS = {
  discord: "https://discord.com/users/1315545130199027782",
  roblox: "https://www.roblox.com/users/1682110959/profile"
};

const intro = document.getElementById('intro');
const enterButton = document.getElementById('enterButton');
const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const musicText = document.getElementById('musicText');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

// Keep all Discord buttons connected to the same profile URL.
document.querySelectorAll('#discordLink, #discordTextLink').forEach(link => link.href = SITE_LINKS.discord);
document.getElementById('robloxLink').href = SITE_LINKS.roblox;

// Create subtle floating background particles.
const particleLayer = document.getElementById('particles');
for (let i = 0; i < 34; i++) {
  const particle = document.createElement('span');
  particle.className = 'particle';
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.animationDuration = `${9 + Math.random() * 17}s`;
  particle.style.animationDelay = `${-Math.random() * 22}s`;
  particle.style.opacity = `${0.2 + Math.random() * 0.6}`;
  const size = 2 + Math.random() * 2.5;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particleLayer.appendChild(particle);
}

enterButton.addEventListener('click', () => {
  intro.classList.add('hide');
  document.body.classList.remove('locked');
  // Browsers require a visitor to interact before audio can play.
  // Music is not forced on; the visitor can turn it on with the music button.
});

async function toggleMusic() {
  if (music.paused) {
    try {
      await music.play();
      musicIcon.textContent = '♫';
      musicText.textContent = 'MUSIC ON';
      musicToggle.setAttribute('aria-label', 'Turn background music off');
    } catch (error) {
      musicText.textContent = 'ADD MUSIC.MP3';
      // This happens until the site owner adds a permitted music.mp3 file.
    }
  } else {
    music.pause();
    musicIcon.textContent = '♫';
    musicText.textContent = 'MUSIC OFF';
    musicToggle.setAttribute('aria-label', 'Turn background music on');
  }
}
musicToggle.addEventListener('click', toggleMusic);

menuToggle.addEventListener('click', () => {
  const opened = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation');
  menuToggle.textContent = opened ? '✕' : '☰';
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));

// Highlight the current navigation section while scrolling.
const sections = document.querySelectorAll('main section[id]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => observer.observe(section));
}
