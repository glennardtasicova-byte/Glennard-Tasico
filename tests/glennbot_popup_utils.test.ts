import test from "node:test";
import assert from "node:assert/strict";
import {
  SYS01_EXPANDED_VIEWS,
  SYS01_PROJECT_SPEC,
  buildGlennBotExpandedUrl,
  buildInstantPopoutStyleTag,
  computeCenteredPopupFeatures,
  filterPortfolioSocialAccounts,
  formatInlineMarkdown,
  resolveCalendarProxyIntercept,
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

test("buildInstantPopoutStyleTag hides homepage chrome, hides Composio calendar UI, and toggles #view-scheduler", () => {
  const queueCss = buildInstantPopoutStyleTag("queue");
  assert.ok(queueCss.includes('<style id="gb-instant-popout-css">'));
  assert.ok(queueCss.includes("#main-dashboard-header"));
  assert.ok(queueCss.includes("#left-nav-sidebar"));
  assert.ok(queueCss.includes("#cal-subtab-composio"));
  assert.ok(queueCss.includes("#calendar-composio-toolbar"));
  assert.ok(queueCss.includes("#schedule-meeting-modal"));
  assert.ok(queueCss.includes("#view-scheduler > div:first-child > div:nth-child(2)"));
  assert.ok(queueCss.includes("#connect-accounts-modal"));
  assert.ok(queueCss.includes("#gb-popout-window-bar"));
  assert.ok(queueCss.includes("#view-scheduler:not(.gb-tab-ready)"));
  assert.ok(queueCss.includes("#view-queue"));

  const schedCss = buildInstantPopoutStyleTag("scheduler");
  assert.ok(!schedCss.includes("#view-scheduler:not(.gb-tab-ready)"));
  assert.ok(schedCss.includes("#view-scheduler {"));
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

