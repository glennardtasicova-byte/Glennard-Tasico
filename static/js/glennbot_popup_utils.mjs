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

export function buildInstantPopoutStyleTag(targetTab = "scheduler") {
  const cleanTab = String(targetTab || "scheduler").trim().toLowerCase() || "scheduler";
  const nonSchedulerBlock =
    cleanTab !== "scheduler"
      ? `  /* If target tab is NOT scheduler, hide #view-scheduler immediately until JS switchTab runs */\n  #view-scheduler:not(.gb-tab-ready) {\n    display: none !important;\n  }\n`
      : "";
  return [
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
    `  /* Immediately show the Expanded Focus Window top bar */`,
    `  #gb-popout-window-bar {`,
    `    display: flex !important;`,
    `  }`,
    nonSchedulerBlock + `  #view-${cleanTab} {\n    display: flex !important;\n  }`,
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

export const SYS02_SAVVY_FINDS_COMMENT_DEMO = {
  recordId: "post_acc452fff96b",
  fbPostId: "1175872974773981",
  permalink: "https://www.facebook.com/211715025549935/posts/1175872974773981",
  blockedSyntheticCommentIds: ["1175872974773981_1794243091445"],
  blockedSyntheticCommentTexts: ["may gusto ako itanong pwede ba?"],
  commentId: "1175872974773981_1646688186953267",
  postPlatformId: "211715025549935_1175872974773981",
  savvyFindsAccountId: "6ada535d4c608095288e2104",
  glennBotAuthorId: "1340688402467466",
  glennBotAuthorName: "GlennBot Automations",
  popupUrl:
    "/glennbot-popout?popout_mode=comment_thread&record_id=post_acc452fff96b&comment_id=1175872974773981_1646688186953267",
  popupWindowName: "GlennBotCommentThread_SavvyFinds",
  footerButtons: ["💬 Post a Comment", "✉️ Send a DM", "📧 Send an Email"],
};

export function buildSavvyFindsRoleReversalWebhookPayload(text = "", timestampMs = Date.now()) {
  const cleanText = String(text || "").trim();
  const simCid = `1175872974773981_${Math.trunc(Number(timestampMs) || Date.now())}`;
  return {
    event: "comment.received",
    platform: "facebook",
    accountId: SYS02_SAVVY_FINDS_COMMENT_DEMO.savvyFindsAccountId,
    accountName: "Savvy Finds",
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
    const recId = String(item.record_id || item.post_id || "").trim();
    const idFields = [
      String(item.comment_id || item.id || ""),
      String(item.external_post_id || ""),
      String(item.zernio_post_id || ""),
      String(item.post_permalink || ""),
      String(item.comment_permalink || ""),
    ];
    const hasTargetPostId = idFields.some((f) => f.includes(SYS02_SAVVY_FINDS_COMMENT_DEMO.fbPostId));
    const acctLower = String(item.account_name || item.username || "")
      .trim()
      .replace(/^@+/, "")
      .toLowerCase();
    const isSavvyNoConflict =
      acctLower === "savvy finds" && !idFields.slice(0, 3).some((f) => f.trim().length > 0);

    const cleanedReplies = Array.isArray(item.replies)
      ? item.replies.filter((r) => !isSyntheticBlockedEntry(r))
      : undefined;

    if (
      recId === SYS02_SAVVY_FINDS_COMMENT_DEMO.recordId ||
      hasTargetPostId ||
      isSavvyNoConflict
    ) {
      const normalized = {
        ...item,
        record_id: SYS02_SAVVY_FINDS_COMMENT_DEMO.recordId,
        post_permalink: SYS02_SAVVY_FINDS_COMMENT_DEMO.permalink,
        comment_permalink: SYS02_SAVVY_FINDS_COMMENT_DEMO.permalink,
        can_reply: true,
      };
      if (cleanedReplies !== undefined) normalized.replies = cleanedReplies;
      kept.push(normalized);
      continue;
    }

    if (whitelistedTokens.has(acctLower)) {
      const copy = { ...item };
      if (cleanedReplies !== undefined) copy.replies = cleanedReplies;
      kept.push(copy);
    }
  }
  return kept;
}


