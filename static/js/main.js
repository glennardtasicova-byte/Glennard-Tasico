// Portfolio Theme Switcher, Viewport-Aware Scroll Reveal, Role Typing Illumination & Animated Circuit Engine
function openGlennBotLivePopup(tabName, mode = "workspace_view", width = 1240, height = 860) {
  const isFullOrRelativeUrl =
    typeof tabName === "string" && /^(\/|https?:\/\/)/i.test(tabName.trim());
  const cleanTab = isFullOrRelativeUrl ? "scheduler" : String(tabName || "scheduler").trim();
  const url = isFullOrRelativeUrl
    ? tabName.trim()
    : `/glennbot-popout?popout_mode=${encodeURIComponent(mode)}&tab=${encodeURIComponent(cleanTab)}&_ts=${Date.now()}`;
  const availW = window.screen?.availWidth || window.screen?.width || 1440;
  const availH = window.screen?.availHeight || window.screen?.height || 900;
  const w = Math.min(width, availW - 40);
  const h = Math.min(height, availH - 80);
  const left = Math.max(0, Math.round((availW - w) / 2));
  const top = Math.max(0, Math.round((availH - h) / 2));
  const features = `width=${w},height=${h},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`;
  const win = window.open(url, `GlennBotExpanded_${cleanTab}`, features);
  if (win) win.focus();
  return win;
}
window.openGlennBotLivePopup = openGlennBotLivePopup;

function openGlennBotCustomPopup(url, windowName = "GlennBotCustomPopup", width = 1100, height = 860) {
  const cleanUrl = String(url || "/glennbot-popout").trim();
  const sep = cleanUrl.includes("?") ? "&" : "?";
  const finalUrl = cleanUrl.includes("_ts=") ? cleanUrl : `${cleanUrl}${sep}_ts=${Date.now()}`;
  const availW = window.screen?.availWidth || window.screen?.width || 1440;
  const availH = window.screen?.availHeight || window.screen?.height || 900;
  const w = Math.min(Number(width) || 1100, availW - 40);
  const h = Math.min(Number(height) || 860, availH - 80);
  const left = Math.max(0, Math.round((availW - w) / 2));
  const top = Math.max(0, Math.round((availH - h) / 2));
  const features = `width=${w},height=${h},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`;
  const win = window.open(finalUrl, String(windowName || "GlennBotCustomPopup"), features);
  if (win) win.focus();
  return win;
}
window.openGlennBotCustomPopup = openGlennBotCustomPopup;

const SHARED_SHOWCASE_CAPTION_TEXT =
  "Hello future clients! Feel free to leave a comment on this sample post, and this AI-powered chatbot (powered by Gemini) will instantly answer any questions you have about my background, skills, and services. Everything you need to know about me is already loaded into its knowledge base. Go ahead and test it out—drop a comment below!";

const COMMENT_SPLIT_PLATFORMS = {
  facebook: {
    key: "facebook",
    platformLabel: "Facebook",
    badgeText: "GlennBot Automations — Facebook Page",
    badgeClass: "is-facebook",
    iconClass: "fab fa-facebook",
    postTypeLabel: "Text Post • Live Gemini AI",
    recordId: "post_ext_dc6a96869a",
    commentId: "122118104811500702_1150007564513023",
    proxyDashboardUrl:
      "/glennbot-popout?popout_mode=comment_thread&record_id=post_ext_dc6a96869a&comment_id=122118104811500702_1150007564513023",
    upstreamDashboardUrl:
      "https://glennbotautomations.onrender.com/?popout_mode=comment_thread&record_id=post_ext_dc6a96869a&comment_id=122118104811500702_1150007564513023",
    actualPostUrl: "https://www.facebook.com/61595021080265/posts/122118104811500702/",
    primaryBtnText: "Open / Focus Actual Facebook Post Window",
    dashboardWindowName: "GlennBotCommentThread_FB",
    dockedWindowName: "GlennBotDockedSocialPost_facebook",
    caption: SHARED_SHOWCASE_CAPTION_TEXT,
  },
  instagram: {
    key: "instagram",
    platformLabel: "Instagram",
    badgeText: "GlennBot Automations — Instagram",
    badgeClass: "is-instagram",
    iconClass: "fab fa-instagram",
    postTypeLabel: "Image Post • Live Gemini AI (@glennard.tasico.va)",
    recordId: "post_ext_b10078462e",
    commentId: "18198560143393683",
    proxyDashboardUrl:
      "/glennbot-popout?popout_mode=comment_thread&record_id=post_ext_b10078462e&comment_id=18198560143393683",
    upstreamDashboardUrl:
      "https://glennbotautomations.onrender.com/?popout_mode=comment_thread&record_id=post_ext_b10078462e&comment_id=18198560143393683",
    actualPostUrl: "https://www.instagram.com/p/DfkfvyEvx3b/",
    primaryBtnText: "Open / Focus Actual Instagram Post Window",
    dashboardWindowName: "GlennBotCommentThread_IG",
    dockedWindowName: "GlennBotDockedSocialPost_instagram",
    caption: SHARED_SHOWCASE_CAPTION_TEXT,
  },
};
window.COMMENT_SPLIT_PLATFORMS = COMMENT_SPLIT_PLATFORMS;

let activeCommentSplitPlatform = "facebook";
let activeDockedSocialPopupRef = null;

function computeRightDockedPopupFeatures() {
  const availW = window.screen?.availWidth || window.innerWidth || 1440;
  const availH = window.screen?.availHeight || window.innerHeight || 900;
  const screenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX || 0;
  const screenTop = window.screenTop !== undefined ? window.screenTop : window.screenY || 0;
  const popupWidth = Math.max(480, Math.round(availW * 0.42));
  const popupHeight = Math.max(680, Math.round(availH * 0.86));
  const popupLeft = Math.round(screenLeft + availW - popupWidth - 20);
  const popupTop = Math.round(screenTop + (availH - popupHeight) / 2);
  const features = `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop},menubar=no,toolbar=no,location=yes,status=no,resizable=yes,scrollbars=yes`;
  return {
    popupWidth,
    popupHeight,
    popupLeft,
    popupTop,
    features,
  };
}
window.computeRightDockedPopupFeatures = computeRightDockedPopupFeatures;

function openDockedSocialPostPopup(platform) {
  const platKey =
    platform && COMMENT_SPLIT_PLATFORMS[String(platform).toLowerCase()]
      ? String(platform).toLowerCase()
      : activeCommentSplitPlatform;
  const cfg = COMMENT_SPLIT_PLATFORMS[platKey] || COMMENT_SPLIT_PLATFORMS.facebook;
  const { features } = computeRightDockedPopupFeatures();
  const win = window.open(cfg.actualPostUrl, cfg.dockedWindowName, features);
  if (win) {
    activeDockedSocialPopupRef = win;
    win.focus();
  }
  return win;
}
window.openDockedSocialPostPopup = openDockedSocialPostPopup;

function updateCommentSplitWorkspaceDOM(platform, reloadIframe = true) {
  const platKey =
    platform && COMMENT_SPLIT_PLATFORMS[String(platform).toLowerCase()]
      ? String(platform).toLowerCase()
      : "facebook";
  activeCommentSplitPlatform = platKey;
  const cfg = COMMENT_SPLIT_PLATFORMS[platKey];
  const ts = Date.now();

  const fbBtn = document.getElementById("gb-split-toggle-facebook");
  const igBtn = document.getElementById("gb-split-toggle-instagram");
  if (fbBtn) fbBtn.classList.toggle("is-active", platKey === "facebook");
  if (igBtn) igBtn.classList.toggle("is-active", platKey === "instagram");

  const iframe = document.getElementById("gb-comment-split-iframe");
  if (iframe && reloadIframe) {
    iframe.setAttribute("data-upstream-url", `${cfg.upstreamDashboardUrl}&_ts=${ts}`);
    iframe.setAttribute("data-platform", platKey);
    iframe.src = `${cfg.proxyDashboardUrl}&_ts=${ts}`;
  }

  const badgeEl = document.getElementById("gb-split-platform-badge");
  const badgeIconEl = document.getElementById("gb-split-platform-badge-icon");
  const badgeTextEl = document.getElementById("gb-split-platform-badge-text");
  if (badgeEl) {
    badgeEl.classList.remove("is-facebook", "is-instagram");
    badgeEl.classList.add(cfg.badgeClass);
  }
  if (badgeIconEl) badgeIconEl.className = cfg.iconClass;
  if (badgeTextEl) badgeTextEl.textContent = cfg.badgeText;

  const postTypeTag = document.getElementById("gb-split-post-type-tag");
  if (postTypeTag) postTypeTag.textContent = cfg.postTypeLabel;

  const captionTextEl = document.getElementById("gb-split-caption-text");
  if (captionTextEl) captionTextEl.textContent = `"${cfg.caption}"`;

  const actualLinkEl = document.getElementById("gb-split-actual-post-link");
  if (actualLinkEl) {
    actualLinkEl.href = cfg.actualPostUrl;
    actualLinkEl.textContent = cfg.actualPostUrl;
  }

  const stepPlatNameEl = document.getElementById("gb-split-step-platform-name");
  if (stepPlatNameEl) stepPlatNameEl.textContent = cfg.platformLabel;

  const primaryBtnIcon = document.getElementById("gb-split-primary-btn-icon");
  const primaryBtnText = document.getElementById("gb-split-primary-btn-text");
  if (primaryBtnIcon) primaryBtnIcon.className = cfg.iconClass;
  if (primaryBtnText) primaryBtnText.textContent = cfg.primaryBtnText;
}

function openCommentSplitWorkspace(platform = "facebook", autoOpenDocked = true) {
  const platKey =
    platform && COMMENT_SPLIT_PLATFORMS[String(platform).toLowerCase()]
      ? String(platform).toLowerCase()
      : "facebook";
  closeCommentPlatformChooser();

  // Open the right-docked actual social post window immediately on the user's click gesture
  if (autoOpenDocked) {
    openDockedSocialPostPopup(platKey);
  }

  const modal = document.getElementById("gb-comment-split-workspace-modal");
  if (!modal) {
    const cfg = COMMENT_SPLIT_PLATFORMS[platKey] || COMMENT_SPLIT_PLATFORMS.facebook;
    return openGlennBotCustomPopup(cfg.proxyDashboardUrl, cfg.dashboardWindowName, 1100, 860);
  }

  updateCommentSplitWorkspaceDOM(platKey, true);
  modal.hidden = false;
  document.body.style.overflow = "hidden";

  if (!modal.dataset.boundSplitListeners) {
    modal.dataset.boundSplitListeners = "true";
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeCommentSplitWorkspace();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) {
        e.stopPropagation();
        closeCommentSplitWorkspace();
      }
    });
  }
}
window.openCommentSplitWorkspace = openCommentSplitWorkspace;

function switchCommentSplitPlatform(platform = "facebook", autoOpenDocked = true) {
  const platKey =
    platform && COMMENT_SPLIT_PLATFORMS[String(platform).toLowerCase()]
      ? String(platform).toLowerCase()
      : "facebook";
  if (autoOpenDocked) {
    openDockedSocialPostPopup(platKey);
  }
  updateCommentSplitWorkspaceDOM(platKey, true);
}
window.switchCommentSplitPlatform = switchCommentSplitPlatform;

function refreshCommentSplitIframe() {
  const cfg =
    COMMENT_SPLIT_PLATFORMS[activeCommentSplitPlatform] ||
    COMMENT_SPLIT_PLATFORMS.facebook;
  const iframe = document.getElementById("gb-comment-split-iframe");
  const icon = document.getElementById("gb-split-refresh-icon");
  const ts = Date.now();
  if (icon) {
    icon.classList.add("fa-spin");
    window.setTimeout(() => icon.classList.remove("fa-spin"), 700);
  }
  if (iframe) {
    iframe.setAttribute("data-upstream-url", `${cfg.upstreamDashboardUrl}&_ts=${ts}`);
    iframe.src = `${cfg.proxyDashboardUrl}&_ts=${ts}`;
  }
}
window.refreshCommentSplitIframe = refreshCommentSplitIframe;

function openLeftDashboardInSeparateWindow() {
  const cfg =
    COMMENT_SPLIT_PLATFORMS[activeCommentSplitPlatform] ||
    COMMENT_SPLIT_PLATFORMS.facebook;
  return openGlennBotCustomPopup(cfg.proxyDashboardUrl, cfg.dashboardWindowName, 1100, 860);
}
window.openLeftDashboardInSeparateWindow = openLeftDashboardInSeparateWindow;

function closeCommentSplitWorkspace() {
  const modal = document.getElementById("gb-comment-split-workspace-modal");
  if (modal) {
    modal.hidden = true;
    const inspectorModal = document.getElementById("project-inspector-modal");
    if (!inspectorModal || inspectorModal.hidden) {
      document.body.style.overflow = "";
    }
  }
}
window.closeCommentSplitWorkspace = closeCommentSplitWorkspace;

function openCommentPlatformChooser() {
  const chooser = document.getElementById("gb-comment-platform-chooser-modal");
  if (!chooser) {
    return openCommentSplitWorkspace("facebook", true);
  }
  chooser.hidden = false;
  if (!chooser.dataset.boundListeners) {
    chooser.dataset.boundListeners = "true";
    chooser.addEventListener("click", (e) => {
      if (e.target === chooser) closeCommentPlatformChooser();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !chooser.hidden) {
        e.stopPropagation();
        closeCommentPlatformChooser();
      }
    });
  }
}
window.openCommentPlatformChooser = openCommentPlatformChooser;

function closeCommentPlatformChooser() {
  const chooser = document.getElementById("gb-comment-platform-chooser-modal");
  if (chooser) chooser.hidden = true;
}
window.closeCommentPlatformChooser = closeCommentPlatformChooser;

(function () {
  const STORAGE_KEY = "glenn_portfolio_theme";

  function applyTheme(theme) {
    const root = document.documentElement;
    const toggleBtn = document.getElementById("theme-toggle");
    const normalized = theme === "light" ? "light" : "dark";
    root.setAttribute("data-theme", normalized);

    if (toggleBtn) {
      const nextModeLabel =
        normalized === "dark" ? "Switch to light mode" : "Switch to dark mode";
      toggleBtn.setAttribute("aria-label", nextModeLabel);
      toggleBtn.setAttribute("title", nextModeLabel);
      toggleBtn.setAttribute(
        "aria-pressed",
        normalized === "light" ? "true" : "false"
      );
    }
  }

  function initThemeToggle() {
    const root = document.documentElement;
    const toggleBtn = document.getElementById("theme-toggle");

    let currentTheme = root.getAttribute("data-theme") || "dark";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        currentTheme = saved;
      }
    } catch (e) {
      // Ignore storage access errors in restricted frames
    }
    applyTheme(currentTheme);

    if (toggleBtn && !toggleBtn.dataset.themeBound) {
      toggleBtn.dataset.themeBound = "true";
      toggleBtn.addEventListener("click", () => {
        const active =
          root.getAttribute("data-theme") === "light" ? "light" : "dark";
        const next = active === "dark" ? "light" : "dark";
        applyTheme(next);
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch (e) {
          // Ignore storage write errors
        }
      });
    }
  }

  function initRoleTypingEffect() {
    const roleEl = document.getElementById("hero-typing-role");
    if (!roleEl || roleEl.dataset.typingInitialized) return;
    roleEl.dataset.typingInitialized = "true";

    const fullText = (
      roleEl.getAttribute("data-typing-text") ||
      roleEl.textContent ||
      "AI Automation Specialist & Web Application Developer"
    ).trim();

    roleEl.setAttribute("aria-label", fullText);
    roleEl.textContent = "";

    const charSpans = [];
    const words = fullText.split(" ");

    words.forEach((word, wIdx) => {
      const wordWrap = document.createElement("span");
      wordWrap.className = "role-word";
      wordWrap.setAttribute("aria-hidden", "true");

      for (let i = 0; i < word.length; i++) {
        const chSpan = document.createElement("span");
        chSpan.className = "role-char";
        chSpan.textContent = word[i];
        wordWrap.appendChild(chSpan);
        charSpans.push(chSpan);
      }

      roleEl.appendChild(wordWrap);

      if (wIdx < words.length - 1) {
        const spaceSpan = document.createElement("span");
        spaceSpan.className = "role-char role-space";
        spaceSpan.setAttribute("aria-hidden", "true");
        spaceSpan.textContent = " ";
        roleEl.appendChild(spaceSpan);
        charSpans.push(spaceSpan);
      }
    });

    if (!charSpans.length) return;

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      charSpans.forEach((sp) => sp.classList.add("is-lit"));
      charSpans[charSpans.length - 1].classList.add("is-caret-pos");
      return;
    }

    const TYPING_SPEED_MS = 48; // Normal per-letter typing speed
    const REPEAT_DELAY_MS = 5000; // Wait 5 seconds before repeating the typing cycle
    let currentIdx = -1;

    function setCaretAt(index) {
      for (let i = 0; i < charSpans.length; i++) {
        if (i === index) {
          charSpans[i].classList.add("is-caret-pos");
        } else {
          charSpans[i].classList.remove("is-caret-pos");
        }
      }
    }

    function startTypingPass() {
      // Reset all letters to dim/faint ("malabo / matamlay na kulay") while keeping the full word intact
      for (let i = 0; i < charSpans.length; i++) {
        charSpans[i].classList.remove("is-lit", "is-caret-pos");
      }
      currentIdx = 0;

      function stepLetter() {
        if (window.__PAUSE_BG_ANIMATIONS) return;
        if (currentIdx < charSpans.length) {
          charSpans[currentIdx].classList.add("is-lit");
          setCaretAt(currentIdx);
          currentIdx++;
          window.setTimeout(stepLetter, TYPING_SPEED_MS);
        } else {
          // Keep blinking "|" at the end of the fully lit title for 5 seconds, then replay
          setCaretAt(charSpans.length - 1);
          window.setTimeout(startTypingPass, REPEAT_DELAY_MS);
        }
      }

      stepLetter();
    }

    // Start the first typing pass right as Step 3 ("AI Automation Specialist & Web Application Developer") floats in
    window.setTimeout(startTypingPass, 580);
  }

  function initScrollReveal() {
    const revealItems = Array.from(document.querySelectorAll(".scroll-reveal"));
    if (!revealItems.length) return;

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      revealItems.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    revealItems.forEach((el) => {
      const rawDelay = parseInt(
        el.getAttribute("data-reveal-delay") || "0",
        10
      );
      const delayMs = Number.isFinite(rawDelay) ? Math.max(0, rawDelay) : 0;
      el.style.setProperty("--reveal-delay", `${delayMs}ms`);

      // Keep the Hero outer card container visible at t=0 so its inner .hero-intro-item elements play their sequential float-in cleanly
      if (el.classList.contains("resume-header-card")) {
        el.classList.add("is-visible");
      }
    });

    document.documentElement.classList.add("js-scroll-ready");

    let ticking = false;

    function updateRevealStates() {
      ticking = false;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const docHeight = document.documentElement.scrollHeight;
      const nearPageBottom = scrollY + vh >= docHeight - 28;

      const topExitBoundary = 82;
      const bottomEnterBoundary = nearPageBottom ? vh * 0.99 : vh * 0.91;

      revealItems.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isInsideViewport =
          rect.top < bottomEnterBoundary && rect.bottom > topExitBoundary;

        if (isInsideViewport) {
          el.classList.remove("is-scrolled-past");
          el.classList.add("is-visible");
        } else if (rect.bottom <= topExitBoundary) {
          el.classList.remove("is-visible");
          el.classList.add("is-scrolled-past");
        } else {
          el.classList.remove("is-visible", "is-scrolled-past");
        }
      });
    }

    function requestTick() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateRevealStates);
      }
    }

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick, { passive: true });

    // Wait one paint frame after adding .js-scroll-ready so initial-viewport elements smoothly float in
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(updateRevealStates);
    });
  }

  function initCircuitCanvas() {
    const canvas = document.getElementById("circuit-bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let traces = [];
    let pulses = [];

    function createSeededRandom(seed) {
      let s = seed;
      return function () {
        s = (s * 1664525 + 1013904223) % 4294967296;
        return s / 4294967296;
      };
    }

    function buildCircuitNetwork() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth || document.documentElement.clientWidth;
      height = window.innerHeight || document.documentElement.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      traces = [];
      pulses = [];

      const rand = createSeededRandom(20261107);
      const gridStep = width < 768 ? 56 : 68;
      const cols = Math.ceil(width / gridStep) + 1;
      const rows = Math.ceil(height / gridStep) + 1;

      const traceCount = width < 768 ? 22 : 38;
      const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
      ];

      for (let t = 0; t < traceCount; t++) {
        let cx = Math.floor(rand() * cols) * gridStep;
        let cy = Math.floor(rand() * rows) * gridStep;
        const points = [{ x: cx, y: cy }];
        const segments = 3 + Math.floor(rand() * 4);

        for (let s = 0; s < segments; s++) {
          const useChamfer = s % 2 === 1 && rand() > 0.35;
          const dirIdx = useChamfer
            ? 4 + Math.floor(rand() * 4)
            : Math.floor(rand() * 4);
          const dir = dirs[dirIdx];
          const stepMult = useChamfer ? 1 : 1 + Math.floor(rand() * 3);
          const nx = cx + dir[0] * gridStep * stepMult;
          const ny = cy + dir[1] * gridStep * stepMult;

          if (
            nx < -gridStep ||
            nx > width + gridStep ||
            ny < -gridStep ||
            ny > height + gridStep
          ) {
            continue;
          }
          if (nx === cx && ny === cy) continue;

          points.push({ x: nx, y: ny });
          cx = nx;
          cy = ny;
        }

        if (points.length >= 2) {
          const segLengths = [];
          let totalLen = 0;
          for (let i = 0; i < points.length - 1; i++) {
            const dx = points[i + 1].x - points[i].x;
            const dy = points[i + 1].y - points[i].y;
            const len = Math.hypot(dx, dy);
            segLengths.push(len);
            totalLen += len;
          }

          if (totalLen > 40) {
            const isCyanVariant = t % 3 === 0;
            traces.push({
              points,
              segLengths,
              totalLen,
              isCyanVariant,
            });
          }
        }
      }

      const pulseCount = Math.min(traces.length, width < 768 ? 16 : 28);
      for (let i = 0; i < pulseCount; i++) {
        const trace = traces[i % traces.length];
        pulses.push({
          trace,
          dist: rand() * trace.totalLen,
          speed: 55 + rand() * 75,
          tailLen: 48 + rand() * 44,
          direction: i % 4 === 0 ? -1 : 1,
        });
      }
    }

    function getPointAtDistance(trace, d) {
      const clamped = Math.max(0, Math.min(trace.totalLen, d));
      let acc = 0;
      for (let i = 0; i < trace.segLengths.length; i++) {
        const segLen = trace.segLengths[i];
        if (clamped <= acc + segLen || i === trace.segLengths.length - 1) {
          const t = segLen > 0 ? (clamped - acc) / segLen : 0;
          const p0 = trace.points[i];
          const p1 = trace.points[i + 1];
          return {
            x: p0.x + (p1.x - p0.x) * t,
            y: p0.y + (p1.y - p0.y) * t,
          };
        }
        acc += segLen;
      }
      return trace.points[trace.points.length - 1];
    }

    let lastTime = performance.now();

    function renderFrame(now) {
      if (window.__PAUSE_BG_ANIMATIONS) return;
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      const isLight =
        document.documentElement.getAttribute("data-theme") === "light";

      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = 1.25;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 0; i < traces.length; i++) {
        const tr = traces[i];
        ctx.strokeStyle = isLight
          ? tr.isCyanVariant
            ? "rgba(2, 132, 199, 0.14)"
            : "rgba(5, 150, 105, 0.15)"
          : tr.isCyanVariant
          ? "rgba(12, 230, 255, 0.10)"
          : "rgba(0, 214, 155, 0.11)";

        ctx.beginPath();
        ctx.moveTo(tr.points[0].x, tr.points[0].y);
        for (let j = 1; j < tr.points.length; j++) {
          ctx.lineTo(tr.points[j].x, tr.points[j].y);
        }
        ctx.stroke();

        const startPt = tr.points[0];
        const endPt = tr.points[tr.points.length - 1];
        ctx.fillStyle = isLight
          ? "rgba(5, 150, 105, 0.22)"
          : "rgba(0, 214, 155, 0.20)";

        ctx.beginPath();
        ctx.arc(startPt.x, startPt.y, 2.6, 0, Math.PI * 2);
        ctx.arc(endPt.x, endPt.y, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < pulses.length; i++) {
        const p = pulses[i];
        if (!prefersReducedMotion) {
          p.dist += p.speed * dt * p.direction;
          if (p.direction > 0 && p.dist > p.trace.totalLen + p.tailLen) {
            p.dist = -10;
          } else if (p.direction < 0 && p.dist < -p.tailLen) {
            p.dist = p.trace.totalLen + 10;
          }
        }

        const headDist = p.dist;
        const tailDist = p.dist - p.tailLen * p.direction;

        const visibleStart = Math.max(0, Math.min(p.trace.totalLen, tailDist));
        const visibleEnd = Math.max(0, Math.min(p.trace.totalLen, headDist));

        if (Math.abs(visibleEnd - visibleStart) < 2) continue;

        const steps = 8;
        ctx.beginPath();
        for (let s = 0; s <= steps; s++) {
          const d = visibleStart + ((visibleEnd - visibleStart) * s) / steps;
          const pt = getPointAtDistance(p.trace, d);
          if (s === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }

        const headPt = getPointAtDistance(p.trace, visibleEnd);
        const tailPt = getPointAtDistance(p.trace, visibleStart);

        const grad = ctx.createLinearGradient(
          tailPt.x,
          tailPt.y,
          headPt.x,
          headPt.y
        );

        if (isLight) {
          const headColor = p.trace.isCyanVariant
            ? "rgba(2, 132, 199, 0.72)"
            : "rgba(5, 150, 105, 0.75)";
          grad.addColorStop(0, "rgba(5, 150, 105, 0)");
          grad.addColorStop(1, headColor);
        } else {
          const headColor = p.trace.isCyanVariant
            ? "rgba(12, 230, 255, 0.78)"
            : "rgba(0, 214, 155, 0.80)";
          grad.addColorStop(0, "rgba(0, 214, 155, 0)");
          grad.addColorStop(1, headColor);
        }

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        if (headDist >= 0 && headDist <= p.trace.totalLen) {
          ctx.beginPath();
          ctx.arc(headPt.x, headPt.y, 2.7, 0, Math.PI * 2);
          ctx.fillStyle = isLight
            ? p.trace.isCyanVariant
              ? "#0284c7"
              : "#059669"
            : p.trace.isCyanVariant
            ? "#0ce6ff"
            : "#00d69b";
          ctx.fill();
        }
      }

      if (!prefersReducedMotion && !window.__PAUSE_BG_ANIMATIONS) {
        window.requestAnimationFrame(renderFrame);
      }
    }

    buildCircuitNetwork();
    window.addEventListener("resize", buildCircuitNetwork, { passive: true });
    window.requestAnimationFrame(renderFrame);
  }

  function initFeaturedProjectsInspector() {
    const modal = document.getElementById("project-inspector-modal");
    if (!modal || modal.dataset.boundInspector) return;
    modal.dataset.boundInspector = "true";

    const closeBtn = document.getElementById("project-modal-close");
    const sysIdEl = document.getElementById("modal-project-sysid");
    const categoryEl = document.getElementById("modal-project-category");
    const endpointEl = document.getElementById("modal-project-endpoint");
    const titleEl = document.getElementById("modal-project-title");

    const tabButtons = Array.from(modal.querySelectorAll("[data-modal-tab]"));
    const panelCaseStudy = document.getElementById("modal-panel-case-study");
    const panelSourceCode = document.getElementById("modal-panel-source-code");
    const panelLiveWidget = document.getElementById("modal-panel-live-widget");

    const PROJECTS_DATA = {
      "social-scheduler": {
        sysId: "SYS-01",
        category: "Social & AI Publishing",
        endpoint: "POST /api/ai/ask • POST /api/schedule • GET & DELETE /api/scheduled",
        demoEndpoint: "/api/demo/ai-caption",
        title: "AI Content & Omnichannel Social Scheduler",
        tagline: "Context-Aware Gemini 3.5 Flash Caption Engine + Multi-Platform APScheduler Queue",
        pipelineNodes: [
          { label: "Create Post UI", title: "Gemini 3.5 Flash + Live Web Search", accent: false },
          { label: "Media & Queue DB", title: "Zernio Presign • GDrive • Cloudinary • PostgreSQL", accent: true },
          { label: "Auto-Dispatch & Sync", title: "APScheduler + Zernio Omnichannel API", accent: false },
        ],
        bottleneck:
          "Marketing and operations teams were spending 12+ hours weekly manually researching topics, writing platform-specific social copy, formatting media assets, and logging into separate dashboards to schedule and track posts across Facebook, Instagram, TikTok, and YouTube.",
        solution:
          "Architected a native FastAPI publishing engine (routers/scheduler_routes.py, routers/ai_routes.py & services/ai_service.py) powering Create Post, Queue, and Content Calendar. It enriches topics with free live web search (Bing RSS, Google News RSS & Wikipedia), generates platform-tailored titles, captions & hashtags via Google Gemini 3.5 Flash, streams media through Zernio Presigned Cloud, Google Drive Vault, and Cloudinary CDN, persists queue records in PostgreSQL (glennbot_scheduled_posts), and dispatches synchronized posts via APScheduler (SQLAlchemyJobStore) and Zernio API.",
        architectureSteps: [
          "**Create Post & AI Generation (`POST /api/ai/ask`)** — User submits a topic in the **Create Post** studio; FastAPI enriches context with live web search (Bing/Google News/Wikipedia) and calls **Google Gemini 3.5 Flash** (`gemini-3.5-flash`) to generate tailored FB, IG, TikTok & YouTube titles, captions, and hashtags.",
          "**3-Tier Cloud Media & DB Persistence (`POST /api/schedule`)** — Immediately inserts the record into **PostgreSQL (`glennbot_scheduled_posts`)** with `processing_payload` status while uploading Reels, 16:9 Videos, or Image Albums via **Zernio Presign, Google Drive Vault, or Cloudinary CDN**.",
          "**Native Scheduled Dispatch & Auto-Cleanup (`APScheduler` + `Zernio API`)** — Pre-registers the schedule on Zernio and queues native Python **APScheduler** jobs (`post_to_facebook`, `post_to_instagram`, `post_to_tiktok`, `post_to_youtube`), plus automated Cloudinary media cleanup 20 minutes after publishing.",
          "**Live Queue & Content Calendar Sync (`GET & DELETE /api/scheduled`)** — Real-time status reconciliation (`sync_single_scheduled_row_with_zernio`) powers both the **Queue Table** and **Monthly Content Calendar** with live statuses (`waiting`, `published`, `failed`), published permalinks, and instant job cancellation.",
        ],
        metrics: [
          { value: "85% Faster", label: "Content Production" },
          { value: "4 Channels", label: "FB • IG • TikTok • YT" },
          { value: "24/7 Queue", label: "APScheduler + PostgreSQL" },
        ],
        sourceFile: "routers/scheduler_routes.py & routers/ai_routes.py",
        sourceCode: `# routers/scheduler_routes.py & routers/ai_routes.py
from fastapi import APIRouter, Form, File, UploadFile, Request
from fastapi.concurrency import run_in_threadpool
from sqlalchemy import text
from datetime import datetime, timedelta
from typing import Optional, List
import uuid, threading, pytz

from core.database import db_engine, scheduler, _coerce_db_datetime
from services.ai_service import _execute_glennbot_ask_ai_core
from services.zernio_service import (
    register_scheduled_post_on_zernio, post_to_facebook, post_to_instagram,
    post_to_tiktok, post_to_youtube, _cancel_zernio_scheduled_post, cleanup_cloudinary
)

router = APIRouter()

# 1. CREATE POST — ASK AI CAPTION & HASHTAG GENERATOR (Gemini 3.5 Flash + Live Web Search)
@router.post("/api/ai/ask")
async def api_ask_ai(request: Request):
    body = await request.json()
    return await run_in_threadpool(
        lambda: _execute_glennbot_ask_ai_core(
            user_topic=str(body.get("topic") or body.get("prompt") or "").strip(),
            tone_str=str(body.get("tone") or "engaging").strip(),
            lang_str=str(body.get("language") or "taglish").strip(),
            post_type_str=str(body.get("post_type") or "reels").strip(),
            platforms_list=body.get("platforms") or ["facebook", "instagram", "tiktok", "youtube"],
            use_search=bool(body.get("use_search", True)),
        )
    )

# 2. CREATE POST — NATIVE OMNICHANNEL SCHEDULER & 3-TIER CLOUD MEDIA PIPELINE
@router.post("/api/schedule")
async def receive_schedule(
    platform: str = Form(...), post_type: str = Form(...), pageId: str = Form(""),
    accountName: str = Form(""), date_val: str = Form("", alias="date"),
    time_val: str = Form("", alias="time"), title: str = Form(""), caption: str = Form(""),
    thumbnail: Optional[UploadFile] = File(None), media: Optional[UploadFile] = File(None),
    media_files: Optional[List[UploadFile]] = File(None),
    vault_media_file_id: str = Form(""), vault_thumb_file_id: str = Form(""),
):
    manila_tz = pytz.timezone("Asia/Manila")
    now_manila = datetime.now(manila_tz)
    scheduled_time = (
        manila_tz.localize(datetime.strptime(f"{date_val} {time_val}", "%Y-%m-%d %H:%M"))
        if (date_val and time_val) else (now_manila + timedelta(seconds=10))
    )
    record_id = f"post_{uuid.uuid4().hex[:12]}"

    # Persist row in PostgreSQL immediately so Queue & Calendar never lose track of a post
    def _insert_initial_sched_row():
        with db_engine.begin() as conn:
            conn.execute(
                text("""
                    INSERT INTO glennbot_scheduled_posts
                    (id, platform, page_id, account_name, post_type, caption,
                     media_preview_url, scheduled_time, status, status_message)
                    VALUES (:id, :platform, :page_id, :account_name, :post_type, :caption,
                            :preview, :sched_time, 'processing_payload', :status_msg)
                """),
                {
                    "id": record_id, "platform": platform, "page_id": pageId,
                    "account_name": accountName or platform.capitalize(),
                    "post_type": post_type, "caption": title.strip() or caption,
                    "preview": f"/api/files/{vault_media_file_id}/stream" if vault_media_file_id else "",
                    "sched_time": scheduled_time,
                    "status_msg": "Processing Payload • Uploading media & queueing...",
                },
            )

    await run_in_threadpool(_insert_initial_sched_row)

    # Offload Zernio Presign / Google Drive Vault / Cloudinary upload & APScheduler registration
    threading.Thread(
        target=_process_schedule_payload_background,
        args=(record_id, platform, post_type, pageId, accountName, title, caption, scheduled_time),
        daemon=True,
    ).start()

    return {"status": "success", "id": record_id, "queue_status": "processing_payload"}

# 3. QUEUE & CONTENT CALENDAR — LIVE POSTGRESQL + ZERNIO STATUS SYNC
@router.get("/api/scheduled")
def get_scheduled_posts(month: Optional[int] = None, year: Optional[int] = None):
    manila_tz = pytz.timezone("Asia/Manila")
    with db_engine.connect() as conn:
        rows = conn.execute(
            text("""
                SELECT id, platform, page_id, account_name, post_type, caption,
                       media_preview_url, scheduled_time, status, status_message,
                       external_post_id, permalink_url, created_at
                FROM glennbot_scheduled_posts
                ORDER BY scheduled_time ASC
            """)
        ).mappings().all()

        items = []
        for r in rows:
            r_dict = dict(r)
            sched_dt = _coerce_db_datetime(r_dict.get("scheduled_time"), manila_tz)
            if month and year and (not sched_dt or sched_dt.month != int(month) or sched_dt.year != int(year)):
                continue
            synced = sync_single_scheduled_row_with_zernio(r_dict)
            items.append({
                "id": r_dict["id"],
                "platform": r_dict["platform"],
                "account_name": r_dict["account_name"],
                "post_type": r_dict["post_type"],
                "caption": r_dict["caption"] or "",
                "media_preview_url": r_dict["media_preview_url"] or "",
                "scheduled_iso": sched_dt.isoformat() if sched_dt else "",
                "status": synced["status"],
                "permalink_url": synced["permalink_url"],
            })
        return {"status": "success", "items": items}

# 4. QUEUE & CALENDAR — CANCEL SCHEDULED JOB & CLEANUP CLOUD MEDIA
@router.delete("/api/scheduled/{record_id}")
def delete_scheduled_post(record_id: str):
    try:
        scheduler.remove_job(record_id)
    except Exception:
        pass
    with db_engine.begin() as conn:
        conn.execute(text("DELETE FROM glennbot_scheduled_posts WHERE id = :id"), {"id": record_id})
    return {"status": "success"}`,
        widgetFields: [
          {
            name: "topic",
            label: "Campaign Topic / Operational Update",
            type: "text",
            value: "Automated Omnichannel Social Publishing with FastAPI + Gemini 3.5 Flash",
          },
          {
            name: "tone",
            label: "AI Brand Voice & Tone",
            type: "select",
            options: [
              "Executive & High-Converting",
              "Taglish Tech Builder",
              "Engaging & Story-Driven",
            ],
          },
          {
            name: "platforms",
            label: "Target Social Channels (Comma-separated)",
            type: "text",
            value: "facebook, instagram, tiktok, youtube",
          },
        ],
      },
      "omnichannel-inbox": {
        sysId: "SYS-02",
        category: "Omnichannel & AI Triage",
        endpoint: "POST /api/v1/inbox/triage",
        demoEndpoint: "/api/demo/inbox-triage",
        title: "Unified Omnichannel Inbox & Smart Auto-Responder",
        tagline: "AI Intent Classification, Priority Scoring & Instant Multi-Channel Reply Engine",
        pipelineNodes: [
          { label: "Inbound", title: "SMS / SMTP / Social DM", accent: false },
          { label: "AI Classifier", title: "Intent & Priority Triage", accent: true },
          { label: "Action", title: "TextBee SMS + CRM Sync", accent: false },
        ],
        bottleneck:
          "Client inquiries and urgent supplier alerts were scattered across WhatsApp/SMS, Email threads, and Facebook/Instagram DMs—causing delayed response times and missed high-value leads outside business hours.",
        solution:
          "Built a real-time FastAPI webhook aggregator that normalizes inbound messages from TextBee SMS, IMAP/SMTP Email, and Social DMs, runs instant Gemini AI intent & urgency classification, drafts a context-aware reply, and upserts the lead in Supabase PostgreSQL.",
        architectureSteps: [
          "Inbound webhook received from TextBee SMS Gateway, IMAP/SMTP, or FB/IG DM",
          "FastAPI normalizes sender metadata and runs Gemini AI Intent & Priority Scorer",
          "High-priority leads trigger instant n8n escalation + Supabase CRM record upsert",
          "Smart Auto-Responder dispatches context-aware reply across the originating channel",
        ],
        metrics: [
          { value: "< 2.5s", label: "AI Triage Latency" },
          { value: "100% Captured", label: "Inbound Lead Routing" },
          { value: "Unified Hub", label: "SMS • Email • Social" },
        ],
        sourceFile: "glennbot_automations/routers/omnichannel_inbox.py",
        sourceCode: `from fastapi import APIRouter, Depends, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session
from google import genai
import httpx

router = APIRouter(prefix="/api/v1/inbox", tags=["Omnichannel Inbox & AI Triage"])

class InboundMessagePayload(BaseModel):
    channel: str
    sender: str
    message: str

@router.post("/triage")
async def triage_inbound_message(
    payload: InboundMessagePayload,
    x_api_key: str = Header(..., alias="X-API-Key"),
):
    client = genai.Client()
    triage_prompt = (
        f"Classify intent, urgency score (0-100), and draft a concise reply "
        f"for this {payload.channel} message from {payload.sender}: {payload.message}"
    )
    analysis = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=triage_prompt,
    )

    # Dispatch SMS notification via TextBee Gateway & sync to Supabase CRM
    async with httpx.AsyncClient(timeout=10.0) as http:
        await http.post(
            "https://api.textbee.dev/api/v1/gateway/send-sms",
            headers={"x-api-key": x_api_key},
            json={"recipient": payload.sender, "message": analysis.text[:320]},
        )

    return {
        "status": "TRIAGED_AND_ROUTED",
        "channel": payload.channel,
        "smart_reply": analysis.text,
    }`,
        widgetFields: [
          {
            name: "channel",
            label: "Inbound Source Channel",
            type: "select",
            options: [
              "WhatsApp / TextBee SMS",
              "Enterprise Email (IMAP/SMTP)",
              "Facebook / Instagram DM",
            ],
          },
          {
            name: "sender",
            label: "Sender Handle / Contact",
            type: "text",
            value: "ops-director@enterprise-client.io",
          },
          {
            name: "message",
            label: "Inbound Client / Supplier Message",
            type: "textarea",
            value:
              "Hi Glenn, we need an automated pipeline that syncs our incoming supplier quality sheets to PostgreSQL and alerts our team on WhatsApp.",
          },
        ],
      },
      "calendar-orchestrator": {
        sysId: "SYS-03",
        category: "Workflow & Booking",
        endpoint: "POST /api/v1/calendar/schedule",
        demoEndpoint: "/api/demo/calendar-schedule",
        title: "Automated Calendar Booking & n8n Webhook Orchestrator",
        tagline: "Zero-Touch Consultation Scheduling with Composio Meet/Zoom & n8n Pipelines",
        pipelineNodes: [
          { label: "Booking Request", title: "Client Slot Selection", accent: false },
          { label: "Orchestrator", title: "Composio + n8n Webhook", accent: true },
          { label: "Provisioned", title: "Google Meet + SMS Alert", accent: false },
        ],
        bottleneck:
          "Back-and-forth timezone emails, manual Google Meet link creation, and forgotten CRM updates were slowing down technical discovery calls and client onboarding.",
        solution:
          "Engineered a zero-touch FastAPI booking endpoint integrated with Composio (Google Calendar / Meet / Zoom) and n8n webhooks. Every confirmed slot automatically provisions a video room, logs the prospect in PostgreSQL, and queues a 24-hour SMS reminder via TextBee.",
        architectureSteps: [
          "Client selects consultation slot from portfolio widget or intake form",
          "FastAPI queries Composio Google Calendar integration to verify zero conflicts",
          "Composio provisions Google Meet / Zoom conference link & sends calendar invite",
          "n8n webhook triggers CRM lead enrichment and schedules TextBee SMS reminder",
        ],
        metrics: [
          { value: "Zero-Touch", label: "Meeting Provisioning" },
          { value: "3 Webhooks", label: "Calendar • CRM • SMS" },
          { value: "100% Synced", label: "Google Meet / Zoom" },
        ],
        sourceFile: "glennbot_automations/routers/calendar_orchestrator.py",
        sourceCode: `from fastapi import APIRouter, Header
from pydantic import BaseModel
import httpx

router = APIRouter(prefix="/api/v1/calendar", tags=["Calendar & n8n Orchestrator"])

class ConsultationBookingRequest(BaseModel):
    name: str
    session_type: str
    slot: str

@router.post("/schedule")
async def schedule_discovery_session(
    payload: ConsultationBookingRequest,
    x_api_key: str = Header(..., alias="X-API-Key"),
):
    async with httpx.AsyncClient(timeout=15.0) as http:
        # 1. Provision Google Calendar Event + Meet link via Composio
        composio_res = await http.post(
            "https://backend.composio.dev/api/v2/actions/googlecalendar_create_event/execute",
            headers={"X-API-Key": x_api_key},
            json={
                "summary": f"{payload.session_type} — {payload.name}",
                "start_datetime": payload.slot,
                "create_conference_link": True,
            },
        )
        # 2. Trigger downstream n8n Webhook for CRM + TextBee SMS reminder
        await http.post(
            "https://n8n.glennbot.io/webhook/calendar-booking-sync",
            json=payload.model_dump(),
        )

    return {
        "status": "CONFIRMED",
        "attendee": payload.name,
        "slot": payload.slot,
        "conference": "Google Meet Auto-Provisioned",
    }`,
        widgetFields: [
          {
            name: "name",
            label: "Attendee Name & Role",
            type: "text",
            value: "Alex Rivera (Operations VP)",
          },
          {
            name: "session_type",
            label: "Consultation / Audit Type",
            type: "select",
            options: [
              "AI Workflow & FastAPI Architecture Audit (30 min)",
              "Custom CRM & Web Dashboard Discovery (45 min)",
              "Manufacturing & Supplier Data Automation Call (30 min)",
            ],
          },
          {
            name: "slot",
            label: "Preferred ISO Slot (PHT / UTC+8)",
            type: "text",
            value: "2026-11-10T10:00:00+08:00",
          },
        ],
      },
      "sheets-capacity-sync": {
        sysId: "SYS-04",
        category: "Data Pipeline & Sync",
        endpoint: "POST /api/v1/sheets/sync",
        demoEndpoint: "/api/demo/sheets-sync",
        title: "Cloud Spreadsheet & Supplier Capacity Sync Engine",
        tagline: "Two-Way Google Sheets ↔ PostgreSQL Sync & Automated Bottleneck Detection",
        pipelineNodes: [
          { label: "Cloud Source", title: "Google Drive / Sheets", accent: false },
          { label: "ETL & Audit", title: "SQLAlchemy + Kaizen Rules", accent: true },
          { label: "Database", title: "PostgreSQL (Supabase)", accent: false },
        ],
        bottleneck:
          "Inspired by managing 30+ external suppliers at EPSON Precision: engineering teams were manually consolidating Excel/Google Sheets capacity matrices, leading to version drift and delayed bottleneck detection.",
        solution:
          "Built a bidirectional ETL sync engine connecting Google Drive / Spreadsheets with PostgreSQL (Supabase) via SQLAlchemy. Automatically validates incoming rows, calculates tooling & supplier capacity utilization, and flags Kaizen bottleneck alerts in real time.",
        architectureSteps: [
          "Scheduled APScheduler job or manual webhook triggers Google Sheets delta pull",
          "FastAPI + Pydantic validates row schemas and normalizes supplier metrics",
          "Kaizen capacity rule engine flags utilization > 90% or mold renewal thresholds",
          "SQLAlchemy bulk-upserts clean records into Supabase PostgreSQL & updates dashboard",
        ],
        metrics: [
          { value: "30+ Suppliers", label: "Capacity Matrix Logic" },
          { value: "2-Way Sync", label: "Sheets ↔ PostgreSQL" },
          { value: "Zero Drift", label: "Automated Validation" },
        ],
        sourceFile: "glennbot_automations/routers/sheets_capacity_sync.py",
        sourceCode: `from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/v1/sheets", tags=["Cloud Spreadsheet & Capacity Sync"])

class SheetSyncRequest(BaseModel):
    sheet_name: str
    sync_mode: str = "Two-Way Delta Sync + Kaizen Bottleneck Audit"
    rows_scanned: int = 340

@router.post("/sync")
async def sync_spreadsheet_to_postgres(payload: SheetSyncRequest):
    # Validate supplier capacity thresholds & upsert to Supabase PostgreSQL
    bottlenecks = max(1, round(payload.rows_scanned * 0.035))
    return {
        "status": "SYNC_COMPLETED",
        "workbook": payload.sheet_name,
        "rows_upserted": payload.rows_scanned,
        "kaizen_bottlenecks_flagged": bottlenecks,
        "audit_status": "ZERO_SCHEMA_DRIFT",
    }`,
        widgetFields: [
          {
            name: "sheet_name",
            label: "Target Google Spreadsheet Workbook",
            type: "text",
            value: "EPSON_Supplier_Mold_Capacity_Matrix_Q4",
          },
          {
            name: "sync_mode",
            label: "Synchronization & Audit Mode",
            type: "select",
            options: [
              "Two-Way Delta Sync + Kaizen Bottleneck Audit",
              "Google Sheets -> Supabase PostgreSQL Upsert",
              "Supplier Capacity Threshold Scan (>90% Load)",
            ],
          },
          {
            name: "rows_scanned",
            label: "Batch Rows to Validate & Sync",
            type: "number",
            value: "340",
          },
        ],
      },
    };

    let activeProjectId = "social-scheduler";
    let activeTab = "case-study";

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function formatInlineMarkdown(str) {
      return escapeHtml(str)
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/`([^`]+)`/g, "<code>$1</code>");
    }

    // Auto-Authenticated Live Expanded Views Registry for SYS-01 via /glennbot-popout proxy
    const SYS01_LIVE_EXPANDED_VIEWS = {
      scheduler: {
        tab: "scheduler",
        shortLabel: "📝 Create Post",
        title: "Create Post Expanded View",
        fullTitle: "Create & Schedule Post — Expanded View",
        subtitle: "Multi-Platform Publisher, Media Studio & AI Caption Workspace",
        icon: "fas fa-paper-plane",
        width: 1240,
        height: 860,
        url: "/glennbot-popout?popout_mode=workspace_view&tab=scheduler",
        upstreamUrl: "https://glennbotautomations.onrender.com/?popout_mode=workspace_view&tab=scheduler",
      },
      queue: {
        tab: "queue",
        shortLabel: "⏳ Queue",
        title: "Queue Expanded View",
        fullTitle: "Publishing Queue & History — Expanded View",
        subtitle: "Live Scheduled, Published & Draft Social Posts Monitor",
        icon: "fas fa-stream",
        width: 1220,
        height: 840,
        url: "/glennbot-popout?popout_mode=workspace_view&tab=queue",
        upstreamUrl: "https://glennbotautomations.onrender.com/?popout_mode=workspace_view&tab=queue",
      },
      calendar: {
        tab: "calendar",
        shortLabel: "📅 Calendar",
        title: "Calendar Expanded View",
        fullTitle: "Social Media Content Calendar — Expanded View",
        subtitle: "Visual Monthly Schedule of Queued & Published Omnichannel Social Posts",
        icon: "fas fa-calendar-alt",
        width: 1260,
        height: 860,
        url: "/glennbot-popout?popout_mode=workspace_view&tab=calendar",
        upstreamUrl: "https://glennbotautomations.onrender.com/?popout_mode=workspace_view&tab=calendar",
      },
    };

    let activeSys01ExpandedTab = "scheduler";

    function setActiveTab(tabName) {
      activeTab = tabName;
      tabButtons.forEach((btn) => {
        const isMatch = btn.getAttribute("data-modal-tab") === tabName;
        btn.classList.toggle("is-active", isMatch);
        btn.setAttribute("aria-selected", isMatch ? "true" : "false");
      });

      const map = {
        "case-study": panelCaseStudy,
        "source-code": panelSourceCode,
        "live-widget": panelLiveWidget,
      };

      Object.keys(map).forEach((key) => {
        const panel = map[key];
        if (!panel) return;
        if (key === tabName) {
          panel.hidden = false;
          panel.classList.add("is-active");
        } else {
          panel.hidden = true;
          panel.classList.remove("is-active");
        }
      });
    }

    function renderGlennBotSchedulerWorkspace(container) {
      if (!container) return;

      const activeView =
        SYS01_LIVE_EXPANDED_VIEWS[activeSys01ExpandedTab] ||
        SYS01_LIVE_EXPANDED_VIEWS.scheduler;

      const cardsHtml = Object.keys(SYS01_LIVE_EXPANDED_VIEWS)
        .map((key) => {
          const item = SYS01_LIVE_EXPANDED_VIEWS[key];
          const isCurrent = key === activeSys01ExpandedTab;
          return `
            <div class="gb-live-view-card ${isCurrent ? "is-active" : ""}" data-live-card="${escapeHtml(item.tab)}">
              <div class="gb-live-view-card-top">
                <span class="gb-live-view-badge">${escapeHtml(item.shortLabel)}</span>
                <span class="gb-live-view-dims">${item.width}&times;${item.height} Pop-Out</span>
              </div>
              <h5 class="gb-live-view-title">${escapeHtml(item.title)}</h5>
              <p class="gb-live-view-desc">${escapeHtml(item.subtitle)}</p>
              <div class="gb-live-url-pill" title="${escapeHtml(item.url)}">
                <code>${escapeHtml(item.url)}</code>
              </div>
              <div class="gb-live-view-actions">
                <button
                  type="button"
                  class="gb-btn-popup-launch"
                  data-popup-tab="${escapeHtml(item.tab)}"
                  data-popup-width="${item.width}"
                  data-popup-height="${item.height}"
                >
                  <span>🗗 Launch Centered Pop-Up</span>
                </button>
                <button
                  type="button"
                  class="gb-btn-frame-switch ${isCurrent ? "is-selected" : ""}"
                  data-frame-tab="${escapeHtml(item.tab)}"
                >
                  <span>${isCurrent ? "✓ Active in Live Frame" : "Load in Embedded Frame"}</span>
                </button>
              </div>
            </div>
          `;
        })
        .join("");

      container.innerHTML = `
        <div class="gb-scheduler-workspace" id="gb-scheduler-app">
          <!-- Top Sub-Navigation Bar for the 3 Live Expanded Views -->
          <div class="gb-subnav-bar">
            <div class="gb-subnav-tabs" role="tablist" aria-label="GlennBot Live Expanded Views">
              ${Object.keys(SYS01_LIVE_EXPANDED_VIEWS)
                .map((key) => {
                  const item = SYS01_LIVE_EXPANDED_VIEWS[key];
                  const isCurrent = key === activeSys01ExpandedTab;
                  return `
                    <button
                      type="button"
                      role="tab"
                      aria-selected="${isCurrent ? "true" : "false"}"
                      class="gb-subnav-btn ${isCurrent ? "is-active" : ""}"
                      data-gb-subtab="${escapeHtml(item.tab)}"
                    >
                      <span>${escapeHtml(item.shortLabel)}</span>
                      <span class="gb-subnav-badge">?tab=${escapeHtml(item.tab)}</span>
                    </button>
                  `;
                })
                .join("")}
            </div>
            <div class="gb-workspace-status">
              <span class="status-dot-live" aria-hidden="true"></span>
              <span>Live Standalone Mode &bull; <code>?popout_mode=workspace_view</code></span>
              <button
                type="button"
                id="gb-popup-active-top-btn"
                class="gb-btn-top-popout"
                data-popup-tab="${escapeHtml(activeView.tab)}"
                data-popup-width="${activeView.width}"
                data-popup-height="${activeView.height}"
              >
                <span>🗗 Open ${escapeHtml(activeView.shortLabel)} Pop-Up Window</span>
              </button>
            </div>
          </div>

          <!-- 3 Real Live Expanded View Launcher Cards -->
          <div class="gb-live-cards-grid">
            ${cardsHtml}
          </div>

          <!-- Embedded Live Workspace Frame connected directly to glennbotautomations.onrender.com -->
          <div class="gb-live-iframe-shell">
            <div class="gb-live-iframe-toolbar">
              <div class="gb-live-iframe-meta">
                <span class="status-dot-live" aria-hidden="true"></span>
                <strong id="gb-live-iframe-title">${escapeHtml(activeView.fullTitle)}</strong>
                <code id="gb-live-iframe-url" class="gb-live-iframe-url-code">${escapeHtml(activeView.url)}</code>
              </div>
              <div class="gb-live-iframe-controls">
                <button type="button" id="gb-reload-iframe-btn" class="gb-btn-iframe-reload">
                  <span>🔄 Reload Live View</span>
                </button>
                <button
                  type="button"
                  id="gb-popup-iframe-btn"
                  class="gb-btn-popup-launch"
                  data-popup-tab="${escapeHtml(activeView.tab)}"
                  data-popup-width="${activeView.width}"
                  data-popup-height="${activeView.height}"
                >
                  <span>🗗 Pop Out Centered Desktop Window (${activeView.width}&times;${activeView.height})</span>
                </button>
              </div>
            </div>
            <div class="gb-live-iframe-viewport">
              <iframe
                id="gb-live-workspace-iframe"
                class="gb-live-workspace-iframe"
                src="${escapeHtml(activeView.url)}"
                title="${escapeHtml(activeView.fullTitle)}"
                loading="lazy"
                allow="clipboard-read; clipboard-write"
              ></iframe>
            </div>
          </div>
        </div>
      `;

      // Bind all centered pop-up buttons to openGlennBotLivePopup(tabName, 'workspace_view', width, height)
      container.querySelectorAll("[data-popup-tab]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const tabName = btn.getAttribute("data-popup-tab") || "scheduler";
          const w = parseInt(btn.getAttribute("data-popup-width") || "1240", 10);
          const h = parseInt(btn.getAttribute("data-popup-height") || "860", 10);
          openGlennBotLivePopup(tabName, "workspace_view", w, h);
        });
      });

      // Bind sub-tab buttons & frame switcher buttons
      function switchLiveExpandedTab(targetTab) {
        if (!SYS01_LIVE_EXPANDED_VIEWS[targetTab]) return;
        activeSys01ExpandedTab = targetTab;
        renderGlennBotSchedulerWorkspace(container);
      }

      container.querySelectorAll("[data-gb-subtab]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const targetTab = btn.getAttribute("data-gb-subtab");
          if (targetTab) switchLiveExpandedTab(targetTab);
        });
      });

      container.querySelectorAll("[data-frame-tab]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const targetTab = btn.getAttribute("data-frame-tab");
          if (targetTab) switchLiveExpandedTab(targetTab);
        });
      });

      const reloadBtn = container.querySelector("#gb-reload-iframe-btn");
      const iframeEl = container.querySelector("#gb-live-workspace-iframe");
      if (reloadBtn && iframeEl) {
        reloadBtn.addEventListener("click", () => {
          const curView =
            SYS01_LIVE_EXPANDED_VIEWS[activeSys01ExpandedTab] ||
            SYS01_LIVE_EXPANDED_VIEWS.scheduler;
          iframeEl.src = `${curView.url}&_ts=${Date.now()}`;
        });
      }
    }

    function renderProjectPanels(projectId) {
      const proj = PROJECTS_DATA[projectId];
      if (!proj) return;

      sysIdEl.textContent = proj.sysId;
      categoryEl.textContent = proj.category;
      endpointEl.textContent = proj.endpoint;
      titleEl.textContent = proj.title;

      // 1. Render Case Study Tab (including the 3-step pipeline diagram & KPI strip moved from outer card)
      const pipelineHtml = Array.isArray(proj.pipelineNodes)
        ? `
        <div class="project-pipeline-visual modal-pipeline-strip" aria-label="System Architecture Flow">
          ${proj.pipelineNodes
            .map(
              (node, idx) => `
            <div class="pipeline-node ${node.accent ? "pipeline-node-accent" : ""}">
              <span class="pipeline-node-label">${escapeHtml(node.label)}</span>
              <strong class="pipeline-node-title">${escapeHtml(node.title)}</strong>
            </div>
            ${idx < proj.pipelineNodes.length - 1 ? '<span class="pipeline-arrow" aria-hidden="true">&rarr;</span>' : ""}
          `
            )
            .join("")}
        </div>`
        : "";

      const caseFooterHtml =
        projectId === "social-scheduler"
          ? `
        <div class="modal-case-footer modal-case-footer-sys01">
          <button
            type="button"
            class="btn-sys01-popout btn-live-launcher"
            onclick="event.stopPropagation(); openGlennBotLivePopup('scheduler');"
            title="Open Create Post Expanded View"
          >
            <span>📝 Create Post</span>
          </button>
          <button
            type="button"
            class="btn-sys01-popout btn-live-launcher"
            onclick="event.stopPropagation(); openGlennBotLivePopup('queue');"
            title="Open Queue Expanded View"
          >
            <span>⏳ Queue</span>
          </button>
          <button
            type="button"
            class="btn-sys01-popout btn-live-launcher"
            onclick="event.stopPropagation(); openGlennBotLivePopup('calendar');"
            title="Open Calendar Expanded View"
          >
            <span>📅 Calendar</span>
          </button>
        </div>`
          : projectId === "omnichannel-inbox"
          ? `
        <div class="modal-case-footer modal-case-footer-sys02">
          <button
            type="button"
            class="btn-sys01-popout btn-live-launcher"
            onclick="event.stopPropagation(); openCommentPlatformChooser(this);"
            title="Choose Facebook or Instagram Post on GlennBot Automations and watch Gemini AI auto-reply"
          >
            <span>💬 Post a Comment</span>
          </button>
          <button
            type="button"
            class="btn-sys01-popout btn-live-launcher"
            onclick="event.stopPropagation(); openGlennBotLivePopup('messages');"
            title="Open Unified Direct Messages & SMS Inbox Expanded View"
          >
            <span>✉️ Send a DM</span>
          </button>
          <button
            type="button"
            class="btn-sys01-popout btn-live-launcher"
            onclick="event.stopPropagation(); openGlennBotLivePopup('email');"
            title="Open Multi-Account Email Hub Expanded View"
          >
            <span>📧 Send an Email</span>
          </button>
        </div>`
          : `
        <div class="modal-case-footer">
          <button type="button" class="btn-project-widget" data-switch-tab="live-widget">
            <span>⚡ Launch Interactive Widget &rarr;</span>
          </button>
        </div>`;

      panelCaseStudy.innerHTML = `
        ${pipelineHtml}
        <div class="modal-case-grid">
          <div class="modal-case-card">
            <span class="modal-section-eyebrow">Operational Bottleneck</span>
            <h4 class="modal-section-heading">The Challenge</h4>
            <p class="modal-section-text">${formatInlineMarkdown(proj.bottleneck)}</p>
          </div>
          <div class="modal-case-card modal-case-card-accent">
            <span class="modal-section-eyebrow">Engineered Solution</span>
            <h4 class="modal-section-heading">GlennBot Architecture</h4>
            <p class="modal-section-text">${formatInlineMarkdown(proj.solution)}</p>
          </div>
        </div>
        <div class="modal-arch-steps">
          <h4 class="modal-section-heading">End-to-End Execution Pipeline</h4>
          <ol class="modal-step-list">
            ${proj.architectureSteps
              .map(
                (step, idx) => `
              <li>
                <span class="modal-step-num">0${idx + 1}</span>
                <span>${formatInlineMarkdown(step)}</span>
              </li>`
              )
              .join("")}
          </ol>
        </div>
        <div class="modal-kpi-row">
          ${proj.metrics
            .map(
              (m) => `
            <div class="modal-kpi-box">
              <strong class="modal-kpi-val">${escapeHtml(m.value)}</strong>
              <span class="modal-kpi-lbl">${escapeHtml(m.label)}</span>
            </div>`
            )
            .join("")}
        </div>
        ${caseFooterHtml}
      `;

      const switchBtn = panelCaseStudy.querySelector("[data-switch-tab]");
      if (switchBtn) {
        switchBtn.addEventListener("click", () => setActiveTab("live-widget"));
      }

      // 2. Render Source Code Tab
      panelSourceCode.innerHTML = `
        <div class="code-viewer-frame">
          <div class="code-viewer-topbar">
            <span class="code-file-path">${escapeHtml(proj.sourceFile)}</span>
            <button type="button" class="btn-copy-code" id="modal-copy-code-btn">Copy FastAPI Code</button>
          </div>
          <pre class="code-viewer-pre"><code>${escapeHtml(proj.sourceCode)}</code></pre>
        </div>
      `;

      const copyBtn = document.getElementById("modal-copy-code-btn");
      if (copyBtn) {
        copyBtn.addEventListener("click", () => {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(proj.sourceCode).catch(() => {});
          }
          copyBtn.textContent = "Copied to Clipboard ✓";
          window.setTimeout(() => {
            copyBtn.textContent = "Copy FastAPI Code";
          }, 1800);
        });
      }

      // 3. Render Tab 03: Expanded GlennBot Social Scheduler Workspace for SYS-01, or Live API Widget for SYS-02..04
      if (projectId === "social-scheduler") {
        renderGlennBotSchedulerWorkspace(panelLiveWidget);
        return;
      }

      const fieldsHtml = proj.widgetFields
        .map((field) => {
          if (field.type === "select") {
            return `
              <label class="widget-field">
                <span class="widget-field-label">${escapeHtml(field.label)}</span>
                <select name="${escapeHtml(field.name)}" class="widget-input">
                  ${field.options
                    .map(
                      (opt) =>
                        `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`
                    )
                    .join("")}
                </select>
              </label>`;
          }
          if (field.type === "textarea") {
            return `
              <label class="widget-field">
                <span class="widget-field-label">${escapeHtml(field.label)}</span>
                <textarea name="${escapeHtml(field.name)}" rows="3" class="widget-input">${escapeHtml(field.value || "")}</textarea>
              </label>`;
          }
          return `
            <label class="widget-field">
              <span class="widget-field-label">${escapeHtml(field.label)}</span>
              <input type="${escapeHtml(field.type || "text")}" name="${escapeHtml(field.name)}" value="${escapeHtml(field.value || "")}" class="widget-input" />
            </label>`;
        })
        .join("");

      panelLiveWidget.innerHTML = `
        <div class="live-widget-grid">
          <form id="live-api-widget-form" class="live-widget-form">
            <div class="widget-form-header">
              <span class="status-dot-live" aria-hidden="true"></span>
              <span>Live FastAPI Endpoint: <code>${escapeHtml(proj.endpoint)}</code></span>
            </div>
            ${fieldsHtml}
            <button type="submit" id="widget-submit-btn" class="btn-widget-execute">
              <span>Execute Live API Request</span>
            </button>
          </form>

          <div class="live-widget-output">
            <div class="widget-output-topbar">
              <span>Server Telemetry &amp; JSON Response</span>
              <span id="widget-status-badge" class="widget-status-pill">READY &bull; 200 OK</span>
            </div>
            <pre id="widget-json-output" class="widget-json-pre">Click "Execute Live API Request" to send a real POST payload to the FastAPI backend...</pre>
          </div>
        </div>
      `;

      const form = document.getElementById("live-api-widget-form");
      const jsonOut = document.getElementById("widget-json-output");
      const statusBadge = document.getElementById("widget-status-badge");
      const submitBtn = document.getElementById("widget-submit-btn");

      async function executeDemoRequest() {
        if (!form || !jsonOut) return;
        const formData = new FormData(form);
        const payload = {};
        formData.forEach((val, key) => {
          payload[key] = val;
        });

        if (submitBtn) submitBtn.disabled = true;
        if (statusBadge) statusBadge.textContent = "EXECUTING...";

        try {
          const res = await fetch(proj.demoEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          if (statusBadge) {
            statusBadge.textContent = `200 OK • ${data.latency_ms || 18}ms`;
          }
          jsonOut.textContent = JSON.stringify(data, null, 2);
        } catch (err) {
          if (statusBadge) statusBadge.textContent = "ERROR";
          jsonOut.textContent = JSON.stringify(
            { status: "error", message: String(err) },
            null,
            2
          );
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      }

      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          executeDemoRequest();
        });
      }

      // Automatically run an initial live request so the user immediately sees real telemetry
      executeDemoRequest();
    }

    function openProjectModal(projectId, initialTab) {
      activeProjectId = projectId in PROJECTS_DATA ? projectId : "social-scheduler";
      renderProjectPanels(activeProjectId);
      setActiveTab(initialTab || "case-study");
      modal.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function closeProjectModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
    }

    // Bind buttons with [data-project-open]
    document.querySelectorAll("[data-project-open]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const projId = btn.getAttribute("data-project-open");
        const tab = btn.getAttribute("data-tab") || "case-study";
        openProjectModal(projId, tab);
      });
    });

    // Bind clicking anywhere on a .project-showcase-card
    document.querySelectorAll(".project-showcase-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("button, a, .project-tryme-dock, .project-tryme-callout")) return;
        const projId = card.getAttribute("data-project-id");
        openProjectModal(projId, "case-study");
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          if (e.target.closest("button, a, .project-tryme-dock, .project-tryme-callout")) return;
          e.preventDefault();
          const projId = card.getAttribute("data-project-id");
          openProjectModal(projId, "case-study");
        }
      });
    });

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-modal-tab");
        if (targetTab) setActiveTab(targetTab);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeProjectModal);
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeProjectModal();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) {
        closeProjectModal();
      }
    });
  }

  function initAll() {
    initThemeToggle();
    initRoleTypingEffect();
    initScrollReveal();
    initCircuitCanvas();
    initFeaturedProjectsInspector();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();

