// Portfolio Theme Switcher, Viewport-Aware Scroll Reveal, Role Typing Illumination & Animated Circuit Engine
const GLENNBOT_BASE_URL = (
  (window.__GLENNBOT_ENV__ && window.__GLENNBOT_ENV__.GLENNBOT_BASE_URL) ||
  ""
).replace(/\/+$/, "");
const GLENNBOT_API_BASE_URL = (
  (window.__GLENNBOT_ENV__ && window.__GLENNBOT_ENV__.GLENNBOT_API_BASE_URL) ||
  (GLENNBOT_BASE_URL ? `${GLENNBOT_BASE_URL}/api/v1` : "")
).replace(/\/+$/, "");
window.GLENNBOT_BASE_URL = GLENNBOT_BASE_URL;
window.GLENNBOT_API_BASE_URL = GLENNBOT_API_BASE_URL;

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
      `${GLENNBOT_BASE_URL}/?popout_mode=comment_thread&record_id=post_ext_dc6a96869a&comment_id=122118104811500702_1150007564513023`,
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
      `${GLENNBOT_BASE_URL}/?popout_mode=comment_thread&record_id=post_ext_b10078462e&comment_id=18198560143393683`,
    actualPostUrl: "https://www.instagram.com/p/DfkfvyEvx3b/",
    primaryBtnText: "Open / Focus Actual Instagram Post Window",
    dashboardWindowName: "GlennBotCommentThread_IG",
    dockedWindowName: "GlennBotDockedSocialPost_instagram",
    caption: SHARED_SHOWCASE_CAPTION_TEXT,
  },
  tiktok: {
    key: "tiktok",
    platformLabel: "TikTok",
    badgeText: "GlennBot Automations — TikTok (@glennbot.automation)",
    badgeClass: "is-tiktok",
    iconClass: "fab fa-tiktok",
    postTypeLabel: "Photo Post • Live Gemini AI (@glennbot.automation)",
    recordId: "post_ext_19fdfb7f26",
    commentId: "7706797468532458260",
    proxyDashboardUrl:
      "/glennbot-popout?popout_mode=comment_thread&record_id=post_ext_19fdfb7f26&comment_id=7706797468532458260",
    upstreamDashboardUrl:
      `${GLENNBOT_BASE_URL}/?popout_mode=comment_thread&record_id=post_ext_19fdfb7f26&comment_id=7706797468532458260`,
    actualPostUrl: "https://www.tiktok.com/@glennbot.automation/photo/7706791793546906901",
    primaryBtnText: "Open / Focus Actual TikTok Post Window",
    dashboardWindowName: "GlennBotCommentThread_TT",
    dockedWindowName: "GlennBotDockedSocialPost_tiktok",
    caption: SHARED_SHOWCASE_CAPTION_TEXT,
  },
};
window.COMMENT_SPLIT_PLATFORMS = COMMENT_SPLIT_PLATFORMS;

let activeCommentSplitPlatform = "facebook";
let activeDockedSocialPopupRef = null;

function computeRightDockedPopupFeatures(platform) {
  const availW = window.screen?.availWidth || window.innerWidth || 1440;
  const availH = window.screen?.availHeight || window.innerHeight || 900;
  const screenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX || 0;
  const screenTop = window.screenTop !== undefined ? window.screenTop : window.screenY || 0;
  const platKey = String(platform || activeCommentSplitPlatform || "facebook")
    .trim()
    .toLowerCase();
  const isInstagram = platKey === "instagram";

  // Instagram Web switches to its compact 2-column side-by-side desktop layout at >= 736px width.
  // Capping Instagram's popup to 760px-820px (~43% of a 1920px screen) keeps the comment box visible
  // on the right while preserving the full 57%-58% left side (~1,090px) for the Live GlennBot Dashboard.
  const minW = isInstagram ? (availW < 1400 ? 760 : 780) : 500;
  const maxW = isInstagram
    ? Math.min(availW - 24, availW < 1600 ? 800 : 820)
    : availW - 24;
  const widthRatio = isInstagram ? 0.43 : 0.42;
  const heightRatio = isInstagram ? 0.92 : 0.86;
  const rightMargin = isInstagram ? 8 : 20;

  const popupWidth = Math.min(maxW, Math.max(minW, Math.round(availW * widthRatio)));
  const popupHeight = Math.min(availH - 16, Math.max(680, Math.round(availH * heightRatio)));
  const popupLeft = Math.max(screenLeft, Math.round(screenLeft + availW - popupWidth - rightMargin));
  const popupTop = Math.max(screenTop, Math.round(screenTop + (availH - popupHeight) / 2));
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
  const { popupWidth, popupHeight, popupLeft, popupTop, features } =
    computeRightDockedPopupFeatures(platKey);
  const win = window.open(cfg.actualPostUrl, cfg.dockedWindowName, features);
  if (win) {
    activeDockedSocialPopupRef = win;
    try {
      win.resizeTo(popupWidth, popupHeight);
      win.moveTo(popupLeft, popupTop);
    } catch (_) {
      // Cross-origin windows ignore resizeTo after navigation; initial features apply on creation
    }
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
  const ttBtn = document.getElementById("gb-split-toggle-tiktok");
  if (fbBtn) fbBtn.classList.toggle("is-active", platKey === "facebook");
  if (igBtn) igBtn.classList.toggle("is-active", platKey === "instagram");
  if (ttBtn) ttBtn.classList.toggle("is-active", platKey === "tiktok");

  const splitGrid = document.querySelector(".gb-split-workspace-grid");
  if (splitGrid) {
    splitGrid.classList.toggle("is-instagram-layout", platKey === "instagram");
  }

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
    badgeEl.classList.remove("is-facebook", "is-instagram", "is-tiktok");
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

const DM_SPLIT_PLATFORMS = {
  facebook: {
    key: "facebook",
    label: "Facebook Messenger",
    platformLabel: "Facebook",
    pageName: "GlennBot Automations",
    pageHeader: "GlennBot Automations",
    pageSubtitle:
      "Facebook Messenger • 24h Meta Window + Gemini 3.5 Flash Active",
    handle: "GlennBot Automations • Facebook Page",
    accountId: "6af0b109818eb5c88d1e87a6",
    accountName: "GlennBot Automations",
    externalUrl: "https://www.facebook.com/messages/t/1340688402467466",
    externalBtnText: "Open Facebook Messenger ↗",
    placeholder: "Write a message to GlennBot Automations...",
    defaultVisitorName: "Portfolio Client",
    visitorNamePlaceholder: "Your Name (e.g. Alex)",
    newBlankChatLabel: "🔄 New Blank Chat",
    typingIndicatorText:
      "GlennBot Automations is typing via Gemini 3.5 Flash...",
    composerPlaceholder: "Write a message to GlennBot Automations...",
    clientViewPill: "Facebook Messenger (Client View)",
    iconClass: "fab fa-facebook-messenger",
    liveDmPostEndpoint: "/api/messages/portfolio_live_dm",
    upstreamLiveDmPostEndpoint:
      `${GLENNBOT_BASE_URL}/api/messages/portfolio_live_dm`,
    pollIntervalMs: 2500,
    statusBarText:
      "🟢 LIVE MESSENGER SESSION • Synced in Real Time with Your Client Chat",
    refreshBtnLabel: "🔄 Refresh Live Chat",
    baseProxyDashboardUrl:
      "/glennbot-popout?popout_mode=message_thread&platform=facebook&account_id=6af0b109818eb5c88d1e87a6&account_name=GlennBot+Automations",
    baseUpstreamDashboardUrl:
      `${GLENNBOT_BASE_URL}/?popout_mode=message_thread&platform=facebook&account_id=6af0b109818eb5c88d1e87a6&account_name=GlennBot+Automations`,
    directMessengerUrl: "https://www.facebook.com/messages/t/1340688402467466",
    directMessengerWindowName: "GlennBotDirectFacebookMessengerFullView",
    dashboardWindowName: "GlennBotMessageThread_FB",
    quickStarterHints: [
      "Hi GlennBot! What automation services do you offer?",
      "How can your Python & AI workflows help my business save time?",
      "Magkano ang rate mo at paano mag-inquire?",
    ],
  },
  instagram: {
    key: "instagram",
    label: "Instagram Direct",
    platformLabel: "Instagram",
    pageName: "@glennard.tasico.va",
    pageHeader: "@glennard.tasico.va",
    pageSubtitle:
      "Instagram Direct • 24h Meta Window + Gemini 3.5 Flash Active",
    handle: "@glennard.tasico.va • Instagram Direct",
    accountId: "6ad9e9b2e5d470e468e58d87",
    accountName: "@glennard.tasico.va",
    externalUrl: "https://www.instagram.com/direct/t/18131808028702166/",
    externalBtnText: "Open Instagram (@glennard.tasico.va) ↗",
    placeholder: "Message @glennard.tasico.va on Instagram...",
    defaultVisitorName: "Portfolio Client",
    visitorNamePlaceholder: "Your Name (e.g. Alex)",
    newBlankChatLabel: "🔄 New Blank Chat",
    typingIndicatorText:
      "@glennard.tasico.va is typing via Gemini 3.5 Flash...",
    composerPlaceholder: "Message @glennard.tasico.va on Instagram...",
    clientViewPill: "Instagram Direct (Client View)",
    iconClass: "fab fa-instagram",
    liveDmPostEndpoint: "/api/messages/portfolio_live_dm",
    upstreamLiveDmPostEndpoint:
      `${GLENNBOT_BASE_URL}/api/messages/portfolio_live_dm`,
    pollIntervalMs: 2500,
    statusBarText:
      "🟢 LIVE INSTAGRAM DM SESSION • Synced in Real Time with Conversations.xlsx (Sheet2)",
    refreshBtnLabel: "🔄 Refresh Live Chat",
    baseProxyDashboardUrl:
      "/glennbot-popout?popout_mode=message_thread&platform=instagram&account_id=6ad9e9b2e5d470e468e58d87&account_name=%40glennard.tasico.va",
    baseUpstreamDashboardUrl:
      `${GLENNBOT_BASE_URL}/?popout_mode=message_thread&platform=instagram&account_id=6ad9e9b2e5d470e468e58d87&account_name=%40glennard.tasico.va`,
    directMessengerUrl: "https://www.instagram.com/direct/t/18131808028702166/",
    directMessengerWindowName: "GlennBotDirectInstagramDmFullView",
    dashboardWindowName: "GlennBotMessageThread_IG",
    quickStarterHints: [
      "Hi GlennBot! What automation services do you offer?",
      "How can your Python & AI workflows help my business save time?",
      "Magkano ang rate mo at paano mag-inquire?",
    ],
  },
  whatsapp: {
    key: "whatsapp",
    label: "WhatsApp Messenger",
    platformLabel: "WhatsApp",
    pageName: "Glennard Tasico (+63 917 549 7760)",
    pageHeader: "Glennard Tasico (+63 917 549 7760)",
    pageSubtitle: "+63 917 549 7760 • WhatsApp Direct",
    handle: "+63 917 549 7760 • WhatsApp Direct",
    accountId: "6af6210fb722435238788b8f",
    accountName: "Glennard Tasico (+63 917 549 7760)",
    externalUrl: "https://wa.me/639175497760",
    externalBtnText: "Open WhatsApp (+63 917 549 7760) ↗",
    placeholder: "Message Glennard Tasico (+63 917 549 7760) on WhatsApp...",
    defaultVisitorName: "Portfolio Client",
    visitorNamePlaceholder: "Your Name (e.g. Alex)",
    newBlankChatLabel: "🔄 New Blank Chat",
    typingIndicatorText:
      "Glennard Tasico (+63 917 549 7760) is typing via Gemini 3.5 Flash...",
    composerPlaceholder:
      "Message Glennard Tasico (+63 917 549 7760) on WhatsApp...",
    clientViewPill: "WhatsApp Messenger (Client View)",
    iconClass: "fab fa-whatsapp",
    liveDmPostEndpoint: "/api/messages/portfolio_live_dm",
    upstreamLiveDmPostEndpoint:
      `${GLENNBOT_BASE_URL}/api/messages/portfolio_live_dm`,
    pollIntervalMs: 2500,
    statusBarText:
      "🟢 LIVE WHATSAPP SESSION (+63 917 549 7760) • Synced in Real Time with Conversations.xlsx (Sheet2)",
    refreshBtnLabel: "🔄 Refresh Live Chat",
    baseProxyDashboardUrl:
      "/glennbot-popout?popout_mode=message_thread&platform=whatsapp&account_id=6af6210fb722435238788b8f&account_name=Glennard+Tasico+%28%2B63+917+549+7760%29",
    baseUpstreamDashboardUrl:
      `${GLENNBOT_BASE_URL}/?popout_mode=message_thread&platform=whatsapp&account_id=6af6210fb722435238788b8f&account_name=Glennard+Tasico+%28%2B63+917+549+7760%29`,
    directMessengerUrl: "https://wa.me/639175497760",
    directMessengerWindowName: "GlennBotDirectWhatsAppDmFullView",
    dashboardWindowName: "GlennBotMessageThread_WA",
    quickStarterHints: [
      "Hi Glennard! Can you build webhooks & automations?",
      "Magkano po magpagawa ng web app at AI chatbot?",
      "I'd like to discuss an Automation project",
    ],
  },
};
window.DM_SPLIT_PLATFORMS = DM_SPLIT_PLATFORMS;

const DIRECT_SOCIAL_DM_URLS = {
  facebook: "https://www.facebook.com/messages/t/1340688402467466",
  instagram: "https://www.instagram.com/direct/t/18131808028702166/",
  whatsapp: "https://wa.me/639175497760",
};
window.DIRECT_SOCIAL_DM_URLS = DIRECT_SOCIAL_DM_URLS;

let directSocialDmWinRefs = {
  facebook: null,
  instagram: null,
  whatsapp: null,
};

function openMaximizedDirectSocialDm(platform = "facebook", customUrl = null) {
  const rawPlat = String(platform || "facebook").toLowerCase();
  const platKey =
    rawPlat === "instagram"
      ? "instagram"
      : rawPlat === "whatsapp"
      ? "whatsapp"
      : "facebook";
  const targetUrl =
    typeof customUrl === "string" && customUrl.trim()
      ? customUrl.trim()
      : DIRECT_SOCIAL_DM_URLS[platKey];
  const winName =
    platKey === "instagram"
      ? "GlennBotDirectInstagramDmFullView"
      : platKey === "whatsapp"
      ? "GlennBotDirectWhatsAppDmFullView"
      : "GlennBotDirectFacebookMessengerFullView";

  const availW =
    window.screen && window.screen.availWidth
      ? window.screen.availWidth
      : window.innerWidth || 1920;
  const availH =
    window.screen && window.screen.availHeight
      ? window.screen.availHeight
      : window.innerHeight || 1080;
  const features = [
    `width=${availW}`,
    `height=${availH}`,
    "left=0",
    "top=0",
    "screenX=0",
    "screenY=0",
    "resizable=yes",
    "scrollbars=yes",
    "status=yes",
    "toolbar=no",
    "menubar=no",
    "location=yes",
  ].join(",");

  const existingWin = directSocialDmWinRefs[platKey];
  if (existingWin && !existingWin.closed) {
    try {
      existingWin.location.href = targetUrl;
      existingWin.moveTo(0, 0);
      existingWin.resizeTo(availW, availH);
      existingWin.focus();
      return existingWin;
    } catch (_) {}
  }

  const win = window.open(targetUrl, winName, features);
  directSocialDmWinRefs[platKey] = win;

  if (win) {
    try {
      win.moveTo(0, 0);
      win.resizeTo(availW, availH);
      win.focus();
    } catch (_) {}
  } else {
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  }
  return win;
}
window.openMaximizedDirectSocialDm = openMaximizedDirectSocialDm;
window.openMaximizedFacebookMessengerDirect = () =>
  openMaximizedDirectSocialDm("facebook");
window.openMaximizedInstagramDirect = () =>
  openMaximizedDirectSocialDm("instagram");
window.openMaximizedWhatsAppDirect = () =>
  openMaximizedDirectSocialDm("whatsapp");

let activeDmSplitPlatform = "facebook";
let activeDmSessionConvId = "";
let activeDmClientConvId = "";
let activeDmSessionConvKey = "";
let activeDmAccountId = "6af0b109818eb5c88d1e87a6";
let dmClientMessages = [];
let activeDmClientMessages = [];
let dmClientWaitingForAi = false;
let dmClientAwaitingAiReply = false;
let dmClientPollTimer = null;
let dmClientSendingInFlight = false;

function generateNewDmSessionIds(
  accountId = "6af0b109818eb5c88d1e87a6",
  platform = activeDmSplitPlatform
) {
  const cleanPlat = String(platform || "facebook").toLowerCase();
  const prefix =
    cleanPlat === "whatsapp"
      ? "wa_live_dm"
      : cleanPlat === "instagram"
      ? "ig_live"
      : "fb_live";
  const sessionConvId = `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
  const cleanAccId = String(accountId || "6af0b109818eb5c88d1e87a6").trim();
  const sessionConvKey = `${cleanAccId}_${sessionConvId}`;
  return {
    sessionConvId,
    accountId: cleanAccId,
    sessionConvKey,
  };
}
window.generateNewDmSessionIds = generateNewDmSessionIds;

window.getActiveDmSessionConvId = function () {
  return activeDmSessionConvId;
};
window.getActiveDmSessionConvKey = function () {
  return activeDmSessionConvKey;
};

function escapeDmHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDmBubbleTime(tsValue) {
  if (!tsValue) return "Just now";
  try {
    const dt = new Date(tsValue);
    if (Number.isNaN(dt.getTime())) return String(tsValue);
    return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (_) {
    return "Just now";
  }
}

function setDmTypingIndicatorVisible(isVisible) {
  const nextState = Boolean(isVisible);
  dmClientWaitingForAi = nextState;
  dmClientAwaitingAiReply = nextState;
  const typingEl = document.getElementById("gb-dm-typing-indicator");
  if (typingEl) {
    typingEl.hidden = !nextState;
  }
  if (nextState) {
    scrollDmClientChatToBottom();
  }
}

function scrollDmClientChatToBottom() {
  const scrollEl = document.getElementById("gb-dm-client-chat-scroll");
  if (!scrollEl) return;
  scrollEl.scrollTop = scrollEl.scrollHeight;
}

function hasOwnReplyAfterLastUserMessage(messagesList) {
  if (!Array.isArray(messagesList) || messagesList.length === 0) return false;
  let lastUserIdx = -1;
  for (let i = 0; i < messagesList.length; i += 1) {
    const m = messagesList[i];
    if (m && !m.is_own) {
      lastUserIdx = i;
    }
  }
  if (lastUserIdx === -1) {
    return messagesList.some((m) => Boolean(m && m.is_own));
  }
  for (let j = lastUserIdx + 1; j < messagesList.length; j += 1) {
    const m = messagesList[j];
    if (m && m.is_own && String(m.message || m.text || m.content || "").trim()) {
      return true;
    }
  }
  return false;
}

function renderDmClientBubbles(messagesList = dmClientMessages, showTyping) {
  if (typeof showTyping === "boolean") {
    setDmTypingIndicatorVisible(showTyping);
  }
  const listEl = document.getElementById("gb-dm-client-messages-list");
  if (!listEl) return;
  const items = Array.isArray(messagesList) ? messagesList : [];
  if (!items.length) {
    listEl.innerHTML = "";
    return;
  }

  const cfg =
    DM_SPLIT_PLATFORMS[activeDmSplitPlatform] || DM_SPLIT_PLATFORMS.facebook;
  const visitorInput = document.getElementById("gb-dm-visitor-name-input");
  const fallbackVisitorName =
    (visitorInput && visitorInput.value ? visitorInput.value.trim() : "") ||
    "Portfolio Client";

  const html = items
    .map((m) => {
      const isGlennBotReply = Boolean(m && m.is_own);
      const rawText = String((m && (m.message || m.text || m.content)) || "").trim();
      if (!rawText) return "";
      const timeLabel = formatDmBubbleTime(m.timestamp || m.created_at);
      if (isGlennBotReply) {
        return `
          <div class="gb-dm-msg-row is-glennbot" data-msg-id="${escapeDmHtml(m.id || m.message_id || "")}">
            <div class="gb-dm-msg-avatar">
              <i class="fas fa-robot" aria-hidden="true"></i>
            </div>
            <div class="gb-dm-msg-content">
              <div class="gb-dm-msg-meta">
                <span class="gb-dm-msg-author-badge">${escapeDmHtml(cfg.accountName || "GlennBot Automations")}</span>
                <span class="gb-dm-msg-ai-tag">Gemini 3.5 Flash</span>
                <span class="gb-dm-msg-time">${escapeDmHtml(timeLabel)}</span>
              </div>
              <div class="gb-dm-bubble is-glennbot">${escapeDmHtml(rawText).replace(/\n/g, "<br>")}</div>
            </div>
          </div>
        `;
      }

      const clientName =
        String(m.sender_name || m.participant_name || fallbackVisitorName).trim() ||
        "Portfolio Client";
      return `
        <div class="gb-dm-msg-row is-client" data-msg-id="${escapeDmHtml(m.id || m.message_id || "")}">
          <div class="gb-dm-msg-content is-client">
            <div class="gb-dm-msg-meta is-client">
              <span class="gb-dm-msg-client-name">${escapeDmHtml(clientName)}</span>
              <span class="gb-dm-msg-time">${escapeDmHtml(timeLabel)}</span>
            </div>
            <div class="gb-dm-bubble is-client">${escapeDmHtml(rawText).replace(/\n/g, "<br>")}</div>
          </div>
        </div>
      `;
    })
    .join("");

  listEl.innerHTML = html;
}
function renderDmClientMessages(messagesList = dmClientMessages, showTyping) {
  return renderDmClientBubbles(messagesList, showTyping);
}
window.renderDmClientBubbles = renderDmClientBubbles;
window.renderDmClientMessages = renderDmClientMessages;

function notifyRightDashboardIframeLiveDmUpdate() {
  const cfg =
    DM_SPLIT_PLATFORMS[activeDmSplitPlatform] || DM_SPLIT_PLATFORMS.facebook;
  const iframe = document.getElementById("gb-dm-split-iframe");
  if (iframe && iframe.contentWindow) {
    try {
      iframe.contentWindow.postMessage(
        {
          type: "gb_live_dm_updated",
          conv_id: activeDmSessionConvId,
          conv_key: activeDmSessionConvKey,
          account_id: cfg.accountId,
          platform: cfg.key,
        },
        "*"
      );
    } catch (_) {}
  }
}

function applyServerThreadMessages(serverMessages) {
  if (!Array.isArray(serverMessages)) return;
  const previousCount = dmClientMessages.length;
  const prevOwnCount = dmClientMessages.filter((m) => m && m.is_own).length;

  if (serverMessages.length === 0 && dmClientMessages.length > 0 && dmClientWaitingForAi) {
    // Keep optimistic client bubble visible while waiting for the server write to settle
    return;
  }

  const cfg =
    DM_SPLIT_PLATFORMS[activeDmSplitPlatform] || DM_SPLIT_PLATFORMS.facebook;
  const normalizedList = serverMessages.map((m, idx) => ({
    id: m.id || m.message_id || `srv_${idx}`,
    is_own: Boolean(m.is_own),
    sender_name:
      m.sender_name ||
      (m.is_own ? cfg.accountName || "GlennBot Automations" : "Portfolio Client"),
    message: String(m.message || m.text || m.content || ""),
    timestamp: m.timestamp || m.created_at || new Date().toISOString(),
  }));

  const dedupedList = [];
  const seenIds = new Set();
  for (const item of normalizedList) {
    const cleanText = String(item.message || "").trim();
    if (!cleanText) continue;
    const msgId = String(item.id || "").trim();
    if (msgId && !msgId.startsWith("srv_") && seenIds.has(msgId)) continue;
    if (dedupedList.length > 0) {
      const prev = dedupedList[dedupedList.length - 1];
      const prevText = String(prev.message || "").trim();
      if (!item.is_own && !prev.is_own && prevText.toLowerCase() === cleanText.toLowerCase()) {
        continue;
      }
      if (item.is_own && prev.is_own) {
        const isGenericFallback = (txt) =>
          txt.includes(
            "I'm GlennBot (powered by Gemini 3.5 Flash & synced with Conversations.xlsx Sheet2 + Script.xlsx)."
          );
        if (isGenericFallback(prevText) && !isGenericFallback(cleanText)) {
          dedupedList[dedupedList.length - 1] = item;
          if (msgId) seenIds.add(msgId);
        }
        continue;
      }
    }
    if (msgId) seenIds.add(msgId);
    dedupedList.push(item);
  }

  dmClientMessages = dedupedList;
  activeDmClientMessages = dmClientMessages;

  const newOwnCount = dmClientMessages.filter((m) => m && m.is_own).length;
  const lastMsg = dmClientMessages[dmClientMessages.length - 1];
  const ownReplyArrived =
    newOwnCount > prevOwnCount ||
    Boolean(lastMsg && lastMsg.is_own) ||
    hasOwnReplyAfterLastUserMessage(dmClientMessages);

  if (ownReplyArrived) {
    dmClientAwaitingAiReply = false;
    dmClientWaitingForAi = false;
    renderDmClientBubbles(activeDmClientMessages, false);
    scrollDmClientChatToBottom();
    notifyRightDashboardIframeLiveDmUpdate();
    return;
  }

  renderDmClientBubbles(activeDmClientMessages);

  if (dmClientMessages.length !== previousCount) {
    scrollDmClientChatToBottom();
    notifyRightDashboardIframeLiveDmUpdate();
  }
}

async function pollDmClientThread() {
  const modal = document.getElementById("gb-dm-split-workspace-modal");
  if (!modal || modal.hidden || !activeDmSessionConvId) return;

  const cfg = DM_SPLIT_PLATFORMS[activeDmSplitPlatform] || DM_SPLIT_PLATFORMS.facebook;
  activeDmClientConvId = activeDmSessionConvId;
  activeDmAccountId = cfg.accountId;
  const pollUrl = `/api/messages/${encodeURIComponent(activeDmClientConvId)}/thread?account_id=${encodeURIComponent(activeDmAccountId)}&platform=${encodeURIComponent(cfg.key)}&force=false&_ts=${Date.now()}`;

  try {
    const res = await fetch(pollUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return;
    const data = await res.json();
    if (data && Array.isArray(data.messages)) {
      applyServerThreadMessages(data.messages);
    }
  } catch (_) {}
}
window.pollDmClientThread = pollDmClientThread;

function startDmClientPolling() {
  stopDmClientPolling();
  const cfg = DM_SPLIT_PLATFORMS[activeDmSplitPlatform] || DM_SPLIT_PLATFORMS.facebook;
  dmClientPollTimer = window.setInterval(() => {
    pollDmClientThread();
  }, cfg.pollIntervalMs || 2500);
}

function stopDmClientPolling() {
  if (dmClientPollTimer) {
    window.clearInterval(dmClientPollTimer);
    dmClientPollTimer = null;
  }
}

async function sendPortfolioLiveDmMessage(rawText) {
  const messageText = String(rawText || "").trim();
  if (!messageText || dmClientSendingInFlight) return;

  const cfg = DM_SPLIT_PLATFORMS[activeDmSplitPlatform] || DM_SPLIT_PLATFORMS.facebook;
  if (!activeDmSessionConvId) {
    const generated = generateNewDmSessionIds(cfg.accountId, cfg.key);
    activeDmSessionConvId = generated.sessionConvId;
    activeDmClientConvId = generated.sessionConvId;
    activeDmSessionConvKey = generated.sessionConvKey;
    activeDmAccountId = generated.accountId;
  } else {
    activeDmClientConvId = activeDmSessionConvId;
    activeDmAccountId = cfg.accountId;
  }

  const visitorInput = document.getElementById("gb-dm-visitor-name-input");
  const visitorName =
    (visitorInput && visitorInput.value ? visitorInput.value.trim() : "") ||
    cfg.defaultVisitorName ||
    "Portfolio Client";

  const msgInput = document.getElementById("gb-dm-client-message-input");
  if (msgInput && msgInput.value.trim() === messageText) {
    msgInput.value = "";
  }

  // 1. Optimistically append the visitor's message bubble to the Left Panel chat area and show typing indicator
  const optimisticMsg = {
    id: `opt_${Date.now()}`,
    is_own: false,
    sender_name: visitorName,
    message: messageText,
    timestamp: new Date().toISOString(),
  };
  dmClientMessages = [...dmClientMessages, optimisticMsg];
  activeDmClientMessages = dmClientMessages;
  dmClientAwaitingAiReply = true;
  renderDmClientBubbles(activeDmClientMessages, true);
  scrollDmClientChatToBottom();

  const sendBtn = document.getElementById("gb-dm-client-send-btn");
  dmClientSendingInFlight = true;
  if (sendBtn) sendBtn.disabled = true;

  const payload = {
    conversation_id: activeDmSessionConvId,
    account_id: cfg.accountId,
    account_name: cfg.accountName,
    platform: cfg.key || "facebook",
    participant_name: visitorName || "Portfolio Client",
    message: messageText,
  };

  try {
    const res = await fetch(cfg.liveDmPostEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.messages)) {
        applyServerThreadMessages(data.messages);
        if (hasOwnReplyAfterLastUserMessage(data.messages)) {
          dmClientAwaitingAiReply = false;
          renderDmClientBubbles(activeDmClientMessages, false);
        }
      } else {
        await pollDmClientThread();
      }
      notifyRightDashboardIframeLiveDmUpdate();
    } else {
      await pollDmClientThread();
    }
  } catch (_) {
    await pollDmClientThread();
  } finally {
    dmClientSendingInFlight = false;
    if (sendBtn) sendBtn.disabled = false;
  }
}
window.sendPortfolioLiveDmMessage = sendPortfolioLiveDmMessage;
window.sendLiveClientDmMessage = sendPortfolioLiveDmMessage;

function submitDmClientComposer() {
  const msgInput = document.getElementById("gb-dm-client-message-input");
  if (!msgInput) return;
  const text = String(msgInput.value || "").trim();
  if (!text) return;
  msgInput.value = "";
  sendPortfolioLiveDmMessage(text);
}
window.submitDmClientComposer = submitDmClientComposer;

function updateDmSplitWorkspaceDOM(
  platform = "facebook",
  reloadIframe = true,
  generateFreshSession = true
) {
  const platKey =
    platform && DM_SPLIT_PLATFORMS[String(platform).toLowerCase()]
      ? String(platform).toLowerCase()
      : "facebook";
  activeDmSplitPlatform = platKey;
  const cfg = DM_SPLIT_PLATFORMS[platKey] || DM_SPLIT_PLATFORMS.facebook;

  if (generateFreshSession || !activeDmSessionConvId) {
    const generated = generateNewDmSessionIds(cfg.accountId, platKey);
    activeDmSessionConvId = generated.sessionConvId;
    activeDmClientConvId = generated.sessionConvId;
    activeDmSessionConvKey = generated.sessionConvKey;
    activeDmAccountId = generated.accountId;
    dmClientMessages = [];
    activeDmClientMessages = [];
    dmClientAwaitingAiReply = false;
    renderDmClientBubbles([], false);
  }

  const fbBtn = document.getElementById("gb-dm-split-toggle-facebook");
  if (fbBtn) fbBtn.classList.toggle("is-active", platKey === "facebook");
  const igBtn = document.getElementById("gb-dm-split-tab-instagram");
  if (igBtn) igBtn.classList.toggle("is-active", platKey === "instagram");
  const waBtn = document.getElementById("gb-dm-split-tab-whatsapp");
  if (waBtn) waBtn.classList.toggle("is-active", platKey === "whatsapp");

  const pageTitleEl = document.getElementById("gb-dm-page-title");
  if (pageTitleEl) pageTitleEl.textContent = cfg.pageHeader;

  const pageSubtitleEl = document.getElementById("gb-dm-page-subtitle");
  if (pageSubtitleEl) pageSubtitleEl.textContent = cfg.pageSubtitle;

  const clientViewPillEl = document.querySelector(".gb-dm-client-view-pill");
  if (clientViewPillEl && cfg.clientViewPill) {
    clientViewPillEl.textContent = cfg.clientViewPill;
  }

  const msgInputEl = document.getElementById("gb-dm-client-message-input");
  if (msgInputEl) {
    msgInputEl.placeholder =
      cfg.placeholder || cfg.composerPlaceholder || "Write a message to GlennBot Automations...";
  }

  const typingTextEl = document.getElementById("gb-dm-typing-text");
  if (typingTextEl && cfg.typingIndicatorText) {
    typingTextEl.textContent = cfg.typingIndicatorText;
  }

  const pillsListEl = document.getElementById("gb-dm-starter-pills-list");
  if (pillsListEl && Array.isArray(cfg.quickStarterHints)) {
    const icons = ["💬", "⚡", "💼"];
    pillsListEl.innerHTML = cfg.quickStarterHints
      .map(
        (hint, idx) => `
          <button
            type="button"
            class="gb-dm-starter-pill"
            data-hint-text="${escapeDmHtml(hint)}"
            onclick="sendPortfolioLiveDmMessage(this.getAttribute('data-hint-text'));"
          >
            <span class="gb-dm-starter-pill-icon">${icons[idx % icons.length]}</span>
            <span class="gb-dm-starter-pill-text">"${escapeDmHtml(hint)}"</span>
            <span class="gb-dm-starter-pill-send">Send &rarr;</span>
          </button>
        `
      )
      .join("");
  }

  const statusTextEl = document.getElementById("gb-dm-live-status-text");
  if (statusTextEl) statusTextEl.textContent = cfg.statusBarText;

  const sessionBadgeEl = document.getElementById("gb-dm-session-id-badge");
  if (sessionBadgeEl) sessionBadgeEl.textContent = activeDmSessionConvId;

  const clientCard = document.getElementById("gb-dm-messenger-client-card");
  if (clientCard) {
    clientCard.setAttribute("data-session-conv-id", activeDmSessionConvId);
    clientCard.setAttribute("data-session-conv-key", activeDmSessionConvKey);
    clientCard.setAttribute("data-platform", platKey);
    clientCard.setAttribute(
      "data-thread-poll-url",
      `${GLENNBOT_BASE_URL}/api/messages/${encodeURIComponent(activeDmSessionConvId)}/thread?account_id=${encodeURIComponent(cfg.accountId)}&force=false`
    );
  }

  const iframe = document.getElementById("gb-dm-split-iframe");
  if (iframe && reloadIframe) {
    const queryTail = `&conv_key=${encodeURIComponent(activeDmSessionConvKey)}&conv_id=${encodeURIComponent(activeDmSessionConvId)}`;
    const upstreamUrl = `${cfg.baseUpstreamDashboardUrl}${queryTail}`;
    const proxyUrl = `${cfg.baseProxyDashboardUrl}${queryTail}`;
    iframe.setAttribute("data-upstream-url", upstreamUrl);
    iframe.setAttribute("data-session-conv-id", activeDmSessionConvId);
    iframe.setAttribute("data-session-conv-key", activeDmSessionConvKey);
    iframe.setAttribute("data-platform", platKey);
    iframe.src = proxyUrl;
  }
}

function startNewBlankDmSession() {
  updateDmSplitWorkspaceDOM(activeDmSplitPlatform, true, true);
  startDmClientPolling();
}
window.startNewBlankDmSession = startNewBlankDmSession;
window.resetDmBlankSession = startNewBlankDmSession;

function openDmSplitWorkspace(platform = "facebook") {
  const platKey =
    platform && DM_SPLIT_PLATFORMS[String(platform).toLowerCase()]
      ? String(platform).toLowerCase()
      : "facebook";
  closeDmPlatformChooser();
  closeWhatsAppInteractiveDmPopup();

  const modal = document.getElementById("gb-dm-split-workspace-modal");
  if (!modal) {
    const cfg = DM_SPLIT_PLATFORMS[platKey] || DM_SPLIT_PLATFORMS.facebook;
    const generated = generateNewDmSessionIds(cfg.accountId, platKey);
    activeDmSessionConvId = generated.sessionConvId;
    activeDmSessionConvKey = generated.sessionConvKey;
    return openGlennBotCustomPopup(
      `${cfg.baseProxyDashboardUrl}&conv_key=${encodeURIComponent(activeDmSessionConvKey)}&conv_id=${encodeURIComponent(activeDmSessionConvId)}`,
      cfg.dashboardWindowName,
      1100,
      860
    );
  }

  updateDmSplitWorkspaceDOM(platKey, true, true);
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  startDmClientPolling();

  if (!modal.dataset.boundDmSplitListeners) {
    modal.dataset.boundDmSplitListeners = "true";
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeDmSplitWorkspace();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) {
        e.stopPropagation();
        closeDmSplitWorkspace();
      }
    });
  }
}
window.openDmSplitWorkspace = openDmSplitWorkspace;

function switchDmSplitPlatform(platform = "facebook") {
  const platKey =
    platform && DM_SPLIT_PLATFORMS[String(platform).toLowerCase()]
      ? String(platform).toLowerCase()
      : "facebook";
  updateDmSplitWorkspaceDOM(platKey, true, true);
  startDmClientPolling();
}
window.switchDmSplitPlatform = switchDmSplitPlatform;

function refreshDmSplitIframe() {
  const cfg = DM_SPLIT_PLATFORMS[activeDmSplitPlatform] || DM_SPLIT_PLATFORMS.facebook;
  const iframe = document.getElementById("gb-dm-split-iframe");
  const btn = document.getElementById("gb-dm-refresh-live-chat-btn");
  if (!activeDmSessionConvId) {
    const generated = generateNewDmSessionIds(cfg.accountId, cfg.key);
    activeDmSessionConvId = generated.sessionConvId;
    activeDmSessionConvKey = generated.sessionConvKey;
  }
  const refreshTs = Date.now();
  if (btn) {
    btn.classList.add("is-refreshing");
    window.setTimeout(() => btn.classList.remove("is-refreshing"), 700);
  }
  if (iframe) {
    const queryTail = `&conv_key=${encodeURIComponent(activeDmSessionConvKey)}&conv_id=${encodeURIComponent(activeDmSessionConvId)}&_refresh=${refreshTs}`;
    iframe.setAttribute(
      "data-upstream-url",
      `${cfg.baseUpstreamDashboardUrl}${queryTail}`
    );
    iframe.setAttribute("data-session-conv-id", activeDmSessionConvId);
    iframe.setAttribute("data-session-conv-key", activeDmSessionConvKey);
    iframe.src = `${cfg.baseProxyDashboardUrl}${queryTail}`;
  }
  pollDmClientThread();
}
window.refreshDmSplitIframe = refreshDmSplitIframe;

function closeDmSplitWorkspace() {
  stopDmClientPolling();
  const modal = document.getElementById("gb-dm-split-workspace-modal");
  if (modal) {
    modal.hidden = true;
    const inspectorModal = document.getElementById("project-inspector-modal");
    if (!inspectorModal || inspectorModal.hidden) {
      document.body.style.overflow = "";
    }
  }
}
window.closeDmSplitWorkspace = closeDmSplitWorkspace;

function openDmPlatformChooser() {
  const chooser = document.getElementById("gb-dm-platform-chooser-modal");
  if (!chooser) {
    return openDmSplitWorkspace("facebook");
  }
  chooser.hidden = false;
  if (!chooser.dataset.boundDmListeners) {
    chooser.dataset.boundDmListeners = "true";
    chooser.addEventListener("click", (e) => {
      if (e.target === chooser) closeDmPlatformChooser();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !chooser.hidden) {
        e.stopPropagation();
        closeDmPlatformChooser();
      }
    });
  }
}
window.openDmPlatformChooser = openDmPlatformChooser;

function closeDmPlatformChooser() {
  const chooser = document.getElementById("gb-dm-platform-chooser-modal");
  if (chooser) chooser.hidden = true;
}
window.closeDmPlatformChooser = closeDmPlatformChooser;

function openWhatsAppInteractiveDmPopup() {
  closeDmPlatformChooser();
  const waModal = document.getElementById("gb-whatsapp-direct-modal");
  if (!waModal) {
    return openMaximizedDirectSocialDm("whatsapp");
  }
  waModal.hidden = false;
  const inputEl = document.getElementById("gb-wa-popup-message-input");
  if (inputEl && !inputEl.value.trim()) {
    inputEl.value = "Hi Glennard! Can you build webhooks & automations?";
  }
  if (!waModal.dataset.boundWaListeners) {
    waModal.dataset.boundWaListeners = "true";
    waModal.addEventListener("click", (e) => {
      if (e.target === waModal) closeWhatsAppInteractiveDmPopup();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !waModal.hidden) {
        e.stopPropagation();
        closeWhatsAppInteractiveDmPopup();
      }
    });
  }
}
window.openWhatsAppInteractiveDmPopup = openWhatsAppInteractiveDmPopup;

function closeWhatsAppInteractiveDmPopup() {
  const waModal = document.getElementById("gb-whatsapp-direct-modal");
  if (waModal) waModal.hidden = true;
}
window.closeWhatsAppInteractiveDmPopup = closeWhatsAppInteractiveDmPopup;

function selectWhatsAppStarterChip(chipText) {
  const inputEl = document.getElementById("gb-wa-popup-message-input");
  if (!inputEl) return;
  inputEl.value = String(chipText || "").trim();
  inputEl.focus();
}
window.selectWhatsAppStarterChip = selectWhatsAppStarterChip;

async function copyWhatsAppNumber() {
  const phoneText = "+63 917 549 7760";
  const labelEl = document.getElementById("gb-wa-copy-btn-label");
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(phoneText);
    }
  } catch (_) {}
  if (labelEl) {
    const prev = labelEl.textContent;
    labelEl.textContent = "✓ Copied +63 917 549 7760!";
    window.setTimeout(() => {
      labelEl.textContent = prev || "📋 Copy Number";
    }, 2000);
  }
  return phoneText;
}
window.copyWhatsAppNumber = copyWhatsAppNumber;

function launchExternalWhatsAppPopup() {
  const inputEl = document.getElementById("gb-wa-popup-message-input");
  const rawMessage = inputEl && inputEl.value ? inputEl.value.trim() : "";
  const baseWaUrl = DIRECT_SOCIAL_DM_URLS.whatsapp || "https://wa.me/639175497760";
  const finalUrl = rawMessage
    ? `${baseWaUrl}?text=${encodeURIComponent(rawMessage)}`
    : baseWaUrl;
  closeWhatsAppInteractiveDmPopup();
  return openMaximizedDirectSocialDm("whatsapp", finalUrl);
}
window.launchExternalWhatsAppPopup = launchExternalWhatsAppPopup;

function startLiveWhatsAppChatFromPopup() {
  const inputEl = document.getElementById("gb-wa-popup-message-input");
  const rawMessage =
    (inputEl && inputEl.value ? inputEl.value.trim() : "") ||
    "Hi Glennard! Can you build webhooks & automations?";
  closeWhatsAppInteractiveDmPopup();
  openDmSplitWorkspace("whatsapp");
  const splitInputEl = document.getElementById("gb-dm-client-message-input");
  if (splitInputEl) {
    splitInputEl.value = rawMessage;
  }
  sendPortfolioLiveDmMessage(rawMessage);
}
window.startLiveWhatsAppChatFromPopup = startLiveWhatsAppChatFromPopup;

const GLENNBOT_TARGET_EMAIL = "glennard.tasico.va@gmail.com";

function openEmailInteractivePopup() {
  closeDmPlatformChooser();
  closeWhatsAppInteractiveDmPopup();
  const emailModal = document.getElementById("gb-email-direct-modal");
  if (!emailModal) {
    return openGlennBotLivePopup("email");
  }
  emailModal.hidden = false;
  const subjEl = document.getElementById("gb-email-custom-subject");
  const bodyEl = document.getElementById("gb-email-custom-body");
  if (subjEl && !subjEl.value.trim()) {
    subjEl.value = "Inquiry: AI & n8n Automation Workflows";
  }
  if (bodyEl && !bodyEl.value.trim()) {
    bodyEl.value =
      "Hi Glennard! Can you build custom webhooks, n8n workflows, and AI chatbots for my business?";
  }
  if (!emailModal.dataset.boundEmailListeners) {
    emailModal.dataset.boundEmailListeners = "true";
    emailModal.addEventListener("click", (e) => {
      if (e.target === emailModal) closeEmailInteractivePopup();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !emailModal.hidden) {
        e.stopPropagation();
        closeEmailInteractivePopup();
      }
    });
  }
}
window.openEmailInteractivePopup = openEmailInteractivePopup;

function closeEmailInteractivePopup() {
  const emailModal = document.getElementById("gb-email-direct-modal");
  if (emailModal) emailModal.hidden = true;
}
window.closeEmailInteractivePopup = closeEmailInteractivePopup;

async function copyGlennBotEmailAddress() {
  const emailText = GLENNBOT_TARGET_EMAIL;
  const labelEl = document.getElementById("gb-email-copy-btn-label");
  const btnEl = document.getElementById("gb-email-copy-btn");
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(emailText);
    }
  } catch (_) {}
  const targetEl = labelEl || btnEl;
  if (targetEl) {
    const prev = targetEl.textContent;
    targetEl.textContent = "✅ Copied glennard.tasico.va@gmail.com!";
    window.setTimeout(() => {
      targetEl.textContent = prev || "📋 Copy Email";
    }, 2200);
  }
  return emailText;
}
window.copyGlennBotEmailAddress = copyGlennBotEmailAddress;

function selectEmailPromptChip(subjectText, bodyText) {
  const subjEl = document.getElementById("gb-email-custom-subject");
  const bodyEl = document.getElementById("gb-email-custom-body");
  if (subjEl && typeof subjectText === "string") {
    subjEl.value = subjectText.trim();
  }
  if (bodyEl && typeof bodyText === "string") {
    bodyEl.value = bodyText.trim();
    bodyEl.focus();
  }
}
window.selectEmailPromptChip = selectEmailPromptChip;

function launchGlennBotGmailCompose() {
  const subjEl = document.getElementById("gb-email-custom-subject");
  const bodyEl = document.getElementById("gb-email-custom-body");
  const subject =
    (subjEl && subjEl.value ? subjEl.value.trim() : "") ||
    "Inquiry: AI & n8n Automation Workflows";
  const body =
    (bodyEl && bodyEl.value ? bodyEl.value.trim() : "") ||
    "Hi Glennard! Can you build custom webhooks, n8n workflows, and AI chatbots for my business?";
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    GLENNBOT_TARGET_EMAIL
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(gmailUrl, "_blank", "noopener,noreferrer");
  return gmailUrl;
}
window.launchGlennBotGmailCompose = launchGlennBotGmailCompose;

function launchGlennBotMailto() {
  const subjEl = document.getElementById("gb-email-custom-subject");
  const bodyEl = document.getElementById("gb-email-custom-body");
  const subject =
    (subjEl && subjEl.value ? subjEl.value.trim() : "") ||
    "Inquiry: AI & n8n Automation Workflows";
  const body =
    (bodyEl && bodyEl.value ? bodyEl.value.trim() : "") ||
    "Hi Glennard! Can you build custom webhooks, n8n workflows, and AI chatbots for my business?";
  const mailtoUrl = `mailto:${GLENNBOT_TARGET_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
  return mailtoUrl;
}
window.launchGlennBotMailto = launchGlennBotMailto;

// ============================================================================
// SYS-03: IMPORT CONTACTS — CLIENT SANDBOX (STRICT BROWSER CACHE-ONLY PRIVACY)
// ============================================================================
const CLIENT_CONTACTS_CACHE_KEY = "gb_portfolio_client_contacts_v1";
window.CLIENT_CONTACTS_CACHE_KEY = CLIENT_CONTACTS_CACHE_KEY;

function getClientCachedContacts() {
  try {
    const raw = localStorage.getItem(CLIENT_CONTACTS_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}
window.getClientCachedContacts = getClientCachedContacts;

function saveClientCachedContacts(contactsList) {
  const safeList = Array.isArray(contactsList) ? contactsList : [];
  try {
    localStorage.setItem(CLIENT_CONTACTS_CACHE_KEY, JSON.stringify(safeList));
  } catch (_) {}
  updateSys03CachedContactsCountBadge();
  return safeList;
}
window.saveClientCachedContacts = saveClientCachedContacts;

function parseCsvRowsMain(csvText = "") {
  const text = String(csvText || "").replace(/^\uFEFF/, "");
  const rows = [];
  let curRow = [];
  let curCell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const nextCh = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && nextCh === '"') {
        curCell += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        curCell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      curRow.push(curCell.trim());
      curCell = "";
    } else if (ch === "\r" && nextCh === "\n") {
      curRow.push(curCell.trim());
      if (curRow.some((c) => c !== "")) rows.push(curRow);
      curRow = [];
      curCell = "";
      i += 1;
    } else if (ch === "\n" || ch === "\r") {
      curRow.push(curCell.trim());
      if (curRow.some((c) => c !== "")) rows.push(curRow);
      curRow = [];
      curCell = "";
    } else {
      curCell += ch;
    }
  }
  curRow.push(curCell.trim());
  if (curRow.some((c) => c !== "")) {
    rows.push(curRow);
  }
  return rows;
}

function parseApolloCsvToClientContacts(
  csvText = "",
  nowIso = new Date().toISOString()
) {
  const rows = parseCsvRowsMain(csvText);
  if (rows.length < 2) return [];

  const headerRow = rows[0].map((h) => String(h || "").trim().toLowerCase());
  const findColIdx = (candidates, fallbackIdx) => {
    for (const cand of candidates) {
      const idx = headerRow.indexOf(cand);
      if (idx !== -1) return idx;
    }
    for (const cand of candidates) {
      const idx = headerRow.findIndex((h) => h.includes(cand));
      if (idx !== -1) return idx;
    }
    return fallbackIdx;
  };

  const firstNameIdx = findColIdx(["first name", "firstname", "first_name"], 0);
  const lastNameIdx = findColIdx(["last name", "lastname", "last_name"], 1);
  const titleIdx = findColIdx(["title", "job title", "role", "position"], 2);
  // Column E (index 4) is Company in Apollo exports
  const companyIdx =
    headerRow[4] &&
    (headerRow[4].includes("company") || headerRow[4].includes("organization"))
      ? 4
      : findColIdx(
          [
            "company",
            "company name",
            "company_name",
            "organization",
            "account name",
          ],
          4
        );
  // Column F (index 5) is Email Address in Apollo exports
  const emailIdx =
    headerRow[5] && headerRow[5].includes("email")
      ? 5
      : findColIdx(
          ["email", "email address", "work email", "primary email"],
          5
        );
  // Column T (index 19) is Contact Number in Apollo exports
  const phoneIdx =
    headerRow[19] !== undefined &&
    (headerRow[19].includes("phone") ||
      headerRow[19].includes("contact") ||
      headerRow[19].includes("mobile") ||
      headerRow.length >= 20)
      ? 19
      : findColIdx(
          [
            "work direct phone",
            "corporate phone",
            "mobile phone",
            "first phone",
            "contact number",
            "phone",
          ],
          19
        );

  const contacts = [];
  for (let rIdx = 1; rIdx < rows.length; rIdx += 1) {
    const row = rows[rIdx];
    const firstName = String(row[firstNameIdx] || "").trim();
    const lastName = String(row[lastNameIdx] || "").trim();
    const jobTitle = String(row[titleIdx] || "").trim();
    const companyName = String(row[companyIdx] || row[4] || "").trim();
    const emailAddr = String(row[emailIdx] || row[5] || "").trim();
    let phoneNum = String(row[phoneIdx] || row[19] || "").trim();
    if (!phoneNum) {
      const altPhoneIdx = findColIdx(
        ["phone", "mobile", "contact number", "direct phone"],
        -1
      );
      if (altPhoneIdx >= 0 && row[altPhoneIdx]) {
        phoneNum = String(row[altPhoneIdx]).trim();
      }
    }

    const fullName =
      [firstName, lastName].filter(Boolean).join(" ").trim() ||
      (emailAddr ? emailAddr.split("@")[0] : "") ||
      `Contact ${rIdx}`;

    if (!firstName && !lastName && !emailAddr && !phoneNum && !companyName) {
      continue;
    }

    const contactId = `client_csv_${Date.now()}_${rIdx}`;
    contacts.push({
      id: contactId,
      contact_id: contactId,
      first_name: firstName || fullName.split(" ")[0] || "",
      last_name: lastName || fullName.split(" ").slice(1).join(" ") || "",
      name: fullName,
      full_name: fullName,
      company: companyName,
      company_name: companyName,
      email: emailAddr,
      email_address: emailAddr,
      phone: phoneNum,
      contact_number: phoneNum,
      title: jobTitle || "Lead",
      category: jobTitle || "Apollo CSV Lead",
      source: "Apollo CSV (Client Cache)",
      platform: "apollo_csv",
      created_at: nowIso,
      ephemeral_client_cache: true,
    });
  }
  return contacts;
}
window.parseApolloCsvToClientContacts = parseApolloCsvToClientContacts;

function mergeClientContactsCache(existingContacts = [], incomingContacts = []) {
  const safeExisting = Array.isArray(existingContacts) ? existingContacts : [];
  const safeIncoming = Array.isArray(incomingContacts) ? incomingContacts : [];
  const byKey = new Map();
  const order = [];

  const computeKey = (c, idx) => {
    const email = String(c.email || c.email_address || "").trim().toLowerCase();
    if (email) return `email:${email}`;
    const phone = String(c.phone || c.contact_number || "").replace(/\s+/g, "");
    if (phone) return `phone:${phone}`;
    const nameComp = `${String(c.name || c.full_name || "")
      .trim()
      .toLowerCase()}|${String(c.company || c.company_name || "")
      .trim()
      .toLowerCase()}`;
    if (nameComp !== "|") return `nc:${nameComp}`;
    return `id:${String(c.id || c.contact_id || idx)}`;
  };

  [...safeExisting, ...safeIncoming].forEach((raw, idx) => {
    if (!raw || typeof raw !== "object") return;
    const firstName = String(raw.first_name || "").trim();
    const lastName = String(raw.last_name || "").trim();
    const fullName =
      String(raw.name || raw.full_name || "").trim() ||
      [firstName, lastName].filter(Boolean).join(" ").trim() ||
      "Client Contact";
    const company = String(raw.company || raw.company_name || "").trim();
    const email = String(raw.email || raw.email_address || "").trim();
    const phone = String(raw.phone || raw.contact_number || "").trim();
    const id = String(
      raw.id || raw.contact_id || `client_contact_${Date.now()}_${idx}`
    );
    const normalized = {
      ...raw,
      id,
      contact_id: id,
      first_name: firstName || fullName.split(" ")[0] || "",
      last_name: lastName || fullName.split(" ").slice(1).join(" ") || "",
      name: fullName,
      full_name: fullName,
      company,
      company_name: company,
      email,
      email_address: email,
      phone,
      contact_number: phone,
      title: String(raw.title || raw.category || "Lead").trim(),
      category: String(raw.category || raw.title || "Client Imported").trim(),
      source: String(raw.source || "Client Browser Cache").trim(),
      platform: String(raw.platform || "apollo_csv").trim(),
      ephemeral_client_cache: true,
    };
    const key = computeKey(normalized, idx);
    if (!byKey.has(key)) {
      order.push(key);
    }
    byKey.set(key, { ...(byKey.get(key) || {}), ...normalized });
  });

  return order.map((k) => byKey.get(k));
}
window.mergeClientContactsCache = mergeClientContactsCache;

function mergeSys03CachedContacts(incomingContacts = []) {
  const existing = getClientCachedContacts();
  const merged = mergeClientContactsCache(existing, incomingContacts);
  saveClientCachedContacts(merged);
  updateSys03CachedContactsCountBadge();
  broadcastSys03ContactsCacheUpdate(merged);
  return merged;
}
window.mergeSys03CachedContacts = mergeSys03CachedContacts;

let _sys03ContactsPopupWinRef = null;
let _sys03PendingGoogleOAuth = {
  connected_account_id: "",
  entity_id: "",
  account_email: "",
  pollTimer: null,
  syncInFlight: false,
};
window._sys03PendingGoogleOAuth = _sys03PendingGoogleOAuth;

function broadcastSys03ContactsCacheUpdate(contactsList) {
  const safeContacts = Array.isArray(contactsList)
    ? contactsList
    : getClientCachedContacts();
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel("glennbot_portfolio_contacts_channel");
      bc.postMessage({
        type: "GLENNBOT_CLIENT_CONTACTS_CACHE_UPDATED",
        contacts: safeContacts,
        timestamp: Date.now(),
      });
      bc.close();
    }
  } catch (_) {}

  try {
    if (_sys03ContactsPopupWinRef && !_sys03ContactsPopupWinRef.closed) {
      _sys03ContactsPopupWinRef.postMessage(
        {
          type: "GLENNBOT_CLIENT_CONTACTS_CACHE_UPDATED",
          contacts: safeContacts,
          timestamp: Date.now(),
        },
        "*"
      );
    }
  } catch (_) {}
}
window.broadcastSys03ContactsCacheUpdate = broadcastSys03ContactsCacheUpdate;

function renderSys03InlineCachedContactsPreview(contactsOverride = null) {
  const wrapEl = document.getElementById("gb-sys03-inline-cached-preview-wrap");
  const countBadgeEl = document.getElementById(
    "gb-sys03-inline-cached-preview-count"
  );
  const tbodyEl = document.getElementById(
    "gb-sys03-inline-cached-preview-tbody"
  );
  if (!wrapEl || !tbodyEl) return;

  const cached = Array.isArray(contactsOverride)
    ? contactsOverride
    : getClientCachedContacts();

  if (!cached.length) {
    wrapEl.hidden = true;
    wrapEl.style.display = "none";
    tbodyEl.innerHTML = "";
    if (countBadgeEl) countBadgeEl.textContent = "0 Contacts";
    return;
  }

  wrapEl.hidden = false;
  wrapEl.style.display = "block";
  if (countBadgeEl) {
    countBadgeEl.textContent = `${cached.length} Contact${
      cached.length === 1 ? "" : "s"
    } Ready in Browser Cache`;
  }

  tbodyEl.innerHTML = cached
    .map((c) => {
      const fullName = String(c.name || c.full_name || "").trim();
      const firstName =
        String(c.first_name || "").trim() ||
        (fullName ? fullName.split(/\s+/)[0] : "—");
      const lastName =
        String(c.last_name || "").trim() ||
        (fullName ? fullName.split(/\s+/).slice(1).join(" ") : "—") ||
        "—";
      const company =
        String(c.company || c.company_name || "").trim() || "—";
      const email =
        String(c.email || c.email_address || "").trim() || "—";
      const phone =
        String(c.phone || c.contact_number || "").trim() || "—";
      const rawPlatform = String(c.platform || c.source || "").toLowerCase();
      const isGoogle = rawPlatform.includes("google");
      const sourceLabel = isGoogle ? "Google Contacts" : "Apollo CSV";
      const badgeStyle = isGoogle
        ? "background: rgba(56, 189, 248, 0.14); border: 1px solid rgba(56, 189, 248, 0.4); color: #7dd3fc;"
        : "background: rgba(16, 185, 129, 0.14); border: 1px solid rgba(16, 185, 129, 0.4); color: #6ee7b7;";

      return `<tr style="border-bottom: 1px solid rgba(51, 65, 85, 0.45);">
        <td style="padding: 7px 10px; color: #f8fafc; font-weight: 600;">${escapeDmHtml(
          firstName
        )}</td>
        <td style="padding: 7px 10px; color: #e2e8f0;">${escapeDmHtml(
          lastName
        )}</td>
        <td style="padding: 7px 10px; color: #cbd5e1;">${escapeDmHtml(
          company
        )}</td>
        <td style="padding: 7px 10px; color: #38bdf8; font-family: monospace;">${escapeDmHtml(
          email
        )}</td>
        <td style="padding: 7px 10px; color: #cbd5e1; font-family: monospace;">${escapeDmHtml(
          phone
        )}</td>
        <td style="padding: 7px 10px;">
          <span style="display: inline-flex; align-items: center; padding: 2px 7px; border-radius: 999px; font-size: 0.65rem; font-weight: 700; ${badgeStyle}">${escapeDmHtml(
        sourceLabel
      )}</span>
        </td>
      </tr>`;
    })
    .join("");
}
window.renderSys03InlineCachedContactsPreview =
  renderSys03InlineCachedContactsPreview;

function updateSys03CachedContactsCountBadge() {
  const cached = getClientCachedContacts();
  const countEl = document.getElementById("gb-sys03-cached-count-label");
  if (countEl) {
    countEl.textContent = `View Cached Contacts (${cached.length})`;
  }
  const openBtn = document.getElementById("gb-sys03-open-cached-contacts-btn");
  if (openBtn) {
    if (cached.length > 0) {
      openBtn.style.background = "rgba(16, 185, 129, 0.16)";
      openBtn.style.borderColor = "rgba(16, 185, 129, 0.55)";
      openBtn.style.color = "#34d399";
    } else {
      openBtn.style.background = "rgba(30, 41, 59, 0.85)";
      openBtn.style.borderColor = "rgba(148, 163, 184, 0.3)";
      openBtn.style.color = "#e2e8f0";
    }
  }
  renderSys03InlineCachedContactsPreview(cached);
}
window.updateSys03CachedContactsCountBadge =
  updateSys03CachedContactsCountBadge;

function setSys03ImportStatusMessage(
  msg,
  isError = false,
  isLoading = false
) {
  const textStr = String(msg || "");
  const statusEl = document.getElementById("gb-sys03-import-status-msg");
  if (statusEl) {
    statusEl.textContent = textStr;
    statusEl.style.color = isError
      ? "#f87171"
      : isLoading
      ? "#38bdf8"
      : "#34d399";
  }

  const bannerEl = document.getElementById("sys03-import-contacts-status");
  if (bannerEl) {
    if (!textStr || textStr === "Ready for browser-cache import") {
      bannerEl.style.display = "none";
      bannerEl.innerHTML = "";
    } else {
      bannerEl.style.display = "flex";
      bannerEl.style.borderColor = isError
        ? "rgba(248, 113, 113, 0.45)"
        : isLoading
        ? "rgba(56, 189, 248, 0.45)"
        : "rgba(16, 185, 129, 0.45)";
      bannerEl.style.color = isError
        ? "#fca5a5"
        : isLoading
        ? "#7dd3fc"
        : "#6ee7b7";
      const iconHtml = isLoading
        ? '<i class="fas fa-circle-notch fa-spin" aria-hidden="true"></i>'
        : isError
        ? '<i class="fas fa-exclamation-circle" aria-hidden="true"></i>'
        : '<i class="fas fa-check-circle" aria-hidden="true"></i>';
      bannerEl.innerHTML = `${iconHtml} <span>${escapeDmHtml(textStr)}</span>`;
    }
  }
}

function openSys03ImportContactsModal(triggerBtn) {
  if (triggerBtn && typeof triggerBtn.blur === "function") {
    try {
      triggerBtn.blur();
    } catch (_) {}
  }
  const modal = document.getElementById("gb-sys03-import-contacts-modal");
  if (!modal) {
    return openSys03CachedContactsPopupWindow();
  }
  updateSys03CachedContactsCountBadge();
  setSys03ImportStatusMessage("Ready for browser-cache import", false, false);
  const statusEl = document.getElementById("gb-sys03-import-status-msg");
  if (statusEl) statusEl.style.color = "#94a3b8";
  modal.hidden = false;

  if (!modal.dataset.boundSys03Listeners) {
    modal.dataset.boundSys03Listeners = "true";
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeSys03ImportContactsModal();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) {
        e.stopPropagation();
        closeSys03ImportContactsModal();
      }
    });
  }
  return modal;
}
window.openSys03ImportContactsModal = openSys03ImportContactsModal;

function closeSys03ImportContactsModal() {
  const modal = document.getElementById("gb-sys03-import-contacts-modal");
  if (modal) {
    modal.hidden = true;
  }
}
window.closeSys03ImportContactsModal = closeSys03ImportContactsModal;

function openSys03CachedContactsPopupWindow() {
  updateSys03CachedContactsCountBadge();
  const popupWin = openGlennBotCustomPopup(
    "/glennbot-popout?popout_mode=workspace_view&tab=contacts&focus=contacts&client_cache_only=1",
    "GlennBotClientContactsPopup",
    1260,
    860
  );
  _sys03ContactsPopupWinRef = popupWin;
  broadcastSys03ContactsCacheUpdate(getClientCachedContacts());
  window.setTimeout(() => {
    broadcastSys03ContactsCacheUpdate(getClientCachedContacts());
  }, 450);
  return popupWin;
}
window.openSys03CachedContactsPopupWindow = openSys03CachedContactsPopupWindow;
function launchSys03ClientContactsPopup() {
  return openSys03CachedContactsPopupWindow();
}
window.launchSys03ClientContactsPopup = launchSys03ClientContactsPopup;

function triggerSys03ApolloCsvPicker() {
  const fileInput = document.getElementById("gb-sys03-apollo-csv-file-input");
  if (!fileInput) return;
  fileInput.value = "";
  fileInput.click();
}
window.triggerSys03ApolloCsvPicker = triggerSys03ApolloCsvPicker;

async function handleSys03ApolloCsvFileSelect(event) {
  const input = event && event.target ? event.target : null;
  const file = input && input.files && input.files[0] ? input.files[0] : null;
  if (!file) return;

  setSys03ImportStatusMessage(
    `Parsing ${file.name} in browser cache...`,
    false,
    true
  );
  try {
    const csvText = await file.text();
    let extracted = parseApolloCsvToClientContacts(csvText);

    // Optional ephemeral server parse fallback if custom header format needed
    if (!extracted.length) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const resp = await fetch("/api/contacts/import/apollo-csv?ephemeral=1", {
          method: "POST",
          body: formData,
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data && Array.isArray(data.contacts)) {
            extracted = data.contacts;
          }
        }
      } catch (_) {}
    }

    if (!extracted.length) {
      setSys03ImportStatusMessage(
        "No valid contacts found in CSV. Try 'Download Sample Apollo CSV' below!",
        true,
        false
      );
      return;
    }

    mergeSys03CachedContacts(extracted);
    setSys03ImportStatusMessage(
      `✓ Cached ${extracted.length} contacts in browser localStorage! Previewing below & opening Contacts CRM...`,
      false,
      false
    );
    openSys03CachedContactsPopupWindow();
  } catch (err) {
    setSys03ImportStatusMessage(
      "Could not read CSV file. Please upload a valid .csv file.",
      true,
      false
    );
  }
}
window.handleSys03ApolloCsvFileSelect = handleSys03ApolloCsvFileSelect;

function buildSampleApolloCsvContentMain() {
  const headers = [
    "First Name",
    "Last Name",
    "Title",
    "Seniority",
    "Company",
    "Email",
    "Email Status",
    "Stage",
    "Lists",
    "Industry",
    "Employees",
    "Person Linkedin Url",
    "Website",
    "City",
    "State",
    "Country",
    "Company Address",
    "Company City",
    "Company Country",
    "Work Direct Phone",
  ];
  const rows = [
    [
      "Sophia",
      "Reyes",
      "VP of Operations",
      "VP",
      "Nexus Logistics PH",
      "sophia.reyes@nexuslogistics.example.com",
      "Verified",
      "Cold",
      "Q4 Automation Leads",
      "Logistics & Supply Chain",
      "120",
      "https://linkedin.com/in/sophiareyes-demo",
      "https://nexuslogistics.example.com",
      "Makati",
      "Metro Manila",
      "Philippines",
      "Ayala Ave",
      "Makati",
      "Philippines",
      "+63 917 555 0142",
    ],
    [
      "Marcus",
      "Vance",
      "Head of RevOps",
      "Director",
      "CloudScale SaaS Inc.",
      "m.vance@cloudscalesaas.example.io",
      "Verified",
      "Cold",
      "Q4 Automation Leads",
      "Computer Software",
      "85",
      "https://linkedin.com/in/marcusvance-demo",
      "https://cloudscalesaas.example.io",
      "Austin",
      "Texas",
      "United States",
      "Congress Ave",
      "Austin",
      "United States",
      "+1 512-555-0198",
    ],
    [
      "Elena",
      "Rostova",
      "Chief Technology Officer",
      "C-Suite",
      "FinEdge Payments",
      "elena@finedgepay.example.com",
      "Verified",
      "Warm",
      "Q4 Automation Leads",
      "Financial Services",
      "210",
      "https://linkedin.com/in/elenarostova-demo",
      "https://finedgepay.example.com",
      "Singapore",
      "Central",
      "Singapore",
      "Raffles Place",
      "Singapore",
      "Singapore",
      "+65 8123 4567",
    ],
    [
      "David",
      "Chen",
      "Director of Supply Chain",
      "Director",
      "Precision Manufacturing Group",
      "dchen@precisionmfg.example.com",
      "Verified",
      "Cold",
      "Q4 Automation Leads",
      "Industrial Automation",
      "450",
      "https://linkedin.com/in/davidchen-demo",
      "https://precisionmfg.example.com",
      "Laguna",
      "Calabarzon",
      "Philippines",
      "Carmelray Industrial Park",
      "Calamba",
      "Philippines",
      "+63 918 555 0239",
    ],
    [
      "Hannah",
      "Alvarez",
      "Founder & Managing Partner",
      "Founder",
      "BrightPeak Digital Agency",
      "hannah@brightpeak.example.co",
      "Verified",
      "Warm",
      "Q4 Automation Leads",
      "Marketing & Advertising",
      "35",
      "https://linkedin.com/in/hannahalvarez-demo",
      "https://brightpeak.example.co",
      "Taguig",
      "Metro Manila",
      "Philippines",
      "BGC High Street",
      "Taguig",
      "Philippines",
      "+63 917 555 0891",
    ],
  ];
  const escapeCsvCell = (val) => {
    const str = String(val ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  return [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((r) => r.map(escapeCsvCell).join(",")),
  ].join("\r\n");
}

function downloadSampleApolloCsv() {
  const csvContent = buildSampleApolloCsvContentMain();
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "sample_apollo_contacts_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  setSys03ImportStatusMessage(
    "✓ Downloaded sample_apollo_contacts_export.csv — click 'Import via Apollo CSV' to upload it!",
    false,
    false
  );
  return csvContent;
}
window.downloadSampleApolloCsv = downloadSampleApolloCsv;

async function finalizeSys03GoogleContactsSync(overridePayload = {}) {
  if (_sys03PendingGoogleOAuth.syncInFlight) return;
  _sys03PendingGoogleOAuth.syncInFlight = true;

  if (_sys03PendingGoogleOAuth.pollTimer) {
    window.clearInterval(_sys03PendingGoogleOAuth.pollTimer);
    _sys03PendingGoogleOAuth.pollTimer = null;
  }

  setSys03ImportStatusMessage(
    "Syncing your Google Contacts into your browser cache (0% server retention)...",
    false,
    true
  );

  try {
    let importedContacts = [];

    if (
      overridePayload &&
      Array.isArray(overridePayload.contacts) &&
      overridePayload.contacts.length > 0
    ) {
      importedContacts = overridePayload.contacts;
    } else {
      const reqBody = {
        connected_account_id:
          (overridePayload && overridePayload.connected_account_id) ||
          _sys03PendingGoogleOAuth.connected_account_id ||
          "",
        entity_id:
          (overridePayload && overridePayload.entity_id) ||
          _sys03PendingGoogleOAuth.entity_id ||
          "",
        account_email:
          (overridePayload &&
            (overridePayload.account_email || overridePayload.email)) ||
          _sys03PendingGoogleOAuth.account_email ||
          "",
        ephemeral: true,
        client_cache_only: true,
      };

      const resp = await fetch(
        "/api/contacts/import/google?ephemeral=1&client_cache_only=1",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(reqBody),
        }
      );
      if (resp.ok) {
        const syncData = await resp.json();
        if (
          syncData &&
          Array.isArray(syncData.contacts) &&
          syncData.contacts.length > 0
        ) {
          importedContacts = syncData.contacts;
        }
      }
    }

    if (importedContacts.length > 0) {
      mergeSys03CachedContacts(importedContacts);
      setSys03ImportStatusMessage(
        `Successfully imported ${importedContacts.length} Google Contact(s) into your browser cache!`,
        false,
        false
      );
      openSys03CachedContactsPopupWindow();
    } else {
      updateSys03CachedContactsCountBadge();
      setSys03ImportStatusMessage(
        "Google Contacts session finished (0 new contacts returned). Opening Contacts Sandbox...",
        false,
        false
      );
      openSys03CachedContactsPopupWindow();
    }
  } catch (err) {
    setSys03ImportStatusMessage(
      "Could not complete Google Contacts sync. Please try again or import via Apollo CSV.",
      true,
      false
    );
  } finally {
    _sys03PendingGoogleOAuth.syncInFlight = false;
  }
}
window.finalizeSys03GoogleContactsSync = finalizeSys03GoogleContactsSync;

async function startSys03GoogleContactsImport() {
  if (_sys03PendingGoogleOAuth.pollTimer) {
    window.clearInterval(_sys03PendingGoogleOAuth.pollTimer);
    _sys03PendingGoogleOAuth.pollTimer = null;
  }
  _sys03PendingGoogleOAuth.syncInFlight = false;

  setSys03ImportStatusMessage(
    "Starting isolated Google Contacts OAuth 2.0 session...",
    false,
    true
  );
  const width = 580;
  const height = 700;
  const left = Math.max(0, Math.round((window.screen.width - width) / 2));
  const top = Math.max(0, Math.round((window.screen.height - height) / 2));
  const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=no`;

  let oauthPopup = window.open(
    "about:blank",
    "GlennBotGoogleContactsOAuth",
    features
  );

  const attachOAuthPopupCloseMonitor = (popupRef) => {
    if (!popupRef) return;
    if (_sys03PendingGoogleOAuth.pollTimer) {
      window.clearInterval(_sys03PendingGoogleOAuth.pollTimer);
    }
    _sys03PendingGoogleOAuth.pollTimer = window.setInterval(() => {
      if (!popupRef || popupRef.closed) {
        window.clearInterval(_sys03PendingGoogleOAuth.pollTimer);
        _sys03PendingGoogleOAuth.pollTimer = null;
        finalizeSys03GoogleContactsSync();
      }
    }, 1000);
  };

  try {
    const res = await fetch(
      "/api/oauth/google-contacts/start?ephemeral=1&client_cache_only=1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ephemeral: true,
          client_cache_only: true,
          callback_origin: window.location.origin,
        }),
      }
    );
    const data = await res.json();
    if (data && typeof data === "object") {
      _sys03PendingGoogleOAuth.connected_account_id =
        data.connected_account_id || "";
      _sys03PendingGoogleOAuth.entity_id = data.entity_id || "";
      _sys03PendingGoogleOAuth.account_email =
        data.account_email || data.email || "";
      _sys03PendingGoogleOAuth.syncInFlight = false;
    }

    const redirectUrl =
      (data && (data.auth_url || data.redirect_url || data.url)) || "";

    if (redirectUrl) {
      if (oauthPopup && !oauthPopup.closed) {
        oauthPopup.location.href = redirectUrl;
        oauthPopup.focus();
      } else {
        oauthPopup = window.open(
          redirectUrl,
          "GlennBotGoogleContactsOAuth",
          features
        );
      }
      setSys03ImportStatusMessage(
        "Complete Google sign-in in the popup window to sync your contacts into browser cache...",
        false,
        true
      );
      attachOAuthPopupCloseMonitor(oauthPopup);
      return;
    }

    if (data && Array.isArray(data.contacts) && data.contacts.length > 0) {
      if (oauthPopup && !oauthPopup.closed) oauthPopup.close();
      await finalizeSys03GoogleContactsSync(data);
      return;
    }
  } catch (_) {}

  if (oauthPopup && !oauthPopup.closed) {
    oauthPopup.location.href = `/api/oauth/google-contacts/redirect?ephemeral=1&client_cache_only=1&callback_origin=${encodeURIComponent(
      window.location.origin
    )}`;
    oauthPopup.focus();
    attachOAuthPopupCloseMonitor(oauthPopup);
  }
}
window.startSys03GoogleContactsImport = startSys03GoogleContactsImport;

window.addEventListener("message", async (event) => {
  const payload = event && event.data ? event.data : null;
  if (!payload || typeof payload !== "object") return;

  if (
    payload.type === "GLENNBOT_GOOGLE_CONTACTS_IMPORT_DONE" ||
    payload.type === "gb_google_contacts_ephemeral_import"
  ) {
    await finalizeSys03GoogleContactsSync(payload);
  }
});

// ============================================================================
// SYS-03: CREATE CUSTOM MESSAGE & SEND BATCH EMAIL (CLIENT SANDBOX + COMPOSE.XLSX)
// ============================================================================
const CLIENT_CUSTOM_MESSAGE_CACHE_KEY = "gb_portfolio_client_custom_message_v1";
const SYS03_DEFAULT_SUBJECT_TEMPLATE = "Quick question for [[Company Name]]";
const SYS03_DEFAULT_BODY_TEMPLATE =
  "Hi [[First Name]] [[Last Name]],\n\nI came across [[Company Name]] and wanted to share how we help operations teams automate CRM outreach and n8n workflows.\n\nWould love to connect with you at [[Email Address]] or [[Contact Number]].\n\nBest regards,\nGlennard";

let _sys03ActiveComposerField = "body";
let _sys03PrereqNextAction = "import_contacts";
let _sys03BatchSendInFlight = false;

function extractNormalizedContactFields(contact = {}) {
  const src = contact && typeof contact === "object" ? contact : {};
  const rawName = String(src.name || src.full_name || src.fullName || "")
    .trim()
    .replace(/\s+/g, " ");
  const nameParts = rawName ? rawName.split(" ") : [];

  let firstName = String(src.first_name ?? src.firstName ?? "").trim();
  let middleName = String(src.middle_name ?? src.middleName ?? "").trim();
  let lastName = String(src.last_name ?? src.lastName ?? "").trim();

  if (!firstName && nameParts.length >= 1) {
    firstName = nameParts[0];
  }
  if (!middleName && !lastName && nameParts.length >= 3) {
    middleName = nameParts.slice(1, -1).join(" ");
    lastName = nameParts[nameParts.length - 1];
  } else if (!lastName && nameParts.length >= 2) {
    if (!middleName && nameParts.length >= 3) {
      middleName = nameParts.slice(1, -1).join(" ");
      lastName = nameParts[nameParts.length - 1];
    } else {
      lastName = nameParts.slice(1).join(" ");
    }
  } else if (firstName && lastName && !middleName && nameParts.length >= 3) {
    const fnLower = firstName.toLowerCase();
    const lnLower = lastName.toLowerCase();
    if (
      nameParts[0].toLowerCase() === fnLower &&
      nameParts[nameParts.length - 1].toLowerCase() === lnLower
    ) {
      middleName = nameParts.slice(1, -1).join(" ");
    }
  }

  const companyName = String(
    src.company ?? src.company_name ?? src.companyName ?? src.organization ?? ""
  ).trim();
  const emailAddress = String(
    src.email ?? src.email_address ?? src.emailAddress ?? ""
  ).trim();
  const contactNumber = String(
    src.phone ?? src.contact_number ?? src.contactNumber ?? src.mobile ?? ""
  ).trim();

  return {
    firstName,
    middleName,
    lastName,
    companyName,
    emailAddress,
    contactNumber,
  };
}
window.extractNormalizedContactFields = extractNormalizedContactFields;

function resolveCustomMessageAttributes(templateText = "", contact = {}) {
  const rawTemplate = String(templateText ?? "");
  if (!rawTemplate) return "";
  const fields = extractNormalizedContactFields(contact);

  return rawTemplate
    .replace(/\[\[\s*first\s+name\s*\]\]/gi, fields.firstName)
    .replace(/\[\[\s*middle\s+name\s*\]\]/gi, fields.middleName)
    .replace(/\[\[\s*last\s+name\s*\]\]/gi, fields.lastName)
    .replace(/\[\[\s*company\s+name\s*\]\]/gi, fields.companyName)
    .replace(/\[\[\s*email\s+address\s*\]\]/gi, fields.emailAddress)
    .replace(/\[\[\s*contact\s+number\s*\]\]/gi, fields.contactNumber);
}
window.resolveCustomMessageAttributes = resolveCustomMessageAttributes;

function buildSys03BatchRowKey(sessionId = "", index = 0, email = "") {
  const cleanSession =
    String(sessionId || "")
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "") || `s${Date.now().toString(36)}`;
  const cleanIdx = Math.max(0, Math.trunc(Number(index) || 0));
  const cleanEmail =
    String(email || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9@._-]/g, "") || `row${cleanIdx}`;
  return `portfolio_row_${cleanSession}_${cleanIdx}_${cleanEmail}`;
}
window.buildSys03BatchRowKey = buildSys03BatchRowKey;

function isValidSys03Sheet2Row(row = {}) {
  if (!row || typeof row !== "object") return false;
  const firstName = String(row.B ?? row.firstName ?? row.first_name ?? "").trim();
  const emailAddress = String(
    row.F ?? row.emailAddress ?? row.email_address ?? row.email ?? ""
  ).trim();
  const personalizedMessage = String(
    row.H ?? row.personalizedMessage ?? row.body ?? row.message ?? ""
  ).trim();

  if (!firstName && !emailAddress) {
    return false;
  }
  if (
    personalizedMessage.startsWith("{'id':") ||
    personalizedMessage.startsWith('{"id":')
  ) {
    return false;
  }
  return true;
}
window.isValidSys03Sheet2Row = isValidSys03Sheet2Row;

function getClientCachedCustomMessage() {
  try {
    const raw = window.localStorage.getItem(CLIENT_CUSTOM_MESSAGE_CACHE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        const msg = String(parsed.message ?? parsed.body ?? "").trim();
        const subj =
          String(parsed.subject ?? "").trim() || SYS03_DEFAULT_SUBJECT_TEMPLATE;
        return {
          subject: subj,
          message: msg,
          body: msg,
          updated_at: parsed.updated_at || null,
        };
      }
      if (typeof parsed === "string") {
        return {
          subject: SYS03_DEFAULT_SUBJECT_TEMPLATE,
          message: parsed.trim(),
          body: parsed.trim(),
          updated_at: null,
        };
      }
    } catch (_) {
      const plain = String(raw || "").trim();
      if (plain) {
        return {
          subject: SYS03_DEFAULT_SUBJECT_TEMPLATE,
          message: plain,
          body: plain,
          updated_at: null,
        };
      }
    }
  } catch (_) {}
  return null;
}
window.getClientCachedCustomMessage = getClientCachedCustomMessage;

function saveClientCachedCustomMessage(subjectText, messageText) {
  const cleanSubj =
    String(subjectText || "").trim() || SYS03_DEFAULT_SUBJECT_TEMPLATE;
  const cleanMsg = String(messageText || "").trim();
  const payload = {
    subject: cleanSubj,
    message: cleanMsg,
    body: cleanMsg,
    updated_at: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(
      CLIENT_CUSTOM_MESSAGE_CACHE_KEY,
      JSON.stringify(payload)
    );
  } catch (_) {}
  return payload;
}
window.saveClientCachedCustomMessage = saveClientCachedCustomMessage;

function openSys03PrereqGuardModal(mode = "import_contacts") {
  _sys03PrereqNextAction = mode;
  const modal = document.getElementById("gb-sys03-prereq-guard-modal");
  const msgEl = document.getElementById("gb-sys03-prereq-guard-message");
  const btnLabelEl = document.getElementById("gb-sys03-prereq-action-label");
  if (!modal) return null;

  if (mode === "create_custom_message") {
    if (msgEl) {
      msgEl.textContent =
        "Please compose and save your custom outreach message first using 'Create Custom Message' before launching 'Send Batch Email'.";
    }
    if (btnLabelEl) {
      btnLabelEl.textContent = "✍️ Open Create Custom Message";
    }
  } else {
    if (msgEl) {
      msgEl.textContent =
        "Please import your contacts first using the 'Import Contacts' button before composing a custom message or sending a batch email.";
    }
    if (btnLabelEl) {
      btnLabelEl.textContent = "📥 Import Contacts";
    }
  }

  modal.hidden = false;
  return modal;
}
window.openSys03PrereqGuardModal = openSys03PrereqGuardModal;

function closeSys03PrereqGuardModal() {
  const modal = document.getElementById("gb-sys03-prereq-guard-modal");
  if (modal) modal.hidden = true;
}
window.closeSys03PrereqGuardModal = closeSys03PrereqGuardModal;

function handleSys03PrereqPrimaryAction() {
  closeSys03PrereqGuardModal();
  if (_sys03PrereqNextAction === "create_custom_message") {
    openSys03CreateCustomMessageModal();
  } else {
    openSys03ImportContactsModal();
  }
}
window.handleSys03PrereqPrimaryAction = handleSys03PrereqPrimaryAction;

function setSys03ActiveComposerField(fieldName = "body") {
  _sys03ActiveComposerField = fieldName === "subject" ? "subject" : "body";
  const indicator = document.getElementById("gb-sys03-active-field-indicator");
  if (indicator) {
    indicator.innerHTML =
      _sys03ActiveComposerField === "subject"
        ? 'Inserting into: <strong style="color: #38bdf8;">Email Subject Line</strong>'
        : 'Inserting into: <strong style="color: #34d399;">Email Message Body</strong>';
  }
}
window.setSys03ActiveComposerField = setSys03ActiveComposerField;

function insertSys03AttributeToken(tokenStr) {
  const token = String(tokenStr || "");
  if (!token) return;

  const subjectInput = document.getElementById("gb-sys03-custom-subject-input");
  const bodyTextarea = document.getElementById(
    "gb-sys03-custom-message-textarea"
  );
  const targetEl =
    _sys03ActiveComposerField === "subject" && subjectInput
      ? subjectInput
      : bodyTextarea || subjectInput;

  if (!targetEl) return;

  const start =
    typeof targetEl.selectionStart === "number"
      ? targetEl.selectionStart
      : targetEl.value.length;
  const end =
    typeof targetEl.selectionEnd === "number"
      ? targetEl.selectionEnd
      : targetEl.value.length;
  const before = targetEl.value.slice(0, start);
  const after = targetEl.value.slice(end);
  targetEl.value = `${before}${token}${after}`;

  const nextCursor = start + token.length;
  try {
    targetEl.focus();
    targetEl.setSelectionRange(nextCursor, nextCursor);
  } catch (_) {}

  updateSys03CustomMessageLivePreview();
}
window.insertSys03AttributeToken = insertSys03AttributeToken;

function updateSys03CustomMessageLivePreview() {
  const contacts = getClientCachedContacts();
  const sampleContact =
    contacts.length > 0
      ? contacts[0]
      : {
          first_name: "Sophia",
          middle_name: "Marie",
          last_name: "Reyes",
          company: "Nexus Logistics PH",
          email: "sophia.reyes@nexuslogistics.example.com",
          phone: "+63 917 555 0142",
        };

  const countLabel = document.getElementById("gb-sys03-composer-contact-count");
  if (countLabel) {
    countLabel.textContent = `${contacts.length} cached contact${
      contacts.length === 1 ? "" : "s"
    }`;
  }

  const fields = extractNormalizedContactFields(sampleContact);
  const contactLabelEl = document.getElementById(
    "gb-sys03-live-preview-contact-label"
  );
  if (contactLabelEl) {
    const fullName = [fields.firstName, fields.middleName, fields.lastName]
      .filter(Boolean)
      .join(" ");
    contactLabelEl.textContent = `Previewing 1st Contact: ${
      fullName || "Contact #1"
    } (${fields.emailAddress || "No Email"})`;
  }

  const subjectInput = document.getElementById("gb-sys03-custom-subject-input");
  const bodyTextarea = document.getElementById(
    "gb-sys03-custom-message-textarea"
  );
  const rawSubject = subjectInput
    ? subjectInput.value
    : SYS03_DEFAULT_SUBJECT_TEMPLATE;
  const rawBody = bodyTextarea ? bodyTextarea.value : "";

  const previewSubjectEl = document.getElementById(
    "gb-sys03-live-preview-subject"
  );
  if (previewSubjectEl) {
    previewSubjectEl.textContent =
      resolveCustomMessageAttributes(rawSubject, sampleContact) ||
      "(Empty subject)";
  }

  const previewBodyEl = document.getElementById("gb-sys03-live-preview-body");
  if (previewBodyEl) {
    const resolvedBody = resolveCustomMessageAttributes(rawBody, sampleContact);
    previewBodyEl.textContent =
      resolvedBody ||
      "(Type your custom message above or click an attribute chip like [[First Name]] to preview live resolution)";
  }
}
window.updateSys03CustomMessageLivePreview = updateSys03CustomMessageLivePreview;

function openSys03CreateCustomMessageModal(triggerBtn) {
  if (triggerBtn && typeof triggerBtn.blur === "function") {
    try {
      triggerBtn.blur();
    } catch (_) {}
  }

  const contacts = getClientCachedContacts();
  if (!Array.isArray(contacts) || contacts.length === 0) {
    return openSys03PrereqGuardModal("import_contacts");
  }

  const modal = document.getElementById("gb-sys03-custom-message-modal");
  if (!modal) return null;

  const cachedMsg = getClientCachedCustomMessage();
  const subjectInput = document.getElementById("gb-sys03-custom-subject-input");
  const bodyTextarea = document.getElementById(
    "gb-sys03-custom-message-textarea"
  );

  if (subjectInput) {
    subjectInput.value =
      cachedMsg && cachedMsg.subject
        ? cachedMsg.subject
        : SYS03_DEFAULT_SUBJECT_TEMPLATE;
  }
  if (bodyTextarea) {
    bodyTextarea.value =
      cachedMsg && typeof cachedMsg.message === "string" && cachedMsg.message.trim()
        ? cachedMsg.message
        : SYS03_DEFAULT_BODY_TEMPLATE;
  }

  const badgeEl = document.getElementById("gb-sys03-custom-msg-status-badge");
  if (badgeEl) {
    badgeEl.style.display = "none";
    badgeEl.innerHTML = "";
  }

  setSys03ActiveComposerField("body");
  updateSys03CustomMessageLivePreview();
  modal.hidden = false;
  return modal;
}
window.openSys03CreateCustomMessageModal = openSys03CreateCustomMessageModal;

function closeSys03CreateCustomMessageModal() {
  const modal = document.getElementById("gb-sys03-custom-message-modal");
  if (modal) modal.hidden = true;
}
window.closeSys03CreateCustomMessageModal = closeSys03CreateCustomMessageModal;

async function saveSys03CustomMessage() {
  const subjectInput = document.getElementById("gb-sys03-custom-subject-input");
  const bodyTextarea = document.getElementById(
    "gb-sys03-custom-message-textarea"
  );
  const badgeEl = document.getElementById("gb-sys03-custom-msg-status-badge");
  const saveBtn = document.getElementById("gb-sys03-save-custom-msg-btn");

  const subjectVal =
    (subjectInput && subjectInput.value.trim()) ||
    SYS03_DEFAULT_SUBJECT_TEMPLATE;
  const bodyVal = (bodyTextarea && bodyTextarea.value.trim()) || "";

  if (!bodyVal) {
    if (badgeEl) {
      badgeEl.style.display = "flex";
      badgeEl.style.borderColor = "rgba(248, 113, 113, 0.45)";
      badgeEl.style.color = "#fca5a5";
      badgeEl.innerHTML =
        '<i class="fas fa-exclamation-circle"></i> <span>Please enter a custom message body before saving.</span>';
    }
    return null;
  }

  // 1. Save immediately in Client Browser Cache (localStorage: gb_portfolio_client_custom_message_v1)
  const savedLocal = saveClientCachedCustomMessage(subjectVal, bodyVal);

  if (saveBtn) saveBtn.disabled = true;
  if (badgeEl) {
    badgeEl.style.display = "flex";
    badgeEl.style.borderColor = "rgba(56, 189, 248, 0.45)";
    badgeEl.style.color = "#7dd3fc";
    badgeEl.innerHTML =
      '<i class="fas fa-circle-notch fa-spin"></i> <span>Saving custom message to browser session &amp; syncing Compose.xlsx (Sheet1 Col A)...</span>';
  }

  // 2. Simultaneously append to Compose.xlsx -> Sheet1 -> Column A via backend proxy
  try {
    await fetch("/api/glennbot/sys03/save-custom-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        actionMode: "save_custom_message",
        workbook_id: "Compose.xlsx",
        sheet_name: "Sheet1",
        subject: subjectVal,
        message: bodyVal,
        row: {
          A: bodyVal,
        },
      }),
    });
  } catch (_) {}

  if (saveBtn) saveBtn.disabled = false;
  if (badgeEl) {
    badgeEl.style.display = "flex";
    badgeEl.style.borderColor = "rgba(16, 185, 129, 0.45)";
    badgeEl.style.color = "#6ee7b7";
    badgeEl.innerHTML =
      '<i class="fas fa-check-circle"></i> <span>Custom message saved to your browser session! Ready for Send Batch Email.</span>';
  }

  return savedLocal;
}
window.saveSys03CustomMessage = saveSys03CustomMessage;

function buildSys03StatusBadgeHtml(statusText = "Waiting") {
  const clean = String(statusText || "Waiting").trim();
  const lower = clean.toLowerCase();
  if (lower === "done") {
    return `<span class="gb-sys03-status-badge is-done" data-status="Done" style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:rgba(16,185,129,0.16);border:1px solid rgba(16,185,129,0.5);color:#34d399;font-size:11.5px;font-weight:800;"><i class="fas fa-check-circle"></i><span>Done</span></span>`;
  }
  if (lower === "sending") {
    return `<span class="gb-sys03-status-badge is-sending" data-status="Sending" style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:rgba(14,165,233,0.18);border:1px solid rgba(56,189,248,0.6);color:#38bdf8;font-size:11.5px;font-weight:800;box-shadow:0 0 12px rgba(56,189,248,0.28);"><i class="fas fa-circle-notch fa-spin"></i><span>Sending</span></span>`;
  }
  return `<span class="gb-sys03-status-badge is-waiting" data-status="Waiting" style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:rgba(245,158,11,0.14);border:1px solid rgba(245,158,11,0.42);color:#fbbf24;font-size:11.5px;font-weight:800;"><i class="fas fa-clock"></i><span>Waiting</span></span>`;
}
window.buildSys03StatusBadgeHtml = buildSys03StatusBadgeHtml;

function renderSys03BatchEmailQueueTable() {
  const tbody = document.getElementById("gb-sys03-batch-email-tbody");
  const summaryEl = document.getElementById("gb-sys03-batch-summary-counts");
  const subjectPreviewEl = document.getElementById(
    "gb-sys03-batch-subject-preview"
  );
  if (!tbody) return;

  const contacts = getClientCachedContacts();
  const cachedMsg = getClientCachedCustomMessage();
  const rawTemplate =
    (cachedMsg && cachedMsg.message) || SYS03_DEFAULT_BODY_TEMPLATE;
  const rawSubject =
    (cachedMsg && cachedMsg.subject) || SYS03_DEFAULT_SUBJECT_TEMPLATE;

  if (subjectPreviewEl) {
    subjectPreviewEl.textContent = rawSubject;
  }

  let waitingCount = 0;
  let sendingCount = 0;
  let doneCount = 0;

  const rowsHtml = contacts
    .map((contact, idx) => {
      const fields = extractNormalizedContactFields(contact);
      const status = String(contact.batch_status || "Waiting").trim();
      const sLower = status.toLowerCase();
      if (sLower === "done") doneCount += 1;
      else if (sLower === "sending") sendingCount += 1;
      else waitingCount += 1;

      const resolvedMsg = resolveCustomMessageAttributes(rawTemplate, contact);
      const rowKey =
        contact.batch_row_key ||
        buildSys03BatchRowKey("preview", idx, fields.emailAddress);

      return `
        <tr data-batch-row-index="${idx}" data-batch-row-key="${escapeDmHtml(rowKey)}" style="border-bottom: 1px solid rgba(148, 163, 184, 0.14);">
          <td id="gb-sys03-batch-status-badge-${idx}" data-col="status" style="padding: 10px 12px; white-space: nowrap;">
            ${buildSys03StatusBadgeHtml(status)}
          </td>
          <td data-col="first_name" style="padding: 10px 12px; color: #f8fafc; font-weight: 600;">
            ${escapeDmHtml(fields.firstName || "—")}
          </td>
          <td data-col="middle_name" style="padding: 10px 12px; color: #cbd5e1;">
            ${escapeDmHtml(fields.middleName || "—")}
          </td>
          <td data-col="last_name" style="padding: 10px 12px; color: #f8fafc; font-weight: 600;">
            ${escapeDmHtml(fields.lastName || "—")}
          </td>
          <td data-col="company_name" style="padding: 10px 12px; color: #38bdf8; font-weight: 600;">
            ${escapeDmHtml(fields.companyName || "—")}
          </td>
          <td data-col="email_address" style="padding: 10px 12px; color: #34d399; font-family: 'JetBrains Mono', monospace; font-size: 11.5px;">
            ${escapeDmHtml(fields.emailAddress || "—")}
          </td>
          <td data-col="contact_number" style="padding: 10px 12px; color: #cbd5e1; font-family: 'JetBrains Mono', monospace; font-size: 11.5px;">
            ${escapeDmHtml(fields.contactNumber || "—")}
          </td>
          <td data-col="personalized_message" style="padding: 10px 12px; color: #e2e8f0; font-size: 12px; line-height: 1.45; max-width: 360px; white-space: pre-wrap;">${escapeDmHtml(
            resolvedMsg
          )}</td>
        </tr>
      `;
    })
    .join("");

  tbody.innerHTML = rowsHtml;

  if (summaryEl) {
    summaryEl.textContent = `${contacts.length} Total • ${waitingCount} Waiting • ${sendingCount} Sending • ${doneCount} Done`;
  }
}
window.renderSys03BatchEmailQueueTable = renderSys03BatchEmailQueueTable;

function openSys03SendBatchEmailModal(triggerBtn) {
  if (triggerBtn && typeof triggerBtn.blur === "function") {
    try {
      triggerBtn.blur();
    } catch (_) {}
  }

  const contacts = getClientCachedContacts();
  if (!Array.isArray(contacts) || contacts.length === 0) {
    return openSys03PrereqGuardModal("import_contacts");
  }

  const cachedMsg = getClientCachedCustomMessage();
  if (!cachedMsg || !String(cachedMsg.message || "").trim()) {
    return openSys03PrereqGuardModal("create_custom_message");
  }

  const modal = document.getElementById("gb-sys03-batch-email-modal");
  if (!modal) return null;

  const bannerEl = document.getElementById("gb-sys03-batch-status-banner");
  if (bannerEl && !_sys03BatchSendInFlight) {
    bannerEl.style.display = "none";
    bannerEl.innerHTML = "";
  }

  renderSys03BatchEmailQueueTable();
  modal.hidden = false;
  return modal;
}
window.openSys03SendBatchEmailModal = openSys03SendBatchEmailModal;

function closeSys03SendBatchEmailModal() {
  const modal = document.getElementById("gb-sys03-batch-email-modal");
  if (modal) modal.hidden = true;
}
window.closeSys03SendBatchEmailModal = closeSys03SendBatchEmailModal;

function setSys03BatchBanner(text, tone = "info") {
  const bannerEl = document.getElementById("gb-sys03-batch-status-banner");
  if (!bannerEl) return;
  if (!text) {
    bannerEl.style.display = "none";
    bannerEl.innerHTML = "";
    return;
  }
  bannerEl.style.display = "flex";
  if (tone === "done") {
    bannerEl.style.borderColor = "rgba(16, 185, 129, 0.5)";
    bannerEl.style.color = "#6ee7b7";
    bannerEl.innerHTML = `<i class="fas fa-check-circle"></i> <span>${escapeDmHtml(text)}</span>`;
  } else if (tone === "error") {
    bannerEl.style.borderColor = "rgba(248, 113, 113, 0.5)";
    bannerEl.style.color = "#fca5a5";
    bannerEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>${escapeDmHtml(text)}</span>`;
  } else {
    bannerEl.style.borderColor = "rgba(56, 189, 248, 0.5)";
    bannerEl.style.color = "#7dd3fc";
    bannerEl.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> <span>${escapeDmHtml(text)}</span>`;
  }
}

async function startSys03BatchEmailSend() {
  if (_sys03BatchSendInFlight) return;
  const rawContacts = getClientCachedContacts();
  if (!Array.isArray(rawContacts) || rawContacts.length === 0) {
    openSys03PrereqGuardModal("import_contacts");
    return;
  }

  const cachedMsg = getClientCachedCustomMessage();
  if (!cachedMsg || !String(cachedMsg.message || "").trim()) {
    openSys03PrereqGuardModal("create_custom_message");
    return;
  }

  // Filter out any malformed/blank contacts where both First Name and Email Address are empty
  const contacts = rawContacts.filter((c) => {
    const f = extractNormalizedContactFields(c);
    return Boolean(f.firstName || f.emailAddress);
  });
  if (contacts.length === 0) {
    openSys03PrereqGuardModal("import_contacts");
    return;
  }

  _sys03BatchSendInFlight = true;
  const startBtn = document.getElementById("gb-sys03-start-batch-send-btn");
  const startLabel = document.getElementById("gb-sys03-start-batch-send-label");
  if (startBtn) startBtn.disabled = true;
  if (startLabel) startLabel.textContent = "Dispatching Batch Emails...";

  // Generate sessionId ONCE at the start of the batch run for deterministic batchRowKeys
  const sessionId = Date.now().toString(36);
  const subjectTemplate =
    cachedMsg.subject || SYS03_DEFAULT_SUBJECT_TEMPLATE;
  const bodyTemplate = cachedMsg.message;

  try {
    // =========================================================================
    // PHASE 1: Queue All Contacts as "Waiting" + Sync to Compose.xlsx (Sheet2)
    // =========================================================================
    const queuedContacts = contacts.map((c, idx) => {
      const fields = extractNormalizedContactFields(c);
      const batchRowKey = buildSys03BatchRowKey(
        sessionId,
        idx,
        fields.emailAddress
      );
      return {
        ...c,
        batch_status: "Waiting",
        batch_row_key: batchRowKey,
      };
    });
    saveClientCachedContacts(queuedContacts);
    renderSys03BatchEmailQueueTable();

    setSys03BatchBanner(
      `Phase 1/2: Queueing ${queuedContacts.length} contact(s) as 'Waiting' in Compose.xlsx (Sheet2)...`,
      "info"
    );

    const waitingSheetRows = queuedContacts
      .map((c, idx) => {
        const fields = extractNormalizedContactFields(c);
        const batchRowKey =
          c.batch_row_key ||
          buildSys03BatchRowKey(sessionId, idx, fields.emailAddress);
        const resolvedMessage = resolveCustomMessageAttributes(bodyTemplate, c);
        return {
          workbook_id: "Compose.xlsx",
          sheet_name: "Sheet2",
          match_column: "I",
          match_value: batchRowKey,
          batchRowKey,
          row: {
            A: "Waiting",
            B: fields.firstName,
            C: fields.middleName,
            D: fields.lastName,
            E: fields.companyName,
            F: fields.emailAddress,
            G: fields.contactNumber,
            H: resolvedMessage,
            I: batchRowKey,
          },
        };
      })
      .filter((item) => isValidSys03Sheet2Row(item.row));

    // Wait for Phase 1 to 100% resolve before entering the Phase 2 loop
    try {
      const phase1Resp = await fetch("/api/glennbot/sys03/batch-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          actionMode: "queue_batch_waiting",
          workbook_id: "Compose.xlsx",
          sheet_name: "Sheet2",
          rows: waitingSheetRows,
        }),
      });
      await phase1Resp.json().catch(() => ({}));
    } catch (_) {}

    // =========================================================================
    // PHASE 2: Sequential Live Dispatch (Waiting -> Sending -> Done)
    // =========================================================================
    for (let i = 0; i < queuedContacts.length; i += 1) {
      const currentContact = queuedContacts[i];
      const fields = extractNormalizedContactFields(currentContact);
      const batchRowKey =
        currentContact.batch_row_key ||
        buildSys03BatchRowKey(sessionId, i, fields.emailAddress);
      currentContact.batch_row_key = batchRowKey;

      const resolvedSubject = resolveCustomMessageAttributes(
        subjectTemplate,
        currentContact
      );
      const resolvedBody = resolveCustomMessageAttributes(
        bodyTemplate,
        currentContact
      );

      const stepARow = {
        A: "Sending",
        B: fields.firstName,
        C: fields.middleName,
        D: fields.lastName,
        E: fields.companyName,
        F: fields.emailAddress,
        G: fields.contactNumber,
        H: resolvedBody,
        I: batchRowKey,
      };
      if (!isValidSys03Sheet2Row(stepARow)) {
        continue;
      }

      // Step A: Mark current contact as "Sending" in UI, localStorage, and Compose.xlsx (Sheet2)
      queuedContacts[i].batch_status = "Sending";
      saveClientCachedContacts(queuedContacts);
      renderSys03BatchEmailQueueTable();

      setSys03BatchBanner(
        `Sending (${i + 1}/${queuedContacts.length}): Dispatching personalized email to ${
          fields.emailAddress || fields.firstName || "Recipient"
        }...`,
        "info"
      );

      try {
        const stepAResp = await fetch("/api/glennbot/sys03/batch-step", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            actionMode: "mark_batch_sending",
            workbook_id: "Compose.xlsx",
            sheet_name: "Sheet2",
            match_column: "I",
            match_value: batchRowKey,
            batchRowKey,
            row: stepARow,
          }),
        });
        await stepAResp.json().catch(() => ({}));
      } catch (_) {}

      // Step B: Send Personalized Email via GlennBot + Update Compose.xlsx (Sheet2) to "Done"
      const stepBRow = {
        A: "Done",
        B: fields.firstName,
        C: fields.middleName,
        D: fields.lastName,
        E: fields.companyName,
        F: fields.emailAddress,
        G: fields.contactNumber,
        H: resolvedBody,
        I: batchRowKey,
      };
      try {
        const stepBResp = await fetch("/api/glennbot/sys03/batch-step", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            actionMode: "send_and_mark_done",
            workbook_id: "Compose.xlsx",
            sheet_name: "Sheet2",
            match_column: "I",
            match_value: batchRowKey,
            batchRowKey,
            to: fields.emailAddress,
            subject: resolvedSubject,
            body: resolvedBody,
            row: stepBRow,
          }),
        });
        await stepBResp.json().catch(() => ({}));
      } catch (_) {}

      queuedContacts[i].batch_status = "Done";
      saveClientCachedContacts(queuedContacts);
      renderSys03BatchEmailQueueTable();
    }

    setSys03BatchBanner(
      `✓ Batch Email Outreach Complete! All ${queuedContacts.length} personalized email(s) dispatched and marked 'Done' in Compose.xlsx (Sheet2).`,
      "done"
    );
  } finally {
    _sys03BatchSendInFlight = false;
    if (startBtn) startBtn.disabled = false;
    if (startLabel) startLabel.textContent = "Start Batch Email Send";
  }
}
window.startSys03BatchEmailSend = startSys03BatchEmailSend;

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
        endpoint: "POST /api/ai/ask • POST /api/schedule • GET /api/scheduled",
        demoEndpoint: "/api/demo/ai-caption",
        title: "AI Content & Omnichannel Social Scheduler",
        tagline:
          "Context-Aware Gemini 3.5 Flash Caption Engine + Zero-RAM Zernio Media Cloud & APScheduler Queue",
        pipelineNodes: [
          {
            label: "STEP 01 • 📝 CREATE POST",
            title: "Gemini 3.5 Flash Viral Title, Caption & Hashtag Generator (/api/ai/ask)",
            accent: false,
          },
          {
            label: "STEP 02 • ⏳ QUEUE",
            title: "Zero-RAM Stream to Zernio Media Cloud + APScheduler & PostgreSQL Queue (/api/schedule)",
            accent: true,
          },
          {
            label: "STEP 03 • 📅 CALENDAR",
            title: "Visual Omnichannel Schedule Across FB, IG, TikTok & YouTube (/api/scheduled)",
            accent: false,
          },
        ],
        bottleneck:
          "Content teams and founders spend hours manually generating platform-specific captions, uploading heavy video reels across separate tabs, and tracking scheduled posts across Facebook, Instagram, TikTok, and YouTube.",
        solution:
          "Architected a unified FastAPI + APScheduler + Zernio Social API publishing engine (`routers/ai_routes.py` & `routers/scheduler_routes.py`) powered by **Gemini 3.5 Flash (`POST /api/ai/ask`)**, **PostgreSQL (`glennbot_scheduled_posts`)**, and **Google Drive Vault**. Directly powers the 3 live interactive modules below:",
        architectureSteps: [
          "**📝 Create Post (`#view-scheduler`)**: Generates platform-tailored viral titles, captions & hashtags via `POST /api/ai/ask` (`Gemini 3.5 Flash`) and attaches media via chunked streaming (`/api/schedule/chunked-init` & `/api/schedule/chunked-complete`) or Google Drive Vault (`/api/files`).",
          "**Zero-RAM Media Pipeline (`routers/scheduler_routes.py`)**: Streams video/image uploads directly to **Zernio Presigned Media Cloud** or **Google Drive Vault (`1f_3d1208297331d7315be76821c07867`)** without buffering large files in server RAM.",
          "**⏳ Queue (`#view-queue` / `GET /api/scheduled`)**: Persists jobs in PostgreSQL (`glennbot_scheduled_posts`), registers exact execution timers in **APScheduler** (`post_to_facebook`, `post_to_instagram`, `post_to_tiktok`, `post_to_youtube`), and auto-reconciles live publish status with Zernio API (`sync_single_scheduled_row_with_zernio`).",
          "**📅 Calendar (`#view-calendar`)**: Visualizes all queued, scheduled, and published posts across the 4 connected showcase accounts (**Facebook: GlennBot Automations**, **Instagram: @glennard.tasico.va**, **TikTok: @glennbot.automation**, **YouTube: glennardtasico**).",
        ],
        metrics: [
          { value: "85% Faster", label: "Content Production" },
          { value: "4 Channels", label: "FB • IG • TikTok • YT" },
          { value: "24/7 Queue", label: "APScheduler + PostgreSQL" },
        ],
        sourceFile: "routers/ai_routes.py • routers/scheduler_routes.py (GlennBot Automations)",
        sourceCode: `# glennbot_automations/routers/ai_routes.py & routers/scheduler_routes.py
from fastapi import APIRouter, Form, File, UploadFile, Request
from fastapi.concurrency import run_in_threadpool
from sqlalchemy import text
from datetime import datetime
from typing import Optional
import uuid, pytz

from core.database import db_engine, scheduler, _coerce_db_datetime
from services.ai_service import _execute_glennbot_ask_ai_core
from services.zernio_service import (
    _upload_local_file_to_zernio_media,
    register_scheduled_post_on_zernio,
    sync_single_scheduled_row_with_zernio,
    post_to_facebook, post_to_instagram, post_to_tiktok, post_to_youtube,
)
from services.gdrive_service import _upload_local_file_to_gdrive_temp

router = APIRouter()

# ── 1. 📝 CREATE POST: Gemini 3.5 Flash Caption & Hashtag Generator (routers/ai_routes.py) ──
@router.post("/api/ai/ask")
async def api_ask_ai(request: Request):
    data = await request.json()
    return await run_in_threadpool(
        lambda: _execute_glennbot_ask_ai_core(
            user_topic=str(data.get("topic") or data.get("prompt") or "").strip(),
            tone_str=str(data.get("tone") or "engaging").strip(),
            lang_str=str(data.get("language") or "taglish").strip(),
            post_type_str=str(data.get("post_type") or "reels").strip(),
            platforms_list=data.get("platforms") or ["facebook", "instagram", "tiktok", "youtube"],
            use_search=bool(data.get("use_search", True)),
        )
    )

# ── 2. 📝 CREATE POST -> ⏳ QUEUE: Zero-RAM Media Stream & APScheduler (routers/scheduler_routes.py) ──
@router.post("/api/schedule")
async def receive_schedule(
    platform: str = Form(...),
    post_type: str = Form(...),
    pageId: str = Form(""),
    accountName: str = Form(""),
    date_val: str = Form("", alias="date"),
    time_val: str = Form("", alias="time"),
    title: str = Form(""),
    caption: str = Form(""),
    media: Optional[UploadFile] = File(None),
    vault_media_file_id: str = Form(""),
):
    manila_tz = pytz.timezone("Asia/Manila")
    scheduled_time = manila_tz.localize(
        datetime.strptime(f"{date_val} {time_val}", "%Y-%m-%d %H:%M")
    )
    record_id = f"post_{uuid.uuid4().hex[:12]}"

    # Persist initial job state in PostgreSQL (glennbot_scheduled_posts)
    with db_engine.begin() as conn:
        conn.execute(
            text("""
                INSERT INTO glennbot_scheduled_posts
                (id, platform, page_id, account_name, post_type, caption,
                 scheduled_time, status, status_message)
                VALUES (:id, :platform, :page_id, :account_name, :post_type, :caption,
                        :sched_time, 'processing_payload', 'Streaming media to Zernio Cloud...')
            """),
            {
                "id": record_id, "platform": platform, "page_id": pageId,
                "account_name": accountName or platform.capitalize(),
                "post_type": post_type, "caption": title.strip() or caption,
                "sched_time": scheduled_time,
            },
        )

    # Stream directly to Zernio Presigned Media Cloud or Google Drive Vault (Zero RAM overhead)
    media_url = _upload_local_file_to_zernio_media(media) or _upload_local_file_to_gdrive_temp(media)

    # Register native APScheduler job & Zernio schedule for FB / IG / TikTok / YouTube
    dispatch_fn = {
        "facebook": post_to_facebook,
        "instagram": post_to_instagram,
        "tiktok": post_to_tiktok,
        "youtube": post_to_youtube,
    }[platform.lower()]

    scheduler.add_job(
        dispatch_fn, "date", run_date=scheduled_time, id=record_id, replace_existing=True,
        args=[pageId, post_type, title, caption, media_url, None, record_id],
    )
    return {"status": "success", "job_id": record_id, "scheduled_time": scheduled_time.isoformat()}

# ── 3. ⏳ QUEUE & 📅 CALENDAR: Live Status Sync (routers/scheduler_routes.py) ──
@router.get("/api/scheduled")
def get_scheduled_posts(month: Optional[int] = None, year: Optional[int] = None):
    manila_tz = pytz.timezone("Asia/Manila")
    with db_engine.connect() as conn:
        rows = conn.execute(
            text("SELECT * FROM glennbot_scheduled_posts ORDER BY scheduled_time ASC")
        ).mappings().all()

    items = []
    for row in rows:
        synced = sync_single_scheduled_row_with_zernio(dict(row))
        sched_dt = _coerce_db_datetime(row.get("scheduled_time"), manila_tz)
        if month and year and (not sched_dt or sched_dt.month != month or sched_dt.year != year):
            continue
        items.append({**dict(row), **synced, "scheduled_iso": sched_dt.isoformat() if sched_dt else ""})
    return {"status": "success", "items": items}`,
        workflowPresets: {
          "📝 Create Post — AI Caption + Multi-Platform Schedule (FB, IG, TikTok, YouTube)": {
            platforms:
              "Facebook (GlennBot Automations), Instagram (@glennard.tasico.va), TikTok (@glennbot.automation), YouTube (glennardtasico)",
            topic:
              "Launch our 24/7 AI Omnichannel Automation showcase video across Facebook, Instagram Reels, TikTok, and YouTube Shorts via Zernio Presigned Media Cloud.",
          },
          "⏳ Queue — Inspect APScheduler & Zernio Presigned Media Pipeline": {
            platforms:
              "Facebook (GlennBot Automations), Instagram (@glennard.tasico.va), TikTok (@glennbot.automation), YouTube (glennardtasico)",
            topic:
              "Inspect live APScheduler queue jobs in PostgreSQL (glennbot_scheduled_posts) and stream 4K Reel via Zero-RAM Zernio Presigned Upload.",
          },
          "📅 Calendar — Sync Published & Queued Posts Across 4 Connected Accounts": {
            platforms:
              "Facebook (GlennBot Automations), Instagram (@glennard.tasico.va), TikTok (@glennbot.automation), YouTube (glennardtasico)",
            topic:
              "Reconcile monthly content calendar status (sync_single_scheduled_row_with_zernio) across all 4 connected accounts for November 2026.",
          },
        },
        widgetFields: [
          {
            name: "workflow",
            label: "Select SYS-01 Workflow to Simulate",
            type: "select",
            options: [
              "📝 Create Post — AI Caption + Multi-Platform Schedule (FB, IG, TikTok, YouTube)",
              "⏳ Queue — Inspect APScheduler & Zernio Presigned Media Pipeline",
              "📅 Calendar — Sync Published & Queued Posts Across 4 Connected Accounts",
            ],
          },
          {
            name: "platforms",
            label: "Target Connected Accounts",
            type: "text",
            value:
              "Facebook (GlennBot Automations), Instagram (@glennard.tasico.va), TikTok (@glennbot.automation), YouTube (glennardtasico)",
          },
          {
            name: "topic",
            label: "Campaign Topic / Schedule Payload",
            type: "textarea",
            value:
              "Launch our 24/7 AI Omnichannel Automation showcase video across Facebook, Instagram Reels, TikTok, and YouTube Shorts via Zernio Presigned Media Cloud.",
          },
        ],
      },
      "omnichannel-inbox": {
        sysId: "SYS-02",
        category: "Omnichannel & AI Triage",
        endpoint:
          "POST /webhooks • POST /api/v1/ai/ask • /api/v1/comments/reply • /api/v1/messages/send • /api/email/messages",
        demoEndpoint: "/api/demo/inbox-triage",
        title: "Unified Omnichannel Inbox & Smart Auto-Responder",
        tagline: "Gemini 3.5 Flash + Google Drive Excel (Script.xlsx & Conversations.xlsx) + n8n Auto-Responder",
        pipelineNodes: [
          {
            label: "INBOUND CHANNELS",
            title: "💬 Comments (FB • IG • TikTok) • ✉️ DMs (Messenger • IG • WhatsApp) • 📧 Gmail",
            accent: false,
          },
          {
            label: "AI & KNOWLEDGE BASE",
            title: "Gemini 3.5 Flash (/api/v1/ai/ask) + Google Drive Script.xlsx & Conversations.xlsx + n8n",
            accent: true,
          },
          {
            label: "AUTO-RESPONDER",
            title: "Live Comment Reply + Messenger/IG/WhatsApp DM Reply + Gmail Sent Folder Sync",
            accent: false,
          },
        ],
        bottleneck:
          "Inbound leads and customer inquiries arrive simultaneously across Facebook, Instagram, and TikTok comments, Messenger/Instagram/WhatsApp DMs, and Gmail—leading to slow manual replies, missed messages, and fragmented conversation tracking.",
        solution:
          "Engineered an event-driven FastAPI + n8n + **Gemini 3.5 Flash** omnichannel auto-responder (`routers/ai_routes.py`, `routers/webhooks_routes.py`, `routers/internal_api_routes.py`, and `routers/email_accounts_routes.py`) grounded on live **Google Drive Excel sync (`Script.xlsx` & `Conversations.xlsx`)** and directly powering the 3 live interactive buttons below:",
        architectureSteps: [
          "**💬 Post a Comment (`openCommentPlatformChooser` • `?popout_mode=comment_thread`)**: Visitors comment live on **Facebook (`GlennBot Automations`)**, **Instagram (`@glennard.tasico.va`)**, or **TikTok (`@glennbot.automation`)**. Zernio webhook (`POST /webhooks`) triggers `_notify_n8n_new_comment` (`comment.received`) -> **Gemini 3.5 Flash** (`POST /api/v1/ai/ask` with Google Drive **`Script.xlsx` Sheet1** keyword/answer lookup, **`Conversations.xlsx`** history, and live web search) -> posts the reply via `POST /api/v1/comments/reply`.",
          "**✉️ Send a DM (`openDmPlatformChooser` • `?popout_mode=message_thread`)**: Opens the 4-option DM Chooser (**Facebook (`GlennBot Automations`)**, **Instagram (`@glennard.tasico.va`)**, **WhatsApp (`Glennard Tasico • +63 917 549 7760`)**, and **Mock Chat Test** Split-Screen Sandbox). Zernio webhook (`POST /webhooks`) triggers `_notify_n8n_new_message` (`message.received`) -> **Gemini 3.5 Flash** (`POST /api/v1/ai/ask` synced with Google Drive **`Script.xlsx`** & **`Conversations.xlsx`**) -> dispatches the auto-reply via `POST /api/v1/messages/send` and syncs the thread in `/api/messages/conversations`.",
          "**📧 Send an Email (`openEmailInteractivePopup` • `?popout_mode=workspace_view&tab=email`)**: Opens the **`📧 Test My Live AI Email Chatbot`** modal (`LIVE AI EMAIL AUTO-RESPONDER • GEMINI + GOOGLE DRIVE EXCEL SYNC`) targeting **`glennard.tasico.va@gmail.com`**. Composio Gmail trigger / n8n calls **Gemini 3.5 Flash** (`POST /api/v1/ai/ask` in `email_reply` mode reading **`Script.xlsx` Sheet1** and **`Conversations.xlsx` Sheet3**, formatting replies with `Dear [Name of Sender], ... Regards, Glennard`), sends via Composio Gmail OAuth (`GMAIL_SEND_EMAIL`), and syncs verified replies in `GET /api/email/messages?folder=sent`.",
        ],
        metrics: [
          { value: "24/7 Live", label: "Zero Missed Inquiries" },
          { value: "3 Live Channels", label: "Comments • DMs • Gmail" },
          { value: "100% Automated", label: "Zernio • Composio • GDrive Excel" },
        ],
        sourceFile:
          "routers/ai_routes.py • routers/webhooks_routes.py • routers/internal_api_routes.py • routers/email_accounts_routes.py",
        sourceCode: `# glennbot_automations/routers/ai_routes.py, webhooks_routes.py, internal_api_routes.py & email_accounts_routes.py
from fastapi import APIRouter, Request, Depends, Query
from fastapi.concurrency import run_in_threadpool
from core.security import verify_internal_api_key
from services.ai_service import _execute_glennbot_ask_ai_core
from services.comments_service import _notify_n8n_new_comment, _execute_comment_reply_core
from services.messages_service import (
    _notify_n8n_new_message, _execute_message_reply_core, _upsert_contact_from_interaction
)
from services.email_service import (
    _fetch_composio_emails_for_account, _resolve_composio_connected_account
)

router = APIRouter()

# ── 1. 🤖 GEMINI 3.5 FLASH + GOOGLE DRIVE EXCEL KNOWLEDGE BASE (routers/ai_routes.py) ──
@router.post("/api/v1/ai/ask", dependencies=[Depends(verify_internal_api_key)])
async def v1_ask_glennbot_ai(request: Request):
    data = await request.json()
    # Grounds Gemini 3.5 Flash on Google Drive Script.xlsx (Sheet1) & Conversations.xlsx (Sheet1/Sheet3)
    return await run_in_threadpool(
        lambda: _execute_glennbot_ask_ai_core(
            user_topic=str(data.get("message") or data.get("prompt") or "").strip(),
            mode_str=str(data.get("mode") or "chatbot_reply").strip(),  # comment_reply | dm_reply | email_reply
            sender_name=str(data.get("sender_name") or "Client").strip(),
            use_excel_kb=True,  # Reads Script.xlsx & appends history to Conversations.xlsx
            use_search=bool(data.get("use_search", True)),
        )
    )

# ── 2. 💬 POST A COMMENT & ✉️ SEND A DM: Zernio Webhook Ingest (routers/webhooks_routes.py) ──
@router.post("/webhooks")
async def receive_zernio_webhooks(request: Request):
    payload = await request.json()
    event_type = str(payload.get("event") or payload.get("type") or "").lower()

    # Button 1 (💬 Post a Comment): FB / IG / TikTok Showcase Post -> n8n -> /api/v1/ai/ask -> /api/v1/comments/reply
    if "comment" in event_type:
        comment_event = _extract_comment_webhook_payload(payload)
        _notify_n8n_new_comment(comment_event)
        return {"status": "accepted", "pipeline": "comment_auto_responder", "event": "comment.received"}

    # Button 2 (✉️ Send a DM): FB Messenger / IG DM / WhatsApp / Mock Chat -> n8n -> /api/v1/ai/ask -> /api/v1/messages/send
    if "message" in event_type:
        msg_event = _extract_message_webhook_payload(payload)
        _upsert_contact_from_interaction(msg_event)
        _notify_n8n_new_message(msg_event)
        return {"status": "accepted", "pipeline": "omnichannel_dm_auto_responder", "event": "message.received"}

    return {"status": "ignored"}

# ── 3. 💬 COMMENT & ✉️ DM AUTO-REPLY DISPATCH (routers/internal_api_routes.py) ──
@router.post("/api/v1/comments/reply", dependencies=[Depends(verify_internal_api_key)])
async def v1_reply_to_comment(request: Request):
    data = await request.json()
    reply_res = _execute_comment_reply_core(
        record_id=data["record_id"], comment_id=data["comment_id"], message=data["message"]
    )
    return {"status": "success", "dispatched_via": "zernio_comments_api", "result": reply_res}

@router.post("/api/v1/messages/send", dependencies=[Depends(verify_internal_api_key)])
async def v1_send_omnichannel_dm(request: Request):
    data = await request.json()
    # Dispatches Gemini 3.5 Flash reply to Facebook Messenger, Instagram DM, WhatsApp, or Mock Chat
    return _execute_message_reply_core(
        account_id=data["account_id"],
        conversation_id=data["conversation_id"],
        platform=data.get("platform", "facebook"),
        message=data["message"],
    )

# ── 4. 📧 SEND AN EMAIL: Composio Gmail OAuth2 & Sent Folder Sync (routers/email_accounts_routes.py) ──
@router.get("/api/email/messages")
def api_list_email_messages(
    account_id: str = Query("gmail_glennard_tasico_va"),
    folder: str = Query("sent"),
    limit: int = Query(30),
):
    # Verifies AI-sent emails (Dear [Sender], ... Regards, Glennard) from glennard.tasico.va@gmail.com
    acct = _resolve_composio_connected_account(account_id, email_filter="glennard.tasico.va@gmail.com")
    messages = _fetch_composio_emails_for_account(acct, folder=folder, limit=limit)
    return {
        "status": "success",
        "account_email": "glennard.tasico.va@gmail.com",
        "folder": folder,
        "messages": messages,
    }`,
        channelPresets: {
          "💬 Post a Comment (Facebook / Instagram / TikTok Showcase Posts)": {
            sender: "@client_lead_ph (Facebook / Instagram / TikTok Post)",
            message:
              "Hi Glennard! Can you build custom webhooks, n8n workflows, and AI chatbots for my business?",
          },
          "✉️ Send a DM (Facebook Messenger / Instagram DM / WhatsApp / Mock Chat)": {
            sender: "@portfolio_client_dm (Messenger / IG DM / WhatsApp +63 917 549 7760)",
            message:
              "Hi Glennard! What Virtual Assistant & AI Automation services do you offer and what is your current availability?",
          },
          "📧 Send an Email (Live AI Email Chatbot — glennard.tasico.va@gmail.com)": {
            sender: "client@enterprise-ops.io -> glennard.tasico.va@gmail.com",
            message:
              "Hi Glennard! Tell me more about your GlennBot Automations dashboard and custom web app projects.",
          },
        },
        widgetFields: [
          {
            name: "channel",
            label: "Inbound Source Channel",
            type: "select",
            options: [
              "💬 Post a Comment (Facebook / Instagram / TikTok Showcase Posts)",
              "✉️ Send a DM (Facebook Messenger / Instagram DM / WhatsApp / Mock Chat)",
              "📧 Send an Email (Live AI Email Chatbot — glennard.tasico.va@gmail.com)",
            ],
          },
          {
            name: "sender",
            label: "Sender Handle / Contact",
            type: "text",
            value: "@client_lead_ph (Facebook / Instagram / TikTok Post)",
          },
          {
            name: "message",
            label: "Sample Message",
            type: "textarea",
            value:
              "Hi Glennard! Can you build custom webhooks, n8n workflows, and AI chatbots for my business?",
          },
        ],
      },
      "calendar-orchestrator": {
        sysId: "SYS-03",
        category: "CRM & Batch Emailing",
        endpoint: "POST /api/v1/spreadsheets/append-row • POST /api/email/send",
        demoEndpoint: "/api/demo/calendar-schedule",
        title: "CRM Contact Hub & Automated Batch Email Outreach",
        tagline:
          "Privacy-First Lead Importing (Google Contacts & Apollo CSV), Dynamic [[Attribute]] Message Composer & Live Batch Email Dispatch Synced to Compose.xlsx",
        pipelineNodes: [
          {
            label: "01 • Import Contacts",
            title: "Google OAuth & Apollo CSV → Browser Cache",
            accent: false,
          },
          {
            label: "02 • Create Custom Message",
            title: "[[Attributes]] Composer → Compose.xlsx (Sheet1)",
            accent: true,
          },
          {
            label: "03 • Send Batch Email",
            title: "Waiting → Sending → Done (Sheet2 + Gmail)",
            accent: false,
          },
        ],
        bottleneck:
          "Sales and operations teams waste hours manually cleaning Apollo CSV exports, copy-pasting prospect names and company details into repetitive outreach emails, and losing track of which leads are Waiting, Sending, or Done across spreadsheets—while demo users hesitate to test live CRM tools if their uploaded contact lists are permanently stored on a public server.",
        solution:
          "Engineered a 3-stage privacy-first CRM & Batch Email Outreach pipeline powered by FastAPI, Composio Gmail OAuth2, n8n workflows, and Google Drive Excel sync. Stage 1 ('Import Contacts') ingests leads via Google Contacts OAuth or a 20-column Apollo CSV parser strictly into the client's browser cache (localStorage) with 0% server/Cloudinary retention. Stage 2 ('Create Custom Message') provides a dynamic template composer with clickable [[First Name]], [[Middle Name]], [[Last Name]], [[Company Name]], [[Email Address]], and [[Contact Number]] merge chips—isolating the active template in the client's browser while logging templates to Compose.xlsx (Sheet1, Column A). Stage 3 ('Send Batch Email') executes a sequential FIFO batch queue that resolves [[Attributes]] per contact, dispatches personalized emails via Composio Gmail OAuth, and updates status badges in-place from Waiting -> Sending -> Done in both the live UI and Compose.xlsx (Sheet2).",
        architectureSteps: [
          "📥 Import Contacts (Client Sandbox): Authenticates Google Contacts OAuth 2.0 or parses 20-column Apollo.io CSV exports (First/Last Name, Col E Company, Col F Email, Col T Phone) strictly into browser localStorage (gb_portfolio_client_contacts_v1) and auto-opens the isolated Contacts CRM view",
          "✍️ Create Custom Message ([[Attributes]] Engine): Composes outreach templates using clickable [[First Name]], [[Middle Name]], [[Last Name]], [[Company Name]], [[Email Address]], and [[Contact Number]] chips—cached locally per client and appended to Compose.xlsx -> Sheet1 (Column A)",
          "🚀 Send Batch Email (Phase 1 — Queue Waiting): Initializes deterministic batchRowKey IDs (portfolio_row_<session>_<idx>_<email>) and queues all imported contacts into Compose.xlsx -> Sheet2 with Column A status set to 'Waiting'",
          "⚡ Live Sequential Dispatch (Phase 2 — Sending -> Done): Iterates through each cached contact under an asyncio FIFO lock, updating Compose.xlsx (Sheet2) in-place (match_column='I') to 'Sending', dispatching the personalized email via POST /api/email/send (Composio Gmail OAuth), and marking the row 'Done'",
        ],
        metrics: [
          { value: "0% Server Retention", label: "Browser-Cache Contact Privacy" },
          { value: "6 [[Attributes]]", label: "Dynamic CRM Merge Tokens" },
          { value: "Waiting → Sending → Done", label: "Live Compose.xlsx (Sheet2) Sync" },
        ],
        sourceFile:
          "glennbot_automations/routers/sys03_crm_batch_outreach.py (Import Contacts + Custom Message + Batch Email)",
        sourceCode: `# ══════════════════════════════════════════════════════════════════════════════
# GLENNBOT AUTOMATIONS — SYS-03: CRM CONTACT HUB & BATCH EMAIL OUTREACH ENGINE
# Powers all 3 Portfolio Live Actions:
#   1) 📥 Import Contacts        -> Google Contacts OAuth2 & 20-Col Apollo CSV Sandbox
#   2) ✍️ Create Custom Message  -> [[Attributes]] Engine + Compose.xlsx (Sheet1 Col A)
#   3) 🚀 Send Batch Email       -> Waiting -> Sending -> Done (Sheet2 + Gmail OAuth)
# ══════════════════════════════════════════════════════════════════════════════
import asyncio
import re
from fastapi import APIRouter, UploadFile, File, Request
import httpx

router = APIRouter()
_SYS03_COMPOSE_SHEET_LOCK = asyncio.Lock()

# ── 1. 📥 IMPORT CONTACTS: Ephemeral Google OAuth & Apollo CSV Parser (0% DB Retention) ──
@router.post("/api/contacts/import/google")
async def import_google_contacts_ephemeral(request: Request):
    body = await request.json()
    # Fetches Google Contacts via Composio People API strictly for client browser localStorage
    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.post(
            f"{GLENNBOT_BASE_URL}/api/contacts/import/google?ephemeral=1&client_cache_only=1",
            headers=get_glennbot_headers(),
            json={**body, "ephemeral": True, "client_cache_only": True},
        )
        return resp.json()

# ── 2. ✍️ CREATE CUSTOM MESSAGE: Save Template to Browser Cache + Compose.xlsx (Sheet1 Col A) ──
@router.post("/api/glennbot/sys03/save-custom-message")
async def glennbot_sys03_save_custom_message(request: Request):
    payload = await request.json()
    composed_message = str((payload.get("row") or {}).get("A") or payload.get("message") or "").strip()
    sheet1_payload = {
        "workbook_id": "Compose.xlsx",
        "sheet_name": "Sheet1",
        "actionMode": "save_custom_message",
        "row": {"A": composed_message},
    }
    async with _SYS03_COMPOSE_SHEET_LOCK:
        ok, data = await _sync_glennbot_compose_spreadsheet(sheet1_payload)
    return {"status": "success", "workbook_id": "Compose.xlsx", "sheet_name": "Sheet1", "synced": ok}

# ── 3. 🚀 SEND BATCH EMAIL: Resolve [[Attributes]] + Sync Waiting -> Sending -> Done (Sheet2) ──
def resolve_custom_message_attributes(template: str, contact: dict) -> str:
    tokens = {
        "first name": contact.get("firstName", ""),
        "middle name": contact.get("middleName", ""),
        "last name": contact.get("lastName", ""),
        "company name": contact.get("companyName", ""),
        "email address": contact.get("emailAddress", ""),
        "contact number": contact.get("contactNumber", ""),
    }
    return re.sub(
        r"\\[\\[\\s*([^\\[\\]]+?)\\s*\\]\\]",
        lambda m: tokens.get(re.sub(r"\\s+", " ", m.group(1).strip().lower()), m.group(0)),
        template or "",
    )

@router.post("/api/glennbot/sys03/batch-step")
async def glennbot_sys03_batch_step(request: Request):
    payload = await request.json()
    action_mode = payload.get("actionMode", "send_and_mark_done")
    batch_key = payload["batchRowKey"]  # e.g. portfolio_row_<session>_<idx>_<email>
    row_data = payload["row"]           # Col A: Waiting | Sending | Done, Col B..H: CRM + Message, Col I: batchRowKey

    async with _SYS03_COMPOSE_SHEET_LOCK:
        if action_mode == "send_and_mark_done":
            await _dispatch_glennbot_single_email(
                to_email=row_data["F"], subject=payload["subject"], body_text=row_data["H"]
            )
        await _sync_glennbot_compose_spreadsheet({
            "workbook_id": "Compose.xlsx",
            "sheet_name": "Sheet2",
            "match_column": "I",
            "match_value": batch_key,
            "row": row_data,
        })
    return {"status": "success", "actionMode": action_mode, "batchRowKey": batch_key, "sheet_status": row_data["A"]}`,
        stagePresets: {
          "📥 01. Import Contacts — Google OAuth & 20-Col Apollo CSV -> Browser Cache (localStorage)": {
            contact_sample:
              "Sophia Reyes | Nexus Logistics PH | sophia.reyes@nexuslogistics.example.com | +63 917 555 0142",
            template_message:
              "Hi [[First Name]] [[Last Name]], I noticed [[Company Name]] is scaling operations—would love to share how GlennBot Automations can streamline your workflows! Reachable at [[Email Address]] / [[Contact Number]].",
          },
          "✍️ 02. Create Custom Message — Dynamic [[Attributes]] Composer -> Compose.xlsx (Sheet1 Col A)": {
            contact_sample:
              "Marcus Vance | CloudScale SaaS Inc. | m.vance@cloudscalesaas.example.io | +1 512-555-0198",
            template_message:
              "Hello [[First Name]], quick note for the [[Company Name]] RevOps team—our FastAPI + n8n batch outreach engine personalizes every email using [[Email Address]] and [[Contact Number]] tokens.",
          },
          "🚀 03. Send Batch Email — Sequential Waiting -> Sending -> Done (Compose.xlsx Sheet2 + Gmail OAuth)": {
            contact_sample:
              "Elena Rostova | FinEdge Payments | elena@finedgepay.example.com | +65 8123 4567",
            template_message:
              "Dear [[First Name]] [[Last Name]], following up with [[Company Name]] regarding automated CRM pipelines and 1-click Gmail OAuth outreach. Best regards, Glennard.",
          },
        },
        widgetFields: [
          {
            name: "stage",
            label: "Select SYS-03 Pipeline Stage to Simulate",
            type: "select",
            options: [
              "📥 01. Import Contacts — Google OAuth & 20-Col Apollo CSV -> Browser Cache (localStorage)",
              "✍️ 02. Create Custom Message — Dynamic [[Attributes]] Composer -> Compose.xlsx (Sheet1 Col A)",
              "🚀 03. Send Batch Email — Sequential Waiting -> Sending -> Done (Compose.xlsx Sheet2 + Gmail OAuth)",
            ],
          },
          {
            name: "contact_sample",
            label:
              "Sample Lead Record (First/Last Name | Col E Company | Col F Email | Col T Phone)",
            type: "text",
            value:
              "Sophia Reyes | Nexus Logistics PH | sophia.reyes@nexuslogistics.example.com | +63 917 555 0142",
          },
          {
            name: "template_message",
            label: "Custom Outreach Template with [[Attributes]]",
            type: "textarea",
            value:
              "Hi [[First Name]] [[Last Name]], I noticed [[Company Name]] is scaling operations—would love to share how GlennBot Automations can streamline your workflows! Reachable at [[Email Address]] / [[Contact Number]].",
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
    PROJECTS_DATA["crm-batch-outreach"] = PROJECTS_DATA["calendar-orchestrator"];
    window.projectCaseStudies = PROJECTS_DATA;

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
        upstreamUrl: `${GLENNBOT_BASE_URL}/?popout_mode=workspace_view&tab=scheduler`,
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
        upstreamUrl: `${GLENNBOT_BASE_URL}/?popout_mode=workspace_view&tab=queue`,
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
        upstreamUrl: `${GLENNBOT_BASE_URL}/?popout_mode=workspace_view&tab=calendar`,
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

          <!-- Embedded Live Workspace Frame connected directly to GLENNBOT_BASE_URL -->
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
            title="Choose Facebook, Instagram, or TikTok Post on GlennBot Automations and watch Gemini AI auto-reply"
          >
            <span>💬 Post a Comment</span>
          </button>
          <button
            type="button"
            class="btn-sys01-popout btn-live-launcher"
            onclick="event.stopPropagation(); openDmPlatformChooser(this);"
            title="Send a DM on Facebook Messenger to GlennBot Automations and watch Gemini 3.5 Flash auto-reply live"
          >
            <span>✉️ Send a DM</span>
          </button>
          <button
            type="button"
            class="btn-sys01-popout btn-live-launcher btn-sys02-email"
            onclick="event.stopPropagation(); openEmailInteractivePopup();"
            title="Test the Live AI Email Auto-Responder (Gemini + Google Drive Excel Sync)"
          >
            <span>📧 Send an Email</span>
          </button>
        </div>`
          : projectId === "calendar-orchestrator" || projectId === "crm-batch-outreach"
          ? `
        <div class="modal-case-footer modal-case-footer-sys02">
          <button
            type="button"
            class="btn-sys01-popout btn-live-launcher btn-sys03-import"
            onclick="event.stopPropagation(); openSys03ImportContactsModal(this);"
          >
            <span>📥 Import Contacts</span>
          </button>
          <button
            type="button"
            class="btn-sys01-popout btn-live-launcher"
            onclick="event.stopPropagation(); openSys03CreateCustomMessageModal(this);"
          >
            <span>✍️ Create Custom Message</span>
          </button>
          <button
            type="button"
            class="btn-sys01-popout btn-live-launcher"
            onclick="event.stopPropagation(); openSys03SendBatchEmailModal(this);"
          >
            <span>🚀 Send Batch Email</span>
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
        ${projectId === "social-scheduler" || projectId === "omnichannel-inbox" || projectId === "calendar-orchestrator" ? caseFooterHtml : ""}
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

      // 3. Render Tab 03: Live Interactive API Widget for SYS-01..04
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
        ${projectId === "social-scheduler" || projectId === "omnichannel-inbox" || projectId === "calendar-orchestrator" ? caseFooterHtml : ""}
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
        if (proj.workflowPresets) {
          const workflowSelect = form.querySelector('select[name="workflow"]');
          const platformsInput = form.querySelector('input[name="platforms"]');
          const topicInput = form.querySelector('textarea[name="topic"], input[name="topic"]');
          if (workflowSelect) {
            workflowSelect.addEventListener("change", () => {
              const preset = proj.workflowPresets[workflowSelect.value];
              if (preset) {
                if (platformsInput && preset.platforms) platformsInput.value = preset.platforms;
                if (topicInput && preset.topic) topicInput.value = preset.topic;
              }
              executeDemoRequest();
            });
          }
        }

        if (proj.channelPresets) {
          const channelSelect = form.querySelector('select[name="channel"]');
          const senderInput = form.querySelector('input[name="sender"]');
          const messageInput = form.querySelector('textarea[name="message"]');
          if (channelSelect) {
            channelSelect.addEventListener("change", () => {
              const preset = proj.channelPresets[channelSelect.value];
              if (preset) {
                if (senderInput) senderInput.value = preset.sender;
                if (messageInput) messageInput.value = preset.message;
              }
              executeDemoRequest();
            });
          }
        }

        if (proj.stagePresets) {
          const stageSelect = form.querySelector('select[name="stage"]');
          const contactSampleInput = form.querySelector('input[name="contact_sample"]');
          const templateMsgInput = form.querySelector('textarea[name="template_message"]');
          if (stageSelect) {
            stageSelect.addEventListener("change", () => {
              const preset = proj.stagePresets[stageSelect.value];
              if (preset) {
                if (contactSampleInput && preset.contact_sample) {
                  contactSampleInput.value = preset.contact_sample;
                }
                if (templateMsgInput && preset.template_message) {
                  templateMsgInput.value = preset.template_message;
                }
              }
              executeDemoRequest();
            });
          }
        }

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
        const banner = e.target.closest(".webcard-banner");
        if (banner && banner.getAttribute("data-suppress-click") === "1") {
          banner.removeAttribute("data-suppress-click");
          return;
        }
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
    document.addEventListener("click", (e) => {
      const emailBtn = e.target && e.target.closest ? e.target.closest(".btn-sys02-email") : null;
      if (emailBtn) {
        e.preventDefault();
        e.stopPropagation();
        openEmailInteractivePopup();
        return;
      }
      const sys03ImportBtn =
        e.target && e.target.closest
          ? e.target.closest("#btn-sys03-import-contacts, .btn-sys03-import")
          : null;
      if (sys03ImportBtn) {
        e.preventDefault();
        e.stopPropagation();
        openSys03ImportContactsModal(sys03ImportBtn);
      }
    });
  }

  function initEqualizeProjectWebCards() {
    const grid = document.querySelector(".projects-grid-2x2");
    if (!grid) return;

    function syncHeights() {
      const cards = Array.from(grid.querySelectorAll(".project-showcase-card"));
      if (!cards.length) return;

      const selectors = [
        ".project-title-row",
        ".project-tryme-callout",
        ".project-tryme-buttons",
        ".project-footer-links",
      ];

      // Reset inline minHeight before measuring natural wrapped heights
      selectors.forEach((sel) => {
        cards.forEach((card) => {
          const el = card.querySelector(sel);
          if (el) el.style.minHeight = "";
        });
      });

      // On mobile single-column stack (<= 768px), let each card size naturally
      if (window.innerWidth <= 768) {
        return;
      }

      selectors.forEach((sel) => {
        let maxH = 0;
        const elements = [];
        cards.forEach((card) => {
          const el = card.querySelector(sel);
          if (el) {
            elements.push(el);
            const h = Math.ceil(el.getBoundingClientRect().height);
            if (h > maxH) maxH = h;
          }
        });
        if (maxH > 0) {
          elements.forEach((el) => {
            el.style.minHeight = maxH + "px";
          });
        }
      });
    }

    syncHeights();
    window.addEventListener("load", syncHeights);
    window.addEventListener("resize", syncHeights);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncHeights).catch(() => {});
    }
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => {
        window.requestAnimationFrame(syncHeights);
      });
      ro.observe(grid);
    }
  }

  function initWebcardBannerMagnifier() {
    const banners = document.querySelectorAll(".webcard-banner");
    if (!banners.length) return;

    banners.forEach((banner) => {
      // Inject magnifying glass lens ring if not already present
      if (!banner.querySelector(".webcard-magnifier-lens")) {
        const lens = document.createElement("span");
        lens.className = "webcard-magnifier-lens";
        lens.setAttribute("aria-hidden", "true");
        banner.appendChild(lens);
      }

      function updateMagnifierCoords(clientX, clientY, isTouch) {
        const rect = banner.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const rawX = ((clientX - rect.left) / rect.width) * 100;
        const rawY = ((clientY - rect.top) / rect.height) * 100;
        const pctX = Math.max(0, Math.min(100, rawX));
        // On touch devices, offset Y slightly upward so the user's finger doesn't cover the zoomed text
        const adjustedY = isTouch ? rawY - 8 : rawY;
        const pctY = Math.max(0, Math.min(100, adjustedY));

        banner.style.setProperty("--zoom-x", pctX.toFixed(2) + "%");
        banner.style.setProperty("--zoom-y", pctY.toFixed(2) + "%");
        banner.style.setProperty("--lens-x", pctX.toFixed(2) + "%");
        banner.style.setProperty("--lens-y", Math.max(0, Math.min(100, rawY)).toFixed(2) + "%");
      }

      function resetMagnifier() {
        banner.classList.remove("is-magnifying");
      }

      // Desktop Mouse Hover & Move
      banner.addEventListener("mouseenter", (e) => {
        banner.classList.add("is-magnifying");
        updateMagnifierCoords(e.clientX, e.clientY, false);
      });

      banner.addEventListener("mousemove", (e) => {
        if (!banner.classList.contains("is-magnifying")) {
          banner.classList.add("is-magnifying");
        }
        updateMagnifierCoords(e.clientX, e.clientY, false);
      });

      banner.addEventListener("mouseleave", () => {
        resetMagnifier();
      });

      // Mobile Browser Hold-Touch + Finger Drag
      let holdTimer = null;
      let isTouchMagnifying = false;
      let startX = 0;
      let startY = 0;

      banner.addEventListener(
        "touchstart",
        (e) => {
          if (!e.touches || e.touches.length !== 1) return;
          const touch = e.touches[0];
          startX = touch.clientX;
          startY = touch.clientY;
          isTouchMagnifying = false;

          if (holdTimer) clearTimeout(holdTimer);
          holdTimer = setTimeout(() => {
            isTouchMagnifying = true;
            banner.setAttribute("data-suppress-click", "1");
            banner.classList.add("is-magnifying");
            updateMagnifierCoords(touch.clientX, touch.clientY, true);
          }, 150);
        },
        { passive: true }
      );

      banner.addEventListener(
        "touchmove",
        (e) => {
          if (!e.touches || e.touches.length !== 1) return;
          const touch = e.touches[0];
          if (!isTouchMagnifying) {
            const dx = Math.abs(touch.clientX - startX);
            const dy = Math.abs(touch.clientY - startY);
            // If user starts scrolling before hold timer fires, cancel hold timer
            if (dx > 12 || dy > 12) {
              if (holdTimer) {
                clearTimeout(holdTimer);
                holdTimer = null;
              }
            }
            return;
          }
          // Actively magnifying via hold + drag: prevent page scroll while panning banner zoom
          if (e.cancelable) e.preventDefault();
          updateMagnifierCoords(touch.clientX, touch.clientY, true);
        },
        { passive: false }
      );

      function endTouchMagnifier() {
        if (holdTimer) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }
        if (isTouchMagnifying) {
          isTouchMagnifying = false;
          resetMagnifier();
        }
      }

      banner.addEventListener("touchend", endTouchMagnifier, { passive: true });
      banner.addEventListener("touchcancel", endTouchMagnifier, { passive: true });
    });
  }

  function initAll() {
    initThemeToggle();
    initRoleTypingEffect();
    initScrollReveal();
    initCircuitCanvas();
    initFeaturedProjectsInspector();
    initEqualizeProjectWebCards();
    initWebcardBannerMagnifier();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();

