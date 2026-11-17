export function getGlennBotBaseUrl() {
  if (
    typeof window !== "undefined" &&
    window.__GLENNBOT_ENV__ &&
    window.__GLENNBOT_ENV__.GLENNBOT_BASE_URL
  ) {
    return String(window.__GLENNBOT_ENV__.GLENNBOT_BASE_URL).replace(/\/+$/, "");
  }
  if (
    typeof process !== "undefined" &&
    process.env &&
    process.env.GLENNBOT_BASE_URL
  ) {
    return String(process.env.GLENNBOT_BASE_URL).replace(/\/+$/, "");
  }
  return "";
}

export function getGlennBotApiBaseUrl() {
  if (
    typeof window !== "undefined" &&
    window.__GLENNBOT_ENV__ &&
    window.__GLENNBOT_ENV__.GLENNBOT_API_BASE_URL
  ) {
    return String(window.__GLENNBOT_ENV__.GLENNBOT_API_BASE_URL).replace(/\/+$/, "");
  }
  if (
    typeof process !== "undefined" &&
    process.env &&
    process.env.GLENNBOT_API_BASE_URL
  ) {
    return String(process.env.GLENNBOT_API_BASE_URL).replace(/\/+$/, "");
  }
  const base = getGlennBotBaseUrl();
  return base ? `${base}/api/v1` : "";
}

export const GLENNBOT_LIVE_ORIGIN = getGlennBotBaseUrl();
export const GLENNBOT_POPOUT_PROXY_PATH = "/glennbot-popout";

export const SYS01_EXPANDED_VIEWS = {
  scheduler: {
    tab: "scheduler",
    label: "📝 Create Post",
    title: "Create & Schedule Post — Expanded View",
    subtitle: "Multi-Platform Publisher, Media Studio & AI Caption Workspace",
    icon: "fas fa-paper-plane",
    width: 1240,
    height: 860,
    baseUrl: "/glennbot-popout?popout_mode=workspace_view&tab=scheduler",
    get upstreamUrl() {
      return `${getGlennBotBaseUrl() || GLENNBOT_LIVE_ORIGIN}/?popout_mode=workspace_view&tab=scheduler`;
    },
  },
  queue: {
    tab: "queue",
    label: "⏳ Queue",
    title: "Publishing Queue & History — Expanded View",
    subtitle: "Live Scheduled, Published & Draft Social Posts Monitor",
    icon: "fas fa-stream",
    width: 1220,
    height: 840,
    baseUrl: "/glennbot-popout?popout_mode=workspace_view&tab=queue",
    get upstreamUrl() {
      return `${getGlennBotBaseUrl() || GLENNBOT_LIVE_ORIGIN}/?popout_mode=workspace_view&tab=queue`;
    },
  },
  calendar: {
    tab: "calendar",
    label: "📅 Calendar",
    title: "Social Media Content Calendar — Expanded View",
    subtitle: "Visual Monthly Schedule of Queued & Published Omnichannel Social Posts",
    icon: "fas fa-calendar-alt",
    width: 1260,
    height: 860,
    baseUrl: "/glennbot-popout?popout_mode=workspace_view&tab=calendar",
    get upstreamUrl() {
      return `${getGlennBotBaseUrl() || GLENNBOT_LIVE_ORIGIN}/?popout_mode=workspace_view&tab=calendar`;
    },
  },
};

export function buildGlennBotExpandedUrl(tabName = "scheduler", mode = "workspace_view", timestamp = null) {
  if (typeof tabName === "string" && /^(\/|https?:\/\/)/i.test(tabName.trim())) {
    return tabName.trim();
  }
  const cleanTab = String(tabName || "scheduler").trim();
  const cleanMode = String(mode || "workspace_view").trim();
  const base = `${GLENNBOT_POPOUT_PROXY_PATH}?popout_mode=${encodeURIComponent(cleanMode)}&tab=${encodeURIComponent(cleanTab)}`;
  if (timestamp !== null && timestamp !== undefined) {
    return `${base}&_ts=${encodeURIComponent(String(timestamp))}`;
  }
  return base;
}

export function computeCenteredPopupFeatures(width = 1240, height = 860, screenAvailW = 1440, screenAvailH = 900) {
  const availW = Number(screenAvailW) > 0 ? Number(screenAvailW) : 1440;
  const availH = Number(screenAvailH) > 0 ? Number(screenAvailH) : 900;
  const w = Math.min(Number(width) || 1240, availW - 40);
  const h = Math.min(Number(height) || 860, availH - 80);
  const left = Math.max(0, Math.round((availW - w) / 2));
  const top = Math.max(0, Math.round((availH - h) / 2));
  const features = `width=${w},height=${h},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`;
  return { w, h, left, top, features };
}

export function buildInstantPopoutStyleTag(targetTab = "scheduler", popoutMode = "workspace_view") {
  const cleanTab = String(targetTab || "scheduler").trim().toLowerCase() || "scheduler";
  const cleanMode = String(popoutMode || "workspace_view").trim().toLowerCase() || "workspace_view";
  const nonSchedulerBlock =
    cleanTab !== "scheduler"
      ? `  /* If target tab is NOT scheduler, hide #view-scheduler immediately until JS switchTab runs */\n  #view-scheduler:not(.gb-tab-ready) {\n    display: none !important;\n  }\n`
      : "";
  const commentThreadBlock =
    cleanMode === "comment_thread"
      ? [
          `  /* Immediately focus on the right-hand comment thread panel in comment_thread mode and hide redundant buttons */`,
          `  #comments-top-filter-bar,`,
          `  #comments-left-column,`,
          `  #gb-popout-window-bar button,`,
          `  #gb-popout-window-bar a,`,
          `  #gb-btn-open-actual-fb-post,`,
          `  #gb-btn-manual-sync-now {`,
          `    display: none !important;`,
          `  }`,
        ].join("\n") + "\n"
      : cleanMode === "message_thread"
      ? [
          `  /* Immediately focus on the right-hand message thread panel in message_thread mode and hide destructive controls */`,
          `  #messages-top-filter-bar,`,
          `  #messages-left-column,`,
          `  #gb-popout-window-bar button,`,
          `  #gb-popout-window-bar a,`,
          `  button[onclick*="promptDeleteConversation("],`,
          `  button[onclick*="promptDeleteSingleChatMessage("] {`,
          `    display: none !important;`,
          `  }`,
          `  #message-detail-panel {`,
          `    width: 100% !important;`,
          `    flex: 1 1 0% !important;`,
          `  }`,
        ].join("\n") + "\n"
      : "";
  const composerHideCss = [
    `  /* Completely prevent any split-second flash of the bottom comment reply composer in comment_thread popup */`,
    `  #comment-detail-panel > div > div.bg-slate-900\\/90.rounded-xl.p-3,`,
    `  #reply-target-label,`,
    `  #comment-reply-input,`,
    `  #btn-send-reply,`,
    `  #btn-send-dm-from-composer,`,
    `  button[onclick*="insertQuickReply("],`,
    `  button[onclick*="deletePostNotificationCard("],`,
    `  button[onclick*="deleteSingleCommentNotification("],`,
    `  button[onclick*="deleteSingleCommentReply("],`,
    `  button[onclick*="toggleHideComment("] {`,
    `    display: none !important;`,
    `    visibility: hidden !important;`,
    `    opacity: 0 !important;`,
    `    height: 0 !important;`,
    `    max-height: 0 !important;`,
    `    overflow: hidden !important;`,
    `    padding: 0 !important;`,
    `    margin: 0 !important;`,
    `    border: 0 !important;`,
    `    pointer-events: none !important;`,
    `  }`,
  ].join("\n");
  const emailDemoLockCss = [
    `  /* Portfolio Demo Mode: Lock Email Hub to glennard.tasico.va@gmail.com (Gmail), Sent folder only, and hide Connect/Disconnect/Compose/Sync/Reply controls */`,
    `  #email-plat-card-microsoft,`,
    `  #email-plat-card-imap,`,
    `  #btn-show-all-email-platforms,`,
    `  #email-top-platform-filter option:not([value="gmail"]),`,
    `  #email-folder-btn-inbox,`,
    `  #email-folder-btn-drafts,`,
    `  #email-folder-btn-spam,`,
    `  #email-folder-btn-trash,`,
    `  #btn-connect-email-top,`,
    `  #btn-connect-gmail-card,`,
    `  #btn-connect-microsoft-card,`,
    `  #btn-connect-imap-card,`,
    `  #btn-email-compose-top,`,
    `  button[onclick*="openComposeEmailModal"],`,
    `  #compose-email-modal,`,
    `  #btn-email-sync,`,
    `  #btn-sync-email-sent,`,
    `  #email-reader-pane > div:has(#email-quick-reply-input),`,
    `  #email-reader-pane > div:has(#norm-mode-btn-reply),`,
    `  #expanded-email-modal-content > div:has(#expanded-email-reply-input),`,
    `  #expanded-email-modal-content > div:has(#exp-mode-btn-reply),`,
    `  #norm-mode-btn-reply,`,
    `  #norm-mode-btn-reply_all,`,
    `  #norm-mode-btn-forward,`,
    `  #exp-mode-btn-reply,`,
    `  #exp-mode-btn-reply_all,`,
    `  #exp-mode-btn-forward,`,
    `  button[onclick*="setEmailReplyActionMode("],`,
    `  button[onclick*="toggleEmailReplyCcRow("],`,
    `  button[onclick*="reply-email-file-input"],`,
    `  button[onclick*="expanded-reply-email-file-input"],`,
    `  #email-quick-reply-mode-label,`,
    `  #expanded-email-reply-mode-label,`,
    `  #email-quick-reply-to,`,
    `  #email-quick-reply-cc-row,`,
    `  #email-quick-reply-cc,`,
    `  #expanded-email-reply-to,`,
    `  #expanded-email-reply-cc-row,`,
    `  #expanded-email-reply-cc,`,
    `  #reply-email-attachments-list,`,
    `  #expanded-reply-email-attachments-list,`,
    `  #email-quick-reply-input,`,
    `  #expanded-email-reply-input,`,
    `  #btn-send-email-reply,`,
    `  #btn-send-expanded-email-reply,`,
    `  button[onclick*="sendReplyToSelectedEmail("],`,
    `  button[onclick*="sendReplyFromExpandedModal("],`,
    `  button[onclick*="openConnectAccountsModal('gmail')"],`,
    `  button[onclick*="openConnectAccountsModal(\\"gmail\\")"],`,
    `  button[onclick*="startEmailOAuthPopup("],`,
    `  button[onclick*="disconnectEmailAccount("],`,
    `  button[onclick*="openImapConnectModal("] {`,
    `    display: none !important;`,
    `    visibility: hidden !important;`,
    `    opacity: 0 !important;`,
    `    height: 0 !important;`,
    `    max-height: 0 !important;`,
    `    padding: 0 !important;`,
    `    margin: 0 !important;`,
    `    border: 0 !important;`,
    `    overflow: hidden !important;`,
    `    pointer-events: none !important;`,
    `  }`,
  ].join("\n");
  return [
    `<style id="gb-portfolio-cal-lock">`,
    `  #cal-subtab-composio,`,
    `  #calendar-composio-toolbar,`,
    `  #schedule-meeting-modal {`,
    `    display: none !important;`,
    `  }`,
    composerHideCss,
    emailDemoLockCss,
    `</style>`,
    `<style id="gb-instant-popout-css">`,
    `  /* Immediately hide login gate and full dashboard homepage chrome */`,
    `  #glennbot-login-gate-overlay,`,
    `  #main-dashboard-header,`,
    `  #left-nav-sidebar {`,
    `    display: none !important;`,
    `  }`,
    `  /* Immediately hide Calendars & Meetings (Composio) sub-tab, toolbar, and modal */`,
    `  #cal-subtab-composio,`,
    `  #calendar-composio-toolbar,`,
    `  #schedule-meeting-modal {`,
    `    display: none !important;`,
    `  }`,
    `  /* Hide the Connect Accounts box inside Create Post (#view-scheduler) and the Connect Accounts modal */`,
    `  #view-scheduler > div:first-child > div:nth-child(2),`,
    `  #view-scheduler > div:first-child > div:has(> div > button[onclick*="openConnectAccountsModal"]),`,
    `  #view-scheduler > div:first-child > div:has(#sidebar-connected-count),`,
    `  #connect-accounts-modal {`,
    `    display: none !important;`,
    `  }`,
    composerHideCss,
    emailDemoLockCss,
    `  /* Immediately show the Expanded Focus Window top bar */`,
    `  #gb-popout-window-bar {`,
    `    display: flex !important;`,
    `  }`,
    nonSchedulerBlock + commentThreadBlock + `  #view-${cleanTab} {\n    display: flex !important;\n  }`,
    `</style>`,
  ].join("\n");
}

export function resolveCalendarProxyIntercept(method = "GET", rawPath = "") {
  const cleanPath = String(rawPath || "").replace(/^\/+|\/+$/g, "").toLowerCase();
  const methodUpper = String(method || "GET").toUpperCase();
  const isCalendarPath =
    cleanPath.startsWith("calendar/") ||
    cleanPath === "calendar" ||
    cleanPath.startsWith("v1/calendar/") ||
    cleanPath === "v1/calendar" ||
    cleanPath.startsWith("oauth/calendar/") ||
    cleanPath === "oauth/calendar";

  if (!isCalendarPath) return null;

  if (["POST", "PUT", "DELETE", "PATCH"].includes(methodUpper)) {
    return {
      statusCode: 403,
      body: {
        status: "error",
        message: "Calendars & Meetings are restricted in Portfolio Demo Mode.",
      },
    };
  }
  if (cleanPath === "calendar/accounts" || cleanPath === "v1/calendar/accounts") {
    return {
      statusCode: 200,
      body: { status: "success", accounts: [] },
    };
  }
  return {
    statusCode: 200,
    body: { status: "success", events: [], accounts: [] },
  };
}

export const PORTFOLIO_WHITELISTED_ACCOUNTS = {
  facebook: {
    matchToken: "glennbot automations",
    defaultId: "6af0b109818eb5c88d1e87a6",
    name: "GlennBot Automations",
    username: "GlennBot Automations",
  },
  youtube: {
    matchToken: "glennardtasico",
    defaultId: "6af17412c05e9c3bed5f068f",
    name: "glennardtasico",
    username: "glennardtasico",
  },
  tiktok: {
    matchToken: "glennbot.automation",
    defaultId: "6ad9e897085e3e64e595fe65",
    name: "@glennbot.automation",
    username: "glennbot.automation",
  },
  instagram: {
    matchToken: "glennard.tasico.va",
    defaultId: "6ad9e9b2e5d470e468e58d87",
    name: "@glennard.tasico.va",
    username: "glennard.tasico.va",
  },
};

export function filterPortfolioSocialAccounts(rawPayload = {}) {
  const src = rawPayload && typeof rawPayload === "object" ? rawPayload : {};
  const result = {
    facebook: [],
    instagram: [],
    tiktok: [],
    youtube: [],
    whatsapp: [],
    telegram: [],
    total_connected: 0,
  };

  for (const plat of ["facebook", "instagram", "tiktok", "youtube"]) {
    const spec = PORTFOLIO_WHITELISTED_ACCOUNTS[plat];
    const list = Array.isArray(src[plat]) ? src[plat] : [];
    const matched = list.find((item) => {
      if (!item || typeof item !== "object") return false;
      const candidates = [item.name, item.account_name, item.username]
        .map((v) => String(v || "").trim().replace(/^@+/, "").toLowerCase())
        .filter(Boolean);
      return candidates.includes(spec.matchToken);
    });

    const id = String(matched?.id || spec.defaultId);
    const avatar = String(matched?.avatar || "");
    const db_id = String(matched?.db_id || `${plat}_${id}`);
    const entry =
      plat === "facebook"
        ? { id, name: spec.name, avatar, connected_by: "External API", db_id }
        : { id, name: spec.name, username: spec.username, avatar, connected_by: "External API", db_id };
    result[plat] = [entry];
  }

  result.total_connected =
    result.facebook.length + result.instagram.length + result.tiktok.length + result.youtube.length;
  return result;
}

export const SYS01_PROJECT_SPEC = {
  endpoint: "POST /api/ai/ask • POST /api/schedule • GET /api/scheduled",
  tagline: "Context-Aware Gemini 3.5 Flash Caption Engine + Zero-RAM Zernio Media Cloud & APScheduler Queue",
  stackPills: [
    "FastAPI",
    "Gemini 3.5 Flash",
    "Zernio API",
    "PostgreSQL",
    "Cloudinary & GDrive",
    "APScheduler",
  ],
  sourceFile: "routers/ai_routes.py • routers/scheduler_routes.py (GlennBot Automations)",
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
  workflowOptions: [
    "📝 Create Post — AI Caption + Multi-Platform Schedule (FB, IG, TikTok, YouTube)",
    "⏳ Queue — Inspect APScheduler & Zernio Presigned Media Pipeline",
    "📅 Calendar — Sync Published & Queued Posts Across 4 Connected Accounts",
  ],
  footerButtons: ["📝 Create Post", "⏳ Queue", "📅 Calendar"],
};

export function formatInlineMarkdown(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

export const SHARED_SHOWCASE_CAPTION =
  "Hello future clients! Feel free to leave a comment on this sample post, and this AI-powered chatbot (powered by Gemini) will instantly answer any questions you have about my background, skills, and services. Everything you need to know about me is already loaded into its knowledge base. Go ahead and test it out—drop a comment below!";

export const SYS02_SHOWCASE_POSTS = {
  post_ext_dc6a96869a: {
    record_id: "post_ext_dc6a96869a",
    platform: "facebook",
    platform_label: "Facebook",
    badge_label: "GlennBot Automations — Facebook Page",
    account_name: "GlennBot Automations",
    post_type: "text",
    external_post_id: "61595021080265_122118104811500702",
    short_post_id: "122118104811500702",
    comment_id: "122118104811500702_1150007564513023",
    permalink_url: "https://www.facebook.com/61595021080265/posts/122118104811500702/",
    cta_label: "Comment on Actual Facebook Post ↗",
    primary_btn_label: "Open / Focus Actual Facebook Post Window",
    popup_url:
      "/glennbot-popout?popout_mode=comment_thread&record_id=post_ext_dc6a96869a&comment_id=122118104811500702_1150007564513023",
    get upstream_url() {
      return `${getGlennBotBaseUrl() || GLENNBOT_LIVE_ORIGIN}/?popout_mode=comment_thread&record_id=post_ext_dc6a96869a&comment_id=122118104811500702_1150007564513023`;
    },
    popup_window_name: "GlennBotCommentThread_FB",
    docked_window_name: "GlennBotDockedSocialPost_facebook",
    caption: SHARED_SHOWCASE_CAPTION,
  },
  post_ext_b10078462e: {
    record_id: "post_ext_b10078462e",
    platform: "instagram",
    platform_label: "Instagram",
    badge_label: "GlennBot Automations — Instagram",
    account_name: "GlennBot Automations",
    post_type: "image",
    external_post_id: "17956773894039696",
    short_post_id: "17956773894039696",
    comment_id: "18198560143393683",
    permalink_url: "https://www.instagram.com/p/DfkfvyEvx3b/",
    cta_label: "Comment on Actual Instagram Post ↗",
    primary_btn_label: "Open / Focus Actual Instagram Post Window",
    popup_url:
      "/glennbot-popout?popout_mode=comment_thread&record_id=post_ext_b10078462e&comment_id=18198560143393683",
    get upstream_url() {
      return `${getGlennBotBaseUrl() || GLENNBOT_LIVE_ORIGIN}/?popout_mode=comment_thread&record_id=post_ext_b10078462e&comment_id=18198560143393683`;
    },
    popup_window_name: "GlennBotCommentThread_IG",
    docked_window_name: "GlennBotDockedSocialPost_instagram",
    caption: SHARED_SHOWCASE_CAPTION,
  },
  post_ext_19fdfb7f26: {
    record_id: "post_ext_19fdfb7f26",
    platform: "tiktok",
    platform_label: "TikTok",
    badge_label: "GlennBot Automations — TikTok (@glennbot.automation)",
    account_name: "@glennbot.automation",
    post_type: "image",
    external_post_id: "7706791793546906901",
    short_post_id: "7706791793546906901",
    comment_id: "7706797468532458260",
    permalink_url: "https://www.tiktok.com/@glennbot.automation/photo/7706791793546906901",
    cta_label: "Comment on Actual TikTok Post ↗",
    primary_btn_label: "Open / Focus Actual TikTok Post Window",
    popup_url:
      "/glennbot-popout?popout_mode=comment_thread&record_id=post_ext_19fdfb7f26&comment_id=7706797468532458260",
    get upstream_url() {
      return `${getGlennBotBaseUrl() || GLENNBOT_LIVE_ORIGIN}/?popout_mode=comment_thread&record_id=post_ext_19fdfb7f26&comment_id=7706797468532458260`;
    },
    popup_window_name: "GlennBotCommentThread_TT",
    docked_window_name: "GlennBotDockedSocialPost_tiktok",
    caption: SHARED_SHOWCASE_CAPTION,
  },
};

export function computeRightDockedPopupFeatures(
  availW = 1440,
  availH = 900,
  screenLeft = 0,
  screenTop = 0,
  platform = "facebook"
) {
  const safeAvailW = Number(availW) > 0 ? Number(availW) : 1440;
  const safeAvailH = Number(availH) > 0 ? Number(availH) : 900;
  const safeScreenLeft = Number.isFinite(Number(screenLeft)) ? Number(screenLeft) : 0;
  const safeScreenTop = Number.isFinite(Number(screenTop)) ? Number(screenTop) : 0;
  const isInstagram = String(platform || "").trim().toLowerCase() === "instagram";

  // Instagram Web switches to its compact 2-column side-by-side desktop layout at >= 736px width.
  // Capping Instagram's popup to 760px-820px (~43% of a 1920px screen) keeps the comment box visible
  // on the right while preserving the full 57%-58% left side (~1,090px) for the Live GlennBot Dashboard.
  const minW = isInstagram ? (safeAvailW < 1400 ? 760 : 780) : 500;
  const maxW = isInstagram
    ? Math.min(safeAvailW - 24, safeAvailW < 1600 ? 800 : 820)
    : safeAvailW - 24;
  const widthRatio = isInstagram ? 0.43 : 0.42;
  const heightRatio = isInstagram ? 0.92 : 0.86;
  const rightMargin = isInstagram ? 8 : 20;

  const popupWidth = Math.min(maxW, Math.max(minW, Math.round(safeAvailW * widthRatio)));
  const popupHeight = Math.min(safeAvailH - 16, Math.max(680, Math.round(safeAvailH * heightRatio)));
  const popupLeft = Math.max(safeScreenLeft, Math.round(safeScreenLeft + safeAvailW - popupWidth - rightMargin));
  const popupTop = Math.max(safeScreenTop, Math.round(safeScreenTop + (safeAvailH - popupHeight) / 2));
  const features = `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop},menubar=no,toolbar=no,location=yes,status=no,resizable=yes,scrollbars=yes`;
  return {
    popupWidth,
    popupHeight,
    popupLeft,
    popupTop,
    features,
  };
}

export function buildCommentSplitWorkspaceConfig(platform = "facebook", timestamp = Date.now()) {
  const cleanPlat = String(platform || "facebook").trim().toLowerCase();
  const cfg =
    cleanPlat === "instagram"
      ? SYS02_SHOWCASE_POSTS.post_ext_b10078462e
      : cleanPlat === "tiktok"
      ? SYS02_SHOWCASE_POSTS.post_ext_19fdfb7f26
      : SYS02_SHOWCASE_POSTS.post_ext_dc6a96869a;
  const ts = Math.trunc(Number(timestamp) || Date.now());
  return {
    ...cfg,
    iframeUrl: `${cfg.popup_url}&_ts=${ts}`,
    upstreamIframeUrl: `${cfg.upstream_url}&_ts=${ts}`,
    actualPostUrl: cfg.permalink_url,
    secondary_btn_label: "Open Left Dashboard in Separate Window",
  };
}

export function buildShowcaseCommentLoadingCardHtml(platformOrRecordId = "facebook") {
  const key = String(platformOrRecordId || "facebook").trim().toLowerCase();
  const cfg =
    SYS02_SHOWCASE_POSTS[platformOrRecordId] ||
    (key === "instagram" || key === "post_ext_b10078462e"
      ? SYS02_SHOWCASE_POSTS.post_ext_b10078462e
      : key === "tiktok" || key === "post_ext_19fdfb7f26"
      ? SYS02_SHOWCASE_POSTS.post_ext_19fdfb7f26
      : SYS02_SHOWCASE_POSTS.post_ext_dc6a96869a);
  return [
    `<div class="space-y-2">`,
    `<div class="flex items-center justify-between">`,
    `<span id="post-comments-count-label" class="text-[11px] font-bold uppercase tracking-wider text-gb-cyan flex items-center gap-1.5"><i class="fas fa-circle-notch fa-spin text-gb-cyan"></i> Comments on This Post (Loading...)</span>`,
    `</div>`,
    `<div id="post-comments-thread-list" class="space-y-2.5">`,
    `<div id="gb-savvy-zero-comments-box" data-record-id="${cfg.record_id}" data-loading-state="1" class="p-6 rounded-xl bg-slate-900/60 border border-cyan-500/30 text-center space-y-3 shadow-[0_0_25px_rgba(6,182,212,0.08)]">`,
    `<div class="relative w-12 h-12 mx-auto flex items-center justify-center">`,
    `<span class="absolute inset-0 rounded-full border-2 border-cyan-400/25 border-t-cyan-400 animate-spin"></span>`,
    `<span class="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-gb-cyan"><i class="fas fa-circle-notch fa-spin text-base"></i></span>`,
    `</div>`,
    `<div class="space-y-1">`,
    `<p class="text-xs font-bold text-slate-100 tracking-wide">Loading live comments from ${cfg.platform_label}...</p>`,
    `<p class="text-[11px] text-slate-400 max-w-xl mx-auto leading-relaxed">Fetching real-time comment thread &amp; <span class="text-gb-cyan font-semibold">GlennBot Automations' Gemini AI</span> replies for <span class="text-emerald-300 font-semibold">${cfg.account_name}</span>...</p>`,
    `</div>`,
    `<div class="pt-2 space-y-2 max-w-xl mx-auto text-left opacity-80">`,
    `<div class="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 animate-pulse space-y-2">`,
    `<div class="flex items-center gap-2.5"><div class="w-6 h-6 rounded-full bg-slate-700/80"></div><div class="h-2.5 w-28 rounded bg-slate-700/80"></div><div class="h-2 w-16 rounded bg-slate-800 ml-auto"></div></div>`,
    `<div class="h-2.5 w-3/4 rounded bg-slate-700/60"></div>`,
    `</div>`,
    `<div class="ml-6 p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 animate-pulse space-y-1.5">`,
    `<div class="flex items-center gap-2"><div class="h-2 w-24 rounded bg-cyan-500/30"></div><div class="h-2 w-14 rounded bg-emerald-500/20"></div></div>`,
    `<div class="h-2 w-5/6 rounded bg-slate-700/50"></div>`,
    `</div>`,
    `</div>`,
    `</div>`,
    `</div>`,
    `</div>`,
  ].join("");
}

export function generateLiveDmSessionIds(
  randomToken = null,
  timestampMs = Date.now(),
  accountId = "6af0b109818eb5c88d1e87a6",
  platform = "facebook"
) {
  const randPart =
    typeof randomToken === "string" && randomToken.trim()
      ? randomToken.trim().replace(/[^a-z0-9]/gi, "").slice(0, 7)
      : Math.random().toString(36).slice(2, 9);
  const tsNum = Math.trunc(Number(timestampMs) || Date.now());
  const tsPart = tsNum.toString(36);
  const cleanAccId = String(accountId || "6af0b109818eb5c88d1e87a6").trim();
  const cleanPlat = String(platform || "facebook").trim().toLowerCase();
  const prefix =
    cleanPlat === "whatsapp"
      ? "wa_live_dm"
      : cleanPlat === "instagram"
      ? "ig_live"
      : "fb_live";
  const sessionConvId = `${prefix}_${randPart}_${tsPart}`;
  const sessionConvKey = `${cleanAccId}_${sessionConvId}`;
  return {
    sessionConvId,
    accountId: cleanAccId,
    sessionConvKey,
  };
}

export const SYS02_DM_SHOWCASE_CONFIG = {
  whatsappUrl: "https://wa.me/639175497760",
  whatsappPhone: "+63 917 549 7760",
  whatsappAccountName: "Glennard Tasico (+63 917 549 7760)",
  chooserOptions: ["facebook", "instagram", "whatsapp", "mock_chat"],
  facebook: {
    platform: "facebook",
    platform_label: "Facebook",
    page_header: "GlennBot Automations",
    page_subtitle: "Facebook Messenger • 24h Meta Window + Gemini 3.5 Flash Active",
    account_id: "6af0b109818eb5c88d1e87a6",
    account_name: "GlennBot Automations",
    direct_messenger_url: "https://www.facebook.com/messages/t/1340688402467466",
    direct_messenger_window_name: "GlennBotDirectFacebookMessengerFullView",
    direct_instagram_url: "https://www.instagram.com/direct/t/18131808028702166/",
    direct_instagram_window_name: "GlennBotDirectInstagramDmFullView",
    direct_whatsapp_url: "https://wa.me/639175497760",
    direct_whatsapp_window_name: "GlennBotDirectWhatsAppDmFullView",
    chooser_options: [
      {
        id: "gb-choose-fb-dm-btn",
        title: "Facebook (GlennBot Automations)",
        badge: "Direct Facebook Page Messenger",
        action: "openMaximizedDirectSocialDm('facebook')",
        url: "https://www.facebook.com/messages/t/1340688402467466",
      },
      {
        id: "gb-choose-ig-dm-btn",
        title: "Instagram (@glennard.tasico.va)",
        badge: "Direct Instagram DM",
        action: "openMaximizedDirectSocialDm('instagram')",
        url: "https://www.instagram.com/direct/t/18131808028702166/",
      },
      {
        id: "gb-choose-wa-dm-btn",
        title: "WhatsApp",
        subtitle: "Glennard Tasico • +63 917 549 7760",
        badge: "Open Chat ↗",
        action: "openWhatsAppInteractiveDmPopup()",
        url: "https://wa.me/639175497760",
      },
      {
        id: "gb-choose-mock-chat-dm-btn",
        title: "Mock Chat Test",
        badge: "Interactive Split-Screen Sandbox",
        action: "openDmSplitWorkspace('facebook')",
      },
    ],
    default_visitor_name: "Portfolio Client",
    visitor_name_placeholder: "Your Name (e.g. Alex)",
    new_blank_chat_label: "🔄 New Blank Chat",
    typing_indicator_text: "GlennBot Automations is typing via Gemini 3.5 Flash...",
    composer_placeholder: "Write a message to GlennBot Automations...",
    live_dm_post_endpoint: "/api/messages/portfolio_live_dm",
    get upstream_live_dm_post_endpoint() {
      return `${getGlennBotBaseUrl() || GLENNBOT_LIVE_ORIGIN}/api/messages/portfolio_live_dm`;
    },
    poll_interval_ms: 2500,
    quick_starter_hints: [
      "Hi GlennBot! What automation services do you offer?",
      "How can your Python & AI workflows help my business save time?",
      "Magkano ang rate mo at paano mag-inquire?",
    ],
    status_bar_text:
      "🟢 LIVE MESSENGER SESSION • Synced in Real Time with Your Client Chat",
    refresh_btn_label: "🔄 Refresh Live Chat",
    base_popup_url:
      "/glennbot-popout?popout_mode=message_thread&platform=facebook&account_id=6af0b109818eb5c88d1e87a6&account_name=GlennBot+Automations",
    get base_upstream_url() {
      return `${getGlennBotBaseUrl() || GLENNBOT_LIVE_ORIGIN}/?popout_mode=message_thread&platform=facebook&account_id=6af0b109818eb5c88d1e87a6&account_name=GlennBot+Automations`;
    },
    popup_window_name: "GlennBotMessageThread_FB",
  },
  instagram: {
    platform: "instagram",
    platform_label: "Instagram Direct",
    page_header: "@glennard.tasico.va",
    page_subtitle: "Instagram Direct • 24h Meta Window + Gemini 3.5 Flash Active",
    account_id: "6ad9e9b2e5d470e468e58d87",
    account_name: "@glennard.tasico.va",
    direct_instagram_url: "https://www.instagram.com/direct/t/18131808028702166/",
    direct_instagram_window_name: "GlennBotDirectInstagramDmFullView",
    default_visitor_name: "Portfolio Client",
    visitor_name_placeholder: "Your Name (e.g. Alex)",
    new_blank_chat_label: "🔄 New Blank Chat",
    typing_indicator_text: "@glennard.tasico.va is typing via Gemini 3.5 Flash...",
    composer_placeholder: "Message @glennard.tasico.va on Instagram...",
    live_dm_post_endpoint: "/api/messages/portfolio_live_dm",
    get upstream_live_dm_post_endpoint() {
      return `${getGlennBotBaseUrl() || GLENNBOT_LIVE_ORIGIN}/api/messages/portfolio_live_dm`;
    },
    poll_interval_ms: 2500,
    quick_starter_hints: [
      "Hi GlennBot! What automation services do you offer?",
      "How can your Python & AI workflows help my business save time?",
      "Magkano ang rate mo at paano mag-inquire?",
    ],
    status_bar_text:
      "🟢 LIVE INSTAGRAM DM SESSION • Synced in Real Time with Conversations.xlsx (Sheet2)",
    refresh_btn_label: "🔄 Refresh Live Chat",
    base_popup_url:
      "/glennbot-popout?popout_mode=message_thread&platform=instagram&account_id=6ad9e9b2e5d470e468e58d87&account_name=%40glennard.tasico.va",
    get base_upstream_url() {
      return `${getGlennBotBaseUrl() || GLENNBOT_LIVE_ORIGIN}/?popout_mode=message_thread&platform=instagram&account_id=6ad9e9b2e5d470e468e58d87&account_name=%40glennard.tasico.va`;
    },
    popup_window_name: "GlennBotMessageThread_IG",
  },
  whatsapp: {
    platform: "whatsapp",
    platform_label: "WhatsApp Messenger",
    page_header: "Glennard Tasico (+63 917 549 7760)",
    page_subtitle: "+63 917 549 7760 • WhatsApp Direct",
    account_id: "6af6210fb722435238788b8f",
    account_name: "Glennard Tasico (+63 917 549 7760)",
    phone: "+63 917 549 7760",
    direct_whatsapp_url: "https://wa.me/639175497760",
    direct_whatsapp_window_name: "GlennBotDirectWhatsAppDmFullView",
    external_btn_text: "Open WhatsApp (+63 917 549 7760) ↗",
    default_visitor_name: "Portfolio Client",
    visitor_name_placeholder: "Your Name (e.g. Alex)",
    new_blank_chat_label: "🔄 New Blank Chat",
    typing_indicator_text: "Glennard Tasico (+63 917 549 7760) is typing via Gemini 3.5 Flash...",
    composer_placeholder: "Message Glennard Tasico (+63 917 549 7760) on WhatsApp...",
    live_dm_post_endpoint: "/api/messages/portfolio_live_dm",
    get upstream_live_dm_post_endpoint() {
      return `${getGlennBotBaseUrl() || GLENNBOT_LIVE_ORIGIN}/api/messages/portfolio_live_dm`;
    },
    poll_interval_ms: 2500,
    quick_starter_hints: [
      "Hi Glennard! Can you build webhooks & automations?",
      "Magkano po magpagawa ng web app at AI chatbot?",
      "I'd like to discuss an Automation project",
    ],
    status_bar_text:
      "🟢 LIVE WHATSAPP SESSION (+63 917 549 7760) • Synced in Real Time with Conversations.xlsx (Sheet2)",
    refresh_btn_label: "🔄 Refresh Live Chat",
    base_popup_url:
      "/glennbot-popout?popout_mode=message_thread&platform=whatsapp&account_id=6af6210fb722435238788b8f&account_name=Glennard+Tasico+%28%2B63+917+549+7760%29",
    get base_upstream_url() {
      return `${getGlennBotBaseUrl() || GLENNBOT_LIVE_ORIGIN}/?popout_mode=message_thread&platform=whatsapp&account_id=6af6210fb722435238788b8f&account_name=Glennard+Tasico+%28%2B63+917+549+7760%29`;
    },
    popup_window_name: "GlennBotMessageThread_WA",
  },
};

export function resolveDirectSocialDmTargetUrl(platform = "facebook") {
  const cleanPlat = String(platform || "facebook").trim().toLowerCase();
  if (cleanPlat === "whatsapp") {
    return "https://wa.me/639175497760";
  }
  if (cleanPlat === "instagram") {
    return "https://www.instagram.com/direct/t/18131808028702166/";
  }
  return "https://www.facebook.com/messages/t/1340688402467466";
}

export function computeMaximizedDirectMessengerFeatures(
  availW = 1920,
  availH = 1080,
  platform = "facebook"
) {
  const rawPlat = String(platform || "facebook").trim().toLowerCase();
  const platKey =
    rawPlat === "instagram"
      ? "instagram"
      : rawPlat === "whatsapp"
      ? "whatsapp"
      : "facebook";
  const safeW = Number(availW) > 0 ? Math.trunc(Number(availW)) : 1920;
  const safeH = Number(availH) > 0 ? Math.trunc(Number(availH)) : 1080;
  const features = [
    `width=${safeW}`,
    `height=${safeH}`,
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
  return {
    platform: platKey,
    targetUrl: resolveDirectSocialDmTargetUrl(platKey),
    windowName:
      platKey === "instagram"
        ? "GlennBotDirectInstagramDmFullView"
        : platKey === "whatsapp"
        ? "GlennBotDirectWhatsAppDmFullView"
        : "GlennBotDirectFacebookMessengerFullView",
    availW: safeW,
    availH: safeH,
    features,
  };
}

export function buildPortfolioLiveDmPayload(
  sessionConvId,
  messageText,
  visitorName = "Portfolio Client",
  accountId = "6af0b109818eb5c88d1e87a6",
  platform = "facebook",
  accountName = "GlennBot Automations"
) {
  const cleanConvId = String(sessionConvId || "").trim();
  const cleanPlat = String(platform || "facebook").trim().toLowerCase() || "facebook";
  const cfg = SYS02_DM_SHOWCASE_CONFIG[cleanPlat] || SYS02_DM_SHOWCASE_CONFIG.facebook;
  const cleanAccId = String(accountId || cfg.account_id || "6af0b109818eb5c88d1e87a6").trim();
  const cleanAccName = String(accountName || cfg.account_name || "GlennBot Automations").trim();
  const cleanVisitor = String(visitorName || "").trim() || "Portfolio Client";
  const cleanMsg = String(messageText || "").trim();
  return {
    conversation_id: cleanConvId,
    account_id: cleanAccId,
    account_name: cleanAccName,
    platform: cleanPlat,
    participant_name: cleanVisitor,
    message: cleanMsg,
  };
}

export function hasOwnReplyAfterLastUserMessage(messagesList = []) {
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

export function deduplicateDmThreadMessages(messagesList = []) {
  if (!Array.isArray(messagesList) || messagesList.length === 0) return [];
  const isGenericFallback = (txt) =>
    String(txt || "").includes(
      "I'm GlennBot (powered by Gemini 3.5 Flash & synced with Conversations.xlsx Sheet2 + Script.xlsx)."
    );
  const deduped = [];
  const seenIds = new Set();
  for (const raw of messagesList) {
    if (!raw || typeof raw !== "object") continue;
    const msgText = String(raw.message || raw.text || raw.content || "").trim();
    if (!msgText) continue;
    const msgId = String(raw.id || raw.message_id || "").trim();
    if (msgId && seenIds.has(msgId)) continue;
    const isOwn = Boolean(raw.is_own);
    if (deduped.length > 0) {
      const prev = deduped[deduped.length - 1];
      const prevIsOwn = Boolean(prev.is_own);
      const prevText = String(prev.message || prev.text || prev.content || "").trim();
      if (!isOwn && !prevIsOwn && prevText.toLowerCase() === msgText.toLowerCase()) {
        continue;
      }
      if (isOwn && prevIsOwn) {
        if (isGenericFallback(prevText) && !isGenericFallback(msgText)) {
          deduped[deduped.length - 1] = { ...raw };
          if (msgId) seenIds.add(msgId);
        }
        continue;
      }
    }
    if (msgId) seenIds.add(msgId);
    deduped.push({ ...raw });
  }
  return deduped;
}

export function buildDmSplitWorkspaceConfig(
  platform = "facebook",
  sessionConvId = null,
  refreshTs = null
) {
  const cleanPlat = String(platform || "facebook").trim().toLowerCase();
  const cfg = SYS02_DM_SHOWCASE_CONFIG[cleanPlat] || SYS02_DM_SHOWCASE_CONFIG.facebook;
  const resolvedConvId =
    typeof sessionConvId === "string" &&
    (sessionConvId.trim().startsWith("fb_live_") ||
      sessionConvId.trim().startsWith("wa_live_dm_") ||
      sessionConvId.trim().startsWith("wa_live_") ||
      sessionConvId.trim().startsWith("ig_live_"))
      ? sessionConvId.trim()
      : generateLiveDmSessionIds(null, Date.now(), cfg.account_id, cleanPlat).sessionConvId;
  const sessionConvKey = `${cfg.account_id}_${resolvedConvId}`;
  const refreshSuffix =
    refreshTs !== null && refreshTs !== undefined
      ? `&_refresh=${Math.trunc(Number(refreshTs) || Date.now())}`
      : "";
  const queryTail = `&conv_key=${encodeURIComponent(sessionConvKey)}&conv_id=${encodeURIComponent(resolvedConvId)}${refreshSuffix}`;
  return {
    ...cfg,
    sessionConvId: resolvedConvId,
    sessionConvKey,
    iframeUrl: `${cfg.base_popup_url}${queryTail}`,
    upstreamIframeUrl: `${cfg.base_upstream_url}${queryTail}`,
    threadPollUrl: `/api/messages/${encodeURIComponent(resolvedConvId)}/thread?account_id=${encodeURIComponent(cfg.account_id)}&force=false`,
    upstreamThreadPollUrl: `${getGlennBotBaseUrl() || GLENNBOT_LIVE_ORIGIN}/api/messages/${encodeURIComponent(resolvedConvId)}/thread?account_id=${encodeURIComponent(cfg.account_id)}&force=false`,
  };
}

export const SYS02_SAVVY_FINDS_COMMENT_DEMO = {
  recordId: "post_ext_dc6a96869a",
  fbPostId: "122118104811500702",
  permalink: "https://www.facebook.com/61595021080265/posts/122118104811500702/",
  igRecordId: "post_ext_b10078462e",
  igPostId: "17956773894039696",
  igPermalink: "https://www.instagram.com/p/DfkfvyEvx3b/",
  ttRecordId: "post_ext_19fdfb7f26",
  ttPostId: "7706791793546906901",
  ttPermalink: "https://www.tiktok.com/@glennbot.automation/photo/7706791793546906901",
  blockedSyntheticCommentIds: ["1175872974773981_1794243091445"],
  blockedSyntheticCommentTexts: [
    "may gusto ako itanong pwede ba?",
    "@glenn tasico thank you so much for the kind words! i really appreciate your support, and i'm thrilled to hear you're enjoying glennbot automations. let me know if you ever need anything!",
  ],
  blockedSyntheticCommentSubstrings: [
    "@glenn tasico thank you so much for the kind words!",
  ],
  commentId: "122118104811500702_1150007564513023",
  igCommentId: "18198560143393683",
  ttCommentId: "7706797468532458260",
  postPlatformId: "61595021080265_122118104811500702",
  savvyFindsAccountId: "6ada535d4c608095288e2104",
  glennBotAuthorId: "61595021080265",
  glennBotAuthorName: "GlennBot Automations",
  popupUrl:
    "/glennbot-popout?popout_mode=comment_thread&record_id=post_ext_dc6a96869a&comment_id=122118104811500702_1150007564513023",
  get upstreamUrl() {
    return `${getGlennBotBaseUrl() || GLENNBOT_LIVE_ORIGIN}/?popout_mode=comment_thread&record_id=post_ext_dc6a96869a&comment_id=122118104811500702_1150007564513023`;
  },
  popupWindowName: "GlennBotCommentThread_FB",
  igPopupUrl:
    "/glennbot-popout?popout_mode=comment_thread&record_id=post_ext_b10078462e&comment_id=18198560143393683",
  get igUpstreamUrl() {
    return `${getGlennBotBaseUrl() || GLENNBOT_LIVE_ORIGIN}/?popout_mode=comment_thread&record_id=post_ext_b10078462e&comment_id=18198560143393683`;
  },
  igPopupWindowName: "GlennBotCommentThread_IG",
  ttPopupUrl:
    "/glennbot-popout?popout_mode=comment_thread&record_id=post_ext_19fdfb7f26&comment_id=7706797468532458260",
  get ttUpstreamUrl() {
    return `${getGlennBotBaseUrl() || GLENNBOT_LIVE_ORIGIN}/?popout_mode=comment_thread&record_id=post_ext_19fdfb7f26&comment_id=7706797468532458260`;
  },
  ttPopupWindowName: "GlennBotCommentThread_TT",
  footerButtons: ["💬 Post a Comment", "✉️ Send a DM", "📧 Send an Email"],
};

export function buildSavvyFindsRoleReversalWebhookPayload(text = "", timestampMs = Date.now()) {
  const cleanText = String(text || "").trim();
  const simCid = `122118104811500702_${Math.trunc(Number(timestampMs) || Date.now())}`;
  return {
    event: "comment.received",
    platform: "facebook",
    accountId: SYS02_SAVVY_FINDS_COMMENT_DEMO.savvyFindsAccountId,
    accountName: "GlennBot Automations",
    comment: {
      id: simCid,
      postId: SYS02_SAVVY_FINDS_COMMENT_DEMO.recordId,
      platformPostId: SYS02_SAVVY_FINDS_COMMENT_DEMO.postPlatformId,
      text: cleanText,
      author: {
        id: SYS02_SAVVY_FINDS_COMMENT_DEMO.glennBotAuthorId,
        name: SYS02_SAVVY_FINDS_COMMENT_DEMO.glennBotAuthorName,
        username: SYS02_SAVVY_FINDS_COMMENT_DEMO.glennBotAuthorName,
        isOwner: false,
      },
      isOwnAccount: false,
      isOwner: false,
      parentId: SYS02_SAVVY_FINDS_COMMENT_DEMO.commentId,
    },
    post: {
      id: SYS02_SAVVY_FINDS_COMMENT_DEMO.recordId,
      platformPostId: SYS02_SAVVY_FINDS_COMMENT_DEMO.postPlatformId,
      accountId: SYS02_SAVVY_FINDS_COMMENT_DEMO.savvyFindsAccountId,
    },
  };
}

function isSyntheticBlockedEntry(obj) {
  if (!obj || typeof obj !== "object") return false;
  const cid = String(obj.comment_id || obj.id || "").trim();
  if (SYS02_SAVVY_FINDS_COMMENT_DEMO.blockedSyntheticCommentIds.includes(cid)) return true;
  const msg = String(obj.message || obj.comment_text || obj.text || "")
    .trim()
    .toLowerCase();
  if (SYS02_SAVVY_FINDS_COMMENT_DEMO.blockedSyntheticCommentTexts.includes(msg)) return true;
  if (
    SYS02_SAVVY_FINDS_COMMENT_DEMO.blockedSyntheticCommentSubstrings.some((sub) =>
      msg.includes(sub)
    )
  ) {
    return true;
  }
  return false;
}

function matchShowcaseConfigForComment(item) {
  if (!item || typeof item !== "object") return null;
  const recId = String(item.record_id || item.post_id || "").trim();
  if (SYS02_SHOWCASE_POSTS[recId]) return SYS02_SHOWCASE_POSTS[recId];
  const idFields = [
    String(item.comment_id || item.id || ""),
    String(item.external_post_id || ""),
    String(item.zernio_post_id || ""),
    String(item.post_permalink || ""),
    String(item.comment_permalink || ""),
  ];
  if (
    idFields.some(
      (f) =>
        f.includes("122118104811500702") ||
        f.includes("61595021080265") ||
        f.includes("1340688402467466_122118104811500702")
    )
  ) {
    return SYS02_SHOWCASE_POSTS.post_ext_dc6a96869a;
  }
  if (
    idFields.some(
      (f) => f.includes("17956773894039696") || f.includes("DfkfvyEvx3b") || f.includes("18198560143393683")
    )
  ) {
    return SYS02_SHOWCASE_POSTS.post_ext_b10078462e;
  }
  if (
    idFields.some(
      (f) => f.includes("7706791793546906901") || f.includes("7706797468532458260")
    )
  ) {
    return SYS02_SHOWCASE_POSTS.post_ext_19fdfb7f26;
  }
  return null;
}

export function filterPortfolioCommentsList(comments = []) {
  if (!Array.isArray(comments)) return [];
  const whitelistedTokens = new Set([
    "glennbot automations",
    "glennardtasico",
    "glennbot.automation",
    "glennard.tasico.va",
  ]);
  const kept = [];
  for (const item of comments) {
    if (!item || typeof item !== "object") continue;
    if (isSyntheticBlockedEntry(item)) continue;
    const cleanedReplies = Array.isArray(item.replies)
      ? item.replies.filter((r) => !isSyntheticBlockedEntry(r))
      : undefined;

    const showcaseCfg = matchShowcaseConfigForComment(item);
    if (showcaseCfg) {
      const normalized = {
        ...item,
        record_id: showcaseCfg.record_id,
        platform: showcaseCfg.platform,
        account_name: showcaseCfg.account_name,
        post_type: showcaseCfg.post_type,
        external_post_id: showcaseCfg.external_post_id,
        post_permalink: showcaseCfg.permalink_url,
        comment_permalink: showcaseCfg.permalink_url,
        post_caption: showcaseCfg.caption,
        caption: showcaseCfg.caption,
        can_reply: true,
      };
      if (cleanedReplies !== undefined) normalized.replies = cleanedReplies;
      kept.push(normalized);
      continue;
    }

    const acctLower = String(item.account_name || item.username || "")
      .trim()
      .replace(/^@+/, "")
      .toLowerCase();
    if (whitelistedTokens.has(acctLower)) {
      const copy = { ...item };
      if (cleanedReplies !== undefined) copy.replies = cleanedReplies;
      kept.push(copy);
    }
  }
  return kept;
}

export const SYS02_EMAIL_CHATBOT_CONFIG = {
  modalId: "gb-email-direct-modal",
  targetEmail: "glennard.tasico.va@gmail.com",
  headerBadge: "LIVE AI EMAIL AUTO-RESPONDER • GEMINI + GOOGLE DRIVE EXCEL SYNC",
  title: "📧 Test My Live AI Email Chatbot",
  copyBtnText: "📋 Copy Email",
  copiedBtnText: "✅ Copied glennard.tasico.va@gmail.com!",
  promptChips: [
    {
      label: "🤖 Ask about AI & n8n Automations",
      subject: "Inquiry: AI & n8n Automation Workflows",
      body: "Hi Glennard! Can you build custom webhooks, n8n workflows, and AI chatbots for my business?",
    },
    {
      label: "💼 Ask about VA Rates & Availability",
      subject: "Inquiry: Virtual Assistant Services & Availability",
      body: "Hi Glennard! What Virtual Assistant services do you offer and what is your current availability?",
    },
    {
      label: "🌐 Ask about Web Apps & Dashboards",
      subject: "Inquiry: Custom Web App & CRM Dashboard",
      body: "Hi Glennard! Tell me more about your GlennBot Automations dashboard and custom web app projects.",
    },
  ],
};

export function buildGmailComposeUrl(
  subject = SYS02_EMAIL_CHATBOT_CONFIG.promptChips[0].subject,
  body = SYS02_EMAIL_CHATBOT_CONFIG.promptChips[0].body,
  toEmail = SYS02_EMAIL_CHATBOT_CONFIG.targetEmail
) {
  const cleanTo = String(toEmail || SYS02_EMAIL_CHATBOT_CONFIG.targetEmail).trim();
  const cleanSubject =
    String(subject || "").trim() || SYS02_EMAIL_CHATBOT_CONFIG.promptChips[0].subject;
  const cleanBody =
    String(body || "").trim() || SYS02_EMAIL_CHATBOT_CONFIG.promptChips[0].body;
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    cleanTo
  )}&su=${encodeURIComponent(cleanSubject)}&body=${encodeURIComponent(cleanBody)}`;
}

export function buildGlennBotMailtoUrl(
  subject = SYS02_EMAIL_CHATBOT_CONFIG.promptChips[0].subject,
  body = SYS02_EMAIL_CHATBOT_CONFIG.promptChips[0].body,
  toEmail = SYS02_EMAIL_CHATBOT_CONFIG.targetEmail
) {
  const cleanTo = String(toEmail || SYS02_EMAIL_CHATBOT_CONFIG.targetEmail).trim();
  const cleanSubject =
    String(subject || "").trim() || SYS02_EMAIL_CHATBOT_CONFIG.promptChips[0].subject;
  const cleanBody =
    String(body || "").trim() || SYS02_EMAIL_CHATBOT_CONFIG.promptChips[0].body;
  return `mailto:${cleanTo}?subject=${encodeURIComponent(
    cleanSubject
  )}&body=${encodeURIComponent(cleanBody)}`;
}

export function filterPortfolioEmailAccounts(rawPayload = {}) {
  const src = rawPayload && typeof rawPayload === "object" ? rawPayload : {};
  const list = Array.isArray(src.accounts) ? src.accounts : [];
  const targetEmail = SYS02_EMAIL_CHATBOT_CONFIG.targetEmail.toLowerCase();
  const matched = list.find((item) => {
    if (!item || typeof item !== "object") return false;
    const addr = String(
      item.email_address || item.email || item.username || item.name || ""
    )
      .trim()
      .toLowerCase();
    return addr === targetEmail;
  });

  const normalized = matched
    ? {
        ...matched,
        id: String(matched.id || matched.account_id || "gmail_glennard_tasico_va"),
        account_id: String(matched.account_id || matched.id || "gmail_glennard_tasico_va"),
        platform: "gmail",
        provider: "gmail",
        email_address: targetEmail,
        email: targetEmail,
        status: "connected",
        connected: true,
      }
    : {
        id: "gmail_glennard_tasico_va",
        account_id: "gmail_glennard_tasico_va",
        platform: "gmail",
        provider: "gmail",
        email_address: targetEmail,
        email: targetEmail,
        name: targetEmail,
        display_name: "glennard.tasico.va@gmail.com (Gmail)",
        status: "connected",
        connected: true,
      };

  return {
    ...src,
    status: "success",
    accounts: [normalized],
    active_account_id: normalized.id,
    total_connected: 1,
  };
}

export function enforceEmailSentFolderUrl(rawUrl = "/api/email/messages") {
  const str = String(rawUrl || "/api/email/messages").trim();
  if (!str.includes("/api/email/messages")) return str;
  const parsed = new URL(str, "http://localhost:3000");
  parsed.searchParams.set("folder", "sent");
  const accId = parsed.searchParams.get("account_id");
  if (accId === "" || accId === "gmail_glennard_tasico_va") {
    parsed.searchParams.delete("account_id");
  }
  parsed.searchParams.delete("email_address");
  parsed.searchParams.delete("platform");
  return `${parsed.pathname}${parsed.search}`;
}

export const SYS02_PROJECT_SPEC = {
  sysId: "SYS-02",
  title: "Unified Omnichannel Inbox & Smart Auto-Responder",
  endpoint:
    "POST /webhooks • POST /api/v1/ai/ask • /api/v1/comments/reply • /api/v1/messages/send • /api/email/messages",
  sourceFile:
    "routers/ai_routes.py • routers/webhooks_routes.py • routers/internal_api_routes.py • routers/email_accounts_routes.py",
  stackPills: [
    "FastAPI",
    "Gemini 3.5 Flash",
    "n8n Webhooks",
    "Zernio API",
    "Composio Gmail OAuth",
    "Google Drive Excel Sync",
  ],
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
  metrics: [
    { value: "24/7 Live", label: "Zero Missed Inquiries" },
    { value: "3 Live Channels", label: "Comments • DMs • Gmail" },
    { value: "100% Automated", label: "Zernio • Composio • GDrive Excel" },
  ],
  channelOptions: [
    "💬 Post a Comment (Facebook / Instagram / TikTok Showcase Posts)",
    "✉️ Send a DM (Facebook Messenger / Instagram DM / WhatsApp / Mock Chat)",
    "📧 Send an Email (Live AI Email Chatbot — glennard.tasico.va@gmail.com)",
  ],
  channelPresets: {
    "💬 Post a Comment (Facebook / Instagram / TikTok Showcase Posts)": {
      channelKey: "social_comment",
      sender: "@client_lead_ph (Facebook / Instagram / TikTok Post)",
      message:
        "Hi Glennard! Can you build custom webhooks, n8n workflows, and AI chatbots for my business?",
      event: "comment.received",
      n8n_workflow: "GlennBot Comment Auto-Responder",
      dispatched_via: "POST /api/v1/comments/reply",
    },
    "✉️ Send a DM (Facebook Messenger / Instagram DM / WhatsApp / Mock Chat)": {
      channelKey: "social_dm",
      sender: "@portfolio_client_dm (Messenger / IG DM / WhatsApp +63 917 549 7760)",
      message:
        "Hi Glennard! What Virtual Assistant & AI Automation services do you offer and what is your current availability?",
      event: "message.received",
      n8n_workflow: "GlennBot Omnichannel DM Auto-Responder",
      dispatched_via: "POST /api/v1/messages/send",
    },
    "📧 Send an Email (Live AI Email Chatbot — glennard.tasico.va@gmail.com)": {
      channelKey: "email_oauth",
      sender: "client@enterprise-ops.io -> glennard.tasico.va@gmail.com",
      message:
        "Hi Glennard! Tell me more about your GlennBot Automations dashboard and custom web app projects.",
      composio_tool: "GMAIL_SEND_EMAIL",
      authenticated_sender: "glennard.tasico.va@gmail.com",
      verified_in_folder: "Sent (/api/email/messages?folder=sent)",
      dispatched_via: "GMAIL_SEND_EMAIL (Composio Gmail OAuth • GET /api/email/messages?folder=sent)",
    },
  },
  footerButtons: ["💬 Post a Comment", "✉️ Send a DM", "📧 Send an Email"],
};

export function resolveSys02ChannelPreset(channelLabel = "") {
  const raw = String(channelLabel || "").trim();
  if (SYS02_PROJECT_SPEC.channelPresets[raw]) {
    return SYS02_PROJECT_SPEC.channelPresets[raw];
  }
  const lower = raw.toLowerCase();
  if (lower.includes("comment") || lower.includes("tiktok") || lower.includes("showcase")) {
    return SYS02_PROJECT_SPEC.channelPresets[
      "💬 Post a Comment (Facebook / Instagram / TikTok Showcase Posts)"
    ];
  }
  if (lower.includes("email") || lower.includes("gmail") || lower.includes("composio")) {
    return SYS02_PROJECT_SPEC.channelPresets[
      "📧 Send an Email (Live AI Email Chatbot — glennard.tasico.va@gmail.com)"
    ];
  }
  return SYS02_PROJECT_SPEC.channelPresets[
    "✉️ Send a DM (Facebook Messenger / Instagram DM / WhatsApp / Mock Chat)"
  ];
}

export const CLIENT_CONTACTS_CACHE_KEY = "gb_portfolio_client_contacts_v1";

export const SYS03_IMPORT_CONTACTS_CONFIG = {
  modalId: "gb-sys03-import-contacts-modal",
  title: "Import Contacts — Client Sandbox",
  privacyBadge:
    "🔒 Data Privacy Protected: Imported contacts are stored ONLY in your browser cache (localStorage) for this live demo and are never saved to GlennBot's database or Cloudinary.",
  cacheKey: CLIENT_CONTACTS_CACHE_KEY,
  popupUrl:
    "/glennbot-popout?popout_mode=workspace_view&tab=contacts&client_cache_only=1",
  popupWindowName: "GlennBotClientContactsPopup",
  popupWidth: 1260,
  popupHeight: 860,
  contactsViewBadgeText: "🔒 Saved in Your Browser Cache Only (Client Demo)",
  options: [
    {
      id: "gb-sys03-import-google-btn",
      title: "Import Google Contacts",
      subtitle:
        "Authenticate via Google OAuth 2.0 to preview your contacts in an isolated browser-cache session",
      action: "startSys03GoogleContactsImport()",
    },
    {
      id: "gb-sys03-import-apollo-csv-btn",
      title: "Import via Apollo CSV",
      subtitle:
        "Upload an Apollo.io .csv export — auto-extracts First Name, Last Name, Col E Company, Col F Email Address & Col T Contact Number",
      action: "triggerSys03ApolloCsvPicker()",
    },
  ],
};

export function buildSampleApolloCsvContent() {
  // 20-column (Col A = index 0 ... Col E = index 4 Company, Col F = index 5 Email, ... Col T = index 19 Contact Number)
  const headers = [
    "First Name", // Col A (0)
    "Last Name", // Col B (1)
    "Title", // Col C (2)
    "Seniority", // Col D (3)
    "Company", // Col E (4)
    "Email", // Col F (5)
    "Email Status", // Col G (6)
    "Stage", // Col H (7)
    "Lists", // Col I (8)
    "Industry", // Col J (9)
    "Employees", // Col K (10)
    "Person Linkedin Url", // Col L (11)
    "Website", // Col M (12)
    "City", // Col N (13)
    "State", // Col O (14)
    "Country", // Col P (15)
    "Company Address", // Col Q (16)
    "Company City", // Col R (17)
    "Company Country", // Col S (18)
    "Work Direct Phone", // Col T (19)
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

export function parseCsvRows(csvText = "") {
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

export function parseApolloCsvToClientContacts(
  csvText = "",
  nowIso = new Date().toISOString()
) {
  const rows = parseCsvRows(csvText);
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
    headerRow[4] && (headerRow[4].includes("company") || headerRow[4].includes("organization"))
      ? 4
      : findColIdx(["company", "company name", "company_name", "organization", "account name"], 4);
  // Column F (index 5) is Email Address in Apollo exports
  const emailIdx =
    headerRow[5] && headerRow[5].includes("email")
      ? 5
      : findColIdx(["email", "email address", "work email", "primary email"], 5);
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

export function mergeClientContactsCache(existingContacts = [], incomingContacts = []) {
  const safeExisting = Array.isArray(existingContacts) ? existingContacts : [];
  const safeIncoming = Array.isArray(incomingContacts) ? incomingContacts : [];
  const byKey = new Map();
  const order = [];

  const computeKey = (c, idx) => {
    const email = String(c.email || c.email_address || "").trim().toLowerCase();
    if (email) return `email:${email}`;
    const phone = String(c.phone || c.contact_number || "").replace(/\s+/g, "");
    if (phone) return `phone:${phone}`;
    const nameComp = `${String(c.name || c.full_name || "").trim().toLowerCase()}|${String(c.company || c.company_name || "").trim().toLowerCase()}`;
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
    const id = String(raw.id || raw.contact_id || `client_contact_${Date.now()}_${idx}`);
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

