import test from "node:test";
import assert from "node:assert/strict";
import {
  SYS01_EXPANDED_VIEWS,
  SYS01_PROJECT_SPEC,
  SYS02_SAVVY_FINDS_COMMENT_DEMO,
  SYS02_DM_SHOWCASE_CONFIG,
  SYS02_EMAIL_CHATBOT_CONFIG,
  buildCommentSplitWorkspaceConfig,
  buildDmSplitWorkspaceConfig,
  buildGlennBotExpandedUrl,
  buildGlennBotMailtoUrl,
  buildGmailComposeUrl,
  buildInstantPopoutStyleTag,
  buildPortfolioLiveDmPayload,
  buildSavvyFindsRoleReversalWebhookPayload,
  buildShowcaseCommentLoadingCardHtml,
  computeCenteredPopupFeatures,
  computeMaximizedDirectMessengerFeatures,
  computeRightDockedPopupFeatures,
  enforceEmailSentFolderUrl,
  filterPortfolioCommentsList,
  filterPortfolioEmailAccounts,
  filterPortfolioSocialAccounts,
  formatInlineMarkdown,
  generateLiveDmSessionIds,
  resolveCalendarProxyIntercept,
  resolveDirectSocialDmTargetUrl,
} from "../static/js/glennbot_popup_utils.mjs";

test("SYS-01 defines the 3 auto-authenticated /glennbot-popout Expanded View URLs and upstream URLs", () => {
  assert.equal(
    SYS01_EXPANDED_VIEWS.scheduler.baseUrl,
    "/glennbot-popout?popout_mode=workspace_view&tab=scheduler"
  );
  assert.equal(
    SYS01_EXPANDED_VIEWS.queue.baseUrl,
    "/glennbot-popout?popout_mode=workspace_view&tab=queue"
  );
  assert.equal(
    SYS01_EXPANDED_VIEWS.calendar.baseUrl,
    "/glennbot-popout?popout_mode=workspace_view&tab=calendar"
  );
  assert.equal(
    SYS01_EXPANDED_VIEWS.scheduler.upstreamUrl,
    "https://glennbotautomations.onrender.com/?popout_mode=workspace_view&tab=scheduler"
  );
});

test("buildGlennBotExpandedUrl formats /glennbot-popout workspace_view URLs with and without timestamp", () => {
  assert.equal(
    buildGlennBotExpandedUrl("scheduler", "workspace_view"),
    "/glennbot-popout?popout_mode=workspace_view&tab=scheduler"
  );
  assert.equal(
    buildGlennBotExpandedUrl("queue", "workspace_view", 1700000000000),
    "/glennbot-popout?popout_mode=workspace_view&tab=queue&_ts=1700000000000"
  );
  assert.equal(
    buildGlennBotExpandedUrl("calendar", "workspace_view", 1700000000000),
    "/glennbot-popout?popout_mode=workspace_view&tab=calendar&_ts=1700000000000"
  );
});

test("computeCenteredPopupFeatures centers popup window within available screen bounds", () => {
  const res = computeCenteredPopupFeatures(1240, 860, 1920, 1080);
  assert.equal(res.w, 1240);
  assert.equal(res.h, 860);
  assert.equal(res.left, 340);
  assert.equal(res.top, 110);
  assert.ok(res.features.includes("width=1240,height=860,left=340,top=110"));
});

test("buildInstantPopoutStyleTag hides homepage chrome, hides Composio calendar UI, hides bottom reply composer, and toggles #view-scheduler", () => {
  const queueCss = buildInstantPopoutStyleTag("queue");
  assert.ok(queueCss.includes('<style id="gb-portfolio-cal-lock">'));
  assert.ok(queueCss.includes('<style id="gb-instant-popout-css">'));
  assert.ok(queueCss.includes("#main-dashboard-header"));
  assert.ok(queueCss.includes("#left-nav-sidebar"));
  assert.ok(queueCss.includes("#cal-subtab-composio"));
  assert.ok(queueCss.includes("#calendar-composio-toolbar"));
  assert.ok(queueCss.includes("#schedule-meeting-modal"));
  assert.ok(queueCss.includes("#view-scheduler > div:first-child > div:nth-child(2)"));
  assert.ok(queueCss.includes("#connect-accounts-modal"));
  assert.ok(queueCss.includes("#comment-detail-panel > div > div.bg-slate-900\\/90.rounded-xl.p-3"));
  assert.ok(queueCss.includes("#reply-target-label"));
  assert.ok(queueCss.includes("#comment-reply-input"));
  assert.ok(queueCss.includes("#btn-send-reply"));
  assert.ok(queueCss.includes('button[onclick*="insertQuickReply("]'));
  assert.ok(queueCss.includes("#gb-popout-window-bar"));
  assert.ok(queueCss.includes("#view-scheduler:not(.gb-tab-ready)"));
  assert.ok(queueCss.includes("#view-queue"));

  const schedCss = buildInstantPopoutStyleTag("scheduler");
  assert.ok(!schedCss.includes("#view-scheduler:not(.gb-tab-ready)"));
  assert.ok(schedCss.includes("#view-scheduler {"));

  const commentThreadCss = buildInstantPopoutStyleTag("comments", "comment_thread");
  assert.ok(commentThreadCss.includes("#gb-popout-window-bar button"));
  assert.ok(commentThreadCss.includes("#gb-popout-window-bar a"));
  assert.ok(commentThreadCss.includes("#gb-btn-open-actual-fb-post"));
  assert.ok(commentThreadCss.includes("#gb-btn-manual-sync-now"));
});

test("filterPortfolioSocialAccounts keeps only the 4 whitelisted portfolio accounts and normalizes names", () => {
  const upstreamMock = {
    facebook: [
      { id: "fb_other", name: "Sket Dance", avatar: "", db_id: "facebook_fb_other" },
      { id: "6af0b109818eb5c88d1e87a6", name: "GlennBot Automations", avatar: "fb.png", db_id: "facebook_6af0b109818eb5c88d1e87a6" },
    ],
    instagram: [
      { id: "ig_other", name: "Glennard Roa Tasico", username: "glenntasico" },
      { id: "6ad9e9b2e5d470e468e58d87", name: "GlennBot Automations", username: "glennard.tasico.va", avatar: "ig.png" },
    ],
    tiktok: [
      { id: "6ad9e897085e3e64e595fe65", name: "glennbot.automation", username: "glennbot.automation", avatar: "tt.png" },
    ],
    youtube: [
      { id: "yt_other", name: "Mold Group", username: "moldgroup-k9p" },
      { id: "6af17412c05e9c3bed5f068f", name: "Glennard Tasico", username: "glennardtasico", avatar: "yt.png" },
    ],
    whatsapp: [{ id: "wa_1", name: "WA" }],
    telegram: [{ id: "tg_1", name: "TG" }],
  };

  const filtered = filterPortfolioSocialAccounts(upstreamMock);
  assert.equal(filtered.total_connected, 4);
  assert.equal(filtered.facebook.length, 1);
  assert.equal(filtered.facebook[0].name, "GlennBot Automations");
  assert.equal(filtered.facebook[0].id, "6af0b109818eb5c88d1e87a6");
  assert.equal(filtered.youtube.length, 1);
  assert.equal(filtered.youtube[0].name, "glennardtasico");
  assert.equal(filtered.youtube[0].username, "glennardtasico");
  assert.equal(filtered.tiktok.length, 1);
  assert.equal(filtered.tiktok[0].name, "@glennbot.automation");
  assert.equal(filtered.tiktok[0].username, "glennbot.automation");
  assert.equal(filtered.instagram.length, 1);
  assert.equal(filtered.instagram[0].name, "@glennard.tasico.va");
  assert.equal(filtered.instagram[0].username, "glennard.tasico.va");
  assert.deepEqual(filtered.whatsapp, []);
  assert.deepEqual(filtered.telegram, []);
});

test("resolveCalendarProxyIntercept blocks calendar/meeting endpoints in Portfolio Demo Mode", () => {
  const accountsRes = resolveCalendarProxyIntercept("GET", "calendar/accounts");
  assert.equal(accountsRes?.statusCode, 200);
  assert.deepEqual(accountsRes?.body, { status: "success", accounts: [] });

  const eventsRes = resolveCalendarProxyIntercept("GET", "calendar/events");
  assert.equal(eventsRes?.statusCode, 200);
  assert.deepEqual(eventsRes?.body, { status: "success", events: [], accounts: [] });

  const v1EventsRes = resolveCalendarProxyIntercept("GET", "v1/calendar/events");
  assert.equal(v1EventsRes?.statusCode, 200);
  assert.deepEqual(v1EventsRes?.body, { status: "success", events: [], accounts: [] });

  const postScheduleRes = resolveCalendarProxyIntercept("POST", "v1/calendar/schedule");
  assert.equal(postScheduleRes?.statusCode, 403);
  assert.deepEqual(postScheduleRes?.body, {
    status: "error",
    message: "Calendars & Meetings are restricted in Portfolio Demo Mode.",
  });

  const oauthStartRes = resolveCalendarProxyIntercept("POST", "oauth/calendar/start");
  assert.equal(oauthStartRes?.statusCode, 403);
  assert.deepEqual(oauthStartRes?.body, {
    status: "error",
    message: "Calendars & Meetings are restricted in Portfolio Demo Mode.",
  });

  assert.equal(resolveCalendarProxyIntercept("GET", "social/accounts"), null);
});

test("SYS01_PROJECT_SPEC and formatInlineMarkdown match production GlennBot Automations architecture", () => {
  assert.equal(
    SYS01_PROJECT_SPEC.endpoint,
    "POST /api/ai/ask • POST /api/schedule • GET & DELETE /api/scheduled"
  );
  assert.equal(
    SYS01_PROJECT_SPEC.tagline,
    "Context-Aware Gemini 3.5 Flash Caption Engine + Multi-Platform APScheduler Queue"
  );
  assert.equal(
    SYS01_EXPANDED_VIEWS.calendar.title,
    "Social Media Content Calendar — Expanded View"
  );
  assert.equal(
    SYS01_EXPANDED_VIEWS.calendar.subtitle,
    "Visual Monthly Schedule of Queued & Published Omnichannel Social Posts"
  );
  assert.deepEqual(SYS01_PROJECT_SPEC.stackPills, [
    "FastAPI",
    "Gemini 3.5 Flash",
    "Zernio API",
    "PostgreSQL",
    "Cloudinary & GDrive",
    "APScheduler",
  ]);
  assert.equal(
    SYS01_PROJECT_SPEC.sourceFile,
    "routers/scheduler_routes.py & routers/ai_routes.py"
  );
  assert.deepEqual(SYS01_PROJECT_SPEC.footerButtons, [
    "📝 Create Post",
    "⏳ Queue",
    "📅 Calendar",
  ]);

  const formatted = formatInlineMarkdown(
    "**Create Post & AI Generation (`POST /api/ai/ask`)** — calls **Google Gemini 3.5 Flash** (`gemini-3.5-flash`)"
  );
  assert.equal(
    formatted,
    "<strong>Create Post &amp; AI Generation (<code>POST /api/ai/ask</code>)</strong> — calls <strong>Google Gemini 3.5 Flash</strong> (<code>gemini-3.5-flash</code>)"
  );
});

test("SYS-02 GlennBot Automations FB & IG comment thread whitelisting, Previous Post caption replacement, and 2-Column Split Workspace", () => {
  assert.equal(
    SYS02_SAVVY_FINDS_COMMENT_DEMO.popupUrl,
    "/glennbot-popout?popout_mode=comment_thread&record_id=post_ext_dc6a96869a&comment_id=122118104811500702_1150007564513023"
  );
  assert.equal(
    SYS02_SAVVY_FINDS_COMMENT_DEMO.upstreamUrl,
    "https://glennbotautomations.onrender.com/?popout_mode=comment_thread&record_id=post_ext_dc6a96869a&comment_id=122118104811500702_1150007564513023"
  );
  assert.equal(
    SYS02_SAVVY_FINDS_COMMENT_DEMO.permalink,
    "https://www.facebook.com/61595021080265/posts/122118104811500702/"
  );
  assert.equal(
    SYS02_SAVVY_FINDS_COMMENT_DEMO.popupWindowName,
    "GlennBotCommentThread_FB"
  );
  assert.equal(
    SYS02_SAVVY_FINDS_COMMENT_DEMO.igPopupUrl,
    "/glennbot-popout?popout_mode=comment_thread&record_id=post_ext_b10078462e&comment_id=18198560143393683"
  );
  assert.equal(
    SYS02_SAVVY_FINDS_COMMENT_DEMO.igUpstreamUrl,
    "https://glennbotautomations.onrender.com/?popout_mode=comment_thread&record_id=post_ext_b10078462e&comment_id=18198560143393683"
  );
  assert.equal(
    SYS02_SAVVY_FINDS_COMMENT_DEMO.igPermalink,
    "https://www.instagram.com/p/DfkfvyEvx3b/"
  );
  assert.equal(
    SYS02_SAVVY_FINDS_COMMENT_DEMO.igPopupWindowName,
    "GlennBotCommentThread_IG"
  );
  assert.equal(
    SYS02_SAVVY_FINDS_COMMENT_DEMO.ttPopupUrl,
    "/glennbot-popout?popout_mode=comment_thread&record_id=post_ext_19fdfb7f26&comment_id=7706797468532458260"
  );
  assert.equal(
    SYS02_SAVVY_FINDS_COMMENT_DEMO.ttUpstreamUrl,
    "https://glennbotautomations.onrender.com/?popout_mode=comment_thread&record_id=post_ext_19fdfb7f26&comment_id=7706797468532458260"
  );
  assert.equal(
    SYS02_SAVVY_FINDS_COMMENT_DEMO.ttPermalink,
    "https://www.tiktok.com/@glennbot.automation/photo/7706791793546906901"
  );
  assert.equal(
    SYS02_SAVVY_FINDS_COMMENT_DEMO.ttPopupWindowName,
    "GlennBotCommentThread_TT"
  );
  assert.deepEqual(SYS02_SAVVY_FINDS_COMMENT_DEMO.footerButtons, [
    "💬 Post a Comment",
    "✉️ Send a DM",
    "📧 Send an Email",
  ]);

  const fbSplit = buildCommentSplitWorkspaceConfig("facebook", 1710000000000);
  assert.equal(
    fbSplit.upstreamIframeUrl,
    "https://glennbotautomations.onrender.com/?popout_mode=comment_thread&record_id=post_ext_dc6a96869a&comment_id=122118104811500702_1150007564513023&_ts=1710000000000"
  );
  assert.equal(
    fbSplit.actualPostUrl,
    "https://www.facebook.com/61595021080265/posts/122118104811500702/"
  );
  assert.equal(fbSplit.badge_label, "GlennBot Automations — Facebook Page");
  assert.equal(fbSplit.primary_btn_label, "Open / Focus Actual Facebook Post Window");

  const igSplit = buildCommentSplitWorkspaceConfig("instagram", 1710000000000);
  assert.equal(
    igSplit.upstreamIframeUrl,
    "https://glennbotautomations.onrender.com/?popout_mode=comment_thread&record_id=post_ext_b10078462e&comment_id=18198560143393683&_ts=1710000000000"
  );
  assert.equal(igSplit.actualPostUrl, "https://www.instagram.com/p/DfkfvyEvx3b/");
  assert.equal(igSplit.badge_label, "GlennBot Automations — Instagram");
  assert.equal(igSplit.primary_btn_label, "Open / Focus Actual Instagram Post Window");

  const ttSplit = buildCommentSplitWorkspaceConfig("tiktok", 1710000000000);
  assert.equal(
    ttSplit.upstreamIframeUrl,
    "https://glennbotautomations.onrender.com/?popout_mode=comment_thread&record_id=post_ext_19fdfb7f26&comment_id=7706797468532458260&_ts=1710000000000"
  );
  assert.equal(
    ttSplit.actualPostUrl,
    "https://www.tiktok.com/@glennbot.automation/photo/7706791793546906901"
  );
  assert.equal(ttSplit.badge_label, "GlennBot Automations — TikTok (@glennbot.automation)");
  assert.equal(ttSplit.primary_btn_label, "Open / Focus Actual TikTok Post Window");

  const dockedFb = computeRightDockedPopupFeatures(1920, 1080, 0, 0, "facebook");
  assert.equal(dockedFb.popupWidth, 806);
  assert.equal(dockedFb.popupHeight, 929);
  assert.equal(dockedFb.popupLeft, 1920 - 806 - 20);
  assert.equal(dockedFb.popupTop, Math.round((1080 - 929) / 2));
  assert.ok(dockedFb.features.includes("width=806,height=929,left=1094,top=76"));

  // Instagram requires >= 736px viewport width (760px-820px outer window) so Instagram Web renders its 2-column side-by-side comment box while keeping >= 57% of the screen (~1,092px on 1920px) uncovered on the left for the Live GlennBot Dashboard
  const dockedIg1920 = computeRightDockedPopupFeatures(1920, 1080, 0, 0, "instagram");
  assert.equal(dockedIg1920.popupWidth, 820);
  assert.equal(dockedIg1920.popupHeight, 994);
  assert.equal(dockedIg1920.popupLeft, 1920 - 820 - 8);
  assert.ok(dockedIg1920.popupWidth >= 760 && dockedIg1920.popupWidth <= 820);

  for (const availW of [1280, 1366, 1440, 1536]) {
    const igLaptop = computeRightDockedPopupFeatures(availW, 860, 0, 0, "instagram");
    assert.ok(
      igLaptop.popupWidth >= 760 && igLaptop.popupWidth <= 800,
      `Expected Instagram popupWidth between 760 and 800 on ${availW}px screen, got ${igLaptop.popupWidth}`
    );
  }

  const filtered = filterPortfolioCommentsList([
    { record_id: "post_other", account_name: "Unlisted Page", can_reply: false },
    {
      record_id: "post_ext_b158973506",
      comment_id: "1175872974773981_1794243091445",
      account_name: "Unlisted Legacy Page",
      message: "may gusto ako itanong pwede ba?",
    },
    {
      record_id: "post_ext_legacy",
      comment_id: "122118104811500702_1150007564513023",
      external_post_id: "61595021080265_122118104811500702",
      post_permalink: "https://www.facebook.com/61595021080265/posts/122118104811500702/",
      post_caption: "Previous Post",
      account_name: "GlennBot Automations",
      can_reply: false,
      replies: [
        { id: "1175872974773981_1794243091445", message: "may gusto ako itanong pwede ba?" },
        {
          id: "122118104811500702_ghost",
          message:
            "@Glenn Tasico Thank you so much for the kind words! I really appreciate your support, and I'm thrilled to hear you're enjoying GlennBot Automations. Let me know if you ever need anything!",
        },
        { id: "122118104811500702_1024646813991583", message: "Loud and clear!" },
      ],
    },
    {
      record_id: "post_ext_b10078462e",
      comment_id: "18198560143393683",
      external_post_id: "17956773894039696",
      post_caption: "Previous Post",
      account_name: "@glennard.tasico.va",
      can_reply: false,
    },
    {
      record_id: "post_ext_19fdfb7f26",
      comment_id: "7706797468532458260",
      external_post_id: "7706791793546906901",
      post_caption: "Previous Post",
      account_name: "@glennbot.automation",
      can_reply: false,
    },
    { record_id: "post_gb_other", account_name: "GlennBot Automations", can_reply: true },
  ]);
  assert.equal(filtered.length, 4);
  assert.equal(filtered[0].record_id, "post_ext_dc6a96869a");
  assert.equal(filtered[0].platform, "facebook");
  assert.equal(filtered[0].post_type, "text");
  assert.equal(filtered[0].post_permalink, "https://www.facebook.com/61595021080265/posts/122118104811500702/");
  assert.ok(filtered[0].post_caption.startsWith("Hello future clients!"));
  assert.equal(filtered[0].can_reply, true);
  assert.equal(filtered[0].replies.length, 1);
  assert.equal(filtered[0].replies[0].id, "122118104811500702_1024646813991583");

  assert.equal(filtered[1].record_id, "post_ext_b10078462e");
  assert.equal(filtered[1].platform, "instagram");
  assert.equal(filtered[1].account_name, "GlennBot Automations");
  assert.equal(filtered[1].post_type, "image");
  assert.equal(filtered[1].post_permalink, "https://www.instagram.com/p/DfkfvyEvx3b/");
  assert.ok(filtered[1].post_caption.startsWith("Hello future clients!"));

  assert.equal(filtered[2].record_id, "post_ext_19fdfb7f26");
  assert.equal(filtered[2].platform, "tiktok");
  assert.equal(filtered[2].account_name, "@glennbot.automation");
  assert.equal(filtered[2].post_type, "image");
  assert.equal(filtered[2].post_permalink, "https://www.tiktok.com/@glennbot.automation/photo/7706791793546906901");
  assert.ok(filtered[2].post_caption.startsWith("Hello future clients!"));

  const emptyWhenAllTargetDeleted = filterPortfolioCommentsList([
    { record_id: "post_other", account_name: "Unlisted Page", can_reply: false },
    {
      record_id: "post_ext_b158973506",
      comment_id: "1175872974773981_1794243091445",
      account_name: "Unlisted Legacy Page",
      message: "may gusto ako itanong pwede ba?",
    },
  ]);
  assert.deepEqual(emptyWhenAllTargetDeleted, []);

  const payload = buildSavvyFindsRoleReversalWebhookPayload("What are Glennard's AI automation skills?", 1710000000123);
  assert.equal(payload.event, "comment.received");
  assert.equal(payload.accountId, "6ada535d4c608095288e2104");
  assert.equal(payload.comment.id, "122118104811500702_1710000000123");
  assert.equal(payload.comment.parentId, "122118104811500702_1150007564513023");
  assert.equal(payload.comment.author.name, "GlennBot Automations");
  assert.equal(payload.comment.author.id, "61595021080265");
  assert.equal(payload.comment.isOwnAccount, false);
  assert.equal(payload.comment.isOwner, false);

  for (const [plat, label, recId] of [
    ["facebook", "Facebook", "post_ext_dc6a96869a"],
    ["instagram", "Instagram", "post_ext_b10078462e"],
    ["tiktok", "TikTok", "post_ext_19fdfb7f26"],
  ]) {
    const loadingHtml = buildShowcaseCommentLoadingCardHtml(plat);
    assert.ok(loadingHtml.includes(`data-record-id="${recId}"`));
    assert.ok(loadingHtml.includes(`data-loading-state="1"`));
    assert.ok(loadingHtml.includes(`Comments on This Post (Loading...)`));
    assert.ok(loadingHtml.includes(`Loading live comments from ${label}...`));
    assert.ok(loadingHtml.includes(`fa-circle-notch fa-spin`));
    assert.ok(!loadingHtml.includes("No comments on this post yet."));
  }
});

test("SYS-02 Send a DM Idea B (Interactive In-Portfolio Facebook Messenger Client Window + Isolated fb_live_ Session + Real-Time Sync)", () => {
  const sessionIds = generateLiveDmSessionIds("abc1234", 1712345678901);
  assert.ok(sessionIds.sessionConvId.startsWith("fb_live_abc1234_"));
  assert.equal(sessionIds.accountId, "6af0b109818eb5c88d1e87a6");
  assert.equal(sessionIds.sessionConvKey, `6af0b109818eb5c88d1e87a6_${sessionIds.sessionConvId}`);
  assert.ok(!sessionIds.sessionConvId.includes("28783346117962442"));

  const dmCfg = buildDmSplitWorkspaceConfig("facebook", sessionIds.sessionConvId);
  assert.equal(dmCfg.platform, "facebook");
  assert.equal(dmCfg.page_header, "GlennBot Automations");
  assert.equal(
    dmCfg.page_subtitle,
    "Facebook Messenger • 24h Meta Window + Gemini 3.5 Flash Active"
  );
  assert.equal(dmCfg.default_visitor_name, "Portfolio Client");
  assert.equal(dmCfg.visitor_name_placeholder, "Your Name (e.g. Alex)");
  assert.equal(dmCfg.new_blank_chat_label, "🔄 New Blank Chat");
  assert.equal(
    dmCfg.typing_indicator_text,
    "GlennBot Automations is typing via Gemini 3.5 Flash..."
  );
  assert.equal(dmCfg.composer_placeholder, "Write a message to GlennBot Automations...");
  assert.equal(dmCfg.poll_interval_ms, 2500);
  assert.deepEqual(dmCfg.quick_starter_hints, [
    "Hi GlennBot! What automation services do you offer?",
    "How can your Python & AI workflows help my business save time?",
    "Magkano ang rate mo at paano mag-inquire?",
  ]);
  assert.equal(
    dmCfg.upstreamIframeUrl,
    `https://glennbotautomations.onrender.com/?popout_mode=message_thread&platform=facebook&account_id=6af0b109818eb5c88d1e87a6&account_name=GlennBot+Automations&conv_key=${sessionIds.sessionConvKey}&conv_id=${sessionIds.sessionConvId}`
  );
  assert.equal(
    dmCfg.iframeUrl,
    `/glennbot-popout?popout_mode=message_thread&platform=facebook&account_id=6af0b109818eb5c88d1e87a6&account_name=GlennBot+Automations&conv_key=${sessionIds.sessionConvKey}&conv_id=${sessionIds.sessionConvId}`
  );
  assert.equal(
    dmCfg.upstreamThreadPollUrl,
    `https://glennbotautomations.onrender.com/api/messages/${sessionIds.sessionConvId}/thread?account_id=6af0b109818eb5c88d1e87a6&force=false`
  );
  assert.equal(
    dmCfg.threadPollUrl,
    `/api/messages/${sessionIds.sessionConvId}/thread?account_id=6af0b109818eb5c88d1e87a6&force=false`
  );

  const dmPostPayload = buildPortfolioLiveDmPayload(
    sessionIds.sessionConvId,
    "Hi GlennBot! What automation services do you offer?",
    "Alex"
  );
  assert.deepEqual(dmPostPayload, {
    conversation_id: sessionIds.sessionConvId,
    account_id: "6af0b109818eb5c88d1e87a6",
    account_name: "GlennBot Automations",
    platform: "facebook",
    participant_name: "Alex",
    message: "Hi GlennBot! What automation services do you offer?",
  });

  const defaultVisitorPayload = buildPortfolioLiveDmPayload(
    sessionIds.sessionConvId,
    "Magkano ang rate mo at paano mag-inquire?",
    ""
  );
  assert.equal(defaultVisitorPayload.participant_name, "Portfolio Client");

  const msgStyleTag = buildInstantPopoutStyleTag("messages", "message_thread");
  assert.ok(msgStyleTag.includes("#messages-top-filter-bar"));
  assert.ok(msgStyleTag.includes("#messages-left-column"));
  assert.ok(msgStyleTag.includes("#message-detail-panel"));
  assert.ok(msgStyleTag.includes("#view-messages"));

  assert.equal(
    SYS02_DM_SHOWCASE_CONFIG.whatsappUrl,
    "https://wa.me/639175497760"
  );
  assert.equal(SYS02_DM_SHOWCASE_CONFIG.whatsappPhone, "+63 917 549 7760");
  assert.equal(
    SYS02_DM_SHOWCASE_CONFIG.whatsappAccountName,
    "Glennard Tasico (+63 917 549 7760)"
  );
  assert.deepEqual(SYS02_DM_SHOWCASE_CONFIG.chooserOptions, [
    "facebook",
    "instagram",
    "whatsapp",
    "mock_chat",
  ]);
  assert.equal(
    resolveDirectSocialDmTargetUrl("facebook"),
    "https://www.facebook.com/messages/t/1340688402467466"
  );
  assert.equal(
    resolveDirectSocialDmTargetUrl("instagram"),
    "https://www.instagram.com/direct/t/18131808028702166/"
  );
  assert.equal(
    resolveDirectSocialDmTargetUrl("whatsapp"),
    "https://wa.me/639175497760"
  );

  assert.equal(
    SYS02_DM_SHOWCASE_CONFIG.facebook.direct_messenger_url,
    "https://www.facebook.com/messages/t/1340688402467466"
  );
  assert.equal(
    SYS02_DM_SHOWCASE_CONFIG.facebook.direct_instagram_url,
    "https://www.instagram.com/direct/t/18131808028702166/"
  );
  assert.equal(
    SYS02_DM_SHOWCASE_CONFIG.facebook.direct_whatsapp_url,
    "https://wa.me/639175497760"
  );
  assert.equal(SYS02_DM_SHOWCASE_CONFIG.facebook.chooser_options.length, 4);
  assert.deepEqual(SYS02_DM_SHOWCASE_CONFIG.facebook.chooser_options[0], {
    id: "gb-choose-fb-dm-btn",
    title: "Facebook (GlennBot Automations)",
    badge: "Direct Facebook Page Messenger",
    action: "openMaximizedDirectSocialDm('facebook')",
    url: "https://www.facebook.com/messages/t/1340688402467466",
  });
  assert.deepEqual(SYS02_DM_SHOWCASE_CONFIG.facebook.chooser_options[1], {
    id: "gb-choose-ig-dm-btn",
    title: "Instagram (@glennard.tasico.va)",
    badge: "Direct Instagram DM",
    action: "openMaximizedDirectSocialDm('instagram')",
    url: "https://www.instagram.com/direct/t/18131808028702166/",
  });
  assert.deepEqual(SYS02_DM_SHOWCASE_CONFIG.facebook.chooser_options[2], {
    id: "gb-choose-wa-dm-btn",
    title: "WhatsApp",
    subtitle: "Glennard Tasico • +63 917 549 7760",
    badge: "Open Chat ↗",
    action: "openWhatsAppInteractiveDmPopup()",
    url: "https://wa.me/639175497760",
  });
  assert.deepEqual(SYS02_DM_SHOWCASE_CONFIG.facebook.chooser_options[3], {
    id: "gb-choose-mock-chat-dm-btn",
    title: "Mock Chat Test",
    badge: "Interactive Split-Screen Sandbox",
    action: "openDmSplitWorkspace('facebook')",
  });

  const maxFb = computeMaximizedDirectMessengerFeatures(1920, 1080, "facebook");
  assert.equal(
    maxFb.targetUrl,
    "https://www.facebook.com/messages/t/1340688402467466"
  );
  assert.equal(maxFb.windowName, "GlennBotDirectFacebookMessengerFullView");
  assert.equal(
    maxFb.features,
    "width=1920,height=1080,left=0,top=0,screenX=0,screenY=0,resizable=yes,scrollbars=yes,status=yes,toolbar=no,menubar=no,location=yes"
  );

  const maxIg = computeMaximizedDirectMessengerFeatures(1920, 1080, "instagram");
  assert.equal(
    maxIg.targetUrl,
    "https://www.instagram.com/direct/t/18131808028702166/"
  );
  assert.equal(maxIg.windowName, "GlennBotDirectInstagramDmFullView");
  assert.equal(
    maxIg.features,
    "width=1920,height=1080,left=0,top=0,screenX=0,screenY=0,resizable=yes,scrollbars=yes,status=yes,toolbar=no,menubar=no,location=yes"
  );

  const maxWa = computeMaximizedDirectMessengerFeatures(1920, 1080, "whatsapp");
  assert.equal(maxWa.targetUrl, "https://wa.me/639175497760");
  assert.equal(maxWa.windowName, "GlennBotDirectWhatsAppDmFullView");
  assert.equal(
    maxWa.features,
    "width=1920,height=1080,left=0,top=0,screenX=0,screenY=0,resizable=yes,scrollbars=yes,status=yes,toolbar=no,menubar=no,location=yes"
  );

  const waSessionIds = generateLiveDmSessionIds(
    "wa98765",
    1712345678901,
    "6adda70399e7b30829e8859c",
    "whatsapp"
  );
  assert.ok(waSessionIds.sessionConvId.startsWith("wa_live_dm_wa98765_"));
  assert.equal(waSessionIds.accountId, "6adda70399e7b30829e8859c");
  const waSplitCfg = buildDmSplitWorkspaceConfig(
    "whatsapp",
    waSessionIds.sessionConvId
  );
  assert.equal(waSplitCfg.platform, "whatsapp");
  assert.equal(waSplitCfg.page_header, "Glennard Tasico (+63 917 549 7760)");
  assert.equal(waSplitCfg.account_id, "6adda70399e7b30829e8859c");

  const waShortPrefixCfg = buildDmSplitWorkspaceConfig(
    "whatsapp",
    "wa_live_custom123"
  );
  assert.equal(waShortPrefixCfg.sessionConvId, "wa_live_custom123");
});

test("SYS-02 AI Email Chatbot Popup Modal (#gb-email-direct-modal) config, prompt chips, and Gmail/Mailto URL builders", () => {
  assert.equal(SYS02_EMAIL_CHATBOT_CONFIG.modalId, "gb-email-direct-modal");
  assert.equal(SYS02_EMAIL_CHATBOT_CONFIG.targetEmail, "glennard.tasico.va@gmail.com");
  assert.equal(
    SYS02_EMAIL_CHATBOT_CONFIG.headerBadge,
    "LIVE AI EMAIL AUTO-RESPONDER • GEMINI + GOOGLE DRIVE EXCEL SYNC"
  );
  assert.equal(SYS02_EMAIL_CHATBOT_CONFIG.title, "📧 Test My Live AI Email Chatbot");
  assert.equal(SYS02_EMAIL_CHATBOT_CONFIG.promptChips.length, 3);
  assert.deepEqual(SYS02_EMAIL_CHATBOT_CONFIG.promptChips[0], {
    label: "🤖 Ask about AI & n8n Automations",
    subject: "Inquiry: AI & n8n Automation Workflows",
    body: "Hi Glennard! Can you build custom webhooks, n8n workflows, and AI chatbots for my business?",
  });
  assert.deepEqual(SYS02_EMAIL_CHATBOT_CONFIG.promptChips[1], {
    label: "💼 Ask about VA Rates & Availability",
    subject: "Inquiry: Virtual Assistant Services & Availability",
    body: "Hi Glennard! What Virtual Assistant services do you offer and what is your current availability?",
  });
  assert.deepEqual(SYS02_EMAIL_CHATBOT_CONFIG.promptChips[2], {
    label: "🌐 Ask about Web Apps & Dashboards",
    subject: "Inquiry: Custom Web App & CRM Dashboard",
    body: "Hi Glennard! Tell me more about your GlennBot Automations dashboard and custom web app projects.",
  });

  const gmailUrl = buildGmailComposeUrl(
    "Inquiry: Virtual Assistant Services & Availability",
    "Hi Glennard! What Virtual Assistant services do you offer and what is your current availability?"
  );
  assert.equal(
    gmailUrl,
    "https://mail.google.com/mail/?view=cm&fs=1&to=glennard.tasico.va%40gmail.com&su=Inquiry%3A%20Virtual%20Assistant%20Services%20%26%20Availability&body=Hi%20Glennard!%20What%20Virtual%20Assistant%20services%20do%20you%20offer%20and%20what%20is%20your%20current%20availability%3F"
  );

  const mailtoUrl = buildGlennBotMailtoUrl(
    "Inquiry: Custom Web App & CRM Dashboard",
    "Hi Glennard! Tell me more about your GlennBot Automations dashboard and custom web app projects."
  );
  assert.equal(
    mailtoUrl,
    "mailto:glennard.tasico.va@gmail.com?subject=Inquiry%3A%20Custom%20Web%20App%20%26%20CRM%20Dashboard&body=Hi%20Glennard!%20Tell%20me%20more%20about%20your%20GlennBot%20Automations%20dashboard%20and%20custom%20web%20app%20projects."
  );
});

test("SYS-02 Email Hub Dashboard Portfolio Demo Mode locks account to glennard.tasico.va@gmail.com, enforces folder=sent, and hides non-Gmail/non-Sent/OAuth buttons", () => {
  const emailCss = buildInstantPopoutStyleTag("email");
  assert.ok(emailCss.includes("#email-plat-card-microsoft"));
  assert.ok(emailCss.includes("#email-plat-card-imap"));
  assert.ok(emailCss.includes("#btn-show-all-email-platforms"));
  assert.ok(emailCss.includes('#email-top-platform-filter option:not([value="gmail"])'));
  assert.ok(emailCss.includes("#email-folder-btn-inbox"));
  assert.ok(emailCss.includes("#email-folder-btn-drafts"));
  assert.ok(emailCss.includes("#email-folder-btn-spam"));
  assert.ok(emailCss.includes("#email-folder-btn-trash"));
  assert.ok(emailCss.includes("button[onclick*=\"openConnectAccountsModal('gmail')\"]"));
  assert.ok(emailCss.includes('button[onclick*="startEmailOAuthPopup("]'));
  assert.ok(emailCss.includes('button[onclick*="disconnectEmailAccount("]'));

  const filteredAccounts = filterPortfolioEmailAccounts({
    accounts: [
      { id: "ms_1", email_address: "other@outlook.com", platform: "microsoft" },
      { id: "gm_live_99", email_address: "GLENNARD.TASICO.VA@GMAIL.COM", platform: "gmail" },
      { id: "imap_2", email_address: "admin@customdomain.com", platform: "imap" },
    ],
  });
  assert.equal(filteredAccounts.accounts.length, 1);
  assert.equal(filteredAccounts.accounts[0].email_address, "glennard.tasico.va@gmail.com");
  assert.equal(filteredAccounts.accounts[0].platform, "gmail");
  assert.equal(filteredAccounts.active_account_id, "gm_live_99");

  const fallbackAccounts = filterPortfolioEmailAccounts({
    accounts: [{ id: "other_1", email_address: "someone@yahoo.com", platform: "imap" }],
  });
  assert.equal(fallbackAccounts.accounts.length, 1);
  assert.equal(fallbackAccounts.accounts[0].email_address, "glennard.tasico.va@gmail.com");
  assert.equal(fallbackAccounts.active_account_id, "gmail_glennard_tasico_va");

  const rewrittenInboxUrl = enforceEmailSentFolderUrl(
    "/api/email/messages?folder=inbox&page=1"
  );
  assert.equal(
    rewrittenInboxUrl,
    "/api/email/messages?folder=sent&page=1&email_address=glennard.tasico.va%40gmail.com&platform=gmail"
  );
});






