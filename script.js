const GITHUB_USER = "AkashKhatrii";

function emailInit() {
  if (typeof emailjs !== "undefined") {
    emailjs.init("H3PzbE7h-BQUNV0aW");
  }
}

function initContactForm() {
  const btn = document.getElementById("submit-btn");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const fullnameElement = document.getElementById("fullname");
    const emailElement = document.getElementById("email");
    const messageElement = document.getElementById("message");

    const fullname = fullnameElement.value;
    const email = emailElement.value;
    const message = messageElement.value;

    const templateParams = {
      from_name: fullname,
      from_email: email,
      message: message,
    };

    emailjs
      .send("service_6fbgi0p", "template_46iw5vd", templateParams)
      .then(
        function () {
          alert("Message sent successfully!");
          fullnameElement.value = "";
          emailElement.value = "";
          messageElement.value = "";
        },
        function () {
          alert("Failed to send message. Please try again later.");
        }
      );
  });
}

function checkScroll() {
  const scrollElements = document.querySelectorAll(".scroll");
  scrollElements.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < window.innerHeight - 80) {
      el.classList.add("scroll-in-view");
    }
  });
}

function initTyped() {
  if (typeof Typed === "undefined" || !document.getElementById("element")) return;
  new Typed("#element", {
    strings: [
      "SDE @ Amazon",
      "Software Development Engineer",
      "Backend & Distributed Systems",
      "AWS & Data Pipelines",
      "LLM & Applied AI Engineer",
      "PVLDB 2025 first-author",
    ],
    typeSpeed: 55,
    backSpeed: 40,
    backDelay: 1800,
    loop: true,
    showCursor: true,
    cursorChar: "|",
  });
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("mobile-menu");
  const links = menu ? menu.querySelectorAll("a") : [];

  if (!toggle || !menu) return;

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", open);
    if (open) {
      menu.removeAttribute("hidden");
    } else {
      menu.setAttribute("hidden", "");
    }
  }

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!open);
  });

  links.forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });

  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const palette = document.getElementById("command-palette");
    if (palette && !palette.hidden) return;
    setOpen(false);
  });
}

/* —— Scroll progress bar —— */

function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  function update() {
    const root = document.documentElement;
    const max = root.scrollHeight - root.clientHeight;
    const p = max > 0 ? (root.scrollTop / max) * 100 : 0;
    bar.style.width = `${p}%`;
  }
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
}

/* —— Nav active state (scroll spy) —— */

const SPY_SECTIONS = [
  "main",
  "education",
  "languages",
  "internship",
  "projects",
  "github",
  "certifications",
  "contact",
];

function initScrollSpy() {
  let ticking = false;
  function update() {
    const offset = 140;
    let current = "main";
    for (const id of SPY_SECTIONS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top <= offset) current = id;
    }
    document
      .querySelectorAll('.nav-desktop a[href^="#"], .mobile-nav a[href^="#"]')
      .forEach((a) => {
        const id = a.getAttribute("href")?.slice(1);
        a.classList.toggle("active", id === current);
      });
    ticking = false;
  }
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  update();
}

/* —— Hero: network canvas + spotlight —— */

function initHeroCanvas() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const canvas = document.getElementById("hero-canvas");
  const hero = document.querySelector(".hero-section");
  if (!canvas || !hero) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const N = 48;
  const maxLink = 105;
  let w = 0;
  let h = 0;
  let particles = [];
  const mouse = { x: 0, y: 0, on: false };

  function resize() {
    const r = hero.getBoundingClientRect();
    w = canvas.width = Math.max(1, Math.floor(r.width));
    h = canvas.height = Math.max(1, Math.floor(r.height));
    particles = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
    }));
  }

  function onMove(e) {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
    mouse.on = true;
  }

  function onLeave() {
    mouse.on = false;
  }

  hero.addEventListener("mousemove", onMove);
  hero.addEventListener("mouseleave", onLeave);

  const ro = new ResizeObserver(resize);
  ro.observe(hero);
  resize();

  function step() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      if (mouse.on) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < 130) {
          const f = 0.35;
          p.x += (dx / d) * f;
          p.y += (dy / d) * f;
        }
      }
    }

    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const a = particles[i];
        const b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < maxLink) {
          const alpha = (1 - d / maxLink) * 0.2;
          ctx.strokeStyle = `rgba(168, 163, 154, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = "rgba(168, 163, 154, 0.55)";
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.15, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initHeroSpotlight() {
  const hero = document.querySelector(".hero-section");
  if (!hero) return;
  hero.addEventListener("mousemove", (e) => {
    const r = hero.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    hero.style.setProperty("--spot-x", `${x}%`);
    hero.style.setProperty("--spot-y", `${y}%`);
  });
}

/* —— Toast & theme spark —— */

let toastTimer;
function showToast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.hidden = true;
  }, 2600);
}

/* Theme cycler removed — Studio Mono is the only theme. */

/* —— Command palette (⌘K / Ctrl+K) —— */

function getPaletteCommands() {
  return [
    {
      id: "go-main",
      label: "Go to About",
      icon: "fa-user",
      href: "#main",
      terms: "about home intro",
    },
    {
      id: "go-edu",
      label: "Go to Education",
      icon: "fa-graduation-cap",
      href: "#education",
      terms: "school university",
    },
    {
      id: "go-skills",
      label: "Go to Skills",
      icon: "fa-code",
      href: "#languages",
      terms: "stack tech languages tools",
    },
    {
      id: "go-work",
      label: "Go to Experience",
      icon: "fa-briefcase",
      href: "#internship",
      terms: "work job internship",
    },
    {
      id: "go-proj",
      label: "Go to Featured projects",
      icon: "fa-laptop-code",
      href: "#projects",
      terms: "portfolio apps demos",
    },
    {
      id: "go-pubs",
      label: "Go to Publications",
      icon: "fa-book",
      href: "#publications",
      terms: "paper research pvldb vldb sort it like you mean it insightsort",
    },
    {
      id: "go-gh",
      label: "Go to GitHub repos",
      icon: "fa-github",
      href: "#github",
      terms: "repositories code opensource",
    },
    {
      id: "go-cert",
      label: "Go to Certifications",
      icon: "fa-certificate",
      href: "#certifications",
      terms: "awards participations",
    },
    {
      id: "go-faq",
      label: "Go to FAQ",
      icon: "fa-circle-question",
      href: "#faq",
      terms: "questions hire availability",
    },
    {
      id: "go-contact",
      label: "Go to Contact",
      icon: "fa-paper-plane",
      href: "#contact",
      terms: "email message",
    },
    {
      id: "download-resume",
      label: "Download résumé (PDF)",
      icon: "fa-file-arrow-down",
      href: "Akash_Khatri_Resume.pdf",
      external: true,
      terms: "cv resume download pdf",
    },
    {
      id: "copy-email",
      label: "Copy email address",
      icon: "fa-copy",
      action: () => {
        const email = "akash.m.khatri@gmail.com";
        navigator.clipboard.writeText(email).then(
          () => showToast("Email copied to clipboard"),
          () => showToast("Could not copy — try manually")
        );
      },
      terms: "clipboard mail",
    },
    {
      id: "open-gh",
      label: "Open GitHub profile",
      icon: "fa-github",
      href: "https://github.com/AkashKhatrii",
      external: true,
      terms: "akashkhatrii",
    },
    {
      id: "open-in",
      label: "Open LinkedIn",
      icon: "fa-linkedin",
      href: "https://www.linkedin.com/in/akashkhatri/",
      external: true,
      terms: "network",
    },
  ];
}

function initCommandPalette() {
  const root = document.getElementById("command-palette");
  const input = document.getElementById("palette-input");
  const list = document.getElementById("palette-list");
  const fab = document.getElementById("palette-fab");
  if (!root || !input || !list) return;

  const commands = getPaletteCommands();
  let filtered = [...commands];
  let activeIndex = 0;

  function isTypingContext(el) {
    if (!el) return false;
    const tag = el.tagName;
    return (
      el.isContentEditable ||
      tag === "TEXTAREA" ||
      (tag === "INPUT" &&
        el.type !== "button" &&
        el.type !== "checkbox" &&
        el.type !== "radio" &&
        el.type !== "submit")
    );
  }

  function openPalette() {
    root.hidden = false;
    document.body.style.overflow = "hidden";
    input.value = "";
    filter("");
    activeIndex = 0;
    renderList();
    requestAnimationFrame(() => {
      input.focus();
      input.select();
    });
  }

  function closePalette() {
    root.hidden = true;
    document.body.style.overflow = "";
  }

  function filter(q) {
    const s = q.trim().toLowerCase();
    if (!s) {
      filtered = [...commands];
      return;
    }
    filtered = commands.filter((c) => {
      const hay = `${c.label} ${c.terms || ""} ${c.id}`.toLowerCase();
      return hay.includes(s);
    });
  }

  function renderList() {
    list.innerHTML = filtered
      .map(
        (c, i) => `
      <li role="option">
        <button type="button" class="palette-item${i === activeIndex ? " is-active" : ""}" data-idx="${i}">
          <i class="fas ${c.icon}" aria-hidden="true"></i>
          <span>${escapeHtml(c.label)}</span>
        </button>
      </li>`
      )
      .join("");

    if (filtered.length === 0) {
      list.innerHTML =
        '<li class="repos-loading" style="padding:1rem;text-align:center;">No matches — try another word.</li>';
    }

    list.querySelectorAll(".palette-item").forEach((btn) => {
      btn.addEventListener("click", () => runCommand(filtered[parseInt(btn.dataset.idx, 10)]));
    });
  }

  function runCommand(c) {
    if (!c) return;
    closePalette();
    if (c.href) {
      if (c.external) window.open(c.href, "_blank", "noopener,noreferrer");
      else {
        const el = document.querySelector(c.href);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    if (typeof c.action === "function") c.action();
  }

  function moveActive(delta) {
    if (filtered.length === 0) return;
    activeIndex = (activeIndex + delta + filtered.length) % filtered.length;
    renderList();
    const activeBtn = list.querySelector(".palette-item.is-active");
    activeBtn?.scrollIntoView({ block: "nearest" });
  }

  document.addEventListener(
    "keydown",
    (e) => {
      if (!root.hidden && e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        closePalette();
        return;
      }

      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        if (!isTypingContext(document.activeElement) || document.activeElement === input) {
          e.preventDefault();
          if (root.hidden) openPalette();
          else closePalette();
        }
        return;
      }

      if (root.hidden && e.key === "/" && !isTypingContext(document.activeElement)) {
        e.preventDefault();
        openPalette();
        return;
      }

      if (!root.hidden && document.activeElement === input) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          moveActive(1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          moveActive(-1);
        } else if (e.key === "Enter") {
          e.preventDefault();
          runCommand(filtered[activeIndex]);
        }
      }
    },
    true
  );

  input.addEventListener("input", () => {
    filter(input.value);
    activeIndex = 0;
    renderList();
  });

  root.querySelectorAll("[data-close-palette]").forEach((el) => {
    el.addEventListener("click", closePalette);
  });

  if (fab) fab.addEventListener("click", () => openPalette());
}

/* —— GitHub public API —— */

function escapeHtml(str) {
  if (str == null) return "";
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function normalizeUrl(url) {
  if (!url) return "#";
  const t = String(url).trim();
  if (!t) return "#";
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  return "https://" + t;
}

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

async function fetchAllRepos(username) {
  const repos = [];
  let nextUrl = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=owner`;

  while (nextUrl) {
    const res = await fetch(nextUrl, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const page = await res.json();
    repos.push(...page);

    const link = res.headers.get("Link");
    nextUrl = null;
    if (link) {
      const nextMatch = link.match(/<([^>\s]+)>;\s*rel="next"/);
      if (nextMatch) nextUrl = nextMatch[1];
    }
  }

  return repos;
}

function renderProfile(user) {
  const loading = document.getElementById("github-profile-loading");
  const inner = document.getElementById("github-profile-inner");
  if (!inner) return;

  if (loading) loading.hidden = true;
  inner.hidden = false;

  const company = user.company
    ? `<span class="github-meta-inline">${escapeHtml(user.company)}</span>`
    : "";

  const loc = user.location
    ? `<span><i class="fas fa-location-dot" aria-hidden="true"></i>${escapeHtml(user.location)}</span>`
    : "";

  const blogRaw = user.blog && String(user.blog).trim();
  const blog = blogRaw
    ? `<a href="${escapeHtml(normalizeUrl(blogRaw))}" target="_blank" rel="noopener noreferrer"><i class="fas fa-link" aria-hidden="true"></i>${escapeHtml(blogRaw.replace(/^https?:\/\//i, ""))}</a>`
    : "";

  inner.innerHTML = `
    <img class="github-avatar" src="${escapeHtml(user.avatar_url)}" alt="" width="72" height="72" loading="lazy" decoding="async" />
    <div class="github-profile-text">
      <strong>${escapeHtml(user.name || user.login)}</strong>
      ${company}
      <div class="github-meta-row">${loc}${blog}</div>
      <dl class="github-stats-row">
        <div class="github-stat"><dt>Public repos</dt><dd>${user.public_repos}</dd></div>
        <div class="github-stat"><dt>Followers</dt><dd>${user.followers}</dd></div>
        <div class="github-stat"><dt>Following</dt><dd>${user.following}</dd></div>
      </dl>
    </div>
    <a class="btn btn-ghost btn-github-profile" href="${escapeHtml(user.html_url)}" target="_blank" rel="noopener noreferrer">View on GitHub</a>
  `;
}

function renderRepoCard(r) {
  const desc = r.description
    ? `<p class="repo-desc">${escapeHtml(r.description)}</p>`
    : `<p class="repo-desc muted">No description provided.</p>`;

  const badges = [];
  if (r.fork) badges.push(`<span class="repo-badge fork">Fork</span>`);
  if (r.archived) badges.push(`<span class="repo-badge archived">Archived</span>`);

  const lang = r.language
    ? `<span class="repo-lang"><span class="lang-dot" aria-hidden="true"></span>${escapeHtml(r.language)}</span>`
    : "";

  const homepageRaw = r.homepage && String(r.homepage).trim();
  const homepage = homepageRaw
    ? `<a href="${escapeHtml(normalizeUrl(homepageRaw))}" class="repo-homepage" target="_blank" rel="noopener noreferrer">Website</a>`
    : "";

  return `
    <article class="repo-card">
      <h3 class="repo-title">
        <a href="${escapeHtml(r.html_url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.name)}</a>
        ${badges.length ? `<span class="repo-badges">${badges.join("")}</span>` : ""}
      </h3>
      ${desc}
      <div class="repo-footer">
        ${lang}
        <span title="Stargazers"><i class="fas fa-star" aria-hidden="true"></i>${r.stargazers_count}</span>
        <span title="Forks"><i class="fas fa-code-branch" aria-hidden="true"></i>${r.forks_count}</span>
        <span title="Last push">${formatDate(r.pushed_at)}</span>
        ${homepage}
      </div>
    </article>
  `;
}

let githubReposCache = [];
let repoFilter = "all";
const REPO_PAGE_SIZE = 10;
let repoLimit = REPO_PAGE_SIZE;

function reposMatchingFilter() {
  if (repoFilter === "source") return githubReposCache.filter((r) => !r.fork);
  if (repoFilter === "fork") return githubReposCache.filter((r) => r.fork);
  return githubReposCache;
}

function renderRepoGrid() {
  const grid = document.getElementById("repos-grid");
  const countEl = document.getElementById("repos-count");
  const moreWrap = document.getElementById("repos-more-wrap");
  const moreBtn = document.getElementById("repos-more-btn");
  if (!grid) return;

  const list = reposMatchingFilter();
  const visible = list.slice(0, repoLimit);

  if (countEl) {
    countEl.textContent =
      list.length === 0
        ? "0 repositories"
        : `Showing ${visible.length} of ${list.length} repositor${list.length === 1 ? "y" : "ies"}`;
  }

  if (list.length === 0) {
    grid.innerHTML =
      '<p class="repos-loading">No repositories match this filter.</p>';
    if (moreWrap) moreWrap.hidden = true;
    return;
  }

  grid.innerHTML = visible.map(renderRepoCard).join("");
  grid.setAttribute("aria-busy", "false");

  if (moreWrap && moreBtn) {
    const hasMore = list.length > repoLimit;
    moreWrap.hidden = false;
    if (hasMore) {
      moreBtn.textContent = `Show all (${list.length - repoLimit} more)`;
      moreBtn.dataset.mode = "expand";
    } else if (repoLimit > REPO_PAGE_SIZE) {
      moreBtn.textContent = "Show less";
      moreBtn.dataset.mode = "collapse";
    } else {
      moreWrap.hidden = true;
    }
  }
}

function setupRepoFilters() {
  const toolbar = document.getElementById("repos-toolbar");
  const buttons = document.querySelectorAll(".repos-filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      repoFilter = btn.getAttribute("data-filter") || "all";
      repoLimit = REPO_PAGE_SIZE;
      buttons.forEach((b) => b.classList.toggle("active", b === btn));
      renderRepoGrid();
    });
  });
  if (toolbar) toolbar.hidden = false;

  const moreBtn = document.getElementById("repos-more-btn");
  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      const list = reposMatchingFilter();
      if (moreBtn.dataset.mode === "collapse") {
        repoLimit = REPO_PAGE_SIZE;
        const grid = document.getElementById("repos-grid");
        if (grid) {
          grid.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        repoLimit = list.length;
      }
      renderRepoGrid();
    });
  }
}

async function initGitHub() {
  const grid = document.getElementById("repos-grid");
  const note = document.getElementById("github-note");
  const loading = document.getElementById("github-profile-loading");

  try {
    const userRes = await fetch(
      `https://api.github.com/users/${GITHUB_USER}`,
      { headers: { Accept: "application/vnd.github+json" } }
    );
    if (userRes.ok) {
      renderProfile(await userRes.json());
    } else if (loading) {
      loading.textContent = "Could not load GitHub profile.";
    }
  } catch {
    if (loading) loading.textContent = "Could not load GitHub profile.";
  }

  try {
    githubReposCache = await fetchAllRepos(GITHUB_USER);
    githubReposCache.sort((a, b) => {
      const star = b.stargazers_count - a.stargazers_count;
      if (star !== 0) return star;
      return new Date(b.pushed_at) - new Date(a.pushed_at);
    });

    const loadingEl = document.getElementById("repos-loading");
    if (loadingEl) loadingEl.remove();

    clearReposSkeleton();
    setupRepoFilters();
    renderRepoGrid();

    if (note) {
      note.hidden = false;
      note.textContent =
        "Repositories load live from the GitHub API (same public data as your profile). Unauthenticated requests are rate-limited per IP.";
    }
  } catch (e) {
    console.error(e);
    clearReposSkeleton();
    if (grid) {
      grid.innerHTML = `<p class="github-error" role="alert">Unable to load repositories. Try again later or browse <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener noreferrer">github.com/${GITHUB_USER}</a>.</p>`;
      grid.setAttribute("aria-busy", "false");
    }
  }

  checkScroll();
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function initMagneticButtons() {
  if (prefersReducedMotion()) return;
  const isCoarse =
    window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  if (isCoarse) return;

  const targets = document.querySelectorAll(".magnetic");
  const STRENGTH = 14;

  targets.forEach((el) => {
    let rafId = null;
    let bounds = null;

    function compute(e) {
      if (!bounds) bounds = el.getBoundingClientRect();
      const cx = bounds.left + bounds.width / 2;
      const cy = bounds.top + bounds.height / 2;
      const dx = (e.clientX - cx) / (bounds.width / 2);
      const dy = (e.clientY - cy) / (bounds.height / 2);
      el.style.setProperty("--mx", `${dx * STRENGTH}px`);
      el.style.setProperty("--my", `${dy * STRENGTH}px`);
    }

    el.addEventListener("pointerenter", () => {
      bounds = el.getBoundingClientRect();
    });

    el.addEventListener("pointermove", (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => compute(e));
    });

    el.addEventListener("pointerleave", () => {
      if (rafId) cancelAnimationFrame(rafId);
      bounds = null;
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    });

    window.addEventListener(
      "scroll",
      () => {
        bounds = null;
      },
      { passive: true }
    );
  });
}

function initCardTilt() {
  if (prefersReducedMotion()) return;
  const isCoarse =
    window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  if (isCoarse) return;

  const cards = document.querySelectorAll("[data-tilt]");
  const MAX_TILT = 6;
  const PERSPECTIVE = 1000;

  cards.forEach((card) => {
    let rafId = null;
    let bounds = null;

    function reset() {
      card.style.transform = "perspective(" + PERSPECTIVE + "px) rotateX(0) rotateY(0)";
    }

    card.addEventListener("pointerenter", () => {
      bounds = card.getBoundingClientRect();
    });

    card.addEventListener("pointermove", (e) => {
      if (!bounds) bounds = card.getBoundingClientRect();
      const px = (e.clientX - bounds.left) / bounds.width;
      const py = (e.clientY - bounds.top) / bounds.height;
      const ry = (px - 0.5) * 2 * MAX_TILT;
      const rx = -(py - 0.5) * 2 * MAX_TILT;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
    });

    card.addEventListener("pointerleave", () => {
      if (rafId) cancelAnimationFrame(rafId);
      bounds = null;
      reset();
    });

    window.addEventListener(
      "scroll",
      () => {
        bounds = null;
      },
      { passive: true }
    );
  });
}

function showReposSkeleton() {
  const grid = document.getElementById("repos-grid");
  if (!grid) return;
  const skeletonHtml = Array.from({ length: 6 })
    .map(
      () => `
        <div class="skeleton-card" aria-hidden="true">
          <div class="skeleton-line title"></div>
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      `
    )
    .join("");
  grid.classList.add("repos-skeleton-grid");
  grid.innerHTML = skeletonHtml;
}

function clearReposSkeleton() {
  const grid = document.getElementById("repos-grid");
  if (!grid) return;
  grid.classList.remove("repos-skeleton-grid");
}

/* ============================================================
   STUDIO MONO motion helpers — split-text, section numerals,
   custom cursor, mask-reveal on scroll.
   ============================================================ */

function initSplitTextHero() {
  const el = document.querySelector(".hero-title");
  if (!el) return;
  if (el.dataset.split === "true") return;

  // Capture the raw text once for the split-text reveal
  const raw = (el.textContent || "").trim();
  if (!raw) return;

  el.textContent = "";
  el.dataset.split = "true";

  const words = raw.split(/(\s+)/);
  let charIndex = 0;

  words.forEach((word) => {
    if (/^\s+$/.test(word)) {
      const sp = document.createElement("span");
      sp.className = "char space";
      sp.setAttribute("aria-hidden", "true");
      sp.style.setProperty("--i", String(charIndex++));
      sp.innerHTML = "&nbsp;";
      el.appendChild(sp);
      return;
    }
    const wrap = document.createElement("span");
    wrap.className = "word serif";
    for (const ch of word) {
      const span = document.createElement("span");
      span.className = "char";
      span.setAttribute("aria-hidden", "true");
      span.style.setProperty("--i", String(charIndex++));
      span.textContent = ch;
      wrap.appendChild(span);
    }
    el.appendChild(wrap);
  });

  // Accessible label so screen readers still hear the real name
  el.setAttribute("aria-label", raw);
}

function initSectionNumerals() {
  const sections = [
    { sel: "#education", num: "01", label: "Education" },
    { sel: "#languages", num: "02", label: "Stack" },
    { sel: "#internship", num: "03", label: "Experience" },
    { sel: "#projects", num: "04", label: "Projects" },
    { sel: "#publications", num: "05", label: "Publications" },
    { sel: "#github", num: "06", label: "GitHub" },
    { sel: "#certifications", num: "07", label: "Recognition" },
    { sel: "#faq", num: "08", label: "FAQ" },
    { sel: "#contact", num: "09", label: "Contact" },
  ];

  sections.forEach(({ sel, num, label }) => {
    const section = document.querySelector(sel);
    if (!section) return;
    if (section.querySelector(":scope > .section-numeral, :scope > * > .section-numeral")) return;

    const heading = section.querySelector(".heading");
    const numeral = document.createElement("div");
    numeral.className = "section-numeral";
    numeral.setAttribute("aria-hidden", "true");
    numeral.innerHTML = `<span class="num">${num}</span><span class="label">— ${label}</span><span class="rule"></span>`;

    if (heading && heading.parentNode) {
      heading.parentNode.insertBefore(numeral, heading);
    } else {
      section.insertBefore(numeral, section.firstChild);
    }
  });
}

function initMaskReveal() {
  if (prefersReducedMotion()) {
    document.querySelectorAll(".image-container, .featured-media").forEach((el) => {
      el.classList.add("revealed");
    });
    return;
  }

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".image-container, .featured-media").forEach((el) => {
      el.classList.add("revealed");
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  document
    .querySelectorAll(".image-container, .featured-media")
    .forEach((el) => io.observe(el));
}

function init() {
  emailInit();
  initContactForm();
  initSplitTextHero();
  initSectionNumerals();
  initTyped();
  initNav();
  initScrollProgress();
  initScrollSpy();
  initHeroCanvas();
  initHeroSpotlight();
  initCommandPalette();
  initMagneticButtons();
  initCardTilt();
  initMaskReveal();
  showReposSkeleton();
  checkScroll();
  window.addEventListener("scroll", checkScroll, { passive: true });
  window.addEventListener("load", checkScroll);
  initGitHub();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
