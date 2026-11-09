import test from "node:test";
import assert from "node:assert/strict";
import {
  SYS01_EXPANDED_VIEWS,
  buildGlennBotExpandedUrl,
  buildInstantPopoutStyleTag,
  computeCenteredPopupFeatures,
  filterPortfolioSocialAccounts,
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

test("buildInstantPopoutStyleTag hides homepage chrome and toggles #view-scheduler based on targetTab", () => {
  const queueCss = buildInstantPopoutStyleTag("queue");
  assert.ok(queueCss.includes('<style id="gb-instant-popout-css">'));
  assert.ok(queueCss.includes("#main-dashboard-header"));
  assert.ok(queueCss.includes("#left-nav-sidebar"));
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


