export const GLENNBOT_LIVE_ORIGIN = "https://glennbotautomations.onrender.com";
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
    upstreamUrl: "https://glennbotautomations.onrender.com/?popout_mode=workspace_view&tab=scheduler",
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
    upstreamUrl: "https://glennbotautomations.onrender.com/?popout_mode=workspace_view&tab=queue",
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
    upstreamUrl: "https://glennbotautomations.onrender.com/?popout_mode=workspace_view&tab=calendar",
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
  return [
    `<style id="gb-portfolio-cal-lock">`,
    `  #cal-subtab-composio,`,
    `  #calendar-composio-toolbar,`,
    `  #schedule-meeting-modal {`,
    `    display: none !important;`,
    `  }`,
    composerHideCss,
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
  endpoint: "POST /api/ai/ask • POST /api/schedule • GET & DELETE /api/scheduled",
  tagline: "Context-Aware Gemini 3.5 Flash Caption Engine + Multi-Platform APScheduler Queue",
  stackPills: [
    "FastAPI",
    "Gemini 3.5 Flash",
    "Zernio API",
    "PostgreSQL",
    "Cloudinary & GDrive",
    "APScheduler",
  ],
  sourceFile: "routers/scheduler_routes.py & routers/ai_routes.py",
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
    upstream_url:
      "https://glennbotautomations.onrender.com/?popout_mode=comment_thread&record_id=post_ext_dc6a96869a&comment_id=122118104811500702_1150007564513023",
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
    upstream_url:
      "https://glennbotautomations.onrender.com/?popout_mode=comment_thread&record_id=post_ext_b10078462e&comment_id=18198560143393683",
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
    upstream_url:
      "https://glennbotautomations.onrender.com/?popout_mode=comment_thread&record_id=post_ext_19fdfb7f26&comment_id=7706797468532458260",
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
  blockedSyntheticCommentTexts: ["may gusto ako itanong pwede ba?"],
  commentId: "122118104811500702_1150007564513023",
  igCommentId: "18198560143393683",
  ttCommentId: "7706797468532458260",
  postPlatformId: "61595021080265_122118104811500702",
  savvyFindsAccountId: "6ada535d4c608095288e2104",
  glennBotAuthorId: "61595021080265",
  glennBotAuthorName: "GlennBot Automations",
  popupUrl:
    "/glennbot-popout?popout_mode=comment_thread&record_id=post_ext_dc6a96869a&comment_id=122118104811500702_1150007564513023",
  upstreamUrl:
    "https://glennbotautomations.onrender.com/?popout_mode=comment_thread&record_id=post_ext_dc6a96869a&comment_id=122118104811500702_1150007564513023",
  popupWindowName: "GlennBotCommentThread_FB",
  igPopupUrl:
    "/glennbot-popout?popout_mode=comment_thread&record_id=post_ext_b10078462e&comment_id=18198560143393683",
  igUpstreamUrl:
    "https://glennbotautomations.onrender.com/?popout_mode=comment_thread&record_id=post_ext_b10078462e&comment_id=18198560143393683",
  igPopupWindowName: "GlennBotCommentThread_IG",
  ttPopupUrl:
    "/glennbot-popout?popout_mode=comment_thread&record_id=post_ext_19fdfb7f26&comment_id=7706797468532458260",
  ttUpstreamUrl:
    "https://glennbotautomations.onrender.com/?popout_mode=comment_thread&record_id=post_ext_19fdfb7f26&comment_id=7706797468532458260",
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


